const pool = require('../config/database');

// ============================================================
// OBTENER TIENDA ASIGNADA AL CONSULTOR
// ============================================================

const obtenerTiendaConsultor = async (usuarioId) => {
    const query = `
        SELECT
            u.usuario_id,
            u.cod_tienda AS tienda_id,
            t.descripcion AS tienda_descripcion
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."MAE_TIENDA" t
            ON t.tienda_id = u.cod_tienda
        WHERE u.usuario_id = $1
          AND u.estado = 'A'
          AND u.estado_usuario = 'A'
        LIMIT 1
    `;

    const result = await pool.query(query, [usuarioId]);
    return result.rows[0] || null;
};


// ============================================================
// LISTAR RUBROS
// ============================================================

const listarRubrosDashboard = async () => {
    const query = `
        SELECT
            codigo_valor,
            descripcion
        FROM sisoxxo."MAE_LISTA_VALORES"
        WHERE tipo_grupo = 'TIPO_RUBRO'
          AND cod_grupo = '0001'
        ORDER BY codigo_valor
    `;

    const result = await pool.query(query);
    return result.rows;
};


// ============================================================
// LISTAR PROVEEDORES POR RUBRO
// ============================================================

const listarProveedoresDashboard = async (tipoRubro = null) => {
    const query = `
        SELECT
            proveedor_id,
            razon_social,
            tipo_rubro
        FROM sisoxxo."MAE_PROVEEDOR"
        WHERE ($1::varchar IS NULL OR tipo_rubro = $1)
        ORDER BY razon_social
    `;

    const result = await pool.query(query, [tipoRubro]);
    return result.rows;
};


// ============================================================
// LISTAR ESTADOS DE DESPACHO
// ============================================================

const listarEstadosDespachoDashboard = async () => {
    const query = `
        SELECT
            codigo_valor,
            descripcion
        FROM sisoxxo."MAE_LISTA_VALORES"
        WHERE tipo_grupo = 'ESTADO_DESPACHO'
          AND cod_grupo = '0000'
        ORDER BY codigo_valor
    `;

    const result = await pool.query(query);
    return result.rows;
};


// ============================================================
// OBTENER INDICADORES DEL DASHBOARD CONSULTOR
// ============================================================

const obtenerIndicadoresDashboard = async ({
    tiendaId,
    tipoRubro = null,
    proveedorId = null,
    estadoDespacho = null
}) => {
    const query = `
        WITH proveedores_filtrados AS (
            SELECT p.proveedor_id, p.tipo_rubro
            FROM sisoxxo."MAE_PROVEEDOR" p
            WHERE ($2::varchar IS NULL OR p.tipo_rubro = $2)
              AND ($3::integer IS NULL OR p.proveedor_id = $3)
        ),
        despachos_filtrados AS (
            SELECT
                mt.transac_id,
                mt.proveedor_id,
                mt.destino_id,
                mt.estado_despacho,
                mt.fecha_programacion
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND ($4::varchar IS NULL OR mt.estado_despacho = $4)
        ),
        trazabilidad AS (
            SELECT
                COUNT(*) FILTER (
                    WHERE mt.estado_despacho = 'DSP'
                ) AS entregados,
                COUNT(*) FILTER (
                    WHERE mt.estado_despacho = 'PRO'
                ) AS programados
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
        ),
        alertas_pendientes AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho = 'PRO'
              AND mt.fecha_programacion::date
                  < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
        ),
        documentos_vencidos AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MAE_PROVEEDOR" p
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = p.proveedor_id
            WHERE p.f_fin_doc_sanita::date
                      < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
               OR p.f_fin_otro_doc::date
                      < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
               OR p.f_fin_doc_vehi::date
                      < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
        ),
        alerta_lote_faltante AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho = 'DSP'
              AND pf.tipo_rubro IN ('001', '003', '004')
              AND EXISTS (
                  SELECT 1
                  FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                  WHERE d.transac_id = mt.transac_id
                    AND (
                        NULLIF(TRIM(d.codigo_nro_lote::text), '') IS NULL
                        OR d.fecha_lote_venci IS NULL
                    )
              )
        ),
        alerta_temperatura AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho = 'DSP'
              AND pf.tipo_rubro = '002'
              AND EXISTS (
                  SELECT 1
                  FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                  WHERE d.transac_id = mt.transac_id
                    AND (
                        NULLIF(TRIM(d.terminal_origen::text), '') IS NULL
                        OR NULLIF(TRIM(d.temperatura_descarga::text), '') IS NULL
                    )
              )
        )
        SELECT
            COALESCE((
                SELECT SUM(d.pesaje_en_kg)
                FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                INNER JOIN despachos_filtrados df
                    ON df.transac_id = d.transac_id
            ), 0) AS volumen_registrado,

            (SELECT COUNT(*) FROM despachos_filtrados)
                AS entregas_registradas,

            COALESCE((
                SELECT ROUND(
                    entregados::numeric * 100
                    / NULLIF(programados, 0),
                    2
                )
                FROM trazabilidad
            ), 0) AS trazabilidad_completa,

            (SELECT cantidad FROM alertas_pendientes)
                AS alertas_pendientes,

            (SELECT cantidad FROM documentos_vencidos)
                AS documentos_vencidos,

            (SELECT cantidad FROM alerta_lote_faltante)
                AS entregas_lote_faltante,

            (SELECT cantidad FROM alerta_temperatura)
                AS entregas_temperatura_pendiente
    `;

    const values = [
        tiendaId,
        tipoRubro || null,
        proveedorId ? Number(proveedorId) : null,
        estadoDespacho || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    obtenerTiendaConsultor,
    listarRubrosDashboard,
    listarProveedoresDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
};

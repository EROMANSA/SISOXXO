
const pool = require('../config/database');

// ============================================================
// LISTAR TODAS LAS TIENDAS
// ============================================================

const listarTiendasDashboard = async () => {
    const query = `
        SELECT
            tienda_id,
            descripcion
        FROM sisoxxo."MAE_TIENDA"
        ORDER BY tienda_id
    `;

    const result = await pool.query(query);

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
// OBTENER INDICADORES DEL DASHBOARD
// ============================================================


const obtenerIndicadoresDashboard = async ({
    proveedorId,
    tiendaId = null,
    estadoDespacho = null
}) => {
    const query = `
        WITH despachos_filtrados AS (
            SELECT
                mt.transac_id,
                mt.destino_id,
                mt.estado_despacho,
                mt.fecha_programacion
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND (
                    $2::varchar IS NULL
                    OR mt.destino_id::varchar = $2
              )
              AND (
                    $3::varchar IS NULL
                    OR mt.estado_despacho = $3
              )
        ),
        despachos_trazabilidad AS (
            SELECT
                COUNT(*) FILTER (
                    WHERE mt.estado_despacho = 'DSP'
                ) AS despachos_entregados,
                COUNT(*) FILTER (
                    WHERE mt.estado_despacho = 'PRO'
                ) AS despachos_programados
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND (
                    $2::varchar IS NULL
                    OR mt.destino_id::varchar = $2
              )
        ),
        alertas_pendientes AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'PRO'
              AND mt.fecha_programacion::date
                    < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
              AND (
                    $2::varchar IS NULL
                    OR mt.destino_id::varchar = $2
              )
        ),
        alerta_documentos_vencidos AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MAE_PROVEEDOR" p
            WHERE p.proveedor_id = $1
              AND (
                    p.f_fin_doc_sanita::date
                        < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
                    OR p.f_fin_otro_doc::date
                        < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
                    OR p.f_fin_doc_vehi::date
                        < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
              )
        ),
        alerta_lote_faltante AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN sisoxxo."MAE_PROVEEDOR" p
                ON p.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND p.tipo_rubro IN ('001', '003', '004')
              AND (
                    $2::varchar IS NULL
                    OR mt.destino_id::varchar = $2
              )
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
            INNER JOIN sisoxxo."MAE_PROVEEDOR" p
                ON p.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND p.tipo_rubro = '002'
              AND (
                    $2::varchar IS NULL
                    OR mt.destino_id::varchar = $2
              )
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
            COALESCE(
                (
                    SELECT SUM(d.pesaje_en_kg)
                    FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                    INNER JOIN despachos_filtrados df
                        ON df.transac_id = d.transac_id
                ),
                0
            ) AS volumen_registrado,

            (
                SELECT COUNT(*)
                FROM despachos_filtrados
            ) AS entregas_registradas,

            COALESCE(
                (
                    SELECT ROUND(
                        despachos_entregados::numeric * 100
                        / NULLIF(despachos_programados, 0),
                        2
                    )
                    FROM despachos_trazabilidad
                ),
                0
            ) AS trazabilidad_completa,

            (
                SELECT cantidad
                FROM alertas_pendientes
            ) AS alertas_pendientes,

            (
                SELECT cantidad
                FROM alerta_documentos_vencidos
            ) AS documentos_vencidos,

            (
                SELECT cantidad
                FROM alerta_lote_faltante
            ) AS entregas_lote_faltante,

            (
                SELECT cantidad
                FROM alerta_temperatura
            ) AS entregas_temperatura_pendiente
    `;

    const values = [
        proveedorId,
        tiendaId || null,
        estadoDespacho || null
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};





// ============================================================
// EXPORT
// ============================================================

module.exports = {
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
};

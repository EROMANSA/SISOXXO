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
    estadoDespacho = null,
    fechaInicio = null,
    fechaFin = null
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
              AND ($5::date IS NULL OR mt.create_date::date >= $5::date)
              AND ($6::date IS NULL OR mt.create_date::date <= $6::date)
        ),
        lineas_trazabilidad AS (
            SELECT
                d.*,
                pf.tipo_rubro
            FROM sisoxxo."MOV_TRANSAC_DETALLE" d
            INNER JOIN sisoxxo."MOV_TRANSACCIONES" mt
                ON mt.transac_id = d.transac_id
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND ($4::varchar IS NULL OR mt.estado_despacho = $4)
              AND ($5::date IS NULL OR mt.create_date::date >= $5::date)
              AND ($6::date IS NULL OR mt.create_date::date <= $6::date)
        ),
        trazabilidad AS (
            SELECT
                COUNT(*) AS total_lineas,
                COUNT(*) FILTER (
                    WHERE
                        -- Campos comunes obligatorios para todos los rubros
                        NULLIF(BTRIM(producto_especie::text), '') IS NULL
                        OR cantidad IS NULL
                        OR NULLIF(BTRIM(tipo_unid_med::text), '') IS NULL
                        OR pesaje_en_kg IS NULL

                        -- Rubro 001: Carnes y aves
                        OR (
                            tipo_rubro = '001'
                            AND (
                                fecha_beneficio_ini IS NULL
                                OR fecha_beneficio_fin IS NULL
                                OR NULLIF(BTRIM(nro_guia_nota_venta::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 002: Pescados y mariscos
                        OR (
                            tipo_rubro = '002'
                            AND (
                                NULLIF(BTRIM(terminal_origen::text), '') IS NULL
                                OR NULLIF(BTRIM(temperatura_descarga::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 003: Abarrotes, lácteos y embutidos
                        OR (
                            tipo_rubro = '003'
                            AND (
                                NULLIF(BTRIM(registro_sanitario::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 004: Agro y vegetales
                        OR (
                            tipo_rubro = '004'
                            AND (
                                NULLIF(BTRIM(procedencia::text), '') IS NULL
                                OR NULLIF(BTRIM(tipo_despacho::text), '') IS NULL
                                OR fecha_cosecha IS NULL
                            )
                        )
                ) AS total_lineas_incompletas
            FROM lineas_trazabilidad
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
              AND ($5::date IS NULL OR mt.create_date::date >= $5::date)
              AND ($6::date IS NULL OR mt.create_date::date <= $6::date)
        ),
        documentos_vencidos AS (
    SELECT COUNT(*) AS cantidad
    FROM sisoxxo."MAE_PROVEEDOR" p
    INNER JOIN proveedores_filtrados pf
        ON pf.proveedor_id = p.proveedor_id
    WHERE (
           p.f_fin_doc_sanita::date
               < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
        OR p.f_fin_otro_doc::date
               < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
        OR p.f_fin_doc_vehi::date
               < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
    )
    AND EXISTS (
        SELECT 1
        FROM sisoxxo."MOV_TRANSACCIONES" mt_doc
        WHERE mt_doc.proveedor_id = p.proveedor_id
          AND mt_doc.destino_id::varchar = $1
    )
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
                    AND NULLIF(TRIM(d.codigo_nro_lote::text), '') IS NULL
              )
        ),
        alerta_fecha_vencimiento_lote AS (
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
                    AND d.fecha_lote_venci IS NULL
              )
        ),
        alerta_registro_sanitario AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND pf.tipo_rubro = '003'
              AND EXISTS (
                  SELECT 1
                  FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                  WHERE d.transac_id = mt.transac_id
                    AND NULLIF(TRIM(d.registro_sanitario::text), '') IS NULL
              )
        ),
        alerta_procedencia AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = mt.proveedor_id
            WHERE mt.destino_id::varchar = $1
              AND mt.estado_despacho = 'DSP'
              AND pf.tipo_rubro = '004'
              AND EXISTS (
                  SELECT 1
                  FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                  WHERE d.transac_id = mt.transac_id
                    AND NULLIF(TRIM(d.procedencia::text), '') IS NULL
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
        ),
        volumen_por_rubro AS (
            SELECT
                pf.tipo_rubro,
                COALESCE(SUM(d.pesaje_en_kg), 0) AS volumen_kg
            FROM despachos_filtrados df
            INNER JOIN proveedores_filtrados pf
                ON pf.proveedor_id = df.proveedor_id
            INNER JOIN sisoxxo."MOV_TRANSAC_DETALLE" d
                ON d.transac_id = df.transac_id
            GROUP BY pf.tipo_rubro
        ),
        trazabilidad_por_rubro AS (
            SELECT
                tipo_rubro,
                COUNT(*) AS total_lineas,
                COUNT(*) FILTER (
                    WHERE
                        -- Campos comunes obligatorios
                        NULLIF(BTRIM(producto_especie::text), '') IS NULL
                        OR cantidad IS NULL
                        OR NULLIF(BTRIM(tipo_unid_med::text), '') IS NULL
                        OR pesaje_en_kg IS NULL

                        -- Rubro 001: Carnes y aves
                        OR (
                            tipo_rubro = '001'
                            AND (
                                fecha_beneficio_ini IS NULL
                                OR fecha_beneficio_fin IS NULL
                                OR NULLIF(BTRIM(nro_guia_nota_venta::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 002: Pescados y mariscos
                        OR (
                            tipo_rubro = '002'
                            AND (
                                NULLIF(BTRIM(terminal_origen::text), '') IS NULL
                                OR NULLIF(BTRIM(temperatura_descarga::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 003: Abarrotes, lácteos y embutidos
                        OR (
                            tipo_rubro = '003'
                            AND (
                                NULLIF(BTRIM(registro_sanitario::text), '') IS NULL
                                OR NULLIF(BTRIM(codigo_nro_lote::text), '') IS NULL
                                OR fecha_lote_venci IS NULL
                            )
                        )

                        -- Rubro 004: Agro y vegetales
                        OR (
                            tipo_rubro = '004'
                            AND (
                                NULLIF(BTRIM(procedencia::text), '') IS NULL
                                OR NULLIF(BTRIM(tipo_despacho::text), '') IS NULL
                                OR fecha_cosecha IS NULL
                            )
                        )
                ) AS lineas_incompletas
            FROM lineas_trazabilidad
            GROUP BY tipo_rubro
        ),
        rubros_dashboard AS (
            SELECT codigo, descripcion
            FROM (VALUES
                ('001'::varchar, 'Carnes y aves'::varchar),
                ('002'::varchar, 'Pescados y mariscos'::varchar),
                ('003'::varchar, 'Abarrotes, lácteos y embutidos'::varchar),
                ('004'::varchar, 'Agro y vegetales'::varchar)
            ) AS r(codigo, descripcion)
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
                    total_lineas_incompletas::numeric * 100
                    / NULLIF(total_lineas, 0),
                    2
                )
                FROM trazabilidad
            ), 0) AS trazabilidad_completa,

            (
                COALESCE((SELECT cantidad FROM documentos_vencidos), 0)
                + COALESCE((SELECT cantidad FROM alerta_lote_faltante), 0)
                + COALESCE((SELECT cantidad FROM alerta_fecha_vencimiento_lote), 0)
                + COALESCE((SELECT cantidad FROM alerta_registro_sanitario), 0)
                + COALESCE((SELECT cantidad FROM alerta_temperatura), 0)
                + COALESCE((SELECT cantidad FROM alerta_procedencia), 0)
            ) AS alertas_pendientes,

            (SELECT cantidad FROM documentos_vencidos)
                AS documentos_vencidos,

            (SELECT cantidad FROM alerta_lote_faltante)
                AS entregas_lote_faltante,

            (SELECT cantidad FROM alerta_fecha_vencimiento_lote)
                AS entregas_fecha_vencimiento_lote,

            (SELECT cantidad FROM alerta_registro_sanitario)
                AS entregas_registro_sanitario,

            (SELECT cantidad FROM alerta_temperatura)
                AS entregas_temperatura_pendiente,

            (SELECT cantidad FROM alerta_procedencia)
                AS entregas_procedencia,

            COALESCE((
                SELECT json_agg(
                    json_build_object(
                        'tipo_rubro', rd.codigo,
                        'descripcion', rd.descripcion,
                        'volumen_kg', COALESCE(vr.volumen_kg, 0),
                        'trazabilidad_completa',
                            COALESCE(
                                ROUND(
                                    tr.lineas_incompletas::numeric * 100
                                    / NULLIF(tr.total_lineas, 0),
                                    2
                                ),
                                0
                            )
                    )
                    ORDER BY rd.codigo
                )
                FROM rubros_dashboard rd
                LEFT JOIN volumen_por_rubro vr
                    ON vr.tipo_rubro = rd.codigo
                LEFT JOIN trazabilidad_por_rubro tr
                    ON tr.tipo_rubro = rd.codigo
            ), '[]'::json) AS volumen_trazabilidad_por_rubro
    `;

    const values = [
        tiendaId,
        tipoRubro || null,
        proveedorId ? Number(proveedorId) : null,
        estadoDespacho || null,
        fechaInicio || null,
        fechaFin || null
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

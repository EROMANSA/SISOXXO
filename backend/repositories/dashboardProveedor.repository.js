
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
    estadoDespacho = null,
    fechaInicio = null,
    fechaFin = null
}) => {
    const query = `
        WITH proveedor_info AS (
            SELECT
                p.proveedor_id,
                p.tipo_rubro
            FROM sisoxxo."MAE_PROVEEDOR" p
            WHERE p.proveedor_id = $1
        ),
        despachos_filtrados AS (
            SELECT
                mt.transac_id,
                mt.proveedor_id,
                mt.destino_id,
                mt.estado_despacho,
                mt.fecha_programacion
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND ($3::varchar IS NULL OR mt.estado_despacho = $3)
              AND ($4::date IS NULL OR mt.create_date::date >= $4::date)
              AND ($5::date IS NULL OR mt.create_date::date <= $5::date)
        ),
        lineas_trazabilidad AS (
            SELECT
                d.*,
                pi.tipo_rubro
            FROM sisoxxo."MOV_TRANSAC_DETALLE" d
            INNER JOIN sisoxxo."MOV_TRANSACCIONES" mt
                ON mt.transac_id = d.transac_id
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND ($3::varchar IS NULL OR mt.estado_despacho = $3)
              AND ($4::date IS NULL OR mt.create_date::date >= $4::date)
              AND ($5::date IS NULL OR mt.create_date::date <= $5::date)
        ),
        trazabilidad AS (
            SELECT
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
                ) AS total_lineas_incompletas
            FROM lineas_trazabilidad
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
        alertas_pendientes AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'PRO'
              AND mt.fecha_programacion::date
                    < (CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima')::date
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND ($4::date IS NULL OR mt.create_date::date >= $4::date)
              AND ($5::date IS NULL OR mt.create_date::date <= $5::date)
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
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND pi.tipo_rubro IN ('001', '003', '004')
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND EXISTS (
                    SELECT 1
                    FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                    WHERE d.transac_id = mt.transac_id
                      AND NULLIF(BTRIM(d.codigo_nro_lote::text), '') IS NULL
              )
        ),
        alerta_fecha_vencimiento_lote AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND pi.tipo_rubro IN ('001', '003', '004')
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
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
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho IS DISTINCT FROM 'CAN'
              AND pi.tipo_rubro = '003'
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND EXISTS (
                    SELECT 1
                    FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                    WHERE d.transac_id = mt.transac_id
                      AND NULLIF(BTRIM(d.registro_sanitario::text), '') IS NULL
              )
        ),
        alerta_temperatura AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND pi.tipo_rubro = '002'
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND EXISTS (
                    SELECT 1
                    FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                    WHERE d.transac_id = mt.transac_id
                      AND (
                            NULLIF(BTRIM(d.terminal_origen::text), '') IS NULL
                            OR NULLIF(BTRIM(d.temperatura_descarga::text), '') IS NULL
                      )
              )
        ),
        alerta_procedencia AS (
            SELECT COUNT(*) AS cantidad
            FROM sisoxxo."MOV_TRANSACCIONES" mt
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = mt.proveedor_id
            WHERE mt.proveedor_id = $1
              AND mt.estado_despacho = 'DSP'
              AND pi.tipo_rubro = '004'
              AND ($2::varchar IS NULL OR mt.destino_id::varchar = $2)
              AND EXISTS (
                    SELECT 1
                    FROM sisoxxo."MOV_TRANSAC_DETALLE" d
                    WHERE d.transac_id = mt.transac_id
                      AND NULLIF(BTRIM(d.procedencia::text), '') IS NULL
              )
        ),
        volumen_por_rubro AS (
            SELECT
                pi.tipo_rubro,
                COALESCE(SUM(d.pesaje_en_kg), 0) AS volumen_kg
            FROM despachos_filtrados df
            INNER JOIN sisoxxo."MOV_TRANSAC_DETALLE" d
                ON d.transac_id = df.transac_id
            INNER JOIN proveedor_info pi
                ON pi.proveedor_id = df.proveedor_id
            GROUP BY pi.tipo_rubro
        ),
        rubro_proveedor AS (
            SELECT
                pi.tipo_rubro AS codigo,
                CASE pi.tipo_rubro
                    WHEN '001' THEN 'Carnes y aves'
                    WHEN '002' THEN 'Pescados y mariscos'
                    WHEN '003' THEN 'Abarrotes, lácteos y embutidos'
                    WHEN '004' THEN 'Agro y vegetales'
                    ELSE 'Rubro no definido'
                END AS descripcion
            FROM proveedor_info pi
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
                COALESCE((SELECT cantidad FROM alerta_documentos_vencidos), 0)
                + COALESCE((SELECT cantidad FROM alerta_lote_faltante), 0)
                + COALESCE((SELECT cantidad FROM alerta_fecha_vencimiento_lote), 0)
                + COALESCE((SELECT cantidad FROM alerta_registro_sanitario), 0)
                + COALESCE((SELECT cantidad FROM alerta_temperatura), 0)
                + COALESCE((SELECT cantidad FROM alerta_procedencia), 0)
            ) AS alertas_pendientes,

            (SELECT cantidad FROM alerta_documentos_vencidos)
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
                        'tipo_rubro', rp.codigo,
                        'descripcion', rp.descripcion,
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
                )
                FROM rubro_proveedor rp
                LEFT JOIN volumen_por_rubro vr
                    ON vr.tipo_rubro = rp.codigo
                LEFT JOIN trazabilidad_por_rubro tr
                    ON tr.tipo_rubro = rp.codigo
            ), '[]'::json) AS volumen_trazabilidad_por_rubro
    `;

    const values = [
        proveedorId,
        tiendaId || null,
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
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
};

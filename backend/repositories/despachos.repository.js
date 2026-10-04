const pool = require('../config/database');

const listarDespachos = async (proveedorId) => {

    const query = `
        SELECT
            mt.transac_id,

            mt.tipo_transaccion,
            ltt.descripcion AS tipo_transaccion_descripcion,

            mt.proveedor_id,
            p.razon_social AS proveedor_nombre,

            mt.destino_id,
            lto.descripcion AS destino_descripcion,

            mt.fecha_programacion,
            mt.fecha_despacho,
            mt.fecha_cancelacion,

            mt.estado_despacho,
            led.descripcion AS estado_despacho_descripcion,

            mt.observaciones,
            mt.periodo,

            mt.create_date,
            mt.create_by,
            mt.last_update,
            mt.update_by

        FROM sisoxxo."MOV_TRANSACCIONES" mt

        INNER JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = mt.proveedor_id

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" lto
            ON lto.tipo_grupo = 'TIENDAS_OXXO'
            AND lto.cod_grupo = '0006'
            AND lto.codigo_valor = mt.destino_id::varchar

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ltt
            ON ltt.tipo_grupo = 'TIPO_TRANSACCION'
            AND ltt.cod_grupo = '0001'
            AND ltt.codigo_valor = mt.tipo_transaccion

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" led
            ON led.tipo_grupo = 'ESTADO_DESPACHO'
            AND led.cod_grupo = '0000'
            AND led.codigo_valor = mt.estado_despacho

        WHERE mt.proveedor_id = $1

        ORDER BY
            mt.transac_id DESC
    `;

    const result = await pool.query(query, [proveedorId]);

    return result.rows;
};

const crearDespacho = async ({
    proveedorId,
    tipoRubro,
    destinoId,
    fechaProgramacion,
    observaciones,
    usuarioId
}) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /*
         * Bloqueo transaccional para garantizar
         * la generación segura del correlativo.
         */
        await client.query(`
            SELECT pg_advisory_xact_lock(74839201)
        `);

        /*
         * Obtener siguiente transac_id
         */
        const resultCorrelativo = await client.query(`
            SELECT COALESCE(MAX(transac_id), 0) + 1 AS transac_id
            FROM sisoxxo."MOV_TRANSACCIONES"
        `);

        const transacId =
            resultCorrelativo.rows[0].transac_id;

        /*
         * Crear cabecera del despacho
         *
         * Valores iniciales definidos por negocio:
         * tipo_transaccion = PRG
         * estado_despacho = PRO
         * periodo         = NULL
         */
        const query = `
            INSERT INTO sisoxxo."MOV_TRANSACCIONES" (
    transac_id,
    proveedor_id,
    destino_id,
    tipo_transaccion,
    fecha_programacion,
    estado_despacho,
    observaciones,
    periodo,
    create_by
)
VALUES (
    $1,
    $2,
    $3,
    'PRG',
    $4,
    'PRO',
    $5,
    NULL,
    $6
)
            RETURNING
                transac_id,
                proveedor_id,
                destino_id,                
                tipo_transaccion,
                fecha_programacion,
                estado_despacho,
                fecha_despacho,
                fecha_cancelacion,
                observaciones,
                periodo,
                create_date,
                create_by,
                last_update,
                update_by
        `;

        const result = await client.query(query, [
            transacId,
            proveedorId,
            destinoId,            
            fechaProgramacion,
            observaciones,
            usuarioId
        ]);

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {

        await client.query('ROLLBACK');

        throw error;

    } finally {

        client.release();

    }
};

const obtenerDespachoPorId = async (transacId, proveedorId) => {

    // ============================================================
    // CABECERA DEL DESPACHO
    // ============================================================

    const queryCabecera = `
        SELECT
            mt.transac_id,
            mt.proveedor_id,

            p.razon_social AS proveedor_nombre,
            p.tipo_rubro AS tipo_rubro,

            ltr.descripcion AS tipo_rubro_descripcion,

            mt.destino_id,
            lto.descripcion AS destino_descripcion,

            mt.tipo_transaccion,
            ltt.descripcion AS tipo_transaccion_descripcion,

            mt.fecha_programacion,

            mt.estado_despacho,
            led.descripcion AS estado_despacho_descripcion,

            mt.fecha_despacho,
            mt.fecha_cancelacion,

            mt.observaciones,

            mt.periodo,

            mt.create_date,
            mt.create_by,
            mt.last_update,
            mt.update_by

        FROM sisoxxo."MOV_TRANSACCIONES" mt

        INNER JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = mt.proveedor_id

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ltr
            ON ltr.tipo_grupo = 'TIPO_RUBRO'
            AND ltr.cod_grupo = '0001'
            AND ltr.codigo_valor = p.tipo_rubro

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" lto
            ON lto.tipo_grupo = 'TIENDAS_OXXO'
            AND lto.cod_grupo = '0006'
            AND lto.codigo_valor = mt.destino_id::varchar

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ltt
            ON ltt.tipo_grupo = 'TIPO_TRANSACCION'
            AND ltt.cod_grupo = '0001'
            AND ltt.codigo_valor = mt.tipo_transaccion

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" led
            ON led.tipo_grupo = 'ESTADO_DESPACHO'
            AND led.cod_grupo = '0000'
            AND led.codigo_valor = mt.estado_despacho

        WHERE mt.transac_id = $1
          AND mt.proveedor_id = $2
    `;

    const resultCabecera = await pool.query(
        queryCabecera,
        [transacId, proveedorId]
    );

    if (resultCabecera.rows.length === 0) {
        return null;
    }

    // ============================================================
    // DETALLE DEL DESPACHO
    // ============================================================

    const queryDetalle = `
        SELECT
            d.transac_id,
            d.linea_id,

            d.fecha_despacho,
            d.producto_especie,
            d.cantidad,

            d.tipo_unid_med,
            lum.descripcion AS unidad_medida_descripcion,

            d.fecha_beneficio_ini,
            d.fecha_beneficio_fin,

            d.nro_guia_nota_venta,

            d.terminal_origen,
            d.temperatura_descarga,

            d.registro_sanitario,
            d.fecha_registro_ini AS fecha_emis_registro,
            d.fecha_registro_fin AS fecha_venci_registro,

            d.procedencia,

            d.tipo_despacho,
            ltd.descripcion AS tipo_despacho_descripcion,

            d.fecha_cosecha,
            d.fecha_ingreso,

            d.codigo_nro_lote AS codigo_lote,
            d.fecha_lote_venci AS fecha_vencimiento_lote,

            d.observaciones,

            d.estado_despacho,
            ledl.descripcion AS estado_despacho_descripcion,

            d.create_date,
            d.create_by,
            d.last_update,
            d.update_by

        FROM sisoxxo."MOV_TRANSAC_DETALLE" d

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" lum
            ON lum.tipo_grupo = 'UNIDAD_MEDIDA'
            AND lum.cod_grupo = '0003'
            AND lum.codigo_valor = d.tipo_unid_med

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ltd
            ON ltd.tipo_grupo = 'TIPO_DESPACHO'
            AND ltd.cod_grupo = '0001'
            AND ltd.codigo_valor = d.tipo_despacho

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ledl
            ON ledl.tipo_grupo = 'ESTADO_DESPACHO_LINEA'
            AND ledl.cod_grupo = '0000'
            AND ledl.codigo_valor = d.estado_despacho

        WHERE d.transac_id = $1

        ORDER BY
            d.linea_id
    `;

    const resultDetalle = await pool.query(
        queryDetalle,
        [transacId]
    );

    return {
        cabecera: resultCabecera.rows[0],
        detalles: resultDetalle.rows
    };
};





module.exports = {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho
};

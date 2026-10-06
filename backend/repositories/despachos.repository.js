const pool = require('../config/database');


// ============================================================
// LISTAR DESPACHOS
// ============================================================

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


// ============================================================
// CREAR DESPACHO - CABECERA + DETALLE
// ============================================================
const crearDespacho = async ({
    proveedorId,
    destinoId,
    fechaProgramacion,
    observaciones,
    detalles,
    usuarioId
}) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        /*
         * ========================================================
         * BLOQUEO TRANSACCIONAL
         * ========================================================
         *
         * Garantiza la generación segura del transac_id
         * cuando existen operaciones concurrentes.
         */
        await client.query(`
            SELECT pg_advisory_xact_lock(74839201)
        `);


        /*
         * ========================================================
         * OBTENER SIGUIENTE TRANSAC_ID
         * ========================================================
         */
        const resultCorrelativo = await client.query(`
            SELECT
                COALESCE(MAX(transac_id), 0) + 1 AS transac_id
            FROM sisoxxo."MOV_TRANSACCIONES"
        `);

        const transacId =
            resultCorrelativo.rows[0].transac_id;


        /*
         * ========================================================
         * CREAR CABECERA DEL DESPACHO
         * ========================================================
         *
         * Valores iniciales definidos por negocio:
         *
         * tipo_transaccion = PRG
         * estado_despacho = PRO
         * periodo         = NULL
         */
        const queryCabecera = `
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

        const resultCabecera = await client.query(
            queryCabecera,
            [
                transacId,
                proveedorId,
                destinoId,
                fechaProgramacion,
                observaciones,
                usuarioId
            ]
        );


        /*
         * ========================================================
         * CREAR DETALLE DEL DESPACHO
         * ========================================================
         *
         * linea_id es generado por el backend.
         *
         * No se utiliza el linea_id enviado desde el frontend,
         * ya que forma parte de la clave primaria compuesta:
         *
         * (transac_id, linea_id)
         */
        const queryDetalle = `
            INSERT INTO sisoxxo."MOV_TRANSAC_DETALLE" (
                transac_id,
                linea_id,
                fecha_despacho,
                producto_especie,
                cantidad,
                tipo_unid_med,
                fecha_beneficio_ini,
                fecha_beneficio_fin,
                nro_guia_nota_venta,
                terminal_origen,
                temperatura_descarga,
                registro_sanitario,
                fecha_registro_ini,
                fecha_registro_fin,
                procedencia,
                tipo_despacho,
                fecha_cosecha,
                fecha_ingreso,
                codigo_nro_lote,
                fecha_lote_venci,
                observaciones,
                estado_despacho,
                create_by
            )
            VALUES (
                $1,
                $2,
                NULL,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15,
                $16,
                $17,
                $18,
                $19,
                $20,
                'PRO',
                $21
            )
            RETURNING
                transac_id,
                linea_id,
                fecha_despacho,
                producto_especie,
                cantidad,
                tipo_unid_med,
                fecha_beneficio_ini,
                fecha_beneficio_fin,
                nro_guia_nota_venta,
                terminal_origen,
                temperatura_descarga,
                registro_sanitario,
                fecha_registro_ini,
                fecha_registro_fin,
                procedencia,
                tipo_despacho,
                fecha_cosecha,
                fecha_ingreso,
                codigo_nro_lote,
                fecha_lote_venci,
                observaciones,
                estado_despacho,
                create_by,
                create_date,
                last_update,
                update_by
        `;


        const detallesCreados = [];


        /*
         * Si existen líneas, se insertan una por una
         * dentro de la misma transacción.
         */
        for (let i = 0; i < detalles.length; i++) {

            const detalle = detalles[i];

            const resultDetalle = await client.query(
                queryDetalle,
                [
                    transacId,
                    i + 1,

                    detalle.producto_especie || null,
                    detalle.cantidad !== ''
                        && detalle.cantidad !== undefined
                        && detalle.cantidad !== null
                        ? Number(detalle.cantidad)
                        : null,

                    detalle.tipo_unid_med || null,

                    detalle.fecha_beneficio_ini || null,
                    detalle.fecha_beneficio_fin || null,

                    detalle.nro_guia_nota_venta || null,

                    detalle.terminal_origen || null,
                    detalle.temperatura_descarga || null,

                    detalle.registro_sanitario || null,

                    detalle.fecha_registro_ini || null,
                    detalle.fecha_registro_fin || null,

                    detalle.procedencia || null,

                    detalle.tipo_despacho || null,

                    detalle.fecha_cosecha || null,
                    detalle.fecha_ingreso || null,

                    detalle.codigo_nro_lote || null,
                    detalle.fecha_lote_venci || null,

                    detalle.observaciones || null,

                    usuarioId
                ]
            );

            detallesCreados.push(
                resultDetalle.rows[0]
            );

        }


        /*
         * ========================================================
         * CONFIRMAR TRANSACCIÓN
         * ========================================================
         *
         * Si llegamos hasta aquí:
         *
         * - Cabecera creada correctamente
         * - Todas las líneas creadas correctamente
         *
         * Por lo tanto se confirma toda la operación.
         */
        await client.query('COMMIT');


        return {
            cabecera: resultCabecera.rows[0],
            detalles: detallesCreados
        };


    } catch (error) {

        /*
         * ========================================================
         * ROLLBACK
         * ========================================================
         *
         * Si falla la cabecera o cualquiera de las líneas,
         * se revierte TODA la operación.
         */
        await client.query('ROLLBACK');

        throw error;


    } finally {

        client.release();

    }
};

const actualizarDespacho = async ({
    transacId,
    proveedorId,
    destinoId,
    fechaProgramacion,
    observaciones,
    detalles,
    usuarioId
}) => {

    const client = await pool.connect();

    try {

        // ========================================================
        // INICIAR TRANSACCIÓN
        // ========================================================

        await client.query('BEGIN');


        // ========================================================
        // BLOQUEO TRANSACCIONAL
        // ========================================================

        await client.query(`
            SELECT pg_advisory_xact_lock(74839201)
        `);


        // ========================================================
        // VERIFICAR QUE EL DESPACHO PERTENECE AL PROVEEDOR
        // ========================================================

        const resultCabecera =
            await client.query(
                `
                    SELECT
                        transac_id
                    FROM sisoxxo."MOV_TRANSACCIONES"
                    WHERE transac_id = $1
                      AND proveedor_id = $2
                    FOR UPDATE
                `,
                [
                    transacId,
                    proveedorId
                ]
            );


        if (
            resultCabecera.rows.length === 0
        ) {

            throw new Error(
                'DESPACHO_NO_ENCONTRADO'
            );

        }


        // ========================================================
        // ACTUALIZAR CABECERA
        // ========================================================

        await client.query(
            `
                UPDATE sisoxxo."MOV_TRANSACCIONES"
                SET
                    destino_id = $1,
                    fecha_programacion = $2,
                    observaciones = $3,
                    last_update = CURRENT_TIMESTAMP,
                    update_by = $4
                WHERE transac_id = $5
                  AND proveedor_id = $6
            `,
            [
                destinoId,
                fechaProgramacion,
                observaciones,
                usuarioId,
                transacId,
                proveedorId
            ]
        );


        // ========================================================
        // OBTENER LÍNEAS EXISTENTES
        // ========================================================

        const resultLineasExistentes =
            await client.query(
                `
                    SELECT
                        linea_id
                    FROM sisoxxo."MOV_TRANSAC_DETALLE"
                    WHERE transac_id = $1
                    ORDER BY linea_id
                `,
                [transacId]
            );


        const lineasExistentes =
            resultLineasExistentes.rows.map(
                (row) => Number(row.linea_id)
            );


        // ========================================================
        // IDENTIFICAR LÍNEAS RECIBIDAS DESDE FRONTEND
        // ========================================================

        const lineasRecibidas =
            detalles
                .filter(
                    (detalle) =>
                        detalle.linea_id !== null &&
                        detalle.linea_id !== undefined
                )
                .map(
                    (detalle) =>
                        Number(detalle.linea_id)
                );


        // ========================================================
        // VALIDAR QUE LAS LÍNEAS EXISTENTES PERTENEZCAN
        // AL DESPACHO
        // ========================================================

        for (
            const lineaId of lineasRecibidas
        ) {

            if (
                !lineasExistentes.includes(
                    lineaId
                )
            ) {

                throw new Error(
                    'LINEA_NO_ENCONTRADA'
                );

            }

        }


        // ========================================================
        // ELIMINAR LÍNEAS QUE YA NO VIENEN EN EL FRONTEND
        // ========================================================

        await client.query(
            `
                DELETE FROM sisoxxo."MOV_TRANSAC_DETALLE"
                WHERE transac_id = $1
                  AND NOT (
                      linea_id = ANY($2::integer[])
                  )
            `,
            [
                transacId,
                lineasRecibidas
            ]
        );


        // ========================================================
        // DETERMINAR SIGUIENTE LINEA_ID
        // ========================================================

        const resultMaxLinea =
            await client.query(
                `
                    SELECT
                        COALESCE(
                            MAX(linea_id),
                            0
                        ) AS max_linea_id
                    FROM sisoxxo."MOV_TRANSAC_DETALLE"
                    WHERE transac_id = $1
                `,
                [transacId]
            );


        let siguienteLineaId =
            Number(
                resultMaxLinea.rows[0].max_linea_id
            ) + 1;


        // ========================================================
        // PROCESAR DETALLES
        // ========================================================

        for (
            const detalle of detalles
        ) {

            let lineaId =
                detalle.linea_id;


            // ====================================================
            // LÍNEA NUEVA
            // ====================================================

            if (
                lineaId === null ||
                lineaId === undefined
            ) {

                lineaId =
                    siguienteLineaId;

                siguienteLineaId++;

            }


            // ====================================================
            // VERIFICAR SI LA LÍNEA YA EXISTE
            // ====================================================

            const resultLinea =
                await client.query(
                    `
                        SELECT
                            linea_id
                        FROM sisoxxo."MOV_TRANSAC_DETALLE"
                        WHERE transac_id = $1
                          AND linea_id = $2
                    `,
                    [
                        transacId,
                        lineaId
                    ]
                );


            // ====================================================
            // ACTUALIZAR LÍNEA EXISTENTE
            // ====================================================

            if (
                resultLinea.rows.length > 0
            ) {

                await client.query(
                    `
                        UPDATE sisoxxo."MOV_TRANSAC_DETALLE"
                        SET
                            producto_especie = $1,
                            cantidad = $2,
                            tipo_unid_med = $3,
                            terminal_origen = $4,
                            temperatura_descarga = $5,
                            fecha_beneficio_ini = $6,
                            fecha_beneficio_fin = $7,
                            nro_guia_nota_venta = $8,
                            registro_sanitario = $9,
                            fecha_registro_ini = $10,
                            fecha_registro_fin = $11,
                            procedencia = $12,
                            tipo_despacho = $13,
                            fecha_cosecha = $14,
                            fecha_ingreso = $15,
                            codigo_nro_lote = $16,
                            fecha_lote_venci = $17,
                            observaciones = $18,
                            last_update = CURRENT_TIMESTAMP,
                            update_by = $19
                        WHERE transac_id = $20
                          AND linea_id = $21
                    `,
                    [
                        detalle.producto_especie,
                        detalle.cantidad,
                        detalle.tipo_unid_med,
                        detalle.terminal_origen,
                        detalle.temperatura_descarga,
                        detalle.fecha_beneficio_ini,
                        detalle.fecha_beneficio_fin,
                        detalle.nro_guia_nota_venta,
                        detalle.registro_sanitario,
                        detalle.fecha_registro_ini,
                        detalle.fecha_registro_fin,
                        detalle.procedencia,
                        detalle.tipo_despacho,
                        detalle.fecha_cosecha,
                        detalle.fecha_ingreso,
                        detalle.codigo_nro_lote,
                        detalle.fecha_lote_venci,
                        detalle.observaciones,
                        usuarioId,
                        transacId,
                        lineaId
                    ]
                );

            }

            // ====================================================
            // INSERTAR LÍNEA NUEVA
            // ====================================================

            else {

                await client.query(
                    `
                        INSERT INTO sisoxxo."MOV_TRANSAC_DETALLE" (
                            transac_id,
                            linea_id,
                            fecha_despacho,
                            producto_especie,
                            cantidad,
                            tipo_unid_med,
                            fecha_beneficio_ini,
                            fecha_beneficio_fin,
                            nro_guia_nota_venta,
                            terminal_origen,
                            temperatura_descarga,
                            registro_sanitario,
                            fecha_registro_ini,
                            fecha_registro_fin,
                            procedencia,
                            tipo_despacho,
                            fecha_cosecha,
                            fecha_ingreso,
                            codigo_nro_lote,
                            fecha_lote_venci,
                            observaciones,
                            estado_despacho,
                            create_by
                        )
                        VALUES (
                            $1,
                            $2,
                            NULL,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            $12,
                            $13,
                            $14,
                            $15,
                            $16,
                            $17,
                            $18,
                            $19,
                            $20,
                            'PRO',
                            $21
                        )
                    `,
                    [
                        transacId,
                        lineaId,
                        detalle.producto_especie,
                        detalle.cantidad,
                        detalle.tipo_unid_med,
                        detalle.fecha_beneficio_ini,
                        detalle.fecha_beneficio_fin,
                        detalle.nro_guia_nota_venta,
                        detalle.terminal_origen,
                        detalle.temperatura_descarga,
                        detalle.registro_sanitario,
                        detalle.fecha_registro_ini,
                        detalle.fecha_registro_fin,
                        detalle.procedencia,
                        detalle.tipo_despacho,
                        detalle.fecha_cosecha,
                        detalle.fecha_ingreso,
                        detalle.codigo_nro_lote,
                        detalle.fecha_lote_venci,
                        detalle.observaciones,
                        usuarioId
                    ]
                );

            }

        }


        // ========================================================
        // COMMIT
        // ========================================================

        await client.query('COMMIT');


        // ========================================================
        // RETORNAR DESPACHO ACTUALIZADO
        // ========================================================

        return {
            transac_id: transacId
        };


    } catch (error) {

        await client.query('ROLLBACK');

        throw error;

    } finally {

        client.release();

    }

};

// ============================================================
// OBTENER DESPACHO POR ID
// ============================================================

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


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho,
    actualizarDespacho
};
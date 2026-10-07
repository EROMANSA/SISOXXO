const {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho,
    actualizarDespacho
} = require('../repositories/despachos.repository');


// ============================================================
// LISTAR DESPACHOS
// ============================================================

const listarDespachosService = async (proveedorId) => {

    return await listarDespachos(proveedorId);

};


// ============================================================
// OBTENER DESPACHO POR ID
// ============================================================

const obtenerDespachoPorIdService = async (
    transacId,
    proveedorId
) => {

    const idTransaccion = Number(transacId);
    const idProveedor = Number(proveedorId);


    // ========================================================
    // VALIDAR TRANSACCIÓN
    // ========================================================

    if (
        !Number.isInteger(idTransaccion) ||
        idTransaccion <= 0
    ) {

        const error = new Error(
            'Identificador de transacción no válido'
        );

        error.codigo = 'ID_TRANSACCION_INVALIDO';

        throw error;
    }


    // ========================================================
    // VALIDAR PROVEEDOR
    // ========================================================

    if (
        !Number.isInteger(idProveedor) ||
        idProveedor <= 0
    ) {

        const error = new Error(
            'Identificador de proveedor no válido'
        );

        error.codigo = 'ID_PROVEEDOR_INVALIDO';

        throw error;
    }


    const despacho = await obtenerDespachoPorId(
        idTransaccion,
        idProveedor
    );


    if (!despacho) {

        const error = new Error(
            'Despacho no encontrado'
        );

        error.codigo = 'DESPACHO_NO_ENCONTRADO';

        throw error;
    }


    return despacho;

};


// ============================================================
// CREAR DESPACHO
// CABECERA + DETALLE
// ============================================================

const crearDespachoService = async ({
    proveedorId,
    destinoId,
    fechaProgramacion,
    observaciones,
    detalles,
    usuarioId
}) => {


    // ========================================================
    // VALIDAR PROVEEDOR
    // ========================================================

    if (
        !Number.isInteger(Number(proveedorId)) ||
        Number(proveedorId) <= 0
    ) {

        throw new Error('PROVEEDOR_INVALIDO');

    }


    // ========================================================
    // VALIDAR DESTINO
    // ========================================================

    if (
        !destinoId ||
        String(destinoId).trim() === ''
    ) {

        throw new Error('DESTINO_REQUERIDO');

    }


    // ========================================================
    // VALIDAR USUARIO
    // ========================================================

    if (
        !Number.isInteger(Number(usuarioId)) ||
        Number(usuarioId) <= 0
    ) {

        throw new Error('USUARIO_INVALIDO');

    }


    // ========================================================
    // VALIDAR DETALLE
    // ========================================================

    if (
        !Array.isArray(detalles) ||
        detalles.length === 0
    ) {

        throw new Error('DETALLES_REQUERIDOS');

    }


    // ========================================================
    // VALIDAR CADA LÍNEA
    // ========================================================

    for (const detalle of detalles) {

        if (
            !detalle ||
            typeof detalle !== 'object' ||
            Array.isArray(detalle)
        ) {

            throw new Error('DETALLE_INVALIDO');

        }


        if (
            detalle.cantidad !== undefined &&
            detalle.cantidad !== null &&
            detalle.cantidad !== ''
        ) {

            const cantidad =
                Number(detalle.cantidad);


            if (
                !Number.isInteger(cantidad) ||
                cantidad < 0
            ) {

                throw new Error('CANTIDAD_INVALIDA');

            }

        }

        if (
    detalle.pesaje_en_kg !== undefined &&
    detalle.pesaje_en_kg !== null &&
    detalle.pesaje_en_kg !== ''
) {

    const pesajeEnKg =
        Number(detalle.pesaje_en_kg);

    if (
        !Number.isFinite(pesajeEnKg) ||
        pesajeEnKg < 0
    ) {

        throw new Error('PESAJE_EN_KG_INVALIDO');

    }

}    



    }


    // ========================================================
    // NORMALIZAR DETALLES
    // ========================================================

    const detallesNormalizados =
        detalles.map((detalle) => {

            return {

                producto_especie:
                    detalle.producto_especie
                        ? String(
                            detalle.producto_especie
                        ).trim()
                        : null,

                cantidad:
                    detalle.cantidad !== undefined &&
                    detalle.cantidad !== null &&
                    detalle.cantidad !== ''
                        ? Number(
                            detalle.cantidad
                        )
                        : null,

                tipo_unid_med:
                    detalle.tipo_unid_med
                        ? String(
                            detalle.tipo_unid_med
                        ).trim()
                        : null,

                pesaje_en_kg:
    detalle.pesaje_en_kg !== undefined &&
    detalle.pesaje_en_kg !== null &&
    detalle.pesaje_en_kg !== ''
        ? Number(
            detalle.pesaje_en_kg
        )
        : null,        

                terminal_origen:
                    detalle.terminal_origen
                        ? String(
                            detalle.terminal_origen
                        ).trim()
                        : null,

                temperatura_descarga:
                    detalle.temperatura_descarga
                        ? String(
                            detalle.temperatura_descarga
                        ).trim()
                        : null,

                fecha_beneficio_ini:
                    detalle.fecha_beneficio_ini
                        || null,

                fecha_beneficio_fin:
                    detalle.fecha_beneficio_fin
                        || null,

                nro_guia_nota_venta:
                    detalle.nro_guia_nota_venta
                        ? String(
                            detalle.nro_guia_nota_venta
                        ).trim()
                        : null,

                registro_sanitario:
                    detalle.registro_sanitario
                        ? String(
                            detalle.registro_sanitario
                        ).trim()
                        : null,

                fecha_registro_ini:
                    detalle.fecha_registro_ini
                        || null,

                fecha_registro_fin:
                    detalle.fecha_registro_fin
                        || null,

                procedencia:
                    detalle.procedencia
                        ? String(
                            detalle.procedencia
                        ).trim()
                        : null,

                tipo_despacho:
                    detalle.tipo_despacho
                        ? String(
                            detalle.tipo_despacho
                        ).trim()
                        : null,

                fecha_cosecha:
                    detalle.fecha_cosecha
                        || null,

                fecha_ingreso:
                    detalle.fecha_ingreso
                        || null,

                codigo_nro_lote:
                    detalle.codigo_nro_lote
                        ? String(
                            detalle.codigo_nro_lote
                        ).trim()
                        : null,

                fecha_lote_venci:
                    detalle.fecha_lote_venci
                        || null,

                observaciones:
                    detalle.observaciones
                        ? String(
                            detalle.observaciones
                        ).trim()
                        : null

            };

        });


    // ========================================================
    // CREAR EN REPOSITORY
    // ========================================================

    return await crearDespacho({

        proveedorId:
            Number(proveedorId),

        destinoId:
            String(destinoId).trim(),

        fechaProgramacion:
            fechaProgramacion || null,

        observaciones:
            observaciones
                ? String(observaciones).trim()
                : null,

        detalles:
            detallesNormalizados,

        usuarioId:
            Number(usuarioId)

    });

};


// ============================================================
// ACTUALIZAR DESPACHO
// CABECERA + DETALLE
// ============================================================

const actualizarDespachoService = async ({
    transacId,
    proveedorId,
    destinoId,
    fechaProgramacion,
    estadoDespacho,
    fechaDespacho,
    fechaCancelacion,
    observaciones,
    detalles,
    usuarioId
}) => {


    // ========================================================
    // VALIDAR TRANSACCIÓN
    // ========================================================

    const idTransaccion = Number(transacId);


    if (
        !Number.isInteger(idTransaccion) ||
        idTransaccion <= 0
    ) {

        throw new Error('ID_TRANSACCION_INVALIDO');

    }


    // ========================================================
    // VALIDAR PROVEEDOR
    // ========================================================

    if (
        !Number.isInteger(Number(proveedorId)) ||
        Number(proveedorId) <= 0
    ) {

        throw new Error('PROVEEDOR_INVALIDO');

    }


    // ========================================================
    // VALIDAR DESTINO
    // ========================================================

    if (
        !destinoId ||
        String(destinoId).trim() === ''
    ) {

        throw new Error('DESTINO_REQUERIDO');

    }


    // ========================================================
    // VALIDAR USUARIO
    // ========================================================

    if (
        !Number.isInteger(Number(usuarioId)) ||
        Number(usuarioId) <= 0
    ) {

        throw new Error('USUARIO_INVALIDO');

    }


    // ========================================================
    // VALIDAR DETALLE
    // ========================================================

    if (
        !Array.isArray(detalles) ||
        detalles.length === 0
    ) {

        throw new Error('DETALLES_REQUERIDOS');

    }


    // ========================================================
    // VALIDAR CADA LÍNEA
    // ========================================================

    for (const detalle of detalles) {

        if (
            !detalle ||
            typeof detalle !== 'object' ||
            Array.isArray(detalle)
        ) {

            throw new Error('DETALLE_INVALIDO');

        }


        // ----------------------------------------------------
        // Validar cantidad
        // ----------------------------------------------------

        if (
            detalle.cantidad !== undefined &&
            detalle.cantidad !== null &&
            detalle.cantidad !== ''
        ) {

            const cantidad =
                Number(detalle.cantidad);


            if (
                !Number.isInteger(cantidad) ||
                cantidad < 0
            ) {

                throw new Error('CANTIDAD_INVALIDA');

            }

        }

        if (
    detalle.pesaje_en_kg !== undefined &&
    detalle.pesaje_en_kg !== null &&
    detalle.pesaje_en_kg !== ''
) {

    const pesajeEnKg =
        Number(detalle.pesaje_en_kg);

    if (
        !Number.isFinite(pesajeEnKg) ||
        pesajeEnKg < 0
    ) {

        throw new Error('PESAJE_EN_KG_INVALIDO');

    }

}


        // ----------------------------------------------------
        // Validar linea_id
        // ----------------------------------------------------

        if (
            detalle.linea_id !== undefined &&
            detalle.linea_id !== null &&
            detalle.linea_id !== ''
        ) {

            const lineaId =
                Number(detalle.linea_id);


            if (
                !Number.isInteger(lineaId) ||
                lineaId <= 0
            ) {

                throw new Error('LINEA_INVALIDA');

            }

        }

    }


    // ========================================================
    // NORMALIZAR DETALLES
    // ========================================================

    const detallesNormalizados =
        detalles.map((detalle) => {

            return {

                linea_id:
                    detalle.linea_id !== undefined &&
                    detalle.linea_id !== null &&
                    detalle.linea_id !== ''
                        ? Number(
                            detalle.linea_id
                        )
                        : null,

                producto_especie:
                    detalle.producto_especie
                        ? String(
                            detalle.producto_especie
                        ).trim()
                        : null,

                cantidad:
                    detalle.cantidad !== undefined &&
                    detalle.cantidad !== null &&
                    detalle.cantidad !== ''
                        ? Number(
                            detalle.cantidad
                        )
                        : null,

                tipo_unid_med:
                    detalle.tipo_unid_med
                        ? String(
                            detalle.tipo_unid_med
                        ).trim()
                        : null,

                pesaje_en_kg:
    detalle.pesaje_en_kg !== undefined &&
    detalle.pesaje_en_kg !== null &&
    detalle.pesaje_en_kg !== ''
        ? Number(
            detalle.pesaje_en_kg
        )
        : null,        

                terminal_origen:
                    detalle.terminal_origen
                        ? String(
                            detalle.terminal_origen
                        ).trim()
                        : null,

                temperatura_descarga:
                    detalle.temperatura_descarga
                        ? String(
                            detalle.temperatura_descarga
                        ).trim()
                        : null,

                fecha_beneficio_ini:
                    detalle.fecha_beneficio_ini
                        || null,

                fecha_beneficio_fin:
                    detalle.fecha_beneficio_fin
                        || null,

                nro_guia_nota_venta:
                    detalle.nro_guia_nota_venta
                        ? String(
                            detalle.nro_guia_nota_venta
                        ).trim()
                        : null,

                registro_sanitario:
                    detalle.registro_sanitario
                        ? String(
                            detalle.registro_sanitario
                        ).trim()
                        : null,

                fecha_registro_ini:
                    detalle.fecha_registro_ini
                        || null,

                fecha_registro_fin:
                    detalle.fecha_registro_fin
                        || null,

                procedencia:
                    detalle.procedencia
                        ? String(
                            detalle.procedencia
                        ).trim()
                        : null,

                tipo_despacho:
                    detalle.tipo_despacho
                        ? String(
                            detalle.tipo_despacho
                        ).trim()
                        : null,

                fecha_cosecha:
                    detalle.fecha_cosecha
                        || null,

                fecha_ingreso:
                    detalle.fecha_ingreso
                        || null,

                codigo_nro_lote:
                    detalle.codigo_nro_lote
                        ? String(
                            detalle.codigo_nro_lote
                        ).trim()
                        : null,

                fecha_lote_venci:
                    detalle.fecha_lote_venci
                        || null,

                observaciones:
                    detalle.observaciones
                        ? String(
                            detalle.observaciones
                        ).trim()
                        : null

            };

        });


    // ========================================================
    // ACTUALIZAR EN REPOSITORY
    // ========================================================

    return await actualizarDespacho({

    transacId:
        idTransaccion,

    proveedorId:
        Number(proveedorId),

    destinoId:
        String(destinoId).trim(),

    fechaProgramacion:
        fechaProgramacion || null,

    estadoDespacho:
        estadoDespacho || 'PRO',

    fechaDespacho:
        fechaDespacho || null,

    fechaCancelacion:
        fechaCancelacion || null,

    observaciones:
        observaciones
            ? String(observaciones).trim()
            : null,

    detalles:
        detallesNormalizados,

    usuarioId:
        Number(usuarioId)

});

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    listarDespachosService,
    obtenerDespachoPorIdService,
    crearDespachoService,
    actualizarDespachoService
};
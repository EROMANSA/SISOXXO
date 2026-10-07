const {
    listarDespachosService,
    obtenerDespachoPorIdService,
    crearDespachoService,
    actualizarDespachoService
} = require('../services/despachos.service');


// ============================================================
// LISTAR DESPACHOS
// ============================================================

const listarDespachos = async (req, res) => {

    try {

        const proveedorId = req.user?.proveedor_id;

        if (!proveedorId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no tiene un proveedor asociado.'
            });
        }

        const despachos = await listarDespachosService(proveedorId);

        return res.status(200).json({
            ok: true,
            despachos
        });

    } catch (error) {

        console.error('Error al listar despachos:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los despachos.'
        });
    }
};


// ============================================================
// CREAR DESPACHO
// CABECERA + DETALLE
// ============================================================

const crearDespacho = async (req, res) => {

    try {

        const proveedorId = req.user?.proveedor_id;
        const usuarioId = req.user?.usuario_id;


        // ====================================================
        // VALIDAR PROVEEDOR
        // ====================================================

        if (!proveedorId) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no tiene un proveedor asociado.'
            });
        }


        // ====================================================
        // VALIDAR USUARIO
        // ====================================================

        if (!usuarioId) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No se pudo identificar al usuario autenticado.'
            });
        }


        // ====================================================
        // DATOS RECIBIDOS
        // ====================================================

       const {
    destinoId,
    fechaProgramacion,
    observaciones,
    detalles
} = req.body;

        // ====================================================
        // CREAR DESPACHO
        // ====================================================

        const despacho =
    await crearDespachoService({
        proveedorId,
        destinoId,
        fechaProgramacion,
        observaciones,
        detalles,
        usuarioId
    });


        // ====================================================
        // RESPUESTA
        // ====================================================

        return res.status(201).json({
            ok: true,
            mensaje: 'Despacho creado correctamente.',
            despacho
        });


    } catch (error) {

        console.error('Error al crear despacho:', error);


        // ====================================================
        // ERRORES DE VALIDACIÓN
        // ====================================================

        switch (error.message) {

            case 'PROVEEDOR_INVALIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El proveedor no es válido.'
                });


            case 'DESTINO_REQUERIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El destino de la tienda es obligatorio.'
                });


            case 'USUARIO_INVALIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no es válido.'
                });


            

            case 'DETALLES_REQUERIDOS':
    return res.status(400).json({
        ok: false,
        mensaje: 'El despacho debe tener por lo menos una línea de detalle.'
    });

case 'DETALLE_INVALIDO':
    return res.status(400).json({
        ok: false,
        mensaje: 'Una de las líneas del detalle no es válida.'
    });

case 'CANTIDAD_INVALIDA':
    return res.status(400).json({
        ok: false,
        mensaje: 'La cantidad de una línea del detalle no es válida.'
    });    


            default:

                return res.status(500).json({
                    ok: false,
                    mensaje: 'No fue posible crear el despacho.'
                });
        }
    }
};


const actualizarDespacho = async (req, res) => {

    try {

        const transacId = req.params.id;

        const proveedorId =
            req.user?.proveedor_id;

        const usuarioId =
            req.user?.usuario_id;


        if (!proveedorId) {

            return res.status(400).json({
                ok: false,
                mensaje:
                    'El usuario no tiene un proveedor asociado.'
            });

        }


        if (!usuarioId) {

            return res.status(400).json({
                ok: false,
                mensaje:
                    'No se pudo identificar al usuario autenticado.'
            });

        }


        const {
    destinoId,
    fechaProgramacion,
    estadoDespacho,
    fechaDespacho,
    fechaCancelacion,
    observaciones,
    detalles
} = req.body;


        const despacho =
    await actualizarDespachoService({

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

    });


        return res.status(200).json({

            ok: true,

            mensaje:
                'Despacho actualizado correctamente.',

            despacho

        });


    } catch (error) {

        console.error(
            'Error al actualizar despacho:',
            error
        );


        switch (error.message) {

            case 'ID_TRANSACCION_INVALIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        'El identificador de transacción no es válido.'
                });


            case 'PROVEEDOR_INVALIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        'El proveedor no es válido.'
                });


            case 'DESTINO_REQUERIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        'El destino de la tienda es obligatorio.'
                });


            case 'USUARIO_INVALIDO':

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        'El usuario no es válido.'
                });


            case 'DETALLES_REQUERIDOS':

                return res.status(400).json({
                    ok: false,
                    mensaje:
                        'El despacho debe tener al menos una línea de detalle.'
                });


            case 'DESPACHO_NO_ENCONTRADO':

                return res.status(404).json({
                    ok: false,
                    mensaje:
                        'El despacho no fue encontrado.'
                });

            case 'DESPACHO_NO_MODIFICABLE':
    return res.status(409).json({
        ok: false,
        mensaje:
            'El despacho no puede ser modificado porque su estado actual no es PRO.'
    });  
    
    case 'ESTADO_DESPACHO_INVALIDO':

    return res.status(400).json({
        ok: false,
        mensaje:
            'El estado del despacho enviado no es válido.'
    });


case 'FECHA_DESPACHO_REQUERIDA':

    return res.status(400).json({
        ok: false,
        mensaje:
            'La Fecha de Despacho es obligatoria cuando el estado es DSP.'
    });


case 'FECHA_DESPACHO_INVALIDA':

    return res.status(400).json({
        ok: false,
        mensaje:
            'La Fecha de Despacho no puede ser anterior a la Fecha de Programación.'
    });


case 'FECHA_CANCELACION_REQUERIDA':

    return res.status(400).json({
        ok: false,
        mensaje:
            'La Fecha de Cancelación es obligatoria cuando el estado es CAN.'
    });


case 'FECHA_CANCELACION_INVALIDA':

    return res.status(400).json({
        ok: false,
        mensaje:
            'La Fecha de Cancelación no puede ser anterior a la Fecha de Programación.'
    });



            default:

                return res.status(500).json({
                    ok: false,
                    mensaje:
                        'No fue posible actualizar el despacho.'
                });

        }

    }

};

// ============================================================
// OBTENER DESPACHO POR ID
// ============================================================

const obtenerDespachoPorId = async (req, res) => {

    try {

        const transacId = req.params.id;
        const proveedorId = req.user?.proveedor_id;


        if (!proveedorId) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no tiene un proveedor asociado.'
            });
        }


        const despacho = await obtenerDespachoPorIdService(
            transacId,
            proveedorId
        );


        return res.status(200).json({
            ok: true,
            despacho
        });


    } catch (error) {

        console.error(
            'Error al obtener despacho:',
            error
        );


        if (error.codigo === 'ID_TRANSACCION_INVALIDO') {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }


        if (error.codigo === 'ID_PROVEEDOR_INVALIDO') {

            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }


        if (error.codigo === 'DESPACHO_NO_ENCONTRADO') {

            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }


        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener el despacho.'
        });
    }
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
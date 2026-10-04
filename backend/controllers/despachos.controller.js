const {
    listarDespachosService,
    obtenerDespachoPorIdService,
    crearDespachoService
} = require('../services/despachos.service');

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

const crearDespacho = async (req, res) => {

    try {

        const proveedorId = req.user?.proveedor_id;
        const usuarioId = req.user?.usuario_id;

        if (!proveedorId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no tiene un proveedor asociado.'
            });
        }

        if (!usuarioId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se pudo identificar al usuario autenticado.'
            });
        }

        const {            
            destinoId,
            fechaProgramacion,
            observaciones
        } = req.body;

        const despacho = await crearDespachoService({
            proveedorId,            
            destinoId,
            fechaProgramacion,
            observaciones,
            usuarioId
        });

        return res.status(201).json({
            ok: true,
            mensaje: 'Despacho creado correctamente.',
            despacho
        });

    } catch (error) {

        console.error('Error al crear despacho:', error);

        switch (error.message) {

            case 'PROVEEDOR_INVALIDO':
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El proveedor no es válido.'
                });

            case 'TIPO_RUBRO_REQUERIDO':
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Tipo Rubro es obligatorio.'
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

            default:
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No fue posible crear el despacho.'
                });
        }
    }
};

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

module.exports = {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho
};
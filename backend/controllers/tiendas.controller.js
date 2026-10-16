const tiendasService = require('../services/tiendas.service');

const listarTiendas = async (req, res) => {
    try {
        const tiendas = await tiendasService.listarTiendas();

        return res.status(200).json({
            ok: true,
            data: tiendas
        });
    } catch (error) {
        console.error('Error al listar tiendas:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar las tiendas.'
        });
    }
};

const obtenerTiendaPorId = async (req, res) => {
    try {
        const tienda = await tiendasService.obtenerTiendaPorId(
            req.params.id
        );

        if (!tienda) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Tienda no encontrada.'
            });
        }

        return res.status(200).json({
            ok: true,
            data: tienda
        });
    } catch (error) {
        console.error('Error al consultar tienda:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar la tienda.'
        });
    }
};

const registrarTienda = async (req, res) => {
    try {
        const usuarioId = req.user.usuario_id;

        const tienda = await tiendasService.registrarTienda(
            req.body,
            usuarioId
        );

        return res.status(201).json({
            ok: true,
            mensaje: 'Tienda registrada correctamente.',
            data: tienda
        });
    } catch (error) {
        console.error('Error al registrar tienda:', error);

        return res.status(error.statusCode || 500).json({
            ok: false,
            codigo: error.code || undefined,
            mensaje: error.statusCode
                ? error.message
                : 'Error al registrar la tienda.'
        });
    }
};


const actualizarTienda = async (req, res) => {
    try {
        const usuarioId = req.user.usuario_id;
        const tiendaId = req.params.id;

        const tienda = await tiendasService.actualizarTienda(
            tiendaId,
            req.body,
            usuarioId
        );

        return res.status(200).json({
            ok: true,
            mensaje: 'Tienda actualizada correctamente.',
            data: tienda
        });
    } catch (error) {
        console.error('Error al actualizar tienda:', error);

        return res.status(error.statusCode || 500).json({
            ok: false,
            codigo: error.code || undefined,
            mensaje: error.statusCode
                ? error.message
                : 'Error al actualizar la tienda.'
        });
    }
};


module.exports = {
    listarTiendas,
    obtenerTiendaPorId,
    registrarTienda,
    actualizarTienda
};

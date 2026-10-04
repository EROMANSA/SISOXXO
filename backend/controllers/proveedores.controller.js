const proveedoresService = require('../services/proveedores.service');

const listarProveedores = async (req, res) => {
    try {
        const proveedores = await proveedoresService.listarProveedores();

        res.status(200).json({
            ok: true,
            data: proveedores
        });

    } catch (error) {
        console.error('Error al listar proveedores:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar los proveedores',
            error: error.message
        });
    }
};

const registrarProveedor = async (req, res) => {
    try {
        const proveedor = await proveedoresService.registrarProveedor(req.body);

        res.status(201).json({
            ok: true,
            mensaje: 'Proveedor registrado correctamente',
            data: proveedor
        });

    } catch (error) {
        console.error('Error al registrar proveedor:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al registrar el proveedor',
            error: error.message
        });
    }
};

const obtenerProveedorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const proveedor = await proveedoresService.obtenerProveedorPorId(id);

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            data: proveedor
        });

    } catch (error) {
        console.error('Error al obtener proveedor:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar el proveedor',
            error: error.message
        });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const proveedor = await proveedoresService.actualizarProveedor(
            id,
            req.body
        );

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Proveedor actualizado correctamente',
            data: proveedor
        });

    } catch (error) {
        console.error('Error al actualizar proveedor:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar el proveedor',
            error: error.message
        });
    }
};

const obtenerMiFicha = async (req, res) => {
    try {
        const usuarioId = req.user.usuario_id;

        const ficha = await proveedoresService.obtenerMiFicha(usuarioId);

        return res.status(200).json({
            ok: true,
            data: ficha
        });

    } catch (error) {
        console.error('Error al obtener Mi Ficha:', error);

        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};


const registrarMiFicha = async (req, res) => {
    try {
        const usuarioId = req.user.usuario_id;

        const proveedor = await proveedoresService.registrarMiFicha(
            usuarioId,
            req.body
        );

        return res.status(201).json({
            ok: true,
            mensaje: 'Ficha registrada correctamente',
            data: proveedor
        });

    } catch (error) {
        console.error('Error al registrar Mi Ficha:', error);

        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};


const actualizarMiFicha = async (req, res) => {
    try {
        const usuarioId = req.user.usuario_id;

        const proveedor = await proveedoresService.actualizarMiFicha(
            usuarioId,
            req.body
        );

        return res.status(200).json({
            ok: true,
            mensaje: 'Ficha actualizada correctamente',
            data: proveedor
        });

    } catch (error) {
        console.error('Error al actualizar Mi Ficha:', error);

        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

module.exports = {
    listarProveedores,
    registrarProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    obtenerMiFicha,
    registrarMiFicha,
    actualizarMiFicha
};
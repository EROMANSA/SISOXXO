
const {
    obtenerTiendaConsultorService,
    listarRubrosDashboardService,
    listarProveedoresDashboardService,
    listarEstadosDespachoDashboardService,
    obtenerIndicadoresDashboardService
} = require('../services/dashboardConsultor.service');

// ============================================================
// OBTENER TIENDA ASIGNADA
// ============================================================

const obtenerTiendaConsultor = async (req, res) => {
    try {
        const usuarioId = req.user?.usuario_id;

        if (!usuarioId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se pudo identificar al usuario autenticado.'
            });
        }

        const tienda = await obtenerTiendaConsultorService(usuarioId);

        return res.status(200).json({
            ok: true,
            tienda
        });
    } catch (error) {
        console.error(
            'Error al obtener tienda del consultor:',
            error
        );

        if (
            error.codigo === 'USUARIO_INVALIDO' ||
            error.codigo === 'TIENDA_CONSULTOR_INVALIDA'
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener la tienda del consultor.'
        });
    }
};

// ============================================================
// LISTAR RUBROS
// ============================================================

const listarRubrosDashboard = async (req, res) => {
    try {
        const rubros = await listarRubrosDashboardService();

        return res.status(200).json({
            ok: true,
            rubros
        });
    } catch (error) {
        console.error('Error al listar rubros:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los rubros.'
        });
    }
};

// ============================================================
// LISTAR PROVEEDORES
// ============================================================

const listarProveedoresDashboard = async (req, res) => {
    try {
        const tipoRubro = req.query.tipo_rubro;

        const proveedores =
            await listarProveedoresDashboardService(tipoRubro);

        return res.status(200).json({
            ok: true,
            proveedores
        });
    } catch (error) {
        console.error(
            'Error al listar proveedores del dashboard:',
            error
        );

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los proveedores.'
        });
    }
};

// ============================================================
// LISTAR ESTADOS DE DESPACHO
// ============================================================

const listarEstadosDespachoDashboard = async (req, res) => {
    try {
        const estados =
            await listarEstadosDespachoDashboardService();

        return res.status(200).json({
            ok: true,
            estados
        });
    } catch (error) {
        console.error('Error al listar estados de despacho:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los estados de despacho.'
        });
    }
};

// ============================================================
// OBTENER INDICADORES
// ============================================================

const obtenerIndicadoresDashboard = async (req, res) => {
    try {
        const usuarioId = req.user?.usuario_id;

        if (!usuarioId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se pudo identificar al usuario autenticado.'
            });
        }

        const {
            tipoRubro,
            proveedorId,
            estadoDespacho
        } = req.query;

        const indicadores =
            await obtenerIndicadoresDashboardService({
                usuarioId,
                tipoRubro,
                proveedorId,
                estadoDespacho
            });

        return res.status(200).json({
            ok: true,
            indicadores
        });
    } catch (error) {
        console.error(
            'Error al obtener indicadores del dashboard consultor:',
            error
        );

        if (
            [
                'USUARIO_INVALIDO',
                'TIENDA_CONSULTOR_INVALIDA',
                'PROVEEDOR_INVALIDO',
                'ESTADO_DESPACHO_INVALIDO'
            ].includes(error.codigo)
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los indicadores del dashboard.'
        });
    }
};

module.exports = {
    obtenerTiendaConsultor,
    listarRubrosDashboard,
    listarProveedoresDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
};

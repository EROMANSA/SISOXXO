
const {
    listarTiendasDashboardService,
    listarEstadosDespachoDashboardService,
    obtenerIndicadoresDashboardService
} = require('../services/dashboardProveedor.service');


// ============================================================
// LISTAR TIENDAS
// ============================================================

const listarTiendasDashboard = async (req, res) => {
    try {
        const tiendas =
            await listarTiendasDashboardService();

        return res.status(200).json({
            ok: true,
            tiendas
        });

    } catch (error) {
        console.error(
            'Error al listar tiendas del dashboard:',
            error
        );

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener las tiendas.'
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
        console.error(
            'Error al listar estados del dashboard:',
            error
        );

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
        // El proveedor se obtiene del token autenticado.
        // No se acepta proveedorId desde el frontend.

        const proveedorId = req.user?.proveedor_id;

        if (!proveedorId) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no tiene un proveedor asociado.'
            });
        }

        const {
            tiendaId,
            estadoDespacho,
            fechaInicio,
            fechaFin
        } = req.query;

        const indicadores =
            await obtenerIndicadoresDashboardService({
                proveedorId,
                tiendaId,
                estadoDespacho,
                fechaInicio,
                fechaFin
            });

        return res.status(200).json({
            ok: true,
            indicadores
        });

    } catch (error) {
        console.error(
            'Error al obtener indicadores del dashboard:',
            error
        );

        if (
            error.codigo === 'PROVEEDOR_INVALIDO' ||
            error.codigo === 'ESTADO_DESPACHO_INVALIDO' ||
            error.codigo === 'FECHA_INVALIDA' ||
            error.codigo === 'RANGO_FECHAS_INVALIDO'
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


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
};

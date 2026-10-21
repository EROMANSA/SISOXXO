
const {
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../repositories/dashboardProveedor.repository');


// ============================================================
// LISTAR TIENDAS PARA EL FILTRO
// ============================================================

const listarTiendasDashboardService = async () => {
    return await listarTiendasDashboard();
};


// ============================================================
// LISTAR ESTADOS DE DESPACHO PARA EL FILTRO
// ============================================================

const listarEstadosDespachoDashboardService = async () => {
    return await listarEstadosDespachoDashboard();
};


// ============================================================
// OBTENER INDICADORES DEL DASHBOARD
// ============================================================

const obtenerIndicadoresDashboardService = async ({
    proveedorId,
    tiendaId,
    estadoDespacho
}) => {

    const idProveedor = Number(proveedorId);

    if (
        !Number.isInteger(idProveedor) ||
        idProveedor <= 0
    ) {
        const error = new Error(
            'El identificador del proveedor no es válido.'
        );

        error.codigo = 'PROVEEDOR_INVALIDO';

        throw error;
    }

    const tiendaNormalizada =
        tiendaId !== undefined &&
        tiendaId !== null &&
        String(tiendaId).trim() !== ''
            ? String(tiendaId).trim()
            : null;

    const estadoNormalizado =
        estadoDespacho !== undefined &&
        estadoDespacho !== null &&
        String(estadoDespacho).trim() !== ''
            ? String(estadoDespacho).trim().toUpperCase()
            : null;

    const estadosPermitidos = [
        'PRO',
        'DSP',
        'CAN'
    ];

    if (
        estadoNormalizado !== null &&
        !estadosPermitidos.includes(estadoNormalizado)
    ) {
        const error = new Error(
            'El estado del despacho no es válido.'
        );

        error.codigo = 'ESTADO_DESPACHO_INVALIDO';

        throw error;
    }

    return await obtenerIndicadoresDashboard({
        proveedorId: idProveedor,
        tiendaId: tiendaNormalizada,
        estadoDespacho: estadoNormalizado
    });
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    listarTiendasDashboardService,
    listarEstadosDespachoDashboardService,
    obtenerIndicadoresDashboardService
};

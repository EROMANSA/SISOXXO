
const {
    obtenerTiendaConsultor,
    listarRubrosDashboard,
    listarProveedoresDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../repositories/dashboardConsultor.repository');

// ============================================================
// VALIDAR IDENTIFICADOR DEL USUARIO
// ============================================================

const validarUsuarioId = (usuarioId) => {
    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(
            'El identificador del usuario no es válido.'
        );
        error.codigo = 'USUARIO_INVALIDO';
        throw error;
    }

    return id;
};

// ============================================================
// OBTENER TIENDA ASIGNADA AL CONSULTOR
// ============================================================

const obtenerTiendaConsultorService = async (usuarioId) => {
    const id = validarUsuarioId(usuarioId);
    const tienda = await obtenerTiendaConsultor(id);

    if (!tienda) {
        const error = new Error(
            'El consultor no tiene una tienda asignada válida.'
        );
        error.codigo = 'TIENDA_CONSULTOR_INVALIDA';
        throw error;
    }

    return tienda;
};

// ============================================================
// LISTAR RUBROS
// ============================================================

const listarRubrosDashboardService = async () => {
    return await listarRubrosDashboard();
};

// ============================================================
// LISTAR PROVEEDORES POR RUBRO
// ============================================================

const listarProveedoresDashboardService = async (tipoRubro) => {
    const rubroNormalizado =
        tipoRubro !== undefined &&
        tipoRubro !== null &&
        String(tipoRubro).trim() !== ''
            ? String(tipoRubro).trim()
            : null;

    return await listarProveedoresDashboard(rubroNormalizado);
};

// ============================================================
// LISTAR ESTADOS DE DESPACHO
// ============================================================

const listarEstadosDespachoDashboardService = async () => {
    return await listarEstadosDespachoDashboard();
};

// ============================================================
// OBTENER INDICADORES
// ============================================================

const obtenerIndicadoresDashboardService = async ({
    usuarioId,
    tipoRubro,
    proveedorId,
    estadoDespacho
}) => {
    const tienda = await obtenerTiendaConsultorService(usuarioId);

    const rubroNormalizado =
        tipoRubro !== undefined &&
        tipoRubro !== null &&
        String(tipoRubro).trim() !== ''
            ? String(tipoRubro).trim()
            : null;

    const proveedorNormalizado =
        proveedorId !== undefined &&
        proveedorId !== null &&
        String(proveedorId).trim() !== ''
            ? Number(proveedorId)
            : null;

    const estadoNormalizado =
        estadoDespacho !== undefined &&
        estadoDespacho !== null &&
        String(estadoDespacho).trim() !== ''
            ? String(estadoDespacho).trim().toUpperCase()
            : null;

    if (
        proveedorNormalizado !== null &&
        (!Number.isInteger(proveedorNormalizado) ||
            proveedorNormalizado <= 0)
    ) {
        const error = new Error(
            'El identificador del proveedor no es válido.'
        );
        error.codigo = 'PROVEEDOR_INVALIDO';
        throw error;
    }

    const estadosPermitidos = ['PRO', 'DSP', 'CAN', 'TRA'];

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
        tiendaId: String(tienda.tienda_id),
        tipoRubro: rubroNormalizado,
        proveedorId: proveedorNormalizado,
        estadoDespacho: estadoNormalizado
    });
};

module.exports = {
    obtenerTiendaConsultorService,
    listarRubrosDashboardService,
    listarProveedoresDashboardService,
    listarEstadosDespachoDashboardService,
    obtenerIndicadoresDashboardService
};


const {
    obtenerTiendaConsultor,
    listarRubrosDashboard,
    listarProveedoresDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../repositories/dashboardConsultor.repository');


const normalizarFecha = (valor, nombreCampo) => {
    if (valor === undefined || valor === null || String(valor).trim() === '') {
        return null;
    }

    const fecha = String(valor).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        const error = new Error(`El campo ${nombreCampo} debe tener formato YYYY-MM-DD.`);
        error.codigo = 'FECHA_INVALIDA';
        throw error;
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaValida = new Date(Date.UTC(anio, mes - 1, dia));
    if (
        fechaValida.getUTCFullYear() !== anio ||
        fechaValida.getUTCMonth() !== mes - 1 ||
        fechaValida.getUTCDate() !== dia
    ) {
        const error = new Error(`El campo ${nombreCampo} no contiene una fecha válida.`);
        error.codigo = 'FECHA_INVALIDA';
        throw error;
    }
    return fecha;
};

const validarRangoFechas = (fechaInicio, fechaFin) => {
    const inicio = normalizarFecha(fechaInicio, 'fechaInicio');
    const fin = normalizarFecha(fechaFin, 'fechaFin');
    if (inicio && fin && inicio > fin) {
        const error = new Error('La Fecha Inicio no puede ser posterior a la Fecha Fin.');
        error.codigo = 'RANGO_FECHAS_INVALIDO';
        throw error;
    }
    return { fechaInicio: inicio, fechaFin: fin };
};

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
    estadoDespacho,
    fechaInicio,
    fechaFin
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

    const rangoFechas = validarRangoFechas(fechaInicio, fechaFin);
    return await obtenerIndicadoresDashboard({
        tiendaId: String(tienda.tienda_id),
        tipoRubro: rubroNormalizado,
        proveedorId: proveedorNormalizado,
        estadoDespacho: estadoNormalizado,
        ...rangoFechas
    });
};

module.exports = {
    obtenerTiendaConsultorService,
    listarRubrosDashboardService,
    listarProveedoresDashboardService,
    listarEstadosDespachoDashboardService,
    obtenerIndicadoresDashboardService
};

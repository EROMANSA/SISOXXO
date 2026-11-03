
const {
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../repositories/dashboardProveedor.repository');



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
    estadoDespacho,
    fechaInicio,
    fechaFin
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

    const rangoFechas = validarRangoFechas(fechaInicio, fechaFin);
    return await obtenerIndicadoresDashboard({
        proveedorId: idProveedor,
        tiendaId: tiendaNormalizada,
        estadoDespacho: estadoNormalizado,
        ...rangoFechas
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


import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const dashboardProveedorApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

dashboardProveedorApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Obtener todas las tiendas para el filtro
export const listarTiendasDashboard = async () => {
    const response = await dashboardProveedorApi.get(
        '/dashboard-proveedor/tiendas'
    );

    return response.data;
};

// Obtener estados de despacho para el filtro
export const listarEstadosDashboard = async () => {
    const response = await dashboardProveedorApi.get(
        '/dashboard-proveedor/estados'
    );

    return response.data;
};

// Obtener indicadores del dashboard
export const obtenerIndicadoresDashboard = async ({
    tiendaId = '',
    estadoDespacho = ''
} = {}) => {
    const params = {};

    if (tiendaId) {
        params.tiendaId = tiendaId;
    }

    if (estadoDespacho) {
        params.estadoDespacho = estadoDespacho;
    }

    const response = await dashboardProveedorApi.get(
        '/dashboard-proveedor/indicadores',
        { params }
    );

    return response.data;
};

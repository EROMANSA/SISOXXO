
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Obtener la tienda asignada al consultor
export const obtenerTiendaConsultor = async () => {
    const response = await api.get('/dashboard-consultor/tienda');
    return response.data;
};

// Listar los rubros disponibles
export const listarRubrosConsultor = async () => {
    const response = await api.get('/dashboard-consultor/rubros');
    return response.data;
};

// Listar proveedores; el rubro es opcional
export const listarProveedoresConsultor = async (tipoRubro = '') => {
    const params = {};

    if (tipoRubro) {
        params.tipo_rubro = tipoRubro;
    }

    const response = await api.get(
        '/dashboard-consultor/proveedores',
        { params }
    );

    return response.data;
};

// Listar estados de despacho
export const listarEstadosConsultor = async () => {
    const response = await api.get('/dashboard-consultor/estados');
    return response.data;
};

// Obtener indicadores aplicando los filtros seleccionados
export const obtenerIndicadoresConsultor = async ({
    tipoRubro = '',
    proveedorId = '',
    estadoDespacho = ''
} = {}) => {
    const params = {};

    if (tipoRubro) {
        params.tipoRubro = tipoRubro;
    }

    if (proveedorId) {
        params.proveedorId = proveedorId;
    }

    if (estadoDespacho) {
        params.estadoDespacho = estadoDespacho;
    }

    const response = await api.get(
        '/dashboard-consultor/indicadores',
        { params }
    );

    return response.data;
};

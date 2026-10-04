import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const proveedoresApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

proveedoresApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const listarProveedores = async () => {
    const response = await proveedoresApi.get('/proveedores');
    return response.data;
};

export const obtenerProveedorPorId = async (proveedorId) => {
    const response = await proveedoresApi.get(`/proveedores/${proveedorId}`);
    return response.data;
};

export const registrarProveedor = async (datos) => {
    const response = await proveedoresApi.post('/proveedores', datos);
    return response.data;
};

export const actualizarProveedor = async (proveedorId, datos) => {
    const response = await proveedoresApi.put(
        `/proveedores/${proveedorId}`,
        datos
    );

    return response.data;
};

// ========================================
// SERVICIOS - MI FICHA
// ========================================

export const obtenerMiFicha = async () => {
    const response = await proveedoresApi.get('/proveedores/mi-ficha');
    return response.data;
};

export const registrarMiFicha = async (datos) => {
    const response = await proveedoresApi.post(
        '/proveedores/mi-ficha',
        datos
    );
    return response.data;
};

export const actualizarMiFicha = async (datos) => {
    const response = await proveedoresApi.put(
        '/proveedores/mi-ficha',
        datos
    );
    return response.data;
};
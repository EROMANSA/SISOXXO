import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const usuariosApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

usuariosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const listarUsuarios = async (filtro = 'TODOS') => {
    const response = await usuariosApi.get('/usuarios', {
        params: { filtro }
    });

    return response.data;
};

export const obtenerTotalesUsuarios = async () => {
    const response = await usuariosApi.get('/usuarios/totales');

    return response.data;
};

export const obtenerUsuarioPorId = async (usuarioId) => {
    const response = await usuariosApi.get(`/usuarios/${usuarioId}`);

    return response.data;
};

export const registrarUsuario = async (datos) => {
    const response = await usuariosApi.post('/usuarios', datos);

    return response.data;
};

export const actualizarUsuario = async (usuarioId, datos) => {
    const response = await usuariosApi.put(
        `/usuarios/${usuarioId}`,
        datos
    );

    return response.data;
};

export const crearUsuario = async (datos) => {
    const response = await usuariosApi.post('/usuarios', datos);

    return response.data;
};

export const aprobarUsuario = async (usuarioId, rolId) => {
    const response = await usuariosApi.put(
        `/usuarios/${usuarioId}/aprobar`,
        {
            rol_id: rolId
        }
    );

    return response.data;
};

export const rechazarUsuario = async (usuarioId) => {
    const response = await usuariosApi.put(
        `/usuarios/${usuarioId}/rechazar`
    );

    return response.data;
};

export const registrarSolicitudUsuario = async (datos) => {
    const response = await usuariosApi.post(
        '/usuarios/registro',
        datos
    );

    return response.data;
};

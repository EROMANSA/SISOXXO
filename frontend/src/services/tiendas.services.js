import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const tiendasApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

tiendasApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const listarTiendas = async () => {
    const response = await tiendasApi.get('/tiendas');
    return response.data;
};

export const registrarTienda = async (datos) => {
    const response = await tiendasApi.post('/tiendas', datos);
    return response.data;
};

export const actualizarTienda = async (tiendaId, datos) => {
    const response = await tiendasApi.put(
        `/tiendas/${encodeURIComponent(tiendaId)}`,
        datos
    );

    return response.data;
};

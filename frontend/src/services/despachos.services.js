import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const despachosApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

despachosApi.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export const listarDespachos = async () => {

    const response = await despachosApi.get('/despachos');

    return response.data;

};

export const obtenerDespachoPorId = async (transacId) => {

    const response = await despachosApi.get(`/despachos/${transacId}`);

    return response.data;

};

export const crearDespacho = async (datos) => {

    const response = await despachosApi.post(
        '/despachos',
        datos
    );  

    return response.data;
};

export const actualizarDespacho = async (
    transacId,
    datos
) => {

    const response = await despachosApi.put(
        `/despachos/${transacId}`,
        datos
    );

    return response.data;
};
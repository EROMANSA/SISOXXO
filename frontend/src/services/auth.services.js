import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const iniciarSesion = async (username, password) => {
    const response = await authApi.post('/auth/login', {
        username,
        password
    });

    return response.data;
};
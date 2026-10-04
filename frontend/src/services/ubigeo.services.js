import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const listarDepartamentos = async () => {
    const response = await axios.get(
        `${API_URL}/departamentos`
    );

    return response.data;
};

export const listarProvincias = async (departamento) => {
    const response = await axios.get(
        `${API_URL}/provincias/${encodeURIComponent(departamento)}`
    );

    return response.data;
};

export const listarDistritos = async (
    departamento,
    provincia
) => {
    const response = await axios.get(
        `${API_URL}/distritos/${encodeURIComponent(departamento)}/${encodeURIComponent(provincia)}`
    );

    return response.data;
};

export const obtenerUbigeo = async (
    departamento,
    provincia,
    distrito
) => {
    const response = await axios.get(
        `${API_URL}/${encodeURIComponent(departamento)}/${encodeURIComponent(provincia)}/${encodeURIComponent(distrito)}`
    );

    return response.data;
};
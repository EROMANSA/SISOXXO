import axios from 'axios';

const API_URL = 'http://localhost:3000/api/listas';

export const listarTiposRubro = async () => {
    const response = await axios.get(
        `${API_URL}/tipo-rubro`
    );

    return response.data;
};

export const listarTiposDocumento = async () => {
    const response = await axios.get(
        `${API_URL}/tipo-documento`
    );

    return response.data;
};

export const listarTiposDocSanitaria = async () => {
    const response = await axios.get(
        `${API_URL}/tipo-doc-sanitaria`
    );

    return response.data;
};

export const listarRegimenesTributarios = async () => {
    const response = await axios.get(
        `${API_URL}/regimen-tributario`
    );

    return response.data;
};

export const listarCiiu = async () => {
    const response = await axios.get(
        `${API_URL}/ciiu`
    );
};

    export const listarTiposTransaccion = async () => {
    const response = await axios.get(
        `${API_URL}/tipo-transaccion`
    );
    return response.data;
};

export const listarTiendasOxxo = async () => {
    const response = await axios.get(
        `${API_URL}/tiendas-oxxo`
    );
    return response.data;
};

export const listarEstadosDespacho = async () => {
    const response = await axios.get(
        `${API_URL}/estado-despacho`
    );
    return response.data;
};

export const listarUnidadesMedida = async () => {
    const response = await axios.get(
        `${API_URL}/unidad-medida`
    );

    return response.data;
};

export const listarTiposDespacho = async () => {
    const response = await axios.get(
        `${API_URL}/tipo-despacho`
    );

    return response.data;
};

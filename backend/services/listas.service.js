const listasRepository = require('../repositories/listas.repository');

const obtenerTipoRubro = async () => {
    return await listasRepository.obtenerTipoRubro();
};

const obtenerTipoDocumento = async () => {
    return await listasRepository.obtenerTipoDocumento();
};

const obtenerTipoDocSanitaria = async () => {
    return await listasRepository.obtenerTipoDocSanitaria();
};

const obtenerRegimenTributario = async () => {
    return await listasRepository.obtenerRegimenTributario();
};

const obtenerCiiu = async () => {
    return await listasRepository.obtenerCiiu();
};

const obtenerTipoTransaccion = async () => {
    return await listasRepository.obtenerTipoTransaccion();
};

const obtenerTiendasOxxo = async () => {
    return await listasRepository.obtenerTiendasOxxo();
};

const obtenerEstadoDespacho = async () => {
    return await listasRepository.obtenerEstadoDespacho();
};


const obtenerUnidadMedida = async () => {
    return await listasRepository.obtenerUnidadMedida();
};

const obtenerTipoDespacho = async () => {
    return await listasRepository.obtenerTipoDespacho();
};

module.exports = {
    obtenerTipoRubro,
    obtenerTipoDocumento,
    obtenerTipoDocSanitaria,
    obtenerRegimenTributario,
    obtenerCiiu,
    obtenerTipoTransaccion,
    obtenerTiendasOxxo,
    obtenerEstadoDespacho,
    obtenerUnidadMedida,
    obtenerTipoDespacho
};
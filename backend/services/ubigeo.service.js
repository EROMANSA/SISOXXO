const ubigeoRepository = require('../repositories/ubigeo.repository');

const obtenerDepartamentos = async () => {
    return await ubigeoRepository.obtenerDepartamentos();
};

const obtenerProvincias = async (departamento) => {
    return await ubigeoRepository.obtenerProvincias(departamento);
};

const obtenerDistritos = async (departamento, provincia) => {
    return await ubigeoRepository.obtenerDistritos(
        departamento,
        provincia
    );
};

const obtenerUbigeo = async (
    departamento,
    provincia,
    distrito
) => {
    return await ubigeoRepository.obtenerUbigeo(
        departamento,
        provincia,
        distrito
    );
};

module.exports = {
    obtenerDepartamentos,
    obtenerProvincias,
    obtenerDistritos,
    obtenerUbigeo
};
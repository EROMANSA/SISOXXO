const proveedoresRepository = require('../repositories/proveedores.repository');

const listarProveedores = async () => {
    return await proveedoresRepository.listarProveedores();
};

const registrarProveedor = async (datos) => {
    return await proveedoresRepository.registrarProveedor(datos);
};

const obtenerProveedorPorId = async (proveedorId) => {
    return await proveedoresRepository.obtenerProveedorPorId(proveedorId);
};
const actualizarProveedor = async (proveedorId, datos) => {
    return await proveedoresRepository.actualizarProveedor(
        proveedorId,
        datos
    );
};

const obtenerMiFicha = async (usuarioId) => {
    return await proveedoresRepository.obtenerMiFicha(usuarioId);
};

const registrarMiFicha = async (usuarioId, datos) => {
    return await proveedoresRepository.registrarMiFicha(usuarioId, datos);
};

const actualizarMiFicha = async (usuarioId, datos) => {
    return await proveedoresRepository.actualizarMiFicha(usuarioId, datos);
};

module.exports = {
    listarProveedores,
    registrarProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    obtenerMiFicha,
    registrarMiFicha,
    actualizarMiFicha
};
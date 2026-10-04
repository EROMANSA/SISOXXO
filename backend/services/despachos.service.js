const despachosRepository = require('../repositories/despachos.repository');

const {
    listarDespachos,
    obtenerDespachoPorId
} = require('../repositories/despachos.repository');

const listarDespachosService = async (proveedorId) => {

    return await listarDespachos(proveedorId);

};

const obtenerDespachoPorIdService = async (transacId, proveedorId) => {

    const idTransaccion = Number(transacId);
    const idProveedor = Number(proveedorId);

    if (!Number.isInteger(idTransaccion) || idTransaccion <= 0) {
        const error = new Error('Identificador de transacción no válido');
        error.codigo = 'ID_TRANSACCION_INVALIDO';
        throw error;
    }

    if (!Number.isInteger(idProveedor) || idProveedor <= 0) {
        const error = new Error('Identificador de proveedor no válido');
        error.codigo = 'ID_PROVEEDOR_INVALIDO';
        throw error;
    }

    const despacho = await obtenerDespachoPorId(
        idTransaccion,
        idProveedor
    );

    if (!despacho) {
        const error = new Error('Despacho no encontrado');
        error.codigo = 'DESPACHO_NO_ENCONTRADO';
        throw error;
    }

    return despacho;
};

const crearDespachoService = async ({
    proveedorId,    
    destinoId,
    fechaProgramacion,
    observaciones,
    usuarioId
}) => {

    if (!Number.isInteger(Number(proveedorId)) || Number(proveedorId) <= 0) {
        throw new Error('PROVEEDOR_INVALIDO');
    }

   

    if (!destinoId || String(destinoId).trim() === '') {
        throw new Error('DESTINO_REQUERIDO');
    }

    if (!Number.isInteger(Number(usuarioId)) || Number(usuarioId) <= 0) {
        throw new Error('USUARIO_INVALIDO');
    }

    return await despachosRepository.crearDespacho({
        proveedorId: Number(proveedorId),       
        destinoId: String(destinoId).trim(),
        fechaProgramacion: fechaProgramacion || null,
        observaciones: observaciones
            ? String(observaciones).trim()
            : null,
        usuarioId: Number(usuarioId)
    });
};

module.exports = {
    listarDespachosService,
    obtenerDespachoPorIdService,
    crearDespachoService
};
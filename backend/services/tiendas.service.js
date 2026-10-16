const tiendasRepository = require('../repositories/tiendas.repository');

const listarTiendas = async () => {
    return tiendasRepository.listarTiendas();
};

const obtenerTiendaPorId = async (tiendaId) => {
    return tiendasRepository.obtenerTiendaPorId(tiendaId);
};

const registrarTienda = async (datos, usuarioId) => {
    const tiendaId = String(datos.tienda_id ?? '').trim();

    if (!tiendaId) {
        const error = new Error('Debe ingresar el código de tienda.');
        error.statusCode = 400;
        throw error;
    }

    if (tiendaId.length > 5) {
        const error = new Error(
            'El código de tienda admite máximo 5 caracteres.'
        );
        error.statusCode = 400;
        throw error;
    }

    const descripcion = String(datos.descripcion ?? '').trim();

    if (!descripcion) {
        const error = new Error(
            'Debe ingresar la descripción de la tienda.'
        );
        error.statusCode = 400;
        throw error;
    }

    let ubigeo = null;

    if (datos.ubigeo !== '' && datos.ubigeo !== null &&
        datos.ubigeo !== undefined) {
        ubigeo = Number(datos.ubigeo);

        if (!Number.isInteger(ubigeo)) {
            const error = new Error(
                'El ubigeo debe ser un número entero.'
            );
            error.statusCode = 400;
            throw error;
        }
    }

    return tiendasRepository.registrarTienda(
        {
            ...datos,
            tienda_id: tiendaId,
            descripcion,
            ubigeo
        },
        usuarioId
    );
};


const actualizarTienda = async (tiendaId, datos, usuarioId) => {
    const id = String(tiendaId ?? '').trim();

    if (!id) {
        const error = new Error('Debe indicar el código de tienda.');
        error.statusCode = 400;
        throw error;
    }

    if (id.length > 5) {
        const error = new Error(
            'El código de tienda admite máximo 5 caracteres.'
        );
        error.statusCode = 400;
        throw error;
    }

    const descripcion = String(datos.descripcion ?? '').trim();

    if (!descripcion) {
        const error = new Error(
            'Debe ingresar la descripción de la tienda.'
        );
        error.statusCode = 400;
        throw error;
    }

    let ubigeo = null;

    if (
        datos.ubigeo !== '' &&
        datos.ubigeo !== null &&
        datos.ubigeo !== undefined
    ) {
        ubigeo = Number(datos.ubigeo);

        if (!Number.isInteger(ubigeo)) {
            const error = new Error(
                'El ubigeo debe ser un número entero.'
            );
            error.statusCode = 400;
            throw error;
        }
    }

    return tiendasRepository.actualizarTienda(
        id,
        {
            ...datos,
            descripcion,
            ubigeo
        },
        usuarioId
    );
};


module.exports = {
    listarTiendas,
    obtenerTiendaPorId,
    registrarTienda,
    actualizarTienda
};

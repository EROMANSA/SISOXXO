const listasService = require('../services/listas.service');


const obtenerTipoRubro = async (req, res) => {
    try {
        const data = await listasService.obtenerTipoRubro();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Tipo Rubro:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Tipo Rubro'
        });
    }
};

const obtenerTipoDocumento = async (req, res) => {
    try {
        const data = await listasService.obtenerTipoDocumento();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Tipo Documento:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Tipo Documento'
        });
    }
};

const obtenerTipoDocSanitaria = async (req, res) => {
    try {
        const data = await listasService.obtenerTipoDocSanitaria();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Tipo Doc. Sanitaria:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Tipo Doc. Sanitaria'
        });
    }
};

const obtenerRegimenTributario = async (req, res) => {
    try {
        const data = await listasService.obtenerRegimenTributario();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Régimen Tributario:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Régimen Tributario'
        });
    }
};

const obtenerCiiu = async (req, res) => {
    try {
        const data = await listasService.obtenerCiiu();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener CIIU:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener CIIU'
        });
    }
};

const obtenerTipoTransaccion = async (req, res) => {
    try {
        const data = await listasService.obtenerTipoTransaccion();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener tipos de transacción:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener tipos de transacción'
        });
    }
};

const obtenerTiendasOxxo = async (req, res) => {
    try {
        const data = await listasService.obtenerTiendasOxxo();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener tiendas OXXO:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener tiendas OXXO'
        });
    }
};

const obtenerEstadoDespacho = async (req, res) => {
    try {
        const data = await listasService.obtenerEstadoDespacho();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener estados de despacho:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener estados de despacho'
        });
    }
};

const obtenerUnidadMedida = async (req, res) => {
    try {
        const data = await listasService.obtenerUnidadMedida();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Unidad de Medida:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Unidad de Medida'
        });
    }
};

const obtenerTipoDespacho = async (req, res) => {
    try {
        const data = await listasService.obtenerTipoDespacho();

        res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.error('Error al obtener Tipo de Despacho:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener Tipo de Despacho'
        });
    }
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
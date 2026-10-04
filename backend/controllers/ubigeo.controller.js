const ubigeoService = require('../services/ubigeo.service');

const obtenerDepartamentos = async (req, res) => {
    try {
        const data = await ubigeoService.obtenerDepartamentos();

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.error('Error al obtener departamentos:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener departamentos'
        });
    }
};

const obtenerProvincias = async (req, res) => {
    try {
        const { departamento } = req.params;

        const data = await ubigeoService.obtenerProvincias(
            departamento
        );

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.error('Error al obtener provincias:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener provincias'
        });
    }
};

const obtenerDistritos = async (req, res) => {
    try {
        const {
            departamento,
            provincia
        } = req.params;

        const data = await ubigeoService.obtenerDistritos(
            departamento,
            provincia
        );

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.error('Error al obtener distritos:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener distritos'
        });
    }
};

const obtenerUbigeo = async (req, res) => {
    try {
        const {
            departamento,
            provincia,
            distrito
        } = req.params;

        const data = await ubigeoService.obtenerUbigeo(
            departamento,
            provincia,
            distrito
        );

        if (!data) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Ubigeo no encontrado'
            });
        }

        res.status(200).json({
            ok: true,
            data
        });

    } catch (error) {
        console.error('Error al obtener ubigeo:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener ubigeo'
        });
    }
};

module.exports = {
    obtenerDepartamentos,
    obtenerProvincias,
    obtenerDistritos,
    obtenerUbigeo
};
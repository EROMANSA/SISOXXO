const express = require('express');

const router = express.Router();

const {
    obtenerDepartamentos,
    obtenerProvincias,
    obtenerDistritos,
    obtenerUbigeo
} = require('../controllers/ubigeo.controller');

router.get(
    '/departamentos',
    obtenerDepartamentos
);

router.get(
    '/provincias/:departamento',
    obtenerProvincias
);

router.get(
    '/distritos/:departamento/:provincia',
    obtenerDistritos
);

router.get(
    '/:departamento/:provincia/:distrito',
    obtenerUbigeo
);

module.exports = router;
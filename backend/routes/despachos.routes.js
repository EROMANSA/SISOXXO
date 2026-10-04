const express = require('express');

const {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho
} = require('../controllers/despachos.controller');

/*
const {
    autenticarToken
} = require('../middlewares/auth.middleware');


const {
    autorizarRoles
} = require('../middlewares/role.middleware');
 */
const autenticarToken = require('../middlewares/auth.middleware');

const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Lista los despachos del proveedor asociado
 * al usuario autenticado.
 *
 * Acceso:
 * PROVEEDOR
 */
router.get(
    '/',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    listarDespachos
);

/**
 * Obtiene un despacho específico del proveedor
 * autenticado, incluyendo su cabecera y detalle.
 *
 * Acceso:
 * PROVEEDOR
 */
router.get(
    '/:id',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    obtenerDespachoPorId
);

router.post(
    '/',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    crearDespacho
);

module.exports = router;

const express = require('express');

const {
    listarDespachos,
    obtenerDespachoPorId,
    crearDespacho,
    actualizarDespacho
} = require('../controllers/despachos.controller');

const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Lista los despachos asociados al usuario autenticado.
 *
 * Acceso:
 * PROVEEDOR, CONSULTOR
 */
router.get(
    '/',
    autenticarToken,
    autorizarRoles('PROVEEDOR', 'CONSULTOR'),
    listarDespachos
);

/**
 * Obtiene un despacho específico, incluyendo cabecera y detalle.
 *
 * Acceso:
 * PROVEEDOR, CONSULTOR
 */
router.get(
    '/:id',
    autenticarToken,
    autorizarRoles('PROVEEDOR', 'CONSULTOR'),
    obtenerDespachoPorId
);

/**
 * Crea un despacho.
 *
 * Acceso:
 * PROVEEDOR
 */
router.post(
    '/',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    crearDespacho
);

/**
 * Actualiza un despacho.
 *
 * Acceso:
 * PROVEEDOR
 */
router.put(
    '/:id',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    actualizarDespacho
);

module.exports = router;

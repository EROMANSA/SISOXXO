const express = require('express');
const router = express.Router();

const proveedoresController = require('../controllers/proveedores.controller');
const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const {
    listarProveedores,
    registrarProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    obtenerMiFicha,
    registrarMiFicha,
    actualizarMiFicha
} = require('../controllers/proveedores.controller');



// =====================================================
// MI FICHA
// Solo PROVEEDOR
// =====================================================

router.get(
    '/mi-ficha',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    proveedoresController.obtenerMiFicha
);

router.post(
    '/mi-ficha',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    proveedoresController.registrarMiFicha
);

router.put(
    '/mi-ficha',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    proveedoresController.actualizarMiFicha
);

// =====================================================
// CONSULTA DE PROVEEDORES
// ADMIN y CONSULTOR
// =====================================================

router.get(
    '/',
    autenticarToken,
    autorizarRoles('ADMIN', 'CONSULTOR'),
    proveedoresController.listarProveedores
);

router.get(
    '/:id',
    autenticarToken,
    autorizarRoles('ADMIN', 'CONSULTOR'),
    proveedoresController.obtenerProveedorPorId
);

// =====================================================
// MANTENIMIENTO DE PROVEEDORES
// Solo ADMIN
// =====================================================

router.post(
    '/',
    autenticarToken,
    autorizarRoles('ADMIN'),
    proveedoresController.registrarProveedor
);

router.put(
    '/:id',
    autenticarToken,
    autorizarRoles('ADMIN'),
    proveedoresController.actualizarProveedor
);

module.exports = router;
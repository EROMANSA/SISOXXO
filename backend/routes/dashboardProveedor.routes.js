
const express = require('express');

const {
    listarTiendasDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../controllers/dashboardProveedor.controller');

const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

// Listar todas las tiendas disponibles para los filtros
router.get(
    '/tiendas',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    listarTiendasDashboard
);

// Listar los estados de despacho disponibles para el filtro
router.get(
    '/estados',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    listarEstadosDespachoDashboard
);

// Obtener los indicadores del dashboard del proveedor
router.get(
    '/indicadores',
    autenticarToken,
    autorizarRoles('PROVEEDOR'),
    obtenerIndicadoresDashboard
);

module.exports = router;

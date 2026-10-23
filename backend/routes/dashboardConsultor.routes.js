
const express = require('express');

const {
    obtenerTiendaConsultor,
    listarRubrosDashboard,
    listarProveedoresDashboard,
    listarEstadosDespachoDashboard,
    obtenerIndicadoresDashboard
} = require('../controllers/dashboardConsultor.controller');

const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

// Obtener la tienda asignada al consultor
router.get(
    '/tienda',
    autenticarToken,
    autorizarRoles('CONSULTOR'),
    obtenerTiendaConsultor
);

// Listar rubros disponibles
router.get(
    '/rubros',
    autenticarToken,
    autorizarRoles('CONSULTOR'),
    listarRubrosDashboard
);

// Listar proveedores, opcionalmente filtrados por rubro
router.get(
    '/proveedores',
    autenticarToken,
    autorizarRoles('CONSULTOR'),
    listarProveedoresDashboard
);

// Listar estados de despacho
router.get(
    '/estados',
    autenticarToken,
    autorizarRoles('CONSULTOR'),
    listarEstadosDespachoDashboard
);

// Obtener indicadores del dashboard
router.get(
    '/indicadores',
    autenticarToken,
    autorizarRoles('CONSULTOR'),
    obtenerIndicadoresDashboard
);

module.exports = router;

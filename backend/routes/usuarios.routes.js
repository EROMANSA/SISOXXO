const express = require('express');

const {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    registrarUsuario,
    actualizarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    contarUsuariosPorEstado
} = require('../controllers/usuarios.controller');

const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

router.post(
    '/registro',
    registrarUsuario
);

router.get(
    '/',
    autenticarToken,
    autorizarRoles('ADMIN'),
    listarUsuarios
);

router.get(
    '/totales',
    autenticarToken,
    autorizarRoles('ADMIN'),
    contarUsuariosPorEstado
);

router.get(
    '/:id',
    autenticarToken,
    autorizarRoles('ADMIN'),
    obtenerUsuario
);



router.post(
    '/',
    autenticarToken,
    autorizarRoles('ADMIN'),
    crearUsuario
);

router.put(
    '/:id',
    autenticarToken,
    autorizarRoles('ADMIN'),
    actualizarUsuario
);

router.put(
    '/:id/aprobar',
    autenticarToken,
    autorizarRoles('ADMIN'),
    aprobarUsuario
);

router.put(
    '/:id/rechazar',
    autenticarToken,
    autorizarRoles('ADMIN'),
    rechazarUsuario
);



module.exports = router;
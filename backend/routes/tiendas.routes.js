
const express = require('express');

const {
    listarTiendas,
    obtenerTiendaPorId,
    registrarTienda,
    actualizarTienda
} = require('../controllers/tiendas.controller');

const autenticarToken = require('../middlewares/auth.middleware');
const autorizarRoles = require('../middlewares/role.middleware');

const router = express.Router();

router.use(autenticarToken);
router.use(autorizarRoles('ADMIN'));

router.get('/', listarTiendas);
router.get('/:id', obtenerTiendaPorId);
router.post('/', registrarTienda);
router.put('/:id', actualizarTienda);


module.exports = router;

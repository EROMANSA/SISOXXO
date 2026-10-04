const express = require('express');


const {
    login,
    obtenerPerfil
} = require('../controllers/auth.controller');

const autenticarToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);

router.get(
    '/me',
    autenticarToken,
    obtenerPerfil
);



module.exports = router;
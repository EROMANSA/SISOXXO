const express = require('express');

const router = express.Router();

const {
    obtenerTipoRubro,
    obtenerTipoDocumento,
    obtenerTipoDocSanitaria,
    obtenerRegimenTributario,
    obtenerCiiu,
    obtenerTipoTransaccion,
    obtenerTiendasOxxo,
    obtenerEstadoDespacho,
    obtenerUnidadMedida,
    obtenerTipoDespacho
} = require('../controllers/listas.controller');

router.get('/tipo-rubro', obtenerTipoRubro);

router.get('/tipo-documento', obtenerTipoDocumento);

router.get('/tipo-doc-sanitaria', obtenerTipoDocSanitaria);

router.get('/regimen-tributario', obtenerRegimenTributario);

router.get('/ciiu', obtenerCiiu);

router.get('/tipo-transaccion', obtenerTipoTransaccion);

router.get('/tiendas-oxxo', obtenerTiendasOxxo);

router.get('/estado-despacho', obtenerEstadoDespacho);

router.get('/unidad-medida', obtenerUnidadMedida);

router.get('/tipo-despacho', obtenerTipoDespacho);

module.exports = router;
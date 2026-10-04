const pool = require('../config/database');

const obtenerListaValores = async (codGrupo, tipoGrupo) => {
    const query = `
        SELECT
            codigo_valor,
            descripcion
        FROM "sisoxxo"."MAE_LISTA_VALORES"
        WHERE cod_grupo = $1
          AND tipo_grupo = $2
        ORDER BY orden NULLS LAST, descripcion
    `;

    const result = await pool.query(query, [codGrupo, tipoGrupo]);

    return result.rows;
};

const obtenerTipoRubro = async () => {
    return obtenerListaValores('0001', 'TIPO_RUBRO');
};

const obtenerTipoDocumento = async () => {
    return obtenerListaValores('0001', 'TIPO_DOC_SUNAT');
};

const obtenerTipoDocSanitaria = async () => {
    return obtenerListaValores('0001', 'TIPO_DOC_SANITARIA');
};

const obtenerRegimenTributario = async () => {
    return obtenerListaValores('0100', 'TIPO_REGIMEN');
};

const obtenerCiiu = async () => {
    return obtenerListaValores('0002', 'CODIGO_CIIU_SUNAT');
};

const obtenerTipoTransaccion = async () => {
    return obtenerListaValores('0001', 'TIPO_TRANSACCION');
};

const obtenerTiendasOxxo = async () => {
    return obtenerListaValores('0006', 'TIENDAS_OXXO');
};

const obtenerEstadoDespacho = async () => {
    return obtenerListaValores('0000', 'ESTADO_DESPACHO');
};

const obtenerUnidadMedida = async () => {
    return obtenerListaValores('0003', 'UNIDAD_MEDIDA');
};

const obtenerTipoDespacho = async () => {
    return obtenerListaValores('0001', 'TIPO_DESPACHO');
};

module.exports = {
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
};
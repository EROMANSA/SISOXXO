const pool = require('../config/database');

const obtenerDepartamentos = async () => {
    const query = `
        SELECT DISTINCT departamento
        FROM "sisoxxo"."MAE_UBIGEO"
        WHERE departamento IS NOT NULL
        ORDER BY departamento
    `;

    const result = await pool.query(query);

    return result.rows;
};

const obtenerProvincias = async (departamento) => {
    const query = `
        SELECT DISTINCT provincia
        FROM "sisoxxo"."MAE_UBIGEO"
        WHERE departamento = $1
          AND provincia IS NOT NULL
        ORDER BY provincia
    `;

    const result = await pool.query(query, [departamento]);

    return result.rows;
};

const obtenerDistritos = async (departamento, provincia) => {
    const query = `
        SELECT DISTINCT distrito
        FROM "sisoxxo"."MAE_UBIGEO"
        WHERE departamento = $1
          AND provincia = $2
          AND distrito IS NOT NULL
        ORDER BY distrito
    `;

    const result = await pool.query(query, [
        departamento,
        provincia
    ]);

    return result.rows;
};

const obtenerUbigeo = async (
    departamento,
    provincia,
    distrito
) => {
    const query = `
        SELECT
            ubigeo_inei,
            ubigeo_reniec,
            departamento,
            provincia,
            distrito
        FROM "sisoxxo"."MAE_UBIGEO"
        WHERE departamento = $1
          AND provincia = $2
          AND distrito = $3
        LIMIT 1
    `;

    const result = await pool.query(query, [
        departamento,
        provincia,
        distrito
    ]);

    return result.rows[0] || null;
};

module.exports = {
    obtenerDepartamentos,
    obtenerProvincias,
    obtenerDistritos,
    obtenerUbigeo
};
const pool = require('../config/database');

const obtenerUsuarioPorUsername = async (username) => {
    const query = `
        SELECT
            u.usuario_id,
            u.username,
            u.password_hash,
            u.correo,
            u.rol_id,
            r.codigo AS rol_codigo,
            r.nombre AS rol_nombre,
            u.proveedor_id,
            u.primer_ingreso,
            u.estado,
            u.estado_usuario,
            u.ultimo_acceso,
            u.create_date,
            u.update_date,
            p.razon_social
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."SEG_ROL" r
            ON r.rol_id = u.rol_id
        LEFT JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = u.proveedor_id
        WHERE LOWER(u.username) = LOWER($1)
        LIMIT 1
    `;

    const result = await pool.query(query, [username]);

    return result.rows[0] || null;
};

const actualizarUltimoAcceso = async (usuarioId) => {
    const query = `
        UPDATE sisoxxo."SEG_USUARIO"
        SET
            ultimo_acceso = CURRENT_TIMESTAMP,
            update_date = CURRENT_TIMESTAMP
        WHERE usuario_id = $1
        RETURNING
            usuario_id,
            username,
            ultimo_acceso,
            update_date
    `;

    const result = await pool.query(query, [usuarioId]);

    return result.rows[0] || null;
};

module.exports = {
    obtenerUsuarioPorUsername,
    actualizarUltimoAcceso
};
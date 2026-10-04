const pool = require('../config/database');

const listarUsuarios = async (filtro = 'TODOS') => {
    let whereClause = '';

    switch (filtro.toUpperCase()) {
        case 'ACTIVOS':
            whereClause = `
                WHERE u.estado = 'A'
                  AND u.estado_usuario = 'A'
            `;
            break;

        case 'PENDIENTES':
            whereClause = `
                WHERE u.estado_usuario = 'P'
            `;
            break;

        case 'RECHAZADOS':
            whereClause = `
                WHERE u.estado_usuario = 'R'
            `;
            break;

        case 'INACTIVOS':
    whereClause = `
        WHERE u.estado_usuario = 'A'
          AND u.estado = 'I'
    `;
    break;

        case 'TODOS':
        default:
            whereClause = '';
            break;
    }

    const query = `
        SELECT
            u.usuario_id,
            u.username,
            u.correo,
            u.rol_id,
            r.codigo AS rol_codigo,
            r.nombre AS rol_nombre,
            u.proveedor_id,
            p.razon_social AS proveedor_nombre,
            u.primer_ingreso,
            u.estado,
            u.estado_usuario,
            u.ultimo_acceso,
            u.create_date,
            u.update_date
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."SEG_ROL" r
            ON r.rol_id = u.rol_id
        LEFT JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = u.proveedor_id
        ${whereClause}
        ORDER BY
            CASE u.estado_usuario
                WHEN 'P' THEN 1
                WHEN 'A' THEN 2
                WHEN 'R' THEN 3
                ELSE 4
            END,
            u.usuario_id;
    `;

    const result = await pool.query(query);

    return result.rows;
};

const contarUsuariosPorEstado = async () => {
    const query = `
        SELECT
            COUNT(*) AS todos,

            COUNT(*) FILTER (
                WHERE estado_usuario = 'A'
                  AND estado = 'A'
            ) AS activos,

            COUNT(*) FILTER (
                WHERE estado_usuario = 'P'
            ) AS pendientes,

            COUNT(*) FILTER (
                WHERE estado_usuario = 'R'
            ) AS rechazados,

            COUNT(*) FILTER (
                WHERE estado_usuario = 'A'
                  AND estado = 'I'
            ) AS inactivos

        FROM sisoxxo."SEG_USUARIO";
    `;

    const result = await pool.query(query);

    return result.rows[0];
};

const obtenerUsuarioPorId = async (usuarioId) => {
    const query = `
        SELECT
            u.usuario_id,
            u.username,
            u.correo,
            u.rol_id,
            r.codigo AS rol_codigo,
            r.nombre AS rol_nombre,
            u.proveedor_id,
            p.razon_social AS proveedor_nombre,
            u.primer_ingreso,
            u.estado,
            u.estado_usuario,
            u.ultimo_acceso,
            u.create_date,
            u.update_date
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."SEG_ROL" r
            ON r.rol_id = u.rol_id
        LEFT JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = u.proveedor_id
        WHERE u.usuario_id = $1
    `;

    const result = await pool.query(query, [usuarioId]);

    return result.rows[0] || null;
};

const obtenerRolPorCodigo = async (codigo) => {
    const query = `
        SELECT
            rol_id,
            codigo,
            nombre,
            estado
        FROM sisoxxo."SEG_ROL"
        WHERE codigo = $1
          AND estado = 'A'
        LIMIT 1
    `;

    const result = await pool.query(query, [codigo]);

    return result.rows[0] || null;
};

const existeProveedor = async (proveedorId) => {
    const query = `
        SELECT
            proveedor_id,
            razon_social
        FROM sisoxxo."MAE_PROVEEDOR"
        WHERE proveedor_id = $1
        LIMIT 1
    `;

    const result = await pool.query(query, [proveedorId]);

    return result.rows[0] || null;
};

const crearUsuario = async ({
    username,
    passwordHash,
    correo,
    rolId,
    proveedorId
}) => {
    const query = `
        INSERT INTO sisoxxo."SEG_USUARIO"
        (
            username,
            password_hash,
            correo,
            rol_id,
            proveedor_id,
            primer_ingreso,
            estado,
            estado_usuario
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            'S',
            'A',
            'A'
        )
        RETURNING usuario_id
    `;

    const result = await pool.query(query, [
        username,
        passwordHash,
        correo || null,
        rolId,
        proveedorId || null
    ]);

    return result.rows[0];
};

const registrarUsuario = async ({
    username,
    passwordHash,
    correo,
    rolId
}) => {

    const query = `
        INSERT INTO sisoxxo."SEG_USUARIO"
        (
            username,
            password_hash,
            correo,
            rol_id,
            proveedor_id,
            primer_ingreso,
            estado,
            estado_usuario
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            NULL,
            'S',
            'I',
            'P'
        )
        RETURNING usuario_id
    `;

    const result = await pool.query(query, [
        username,
        passwordHash,
        correo || null,
        rolId
    ]);

    return result.rows[0];
};

const actualizarUsuario = async ({
    usuarioId,
    username,
    correo,
    rolId,
    proveedorId,
    primerIngreso,
    passwordHash,
    estado
}) => {

    const campos = [
        'username = $1',
        'correo = $2',
        'rol_id = $3',
        'proveedor_id = $4',
        'primer_ingreso = $5',
        'estado = $6',
        'update_date = CURRENT_TIMESTAMP'
    ];

    const values = [
        username,
        correo || null,
        rolId,
        proveedorId || null,
        primerIngreso || 'S',
        estado
    ];

    if (passwordHash) {
        campos.push(`password_hash = $${values.length + 1}`);
        values.push(passwordHash);
    }

    values.push(usuarioId);

    const query = `
        UPDATE sisoxxo."SEG_USUARIO"
        SET
            ${campos.join(', ')}
        WHERE usuario_id = $${values.length}
        RETURNING usuario_id
    `;

    const result = await pool.query(query, values);

    return result.rows[0] || null;
};

const obtenerUsuarioParaEdicion = async (usuarioId) => {

    const query = `
        SELECT
            u.usuario_id,
            u.username,
            u.correo,
            u.rol_id,
            r.codigo AS rol_codigo,
            u.proveedor_id,
            u.primer_ingreso,
            u.estado,
            u.estado_usuario
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."SEG_ROL" r
            ON r.rol_id = u.rol_id
        WHERE u.usuario_id = $1
    `;

    const result = await pool.query(query, [usuarioId]);

    return result.rows[0] || null;
};
const aprobarUsuario = async ({
    usuarioId,
    rolId
}) => {

    const query = `
        UPDATE sisoxxo."SEG_USUARIO"
        SET
            rol_id = $1,
            proveedor_id = NULL,
            estado = 'A',
            estado_usuario = 'A',
            primer_ingreso = 'S',
            update_date = CURRENT_TIMESTAMP
        WHERE usuario_id = $2
          AND estado_usuario IN ('P', 'R')
        RETURNING usuario_id
    `;

    const result = await pool.query(query, [
        rolId,
        usuarioId
    ]);

    return result.rows[0] || null;
};


const rechazarUsuario = async (usuarioId) => {

    const query = `
        UPDATE sisoxxo."SEG_USUARIO"
        SET
            estado_usuario = 'R',
            update_date = CURRENT_TIMESTAMP
        WHERE usuario_id = $1
          AND estado_usuario = 'P'
        RETURNING usuario_id
    `;

    const result = await pool.query(query, [usuarioId]);

    return result.rows[0] || null;
};

module.exports = {
    listarUsuarios,
    obtenerUsuarioPorId,
    obtenerRolPorCodigo,
    existeProveedor,
    crearUsuario,
    registrarUsuario,
    obtenerUsuarioParaEdicion,
    actualizarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    contarUsuariosPorEstado
};
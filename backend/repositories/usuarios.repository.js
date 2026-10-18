const pool = require('../config/database');


const listarUsuarios = async (
    filtro = 'TODOS',
    campo = '',
    busqueda = ''
) => {
    const filtrosPermitidos = [
        'TODOS',
        'ACTIVOS',
        'PENDIENTES',
        'RECHAZADOS',
        'INACTIVOS'
    ];

    const camposPermitidos = {
        usuario: 'u.username',
        correo: 'u.correo',
        rol: 'r.nombre',
        tienda: `CONCAT(
            COALESCE(u.cod_tienda, ''),
            ' ',
            COALESCE(t.descripcion, '')
        )`,
        proveedor: 'p.razon_social',
        estado: `CASE
            WHEN u.estado_usuario = 'P' THEN 'PENDIENTE'
            WHEN u.estado_usuario = 'R' THEN 'RECHAZADO'
            WHEN u.estado = 'I' THEN 'INACTIVO'
            WHEN u.estado_usuario = 'A' AND u.estado = 'A' THEN 'ACTIVO'
            ELSE ''
        END`
    };

    const filtroNormalizado = String(filtro || 'TODOS')
        .trim()
        .toUpperCase();

    if (!filtrosPermitidos.includes(filtroNormalizado)) {
        const error = new Error('Filtro de usuarios no válido');
        error.codigo = 'FILTRO_INVALIDO';
        throw error;
    }

    const campoNormalizado = String(campo || '').trim().toLowerCase();
    const busquedaNormalizada = String(busqueda || '').trim();

    if (
        campoNormalizado &&
        !Object.prototype.hasOwnProperty.call(
            camposPermitidos,
            campoNormalizado
        )
    ) {
        const error = new Error('Campo de búsqueda no válido');
        error.codigo = 'CAMPO_BUSQUEDA_INVALIDO';
        throw error;
    }

    const condiciones = [];
    const valores = [];

    switch (filtroNormalizado) {
        case 'ACTIVOS':
            condiciones.push(
                "u.estado = 'A' AND u.estado_usuario = 'A'"
            );
            break;

        case 'PENDIENTES':
            condiciones.push("u.estado_usuario = 'P'");
            break;

        case 'RECHAZADOS':
            condiciones.push("u.estado_usuario = 'R'");
            break;

        case 'INACTIVOS':
            condiciones.push(
                "u.estado_usuario = 'A' AND u.estado = 'I'"
            );
            break;
    }

    if (campoNormalizado && busquedaNormalizada) {
        valores.push(`%${busquedaNormalizada}%`);

        condiciones.push(
            `${camposPermitidos[campoNormalizado]} ILIKE $${valores.length}`
        );
    }

    const whereClause = condiciones.length
        ? `WHERE ${condiciones.join(' AND ')}`
        : '';

    const query = `
        SELECT
            u.usuario_id,
            u.username,
            u.correo,
            u.rol_id,
            u.cod_tienda,
            t.descripcion AS tienda_descripcion,
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
        LEFT JOIN sisoxxo."MAE_TIENDA" t
            ON t.tienda_id = u.cod_tienda
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

    const result = await pool.query(query, valores);

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
        u.cod_tienda,
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
    proveedorId,
    codTienda
}) => {
    const query = `
        INSERT INTO sisoxxo."SEG_USUARIO"
        (
            username,
            password_hash,
            correo,
            rol_id,
            proveedor_id,
            cod_tienda,
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
            $6,
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
        proveedorId || null,
        codTienda || null
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
    codTienda,
    primerIngreso,
    passwordHash,
    estado
}) => {
    const campos = [
        'username = $1',
        'correo = $2',
        'rol_id = $3',
        'proveedor_id = $4',
        'cod_tienda = $5',
        'primer_ingreso = $6',
        'estado = $7',
        'update_date = CURRENT_TIMESTAMP'
    ];

    const values = [
        username,
        correo || null,
        rolId,
        proveedorId || null,
        codTienda || null,
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
            u.cod_tienda,
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
    rolId,
    codTienda
}) => {
    const query = `
        UPDATE sisoxxo."SEG_USUARIO"
        SET
            rol_id = $1,
            proveedor_id = NULL,
            cod_tienda = $2,
            estado = 'A',
            estado_usuario = 'A',
            primer_ingreso = 'S',
            update_date = CURRENT_TIMESTAMP
        WHERE usuario_id = $3
          AND estado_usuario IN ('P', 'R')
        RETURNING usuario_id
    `;

    const result = await pool.query(query, [
        rolId,
        codTienda || null,
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


const obtenerTiendaPorId = async (tiendaId) => {
    const query = `
        SELECT
            tienda_id,
            descripcion
        FROM sisoxxo."MAE_TIENDA"
        WHERE tienda_id = $1
          AND status = 'A'
        LIMIT 1
    `;

    const result = await pool.query(query, [tiendaId]);

    return result.rows[0] || null;
};


const listarTiendasActivas = async () => {
    const query = `
        SELECT
            tienda_id,
            descripcion
        FROM sisoxxo."MAE_TIENDA"
        WHERE status = 'A'
        ORDER BY tienda_id
    `;

    const result = await pool.query(query);

    return result.rows;
};



module.exports = {
    listarUsuarios,
    obtenerUsuarioPorId,
    obtenerRolPorCodigo,
    obtenerTiendaPorId,
    listarTiendasActivas,
    existeProveedor,
    crearUsuario,
    registrarUsuario,
    obtenerUsuarioParaEdicion,
    actualizarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    contarUsuariosPorEstado
};
const pool = require('../config/database');

const listarTiendas = async () => {
    const query = `
        SELECT
            tienda_id,
            descripcion,
            departamento,
            provincia,
            ciudad,
            direccion,
            ubigeo,
            zona,
            administrador,
            correo,
            telefono,
            status,
            create_date,
            create_by,
            last_update,
            update_by
        FROM sisoxxo."MAE_TIENDA"
        ORDER BY tienda_id
    `;

    const result = await pool.query(query);
    return result.rows;
};

const obtenerTiendaPorId = async (tiendaId) => {
    const query = `
        SELECT *
        FROM sisoxxo."MAE_TIENDA"
        WHERE tienda_id = $1
    `;

    const result = await pool.query(query, [tiendaId]);
    return result.rows[0] || null;
};

const registrarTienda = async (datos, usuarioId) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existente = await client.query(
            `SELECT 1
             FROM sisoxxo."MAE_TIENDA"
             WHERE tienda_id = $1
             FOR UPDATE`,
            [datos.tienda_id]
        );

        if (existente.rowCount > 0) {
            const error = new Error(
                `El código de tienda ${datos.tienda_id} ya existe.`
            );
            error.statusCode = 409;
            error.code = 'TIENDA_DUPLICADA';
            throw error;
        }

        const query = `
            INSERT INTO sisoxxo."MAE_TIENDA"
            (
                tienda_id,
                descripcion,
                departamento,
                provincia,
                ciudad,
                direccion,
                ubigeo,
                zona,
                administrador,
                correo,
                telefono,
                status,
                create_date,
                create_by
            )
            VALUES
            (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12,
                CURRENT_DATE, $13
            )
            RETURNING *
        `;

        const values = [
            datos.tienda_id,
            datos.descripcion || null,
            datos.departamento || null,
            datos.provincia || null,
            datos.ciudad || null,
            datos.direccion || null,
            datos.ubigeo ?? null,
            datos.zona || null,
            datos.administrador || null,
            datos.correo || null,
            datos.telefono || null,
            datos.status || 'A',
            usuarioId
        ];

        const result = await client.query(query, values);

        await client.query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');

        if (error.code === '23505') {
            error.statusCode = 409;
            error.code = 'TIENDA_DUPLICADA';
            error.message = 'El código de tienda ya existe.';
        }

        throw error;
    } finally {
        client.release();
    }
};


const actualizarTienda = async (tiendaId, datos, usuarioId) => {
    const query = `
        UPDATE sisoxxo."MAE_TIENDA"
        SET
            descripcion = $1,
            departamento = $2,
            provincia = $3,
            ciudad = $4,
            direccion = $5,
            ubigeo = $6,
            zona = $7,
            administrador = $8,
            correo = $9,
            telefono = $10,
            status = $11,
            last_update = CURRENT_DATE,
            update_by = $12
        WHERE tienda_id = $13
        RETURNING *
    `;

    const values = [
        datos.descripcion || null,
        datos.departamento || null,
        datos.provincia || null,
        datos.ciudad || null,
        datos.direccion || null,
        datos.ubigeo ?? null,
        datos.zona || null,
        datos.administrador || null,
        datos.correo || null,
        datos.telefono || null,
        datos.status || 'A',
        usuarioId,
        tiendaId
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
        const error = new Error('Tienda no encontrada.');
        error.statusCode = 404;
        error.code = 'TIENDA_NO_ENCONTRADA';
        throw error;
    }

    return result.rows[0];
};


module.exports = {
    listarTiendas,
    obtenerTiendaPorId,
    registrarTienda,
    actualizarTienda
};

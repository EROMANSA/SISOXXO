const pool = require('../config/database');

const listarProveedores = async () => {

    const query = `
        SELECT
            p.proveedor_id,

            p.tipo_rubro,
            lr.descripcion AS tipo_rubro_descripcion,

            p.tipo_documento,
            ld.descripcion AS tipo_documento_descripcion,

            p.nro_documento,
            p.nombre,
            p.apellido_paterno,
            p.apellido_materno,
            p.razon_social,
            p.nombre_corto,

            p.departamento,
            p.provincia,
            p.ciudad,
            p.direccion,
            p.ubigeo,
            p.correo,
            p.telefono,
            p.pagina_web,

            p.ciiu,
            lc.descripcion AS ciiu_descripcion,

            p.calificacion,
            p.representante_legal,
            p.regimen_tributario,
            p.nro_trabajadores,

            p.tipo_doc_sanitaria,
            p.doc_autoriza_sanitaria,
            p.f_ini_doc_sanita,
            p.f_fin_doc_sanita,

            p.doc_habi_vehicular,
            p.f_ini_doc_vehi,
            p.f_fin_doc_vehi,

            p.status,
            p.create_date,
            p.create_by,
            p.last_update,
            p.update_by

        FROM sisoxxo."MAE_PROVEEDOR" p

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" lr
            ON lr.cod_grupo = '0001'
            AND lr.tipo_grupo = 'TIPO_RUBRO'
            AND lr.codigo_valor = p.tipo_rubro

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" ld
            ON ld.cod_grupo = '0001'
            AND ld.tipo_grupo = 'TIPO_DOC_SUNAT'
            AND ld.codigo_valor = p.tipo_documento

        LEFT JOIN sisoxxo."MAE_LISTA_VALORES" lc
            ON lc.cod_grupo = '0002'
            AND lc.tipo_grupo = 'CODIGO_CIIU_SUNAT'
            AND lc.codigo_valor = p.ciiu

        ORDER BY
            p.proveedor_id
    `;

    const result = await pool.query(query);

    return result.rows;
};

const registrarProveedor = async (datos) => {

    const query = `
        INSERT INTO sisoxxo."MAE_PROVEEDOR"
        (
            proveedor_id,
            tipo_rubro,
            tipo_documento,
            nro_documento,
            nombre,
            apellido_paterno,
            apellido_materno,
            razon_social,
            nombre_corto,
            departamento,
            provincia,
            ciudad,
            direccion,
            ubigeo,
            correo,
            telefono,
            pagina_web,
            ciiu,
            representante_legal,
            regimen_tributario,
            tipo_doc_sanitaria,
            doc_autoriza_sanitaria,
            f_ini_doc_sanita,
            f_fin_doc_sanita,
            doc_habi_vehicular,
            f_ini_doc_vehi,
            f_fin_doc_vehi,
            status,
            create_date,
            create_by
        )
        VALUES
        (
            COALESCE(
                (
                    SELECT MAX(proveedor_id)
                    FROM sisoxxo."MAE_PROVEEDOR"
                ),
                0
            ) + 1,
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20,
            $21,
            $22,
            $23,
            $24,
            $25,
            $26,
            $27,
            CURRENT_DATE,
            $28
        )
        RETURNING *
    `;

    const values = [
        datos.tipo_rubro,
        datos.tipo_documento,
        datos.nro_documento,
        datos.nombre,
        datos.apellido_paterno,
        datos.apellido_materno,
        datos.razon_social,
        datos.nombre_corto,
        datos.departamento,
        datos.provincia,
        datos.ciudad,
        datos.direccion,
        datos.ubigeo,
        datos.correo,
        datos.telefono,
        datos.pagina_web,
        datos.ciiu,
        datos.representante_legal,
        datos.regimen_tributario,
        datos.tipo_doc_sanitaria,
        datos.doc_autoriza_sanitaria,
        datos.f_ini_doc_sanita,
        datos.f_fin_doc_sanita,
        datos.doc_habi_vehicular,
        datos.f_ini_doc_vehi,
        datos.f_fin_doc_vehi,
        datos.status,
        datos.create_by
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const obtenerProveedorPorId = async (proveedorId) => {
    const query = `
        SELECT
            proveedor_id,
            tipo_rubro,
            tipo_documento,
            nro_documento,
            nombre,
            apellido_paterno,
            apellido_materno,
            razon_social,
            nombre_corto,
            departamento,
            provincia,
            ciudad,
            direccion,
            ubigeo,
            correo,
            telefono,
            pagina_web,
            ciiu,
            calificacion,
            representante_legal,
            regimen_tributario,
            nro_trabajadores,
            tipo_doc_sanitaria,
            doc_autoriza_sanitaria,
            f_ini_doc_sanita,
            f_fin_doc_sanita,
            doc_habi_vehicular,
            f_ini_doc_vehi,
            f_fin_doc_vehi,
            status,
            create_date,
            create_by,
            last_update,
            update_by
        FROM sisoxxo."MAE_PROVEEDOR"
        WHERE proveedor_id = $1
    `;

    const result = await pool.query(query, [proveedorId]);

    return result.rows[0] || null;
};

const actualizarProveedor = async (proveedorId, datos) => {

    const query = `
        UPDATE sisoxxo."MAE_PROVEEDOR"
        SET
            tipo_rubro = $1,
            tipo_documento = $2,
            nro_documento = $3,
            nombre = $4,
            apellido_paterno = $5,
            apellido_materno = $6,
            razon_social = $7,
            nombre_corto = $8,
            departamento = $9,
            provincia = $10,
            ciudad = $11,
            direccion = $12,
            ubigeo = $13,
            correo = $14,
            telefono = $15,
            pagina_web = $16,
            ciiu = $17,
            representante_legal = $18,
            regimen_tributario = $19,
            tipo_doc_sanitaria = $20,
            doc_autoriza_sanitaria = $21,
            f_ini_doc_sanita = $22,
            f_fin_doc_sanita = $23,
            doc_habi_vehicular = $24,
            f_ini_doc_vehi = $25,
            f_fin_doc_vehi = $26,
            status = $27,
            last_update = CURRENT_DATE,
            update_by = $28
        WHERE proveedor_id = $29
        RETURNING *
    `;

    const values = [
        datos.tipo_rubro,
        datos.tipo_documento,
        datos.nro_documento,
        datos.nombre,
        datos.apellido_paterno,
        datos.apellido_materno,
        datos.razon_social,
        datos.nombre_corto,
        datos.departamento,
        datos.provincia,
        datos.ciudad,
        datos.direccion,
        datos.ubigeo,
        datos.correo,
        datos.telefono,
        datos.pagina_web,
        datos.ciiu,
        datos.representante_legal,
        datos.regimen_tributario,
        datos.tipo_doc_sanitaria,
        datos.doc_autoriza_sanitaria,
        datos.f_ini_doc_sanita,
        datos.f_fin_doc_sanita,
        datos.doc_habi_vehicular,
        datos.f_ini_doc_vehi,
        datos.f_fin_doc_vehi,
        datos.status,
        datos.update_by,
        proveedorId
    ];

    const result = await pool.query(query, values);

    return result.rows[0] || null;
};

const obtenerMiFicha = async (usuarioId) => {

    const query = `
        SELECT
            p.proveedor_id,
            p.tipo_rubro,
            p.tipo_documento,
            p.nro_documento,
            p.nombre,
            p.apellido_paterno,
            p.apellido_materno,
            p.razon_social,
            p.nombre_corto,
            p.departamento,
            p.provincia,
            p.ciudad,
            p.direccion,
            p.ubigeo,
            p.correo,
            p.telefono,
            p.pagina_web,
            p.ciiu,
            p.calificacion,
            p.representante_legal,
            p.regimen_tributario,
            p.nro_trabajadores,
            p.tipo_doc_sanitaria,
            p.doc_autoriza_sanitaria,
            p.f_ini_doc_sanita,
            p.f_fin_doc_sanita,
            p.doc_habi_vehicular,
            p.f_ini_doc_vehi,
            p.f_fin_doc_vehi,
            p.status,
            p.create_date,
            p.create_by,
            p.last_update,
            p.update_by
        FROM sisoxxo."SEG_USUARIO" u
        INNER JOIN sisoxxo."MAE_PROVEEDOR" p
            ON p.proveedor_id = u.proveedor_id
        WHERE u.usuario_id = $1
    `;

    const result = await pool.query(query, [usuarioId]);

    return result.rows[0] || null;
};

const registrarMiFicha = async (usuarioId, datos) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // =====================================================
        // 1. Verificar que el usuario exista y no tenga ficha
        // =====================================================

        const usuarioQuery = `
            SELECT
                usuario_id,
                proveedor_id
            FROM sisoxxo."SEG_USUARIO"
            WHERE usuario_id = $1
            FOR UPDATE
        `;

        const usuarioResult = await client.query(
            usuarioQuery,
            [usuarioId]
        );

        if (usuarioResult.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = usuarioResult.rows[0];

        if (usuario.proveedor_id !== null) {
            throw new Error(
                'El usuario ya tiene una ficha de proveedor asociada'
            );
        }

        // =====================================================
        // 2. Generar nuevo proveedor_id
        // =====================================================

        const idQuery = `
            SELECT COALESCE(
                MAX(proveedor_id),
                0
            ) + 1 AS proveedor_id
            FROM sisoxxo."MAE_PROVEEDOR"
        `;

        const idResult = await client.query(idQuery);

        const proveedorId = idResult.rows[0].proveedor_id;

        // =====================================================
        // 3. Registrar MAE_PROVEEDOR
        // =====================================================

        const insertQuery = `
            INSERT INTO sisoxxo."MAE_PROVEEDOR"
            (
                proveedor_id,
                tipo_rubro,
                tipo_documento,
                nro_documento,
                nombre,
                apellido_paterno,
                apellido_materno,
                razon_social,
                nombre_corto,
                departamento,
                provincia,
                ciudad,
                direccion,
                ubigeo,
                correo,
                telefono,
                pagina_web,
                ciiu,
                representante_legal,
                regimen_tributario,
                tipo_doc_sanitaria,
                doc_autoriza_sanitaria,
                f_ini_doc_sanita,
                f_fin_doc_sanita,
                doc_habi_vehicular,
                f_ini_doc_vehi,
                f_fin_doc_vehi,
                status,
                create_date,
                create_by
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15,
                $16,
                $17,
                $18,
                $19,
                $20,
                $21,
                $22,
                $23,
                $24,
                $25,
                $26,
                $27,
                $28,
                CURRENT_DATE,
                $29
            )
            RETURNING *
        `;

        const values = [
            proveedorId,
            datos.tipo_rubro,
            datos.tipo_documento,
            datos.nro_documento,
            datos.nombre,
            datos.apellido_paterno,
            datos.apellido_materno,
            datos.razon_social,
            datos.nombre_corto,
            datos.departamento,
            datos.provincia,
            datos.ciudad,
            datos.direccion,
            datos.ubigeo,
            datos.correo,
            datos.telefono,
            datos.pagina_web,
            datos.ciiu,
            datos.representante_legal,
            datos.regimen_tributario,
            datos.tipo_doc_sanitaria,
            datos.doc_autoriza_sanitaria,
            datos.f_ini_doc_sanita,
            datos.f_fin_doc_sanita,
            datos.doc_habi_vehicular,
            datos.f_ini_doc_vehi,
            datos.f_fin_doc_vehi,
            datos.status || 'A',
            usuarioId
        ];

        const proveedorResult = await client.query(
            insertQuery,
            values
        );

        const proveedor = proveedorResult.rows[0];

        // =====================================================
        // 4. Asociar proveedor al usuario
        // =====================================================

        const updateUsuarioQuery = `
            UPDATE sisoxxo."SEG_USUARIO"
            SET
                proveedor_id = $1,
                update_date = CURRENT_TIMESTAMP
            WHERE usuario_id = $2
        `;

        await client.query(
            updateUsuarioQuery,
            [proveedorId, usuarioId]
        );

        // =====================================================
        // 5. Confirmar transacción
        // =====================================================

        await client.query('COMMIT');

        return proveedor;

    } catch (error) {

        await client.query('ROLLBACK');

        throw error;

    } finally {

        client.release();
    }
};

const actualizarMiFicha = async (usuarioId, datos) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // =====================================================
        // 1. Obtener proveedor asociado al usuario
        // =====================================================

        const usuarioQuery = `
            SELECT
                usuario_id,
                proveedor_id
            FROM sisoxxo."SEG_USUARIO"
            WHERE usuario_id = $1
            FOR UPDATE
        `;

        const usuarioResult = await client.query(
            usuarioQuery,
            [usuarioId]
        );

        if (usuarioResult.rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const usuario = usuarioResult.rows[0];

        if (usuario.proveedor_id === null) {
            throw new Error(
                'El usuario no tiene una ficha de proveedor asociada'
            );
        }

        const proveedorId = usuario.proveedor_id;

        // =====================================================
        // 2. Actualizar ficha
        // =====================================================

        const updateQuery = `
            UPDATE sisoxxo."MAE_PROVEEDOR"
            SET
                tipo_rubro = $1,
                tipo_documento = $2,
                nro_documento = $3,
                nombre = $4,
                apellido_paterno = $5,
                apellido_materno = $6,
                razon_social = $7,
                nombre_corto = $8,
                departamento = $9,
                provincia = $10,
                ciudad = $11,
                direccion = $12,
                ubigeo = $13,
                correo = $14,
                telefono = $15,
                pagina_web = $16,
                ciiu = $17,
                representante_legal = $18,
                regimen_tributario = $19,
                tipo_doc_sanitaria = $20,
                doc_autoriza_sanitaria = $21,
                f_ini_doc_sanita = $22,
                f_fin_doc_sanita = $23,
                doc_habi_vehicular = $24,
                f_ini_doc_vehi = $25,
                f_fin_doc_vehi = $26,
                status = $27,
                last_update = CURRENT_DATE,
                update_by = $28
            WHERE proveedor_id = $29
            RETURNING *
        `;

        const values = [
            datos.tipo_rubro,
            datos.tipo_documento,
            datos.nro_documento,
            datos.nombre,
            datos.apellido_paterno,
            datos.apellido_materno,
            datos.razon_social,
            datos.nombre_corto,
            datos.departamento,
            datos.provincia,
            datos.ciudad,
            datos.direccion,
            datos.ubigeo,
            datos.correo,
            datos.telefono,
            datos.pagina_web,
            datos.ciiu,
            datos.representante_legal,
            datos.regimen_tributario,
            datos.tipo_doc_sanitaria,
            datos.doc_autoriza_sanitaria,
            datos.f_ini_doc_sanita,
            datos.f_fin_doc_sanita,
            datos.doc_habi_vehicular,
            datos.f_ini_doc_vehi,
            datos.f_fin_doc_vehi,
            datos.status || 'A',
            usuarioId,
            proveedorId
        ];

        const result = await client.query(
            updateQuery,
            values
        );

        if (result.rows.length === 0) {
            throw new Error(
                'No se encontró la ficha del proveedor'
            );
        }

        await client.query('COMMIT');

        return result.rows[0];

    } catch (error) {

        await client.query('ROLLBACK');

        throw error;

    } finally {

        client.release();
    }
};

module.exports = {
    listarProveedores,
    registrarProveedor,
    obtenerProveedorPorId,
    actualizarProveedor,
    obtenerMiFicha,
    registrarMiFicha,
    actualizarMiFicha
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    obtenerUsuarioPorUsername,
    actualizarUltimoAcceso
} = require('../repositories/auth.repository');

const autenticarUsuario = async (username, password) => {

    const usuario = await obtenerUsuarioPorUsername(username);

    if (!usuario) {
        const error = new Error('Usuario o contraseña incorrectos');
        error.codigo = 'CREDENCIALES_INVALIDAS';
        throw error;
    }

    if (usuario.estado !== 'A') {
        const error = new Error('El usuario se encuentra inactivo');
        error.codigo = 'USUARIO_INACTIVO';
        throw error;
    }

    if (usuario.estado_usuario !== 'A') {
        const error = new Error('El usuario no se encuentra habilitado para ingresar');
        error.codigo = 'USUARIO_NO_HABILITADO';
        throw error;
    }

    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        const error = new Error('Usuario o contraseña incorrectos');
        error.codigo = 'CREDENCIALES_INVALIDAS';
        throw error;
    }

    await actualizarUltimoAcceso(usuario.usuario_id);

    const payload = {
        usuario_id: usuario.usuario_id,
        username: usuario.username,
        rol_codigo: usuario.rol_codigo,
        rol_nombre: usuario.rol_nombre,
        proveedor_id: usuario.proveedor_id,
        primer_ingreso: usuario.primer_ingreso
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '8h'
        }
    );

    return {
        token,
        usuario: {
            usuario_id: usuario.usuario_id,
            username: usuario.username,
            correo: usuario.correo,
            rol_codigo: usuario.rol_codigo,
            rol_nombre: usuario.rol_nombre,
            proveedor_id: usuario.proveedor_id,
            primer_ingreso: usuario.primer_ingreso
        }
    };
};

module.exports = {
    autenticarUsuario
};
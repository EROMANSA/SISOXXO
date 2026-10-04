const { autenticarUsuario } = require('../services/auth.service');

const obtenerPerfil = async (req, res) => {
    return res.status(200).json({
        ok: true,
        usuario: req.user
    });
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario y contraseña son obligatorios'
            });
        }

        const resultado = await autenticarUsuario(
            username.trim(),
            password
        );

        return res.status(200).json({
            ok: true,
            mensaje: 'Autenticación exitosa',
            token: resultado.token,
            usuario: resultado.usuario
        });

    } catch (error) {

        if (error.codigo === 'CREDENCIALES_INVALIDAS') {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        if (error.codigo === 'USUARIO_INACTIVO') {
            return res.status(403).json({
                ok: false,
                mensaje: 'El usuario se encuentra inactivo'
            });
        }

        if (error.codigo === 'USUARIO_NO_HABILITADO') {
            return res.status(403).json({
                ok: false,
                mensaje: 'El usuario no se encuentra habilitado para ingresar'
            });
        }

        console.error('Error en login:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno durante la autenticación'
        });
    }
};

module.exports = {
    login,
    obtenerPerfil
};
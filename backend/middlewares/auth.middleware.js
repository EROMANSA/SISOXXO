const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token de autenticación requerido'
            });
        }

        const partes = authHeader.split(' ');

        if (
            partes.length !== 2 ||
            partes[0] !== 'Bearer' ||
            !partes[1]
        ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Formato de autorización inválido'
            });
        }

        const token = partes[1];

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = payload;

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                ok: false,
                mensaje: 'El token de autenticación ha expirado'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token de autenticación inválido'
            });
        }

        console.error('Error en autenticación:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno de autenticación'
        });
    }
};

module.exports = autenticarToken;
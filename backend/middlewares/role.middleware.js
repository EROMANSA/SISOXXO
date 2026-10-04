const autorizarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario no autenticado'
            });
        }

        if (!rolesPermitidos.includes(req.user.rol_codigo)) {
            return res.status(403).json({
                ok: false,
                mensaje: 'No tiene permisos para acceder a este recurso'
            });
        }

        next();
    };
};

module.exports = autorizarRoles;
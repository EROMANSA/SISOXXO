const {
    listarUsuariosService,
    obtenerUsuarioService,
    crearUsuarioService,
    registrarUsuarioService,
    actualizarUsuarioService,
    aprobarUsuarioService,
    rechazarUsuarioService,
    contarUsuariosPorEstadoService
} = require('../services/usuarios.service');

const listarUsuarios = async (req, res) => {
    try {
        const filtro = req.query.filtro || 'TODOS';

        const usuarios = await listarUsuariosService(filtro);

        return res.status(200).json({
            ok: true,
            usuarios
        });

    } catch (error) {

        if (error.codigo === 'FILTRO_INVALIDO') {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al listar usuarios:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al listar usuarios'
        });
    }
};
const contarUsuariosPorEstado = async (req, res) => {
    try {
        const totales = await contarUsuariosPorEstadoService();

        return res.status(200).json({
            ok: true,
            totales
        });

    } catch (error) {
        console.error('Error al obtener totales de usuarios:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'No fue posible obtener los totales de usuarios.'
        });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await obtenerUsuarioService(
            req.params.id
        );

        return res.status(200).json({
            ok: true,
            usuario
        });

    } catch (error) {

        if (error.codigo === 'ID_INVALIDO') {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (error.codigo === 'USUARIO_NO_ENCONTRADO') {
            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al obtener usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al obtener usuario'
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const {
            username,
            password,
            correo,
            rolCodigo,
            proveedorId
        } = req.body;

        const usuario = await crearUsuarioService({
            username,
            password,
            correo,
            rolCodigo,
            proveedorId
        });

        return res.status(201).json({
            ok: true,
            mensaje: 'Usuario creado correctamente',
            usuario
        });

    } catch (error) {

        if (
            error.codigo === 'DATOS_OBLIGATORIOS' ||
            error.codigo === 'PASSWORD_INVALIDO' ||
            error.codigo === 'ROL_INVALIDO' ||
            error.codigo === 'PROVEEDOR_OBLIGATORIO' ||
            error.codigo === 'PROVEEDOR_NO_PERMITIDO'
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (
            error.codigo === 'ROL_NO_ENCONTRADO' ||
            error.codigo === 'PROVEEDOR_NO_ENCONTRADO'
        ) {
            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (error.codigo === 'USERNAME_DUPLICADO') {
            return res.status(409).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al crear usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al crear usuario'
        });
    }
};

const registrarUsuario = async (req, res) => {

    try {

        const {
            username,
            password,
            correo
        } = req.body;

        const usuario = await registrarUsuarioService({
            username,
            password,
            correo
        });

        return res.status(201).json({
            ok: true,
            mensaje: 'Solicitud de registro enviada correctamente',
            usuario
        });

    } catch (error) {

        if (
            error.codigo === 'DATOS_OBLIGATORIOS' ||
            error.codigo === 'PASSWORD_INVALIDO'
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (error.codigo === 'ROL_NO_ENCONTRADO') {
            return res.status(500).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (error.codigo === 'USERNAME_DUPLICADO') {
            return res.status(409).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al registrar usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al registrar usuario'
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {

        const {
    username,
    correo,
    rolCodigo,
    proveedorId,
    primerIngreso,
    password,
    estado
} = req.body;

        const usuario = await actualizarUsuarioService({
    usuarioId: req.params.id,
    username,
    correo,
    rolCodigo,
    proveedorId,
    primerIngreso,
    password,
    estado
});

        return res.status(200).json({
            ok: true,
            mensaje: 'Usuario actualizado correctamente',
            usuario
        });

    } catch (error) {

        if (
            error.codigo === 'ID_INVALIDO' ||
            error.codigo === 'DATOS_OBLIGATORIOS' ||
            error.codigo === 'PASSWORD_INVALIDO' ||
            error.codigo === 'ROL_INVALIDO' ||
            error.codigo === 'PROVEEDOR_OBLIGATORIO' ||
            error.codigo === 'PROVEEDOR_NO_PERMITIDO'||
            error.codigo === 'ESTADO_INVALIDO' 
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (
            error.codigo === 'USUARIO_NO_ENCONTRADO' ||
            error.codigo === 'ROL_NO_ENCONTRADO' ||
            error.codigo === 'PROVEEDOR_NO_ENCONTRADO'
        ) {
            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (error.codigo === 'USERNAME_DUPLICADO') {
            return res.status(409).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al actualizar usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al actualizar usuario'
        });
    }
};

const aprobarUsuario = async (req, res) => {

    try {

        const {
            rolCodigo,
            proveedorId,
            rol_id
        } = req.body;

        const usuario = await aprobarUsuarioService({
            usuarioId: req.params.id,
            rolCodigo: rolCodigo || (
                rol_id === 1
                    ? 'ADMIN'
                    : rol_id === 2
                        ? 'CONSULTOR'
                        : rol_id === 3
                            ? 'PROVEEDOR'
                            : null
            ),
            proveedorId
        });

        return res.status(200).json({
            ok: true,
            mensaje: 'Usuario aprobado correctamente',
            usuario
        });

    } catch (error) {

        if (
            error.codigo === 'ID_INVALIDO' ||
            error.codigo === 'ROL_OBLIGATORIO' ||
            error.codigo === 'ROL_INVALIDO' ||
            error.codigo === 'PROVEEDOR_OBLIGATORIO' ||
            error.codigo === 'PROVEEDOR_NO_PERMITIDO'
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (
            error.codigo === 'USUARIO_NO_ENCONTRADO' ||
            error.codigo === 'USUARIO_NO_PENDIENTE' ||
            error.codigo === 'ROL_NO_ENCONTRADO' ||
            error.codigo === 'PROVEEDOR_NO_ENCONTRADO'
        ) {
            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al aprobar usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al aprobar usuario'
        });
    }
};


const rechazarUsuario = async (req, res) => {

    try {

        const usuario = await rechazarUsuarioService(
            req.params.id
        );

        return res.status(200).json({
            ok: true,
            mensaje: 'Usuario rechazado correctamente',
            usuario
        });

    } catch (error) {

        if (error.codigo === 'ID_INVALIDO') {
            return res.status(400).json({
                ok: false,
                mensaje: error.message
            });
        }

        if (
            error.codigo === 'USUARIO_NO_ENCONTRADO' ||
            error.codigo === 'USUARIO_NO_PENDIENTE'
        ) {
            return res.status(404).json({
                ok: false,
                mensaje: error.message
            });
        }

        console.error('Error al rechazar usuario:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al rechazar usuario'
        });
    }
};

module.exports = {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    registrarUsuario,
    actualizarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    contarUsuariosPorEstado
};
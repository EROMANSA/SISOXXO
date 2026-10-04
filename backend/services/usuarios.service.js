const bcrypt = require('bcryptjs');

const {
    listarUsuarios,
    obtenerUsuarioPorId,
    obtenerRolPorCodigo,    
    crearUsuario,
    registrarUsuario,
    obtenerUsuarioParaEdicion,
    actualizarUsuario,
    aprobarUsuario,
    rechazarUsuario,
    contarUsuariosPorEstado
} = require('../repositories/usuarios.repository');



const listarUsuariosService = async (filtro = 'TODOS') => {

    const filtrosPermitidos = [
        'TODOS',
        'ACTIVOS',
        'PENDIENTES',
        'RECHAZADOS',
        'INACTIVOS'
    ];

    const filtroNormalizado = filtro.toUpperCase();

    if (!filtrosPermitidos.includes(filtroNormalizado)) {
        const error = new Error('Filtro de usuarios no válido');
        error.codigo = 'FILTRO_INVALIDO';
        throw error;
    }

    return await listarUsuarios(filtroNormalizado);
};

const contarUsuariosPorEstadoService = async () => {
    return await contarUsuariosPorEstado();
};

const obtenerUsuarioService = async (usuarioId) => {

    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error('Identificador de usuario no válido');
        error.codigo = 'ID_INVALIDO';
        throw error;
    }

    const usuario = await obtenerUsuarioPorId(id);

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        error.codigo = 'USUARIO_NO_ENCONTRADO';
        throw error;
    }

    return usuario;
};

const crearUsuarioService = async ({
    username,
    password,
    correo,
    rolCodigo,
    proveedorId
}) => {

    if (!username || !password || !rolCodigo) {
        const error = new Error(
            'Usuario, contraseña y rol son obligatorios'
        );
        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    const usernameNormalizado = username.trim();
    const rolNormalizado = rolCodigo.trim().toUpperCase();

    if (!usernameNormalizado) {
        const error = new Error('El usuario es obligatorio');
        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    if (password.length < 8) {
        const error = new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
        error.codigo = 'PASSWORD_INVALIDO';
        throw error;
    }

    const rolesPermitidos = [
        'ADMIN',
        'CONSULTOR',
        'PROVEEDOR'
    ];

    if (!rolesPermitidos.includes(rolNormalizado)) {
        const error = new Error('Rol no válido');
        error.codigo = 'ROL_INVALIDO';
        throw error;
    }

    const rol = await obtenerRolPorCodigo(rolNormalizado);

    if (!rol) {
        const error = new Error('El rol no existe o está inactivo');
        error.codigo = 'ROL_NO_ENCONTRADO';
        throw error;
    }

    let proveedor = null;    

if (
    rolNormalizado !== 'PROVEEDOR' &&
    proveedorId !== undefined &&
    proveedorId !== null &&
    proveedorId !== ''
) {
    const error = new Error(
        'Solo el rol PROVEEDOR puede tener proveedor asociado'
    );
    error.codigo = 'PROVEEDOR_NO_PERMITIDO';
    throw error;
}

    const passwordHash = await bcrypt.hash(password, 10);

    try {

        const resultado = await crearUsuario({
            username: usernameNormalizado,
            passwordHash,
            correo: correo ? correo.trim() : null,
            rolId: rol.rol_id,
            proveedorId: proveedor ? proveedor.proveedor_id : null
        });

        return await obtenerUsuarioPorId(resultado.usuario_id);

    } catch (error) {

        if (error.code === '23505') {
            const errorUsuario = new Error(
                'El nombre de usuario ya existe'
            );
            errorUsuario.codigo = 'USERNAME_DUPLICADO';
            throw errorUsuario;
        }

        throw error;
    }
};

const registrarUsuarioService = async ({
    username,
    password,
    correo
}) => {

    if (!username || !password || !correo) {
        const error = new Error(
            'Usuario, contraseña y correo son obligatorios'
        );

        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    const usernameNormalizado = username.trim();
    const correoNormalizado = correo.trim().toLowerCase();

    if (!usernameNormalizado) {
        const error = new Error('El usuario es obligatorio');

        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    if (password.length < 8) {
        const error = new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );

        error.codigo = 'PASSWORD_INVALIDO';
        throw error;
    }

    if (!correoNormalizado) {
        const error = new Error('El correo es obligatorio');

        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    const rol = await obtenerRolPorCodigo('CONSULTOR');

    if (!rol) {
        const error = new Error(
            'El rol CONSULTOR no existe o está inactivo'
        );

        error.codigo = 'ROL_NO_ENCONTRADO';
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {

        const resultado = await registrarUsuario({
            username: usernameNormalizado,
            passwordHash,
            correo: correoNormalizado,
            rolId: rol.rol_id
        });

        return await obtenerUsuarioPorId(resultado.usuario_id);

    } catch (error) {

        if (error.code === '23505') {
            const errorUsuario = new Error(
                'El nombre de usuario ya existe'
            );

            errorUsuario.codigo = 'USERNAME_DUPLICADO';
            throw errorUsuario;
        }

        throw error;
    }
};

const actualizarUsuarioService = async ({
    usuarioId,
    username,
    correo,
    rolCodigo,    
    primerIngreso,
    password,
    estado
}) => {

    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error('Identificador de usuario no válido');
        error.codigo = 'ID_INVALIDO';
        throw error;
    }

    const estadoNormalizado =
    estado ? estado.trim().toUpperCase() : 'A';

const estadosPermitidos = ['A', 'I'];

if (!estadosPermitidos.includes(estadoNormalizado)) {
    const error = new Error('Estado de usuario no válido');
    error.codigo = 'ESTADO_INVALIDO';
    throw error;
}

    const usuarioActual = await obtenerUsuarioParaEdicion(id);

    if (!usuarioActual) {
        const error = new Error('Usuario no encontrado');
        error.codigo = 'USUARIO_NO_ENCONTRADO';
        throw error;
    }

    if (!username || !username.trim()) {
        const error = new Error('El usuario es obligatorio');
        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    if (!rolCodigo || !rolCodigo.trim()) {
        const error = new Error('El rol es obligatorio');
        error.codigo = 'DATOS_OBLIGATORIOS';
        throw error;
    }

    const usernameNormalizado = username.trim();
    const rolNormalizado = rolCodigo.trim().toUpperCase();

    const rolesPermitidos = [
        'ADMIN',
        'CONSULTOR',
        'PROVEEDOR'
    ];

    if (!rolesPermitidos.includes(rolNormalizado)) {
        const error = new Error('Rol no válido');
        error.codigo = 'ROL_INVALIDO';
        throw error;
    }

    const rol = await obtenerRolPorCodigo(rolNormalizado);

    if (!rol) {
        const error = new Error('El rol no existe o está inactivo');
        error.codigo = 'ROL_NO_ENCONTRADO';
        throw error;
    }

    
    if (password !== undefined && password !== null && password !== '') {

        if (password.length < 8) {
            const error = new Error(
                'La contraseña debe tener al menos 8 caracteres'
            );
            error.codigo = 'PASSWORD_INVALIDO';
            throw error;
        }
    }

    let passwordHash = null;

    if (password) {
        passwordHash = await bcrypt.hash(password, 10);
    }

    try {

        const resultado = await actualizarUsuario({
            usuarioId: id,
            username: usernameNormalizado,
            correo: correo ? correo.trim() : null,
            rolId: rol.rol_id,
            proveedorId:
    rolNormalizado === 'PROVEEDOR'
        ? usuarioActual.proveedor_id
        : null,
            primerIngreso: primerIngreso || 'S',
            passwordHash,
            estado: estadoNormalizado
        });

        if (!resultado) {
            const error = new Error('No se pudo actualizar el usuario');
            error.codigo = 'ACTUALIZACION_FALLIDA';
            throw error;
        }

        return await obtenerUsuarioPorId(id);

    } catch (error) {

        if (error.code === '23505') {
            const errorUsuario = new Error(
                'El nombre de usuario ya existe'
            );
            errorUsuario.codigo = 'USERNAME_DUPLICADO';
            throw errorUsuario;
        }

        throw error;
    }
};

const aprobarUsuarioService = async ({
    usuarioId,
    rolCodigo
}) => {

    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(
            'Identificador de usuario no válido'
        );
        error.codigo = 'ID_INVALIDO';
        throw error;
    }

    const usuario = await obtenerUsuarioPorId(id);

    if (!usuario) {
        const error = new Error(
            'Usuario no encontrado'
        );
        error.codigo = 'USUARIO_NO_ENCONTRADO';
        throw error;
    }

    if (
        usuario.estado_usuario !== 'P' &&
        usuario.estado_usuario !== 'R'
    ) {
        const error = new Error(
            'El usuario no se encuentra pendiente o rechazado para aprobación'
        );
        error.codigo = 'USUARIO_NO_APROBABLE';
        throw error;
    }

    if (!rolCodigo || !rolCodigo.trim()) {
        const error = new Error(
            'El rol es obligatorio para aprobar el usuario'
        );
        error.codigo = 'ROL_OBLIGATORIO';
        throw error;
    }

    const rolNormalizado = rolCodigo.trim().toUpperCase();

    const rolesPermitidos = [
        'ADMIN',
        'CONSULTOR',
        'PROVEEDOR'
    ];

    if (!rolesPermitidos.includes(rolNormalizado)) {
        const error = new Error('Rol no válido');
        error.codigo = 'ROL_INVALIDO';
        throw error;
    }

    const rol = await obtenerRolPorCodigo(rolNormalizado);

    if (!rol) {
        const error = new Error(
            'El rol no existe o está inactivo'
        );
        error.codigo = 'ROL_NO_ENCONTRADO';
        throw error;
    }

    /*
     * IMPORTANTE:
     * La aprobación NO asocia un proveedor.
     *
     * Si el rol es PROVEEDOR, el usuario queda ACTIVO
     * con proveedor_id = NULL.
     *
     * El vínculo con MAE_PROVEEDOR se realizará
     * posteriormente cuando el usuario complete su ficha.
     */

    const resultado = await aprobarUsuario({
        usuarioId: id,
        rolId: rol.rol_id
    });

    if (!resultado) {
        const error = new Error(
            'No se pudo aprobar el usuario'
        );
        error.codigo = 'APROBACION_FALLIDA';
        throw error;
    }

    return await obtenerUsuarioPorId(id);
};

const rechazarUsuarioService = async (usuarioId) => {

    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(
            'Identificador de usuario no válido'
        );
        error.codigo = 'ID_INVALIDO';
        throw error;
    }

    const usuario = await obtenerUsuarioPorId(id);

    if (!usuario) {
        const error = new Error(
            'Usuario no encontrado'
        );
        error.codigo = 'USUARIO_NO_ENCONTRADO';
        throw error;
    }

    if (usuario.estado_usuario !== 'P') {
        const error = new Error(
            'El usuario no se encuentra pendiente de aprobación'
        );
        error.codigo = 'USUARIO_NO_PENDIENTE';
        throw error;
    }

    const resultado = await rechazarUsuario(id);

    if (!resultado) {
        const error = new Error(
            'No se pudo rechazar el usuario'
        );
        error.codigo = 'RECHAZO_FALLIDO';
        throw error;
    }

    return await obtenerUsuarioPorId(id);
};

module.exports = {
    listarUsuariosService,
    obtenerUsuarioService,
    crearUsuarioService,
    registrarUsuarioService,
    actualizarUsuarioService,
    aprobarUsuarioService,
    rechazarUsuarioService,
    contarUsuariosPorEstadoService
};
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
    listarUsuarios,
    obtenerTotalesUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    crearUsuario,
    aprobarUsuario,
    rechazarUsuario
} from '../../services/usuarios.services';


function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState('TODOS');
    const [totales, setTotales] = useState({
    todos: 0,
    activos: 0,
    pendientes: 0,
    rechazados: 0,
    inactivos: 0
});

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [errorDetalle, setErrorDetalle] = useState('');
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [cargandoEdicion, setCargandoEdicion] = useState(false);
    const [errorEdicion, setErrorEdicion] = useState('');


    const [usuarioAprobar, setUsuarioAprobar] = useState(null);
    const [mostrarModalAprobar, setMostrarModalAprobar] = useState(false);
    const [rolAprobar, setRolAprobar] = useState('');
    const [cargandoAprobacion, setCargandoAprobacion] = useState(false);
    const [errorAprobacion, setErrorAprobacion] = useState('');

    const [usuarioRechazar, setUsuarioRechazar] = useState(null);
    const [mostrarModalRechazar, setMostrarModalRechazar] = useState(false);
    const [cargandoRechazo, setCargandoRechazo] = useState(false);
    const [errorRechazo, setErrorRechazo] = useState('');

    const [formEditar, setFormEditar] = useState({
    username: '',
    correo: '',
    rolCodigo: '',
    proveedorId: null,
    primerIngreso: 'S',
    password: '',
    estado: 'A'
});

const [guardandoEdicion, setGuardandoEdicion] = useState(false);

const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
const [guardandoCreacion, setGuardandoCreacion] = useState(false);
const [errorCreacion, setErrorCreacion] = useState('');

const [formCrear, setFormCrear] = useState({
    username: '',
    correo: '',
    rolCodigo: '',    
    password: '',
    confirmarPassword: ''
});

    const cargarUsuarios = async () => {
        try {
            setCargando(true);
            setError('');

            const data = await listarUsuarios(filtro);

            if (!data?.ok) {
                setError(data?.mensaje || 'No fue posible obtener los usuarios.');
                setUsuarios([]);
                return;
            }

            setUsuarios(data.usuarios || data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.mensaje ||
                'No fue posible obtener los usuarios.'
            );
            setUsuarios([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, [filtro]);

    useEffect(() => {
    cargarTotales();
}, []);

    const cargarTotales = async () => {
    try {
        const data = await obtenerTotalesUsuarios();

        if (!data?.ok) {
            return;
        }

        setTotales({
            todos: Number(data.totales?.todos || 0),
            activos: Number(data.totales?.activos || 0),
            pendientes: Number(data.totales?.pendientes || 0),
            rechazados: Number(data.totales?.rechazados || 0),
            inactivos: Number(data.totales?.inactivos || 0)
        });
    } catch (err) {
        console.error('No fue posible obtener los totales de usuarios.', err);
    }
};

const handleExportar = () => {
    if (usuarios.length === 0) {
        return;
    }

    const datosExcel = usuarios.map((usuario) => {
        const estado = obtenerEstado(usuario);

        return {
            'Usuario': usuario.username || '',
            'Correo': usuario.correo || '',
            'Rol': usuario.rol_nombre || usuario.rol_codigo || '',
            'Proveedor': usuario.proveedor_nombre || '',
            'Estado': estado.texto
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(datosExcel);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Usuarios'
    );

    XLSX.writeFile(
        workbook,
        'Listado_Usuarios.xlsx'
    );
};



 const verUsuario = async (usuarioId) => {
    try {
        setCargandoDetalle(true);
        setErrorDetalle('');
        setUsuarioSeleccionado(null);

        const data = await obtenerUsuarioPorId(usuarioId);

        if (!data?.ok) {
            setErrorDetalle(
                data?.mensaje || 'No fue posible obtener el usuario.'
            );
            return;
        }

        setUsuarioSeleccionado(data.usuario);
    } catch (err) {
        setErrorDetalle(
            err.response?.data?.mensaje ||
            'No fue posible obtener el usuario.'
        );
    } finally {
        setCargandoDetalle(false);
    }
};

const abrirModalEditar = async (usuarioId) => {
    try {
        setCargandoEdicion(true);
        setErrorEdicion('');
        setUsuarioEditar(null);

        const data = await obtenerUsuarioPorId(usuarioId);

        if (!data?.ok) {
            setErrorEdicion(
                data?.mensaje || 'No fue posible obtener el usuario.'
            );
            return;
        }

        setUsuarioEditar(data.usuario);

        setFormEditar({
    username: data.usuario.username || '',
    correo: data.usuario.correo || '',
    rolCodigo: data.usuario.rol_codigo || '',
    proveedorId: data.usuario.proveedor_id || null,
    primerIngreso: data.usuario.primer_ingreso || 'S',
    password: '',
    estado: data.usuario.estado || 'A'
});

        setMostrarModalEditar(true);
    } catch (err) {
        setErrorEdicion(
            err.response?.data?.mensaje ||
            'No fue posible obtener el usuario para edición.'
        );
    } finally {
        setCargandoEdicion(false);
    }
};

const guardarEdicion = async () => {
    try {
        setErrorEdicion('');

        if (!usuarioEditar) {
            return;
        }

        if (!formEditar.username.trim()) {
            setErrorEdicion('El usuario es obligatorio.');
            return;
        }

        if (!formEditar.rolCodigo) {
            setErrorEdicion('Debe seleccionar un rol.');
            return;
        }

        setGuardandoEdicion(true);

        await actualizarUsuario(usuarioEditar.usuario_id, {
            username: formEditar.username.trim(),
            correo: formEditar.correo?.trim() || null,
            rolCodigo: formEditar.rolCodigo,            
            primerIngreso: formEditar.primerIngreso || 'S',
            password: formEditar.password?.trim() || '',
            estado: formEditar.estado
        });

        setMostrarModalEditar(false);
        setUsuarioEditar(null);
        setErrorEdicion('');

        await cargarUsuarios();

    } catch (err) {
        setErrorEdicion(
            err.response?.data?.mensaje ||
            'No fue posible actualizar el usuario.'
        );
    } finally {
        setGuardandoEdicion(false);
    }
};

const guardarNuevoUsuario = async () => {
    try {
        setErrorCreacion('');

        if (!formCrear.username.trim()) {
            setErrorCreacion('Debe ingresar el usuario.');
            return;
        }

        if (!formCrear.rolCodigo) {
            setErrorCreacion('Debe seleccionar un rol.');
            return;
        }

        if (!formCrear.password) {
            setErrorCreacion('Debe ingresar la contraseña.');
            return;
        }

        if (formCrear.password.length < 8) {
            setErrorCreacion(
                'La contraseña debe tener como mínimo 8 caracteres.'
            );
            return;
        }

        if (
            formCrear.password !==
            formCrear.confirmarPassword
        ) {
            setErrorCreacion(
                'Las contraseñas no coinciden.'
            );
            return;
        }

        setGuardandoCreacion(true);

        await crearUsuario({
            username: formCrear.username.trim(),
            correo: formCrear.correo?.trim() || null,
            rolCodigo: formCrear.rolCodigo,            
            password: formCrear.password
        });

        setMostrarModalCrear(false);

        setFormCrear({
            username: '',
            correo: '',
            rolCodigo: '',            
            password: '',
            confirmarPassword: ''
        });

        await cargarUsuarios();

    } catch (err) {
        setErrorCreacion(
            err.response?.data?.mensaje ||
            'No fue posible crear el usuario.'
        );
    } finally {
        setGuardandoCreacion(false);
    }
};

const abrirModalAprobar = (usuario) => {
    setErrorAprobacion('');
    setUsuarioAprobar(usuario);

    // Por defecto conservamos el rol actual si existe.
    setRolAprobar(usuario.rol_codigo || '');

    setMostrarModalAprobar(true);
};

const confirmarAprobar = async () => {
    try {
        setErrorAprobacion('');

        if (!usuarioAprobar) {
            return;
        }

        if (!rolAprobar) {
            setErrorAprobacion(
                'Debe seleccionar un rol.'
            );
            return;
        }

        setCargandoAprobacion(true);

        const rolId =
            rolAprobar === 'ADMIN'
                ? 1
                : rolAprobar === 'CONSULTOR'
                    ? 2
                    : 3;

        await aprobarUsuario(
            usuarioAprobar.usuario_id,
            rolId
        );

        setMostrarModalAprobar(false);
        setUsuarioAprobar(null);
        setRolAprobar('');

        await cargarUsuarios();

    } catch (err) {
        setErrorAprobacion(
            err.response?.data?.mensaje ||
            'No fue posible aprobar el usuario.'
        );
    } finally {
        setCargandoAprobacion(false);
    }
};

const abrirModalRechazar = (usuario) => {
    setUsuarioRechazar(usuario);
    setErrorRechazo('');
    setMostrarModalRechazar(true);
};


const confirmarRechazar = async () => {
    try {
        setErrorRechazo('');

        if (!usuarioRechazar) {
            return;
        }

        setCargandoRechazo(true);

        await rechazarUsuario(
            usuarioRechazar.usuario_id
        );

        setMostrarModalRechazar(false);
        setUsuarioRechazar(null);

        await cargarUsuarios();

    } catch (err) {
        setErrorRechazo(
            err.response?.data?.mensaje ||
            'No fue posible rechazar el usuario.'
        );
    } finally {
        setCargandoRechazo(false);
    }
};



    const obtenerEstado = (usuario) => {
        if (usuario.estado_usuario === 'P') {
            return {
                texto: 'PENDIENTE',
                fondo: '#FEF3C7',
                color: '#92400E'
            };
        }

        if (usuario.estado_usuario === 'R') {
            return {
                texto: 'RECHAZADO',
                fondo: '#FEE2E2',
                color: '#991B1B'
            };
        }

        if (usuario.estado === 'A') {
            return {
                texto: 'ACTIVO',
                fondo: '#DCFCE7',
                color: '#166534'
            };
        }

        return {
            texto: 'INACTIVO',
            fondo: '#E2E8F0',
            color: '#475569'
        };
    };

        const detalleLabelStyle = {
        display: 'block',
        marginBottom: '6px',
        color: '#475569',
        fontSize: '13px',
        fontWeight: '600'
    };

    const detalleValueStyle = {
    padding: '10px 12px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    color: '#334155',
    minHeight: '18px'
};




return (
        <div
            style={{
                padding: '24px',
                background: '#F8FAFC',
                minHeight: '100vh',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ marginBottom: '20px' }}>
                <h1
                    style={{
                        margin: 0,
                        color: '#0F172A',
                        fontSize: '28px'
                    }}
                >
                    Gestión de Usuarios
                </h1>

                <p
                    style={{
                        marginTop: '6px',
                        color: '#64748B',
                        fontSize: '14px'
                    }}
                >
                    Administración de usuarios y roles del sistema
                </p>
            </div>

            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                }}
            >

                        <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '12px',
                    marginBottom: '16px'
                }}
            >
                {/* TODOS */}
                <button
                    type="button"
                    onClick={() => setFiltro('TODOS')}
                    style={{
                        background: filtro === 'TODOS' ? '#EFF6FF' : '#FFFFFF',
                        border: filtro === 'TODOS'
                            ? '2px solid #2563EB'
                            : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748B',
                            marginBottom: '6px'
                        }}
                    >
                        TODOS
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#0F172A'
                        }}
                    >
                        {totales.todos}
                    </div>
                </button>

                {/* ACTIVOS */}
                <button
                    type="button"
                    onClick={() => setFiltro('ACTIVOS')}
                    style={{
                        background: filtro === 'ACTIVOS' ? '#F0FDF4' : '#FFFFFF',
                        border: filtro === 'ACTIVOS'
                            ? '2px solid #16A34A'
                            : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748B',
                            marginBottom: '6px'
                        }}
                    >
                        ACTIVOS
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#166534'
                        }}
                    >
                        {totales.activos}
                    </div>
                </button>

                {/* PENDIENTES */}
                <button
                    type="button"
                    onClick={() => setFiltro('PENDIENTES')}
                    style={{
                        background: filtro === 'PENDIENTES' ? '#FFFBEB' : '#FFFFFF',
                        border: filtro === 'PENDIENTES'
                            ? '2px solid #D97706'
                            : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748B',
                            marginBottom: '6px'
                        }}
                    >
                        PENDIENTES
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#92400E'
                        }}
                    >
                        {totales.pendientes}
                    </div>
                </button>

                {/* RECHAZADOS */}
                <button
                    type="button"
                    onClick={() => setFiltro('RECHAZADOS')}
                    style={{
                        background: filtro === 'RECHAZADOS' ? '#FEF2F2' : '#FFFFFF',
                        border: filtro === 'RECHAZADOS'
                            ? '2px solid #DC2626'
                            : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748B',
                            marginBottom: '6px'
                        }}
                    >
                        RECHAZADOS
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#991B1B'
                        }}
                    >
                        {totales.rechazados}
                    </div>
                </button>

                {/* INACTIVOS */}
                <button
                    type="button"
                    onClick={() => setFiltro('INACTIVOS')}
                    style={{
                        background: filtro === 'INACTIVOS' ? '#F1F5F9' : '#FFFFFF',
                        border: filtro === 'INACTIVOS'
                            ? '2px solid #64748B'
                            : '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'left',
                        cursor: 'pointer'
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#64748B',
                            marginBottom: '6px'
                        }}
                    >
                        INACTIVOS
                    </div>

                    <div
                        style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#475569'
                        }}
                    >
                        {totales.inactivos}
                    </div>
                </button>
            </div>    


                <div>
                    <label
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#334155',
                            marginBottom: '6px'
                        }}
                    >
                        Estado
                    </label>

                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        style={{
                            padding: '9px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            minWidth: '180px',
                            background: '#FFFFFF'
                        }}
                    >
                        <option value="TODOS">Todos</option>
                        <option value="ACTIVOS">Activos</option>
                        <option value="PENDIENTES">Pendientes</option>
                        <option value="RECHAZADOS">Rechazados</option>
                        <option value="INACTIVOS">Inactivos</option>
                    </select>
                </div>

                <button
    type="button"
    onClick={() => {
        setErrorCreacion('');
        setFormCrear({
            username: '',
            correo: '',
            rolCodigo: '',            
            password: '',
            confirmarPassword: ''
        });
        setMostrarModalCrear(true);
    }}
    style={{
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        background: '#16A34A',
        color: '#FFFFFF',
        fontWeight: '600',
        cursor: 'pointer'
    }}
>
    + Nuevo Usuario
</button> 

<button
    type="button"
    onClick={handleExportar}
    disabled={usuarios.length === 0}
    style={{
        padding: '10px 16px',
        border: 'none',
        borderRadius: '6px',
        background: '#15803D',
        color: '#FFFFFF',
        fontWeight: '600',
        cursor: usuarios.length === 0 ? 'default' : 'pointer',
        opacity: usuarios.length === 0 ? 0.6 : 1
    }}
>
    Exportar Excel
</button>



                <button
                    type="button"
                    onClick={cargarUsuarios}
                    disabled={cargando}
                    style={{
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        fontWeight: '600',
                        cursor: cargando ? 'default' : 'pointer'
                    }}
                >
                    {cargando ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            {error && (
                <div
                    style={{
                        marginBottom: '16px',
                        padding: '12px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#B91C1C',
                        borderRadius: '6px'
                    }}
                >
                    {error}
                </div>
            )}

            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '13px'
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                background: '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0'
                            }}
                        >
                            <th style={thStyle}>Usuario</th>
                            <th style={thStyle}>Correo</th>
                            <th style={thStyle}>Rol</th>
                            <th style={thStyle}>Proveedor</th>
                            <th style={thStyle}>Estado</th>                            
                            <th style={{ ...thStyle, textAlign: 'center' }}>
                                Acciones
                            </th>                            
                        </tr>
                    </thead>

                    <tbody>
                        {!cargando && usuarios.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    style={{
                                        padding: '30px',
                                        textAlign: 'center',
                                        color: '#64748B'
                                    }}
                                >
                                    No existen usuarios para el filtro seleccionado.
                                </td>
                            </tr>
                        )}

                        {usuarios.map((usuario) => {
                            const estado = obtenerEstado(usuario);

                            return (
                                <tr
                                    key={usuario.usuario_id}
                                    style={{
                                        borderBottom: '1px solid #E2E8F0'
                                    }}
                                >
                                    <td style={tdStyle}>
                                        <strong>{usuario.username}</strong>
                                    </td>

                                    <td style={tdStyle}>
                                        {usuario.correo || '-'}
                                    </td>

                                    <td style={tdStyle}>
                                        {usuario.rol_nombre ||
                                            usuario.rol_codigo ||
                                            '-'}
                                    </td>

                                    <td style={tdStyle}>
                                        {usuario.proveedor_nombre || '-'}
                                    </td>

                                    <td style={tdStyle}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 9px',
                                                borderRadius: '12px',
                                                background: estado.fondo,
                                                color: estado.color,
                                                fontSize: '11px',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {estado.texto}
                                        </span>
                                    </td>


                         


                                    <td
    style={{
        ...tdStyle,
        textAlign: 'center'
    }}
>
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap'
        }}
    >
        {/* Ver */}
        <button
            type="button"
            onClick={() => verUsuario(usuario.usuario_id)}
            disabled={cargandoDetalle}
            style={{
                padding: '6px 10px',
                border: '1px solid #BFDBFE',
                borderRadius: '5px',
                background: '#EFF6FF',
                color: '#1D4ED8',
                fontWeight: '600',
                cursor: cargandoDetalle
                    ? 'default'
                    : 'pointer'
            }}
        >
            Ver
        </button>

        {/* Editar */}
<button
    type="button"
    onClick={() => abrirModalEditar(usuario.usuario_id)}
    disabled={cargandoEdicion}
    style={{
        padding: '6px 10px',
        border: '1px solid #DDD6FE',
        borderRadius: '5px',
        background: '#F5F3FF',
        color: '#6D28D9',
        fontWeight: '600',
        cursor: cargandoEdicion
            ? 'default'
            : 'pointer'
    }}
>
    Editar
</button>



        {/* Aprobar */}
        {(usuario.estado_usuario === 'P' ||
            usuario.estado_usuario === 'R') && (
            <button
                type="button"
                onClick={() => abrirModalAprobar(usuario)}
                style={{
                    padding: '6px 10px',
                    border: '1px solid #BBF7D0',
                    borderRadius: '5px',
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontWeight: '700',
                    cursor: 'pointer'
                }}
            >
                Aprobar
            </button>
        )}

        {/* Rechazar */}
        {usuario.estado_usuario === 'P' && (
            <button
                type="button"
                onClick={() => abrirModalRechazar(usuario)}
                style={{
                    padding: '6px 10px',
                    border: '1px solid #FECACA',
                    borderRadius: '5px',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    fontWeight: '700',
                    cursor: 'pointer'
                }}
            >
                Rechazar
            </button>
        )}
    </div>
</td>



                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
                    {cargandoDetalle && (
                <div
                    style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        color: '#64748B'
                    }}
                >
                    Cargando información del usuario...
                </div>
            )}

            {errorDetalle && (
                <div
                    style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#B91C1C',
                        borderRadius: '6px'
                    }}
                >
                    {errorDetalle}
                </div>
            )}

            {usuarioSeleccionado && (
                <div
                    style={{
                        marginTop: '16px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    color: '#0F172A',
                                    fontSize: '20px'
                                }}
                            >
                                Detalle del Usuario
                            </h2>

                            <p
                                style={{
                                    margin: '5px 0 0',
                                    color: '#64748B',
                                    fontSize: '13px'
                                }}
                            >
                                Información del usuario seleccionado
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setUsuarioSeleccionado(null);
                                setErrorDetalle('');
                            }}
                            style={{
                                padding: '8px 14px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                background: '#FFFFFF',
                                color: '#334155',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px'
                        }}
                    >
                        <div>
                            <label style={detalleLabelStyle}>
                                Usuario
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.username || '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Correo
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.correo || '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Rol
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.rol_nombre ||
                                    usuarioSeleccionado.rol_codigo ||
                                    '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Proveedor
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.proveedor_nombre || '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Estado
                            </label>

                            <div style={detalleValueStyle}>
                                {obtenerEstado(usuarioSeleccionado).texto}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Primer ingreso
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.primer_ingreso || '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                Último acceso
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.ultimo_acceso || '-'}
                            </div>
                        </div>

                        <div>
                            <label style={detalleLabelStyle}>
                                ID Usuario
                            </label>

                            <div style={detalleValueStyle}>
                                {usuarioSeleccionado.usuario_id || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            )} 
            
    {mostrarModalCrear && (
    <div
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}
    >
        <div
            style={{
                width: '100%',
                maxWidth: '520px',
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    padding: '18px 20px',
                    background: '#16A34A',
                    color: '#FFFFFF'
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: '18px'
                    }}
                >
                    Nuevo Usuario
                </h2>
            </div>

            <div style={{ padding: '20px' }}>

                {/* Usuario */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={detalleLabelStyle}>
                        Usuario *
                    </label>

                    <input
                        type="text"
                        value={formCrear.username}
                        onChange={(e) =>
                            setFormCrear({
                                ...formCrear,
                                username: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Correo */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={detalleLabelStyle}>
                        Correo
                    </label>

                    <input
                        type="email"
                        value={formCrear.correo}
                        onChange={(e) =>
                            setFormCrear({
                                ...formCrear,
                                correo: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Rol */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={detalleLabelStyle}>
                        Rol *
                    </label>

                    <select
                        value={formCrear.rolCodigo}
                        onChange={(e) =>
                            setFormCrear({
                                ...formCrear,
                                rolCodigo: e.target.value                                
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">
                            Seleccione un rol
                        </option>

                        <option value="ADMIN">
                            Administrador
                        </option>

                        <option value="CONSULTOR">
                            Consultor
                        </option>

                        <option value="PROVEEDOR">
                            Proveedor
                        </option>
                    </select>
                </div>

                {/* Contraseña */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={detalleLabelStyle}>
                        Contraseña *
                    </label>

                    <input
                        type="password"
                        value={formCrear.password}
                        onChange={(e) =>
                            setFormCrear({
                                ...formCrear,
                                password: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />

                    <div
                        style={{
                            marginTop: '5px',
                            fontSize: '12px',
                            color: '#64748B'
                        }}
                    >
                        Mínimo 8 caracteres.
                    </div>
                </div>

                {/* Confirmar contraseña */}
                <div style={{ marginBottom: '14px' }}>
                    <label style={detalleLabelStyle}>
                        Confirmar contraseña *
                    </label>

                    <input
                        type="password"
                        value={formCrear.confirmarPassword}
                        onChange={(e) =>
                            setFormCrear({
                                ...formCrear,
                                confirmarPassword: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {errorCreacion && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '10px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            color: '#B91C1C',
                            fontSize: '13px'
                        }}
                    >
                        {errorCreacion}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        marginTop: '20px'
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMostrarModalCrear(false);
                            setErrorCreacion('');
                        }}
                        disabled={guardandoCreacion}
                        style={{
                            padding: '9px 16px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={guardarNuevoUsuario}
                        disabled={guardandoCreacion}
                        style={{
                            padding: '9px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#16A34A',
                            color: '#FFFFFF',
                            fontWeight: '700',
                            cursor: guardandoCreacion
                                ? 'default'
                                : 'pointer'
                        }}
                    >
                        {guardandoCreacion
                            ? 'Guardando...'
                            : 'Crear Usuario'}
                    </button>
                </div>

            </div>
        </div>
    </div>
)}


    {mostrarModalAprobar && usuarioAprobar && (
    <div
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}
    >
        <div
            style={{
                width: '100%',
                maxWidth: '480px',
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    padding: '18px 20px',
                    background: '#0F172A',
                    color: '#FFFFFF'
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: '18px'
                    }}
                >
                    Aprobar Usuario
                </h2>

                <p
                    style={{
                        margin: '5px 0 0',
                        color: '#CBD5E1',
                        fontSize: '13px'
                    }}
                >
                    Complete la información para aprobar el acceso.
                </p>
            </div>

            <div style={{ padding: '20px' }}>

                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Usuario
                    </label>

                    <div style={detalleValueStyle}>
                        {usuarioAprobar.username}
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Correo
                    </label>

                    <div style={detalleValueStyle}>
                        {usuarioAprobar.correo || '-'}
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Rol *
                    </label>

                    <select
                        value={rolAprobar}
                        onChange={(e) => {
                            setRolAprobar(e.target.value);
                        }}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            color: '#334155',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">
                            Seleccione un rol
                        </option>
                        <option value="ADMIN">
                            Administrador
                        </option>
                        <option value="CONSULTOR">
                            Consultor
                        </option>
                        <option value="PROVEEDOR">
                            Proveedor
                        </option>
                    </select>
                </div>

                {errorAprobacion && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '10px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            color: '#B91C1C',
                            fontSize: '13px'
                        }}
                    >
                        {errorAprobacion}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        marginTop: '20px'
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMostrarModalAprobar(false);
                            setUsuarioAprobar(null);
                            setErrorAprobacion('');
                        }}
                        disabled={cargandoAprobacion}
                        style={{
                            padding: '9px 16px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={confirmarAprobar}
                        disabled={cargandoAprobacion}
                        style={{
                            padding: '9px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#16A34A',
                            color: '#FFFFFF',
                            fontWeight: '700',
                            cursor: cargandoAprobacion
                                ? 'default'
                                : 'pointer'
                        }}
                    >
                        {cargandoAprobacion
                            ? 'Aprobando...'
                            : 'Aprobar Usuario'}
                    </button>
                </div>
            </div>
        </div>
    </div>
)} 

{mostrarModalRechazar && usuarioRechazar && (
    <div
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}
    >
        <div
            style={{
                width: '100%',
                maxWidth: '420px',
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    padding: '18px 20px',
                    background: '#991B1B',
                    color: '#FFFFFF'
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: '18px'
                    }}
                >
                    Rechazar Usuario
                </h2>
            </div>

            <div style={{ padding: '20px' }}>

                <p
                    style={{
                        marginTop: 0,
                        color: '#334155',
                        lineHeight: '1.5'
                    }}
                >
                    ¿Está seguro de rechazar la solicitud del usuario?
                </p>

                <div
                    style={{
                        padding: '12px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    }}
                >
                    <strong>
                        {usuarioRechazar.username}
                    </strong>

                    <div
                        style={{
                            marginTop: '4px',
                            color: '#64748B',
                            fontSize: '13px'
                        }}
                    >
                        {usuarioRechazar.correo || '-'}
                    </div>
                </div>

                {errorRechazo && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '10px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            color: '#B91C1C',
                            fontSize: '13px'
                        }}
                    >
                        {errorRechazo}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMostrarModalRechazar(false);
                            setUsuarioRechazar(null);
                            setErrorRechazo('');
                        }}
                        disabled={cargandoRechazo}
                        style={{
                            padding: '9px 16px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={confirmarRechazar}
                        disabled={cargandoRechazo}
                        style={{
                            padding: '9px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#DC2626',
                            color: '#FFFFFF',
                            fontWeight: '700',
                            cursor: cargandoRechazo
                                ? 'default'
                                : 'pointer'
                        }}
                    >
                        {cargandoRechazo
                            ? 'Rechazando...'
                            : 'Rechazar Usuario'}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

{mostrarModalEditar && usuarioEditar && (
    <div
        style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}
    >
        <div
            style={{
                width: '100%',
                maxWidth: '520px',
                background: '#FFFFFF',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.20)',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    padding: '18px 20px',
                    background: '#0F172A',
                    color: '#FFFFFF'
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: '18px'
                    }}
                >
                    Editar Usuario
                </h2>

                <p
                    style={{
                        margin: '5px 0 0',
                        color: '#CBD5E1',
                        fontSize: '13px'
                    }}
                >
                    Modifique la información del usuario.
                </p>
            </div>

            <div style={{ padding: '20px' }}>

                {/* Usuario */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Usuario *
                    </label>

                    <input
                        type="text"
                        value={formEditar.username}
                        onChange={(e) =>
                            setFormEditar({
                                ...formEditar,
                                username: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Correo */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Correo
                    </label>

                    <input
                        type="email"
                        value={formEditar.correo}
                        onChange={(e) =>
                            setFormEditar({
                                ...formEditar,
                                correo: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Rol */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Rol *
                    </label>

                    <select
                        value={formEditar.rolCodigo}
                        onChange={(e) =>
                            setFormEditar({
                                ...formEditar,
                                rolCodigo: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">
                            Seleccione un rol
                        </option>

                        <option value="ADMIN">
                            Administrador
                        </option>

                        <option value="CONSULTOR">
                            Consultor
                        </option>

                        <option value="PROVEEDOR">
                            Proveedor
                        </option>
                    </select>
                </div>

                {/* Estado */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Estado *
                    </label>

                    <select
                        value={formEditar.estado}
                        onChange={(e) =>
                            setFormEditar({
                                ...formEditar,
                                estado: e.target.value
                            })
                        }
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="A">
                            Activo
                        </option>

                        <option value="I">
                            Inactivo
                        </option>
                    </select>
                </div>

                {/* Contraseña */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={detalleLabelStyle}>
                        Nueva contraseña
                    </label>

                    <input
                        type="password"
                        value={formEditar.password}
                        onChange={(e) =>
                            setFormEditar({
                                ...formEditar,
                                password: e.target.value
                            })
                        }
                        placeholder="Dejar vacío para conservar la actual"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {errorEdicion && (
                    <div
                        style={{
                            marginBottom: '16px',
                            padding: '10px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            color: '#B91C1C',
                            fontSize: '13px'
                        }}
                    >
                        {errorEdicion}
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        marginTop: '20px'
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMostrarModalEditar(false);
                            setUsuarioEditar(null);
                            setErrorEdicion('');
                        }}
                        disabled={guardandoEdicion}
                        style={{
                            padding: '9px 16px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={guardarEdicion}
                        disabled={guardandoEdicion}
                        style={{
                            padding: '9px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            fontWeight: '700',
                            cursor: guardandoEdicion
                                ? 'default'
                                : 'pointer'
                        }}
                    >
                        {guardandoEdicion
                            ? 'Guardando...'
                            : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

        </div>
    );





}

const thStyle = {
    padding: '12px 14px',
    textAlign: 'left',
    color: '#334155',
    fontWeight: '700',
    whiteSpace: 'nowrap'
};

const tdStyle = {
    padding: '12px 14px',
    color: '#334155',
    verticalAlign: 'middle'
};

export default UsuariosPage;

import {
    LayoutDashboard,
    Building2,
    Truck,
    Users,
    Bell,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {

    const navigate = useNavigate();

    const usuarioGuardado = localStorage.getItem('usuario');

    let usuario = null;

    try {
        usuario = usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    } catch {
        usuario = null;
    }

    const rol = usuario?.rol_codigo || '';

    const esAdmin = rol === 'ADMIN';
    const esConsultor = rol === 'CONSULTOR';
    const esProveedor = rol === 'PROVEEDOR';

    const cerrarSesion = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        navigate('/login', {
            replace: true
        });
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        marginBottom: '4px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: isActive
            ? '#FFFFFF'
            : '#CBD5E1',
        background: isActive
            ? '#2563EB'
            : 'transparent',
        fontSize: '14px',
        fontWeight: isActive
            ? '600'
            : '400'
    });

    return (

        <aside
            style={{
                width: '250px',
                minHeight: '100vh',
                background: '#0F172A',
                color: '#FFFFFF',
                padding: '20px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column'
            }}
        >

            {/* Identificación del sistema */}

            <div
                style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '6px'
                }}
            >
                SISOXXO
            </div>

            <div
                style={{
                    fontSize: '12px',
                    color: '#94A3B8',
                    marginBottom: '25px'
                }}
            >
                Gestión de Despachos
            </div>


            {/* Usuario conectado */}

            <div
                style={{
                    padding: '12px',
                    background: '#1E293B',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}
            >

                <div
                    style={{
                        fontSize: '13px',
                        fontWeight: '600'
                    }}
                >
                    {usuario?.username || 'Usuario'}
                </div>

                <div
                    style={{
                        fontSize: '12px',
                        color: '#94A3B8',
                        marginTop: '4px'
                    }}
                >
                    {usuario?.rol_nombre || rol}
                </div>

            </div>


            {/* ===================================================== */}
            {/* MENÚ PRINCIPAL                                       */}
            {/* ===================================================== */}

            <nav>

                {/* Dashboard: todos los roles */}

                <NavLink
                    to="/dashboard"
                    style={linkStyle}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>


                {/* ================================================= */}
                {/* CONSULTOR + ADMIN                                */}
                {/* ================================================= */}

                {(esConsultor || esAdmin) && (

                    <NavLink
                        to="/providers"
                        style={linkStyle}
                    >
                        <Building2 size={18} />
                        Proveedores
                    </NavLink>

                )}


                {/* ================================================= */}
                {/* PROVEEDOR                                         */}
                {/* ================================================= */}

                {esProveedor && (
                    <>
                       <NavLink
    to="/mi-ficha"
    style={linkStyle}
>
    <Building2 size={18} />
    Mi Ficha
</NavLink>

                        <NavLink
                            to="/despachos"
                            style={linkStyle}
                        >
                            <Truck size={18} />
                            Registrar Despachos
                        </NavLink>
                    </>
                )}


                {/* ================================================= */}
                {/* ADMIN                                             */}
                {/* ================================================= */}

                {esAdmin && (
                    <>

                        <NavLink
                            to="/usuarios"
                            style={linkStyle}
                        >
                            <Users size={18} />
                            Usuarios
                        </NavLink>


                        <NavLink
                            to="/alerts"
                            style={linkStyle}
                        >
                            <Bell size={18} />
                            Alertas
                        </NavLink>


                        <NavLink
                            to="/reports"
                            style={linkStyle}
                        >
                            <BarChart3 size={18} />
                            Reportes
                        </NavLink>


                        <NavLink
                            to="/processes"
                            style={linkStyle}
                        >
                            <Settings size={18} />
                            Procesos
                        </NavLink>

                    </>
                )}

            </nav>


            {/* ===================================================== */}
            {/* CERRAR SESIÓN                                        */}
            {/* ===================================================== */}

            <div
                style={{
                    marginTop: 'auto'
                }}
            >

                <button
                    type="button"
                    onClick={cerrarSesion}
                    style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        background: 'transparent',
                        color: '#CBD5E1',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >

                    <LogOut size={18} />

                    Cerrar sesión

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;
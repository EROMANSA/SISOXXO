
import DashboardProveedorPage from './DashboardProveedorPage';

function DashboardPage() {
    let usuario = null;

    try {
        const usuarioGuardado = localStorage.getItem('usuario');

        usuario = usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    } catch {
        usuario = null;
    }

    const rol = usuario?.rol_codigo || '';

    if (rol === 'PROVEEDOR') {
        return <DashboardProveedorPage />;
    }

    return (
        <div style={{ padding: '40px' }}>
            <h1>Dashboard SISOXXO</h1>
            <p>Panel principal</p>
        </div>
    );
}

export default DashboardPage;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProveedoresPage from './pages/proveedores/ProveedoresPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';
import MiFichaPage from './pages/miFicha/MiFichaPage';
import DespachosPage from './pages/despachos/DespachosPage';
import DespachoVerPage from './pages/despachos/DespachoVerPage';
import DespachoEditarPage from './pages/despachos/DespachoEditarPage';
import DespachoNuevoPage from './pages/despachos/DespachoNuevoPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />

                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/providers"
                        element={<ProveedoresPage />}
                    />

                    <Route
                        path="/mi-ficha"
                        element={<MiFichaPage />}
                    />

                    <Route
                        path="/despachos"
                        element={<DespachosPage />}
                    />

                     <Route
                         path="/despachos/nuevo"
                        element={<DespachoNuevoPage />}
                    />

                    <Route
                        path="/despachos/:transacId/ver"
                        element={<DespachoVerPage />}
                    />

                    <Route
                        path="/despachos/:transacId/editar"
                        element={<DespachoEditarPage />}
                    />

                   

                    <Route
                        path="/usuarios"
                        element={<UsuariosPage />}
                    />

                </Route>   {/* ← FALTABA ESTE CIERRE */}

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
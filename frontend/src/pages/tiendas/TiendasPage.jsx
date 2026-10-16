import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';


import {
    listarTiendas,
    registrarTienda,
    actualizarTienda
} from '../../services/tiendas.services';


import TiendasSearch from '../../components/tiendas/TiendasSearch';
import TiendasTable from '../../components/tiendas/TiendasTable';
import TiendasForm from '../../components/tiendas/TiendasForm';

import '../../styles/proveedores.css';

function TiendasPage() {
    const [tiendas, setTiendas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [campoBusqueda, setCampoBusqueda] = useState('todos');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modoFormulario, setModoFormulario] = useState('nuevo');
    const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);

    
const handleEditar = (tienda) => {
    setError('');
    setTiendaSeleccionada(tienda);
    setModoFormulario('editar');
    setMostrarFormulario(true);
};


    const esAdmin = (() => {
        try {
            const usuario = JSON.parse(
                localStorage.getItem('usuario') || 'null'
            );

            return usuario?.rol_codigo === 'ADMIN';
        } catch {
            return false;
        }
    })();

    const cargarTiendas = async () => {
        try {
            setCargando(true);
            setError('');

            const resultado = await listarTiendas();

            const registros = Array.isArray(resultado)
                ? resultado
                : Array.isArray(resultado?.data)
                    ? resultado.data
                    : [];

            setTiendas(registros);
        } catch (err) {
            console.error('Error al cargar tiendas:', err);

            setError(
                'No fue posible cargar las tiendas. Verifique que el endpoint del backend esté implementado y disponible.'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (esAdmin) {
            cargarTiendas();
        } else {
            setCargando(false);
        }
    }, []);

    
const handleExportarExcel = () => {
    const datosExcel = tiendasFiltradas.map((tienda) => ({
        'Código Tienda': tienda.tienda_id,
        'Descripción': tienda.descripcion,
        'Departamento': tienda.departamento,
        'Provincia': tienda.provincia,
        'Ciudad': tienda.ciudad,
        'Dirección': tienda.direccion,
        'Ubigeo': tienda.ubigeo,
        'Zona': tienda.zona,
        'Administrador': tienda.administrador,
        'Correo': tienda.correo,
        'Teléfono': tienda.telefono,
        'Estado': tienda.status === 'A'
            ? 'ACTIVO'
            : tienda.status === 'I'
                ? 'INACTIVO'
                : tienda.status
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, 'Tiendas');

    XLSX.writeFile(libro, 'Listado_Tiendas.xlsx');
};



    const tiendasFiltradas = useMemo(() => {
        const criterio = criterioBusqueda.trim().toLowerCase();

        if (!criterio) {
            return tiendas;
        }

        return tiendas.filter((tienda) => {
            const campos = campoBusqueda === 'todos'
                ? [
                    tienda.tienda_id,
                    tienda.descripcion,
                    tienda.departamento,
                    tienda.provincia,
                    tienda.ciudad,
                    tienda.zona,
                    tienda.status
                ]
                : [tienda[campoBusqueda]];

            return campos
                .filter((valor) => valor !== null && valor !== undefined)
                .some((valor) =>
                    String(valor).toLowerCase().includes(criterio)
                );
        });
    }, [tiendas, campoBusqueda, criterioBusqueda]);



    
const handleNuevo = () => {
    setError('');
    setTiendaSeleccionada(null);
    setModoFormulario('nuevo');
    setMostrarFormulario(true);
};


    const handleVer = (tienda) => {
        setError('');
        setTiendaSeleccionada(tienda);
        setModoFormulario('ver');
        setMostrarFormulario(true);
    };

    const handleCancelar = () => {
        setMostrarFormulario(false);
        setTiendaSeleccionada(null);
        setModoFormulario('nuevo');
        setError('');
    };

   
const handleGuardar = async (datos) => {
    try {
        setError('');

        if (modoFormulario === 'editar') {
            if (!tiendaSeleccionada?.tienda_id) {
                throw new Error(
                    'No se encontró el código de la tienda que se desea actualizar.'
                );
            }

            await actualizarTienda(
                tiendaSeleccionada.tienda_id,
                datos
            );
        } else {
            await registrarTienda(datos);
        }

        await cargarTiendas();

        setMostrarFormulario(false);
        setTiendaSeleccionada(null);
        setModoFormulario('nuevo');

    } catch (err) {
        console.error(
            modoFormulario === 'editar'
                ? 'Error al actualizar tienda:'
                : 'Error al registrar tienda:',
            err
        );

        const mensaje =
            err.response?.data?.mensaje ||
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            (
                modoFormulario === 'editar'
                    ? 'No fue posible actualizar la tienda.'
                    : 'No fue posible registrar la tienda.'
            );

        setError(mensaje);
    }
};


    if (!esAdmin) {
        return (
            <div className="page-container">
                <h1>Acceso restringido</h1>
                <p>Solo un usuario ADMIN puede acceder al módulo Tiendas.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {!mostrarFormulario ? (
                <>
                    <h1>Tiendas</h1>

                   <TiendasSearch
    campoBusqueda={campoBusqueda}
    criterioBusqueda={criterioBusqueda}
    onCampoChange={setCampoBusqueda}
    onCriterioChange={setCriterioBusqueda}
    onNuevo={handleNuevo}
    onExportar={handleExportarExcel}
/>

                    {cargando && (
                        <div className="loading-message">
                            Cargando tiendas...
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {!cargando && !error && (
                        <TiendasTable
                            tiendas={tiendasFiltradas}
                            onVer={handleVer}
                            onEditar={handleEditar}
                        />
                    )}
                </>
            ) : (
                <>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <TiendasForm
                        modo={modoFormulario}
                        tienda={tiendaSeleccionada}
                        onCancelar={handleCancelar}
                        onGuardar={handleGuardar}
                    />
                </>
            )}
        </div>
    );
}

export default TiendasPage;

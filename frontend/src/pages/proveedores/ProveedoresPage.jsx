import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

import {
    listarProveedores
} from '../../services/proveedores.services';

import ProveedoresSearch from '../../components/proveedores/ProveedoresSearch';
import ProveedoresTable from '../../components/proveedores/ProveedoresTable';
import ProveedoresForm from '../../components/proveedores/ProveedoresForm';

function ProveedoresPage() {

    const [proveedores, setProveedores] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState('');

    const [campoBusqueda, setCampoBusqueda] = useState('todos');

    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modoFormulario, setModoFormulario] = useState('nuevo');
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

    const cargarProveedores = async () => {

        try {

            setCargando(true);
            setError('');

            const response = await listarProveedores();

            setProveedores(response.data || []);

        } catch (error) {

            console.error(
                'Error al cargar proveedores:',
                error
            );

            setError(
                'No fue posible cargar los proveedores.'
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {
        cargarProveedores();
    }, []);

    const proveedoresFiltrados = useMemo(() => {

        const criterio = criterioBusqueda
            .trim()
            .toLowerCase();

        if (!criterio) {
            return proveedores;
        }

        return proveedores.filter((proveedor) => {

            if (campoBusqueda === 'todos') {

                return [
                    proveedor.tipo_rubro,
                    proveedor.tipo_documento,
                    proveedor.nro_documento,
                    proveedor.razon_social,
                    proveedor.pagina_web,
                    proveedor.ciiu,
                    proveedor.status
                ]
                    .filter(Boolean)
                    .some((valor) =>
                        String(valor)
                            .toLowerCase()
                            .includes(criterio)
                    );
            }

            const valor = proveedor[campoBusqueda];

            return valor
                ? String(valor)
                    .toLowerCase()
                    .includes(criterio)
                : false;
        });

    }, [
        proveedores,
        campoBusqueda,
        criterioBusqueda
    ]);

   const handleNuevo = () => {
    setProveedorSeleccionado(null);
    setModoFormulario('nuevo');
    setMostrarFormulario(true);
};

    const handleVer = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('ver');
    setMostrarFormulario(true);
};

    const handleEditar = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setModoFormulario('editar');
    setMostrarFormulario(true);
};

const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setProveedorSeleccionado(null);
    setModoFormulario('nuevo');
};

const handleGuardadoFormulario = async () => {

    await cargarProveedores();

    setMostrarFormulario(false);
    setProveedorSeleccionado(null);
    setModoFormulario('nuevo');
};


    const handleExportar = () => {

        if (proveedoresFiltrados.length === 0) {
            return;
        }

        const datosExcel = proveedoresFiltrados.map(
            (proveedor) => ({
                'Tipo Rubro':
                    proveedor.tipo_rubro || '',

                'Tipo Documento':
                    proveedor.tipo_documento || '',

                'N.º Documento':
                    proveedor.nro_documento || '',

                'Razón Social':
                    proveedor.razon_social || '',

                'Página Web':
                    proveedor.pagina_web || '',

                'Actividad Económica':
                    proveedor.ciiu || '',

                'Estado Documentos':
                    '-',

                'Estado Proveedor':
                    proveedor.status === 'A'
                        ? 'ACTIVO'
                        : 'INACTIVO'
            })
        );

        const worksheet =
            XLSX.utils.json_to_sheet(datosExcel);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Proveedores'
        );

        XLSX.writeFile(
            workbook,
            'Listado_Proveedores.xlsx'
        );
    };

return (
    <div className="page-container">

        {!mostrarFormulario ? (
            <>
                <h1>Proveedores</h1>

                <ProveedoresSearch
                    campoBusqueda={campoBusqueda}
                    criterioBusqueda={criterioBusqueda}
                    onCampoChange={setCampoBusqueda}
                    onCriterioChange={setCriterioBusqueda}
                    onNuevo={handleNuevo}
                    onExportar={handleExportar}
                />

                {cargando && (
                    <div className="loading-message">
                        Cargando proveedores...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!cargando && !error && (
                    <ProveedoresTable
                        proveedores={proveedoresFiltrados}
                        onVer={handleVer}
                        onEditar={handleEditar}
                    />
                )}
            </>
        ) : (
            <ProveedoresForm
                modo={modoFormulario}
                proveedor={proveedorSeleccionado}
                onCancelar={handleCancelarFormulario}
                onGuardado={handleGuardadoFormulario}
            />
        )}

    </div>
);
}

export default ProveedoresPage;
import {
    Eye,
    Pencil
} from 'lucide-react';

function ProveedoresTable({
    proveedores,
    onVer,
    onEditar
}) {

    const obtenerEstadoProveedor = (status) => {
        return status === 'A' ? 'ACTIVO' : 'INACTIVO';
    };

    const obtenerEstadoDocumentos = () => {
        // Pendiente de definir hasta contar
        // con la estructura documental de SISOXXO.
        return '-';
    };

    const mostrarCodigoDescripcion = (codigo, descripcion) => {
    if (!codigo) {
        return '-';
    }

    if (!descripcion) {
        return codigo;
    }

    return `${codigo} - ${descripcion}`;
};

    return (
        <div className="table-container">

            <table className="proveedores-table">

                <thead>
                    <tr>
                        <th>Tipo Rubro</th>
                        <th>Tipo Documento</th>
                        <th>N.º Documento</th>
                        <th>Razón Social</th>
                        <th>Página Web</th>
                        <th>Actividad Económica</th>
                        <th>Estado Documentos</th>
                        <th>Estado Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {proveedores.length === 0 ? (

                        <tr>
                            <td
                                colSpan="9"
                                className="empty-table"
                            >
                                No existen proveedores para mostrar.
                            </td>
                        </tr>

                    ) : (

                        proveedores.map((proveedor) => (

                            <tr key={proveedor.proveedor_id}>

                               <td>
    {mostrarCodigoDescripcion(
        proveedor.tipo_rubro,
        proveedor.tipo_rubro_descripcion
    )}
</td>

                                <td>
    {mostrarCodigoDescripcion(
        proveedor.tipo_documento,
        proveedor.tipo_documento_descripcion
    )}
</td>
                                <td>
                                    {proveedor.nro_documento || '-'}
                                </td>

                                <td>
                                    {proveedor.razon_social || '-'}
                                </td>

                                <td>
                                    {proveedor.pagina_web || '-'}
                                </td>

                                <td>
    {mostrarCodigoDescripcion(
        proveedor.ciiu,
        proveedor.ciiu_descripcion
    )}
</td>

                                <td>
                                    <span className="status-documentos">
                                        {obtenerEstadoDocumentos()}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={
                                            proveedor.status === 'A'
                                                ? 'status-activo'
                                                : 'status-inactivo'
                                        }
                                    >
                                        {obtenerEstadoProveedor(
                                            proveedor.status
                                        )}
                                    </span>
                                </td>

                                <td>

                                    <div className="row-actions">

                                        <button
                                            type="button"
                                            className="btn-row btn-view"
                                            onClick={() =>
                                                onVer(proveedor)
                                            }
                                            title="Visualizar proveedor"
                                        >
                                            <Eye size={15} />
                                            Ver
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-row btn-edit"
                                            onClick={() =>
                                                onEditar(proveedor)
                                            }
                                            title="Editar proveedor"
                                        >
                                            <Pencil size={15} />
                                            Editar
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default ProveedoresTable;
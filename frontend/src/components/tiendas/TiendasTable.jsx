
import { Eye, Pencil } from 'lucide-react';

function TiendasTable({ tiendas, onVer, onEditar }) {
    return (
        <div className="table-container">
            <table className="proveedores-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Departamento</th>
                        <th>Provincia</th>
                        <th>Ciudad</th>
                        <th>Zona</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {tiendas.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="empty-table">
                                No existen tiendas para mostrar.
                            </td>
                        </tr>
                    ) : (
                        tiendas.map((tienda) => (
                            <tr key={tienda.tienda_id}>
                                <td>{tienda.tienda_id}</td>
                                <td>{tienda.descripcion || '-'}</td>
                                <td>{tienda.departamento || '-'}</td>
                                <td>{tienda.provincia || '-'}</td>
                                <td>{tienda.ciudad || '-'}</td>
                                <td>{tienda.zona || '-'}</td>
                                <td>
                                    {tienda.status === 'A'
                                        ? 'ACTIVO'
                                        : tienda.status === 'I'
                                            ? 'INACTIVO'
                                            : tienda.status || '-'}
                                </td>
                                <td>
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            className="btn-row btn-view"
                                            onClick={() => onVer(tienda)}
                                            title="Ver tienda"
                                        >
                                            <Eye size={15} />
                                            Ver
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-row btn-edit"
                                            onClick={() => onEditar(tienda)}
                                            title="Editar tienda"
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

export default TiendasTable;

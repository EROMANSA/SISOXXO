import {
    Plus,
    FileSpreadsheet,
    Search
} from 'lucide-react';

function ProveedoresSearch({
    campoBusqueda,
    criterioBusqueda,
    onCampoChange,
    onCriterioChange,
    onNuevo,
    onExportar
}) {
    return (
        <div className="search-panel">

            <div className="search-section">
                <div className="section-label">
                    Búsqueda
                </div>

                <div className="search-controls">

                    <select
                        value={campoBusqueda}
                        onChange={(e) => onCampoChange(e.target.value)}
                    >
                        <option value="todos">
                            Todos los campos
                        </option>
                        <option value="tipo_rubro">
                            Tipo Rubro
                        </option>
                        <option value="tipo_documento">
                            Tipo Documento
                        </option>
                        <option value="nro_documento">
                            N.º Documento
                        </option>
                        <option value="razon_social">
                            Razón Social
                        </option>
                        <option value="pagina_web">
                            Página Web
                        </option>
                        <option value="ciiu">
                            Actividad Económica
                        </option>
                        <option value="estado_documentos">
                            Estado Documentos
                        </option>
                        <option value="status">
                            Estado Proveedor
                        </option>
                    </select>

                    <div className="search-input-wrapper">
                        <Search size={17} />

                        <input
                            type="text"
                            value={criterioBusqueda}
                            onChange={(e) =>
                                onCriterioChange(e.target.value)
                            }
                            placeholder="Ingrese el criterio de búsqueda..."
                        />
                    </div>

                </div>
            </div>

            <div className="actions-section">

                <div className="section-label">
                    Acciones de Registro
                </div>

                <div className="action-buttons">

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onNuevo}
                    >
                        <Plus size={16} />
                        Nuevo Proveedor
                    </button>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={onExportar}
                    >
                        <FileSpreadsheet size={16} />
                        Exportar Excel
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProveedoresSearch;
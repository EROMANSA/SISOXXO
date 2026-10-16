import { Plus, Search, Download } from 'lucide-react';

function TiendasSearch({
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
                        onChange={(e) =>
                            onCampoChange(e.target.value)
                        }
                    >
                        <option value="todos">
                            Todos los campos
                        </option>
                        <option value="tienda_id">
                            Código Tienda
                        </option>
                        <option value="descripcion">
                            Descripción
                        </option>
                        <option value="departamento">
                            Departamento
                        </option>
                        <option value="provincia">
                            Provincia
                        </option>
                        <option value="ciudad">
                            Ciudad
                        </option>
                        <option value="zona">
                            Zona
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
                        Nueva Tienda
                    </button>

                   
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={onExportar}
                    >
                        <Download size={16} />
                        Exportar Excel
                    </button>
             

                </div>
            </div>
        </div>
    );
}

export default TiendasSearch;

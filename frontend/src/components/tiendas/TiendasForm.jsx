import { useEffect, useState } from 'react';
import {
    listarDepartamentos,
    listarProvincias,
    listarDistritos,
    obtenerUbigeo
} from '../../services/ubigeo.services';

const FORMULARIO_INICIAL = {
    tienda_id: '',
    descripcion: '',
    departamento: '',
    provincia: '',
    ciudad: '',
    direccion: '',
    ubigeo: '',
    zona: '',
    administrador: '',
    correo: '',
    telefono: '',
    status: 'A'
};

function TiendasForm({ modo = 'nuevo', tienda = null, onCancelar, onGuardar }) {
    const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL });
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [error, setError] = useState('');

    const soloConsulta = modo === 'ver';
    const esEdicion = modo === 'editar';

    useEffect(() => {
        const cargarDepartamentos = async () => {
            try {
                const response = await listarDepartamentos();
                setDepartamentos(response.data || []);
            } catch (err) {
                console.error('Error al cargar departamentos:', err);
                setDepartamentos([]);
                setError('No fue posible cargar la lista de departamentos.');
            }
        };

        cargarDepartamentos();
    }, []);

    useEffect(() => {
        let activo = true;

        const cargarTiendaYUbicacion = async () => {
            setError('');

            if (!tienda) {
                setFormulario({ ...FORMULARIO_INICIAL });
                setProvincias([]);
                setDistritos([]);
                return;
            }

            setFormulario({
                ...FORMULARIO_INICIAL,
                ...tienda,
                tienda_id: String(tienda.tienda_id ?? ''),
                ubigeo: tienda.ubigeo == null ? '' : String(tienda.ubigeo),
                status: tienda.status || 'A'
            });

            try {
                if (tienda.departamento) {
                    const responseProvincias = await listarProvincias(tienda.departamento);
                    if (activo) setProvincias(responseProvincias.data || []);
                } else if (activo) {
                    setProvincias([]);
                }

                if (tienda.departamento && tienda.provincia) {
                    const responseDistritos = await listarDistritos(
                        tienda.departamento,
                        tienda.provincia
                    );
                    if (activo) setDistritos(responseDistritos.data || []);
                } else if (activo) {
                    setDistritos([]);
                }
            } catch (err) {
                console.error('Error al cargar ubicación de la tienda:', err);
                if (activo) {
                    setProvincias([]);
                    setDistritos([]);
                    setError('No fue posible cargar la ubicación registrada.');
                }
            }
        };

        cargarTiendaYUbicacion();
        return () => { activo = false; };
    }, [tienda, modo]);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario((actual) => ({
            ...actual,
            [name]: name === 'tienda_id' ? value.slice(0, 5) : value
        }));
        setError('');
    };

    const manejarDepartamentoChange = async (e) => {
        const departamento = e.target.value;
        setFormulario((actual) => ({
            ...actual,
            departamento,
            provincia: '',
            ciudad: '',
            ubigeo: ''
        }));
        setProvincias([]);
        setDistritos([]);
        setError('');

        if (!departamento) return;

        try {
            const response = await listarProvincias(departamento);
            setProvincias(response.data || []);
        } catch (err) {
            console.error('Error al cargar provincias:', err);
            setProvincias([]);
            setError('No fue posible cargar las provincias.');
        }
    };

    const manejarProvinciaChange = async (e) => {
        const provincia = e.target.value;
        const departamento = formulario.departamento;

        setFormulario((actual) => ({
            ...actual,
            provincia,
            ciudad: '',
            ubigeo: ''
        }));
        setDistritos([]);
        setError('');

        if (!departamento || !provincia) return;

        try {
            const response = await listarDistritos(departamento, provincia);
            setDistritos(response.data || []);
        } catch (err) {
            console.error('Error al cargar ciudades/distritos:', err);
            setDistritos([]);
            setError('No fue posible cargar las ciudades.');
        }
    };

    const manejarCiudadChange = async (e) => {
        const ciudad = e.target.value;
        const { departamento, provincia } = formulario;

        setFormulario((actual) => ({ ...actual, ciudad, ubigeo: '' }));
        setError('');

        if (!departamento || !provincia || !ciudad) return;

        try {
            const response = await obtenerUbigeo(departamento, provincia, ciudad);
            const datos = response.data;
            const ubigeo = datos?.ubigeo_inei ?? datos?.ubigeo ?? '';

            setFormulario((actual) => ({
                ...actual,
                ciudad,
                ubigeo: ubigeo === '' ? '' : String(ubigeo)
            }));
        } catch (err) {
            console.error('Error al obtener Ubigeo:', err);
            setFormulario((actual) => ({ ...actual, ciudad, ubigeo: '' }));
            setError('No fue posible recuperar el Ubigeo de la ciudad seleccionada.');
        }
    };

    const manejarEnvio = (e) => {
        e.preventDefault();

        const codigo = formulario.tienda_id.trim();
        if (!codigo) {
            setError('Debe ingresar el código de la tienda.');
            return;
        }
        if (codigo.length > 5) {
            setError('El código de tienda admite máximo 5 caracteres.');
            return;
        }
        if (!formulario.descripcion.trim()) {
            setError('Debe ingresar la descripción de la tienda.');
            return;
        }

        onGuardar({
            ...formulario,
            tienda_id: codigo,
            descripcion: formulario.descripcion.trim(),
            ubigeo: formulario.ubigeo === '' ? null : Number(formulario.ubigeo)
        });
    };

    const titulo = soloConsulta
        ? 'Consultar Tienda'
        : esEdicion
            ? 'Editar Tienda'
            : 'Nueva Tienda';

    const estiloFila = (columnas) => ({
        display: 'grid',
        gridTemplateColumns: columnas,
        gap: '16px',
        alignItems: 'start'
    });

    return (
        <form className="proveedor-form" onSubmit={manejarEnvio}>
            <h2>{titulo}</h2>

            <div className="form-section">
                <h3>1.- Información General</h3>

                {/* Fila 1: Código, Descripción y Estado */}
                <div className="form-grid" style={estiloFila('1fr 2fr 1fr')}>
                    <div className="form-group">
                        <label htmlFor="tienda_id">Código Tienda *</label>
                        <input
                            id="tienda_id"
                            name="tienda_id"
                            type="text"
                            maxLength={5}
                            value={formulario.tienda_id}
                            onChange={manejarCambio}
                            disabled={soloConsulta || esEdicion}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción *</label>
                        <input
                            id="descripcion"
                            name="descripcion"
                            type="text"
                            maxLength={255}
                            value={formulario.descripcion}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Estado</label>
                        <select
                            id="status"
                            name="status"
                            value={formulario.status}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        >
                            <option value="A">ACTIVO</option>
                            <option value="I">INACTIVO</option>
                        </select>
                    </div>
                </div>

                {/* Fila 2: Departamento, Provincia, Ciudad y Ubigeo */}
                <div className="form-grid" style={estiloFila('1fr 1fr 1fr 0.8fr')}>
                    <div className="form-group">
                        <label htmlFor="departamento">Departamento</label>
                        <select
                            id="departamento"
                            name="departamento"
                            value={formulario.departamento}
                            onChange={manejarDepartamentoChange}
                            disabled={soloConsulta}
                        >
                            <option value="">Seleccione...</option>
                            {departamentos.map((item) => (
                                <option key={item.departamento} value={item.departamento}>
                                    {item.departamento}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="provincia">Provincia</label>
                        <select
                            id="provincia"
                            name="provincia"
                            value={formulario.provincia}
                            onChange={manejarProvinciaChange}
                            disabled={soloConsulta || !formulario.departamento}
                        >
                            <option value="">Seleccione...</option>
                            {provincias.map((item) => (
                                <option key={item.provincia} value={item.provincia}>
                                    {item.provincia}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ciudad">Ciudad</label>
                        <select
                            id="ciudad"
                            name="ciudad"
                            value={formulario.ciudad}
                            onChange={manejarCiudadChange}
                            disabled={soloConsulta || !formulario.provincia}
                        >
                            <option value="">Seleccione...</option>
                            {distritos.map((item) => (
                                <option key={item.distrito} value={item.distrito}>
                                    {item.distrito}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ubigeo">Ubigeo</label>
                        <input
                            id="ubigeo"
                            name="ubigeo"
                            type="text"
                            value={formulario.ubigeo}
                            readOnly
                            placeholder="Automático"
                        />
                    </div>
                </div>

                {/* Fila 3: Dirección y Zona */}
                <div className="form-grid" style={estiloFila('2fr 1fr')}>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            id="direccion"
                            name="direccion"
                            maxLength={200}
                            value={formulario.direccion || ''}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="zona">Zona</label>
                        <input
                            id="zona"
                            name="zona"
                            maxLength={5}
                            value={formulario.zona || ''}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        />
                    </div>
                </div>

                {/* Fila 4: Administrador, Correo y Teléfono */}
                <div className="form-grid" style={estiloFila('1fr 1fr 1fr')}>
                    <div className="form-group">
                        <label htmlFor="administrador">Administrador</label>
                        <input
                            id="administrador"
                            name="administrador"
                            maxLength={150}
                            value={formulario.administrador || ''}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">Correo</label>
                        <input
                            id="correo"
                            name="correo"
                            type="email"
                            maxLength={150}
                            value={formulario.correo || ''}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                            id="telefono"
                            name="telefono"
                            type="text"
                            maxLength={25}
                            value={formulario.telefono || ''}
                            onChange={manejarCambio}
                            disabled={soloConsulta}
                        />
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button type="button" className="btn-cancelar" onClick={onCancelar}>
                    Cerrar
                </button>

                {!soloConsulta && (
                    <button type="submit" className="btn-guardar">
                        Guardar
                    </button>
                )}
            </div>
        </form>
    );
}

export default TiendasForm;

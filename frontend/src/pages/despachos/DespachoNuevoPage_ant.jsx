import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    obtenerMiFicha
} from '../../services/proveedores.services';

import {
    listarTiendasOxxo,
    listarTiposRubro
} from '../../services/listas.services';
import {
    crearDespacho
} from '../../services/despachos.services';


const estilos = {

    pageContainer: {
        padding: '20px'
    },

    titulo: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: '4px'
    },

    subtitulo: {
        fontSize: '13px',
        color: '#64748B',
        marginBottom: '20px'
    },

    seccion: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '18px'
    },

    tituloSeccion: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: '18px'
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '16px'
    },

    campo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },

    etiqueta: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#334155'
    },

    input: {
        padding: '9px 12px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#FFFFFF'
    },

    inputReadonly: {
        padding: '9px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#F8FAFC',
        color: '#475569'
    },

    textarea: {
        width: '100%',
        minHeight: '90px',
        padding: '9px 12px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        fontSize: '13px',
        resize: 'vertical',
        boxSizing: 'border-box'
    },

    acciones: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '10px'
    },

    botonCancelar: {
        padding: '10px 18px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        color: '#334155',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },

    botonGuardar: {
        padding: '10px 18px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },

    mensaje: {
        padding: '20px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '14px'
    },

    error: {
        marginBottom: '16px',
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        color: '#B91C1C',
        fontSize: '13px'
    }
};


const DespachoNuevoPage = () => {

    const navigate = useNavigate();

    const [proveedor, setProveedor] = useState(null);
    const [tiendas, setTiendas] = useState([]);
    const [tiposRubro, setTiposRubro] = useState([]);

    const [destinoId, setDestinoId] = useState('');
    const [fechaProgramacion, setFechaProgramacion] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {

        const cargarDatosIniciales = async () => {

            try {

                setCargando(true);
                setError('');

                const [
                    fichaResponse,
                    tiendasResponse,
                    tiposRubroResponse
                ] = await Promise.all([
                    obtenerMiFicha(),
                    listarTiendasOxxo(),
                    listarTiposRubro()
                ]);

                setProveedor(
                    fichaResponse?.data || null
                );

                setTiendas(
                    Array.isArray(tiendasResponse)
                        ? tiendasResponse
                        : Array.isArray(tiendasResponse?.data)
                            ? tiendasResponse.data
                            : []
                );

                setTiposRubro(
                    Array.isArray(tiposRubroResponse?.data)
                        ? tiposRubroResponse.data
                        : []
                );

            } catch (err) {

                console.error(
                    'Error al cargar datos del despacho:',
                    err
                );

                setError(
                    'No fue posible cargar la información inicial del despacho.'
                );

            } finally {

                setCargando(false);

            }
        };

        cargarDatosIniciales();

    }, []);


    const handleGuardar = async (event) => {

        event.preventDefault();

        setError('');

        if (!destinoId) {
            setError('Debe seleccionar el destino OXXO.');
            return;
        }

        if (!fechaProgramacion) {
            setError('Debe ingresar la fecha de programación.');
            return;
        }

        try {

            setGuardando(true);

            const response = await crearDespacho({

                destinoId,

                fechaProgramacion,

                observaciones:
                    observaciones.trim() || null

            });

            if (response?.ok === false) {

                setError(
                    response?.mensaje ||
                    'No fue posible registrar el despacho.'
                );

                return;
            }

            navigate('/despachos');

        } catch (err) {

            console.error(
                'Error al crear despacho:',
                err
            );

            setError(
                err?.response?.data?.mensaje ||
                'No fue posible registrar el despacho.'
            );

        } finally {

            setGuardando(false);

        }
    };


    if (cargando) {

        return (
            <div style={estilos.pageContainer}>
                <div style={estilos.mensaje}>
                    Cargando información del despacho...
                </div>
            </div>
        );

    }

    const tipoRubroDescripcion =
    tiposRubro.find(
        (item) =>
            String(item.codigo_valor) ===
            String(proveedor?.tipo_rubro)
    )?.descripcion ||
    proveedor?.tipo_rubro ||
    '';


    return (

        <div style={estilos.pageContainer}>

            <div style={estilos.titulo}>
                Nuevo Despacho
            </div>

            <div style={estilos.subtitulo}>
                Registro de un nuevo despacho
            </div>


            {error && (
                <div style={estilos.error}>
                    {error}
                </div>
            )}


            {/* ==================================================
                DATOS DEL PROVEEDOR
            ================================================== */}

            <div style={estilos.seccion}>

                <div style={estilos.tituloSeccion}>
                    Datos del Proveedor
                </div>

                <div style={estilos.grid}>

                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Proveedor
                        </label>

                        <input
                            type="text"
                            value={
                                proveedor?.razon_social || ''
                            }
                            readOnly
                            style={estilos.inputReadonly}
                        />

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Tipo Rubro
                        </label>

                        <input
                            type="text"
                            value={tipoRubroDescripcion}
                            readOnly
                            style={estilos.inputReadonly}/>

                    </div>

                </div>

            </div>


            {/* ==================================================
                DATOS DEL DESPACHO
            ================================================== */}

            <div style={estilos.seccion}>

                <div style={estilos.tituloSeccion}>
                    Datos del Despacho
                </div>

                <div style={estilos.grid}>

                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Destino OXXO
                        </label>

                        <select
                            value={destinoId}
                            onChange={(event) =>
                                setDestinoId(
                                    event.target.value
                                )
                            }
                            style={estilos.input}
                        >

                            <option value="">
                                Seleccionar destino
                            </option>

                            {tiendas.map((tienda) => (

                                <option
                                    key={
                                        tienda.codigo_valor ||
                                        tienda.codigo ||
                                        tienda.id
                                    }
                                    value={
                                        tienda.codigo_valor ||
                                        tienda.codigo ||
                                        tienda.id
                                    }
                                >
                                    {
                                        tienda.descripcion ||
                                        tienda.nombre ||
                                        tienda.valor ||
                                        tienda.codigo_valor
                                    }
                                </option>

                            ))}

                        </select>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Fecha de Programación
                        </label>

                        <input
                            type="date"
                            value={fechaProgramacion}
                            onChange={(event) =>
                                setFechaProgramacion(
                                    event.target.value
                                )
                            }
                            style={estilos.input}
                        />

                    </div>

                </div>


                <div
                    style={{
                        ...estilos.campo,
                        marginTop: '16px'
                    }}
                >

                    <label style={estilos.etiqueta}>
                        Observaciones
                    </label>

                    <textarea
                        value={observaciones}
                        onChange={(event) =>
                            setObservaciones(
                                event.target.value
                            )
                        }
                        style={estilos.textarea}
                    />

                </div>

            </div>


            {/* ==================================================
                ACCIONES
            ================================================== */}

            <div style={estilos.acciones}>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/despachos')
                    }
                    disabled={guardando}
                    style={estilos.botonCancelar}
                >
                    Cancelar
                </button>


                <button
                    type="button"
                    onClick={handleGuardar}
                    disabled={guardando}
                    style={{
                        ...estilos.botonGuardar,
                        opacity: guardando ? 0.7 : 1
                    }}
                >
                    {guardando
                        ? 'Guardando...'
                        : 'Guardar Despacho'}
                </button>

            </div>

        </div>

    );

};

export default DespachoNuevoPage;
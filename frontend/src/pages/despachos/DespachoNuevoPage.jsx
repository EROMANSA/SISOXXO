import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    obtenerMiFicha
} from '../../services/proveedores.services';

import {
    listarTiendasOxxo,
    listarTiposRubro,
    listarUnidadesMedida,
    listarTiposDespacho
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
        padding: '8px 10px',
        border: '1px solid #CBD5E1',
        borderRadius: '5px',
        fontSize: '12px',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box',
        width: '100%'
    },

    inputReadonly: {
        padding: '9px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#F8FAFC',
        color: '#475569',
        width: '100%',
        boxSizing: 'border-box'
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

    botonAgregar: {
        padding: '8px 14px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: '12px',
        cursor: 'pointer'
    },

    botonEliminar: {
        padding: '5px 9px',
        border: '1px solid #DC2626',
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
        color: '#DC2626',
        fontSize: '12px',
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
    },

    tablaContainer: {
        width: '100%',
        overflowX: 'auto',
        border: '1px solid #E2E8F0',
        borderRadius: '6px'
    },

    tabla: {
        width: '100%',
        minWidth: '1200px',
        borderCollapse: 'collapse'
    },

    th: {
        padding: '9px 8px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #CBD5E1',
        color: '#334155',
        fontSize: '11px',
        fontWeight: '700',
        textAlign: 'left',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '7px 6px',
        borderBottom: '1px solid #E2E8F0',
        verticalAlign: 'middle'
    },

    estado: {
        display: 'inline-block',
        padding: '5px 8px',
        borderRadius: '4px',
        backgroundColor: '#EFF6FF',
        color: '#1D4ED8',
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap'
    },

    detalleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    }
};


/*
==============================================================
CONFIGURACIÓN DE CAMPOS ESPECÍFICOS POR TIPO DE RUBRO
==============================================================
*/

const CAMPOS_RUBRO = {

    '001': [
        {
            campo: 'fecha_beneficio_ini',
            titulo: 'Fecha Beneficio Inicio',
            tipo: 'date'
        },
        {
            campo: 'fecha_beneficio_fin',
            titulo: 'Fecha Beneficio Fin',
            tipo: 'date'
        },
        {
            campo: 'nro_guia_nota_venta',
            titulo: 'N.º Guía / Nota Venta',
            tipo: 'text'
        },
        {
            campo: 'codigo_nro_lote',
            titulo: 'Código Lote',
            tipo: 'text'
        },
        {
            campo: 'fecha_lote_venci',
            titulo: 'Vencimiento Lote',
            tipo: 'date'
        }
    ],

    '002': [
        {
            campo: 'terminal_origen',
            titulo: 'Terminal Origen',
            tipo: 'text'
        },
        {
            campo: 'temperatura_descarga',
            titulo: 'Temperatura Descarga',
            tipo: 'text'
        },
        {
            campo: 'codigo_nro_lote',
            titulo: 'Código Lote',
            tipo: 'text'
        },
        {
            campo: 'fecha_lote_venci',
            titulo: 'Vencimiento Lote',
            tipo: 'date'
        }
    ],

    '003': [
        {
            campo: 'registro_sanitario',
            titulo: 'Registro Sanitario',
            tipo: 'text'
        },
        {
            campo: 'fecha_registro_ini',
            titulo: 'Fecha Emisión Registro',
            tipo: 'date'
        },
        {
            campo: 'fecha_registro_fin',
            titulo: 'Fecha Vencimiento Registro',
            tipo: 'date'
        },
        {
            campo: 'codigo_nro_lote',
            titulo: 'Código Lote',
            tipo: 'text'
        },
        {
            campo: 'fecha_lote_venci',
            titulo: 'Vencimiento Lote',
            tipo: 'date'
        }
    ],

    '004': [
        {
            campo: 'procedencia',
            titulo: 'Procedencia',
            tipo: 'text'
        },
        {
            campo: 'tipo_despacho',
            titulo: 'Tipo Despacho',
            tipo: 'text'
        },
        {
            campo: 'fecha_cosecha',
            titulo: 'Fecha Cosecha',
            tipo: 'date'
        },
        {
            campo: 'fecha_ingreso',
            titulo: 'Fecha Ingreso',
            tipo: 'date'
        }
    ]

};


const crearLineaVacia = (lineaId) => {

    return {

        linea_id: lineaId,

        producto_especie: '',

        cantidad: '',

        tipo_unid_med: '',
        pesaje_en_kg: '',

        terminal_origen: '',
        temperatura_descarga: '',

        fecha_beneficio_ini: '',
        fecha_beneficio_fin: '',
        nro_guia_nota_venta: '',

        registro_sanitario: '',
        fecha_registro_ini: '',
        fecha_registro_fin: '',

        procedencia: '',
        tipo_despacho: '',
        fecha_cosecha: '',
        fecha_ingreso: '',

        codigo_nro_lote: '',
        fecha_lote_venci: '',

        observaciones: '',

        estado_despacho: 'PRO',

        estado_despacho_descripcion: 'Programado'

    };
};


const DespachoNuevoPage = () => {

    const navigate = useNavigate();

    const [proveedor, setProveedor] = useState(null);

    const [tiendas, setTiendas] = useState([]);

    const [tiposRubro, setTiposRubro] = useState([]);

    const [unidadesMedida, setUnidadesMedida] = useState([]);

    const [tiposDespacho, setTiposDespacho] = useState([]);

    const [lineas, setLineas] = useState([]);

    const [destinoId, setDestinoId] = useState('');

    const [fechaProgramacion, setFechaProgramacion] =
        useState('');

    const [observaciones, setObservaciones] =
        useState('');

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState('');

    const [guardando, setGuardando] =
    useState(false);    


    useEffect(() => {

        const cargarDatosIniciales = async () => {

            try {

                setCargando(true);
                setError('');

                const [
                    fichaResponse,
                    tiendasResponse,
                    tiposRubroResponse,
                    unidadesMedidaResponse,
                    tiposDespachoResponse
                ] = await Promise.all([

                    obtenerMiFicha(),

                    listarTiendasOxxo(),

                    listarTiposRubro(),

                    listarUnidadesMedida(),

                    listarTiposDespacho()

                ]);


                setProveedor(
                    fichaResponse?.data || null
                );


                setTiendas(
                    Array.isArray(tiendasResponse)
                        ? tiendasResponse
                        : Array.isArray(
                            tiendasResponse?.data
                        )
                            ? tiendasResponse.data
                            : []
                );


                setTiposRubro(
                    Array.isArray(
                        tiposRubroResponse?.data
                    )
                        ? tiposRubroResponse.data
                        : []
                );

                setUnidadesMedida(
                    Array.isArray(unidadesMedidaResponse?.data)
                        ? unidadesMedidaResponse.data
                        : []
                );

                setTiposDespacho(
                    Array.isArray(tiposDespachoResponse?.data)
                        ? tiposDespachoResponse.data
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


    const tipoRubroDescripcion =
        tiposRubro.find(
            (item) =>
                String(item.codigo_valor) ===
                String(proveedor?.tipo_rubro)
        )?.descripcion ||
        proveedor?.tipo_rubro ||
        '';


    const camposEspecificos =
        CAMPOS_RUBRO[
            String(proveedor?.tipo_rubro || '')
        ] || [];


    const agregarLinea = () => {

        const nuevoLineaId =
    lineas.length > 0
        ? Math.max(
            ...lineas.map(
                (linea) => Number(linea.linea_id) || 0
            )
        ) + 1
        : 1;

        setLineas([
            ...lineas,
            crearLineaVacia(nuevoLineaId)
        ]);

    };


    const eliminarLinea = (lineaId) => {

        setLineas(
            lineas.filter(
                (linea) =>
                    linea.linea_id !== lineaId
            )
        );

    };


    const actualizarLinea = (
        lineaId,
        campo,
        valor
    ) => {

        setLineas(
            lineas.map((linea) => {

                if (
                    linea.linea_id !== lineaId
                ) {
                    return linea;
                }

                return {
                    ...linea,
                    [campo]: valor
                };

            })
        );

    };

    const guardarDespacho = async () => {

    setError('');

    if (!destinoId) {
        setError('Debe seleccionar el destino OXXO.');
        return;
    }

    if (lineas.length === 0) {
        setError('Debe registrar al menos una línea de detalle.');
        return;
    }

    for (const linea of lineas) {

        if (!linea.producto_especie?.trim()) {
            setError(
                `Debe ingresar el Producto / Especie de la línea ${linea.linea_id}.`
            );
            return;
        }

        if (
            linea.cantidad === '' ||
            linea.cantidad === null ||
            Number(linea.cantidad) < 0
        ) {
            setError(
                `La cantidad de la línea ${linea.linea_id} no es válida.`
            );
            return;
        }

        if (!linea.tipo_unid_med) {
            setError(
                `Debe seleccionar la Unidad de Medida de la línea ${linea.linea_id}.`
            );
            return;
        }
    }

    try {

        setGuardando(true);

        const detalles = lineas.map((linea) => ({
            producto_especie: linea.producto_especie?.trim() || null,
            cantidad:
                linea.cantidad === ''
                    ? null
                    : Number(linea.cantidad),
            tipo_unid_med: linea.tipo_unid_med || null,

            pesaje_en_kg:
                linea.pesaje_en_kg === ''
                            ? null
                            : Number(linea.pesaje_en_kg),

            terminal_origen:
                linea.terminal_origen?.trim() || null,

            temperatura_descarga:
                linea.temperatura_descarga?.trim() || null,

            fecha_beneficio_ini:
                linea.fecha_beneficio_ini || null,

            fecha_beneficio_fin:
                linea.fecha_beneficio_fin || null,

            nro_guia_nota_venta:
                linea.nro_guia_nota_venta?.trim() || null,

            registro_sanitario:
                linea.registro_sanitario?.trim() || null,

            fecha_registro_ini:
                linea.fecha_registro_ini || null,

            fecha_registro_fin:
                linea.fecha_registro_fin || null,

            procedencia:
                linea.procedencia?.trim() || null,

            tipo_despacho:
                linea.tipo_despacho || null,

            fecha_cosecha:
                linea.fecha_cosecha || null,

            fecha_ingreso:
                linea.fecha_ingreso || null,

            codigo_nro_lote:
                linea.codigo_nro_lote?.trim() || null,

            fecha_lote_venci:
                linea.fecha_lote_venci || null,

            observaciones:
                linea.observaciones?.trim() || null
        }));

        const payload = {
            destinoId,
            fechaProgramacion:
                fechaProgramacion || null,
            observaciones:
                observaciones?.trim() || null,
            detalles
        };

        await crearDespacho(payload);

        navigate('/despachos');

    } catch (err) {

        console.error(
            'Error al guardar despacho:',
            err
        );

        const mensaje =
            err?.response?.data?.mensaje ||
            err?.response?.data?.error ||
            'No fue posible guardar el despacho.';

        setError(mensaje);

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
                                proveedor?.razon_social ||
                                ''
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
                            value={
                                tipoRubroDescripcion
                            }
                            readOnly
                            style={estilos.inputReadonly}
                        />

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

                            {tiendas.map(
                                (tienda) => (

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

                                )
                            )}

                        </select>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Fecha de Programación
                        </label>

                        <input
                            type="date"
                            value={
                                fechaProgramacion
                            }
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
                DETALLE DEL DESPACHO
            ================================================== */}

            <div style={estilos.seccion}>

                <div style={estilos.detalleHeader}>

                    <div style={estilos.tituloSeccion}>
                        Detalle del Despacho
                    </div>

                    <button
                        type="button"
                        style={estilos.botonAgregar}
                        onClick={agregarLinea}
                    >
                        + Agregar línea
                    </button>

                </div>


                {lineas.length === 0 ? (

                    <div style={estilos.mensaje}>
                        No existen líneas registradas.
                        Presione "+ Agregar línea" para
                        registrar el detalle.
                    </div>

                ) : (

                    <div style={estilos.tablaContainer}>

                        <table style={estilos.tabla}>

                            <thead>

                                <tr>

                                    <th style={estilos.th}>
                                        N.º
                                    </th>

                                    <th style={estilos.th}>
                                        Producto / Especie
                                    </th>

                                    <th style={estilos.th}>
                                        Cantidad
                                    </th>

                                    <th style={estilos.th}>
                                        Unidad Medida
                                    </th>

                                    <th style={estilos.th}>
    Pesaje en Kg
</th>

                                    {camposEspecificos.map(
    (campo) => (

        <th
            key={campo.campo}
            style={estilos.th}
        >
            {campo.titulo}
        </th>

    )
)}




                                    <th style={estilos.th}>
                                        Observaciones
                                    </th>

                                    <th style={estilos.th}>
                                        Estado
                                    </th>

                                    <th style={estilos.th}>
                                        Acción
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {lineas.map(
                                    (linea) => (

                                        <tr
                                            key={
                                                linea.linea_id
                                            }
                                        >

                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >
                                                {
                                                    linea.linea_id
                                                }
                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                <input
    type="text"
    value={
        linea.producto_especie
    }
    onChange={(event) =>
        actualizarLinea(
            linea.linea_id,
            'producto_especie',
            event.target.value
        )
    }
    style={
        estilos.input
    }
/>

                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    value={
                                                        linea.cantidad
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        actualizarLinea(
                                                            linea.linea_id,
                                                            'cantidad',
                                                            event.target.value
                                                        )
                                                    }
                                                    style={{
                                                        ...estilos.input,
                                                        width: '100px'
                                                    }}
                                                />

                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                              <select
                                                    value={linea.tipo_unid_med}
                                                    onChange={(event) =>
                                                        actualizarLinea(
                                                            linea.linea_id,
                                                            'tipo_unid_med',
                                                            event.target.value
                                                        )
                                                    }
                                                    style={estilos.input}
                                                >
                                                    <option value="">
                                                        Seleccionar
                                                    </option>

                                                    {unidadesMedida.map((unidad) => (
                                                        <option
                                                            key={unidad.codigo_valor}
                                                            value={unidad.codigo_valor}
                                                        >
                                                            {unidad.descripcion}
                                                        </option>
                                                    ))}
                                                </select>

                                            </td>

                                            <td
    style={estilos.td}
>
    <input
        type="number"
        min="0"
        step="0.01"
        value={linea.pesaje_en_kg}
        onChange={(event) =>
            actualizarLinea(
                linea.linea_id,
                'pesaje_en_kg',
                event.target.value
            )
        }
        style={estilos.input}
    />
</td>

                                            {camposEspecificos.map(
    (campo) => (

        <td
            key={campo.campo}
            style={estilos.td}
        >

            {campo.campo === 'tipo_despacho' ? (

                <select
                    value={
                        linea[campo.campo] || ''
                    }
                    onChange={(event) =>
                        actualizarLinea(
                            linea.linea_id,
                            campo.campo,
                            event.target.value
                        )
                    }
                    style={estilos.input}
                >

                    <option value="">
                        Seleccionar
                    </option>

                    {tiposDespacho.map(
                        (tipo) => (

                            <option
                                key={tipo.codigo_valor}
                                value={tipo.codigo_valor}
                            >
                                {tipo.descripcion}
                            </option>

                        )
                    )}

                </select>

            ) : (

                <input
                    type={campo.tipo}
                    value={
                        linea[campo.campo] || ''
                    }
                    onChange={(event) =>
                        actualizarLinea(
                            linea.linea_id,
                            campo.campo,
                            event.target.value
                        )
                    }
                    style={estilos.input}
                />

            )}

        </td>

    )
)}


                                            
                                           


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                <input
                                                    type="text"
                                                    value={
                                                        linea.observaciones
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        actualizarLinea(
                                                            linea.linea_id,
                                                            'observaciones',
                                                            event.target.value
                                                        )
                                                    }
                                                    style={
                                                        estilos.input
                                                    }
                                                />

                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                <span
                                                    style={
                                                        estilos.estado
                                                    }
                                                >
                                                    Programado
                                                </span>

                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                <button
                                                    type="button"
                                                    style={
                                                        estilos.botonEliminar
                                                    }
                                                    onClick={() =>
                                                        eliminarLinea(
                                                            linea.linea_id
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

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
                    style={
                        estilos.botonCancelar
                    }
                >
                    Cancelar
                </button>


                <button
    type="button"
    style={{
        ...estilos.botonGuardar,
        opacity: guardando ? 0.6 : 1,
        cursor: guardando ? 'not-allowed' : 'pointer'
    }}
    onClick={guardarDespacho}
    disabled={guardando}
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
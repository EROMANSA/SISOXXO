import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    obtenerDespachoPorId,
    actualizarDespacho
} from '../../services/despachos.services';

import {
    listarTiendasOxxo,
    listarUnidadesMedida,
    listarTiposDespacho
} from '../../services/listas.services';


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
        padding: '7px 12px',
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


/*
==============================================================
CONVIERTE UNA FECHA / TIMESTAMP DEL BACKEND A YYYY-MM-DD
==============================================================
*/

const convertirFechaInput = (valor) => {

    if (!valor) {
        return '';
    }

    return String(valor).substring(0, 10);

};


const DespachoEditarPage = () => {

    const navigate = useNavigate();

    const { transacId } = useParams();


    const [despacho, setDespacho] =
        useState(null);

    const [tiendas, setTiendas] =
        useState([]);

    const [unidadesMedida, setUnidadesMedida] =
        useState([]);

    const [tiposDespacho, setTiposDespacho] =
        useState([]);

    const [destinoId, setDestinoId] =
        useState('');

    const [fechaProgramacion, setFechaProgramacion] =
        useState('');

    const [observaciones, setObservaciones] =
        useState('');

    const [fechaDespacho, setFechaDespacho] =
    useState('');

    const [fechaCancelacion, setFechaCancelacion] =
    useState('');    

    const [estadoDespacho, setEstadoDespacho] =
    useState('PRO');    

    const [lineas, setLineas] =
        useState([]);

    const [cargando, setCargando] =
    useState(true);

    const [guardando, setGuardando] =
    useState(false);

    const [error, setError] =
    useState('');
    

    /*
    ==========================================================
    CARGAR DESPACHO
    ==========================================================
    */

    useEffect(() => {

        const cargarDespacho = async () => {

            try {

                setCargando(true);
                setError('');

                const [
                    despachoResponse,
                    tiendasResponse,
                    unidadesResponse,
                    tiposDespachoResponse
                ] = await Promise.all([

                    obtenerDespachoPorId(
                        transacId
                    ),

                    listarTiendasOxxo(),

                    listarUnidadesMedida(),

                    listarTiposDespacho()

                ]);


                const data =
                    despachoResponse?.despacho;


                if (!data) {

                    throw new Error(
                        'No se recibió información del despacho.'
                    );

                }


                setDespacho(data);


                const cabecera =
                    data.cabecera || {};


                const detalles =
                    Array.isArray(data.detalles)
                        ? data.detalles
                        : [];


                setDestinoId(
                    cabecera.destino_id || ''
                );


                setFechaProgramacion(
                    convertirFechaInput(
                        cabecera.fecha_programacion
                    )
                );


                setObservaciones(
                    cabecera.observaciones || ''
                );

                setEstadoDespacho(
                    cabecera.estado_despacho || 'PRO'
                );

                setFechaDespacho(
    convertirFechaInput(
        cabecera.fecha_despacho
    )
);

setFechaCancelacion(
    convertirFechaInput(
        cabecera.fecha_cancelacion
    )
);


                setLineas(
                    detalles.map((detalle) => ({

                    linea_id:
    detalle.linea_id,

linea_ui_id:
    `DB_${detalle.linea_id}`,

producto_especie:
    detalle.producto_especie || '',

                        cantidad:
                            detalle.cantidad ?? '',

                        tipo_unid_med:
                            detalle.tipo_unid_med || '',

                        pesaje_en_kg:
                            detalle.pesaje_en_kg ?? '',    

                        terminal_origen:
                            detalle.terminal_origen || '',

                        temperatura_descarga:
                            detalle.temperatura_descarga || '',

                        fecha_beneficio_ini:
                            convertirFechaInput(
                                detalle.fecha_beneficio_ini
                            ),

                        fecha_beneficio_fin:
                            convertirFechaInput(
                                detalle.fecha_beneficio_fin
                            ),

                        nro_guia_nota_venta:
                            detalle.nro_guia_nota_venta || '',

                        registro_sanitario:
                            detalle.registro_sanitario || '',

                        fecha_registro_ini:
                            convertirFechaInput(
                                detalle.fecha_emis_registro
                            ),

                        fecha_registro_fin:
                            convertirFechaInput(
                                detalle.fecha_venci_registro
                            ),

                        procedencia:
                            detalle.procedencia || '',

                        tipo_despacho:
                            detalle.tipo_despacho || '',

                        fecha_cosecha:
                            convertirFechaInput(
                                detalle.fecha_cosecha
                            ),

                        fecha_ingreso:
                            convertirFechaInput(
                                detalle.fecha_ingreso
                            ),

                        codigo_nro_lote:
                            detalle.codigo_lote || '',

                        fecha_lote_venci:
                            convertirFechaInput(
                                detalle.fecha_vencimiento_lote
                            ),

                        observaciones:
                            detalle.observaciones || '',

                        estado_despacho:
                            detalle.estado_despacho || '',

                        estado_despacho_descripcion:
                            detalle.estado_despacho_descripcion ||
                            'Programado'

                    }))
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


                setUnidadesMedida(
                    Array.isArray(
                        unidadesResponse?.data
                    )
                        ? unidadesResponse.data
                        : []
                );


                setTiposDespacho(
                    Array.isArray(
                        tiposDespachoResponse?.data
                    )
                        ? tiposDespachoResponse.data
                        : []
                );


            } catch (err) {

                console.error(
                    'Error al cargar despacho:',
                    err
                );

                setError(
                    err?.response?.data?.mensaje ||
                    err.message ||
                    'No fue posible cargar el despacho.'
                );

            } finally {

                setCargando(false);

            }

        };


        cargarDespacho();

    }, [transacId]);


    /*
    ==========================================================
    INFORMACIÓN DEL DESPACHO
    ==========================================================
    */

    const cabecera =
        despacho?.cabecera || {};


    const tipoRubro =
        cabecera.tipo_rubro || '';


    const tipoRubroDescripcion =
        cabecera.tipo_rubro_descripcion ||
        tipoRubro ||
        '';


    const camposEspecificos =
        CAMPOS_RUBRO[
            String(tipoRubro)
        ] || [];


    /*
    ==========================================================
    ACTUALIZAR LÍNEA
    ==========================================================
    */

   const actualizarLinea = (
    lineaUiId,
    campo,
    valor
) => {

    if (estadoDespacho !== 'PRO') {
        return;
    }

    setLineas(
        lineas.map((linea) => {

            if (
                linea.linea_ui_id !== lineaUiId
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

const cambiarEstadoDespacho = (nuevoEstado) => {

    setEstadoDespacho(nuevoEstado);

    if (nuevoEstado === 'PRO') {

        setFechaDespacho('');
        setFechaCancelacion('');

        setLineas(
            lineas.map((linea) => ({
                ...linea,
                estado_despacho: 'PRO',
                estado_despacho_descripcion:
                    'Programado'
            }))
        );

        return;
    }

    if (nuevoEstado === 'DSP') {

        setFechaDespacho(
            fechaDespacho ||
            fechaProgramacion
        );

        setFechaCancelacion('');

        setLineas(
            lineas.map((linea) => ({
                ...linea,
                estado_despacho: 'ING',
                estado_despacho_descripcion:
                    'Ingresado'
            }))
        );

        return;
    }

    if (nuevoEstado === 'CAN') {

        setFechaCancelacion(
            fechaCancelacion ||
            fechaProgramacion
        );

        setFechaDespacho('');

        setLineas(
            lineas.map((linea) => ({
                ...linea,
                estado_despacho: 'CAN',
                estado_despacho_descripcion:
                    'Cancelado'
            }))
        );
    }
};




    /*
    ==========================================================
    AGREGAR LÍNEA
    ==========================================================
    */

    const agregarLinea = () => {

        if (estadoDespacho !== 'PRO') {
        return;
    }

    const nuevoLineaUiId =
        `NEW_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;


    setLineas([
        ...lineas,
        {
            linea_id: null,

            linea_ui_id:
                nuevoLineaUiId,

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

            estado_despacho_descripcion:
                'Programado'
        }
    ]);

};


    /*
    ==========================================================
    ELIMINAR LÍNEA
    ==========================================================
    */

 const eliminarLinea = (lineaUiId) => {

    if (estadoDespacho !== 'PRO') {
        return;
    }


    setLineas(
        lineas.filter(
            (linea) =>
                linea.linea_ui_id !== lineaUiId
        )
    );

};

const guardarCambios = async () => {

    try {

        setError('');

        // ====================================================
        // VALIDAR DESTINO
        // ====================================================

        if (
            !destinoId ||
            String(destinoId).trim() === ''
        ) {

            setError(
                'Debe seleccionar un destino OXXO.'
            );

            return;
        }


        // ====================================================
        // VALIDAR DETALLE
        // ====================================================

        if (
            !Array.isArray(lineas) ||
            lineas.length === 0
        ) {

            setError(
                'El despacho debe tener por lo menos una línea de detalle.'
            );

            return;
        }


        setGuardando(true);

        // ====================================================
// VALIDAR FECHAS SEGÚN ESTADO
// ====================================================

if (estadoDespacho === 'DSP') {

    if (!fechaDespacho) {

        setError(
            'Debe ingresar la Fecha de Despacho.'
        );

        return;
    }

    if (
        fechaProgramacion &&
        fechaDespacho < fechaProgramacion
    ) {

        setError(
            'La Fecha de Despacho no puede ser anterior a la Fecha de Programación.'
        );

        return;
    }
}

if (estadoDespacho === 'CAN') {

    if (!fechaCancelacion) {

        setError(
            'Debe ingresar la Fecha de Cancelación.'
        );

        return;
    }

    if (
        fechaProgramacion &&
        fechaCancelacion < fechaProgramacion
    ) {

        setError(
            'La Fecha de Cancelación no puede ser anterior a la Fecha de Programación.'
        );

        return;
    }
}







        // ====================================================
        // PREPARAR DETALLE
        // ====================================================

        const detalles = lineas.map(
            (linea) => ({

                linea_id:
                    linea.linea_id
                        ? Number(linea.linea_id)
                        : null,

                producto_especie:
                    linea.producto_especie,

                cantidad:
                    linea.cantidad,

                tipo_unid_med:
                    linea.tipo_unid_med,

                pesaje_en_kg:
                    linea.pesaje_en_kg,    

                terminal_origen:
                    linea.terminal_origen,

                temperatura_descarga:
                    linea.temperatura_descarga,

                fecha_beneficio_ini:
                    linea.fecha_beneficio_ini,

                fecha_beneficio_fin:
                    linea.fecha_beneficio_fin,

                nro_guia_nota_venta:
                    linea.nro_guia_nota_venta,

                registro_sanitario:
                    linea.registro_sanitario,

                fecha_registro_ini:
                    linea.fecha_registro_ini,

                fecha_registro_fin:
                    linea.fecha_registro_fin,

                procedencia:
                    linea.procedencia,

                tipo_despacho:
                    linea.tipo_despacho,

                fecha_cosecha:
                    linea.fecha_cosecha,

                fecha_ingreso:
                    linea.fecha_ingreso,

                codigo_nro_lote:
                    linea.codigo_nro_lote,

                fecha_lote_venci:
                    linea.fecha_lote_venci,

                observaciones:
                    linea.observaciones

            })
        );


        // ====================================================
        // DATOS A ACTUALIZAR
        // ====================================================

        const datos = {

    destinoId:
        String(destinoId).trim(),

    fechaProgramacion:
        fechaProgramacion || null,

    estadoDespacho:
        estadoDespacho,

    fechaDespacho:
        fechaDespacho || null,

    fechaCancelacion:
        fechaCancelacion || null,

    observaciones:
        observaciones
            ? String(observaciones).trim()
            : null,

    detalles

};


        // ====================================================
        // ACTUALIZAR
        // ====================================================

        await actualizarDespacho(
            transacId,
            datos
        );


        // ====================================================
        // REGRESAR AL DETALLE
        // ====================================================

        navigate(
            `/despachos/${transacId}/ver`
        );


    } catch (err) {

        console.error(
            'Error al actualizar despacho:',
            err
        );

        setError(
            err?.response?.data?.mensaje ||
            err?.response?.data?.error ||
            err.message ||
            'No fue posible actualizar el despacho.'
        );

    } finally {

        setGuardando(false);

    }

};




    if (cargando) {

        return (
            <div
                style={
                    estilos.pageContainer
                }
            >
                <div
                    style={
                        estilos.mensaje
                    }
                >
                    Cargando despacho...
                </div>
            </div>
        );

    }


    return (

        <div
            style={
                estilos.pageContainer
            }
        >

            <div style={estilos.titulo}>
                Editar Despacho
            </div>

            <div style={estilos.subtitulo}>
                Modificación de un despacho registrado
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
                                cabecera.proveedor_nombre ||
                                ''
                            }
                            readOnly
                            style={
                                estilos.inputReadonly
                            }
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
                            style={
                                estilos.inputReadonly
                            }
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

                    {estadoDespacho === 'DSP' && (
    <div style={estilos.campo}>

        <label style={estilos.etiqueta}>
            Fecha de Despacho
        </label>

        <input
    type="date"
    value={fechaDespacho}
    min={fechaProgramacion || undefined}
    onChange={(event) => {

        const nuevaFecha =
            event.target.value;

        setFechaDespacho(nuevaFecha);

        if (
            fechaProgramacion &&
            nuevaFecha &&
            nuevaFecha < fechaProgramacion
        ) {
            setError(
                'La Fecha de Despacho no puede ser anterior a la Fecha de Programación.'
            );
        } else {
            setError('');
        }

    }}
    style={estilos.input}
/>

    </div>
)}

{estadoDespacho === 'CAN' && (
    <div style={estilos.campo}>

        <label style={estilos.etiqueta}>
            Fecha de Cancelación
        </label>

        <input
    type="date"
    value={fechaCancelacion}
    min={fechaProgramacion || undefined}
    onChange={(event) => {

        const nuevaFecha =
            event.target.value;

        setFechaCancelacion(nuevaFecha);

        if (
            fechaProgramacion &&
            nuevaFecha &&
            nuevaFecha < fechaProgramacion
        ) {
            setError(
                'La Fecha de Cancelación no puede ser anterior a la Fecha de Programación.'
            );
        } else {
            setError('');
        }

    }}
    style={estilos.input}
/>

    </div>
)}            




                     <div style={estilos.campo}>

    <label style={estilos.etiqueta}>
        Estado Despacho
    </label>

    <select
        value={estadoDespacho}
        onChange={(event) =>
            cambiarEstadoDespacho(
                event.target.value
            )
        }
        style={estilos.input}
    >
        <option value="PRO">
            Programado
        </option>

        <option value="DSP">
            Despachado
        </option>

        <option value="CAN">
            Cancelado
        </option>
    </select>

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

                <div
                    style={
                        estilos.detalleHeader
                    }
                >

                    <div style={estilos.tituloSeccion}>
                        Detalle del Despacho
                    </div>

                    {estadoDespacho === 'PRO' && (
    <button
        type="button"
        style={estilos.botonAgregar}
        onClick={agregarLinea}
    >
        + Agregar línea
    </button>
)}

                </div>


                {lineas.length === 0 ? (

                    <div style={estilos.mensaje}>
                        No existen líneas registradas.
                    </div>

                ) : (

                    <div
                        style={
                            estilos.tablaContainer
                        }
                    >

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
                                                key={
                                                    campo.campo
                                                }
                                                style={
                                                    estilos.th
                                                }
                                            >
                                                {
                                                    campo.titulo
                                                }
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
                                                linea.linea_ui_id
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
                                                            linea.linea_ui_id,
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
                                                    value={
                                                        linea.cantidad
                                                    }
                                                    onChange={(event) =>
                                                        actualizarLinea(
                                                            linea.linea_ui_id,
                                                            'cantidad',
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

                                                <select
                                                    value={
                                                        linea.tipo_unid_med
                                                    }
                                                    onChange={(event) =>
                                                        actualizarLinea(
                                                            linea.linea_ui_id,
                                                            'tipo_unid_med',
                                                            event.target.value
                                                        )
                                                    }
                                                    style={
                                                        estilos.input
                                                    }
                                                >

                                                    <option value="">
                                                        Seleccionar
                                                    </option>

                                                    {unidadesMedida.map(
                                                        (unidad) => (

                                                            <option
                                                                key={
                                                                    unidad.codigo_valor ||
                                                                    unidad.codigo ||
                                                                    unidad.id
                                                                }
                                                                value={
                                                                    unidad.codigo_valor ||
                                                                    unidad.codigo ||
                                                                    unidad.id
                                                                }
                                                            >
                                                                {
                                                                    unidad.descripcion ||
                                                                    unidad.nombre ||
                                                                    unidad.valor ||
                                                                    unidad.codigo_valor
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </td>

                                            <td
    style={
        estilos.td
    }
>

    <input
        type="number"
        min="0"
        step="0.01"
        value={
            linea.pesaje_en_kg
        }
        onChange={(event) =>
            actualizarLinea(
                linea.linea_ui_id,
                'pesaje_en_kg',
                event.target.value
            )
        }
        style={
            estilos.input
        }
    />

</td>


                                            {camposEspecificos.map(
                                                (campo) => (

                                                    <td
                                                        key={
                                                            campo.campo
                                                        }
                                                        style={
                                                            estilos.td
                                                        }
                                                    >

                                                        {campo.campo ===
                                                            'tipo_despacho' ? (

                                                            <select
                                                                value={
                                                                    linea[
                                                                        campo.campo
                                                                    ] || ''
                                                                }
                                                                onChange={(event) =>
                                                                    actualizarLinea(
                                                                        linea.linea_ui_id,
                                                                        campo.campo,
                                                                        event.target.value
                                                                    )
                                                                }
                                                                style={
                                                                    estilos.input
                                                                }
                                                            >

                                                                <option value="">
                                                                    Seleccionar
                                                                </option>

                                                                {tiposDespacho.map(
                                                                    (tipo) => (

                                                                        <option
                                                                            key={
                                                                                tipo.codigo_valor ||
                                                                                tipo.codigo ||
                                                                                tipo.id
                                                                            }
                                                                            value={
                                                                                tipo.codigo_valor ||
                                                                                tipo.codigo ||
                                                                                tipo.id
                                                                            }
                                                                        >
                                                                            {
                                                                                tipo.descripcion ||
                                                                                tipo.nombre ||
                                                                                tipo.valor ||
                                                                                tipo.codigo_valor
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>

                                                        ) : (

                                                            <input
                                                                type={
                                                                    campo.tipo
                                                                }
                                                                value={
                                                                    linea[
                                                                        campo.campo
                                                                    ] || ''
                                                                }
                                                                onChange={(event) =>
                                                                    actualizarLinea(
                                                                        linea.linea_ui_id,
                                                                        campo.campo,
                                                                        event.target.value
                                                                    )
                                                                }
                                                                style={
                                                                    estilos.input
                                                                }
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
                                                    onChange={(event) =>
                                                        actualizarLinea(
                                                            linea.linea_ui_id,
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
                                                    {
                                                        linea.estado_despacho_descripcion ||
                                                        'Programado'
                                                    }
                                                </span>

                                            </td>


                                            <td
                                                style={
                                                    estilos.td
                                                }
                                            >

                                                {estadoDespacho === 'PRO' && (
    <button
        type="button"
        style={estilos.botonEliminar}
        onClick={() =>
            eliminarLinea(
                linea.linea_ui_id
            )
        }
    >
        Eliminar
    </button>
)}

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
    style={
        estilos.botonGuardar
    }
    onClick={guardarCambios}
    disabled={guardando}
>
    {guardando
        ? 'Guardando...'
        : 'Guardar Cambios'
    }
</button>

            </div>

        </div>

    );

};


export default DespachoEditarPage;
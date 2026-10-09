import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';

import * as XLSX from 'xlsx';

import {
    obtenerDespachoPorId
} from '../../services/despachos.services';

/*
==============================================================
ESTILOS
Se mantienen alineados con DespachoEditarPage.jsx
==============================================================
*/

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

    inputReadonly: {
        padding: '9px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#F8FAFC',
        color: '#475569',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '36px',
        display: 'flex',
        alignItems: 'center'
    },

    textareaReadonly: {
        width: '100%',
        minHeight: '90px',
        padding: '9px 12px',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#F8FAFC',
        color: '#475569',
        boxSizing: 'border-box',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word'
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

    botonExportar: {
    padding: '10px 18px',
    border: '1px solid #16A34A',
    borderRadius: '6px',
    backgroundColor: '#16A34A',
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
        verticalAlign: 'middle',
        fontSize: '12px',
        color: '#334155'
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
COLUMNAS DEL DETALLE SEGÚN TIPO DE RUBRO

Se conserva la estructura que ya utilizaba
DespachoVerPage.jsx.
==============================================================
*/

const columnasPorRubro = {

    '003': [
        {
            campo: 'transac_id',
            titulo: 'TRANSAC ID'
        },
        {
            campo: 'linea_id',
            titulo: 'LÍNEA'
        },
        {
            campo: 'fecha_despacho',
            titulo: 'FECHA DESPACHO'
        },
        {
            campo: 'producto_especie',
            titulo: 'PRODUCTO / ESPECIE'
        },
        {
            campo: 'cantidad',
            titulo: 'CANTIDAD'
        },
        {
            campo: 'unidad_medida_descripcion',
            titulo: 'UNIDAD MEDIDA'
        },

        {
            campo: 'pesaje_en_kg',
            titulo: 'PESAJE EN KG'
        },

        {
            campo: 'registro_sanitario',
            titulo: 'REGISTRO SANITARIO'
        },
        /*
        {
            campo: 'fecha_emis_registro',
            titulo: 'FECHA EMIS. REGISTRO'
        },
        {
            campo: 'fecha_venci_registro',
            titulo: 'FECHA VENC. REGISTRO'
        },
        */
        {
            campo: 'codigo_lote',
            titulo: 'CÓDIGO LOTE'
        },
        {
            campo: 'fecha_vencimiento_lote',
            titulo: 'FECHA VENC. LOTE'
        },
        {
            campo: 'observaciones',
            titulo: 'OBSERVACIONES'
        },
        {
            campo: 'estado_despacho_descripcion',
            titulo: 'ESTADO DESPACHO'
        }
    ],

    '001': [
        {
            campo: 'transac_id',
            titulo: 'TRANSAC ID'
        },
        {
            campo: 'linea_id',
            titulo: 'LÍNEA'
        },
        {
            campo: 'fecha_despacho',
            titulo: 'FECHA DESPACHO'
        },
        {
            campo: 'producto_especie',
            titulo: 'PRODUCTO / ESPECIE'
        },
        {
            campo: 'cantidad',
            titulo: 'CANTIDAD'
        },
        {
            campo: 'unidad_medida_descripcion',
            titulo: 'UNIDAD MEDIDA'
        },

        {
            campo: 'pesaje_en_kg',
            titulo: 'PESAJE EN KG'
        },

        {
            campo: 'fecha_beneficio_ini',
            titulo: 'FECHA BENEFICIO'
        },
        /*
        {
            campo: 'fecha_beneficio_fin',
            titulo: 'FECHA BENEFICIO FIN'
        },
        */
        {
            campo: 'nro_guia_nota_venta',
            titulo: 'NRO. GUÍA / NOTA VENTA'
        },
        {
            campo: 'codigo_lote',
            titulo: 'CÓDIGO LOTE'
        },
        {
            campo: 'fecha_vencimiento_lote',
            titulo: 'FECHA VENC. LOTE'
        },
        {
            campo: 'observaciones',
            titulo: 'OBSERVACIONES'
        },
        {
            campo: 'estado_despacho_descripcion',
            titulo: 'ESTADO DESPACHO'
        }
    ],

    '002': [
        {
            campo: 'transac_id',
            titulo: 'TRANSAC ID'
        },
        {
            campo: 'linea_id',
            titulo: 'LÍNEA'
        },
        {
            campo: 'fecha_despacho',
            titulo: 'FECHA DESPACHO'
        },
        {
            campo: 'producto_especie',
            titulo: 'PRODUCTO / ESPECIE'
        },
        {
            campo: 'cantidad',
            titulo: 'CANTIDAD'
        },
        {
            campo: 'unidad_medida_descripcion',
            titulo: 'UNIDAD MEDIDA'
        },

        {
            campo: 'pesaje_en_kg',
            titulo: 'PESAJE EN KG'
        },

        {
            campo: 'terminal_origen',
            titulo: 'TERMINAL ORIGEN'
        },
        {
            campo: 'temperatura_descarga',
            titulo: 'TEMPERATURA DESCARGA'
        },
        {
            campo: 'codigo_lote',
            titulo: 'CÓDIGO LOTE'
        },
        {
            campo: 'fecha_vencimiento_lote',
            titulo: 'FECHA VENC. LOTE'
        },
        {
            campo: 'observaciones',
            titulo: 'OBSERVACIONES'
        },
        {
            campo: 'estado_despacho_descripcion',
            titulo: 'ESTADO DESPACHO'
        }
    ],

    '004': [
        {
            campo: 'transac_id',
            titulo: 'TRANSAC ID'
        },
        {
            campo: 'linea_id',
            titulo: 'LÍNEA'
        },
        {
            campo: 'fecha_despacho',
            titulo: 'FECHA DESPACHO'
        },
        {
            campo: 'producto_especie',
            titulo: 'PRODUCTO / ESPECIE'
        },
        {
            campo: 'cantidad',
            titulo: 'CANTIDAD'
        },
        {
            campo: 'unidad_medida_descripcion',
            titulo: 'UNIDAD MEDIDA'
        },

        {
            campo: 'pesaje_en_kg',
            titulo: 'PESAJE EN KG'
        },
        
        {
            campo: 'procedencia',
            titulo: 'PROCEDENCIA'
        },
        {
            campo: 'tipo_despacho_descripcion',
            titulo: 'TIPO DESPACHO'
        },
        {
            campo: 'fecha_cosecha',
            titulo: 'FECHA COSECHA'
        },
        {
            campo: 'fecha_ingreso',
            titulo: 'FECHA INGRESO'
        },
        {
            campo: 'observaciones',
            titulo: 'OBSERVACIONES'
        },
        {
            campo: 'estado_despacho_descripcion',
            titulo: 'ESTADO DESPACHO'
        }
    ]

};


/*
==============================================================
FORMATEAR FECHA
==============================================================
*/

const formatearFecha = (valor) => {

    if (!valor) {
        return '-';
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
        return valor;
    }

    return fecha.toLocaleDateString('es-PE');

};





/*
==============================================================
COMPONENTE
==============================================================
*/



    const DespachoVerPage = () => {

    const navigate = useNavigate();

    const { transacId } = useParams();


    const [cabecera, setCabecera] = useState(null);

    const [detalles, setDetalles] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState('');

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


                const response =
                    await obtenerDespachoPorId(transacId);


                if (
                    !response?.ok ||
                    !response?.despacho
                ) {

                    throw new Error(
                        response?.mensaje ||
                        'No fue posible obtener el despacho.'
                    );

                }


                setCabecera(
                    response.despacho.cabecera
                );

                setDetalles(
                    response.despacho.detalles || []
                );


            } catch (error) {

                console.error(
                    'Error al cargar despacho:',
                    error
                );


                setError(
                    error?.response?.data?.mensaje ||
                    error?.message ||
                    'No fue posible cargar el despacho.'
                );


            } finally {

                setCargando(false);

            }

        };


        if (transacId) {

            cargarDespacho();

        }

    }, [transacId]);


    /*
    ==========================================================
    ESTADO: CARGANDO
    ==========================================================
    */

    if (cargando) {

        return (

            <div style={estilos.pageContainer}>

                <h1 style={estilos.titulo}>
                    Ver Despacho
                </h1>

                <div style={estilos.subtitulo}>
                    Consulta de un despacho registrado
                </div>

                <div style={estilos.seccion}>

                    <div style={estilos.mensaje}>
                        Cargando información del despacho...
                    </div>

                </div>

            </div>

        );

    }


    /*
    ==========================================================
    ESTADO: ERROR
    ==========================================================
    */

    if (error) {

        return (

            <div style={estilos.pageContainer}>

                <h1 style={estilos.titulo}>
                    Ver Despacho
                </h1>

                <div style={estilos.subtitulo}>
                    Consulta de un despacho registrado
                </div>

                <div style={estilos.error}>
                    {error}
                </div>

            </div>

        );

    }


    /*
    ==========================================================
    SIN INFORMACIÓN
    ==========================================================
    */

    if (!cabecera) {

        return (

            <div style={estilos.pageContainer}>

                <h1 style={estilos.titulo}>
                    Ver Despacho
                </h1>

                <div style={estilos.subtitulo}>
                    Consulta de un despacho registrado
                </div>

                <div style={estilos.seccion}>

                    <div style={estilos.mensaje}>
                        No se encontró información del despacho.
                    </div>

                </div>

            </div>

        );

    }


    /*
    ==========================================================
    DETERMINAR ESTADO
    ==========================================================
    */

    const estadoDespacho =
        cabecera.estado_despacho || 'PRO';


    const estadoDescripcion =
        cabecera.estado_despacho_descripcion ||
        estadoDespacho;


    /*
    ==========================================================
    COLUMNAS DEL RUBRO
    ==========================================================
    */

    const columnas =
        columnasPorRubro[cabecera.tipo_rubro] || [];

/*
==============================================================
EXPORTAR DESPACHO A EXCEL
==============================================================
*/

const handleExportarExcel = () => {

    if (!cabecera) {
        return;
    }


    /*
    ==========================================================
    HOJA 1: CABECERA
    ==========================================================
    */

    const datosCabecera = [

        {
            'N.º Transacción':
                cabecera.transac_id || '',

            'Proveedor':
                cabecera.proveedor_nombre || '',

            'Tipo Rubro':
                cabecera.tipo_rubro_descripcion ||
                cabecera.tipo_rubro ||
                '',

            'Destino Tienda':
                cabecera.destino_descripcion ||
                cabecera.destino_id ||
                '',

            'Tipo Transacción':
                cabecera.tipo_transaccion_descripcion ||
                cabecera.tipo_transaccion ||
                '',

            'Fecha Programación':
                formatearFecha(
                    cabecera.fecha_programacion
                ),

            'Estado Despacho':
                cabecera.estado_despacho_descripcion ||
                cabecera.estado_despacho ||
                '',

            'Fecha Despacho':
                cabecera.fecha_despacho
                    ? formatearFecha(
                        cabecera.fecha_despacho
                    )
                    : '',

            'Fecha Cancelación':
                cabecera.fecha_cancelacion
                    ? formatearFecha(
                        cabecera.fecha_cancelacion
                    )
                    : '',

            'Observaciones':
                cabecera.observaciones || ''
        }

    ];


    /*
    ==========================================================
    HOJA 2: DETALLE
    ==========================================================
    */

    const datosDetalle = detalles.map(
        (detalle) => {

            const fila = {};

            columnas.forEach(
                (columna) => {

                    const valor =
                        detalle[
                            columna.campo
                        ];


                    const esFecha =
                        columna.campo
                            .toLowerCase()
                            .includes('fecha_');


                    const esEstado =
                        columna.campo ===
                        'estado_despacho_descripcion';


                    fila[columna.titulo] =
                        esEstado
                            ? (
                                valor ||
                                detalle.estado_despacho ||
                                ''
                            )
                            : esFecha
                                ? (
                                    valor
                                        ? formatearFecha(valor)
                                        : ''
                                )
                                : (
                                    valor ?? ''
                                );

                }
            );


            return fila;

        }
    );


    /*
    ==========================================================
    CREAR LIBRO
    ==========================================================
    */

    const workbook =
        XLSX.utils.book_new();


    /*
    ==========================================================
    HOJA CABECERA
    ==========================================================
    */

    const worksheetCabecera =
        XLSX.utils.json_to_sheet(
            datosCabecera
        );


    XLSX.utils.book_append_sheet(
        workbook,
        worksheetCabecera,
        'Cabecera'
    );


    /*
    ==========================================================
    HOJA DETALLE
    ==========================================================
    */

    const worksheetDetalle =
        XLSX.utils.json_to_sheet(
            datosDetalle
        );


    XLSX.utils.book_append_sheet(
        workbook,
        worksheetDetalle,
        'Detalle'
    );


    /*
    ==========================================================
    NOMBRE DEL ARCHIVO
    ==========================================================
    */

    const nombreArchivo =
        `Despacho_${cabecera.transac_id || 'Sin_ID'}.xlsx`;


    /*
    ==========================================================
    DESCARGAR
    ==========================================================
    */

    XLSX.writeFile(
        workbook,
        nombreArchivo
    );

};        


    /*
    ==========================================================
    RENDER
    ==========================================================
    */

    return (

        <div style={estilos.pageContainer}>

            {/* ==================================================
                TÍTULO
            ================================================== */}

            <h1 style={estilos.titulo}>
                Ver Despacho
            </h1>

            <div style={estilos.subtitulo}>
                Consulta de un despacho registrado
            </div>


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

                        <div style={estilos.inputReadonly}>
                            {cabecera.proveedor_nombre || '-'}
                        </div>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Tipo Rubro
                        </label>

                        <div style={estilos.inputReadonly}>
                            {
                                cabecera.tipo_rubro_descripcion ||
                                cabecera.tipo_rubro ||
                                '-'
                            }
                        </div>

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
                            N.º Transacción
                        </label>

                        <div style={estilos.inputReadonly}>
                            {cabecera.transac_id || '-'}
                        </div>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Destino Tienda
                        </label>

                        <div style={estilos.inputReadonly}>
                            {
                                cabecera.destino_descripcion ||
                                cabecera.destino_id ||
                                '-'
                            }
                        </div>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Tipo Transacción
                        </label>

                        <div style={estilos.inputReadonly}>
                            {
                                cabecera.tipo_transaccion_descripcion ||
                                cabecera.tipo_transaccion ||
                                '-'
                            }
                        </div>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Fecha Programación
                        </label>

                        <div style={estilos.inputReadonly}>
                            {
                                formatearFecha(
                                    cabecera.fecha_programacion
                                )
                            }
                        </div>

                    </div>


                    <div style={estilos.campo}>

                        <label style={estilos.etiqueta}>
                            Estado Despacho
                        </label>

                        <div>

                            <span style={estilos.estado}>
                                {estadoDescripcion}
                            </span>

                        </div>

                    </div>


                    {/* ==================================================
                        FECHA DESPACHO
                        Solo se muestra cuando el estado es DSP
                    ================================================== */}

                    {estadoDespacho === 'DSP' && (

                        <div style={estilos.campo}>

                            <label style={estilos.etiqueta}>
                                Fecha Despacho
                            </label>

                            <div style={estilos.inputReadonly}>
                                {
                                    formatearFecha(
                                        cabecera.fecha_despacho
                                    )
                                }
                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        FECHA CANCELACIÓN
                        Solo se muestra cuando el estado es CAN
                    ================================================== */}

                    {estadoDespacho === 'CAN' && (

                        <div style={estilos.campo}>

                            <label style={estilos.etiqueta}>
                                Fecha Cancelación
                            </label>

                            <div style={estilos.inputReadonly}>
                                {
                                    formatearFecha(
                                        cabecera.fecha_cancelacion
                                    )
                                }
                            </div>

                        </div>

                    )}

                </div>


                {/* ==================================================
                    OBSERVACIONES
                ================================================== */}

                <div
                    style={{
                        ...estilos.campo,
                        marginTop: '16px'
                    }}
                >

                    <label style={estilos.etiqueta}>
                        Observaciones
                    </label>

                    <div style={estilos.textareaReadonly}>
                        {cabecera.observaciones || '-'}
                    </div>

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

                </div>


                {detalles.length === 0 ? (

                    <div style={estilos.mensaje}>
                        No existen registros de detalle
                        para este despacho.
                    </div>

                ) : (

                    <div style={estilos.tablaContainer}>

                        <table style={estilos.tabla}>

                            <thead>

                                <tr>

                                    {columnas.map(
                                        (columna) => (

                                            <th
                                                key={columna.campo}
                                                style={estilos.th}
                                            >
                                                {columna.titulo}
                                            </th>

                                        )
                                    )}

                                </tr>

                            </thead>


                            <tbody>

                                {detalles.map(
                                    (detalle, index) => (

                                        <tr
                                            key={
                                                detalle.linea_id ||
                                                index
                                            }
                                        >

                                            {columnas.map(
                                                (columna) => {

                                                    const valor =
                                                        detalle[
                                                            columna.campo
                                                        ];


                                                    const esFecha =
                                                        columna.campo
                                                            .toLowerCase()
                                                            .includes(
                                                                'fecha_'
                                                            );


                                                    const esEstado =
                                                        columna.campo ===
                                                        'estado_despacho_descripcion';


                                                    return (

                                                        <td
                                                            key={
                                                                columna.campo
                                                            }
                                                            style={
                                                                estilos.td
                                                            }
                                                        >

                                                            {esEstado ? (

                                                                <span
                                                                    style={
                                                                        estilos.estado
                                                                    }
                                                                >
                                                                    {
                                                                        valor ||
                                                                        detalle.estado_despacho ||
                                                                        '-'
                                                                    }
                                                                </span>

                                                            ) : esFecha ? (

                                                                formatearFecha(
                                                                    valor
                                                                )

                                                            ) : (

                                                                valor ??
                                                                '-'

                                                            )}

                                                        </td>

                                                    );

                                                }
                                            )}

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
        onClick={handleExportarExcel}
        style={estilos.botonExportar}
    >
        Exportar Excel
    </button>


    <button
        type="button"
        onClick={() =>
            navigate('/despachos')
        }
        style={estilos.botonCancelar}
    >
        Cerrar
    </button>

</div>


        </div>

    );

};


export default DespachoVerPage;
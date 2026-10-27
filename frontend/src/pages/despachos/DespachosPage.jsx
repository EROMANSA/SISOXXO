/*HOLA*/
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import {
    listarDespachos,
    obtenerDespachoPorId
} from '../../services/despachos.services';

const estilos = {
    pageContainer: {
        padding: '20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh'
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
        marginBottom: '18px'
    },

    panelBusqueda: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '14px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '14px'
    },

    bloqueBusqueda: {
        flex: 1
    },

    bloqueAcciones: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px'
    },

    etiqueta: {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '6px'
    },

    filaBusqueda: {
        display: 'flex',
        gap: '8px'
    },

    select: {
        padding: '9px 10px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        minWidth: '150px',
        fontSize: '13px'
    },

    input: {
        flex: 1,
        padding: '9px 12px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        fontSize: '13px'
    },

    botonNuevo: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },

    botonExcel: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#16A34A',
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },

    tablaContainer: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        overflowX: 'auto'
    },

    tabla: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '12px'
    },

    th: {
        padding: '10px 8px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        color: '#334155',
        fontWeight: '700',
        textAlign: 'left',
        whiteSpace: 'nowrap'
    },

    td: {
        padding: '10px 8px',
        borderBottom: '1px solid #E2E8F0',
        color: '#334155',
        whiteSpace: 'nowrap'
    },

    mensaje: {
        padding: '28px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '14px'
    },

    error: {
        padding: '20px',
        textAlign: 'center',
        color: '#DC2626',
        fontSize: '14px'
    }
};



const obtenerValor = (registro, campos) => {
    for (const campo of campos) {
        if (
            registro?.[campo] !== undefined &&
            registro?.[campo] !== null
        ) {
            return registro[campo];
        }
    }

    return '-';
};

const formatearFecha = (fecha) => {
    if (!fecha) {
        return '-';
    }

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
        return fecha;
    }

    return fechaObj.toLocaleDateString('es-PE');
};

const DespachosPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const filtroDashboard = location.state?.filtroDashboard || '';
    const estadoDespachoDashboard = location.state?.estadoDespacho || '';
    const tiendaIdDashboard = location.state?.tiendaId || '';
    const tipoRubroDashboard = location.state?.tipoRubro || '';
    const proveedorIdDashboard = location.state?.proveedorId || '';

    const usuarioGuardado = localStorage.getItem('usuario');

    let usuario = null;

    try {
        usuario = usuarioGuardado
            ? JSON.parse(usuarioGuardado)
            : null;
    } catch {
        usuario = null;
    }

    const rol = usuario?.rol_codigo || '';

    const esConsultor = rol === 'CONSULTOR';

    const mostrarColumnaProveedor =
        rol === 'CONSULTOR' || rol === 'ADMIN';

    const [despachos, setDespachos] = useState([]);
    const [idsFiltradosDashboard, setIdsFiltradosDashboard] = useState(null);
    const [cargandoFiltroDashboard, setCargandoFiltroDashboard] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [campoBusqueda, setCampoBusqueda] = useState('TODOS');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    useEffect(() => {
        cargarDespachos();
    }, []);

    const fechaActualLima = () => {
        // Devuelve YYYY-MM-DD según la zona horaria de Lima, sin depender
        // de la zona horaria configurada en el equipo del usuario.
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());
    };

    const obtenerFechaISO = (fecha) => {
        if (!fecha) return '';

        // Para valores ISO de fecha/hora, conservar la fecha calendario
        // entregada por la API; los valores de fecha simple no se convierten.
        const texto = String(fecha);
        const coincidencia = texto.match(/^\d{4}-\d{2}-\d{2}/);
        if (coincidencia) return coincidencia[0];

        const fechaObj = new Date(fecha);
        if (Number.isNaN(fechaObj.getTime())) return '';

        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(fechaObj);
    };

    const cargarDespachos = async () => {
        try {
            setCargando(true);
            setCargandoFiltroDashboard(false);
            setError('');

            const data = await listarDespachos();
            const lista = Array.isArray(data)
                ? data
                : Array.isArray(data?.despachos)
                    ? data.despachos
                    : [];

            // Aplicar primero la tienda elegida en el Dashboard para evitar
            // consultar detalles de despachos de otras tiendas.
            const listaTienda = rol === 'PROVEEDOR' && tiendaIdDashboard
                ? lista.filter((despacho) =>
                    String(despacho.destino_id ?? '').trim() === String(tiendaIdDashboard).trim()
                )
                : lista;

            const requiereDetalleConsultor =
                rol === 'CONSULTOR' &&
                Boolean(filtroDashboard);

            const requiereDetalleProveedor =
                rol === 'PROVEEDOR' &&
                ['LOTE_FALTANTE', 'TEMPERATURA_PENDIENTE'].includes(filtroDashboard);

            if (requiereDetalleConsultor || requiereDetalleProveedor) {
                setCargandoFiltroDashboard(true);

                // El listado no incluye de forma garantizada el rubro ni los detalles.
                // Para CONSULTOR se revisa la cabecera/detalle de los despachos
                // de la tienda asignada, aplicando también rubro y proveedor elegidos.
                const listaParaRevisar = rol === 'CONSULTOR'
                    ? listaTienda.filter((despacho) =>
                        !tiendaIdDashboard ||
                        String(despacho.destino_id ?? '').trim() === String(tiendaIdDashboard).trim()
                    )
                    : listaTienda;

                const coincidencias = await Promise.all(
                    listaParaRevisar.map(async (despacho) => {
                        try {
                            const respuesta = await obtenerDespachoPorId(despacho.transac_id);
                            const registro = respuesta?.despacho || respuesta;
                            const cabecera = registro?.cabecera;
                            const detalles = Array.isArray(registro?.detalles)
                                ? registro.detalles
                                : [];

                            if (!cabecera) return null;

                            if (
                                rol === 'CONSULTOR' &&
                                proveedorIdDashboard &&
                                String(cabecera.proveedor_id ?? despacho.proveedor_id ?? '').trim() !== String(proveedorIdDashboard).trim()
                            ) {
                                return null;
                            }

                            const rubro = String(cabecera.tipo_rubro ?? '').trim();
                            if (rol === 'CONSULTOR' && tipoRubroDashboard && rubro !== String(tipoRubroDashboard).trim()) {
                                return null;
                            }

                            const estado = String(cabecera.estado_despacho ?? despacho.estado_despacho ?? '').trim();

                            if (filtroDashboard === 'ENTREGAS_REGISTRADAS') {
                                return estado !== 'CAN' &&
                                    (!estadoDespachoDashboard || estado === estadoDespachoDashboard)
                                    ? despacho.transac_id
                                    : null;
                            }

                            if (filtroDashboard === 'ALERTAS_PENDIENTES') {
                                return estado === 'PRO' &&
                                    obtenerFechaISO(despacho.fecha_programacion) !== '' &&
                                    obtenerFechaISO(despacho.fecha_programacion) < fechaActualLima()
                                    ? despacho.transac_id
                                    : null;
                            }

                            if (['LOTE_FALTANTE', 'TEMPERATURA_PENDIENTE'].includes(filtroDashboard)) {
                                if (estado !== 'DSP') return null;

                                const detallesConFaltantes = detalles.some((detalle) => {
                                    if (filtroDashboard === 'LOTE_FALTANTE') {
                                        const codigoLote = detalle.codigo_lote ?? detalle.codigo_nro_lote;
                                        const fechaLote = detalle.fecha_vencimiento_lote ?? detalle.fecha_lote_venci;
                                        return (
                                            codigoLote == null ||
                                            String(codigoLote).trim() === '' ||
                                            fechaLote == null ||
                                            String(fechaLote).trim() === ''
                                        );
                                    }

                                    const terminalOrigen = detalle.terminal_origen;
                                    const temperatura = detalle.temperatura_descarga;
                                    return (
                                        terminalOrigen == null ||
                                        String(terminalOrigen).trim() === '' ||
                                        temperatura == null ||
                                        String(temperatura).trim() === ''
                                    );
                                });

                                const rubroValido = filtroDashboard === 'LOTE_FALTANTE'
                                    ? ['001', '003', '004'].includes(rubro)
                                    : rubro === '002';

                                return rubroValido && detallesConFaltantes
                                    ? despacho.transac_id
                                    : null;
                            }

                            return null;
                        } catch (err) {
                            console.error(
                                `No se pudo revisar el detalle del despacho ${despacho.transac_id}:`,
                                err
                            );
                            return null;
                        }
                    })
                );

                setIdsFiltradosDashboard(
                    new Set(coincidencias.filter((id) => id !== null && id !== undefined).map(String))
                );
            } else {
                setIdsFiltradosDashboard(null);
            }

            setDespachos(lista);
        } catch (err) {
            console.error('Error al cargar despachos:', err);
            setError('No fue posible cargar los despachos.');
        } finally {
            setCargando(false);
            setCargandoFiltroDashboard(false);
        }
    };

    const despachosFiltrados = useMemo(() => {
        let resultado = despachos;

        // Conservar la tienda seleccionada/asignada al navegar desde el Dashboard.
        if ((rol === 'PROVEEDOR' || rol === 'CONSULTOR') && tiendaIdDashboard) {
            resultado = resultado.filter((despacho) =>
                String(despacho.destino_id ?? '').trim() === String(tiendaIdDashboard).trim()
            );
        }

        if (rol === 'CONSULTOR' && filtroDashboard && idsFiltradosDashboard instanceof Set) {
            resultado = resultado.filter((despacho) =>
                idsFiltradosDashboard.has(String(despacho.transac_id))
            );
        }

        if (rol === 'PROVEEDOR' && filtroDashboard) {
            if (filtroDashboard === 'ENTREGAS_REGISTRADAS') {
                resultado = resultado.filter((despacho) => {
                    const estado = String(despacho.estado_despacho ?? '').trim();
                    const coincideEstado = estado !== 'CAN';
                    const coincideFiltroEstado = !estadoDespachoDashboard ||
                        estado === estadoDespachoDashboard;
                    return coincideEstado && coincideFiltroEstado;
                });
            } else if (filtroDashboard === 'ALERTAS_PENDIENTES') {
                const hoyLima = fechaActualLima();
                resultado = resultado.filter((despacho) =>
                    despacho.estado_despacho === 'PRO' &&
                    obtenerFechaISO(despacho.fecha_programacion) !== '' &&
                    obtenerFechaISO(despacho.fecha_programacion) < hoyLima
                );
            } else if (
                ['LOTE_FALTANTE', 'TEMPERATURA_PENDIENTE'].includes(filtroDashboard) &&
                idsFiltradosDashboard instanceof Set
            ) {
                resultado = resultado.filter((despacho) =>
                    idsFiltradosDashboard.has(String(despacho.transac_id))
                );
            }
        }

        const criterio = criterioBusqueda.trim().toLowerCase();
        if (!criterio) return resultado;

        return resultado.filter((despacho) => {
            if (campoBusqueda === 'TRANSAC_ID') {
                return String(obtenerValor(despacho, ['transac_id']))
                    .toLowerCase()
                    .includes(criterio);
            }

            if (campoBusqueda === 'TIPO_TRANSACCION') {
                return String(obtenerValor(despacho, [
                    'tipo_transaccion_descripcion',
                    'tipo_transaccion'
                ])).toLowerCase().includes(criterio);
            }

            if (campoBusqueda === 'PROVEEDOR') {
                return String(obtenerValor(despacho, [
                    'proveedor_nombre',
                    'proveedor'
                ])).toLowerCase().includes(criterio);
            }

            if (campoBusqueda === 'DESTINO') {
                return String(obtenerValor(despacho, [
                    'destino_descripcion',
                    'destino_id',
                    'destino'
                ])).toLowerCase().includes(criterio);
            }

            if (campoBusqueda === 'ESTADO_DESPACHO') {
                const estadoCodigo = String(despacho.estado_despacho ?? '');
                const estadoDescripcion = String(
                    despacho.estado_despacho_descripcion ?? ''
                );

                return `${estadoCodigo} ${estadoDescripcion}`
                    .toLowerCase()
                    .includes(criterio);
            }

            return Object.values(despacho).join(' ').toLowerCase().includes(criterio);
        });
    }, [
        despachos,
        campoBusqueda,
        criterioBusqueda,
        rol,
        filtroDashboard,
        estadoDespachoDashboard,
        tiendaIdDashboard,
        tipoRubroDashboard,
        proveedorIdDashboard,
        idsFiltradosDashboard
    ]);


const exportarExcel = async () => {
    try {
        if (despachosFiltrados.length === 0) {
            alert('No existen despachos para exportar.');
            return;
        }

        const cabeceras = [];
        const detalles = [];

        for (const despacho of despachosFiltrados) {
            const respuesta = await obtenerDespachoPorId(
                despacho.transac_id
            );

            const registro = respuesta?.despacho;

            if (!registro?.cabecera) {
                throw new Error(
                    `No se pudo obtener el despacho ${despacho.transac_id}.`
                );
            }

            cabeceras.push(registro.cabecera);

            for (const detalle of registro.detalles || []) {
                detalles.push(detalle);
            }
        }

        const libro = XLSX.utils.book_new();

        const hojaCabecera = XLSX.utils.json_to_sheet(cabeceras);
        const hojaDetalle = XLSX.utils.json_to_sheet(detalles);

        XLSX.utils.book_append_sheet(
            libro,
            hojaCabecera,
            'Cabecera'
        );

        XLSX.utils.book_append_sheet(
            libro,
            hojaDetalle,
            'Detalle'
        );

        const fecha = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            libro,
            `Despachos_${fecha}.xlsx`
        );
    } catch (error) {
        console.error('Error al exportar despachos:', error);

        alert(
            'No fue posible exportar los despachos. ' +
            'Verifique los datos y vuelva a intentarlo.'
        );
    }
};


    return (
        <div style={estilos.pageContainer}>

            {/* TÍTULO */}
            <div style={estilos.titulo}>
                Despachos
            </div>

            <div style={estilos.subtitulo}>
                Registro y consulta de despachos
            </div>

            {/* BÚSQUEDA + ACCIONES */}
            <div style={estilos.panelBusqueda}>

                <div style={estilos.bloqueBusqueda}>

                    <label style={estilos.etiqueta}>
                        Búsqueda
                    </label>

                    <div style={estilos.filaBusqueda}>

                        <select
                            value={campoBusqueda}
                            onChange={(e) =>
                                setCampoBusqueda(e.target.value)
                            }
                            style={estilos.select}
                        >
                            <option value="TODOS">
                                Todos los campos
                            </option>

                            <option value="TRANSAC_ID">
                                Transac ID
                            </option>

                            <option value="TIPO_TRANSACCION">
                                Tipo Transacción
                            </option>

                           {mostrarColumnaProveedor && (
                                <option value="PROVEEDOR">
                                    Proveedor
                                </option>
                            )}

                            <option value="DESTINO">
                                Destino Tienda
                            </option>

                            <option value="ESTADO_DESPACHO">
                                Estado de Despacho
                            </option>
                        </select>

                        <input
                            type="text"
                            value={criterioBusqueda}
                            onChange={(e) =>
                                setCriterioBusqueda(e.target.value)
                            }
                            placeholder="Ingrese el criterio de búsqueda..."
                            style={estilos.input}
                        />

                    </div>

                </div>

                <div>

                    <label style={estilos.etiqueta}>
                        Acciones de Registro
                    </label>

                    <div style={estilos.bloqueAcciones}>

                        {!esConsultor && (
    <button
        type="button"
        style={estilos.botonNuevo}
        onClick={() => navigate('/despachos/nuevo')}
    >
        + Nuevo Despacho
    </button>
)}

                        <button
                            type="button"
                            style={estilos.botonExcel}
                            onClick={exportarExcel}
                        >
                            Exportar Excel
                        </button>

                    </div>

                </div>

            </div>

            {(rol === 'PROVEEDOR' || rol === 'CONSULTOR') && filtroDashboard && (
                <div style={{ ...estilos.subtitulo, marginBottom: '10px' }}>
                    {cargandoFiltroDashboard
                        ? 'Aplicando filtros del Dashboard...'
                        : filtroDashboard === 'ENTREGAS_REGISTRADAS'
                        ? 'Se muestran despachos no cancelados.'
                        : filtroDashboard === 'ALERTAS_PENDIENTES'
                            ? 'Se muestran despachos PRO con fecha de programación anterior al día actual de Lima.'
                            : filtroDashboard === 'LOTE_FALTANTE'
                                ? 'Se muestran despachos DSP de rubros 001, 003 o 004 con número de lote o fecha de vencimiento faltante.'
                                : filtroDashboard === 'TEMPERATURA_PENDIENTE'
                                    ? 'Se muestran despachos DSP del rubro 002 con procedencia (terminal de origen) o temperatura de descarga faltante.'
                                    : ''}
                </div>
            )}

            {/* LISTA DE DESPACHOS */}
            <div style={estilos.tablaContainer}>

                {cargando ? (

                    <div style={estilos.mensaje}>
                        Cargando despachos...
                    </div>

                ) : error ? (

                    <div style={estilos.error}>
                        {error}
                    </div>

                ) : despachosFiltrados.length === 0 ? (

                    <div style={estilos.mensaje}>
                        No existen registros de despachos.
                    </div>

                ) : (

                    <table style={estilos.tabla}>

                        <thead>

                            <tr>

                                <th style={estilos.th}>
                                    TRANSAC ID
                                </th>

                                <th style={estilos.th}>
                                    TIPO TRANSACCIÓN
                                </th>

                               {mostrarColumnaProveedor && (
                                    <th style={estilos.th}>
                                        PROVEEDOR
                                    </th>
                                )}

                                <th style={estilos.th}>
                                    DESTINO TIENDA
                                </th>

                                <th style={estilos.th}>
                                    FECHA PROGRAMADA
                                </th>

                                <th style={estilos.th}>
                                    FECHA DESPACHO
                                </th>

                                <th style={estilos.th}>
                                    FECHA CANCELACIÓN
                                </th>

                                <th style={estilos.th}>
                                    ESTADO
                                </th>

                                <th style={estilos.th}>
                                    ACCIONES
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {despachosFiltrados.map((despacho, index) => (

                                <tr
                                    key={
                                        despacho.transac_id ??
                                        index
                                    }
                                >

                                    <td style={estilos.td}>
                                        {obtenerValor(
                                            despacho,
                                            ['transac_id']
                                        )}
                                    </td>

                                    <td style={estilos.td}>
                                        {obtenerValor(
                                            despacho,
                                            [
                                                'tipo_transaccion_descripcion',
                                                'tipo_transaccion'
                                            ]
                                        )}
                                    </td>

                                    {mostrarColumnaProveedor && (
                                        <td style={estilos.td}>
                                            {obtenerValor(
                                                despacho,
                                                ['proveedor_nombre', 'proveedor']
                                            )}
                                        </td>
                                    )}

                                    <td style={estilos.td}>
    {obtenerValor(
        despacho,
        [
            'destino_descripcion',
            'destino_id',
            'destino'
        ]
    )}
</td>

                                    <td style={estilos.td}>
                                        {formatearFecha(
                                            obtenerValor(
                                                despacho,
                                                ['fecha_programacion']
                                            )
                                        )}
                                    </td>

                                    <td style={estilos.td}>
                                        {formatearFecha(
                                            obtenerValor(
                                                despacho,
                                                ['fecha_despacho']
                                            )
                                        )}
                                    </td>

                                    <td style={estilos.td}>
                                        {formatearFecha(
                                            obtenerValor(
                                                despacho,
                                                ['fecha_cancelacion']
                                            )
                                        )}
                                    </td>

                                    <td style={estilos.td}>
    {obtenerValor(
        despacho,
        [
            'estado_despacho_descripcion',
            'estado_despacho'
        ]
    )}
</td>

<td style={estilos.td}>
    <div
        style={{
            display: 'flex',
            gap: '6px'
        }}
    >

        <button
    type="button"
    style={{
        padding: '5px 10px',
        border: '1px solid #2563EB',
        borderRadius: '4px',
        backgroundColor: '#FFFFFF',
        color: '#2563EB',
        fontSize: '12px',
        cursor: 'pointer'
    }}
    onClick={() => {
        navigate(`/despachos/${despacho.transac_id}/ver`);
    }}
>
    Ver
</button>

       {!esConsultor && despacho.estado_despacho === 'PRO' && (
    <button
        type="button"
        style={{
            padding: '5px 10px',
            border: '1px solid #7C3AED',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: '#7C3AED',
            fontSize: '12px',
            cursor: 'pointer'
        }}
        onClick={() => {
            navigate(`/despachos/${despacho.transac_id}/editar`);
        }}
    >
        Editar
    </button>
)}

    </div>
</td>


                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
};

export default DespachosPage;
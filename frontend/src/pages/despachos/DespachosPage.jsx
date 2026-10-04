/*HOLA*/
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarDespachos } from '../../services/despachos.services';

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

    const [despachos, setDespachos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [campoBusqueda, setCampoBusqueda] = useState('TODOS');
    const [criterioBusqueda, setCriterioBusqueda] = useState('');

    useEffect(() => {
        cargarDespachos();
    }, []);

    const cargarDespachos = async () => {

        try {

            setCargando(true);
            setError('');

            const data = await listarDespachos();

            setDespachos(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.despachos)
                        ? data.despachos
                        : []
            );

        } catch (err) {

            console.error('Error al cargar despachos:', err);

            setError('No fue posible cargar los despachos.');

        } finally {

            setCargando(false);

        }
    };

    const despachosFiltrados = useMemo(() => {

        const criterio = criterioBusqueda
            .trim()
            .toLowerCase();

        if (!criterio) {
            return despachos;
        }

        return despachos.filter((despacho) => {

            if (campoBusqueda === 'TRANSAC_ID') {
                return String(
                    obtenerValor(despacho, ['transac_id'])
                )
                    .toLowerCase()
                    .includes(criterio);
            }

            if (campoBusqueda === 'TIPO_TRANSACCION') {
    return String(
        obtenerValor(despacho, [
            'tipo_transaccion_descripcion',
            'tipo_transaccion'
        ])
    )
        .toLowerCase()
        .includes(criterio);
}

            if (campoBusqueda === 'PROVEEDOR') {
                return String(
                    obtenerValor(despacho, [
                        'proveedor_nombre',
                        'proveedor'
                    ])
                )
                    .toLowerCase()
                    .includes(criterio);
            }

           if (campoBusqueda === 'DESTINO') {
    return String(
        obtenerValor(despacho, [
            'destino_descripcion',
            'destino_id',
            'destino'
        ])
    )
        .toLowerCase()
        .includes(criterio);
}

            return Object.values(despacho)
                .join(' ')
                .toLowerCase()
                .includes(criterio);

        });

    }, [despachos, campoBusqueda, criterioBusqueda]);

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

                            <option value="PROVEEDOR">
                                Proveedor
                            </option>

                            <option value="DESTINO">
                                Destino Tienda
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

                        <button
    type="button"
    style={estilos.botonNuevo}
    onClick={() => {
        navigate('/despachos/nuevo');
    }}
>
    + Nuevo Despacho
</button>

                        <button
                            type="button"
                            style={estilos.botonExcel}
                            onClick={() => {
                                // Se implementará posteriormente
                                // la exportación Excel.
                            }}
                        >
                            Exportar Excel
                        </button>

                    </div>

                </div>

            </div>

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

                                <th style={estilos.th}>
                                    PROVEEDOR
                                </th>

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

                                    <td style={estilos.td}>
                                        {obtenerValor(
                                            despacho,
                                            [
                                                'proveedor_nombre',
                                                'proveedor'
                                            ]
                                        )}
                                    </td>

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
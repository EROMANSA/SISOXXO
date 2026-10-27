
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    obtenerTiendaConsultor,
    listarRubrosConsultor,
    listarProveedoresConsultor,
    listarEstadosConsultor,
    obtenerIndicadoresConsultor
} from '../../services/dashboardConsultor.services';

const estilos = {
    page: {
        padding: '20px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh'
    },
    titulo: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: '4px'
    },
    subtitulo: {
        fontSize: '13px',
        color: '#64748B',
        marginBottom: '20px'
    },
    filtros: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
    },
    bloque: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '200px',
        flex: 1
    },
    etiqueta: {
        fontSize: '12px',
        fontWeight: 600,
        color: '#334155'
    },
    select: {
        padding: '10px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        fontSize: '13px',
        color: '#334155',
        width: '100%'
    },
    tienda: {
        padding: '10px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#F1F5F9',
        fontSize: '13px',
        color: '#475569',
        width: '100%',
        boxSizing: 'border-box'
    },
    boton: {
        padding: '10px 16px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        color: '#334155',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    filaTarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px',
        marginBottom: '20px'
    },
    tarjeta: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '22px',
        minWidth: 0
    },
    tituloTarjeta: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#64748B',
        marginBottom: '14px'
    },
    valor: {
        fontSize: '32px',
        fontWeight: 700,
        color: '#0F172A',
        lineHeight: 1.2,
        overflowWrap: 'anywhere'
    },
    unidad: {
        fontSize: '13px',
        color: '#64748B',
        marginTop: '8px'
    },
    tarjetaAlerta: {
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '8px',
        padding: '22px',
        minWidth: 0
    },
    tituloAlerta: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#B91C1C',
        marginBottom: '14px'
    },
    valorAlerta: {
        fontSize: '32px',
        fontWeight: 700,
        color: '#DC2626',
        lineHeight: 1.2
    },
    filaInferior: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '16px',
        alignItems: 'stretch'
    },
    tarjetaVacia: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        minHeight: '220px'
    },
    panelAlertas: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '20px',
        minWidth: 0
    },
    tituloAlertas: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: '18px'
    },
    filaAlerta: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '18px 22px',
        borderRadius: '8px',
        marginBottom: '12px'
    },
    alertaDocumento: {
        backgroundColor: '#FCE7E7',
        color: '#B91C1C'
    },
    alertaLote: {
        backgroundColor: '#FEF3C7',
        color: '#B45309'
    },
    alertaTemperatura: {
        backgroundColor: '#DBEAFE',
        color: '#1D4ED8'
    },
    textoAlerta: {
        fontSize: '14px',
        fontWeight: 600
    },
    numeroAlerta: {
        fontSize: '22px',
        fontWeight: 700,
        minWidth: '32px',
        textAlign: 'right'
    },
    mensaje: {
        padding: '18px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        color: '#64748B',
        fontSize: '13px',
        marginBottom: '16px'
    },
    error: {
        padding: '14px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '8px',
        color: '#B91C1C',
        fontSize: '13px',
        marginBottom: '16px'
    },
    media: `
        @media (max-width: 1050px) {
            .consultor-tarjetas {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
        }
        @media (max-width: 650px) {
            .consultor-tarjetas,
            .consultor-inferior {
                grid-template-columns: minmax(0, 1fr) !important;
            }
        }
    `
};

const indicadoresIniciales = {
    volumen_registrado: 0,
    entregas_registradas: 0,
    trazabilidad_completa: 0,
    alertas_pendientes: 0,
    documentos_vencidos: 0,
    entregas_lote_faltante: 0,
    entregas_temperatura_pendiente: 0
};

const DashboardConsultorPage = () => {
    const navigate = useNavigate();

    const irAListaDespachos = (filtro) => {
        navigate('/despachos', {
            state: {
                filtroDashboard: filtro,
                tiendaId: tienda?.tienda_id ?? '',
                tipoRubro,
                proveedorId,
                estadoDespacho
            }
        });
    };
    const [tienda, setTienda] = useState(null);
    const [rubros, setRubros] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [estados, setEstados] = useState([]);

    const [tipoRubro, setTipoRubro] = useState('');
    const [proveedorId, setProveedorId] = useState('');
    const [estadoDespacho, setEstadoDespacho] = useState('');

    const [indicadores, setIndicadores] = useState(indicadoresIniciales);
    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [cargandoIndicadores, setCargandoIndicadores] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelado = false;

        const cargarFiltros = async () => {
            try {
                setError('');

                const [
                    respuestaTienda,
                    respuestaRubros,
                    respuestaProveedores,
                    respuestaEstados
                ] = await Promise.all([
                    obtenerTiendaConsultor(),
                    listarRubrosConsultor(),
                    listarProveedoresConsultor(),
                    listarEstadosConsultor()
                ]);

                if (cancelado) return;

                setTienda(respuestaTienda?.tienda ?? null);
                setRubros(
                    Array.isArray(respuestaRubros?.rubros)
                        ? respuestaRubros.rubros
                        : []
                );
                setProveedores(
                    Array.isArray(respuestaProveedores?.proveedores)
                        ? respuestaProveedores.proveedores
                        : []
                );
                setEstados(
                    Array.isArray(respuestaEstados?.estados)
                        ? respuestaEstados.estados
                        : []
                );
            } catch (err) {
                console.error('Error al cargar filtros del consultor:', err);
                if (!cancelado) {
                    setError(
                        'No fue posible cargar la tienda y las opciones de los filtros.'
                    );
                }
            } finally {
                if (!cancelado) setCargandoInicial(false);
            }
        };

        cargarFiltros();

        return () => {
            cancelado = true;
        };
    }, []);

    // Actualiza proveedores al cambiar de rubro.
    useEffect(() => {
        let cancelado = false;

        const cargarProveedores = async () => {
            try {
                const respuesta = await listarProveedoresConsultor(tipoRubro);

                if (cancelado) return;

                setProveedores(
                    Array.isArray(respuesta?.proveedores)
                        ? respuesta.proveedores
                        : []
                );

                setProveedorId('');
            } catch (err) {
                console.error('Error al filtrar proveedores:', err);

                if (!cancelado) {
                    setProveedores([]);
                    setProveedorId('');
                    setError('No fue posible filtrar los proveedores.');
                }
            }
        };

        cargarProveedores();

        return () => {
            cancelado = true;
        };
    }, [tipoRubro]);

    // Consulta los indicadores cuando cambian los filtros.
    useEffect(() => {
        let cancelado = false;

        const cargarIndicadores = async () => {
            try {
                setCargandoIndicadores(true);
                setError('');

                const respuesta = await obtenerIndicadoresConsultor({
                    tipoRubro,
                    proveedorId,
                    estadoDespacho
                });

                if (cancelado) return;

                const datos = respuesta?.indicadores ?? {};

                setIndicadores({
                    volumen_registrado: Number(datos.volumen_registrado ?? 0),
                    entregas_registradas: Number(datos.entregas_registradas ?? 0),
                    trazabilidad_completa: Number(datos.trazabilidad_completa ?? 0),
                    alertas_pendientes: Number(datos.alertas_pendientes ?? 0),
                    documentos_vencidos: Number(datos.documentos_vencidos ?? 0),
                    entregas_lote_faltante: Number(datos.entregas_lote_faltante ?? 0),
                    entregas_temperatura_pendiente: Number(
                        datos.entregas_temperatura_pendiente ?? 0
                    )
                });
            } catch (err) {
                console.error('Error al cargar indicadores del consultor:', err);

                if (!cancelado) {
                    setError('No fue posible obtener los indicadores del dashboard.');
                }
            } finally {
                if (!cancelado) setCargandoIndicadores(false);
            }
        };

        cargarIndicadores();

        return () => {
            cancelado = true;
        };
    }, [tipoRubro, proveedorId, estadoDespacho]);

    const limpiarFiltros = () => {
        setTipoRubro('');
        setProveedorId('');
        setEstadoDespacho('');
    };

    const formatearNumero = (valor) =>
        new Intl.NumberFormat('es-PE', {
            maximumFractionDigits: 2
        }).format(valor);

 
const tarjetaIndicador = (
    titulo,
    valor,
    unidad,
    sufijo = '',
    filtro = ''
) => {
    const habilitada = Boolean(
        filtro && !cargandoIndicadores && Number(valor) > 0
    );

    return (
        <div
            onClick={() => {
                if (habilitada) irAListaDespachos(filtro);
            }}
            role={habilitada ? 'button' : undefined}
            tabIndex={habilitada ? 0 : undefined}
            onKeyDown={(e) => {
                if (habilitada && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    irAListaDespachos(filtro);
                }
            }}
            style={{
                ...estilos.tarjeta,
                cursor: habilitada ? 'pointer' : 'default'
            }}
        >
            <div style={estilos.tituloTarjeta}>{titulo}</div>
            <div style={estilos.valor}>
                {cargandoIndicadores
                    ? '...'
                    : `${formatearNumero(valor)}${sufijo}`}
            </div>
            <div style={estilos.unidad}>{unidad}</div>
        </div>
    );
};


    return (
        <div style={estilos.page}>
            <style>{estilos.media}</style>

            <div style={estilos.titulo}>Dashboard del Consultor</div>
            <div style={estilos.subtitulo}>
                Resumen de volumen, entregas y alertas de la tienda asignada
            </div>

            <div style={estilos.filtros}>
                <div style={estilos.bloque}>
                    <label style={estilos.etiqueta}>Tienda asignada</label>
                    <input
                        style={estilos.tienda}
                        value={
                            tienda
                                ? `${tienda.tienda_id} - ${tienda.tienda_descripcion}`
                                : 'Cargando tienda...'
                        }
                        readOnly
                        disabled
                    />
                </div>

                <div style={estilos.bloque}>
                    <label style={estilos.etiqueta}>Rubro</label>
                    <select
                        style={estilos.select}
                        value={tipoRubro}
                        onChange={(e) => setTipoRubro(e.target.value)}
                        disabled={cargandoInicial}
                    >
                        <option value="">Todos los rubros</option>
                        {rubros.map((rubro) => (
                            <option
                                key={rubro.codigo_valor}
                                value={rubro.codigo_valor}
                            >
                                {rubro.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={estilos.bloque}>
                    <label style={estilos.etiqueta}>Proveedor</label>
                    <select
                        style={estilos.select}
                        value={proveedorId}
                        onChange={(e) => setProveedorId(e.target.value)}
                        disabled={cargandoInicial}
                    >
                        <option value="">Todos los proveedores</option>
                        {proveedores.map((proveedor) => (
                            <option
                                key={proveedor.proveedor_id}
                                value={proveedor.proveedor_id}
                            >
                                {proveedor.razon_social}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={estilos.bloque}>
                    <label style={estilos.etiqueta}>Estado de despacho</label>
                    <select
                        style={estilos.select}
                        value={estadoDespacho}
                        onChange={(e) => setEstadoDespacho(e.target.value)}
                        disabled={cargandoInicial}
                    >
                        <option value="">Todos los estados</option>
                        {estados.map((estado) => (
                            <option
                                key={estado.codigo_valor}
                                value={estado.codigo_valor}
                            >
                                {estado.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    style={estilos.boton}
                    onClick={limpiarFiltros}
                    disabled={cargandoInicial}
                >
                    Limpiar filtros
                </button>
            </div>

            {error && <div style={estilos.error}>{error}</div>}

            {cargandoInicial ? (
                <div style={estilos.mensaje}>
                    Cargando opciones de los filtros...
                </div>
            ) : (
                <>
                    <div
                        className="consultor-tarjetas"
                        style={estilos.filaTarjetas}
                    >
                        {tarjetaIndicador(
                            'Volumen Registrado',
                            indicadores.volumen_registrado,
                            'Kilogramos (kg)'
                        )}

                        {tarjetaIndicador(
                            'Entregas Registradas',
                            indicadores.entregas_registradas,
                            'Cantidad de despachos',
                            '',
                            'ENTREGAS_REGISTRADAS'
                        )}

                        {tarjetaIndicador(
    'Trazabilidad Completa',
    indicadores.trazabilidad_completa,
    'Entregados respecto a Programados',
    ' %'
)}

                        <div
                            onClick={() => {
                                if (!cargandoIndicadores && indicadores.alertas_pendientes > 0) {
                                    irAListaDespachos('ALERTAS_PENDIENTES');
                                }
                            }}
                            role={!cargandoIndicadores && indicadores.alertas_pendientes > 0 ? 'button' : undefined}
                            tabIndex={!cargandoIndicadores && indicadores.alertas_pendientes > 0 ? 0 : undefined}
                            onKeyDown={(e) => {
                                if (!cargandoIndicadores && indicadores.alertas_pendientes > 0 &&
                                    (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    irAListaDespachos('ALERTAS_PENDIENTES');
                                }
                            }}
                            style={{
                                ...estilos.tarjetaAlerta,
                                cursor: !cargandoIndicadores && indicadores.alertas_pendientes > 0
                                    ? 'pointer'
                                    : 'default'
                            }}
                        >
                            <div style={estilos.tituloAlerta}>
                                Alertas Pendientes
                            </div>
                            <div style={estilos.valorAlerta}>
                                {cargandoIndicadores
                                    ? '...'
                                    : formatearNumero(indicadores.alertas_pendientes)}
                            </div>
                            <div style={estilos.unidad}>
                                Despachos programados atrasados
                            </div>
                        </div>
                    </div>

                    <div
                        className="consultor-inferior"
                        style={estilos.filaInferior}
                    >
                        {/* Tarjeta reservada para una definición futura */}
                        <div
                            style={estilos.tarjetaVacia}
                            aria-label="Tarjeta reservada"
                        />

                        <div style={estilos.panelAlertas}>
                            <div style={estilos.tituloAlertas}>
                                ALERTAS PARA REVISIÓN
                            </div>

                            <div
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaDocumento
                                }}
                            >
                                <div style={estilos.textoAlerta}>
                                    Perfil proveedor: documento vencido
                                </div>
                                <div style={estilos.numeroAlerta}>
                                    {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.documentos_vencidos
                                        )}
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    if (!cargandoIndicadores && indicadores.entregas_lote_faltante > 0) {
                                        irAListaDespachos('LOTE_FALTANTE');
                                    }
                                }}
                                role={!cargandoIndicadores && indicadores.entregas_lote_faltante > 0 ? 'button' : undefined}
                                tabIndex={!cargandoIndicadores && indicadores.entregas_lote_faltante > 0 ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (!cargandoIndicadores && indicadores.entregas_lote_faltante > 0 &&
                                        (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        irAListaDespachos('LOTE_FALTANTE');
                                    }
                                }}
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaLote,
                                    cursor: !cargandoIndicadores && indicadores.entregas_lote_faltante > 0
                                        ? 'pointer'
                                        : 'default'
                                }}
                            >
                                <div style={estilos.textoAlerta}>
                                    Entrega: procedencia/lote faltante
                                </div>
                                <div style={estilos.numeroAlerta}>
                                    {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.entregas_lote_faltante
                                        )}
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    if (!cargandoIndicadores && indicadores.entregas_temperatura_pendiente > 0) {
                                        irAListaDespachos('TEMPERATURA_PENDIENTE');
                                    }
                                }}
                                role={!cargandoIndicadores && indicadores.entregas_temperatura_pendiente > 0 ? 'button' : undefined}
                                tabIndex={!cargandoIndicadores && indicadores.entregas_temperatura_pendiente > 0 ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (!cargandoIndicadores && indicadores.entregas_temperatura_pendiente > 0 &&
                                        (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        irAListaDespachos('TEMPERATURA_PENDIENTE');
                                    }
                                }}
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaTemperatura,
                                    marginBottom: 0,
                                    cursor: !cargandoIndicadores && indicadores.entregas_temperatura_pendiente > 0
                                        ? 'pointer'
                                        : 'default'
                                }}
                            >
                                <div style={estilos.textoAlerta}>
                                    Entrega: temperatura por revisar
                                </div>
                                <div style={estilos.numeroAlerta}>
                                    {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.entregas_temperatura_pendiente
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardConsultorPage;

/*AJUSTES EROMAN*/
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    listarTiendasDashboard,
    listarEstadosDashboard,
    obtenerIndicadoresDashboard
} from '../../services/dashboardProveedor.services';

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
        marginBottom: '20px'
    },
    panelFiltros: {
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
    bloqueFiltro: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '220px',
        flex: 1
    },
    etiqueta: {
        fontSize: '12px',
        fontWeight: '600',
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
    botonLimpiar: {
        padding: '10px 16px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    filaTarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
    },
    tarjeta: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '22px'
    },
    tarjetaTitulo: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748B',
        marginBottom: '14px'
    },
    tarjetaValor: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#0F172A',
        lineHeight: '1.2'
    },
    tarjetaUnidad: {
        fontSize: '13px',
        color: '#64748B',
        marginTop: '8px'
    },

    
tarjetaAlerta: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '22px'
},
tarjetaAlertaTitulo: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#B91C1C',
    marginBottom: '14px'
},
tarjetaAlertaValor: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#DC2626',
    lineHeight: '1.2'
},
tarjetaAlertaUnidad: {
    fontSize: '13px',
    color: '#B91C1C',
    marginTop: '8px'
},

panelAlertas: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px'
},
tituloAlertas: {
    fontSize: '18px',
    fontWeight: '700',
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
    fontWeight: '600'
},
valorAlerta: {
    fontSize: '22px',
    fontWeight: '700',
    minWidth: '32px',
    textAlign: 'right'
},


    filaInferior: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '16px',
        alignItems: 'stretch'
    },
    panelRubros: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '20px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    tituloRubros: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: '26px'
    },
    filaRubro: {
        display: 'grid',
        gridTemplateColumns: 'minmax(150px, 1.45fr) minmax(48px, 0.45fr) minmax(90px, 1fr) minmax(48px, 0.45fr)',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px'
    },
    nombreRubro: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#334155'
    },
    volumenRubro: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'right',
        whiteSpace: 'nowrap'
    },
    barraRubro: {
        width: '100%',
        height: '12px',
        backgroundColor: '#E2E8F0',
        borderRadius: '999px',
        overflow: 'hidden'
    },
    porcentajeRubro: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'right',
        whiteSpace: 'nowrap'
    },
    leyendaRubro: {
        fontSize: '11px',
        color: '#64748B',
        textAlign: 'right',
        marginTop: '-20px'
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
    }
};

const DashboardProveedorPage = () => {

    const navigate = useNavigate();

    const irAListaDespachos = (filtro) => {
    navigate('/despachos', {
        state: {
            filtroDashboard: filtro,
            estadoDespacho
        }
    });
};

    const [tiendas, setTiendas] = useState([]);
    const [estados, setEstados] = useState([]);

    const [tiendaId, setTiendaId] = useState('');
    const [estadoDespacho, setEstadoDespacho] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    

const [indicadores, setIndicadores] = useState({
    volumen_registrado: 0,
    entregas_registradas: 0,
    trazabilidad_completa: 0,
    alertas_pendientes: 0,
    documentos_vencidos: 0,
    entregas_lote_faltante: 0,
    entregas_fecha_vencimiento_lote: 0,
    entregas_registro_sanitario: 0,
    entregas_temperatura_pendiente: 0,
    entregas_procedencia: 0
});
const [volumenTrazabilidadRubro, setVolumenTrazabilidadRubro] = useState(null);



    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [cargandoIndicadores, setCargandoIndicadores] = useState(false);
    const [error, setError] = useState('');

    // Cargar las opciones de los filtros
    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                setError('');

                const [respuestaTiendas, respuestaEstados] =
                    await Promise.all([
                        listarTiendasDashboard(),
                        listarEstadosDashboard()
                    ]);

                setTiendas(
                    Array.isArray(respuestaTiendas?.tiendas)
                        ? respuestaTiendas.tiendas
                        : []
                );

                setEstados(
                    Array.isArray(respuestaEstados?.estados)
                        ? respuestaEstados.estados
                        : []
                );
            } catch (err) {
                console.error(
                    'Error al cargar filtros del dashboard:',
                    err
                );

                setError(
                    'No fue posible cargar las tiendas y los estados de despacho.'
                );
            } finally {
                setCargandoInicial(false);
            }
        };

        cargarFiltros();
    }, []);

    // Actualizar los indicadores cuando cambie cualquier filtro
    useEffect(() => {
        let cancelado = false;

        const cargarIndicadores = async () => {
            try {
                setCargandoIndicadores(true);
                setError('');

                const respuesta = await obtenerIndicadoresDashboard({
                    tiendaId,
                    estadoDespacho,
                    fechaInicio,
                    fechaFin
                });

                if (!cancelado) {
                   

setIndicadores({
    volumen_registrado: Number(
        respuesta?.indicadores?.volumen_registrado ?? 0
    ),
    entregas_registradas: Number(
        respuesta?.indicadores?.entregas_registradas ?? 0
    ),
    trazabilidad_completa: Number(
        respuesta?.indicadores?.trazabilidad_completa ?? 0
    ),
    alertas_pendientes: Number(
        respuesta?.indicadores?.alertas_pendientes ?? 0
    ),
    documentos_vencidos: Number(
        respuesta?.indicadores?.documentos_vencidos ?? 0
    ),
    entregas_lote_faltante: Number(
        respuesta?.indicadores?.entregas_lote_faltante ?? 0
    ),
    entregas_fecha_vencimiento_lote: Number(
        respuesta?.indicadores?.entregas_fecha_vencimiento_lote ?? 0
    ),
    entregas_registro_sanitario: Number(
        respuesta?.indicadores?.entregas_registro_sanitario ?? 0
    ),
    entregas_temperatura_pendiente: Number(
        respuesta?.indicadores?.entregas_temperatura_pendiente ?? 0
    ),
    entregas_procedencia: Number(
        respuesta?.indicadores?.entregas_procedencia ?? 0
    )
});

const rubrosRespuesta =
    respuesta?.indicadores?.volumen_trazabilidad_por_rubro;
setVolumenTrazabilidadRubro(
    Array.isArray(rubrosRespuesta) && rubrosRespuesta.length > 0
        ? rubrosRespuesta[0]
        : null
);


                }
            } catch (err) {
                console.error(
                    'Error al cargar indicadores del dashboard:',
                    err
                );

                if (!cancelado) {
                    setVolumenTrazabilidadRubro(null);
                    setError(
                        'No fue posible obtener los indicadores del dashboard.'
                    );
                }
            } finally {
                if (!cancelado) {
                    setCargandoIndicadores(false);
                }
            }
        };

        cargarIndicadores();

        return () => {
            cancelado = true;
        };
    }, [tiendaId, estadoDespacho, fechaInicio, fechaFin]);

    const limpiarFiltros = () => {
        setTiendaId('');
        setEstadoDespacho('');
        setFechaInicio('');
        setFechaFin('');
    };

    const formatearNumero = (valor, decimales = 2) =>
        new Intl.NumberFormat('es-PE', {
            maximumFractionDigits: decimales
        }).format(valor);

    const filaAlertaRevision = (
        texto,
        valor,
        filtro,
        estilo,
        ultimo = false
    ) => (
        <div
            onClick={() => {
                if (!cargandoIndicadores && valor > 0) {
                    irAListaDespachos(filtro);
                }
            }}
            role={!cargandoIndicadores && valor > 0 ? 'button' : undefined}
            tabIndex={!cargandoIndicadores && valor > 0 ? 0 : undefined}
            onKeyDown={(e) => {
                if (
                    !cargandoIndicadores &&
                    valor > 0 &&
                    (e.key === 'Enter' || e.key === ' ')
                ) {
                    e.preventDefault();
                    irAListaDespachos(filtro);
                }
            }}
            style={{
                ...estilos.filaAlerta,
                ...estilo,
                marginBottom: ultimo ? 0 : '12px',
                cursor: !cargandoIndicadores && valor > 0
                    ? 'pointer'
                    : 'default'
            }}
        >
            <div style={estilos.textoAlerta}>{texto}</div>
            <div style={estilos.valorAlerta}>
                {cargandoIndicadores ? '...' : formatearNumero(valor, 0)}
            </div>
        </div>
    );

    return (
        <div style={estilos.pageContainer}>
            <div style={estilos.titulo}>
                Dashboard del Proveedor
            </div>

            <div style={estilos.subtitulo}>
                Resumen de volumen y entregas registradas
            </div>

            {/* FILTROS */}
            <div style={estilos.panelFiltros}>
                <div style={estilos.bloqueFiltro}>
                    <label style={estilos.etiqueta}>
                        Tienda
                    </label>

                    <select
                        value={tiendaId}
                        onChange={(e) => setTiendaId(e.target.value)}
                        style={estilos.select}
                        disabled={cargandoInicial}
                    >
                        <option value="">
                            Todas las tiendas
                        </option>

                        {tiendas.map((tienda) => (
                            <option
                                key={tienda.tienda_id}
                                value={tienda.tienda_id}
                            >
                                {tienda.tienda_id} - {tienda.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={estilos.bloqueFiltro}>
                    <label style={estilos.etiqueta}>
                        Estado de Despacho
                    </label>

                    <select
                        value={estadoDespacho}
                        onChange={(e) =>
                            setEstadoDespacho(e.target.value)
                        }
                        style={estilos.select}
                        disabled={cargandoInicial}
                    >
                        <option value="">
                            Todos los estados
                        </option>

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

                <div style={estilos.bloqueFiltro}>
                    <label style={estilos.etiqueta}>Fecha Inicio</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        style={estilos.select}
                        disabled={cargandoInicial}
                        max={fechaFin || undefined}
                    />
                </div>

                <div style={estilos.bloqueFiltro}>
                    <label style={estilos.etiqueta}>Fecha Fin</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        style={estilos.select}
                        disabled={cargandoInicial}
                        min={fechaInicio || undefined}
                    />
                </div>

                <button
                    type="button"
                    style={estilos.botonLimpiar}
                    onClick={limpiarFiltros}
                    disabled={cargandoInicial}
                >
                    Limpiar filtros
                </button>
            </div>

            {error && (
                <div style={estilos.error}>
                    {error}
                </div>
            )}

            {cargandoInicial ? (
                <div style={estilos.mensaje}>
                    Cargando opciones de los filtros...
                </div>
            ) : (
                <>
                    <div
                        className="proveedor-fila-tarjetas"
                        style={estilos.filaTarjetas}
                    >

                        {/* TARJETA: VOLUMEN */}
                        <div style={estilos.tarjeta}>

                            <div style={estilos.tarjetaTitulo}>
                                Volumen Registrado
                            </div>
                            <div style={estilos.tarjetaValor}>
                                {cargandoIndicadores
                                ? '...'
                                : formatearNumero(
                                    indicadores.volumen_registrado / 1000
                                )}
                            </div>

                            <div style={estilos.tarjetaUnidad}>
                                Toneladas (Tn)
                            </div>

                        </div>

                        {/* TARJETA: ENTREGAS */}
                        <div onClick={() => {
    if (
        !cargandoIndicadores &&
        indicadores.entregas_registradas > 0
    ) {
        irAListaDespachos('ENTREGAS_REGISTRADAS');
    }
}}
style={{
    ...estilos.tarjeta,
    cursor:
        !cargandoIndicadores &&
        indicadores.entregas_registradas > 0
            ? 'pointer'
            : 'default'
}}>
                            <div style={estilos.tarjetaTitulo}>
                                Entregas Registradas
                            </div>
                            <div style={estilos.tarjetaValor}>
                                {cargandoIndicadores
                                    ? '...'
                                    : formatearNumero(
                                        indicadores.entregas_registradas
                                    )}
                            </div>

                            <div style={estilos.tarjetaUnidad}>
                                Cantidad de despachos
                            </div>
                        </div>

                    
                        {/* TARJETA: TRAZABILIDAD COMPLETA */}
                        <div style={estilos.tarjeta}>

                            <div style={estilos.tarjetaTitulo}>
                                Trazabilidad Completa
                            </div>
                            <div style={estilos.tarjetaValor}>
                                {cargandoIndicadores
                                    ? '...'
                                    : `${formatearNumero(
                                        indicadores.trazabilidad_completa
                                    )} %`}
                            </div>

                            <div style={estilos.tarjetaUnidad}>
                                Líneas incompletas respecto al total de líneas
                            </div>
                        </div>

                        {/* TARJETA: ALERTAS PENDIENTES */}
                        <div onClick={() => {
    if (
        !cargandoIndicadores &&
        indicadores.alertas_pendientes > 0
    ) {
        irAListaDespachos('ALERTAS_PENDIENTES');
    }
}}
style={{
    ...estilos.tarjetaAlerta,
    cursor:
        !cargandoIndicadores &&
        indicadores.alertas_pendientes > 0
            ? 'pointer'
            : 'default'
}}>

                            <div style={estilos.tarjetaAlertaTitulo}>
                                Alertas Pendientes
                            </div>
                            <div style={estilos.tarjetaAlertaValor}>
                                {cargandoIndicadores
                                    ? '...'
                                    : formatearNumero(
                                        indicadores.alertas_pendientes
                                    )}
                            </div>

                            <div style={estilos.tarjetaAlertaUnidad}>
                                Despachos programados atrasados
                            </div>
                        </div>
                    </div> 

                        {/* SECCIÓN INFERIOR: VOLUMEN POR RUBRO Y ALERTAS */}
                        <div
                            className="proveedor-fila-inferior"
                            style={estilos.filaInferior}
                        >
                            <div style={estilos.panelRubros}>
                                <div style={estilos.tituloRubros}>
                                    VOLUMEN Y TRAZABILIDAD POR RUBRO
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(150px, 1.45fr) minmax(48px, 0.45fr) minmax(90px, 1fr) minmax(48px, 0.45fr)',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginTop: '-18px',
                                    marginBottom: '18px'
                                }}>
                                    <div />
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#64748B',
                                        textAlign: 'right',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        Volumen en toneladas
                                    </div>
                                    <div />
                                    <div />
                                </div>

                                {(() => {
                                    const rubro = volumenTrazabilidadRubro || {};
                                    const volumenToneladas =
                                        Number(rubro.volumen_kg ?? 0) / 1000;
                                    const porcentaje = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            Number(rubro.trazabilidad_completa ?? 0)
                                        )
                                    );

                                    return (
                                        <div style={estilos.filaRubro}>
                                            <div style={estilos.nombreRubro}>
                                                {rubro.descripcion || 'Rubro del proveedor'}
                                            </div>
                                            <div style={estilos.volumenRubro}>
                                                {cargandoIndicadores
                                                    ? '...'
                                                    : formatearNumero(volumenToneladas)}
                                            </div>
                                            <div style={estilos.barraRubro}>
                                                <div
                                                    style={{
                                                        width: `${porcentaje}%`,
                                                        height: '100%',
                                                        backgroundColor: '#159A91',
                                                        borderRadius: '999px',
                                                        transition: 'width 0.25s ease'
                                                    }}
                                                />
                                            </div>
                                            <div style={estilos.porcentajeRubro}>
                                                {cargandoIndicadores
                                                    ? '...'
                                                    : `${formatearNumero(porcentaje)}%`}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div style={estilos.leyendaRubro}>
                                    Completitud de trazabilidad
                                </div>
                            </div>

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
                                    <div style={estilos.valorAlerta}>
                                        {cargandoIndicadores
                                            ? '...'
                                            : formatearNumero(
                                                indicadores.documentos_vencidos,
                                                0
                                            )}
                                    </div>
                                </div>

                                {filaAlertaRevision(
                                    'Entrega: lote faltante',
                                    indicadores.entregas_lote_faltante,
                                    'LOTE_FALTANTE',
                                    estilos.alertaLote
                                )}

                                {filaAlertaRevision(
                                    'Entrega: fecha vencimiento lote',
                                    indicadores.entregas_fecha_vencimiento_lote,
                                    'FECHA_VENCIMIENTO_LOTE',
                                    estilos.alertaLote
                                )}

                                {filaAlertaRevision(
                                    'Entrega: registro sanitario',
                                    indicadores.entregas_registro_sanitario,
                                    'REGISTRO_SANITARIO',
                                    estilos.alertaLote
                                )}

                                {filaAlertaRevision(
                                    'Entrega: temperatura por revisar',
                                    indicadores.entregas_temperatura_pendiente,
                                    'TEMPERATURA_PENDIENTE',
                                    estilos.alertaTemperatura
                                )}

                                {filaAlertaRevision(
                                    'Entrega: procedencia',
                                    indicadores.entregas_procedencia,
                                    'PROCEDENCIA_FALTANTE',
                                    estilos.alertaLote,
                                    true
                                )}
                            </div>
                        </div>
                         </>   
                
            )}

            <style>{`
                @media (max-width: 900px) {
                    .proveedor-fila-inferior {
                        grid-template-columns: minmax(0, 1fr) !important;
                    }
                }
                @media (max-width: 650px) {
                    .proveedor-fila-tarjetas {
                        grid-template-columns: minmax(0, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardProveedorPage;

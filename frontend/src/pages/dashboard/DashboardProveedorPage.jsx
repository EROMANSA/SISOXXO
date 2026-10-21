
import { useEffect, useState } from 'react';

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
    const [tiendas, setTiendas] = useState([]);
    const [estados, setEstados] = useState([]);

    const [tiendaId, setTiendaId] = useState('');
    const [estadoDespacho, setEstadoDespacho] = useState('');

    

const [indicadores, setIndicadores] = useState({
    volumen_registrado: 0,
    entregas_registradas: 0,
    trazabilidad_completa: 0,
    alertas_pendientes: 0,
    documentos_vencidos: 0,
    entregas_lote_faltante: 0,
    entregas_temperatura_pendiente: 0
});



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
                    estadoDespacho
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
    entregas_temperatura_pendiente: Number(
        respuesta?.indicadores?.entregas_temperatura_pendiente ?? 0
    )
});


                }
            } catch (err) {
                console.error(
                    'Error al cargar indicadores del dashboard:',
                    err
                );

                if (!cancelado) {
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
    }, [tiendaId, estadoDespacho]);

    const limpiarFiltros = () => {
        setTiendaId('');
        setEstadoDespacho('');
    };

    const formatearNumero = (valor) =>
        new Intl.NumberFormat('es-PE', {
            maximumFractionDigits: 2
        }).format(valor);

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
                    <div style={estilos.filaTarjetas}>

                        {/* TARJETA: VOLUMEN */}
                        <div style={estilos.tarjeta}>

                            <div style={estilos.tarjetaTitulo}>
                                Volumen Registrado
                            </div>
                            <div style={estilos.tarjetaValor}>
                                {cargandoIndicadores
                                ? '...'
                                : formatearNumero(
                                    indicadores.volumen_registrado
                                )}
                            </div>

                            <div style={estilos.tarjetaUnidad}>
                                Kilogramos (kg)
                            </div>

                        </div>

                        {/* TARJETA: ENTREGAS */}
                        <div style={estilos.tarjeta}>

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
                                Entregados respecto a Programados
                            </div>
                        </div>

                        {/* TARJETA: ALERTAS PENDIENTES */}
                        <div style={estilos.tarjetaAlerta}>

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

                        {/* SECCIÓN: ALERTAS PARA REVISIÓN */}
                        <div style={estilos.panelAlertas}>

                            <div style={estilos.tituloAlertas}>
                                ALERTAS PARA REVISIÓN
                            </div>
                            {/* DOCUMENTOS VENCIDOS */}
                            <div
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaDocumento}}>

                                    <div style={estilos.textoAlerta}>
                                        Perfil proveedor: documento vencido
                                    </div>

                                    <div style={estilos.valorAlerta}>
                                        {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.documentos_vencidos
                                        )}
                                    </div>
                            </div>

                            {/* PROCEDENCIA / LOTE FALTANTE */}
                            <div
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaLote
                                }}>
                                <div style={estilos.textoAlerta}>
                                    Entrega: procedencia/lote faltante
                                </div>

                                <div style={estilos.valorAlerta}>
                                    {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.entregas_lote_faltante
                                        )}
                                </div>
                            </div>

                            {/* TEMPERATURA POR REVISAR */}
                            <div
                                style={{
                                    ...estilos.filaAlerta,
                                    ...estilos.alertaTemperatura,
                                    marginBottom: 0
                                }}>
                                <div style={estilos.textoAlerta}>
                                    Entrega: temperatura por revisar
                                </div>

                                <div style={estilos.valorAlerta}>
                                    {cargandoIndicadores
                                        ? '...'
                                        : formatearNumero(
                                            indicadores.entregas_temperatura_pendiente
                                        )}
                                </div>
                            </div>
                             </div>
                         </>   
                
            )}
        </div>
    );
};

export default DashboardProveedorPage;

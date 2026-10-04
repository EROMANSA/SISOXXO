import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerDespachoPorId } from '../../services/despachos.services';

const DespachoVerPage = () => {

    const { transacId } = useParams();

    const columnasPorRubro = {
    '003': [
        { campo: 'transac_id', titulo: 'TRANSAC ID' },
        { campo: 'linea_id', titulo: 'LÍNEA' },
        { campo: 'fecha_despacho', titulo: 'FECHA DESPACHO' },
        { campo: 'producto_especie', titulo: 'PRODUCTO / ESPECIE' },
        { campo: 'cantidad', titulo: 'CANTIDAD' },
        { campo: 'unidad_medida_descripcion', titulo: 'UNIDAD MEDIDA' },
        { campo: 'registro_sanitario', titulo: 'REGISTRO SANITARIO' },
        { campo: 'fecha_emis_registro', titulo: 'FECHA EMIS. REGISTRO' },
        { campo: 'fecha_venci_registro', titulo: 'FECHA VENC. REGISTRO' },
        { campo: 'codigo_lote', titulo: 'CÓDIGO LOTE' },
        { campo: 'fecha_vencimiento_lote', titulo: 'FECHA VENC. LOTE' },
        { campo: 'observaciones', titulo: 'OBSERVACIONES' },
        { campo: 'estado_despacho_descripcion', titulo: 'ESTADO DESPACHO' }
    ],

    '001': [
        { campo: 'transac_id', titulo: 'TRANSAC ID' },
        { campo: 'linea_id', titulo: 'LÍNEA' },
        { campo: 'fecha_despacho', titulo: 'FECHA DESPACHO' },
        { campo: 'producto_especie', titulo: 'PRODUCTO / ESPECIE' },
        { campo: 'cantidad', titulo: 'CANTIDAD' },
        { campo: 'unidad_medida_descripcion', titulo: 'UNIDAD MEDIDA' },
        { campo: 'fecha_beneficio_ini', titulo: 'FECHA BENEFICIO INI.' },
        { campo: 'fecha_beneficio_fin', titulo: 'FECHA BENEFICIO FIN' },
        { campo: 'nro_guia_nota_venta', titulo: 'NRO. GUÍA / NOTA VENTA' },
        { campo: 'codigo_lote', titulo: 'CÓDIGO LOTE' },
        { campo: 'fecha_vencimiento_lote', titulo: 'FECHA VENC. LOTE' },
        { campo: 'observaciones', titulo: 'OBSERVACIONES' },
        { campo: 'estado_despacho_descripcion', titulo: 'ESTADO DESPACHO' }
    ],

    '002': [
        { campo: 'transac_id', titulo: 'TRANSAC ID' },
        { campo: 'linea_id', titulo: 'LÍNEA' },
        { campo: 'fecha_despacho', titulo: 'FECHA DESPACHO' },
        { campo: 'producto_especie', titulo: 'PRODUCTO / ESPECIE' },
        { campo: 'cantidad', titulo: 'CANTIDAD' },
        { campo: 'unidad_medida_descripcion', titulo: 'UNIDAD MEDIDA' },
        { campo: 'terminal_origen', titulo: 'TERMINAL ORIGEN' },
        { campo: 'temperatura_descarga', titulo: 'TEMPERATURA DESCARGA' },
        { campo: 'codigo_lote', titulo: 'CÓDIGO LOTE' },
        { campo: 'fecha_vencimiento_lote', titulo: 'FECHA VENC. LOTE' },
        { campo: 'observaciones', titulo: 'OBSERVACIONES' },
        { campo: 'estado_despacho_descripcion', titulo: 'ESTADO DESPACHO' }
    ],

    '004': [
        { campo: 'transac_id', titulo: 'TRANSAC ID' },
        { campo: 'linea_id', titulo: 'LÍNEA' },
        { campo: 'fecha_despacho', titulo: 'FECHA DESPACHO' },
        { campo: 'producto_especie', titulo: 'PRODUCTO / ESPECIE' },
        { campo: 'cantidad', titulo: 'CANTIDAD' },
        { campo: 'unidad_medida_descripcion', titulo: 'UNIDAD MEDIDA' },
        { campo: 'procedencia', titulo: 'PROCEDENCIA' },
        { campo: 'tipo_despacho_descripcion', titulo: 'TIPO DESPACHO' },
        { campo: 'fecha_cosecha', titulo: 'FECHA COSECHA' },
        { campo: 'fecha_ingreso', titulo: 'FECHA INGRESO' },
        { campo: 'observaciones', titulo: 'OBSERVACIONES' },
        { campo: 'estado_despacho_descripcion', titulo: 'ESTADO DESPACHO' }
    ]
};

    const [cabecera, setCabecera] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const cargarDespacho = async () => {

            try {

                setCargando(true);
                setError('');

                const response = await obtenerDespachoPorId(transacId);

                if (!response?.ok || !response?.despacho) {
                    throw new Error(
                        response?.mensaje || 'No fue posible obtener el despacho.'
                    );
                }

                setCabecera(response.despacho.cabecera);
                setDetalles(response.despacho.detalles || []);

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

    if (cargando) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Ver Despacho</h1>
                <p>Cargando información del despacho...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Ver Despacho</h1>

                <p style={{ color: 'red' }}>
                    {error}
                </p>
            </div>
        );
    }

    if (!cabecera) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Ver Despacho</h1>

                <p>
                    No se encontró información del despacho.
                </p>
            </div>
        );
    }

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

    return (
        <div style={{ padding: '20px' }}>

            <h1>Ver Despacho</h1>

            <p>
                Transacción:
                <strong> {cabecera.transac_id}</strong>
            </p>

            <div style={{ marginTop: '20px' }}>

                <h2>Cabecera del Despacho</h2>

                <p>
                    <strong>Proveedor:</strong>{' '}
                    {cabecera.proveedor_nombre || '-'}
                </p>

                <p>
                    <strong>Tipo Rubro:</strong>{' '}
                    {cabecera.tipo_rubro_descripcion || cabecera.tipo_rubro || '-'}
                </p>

                <p>
                    <strong>Destino Tienda:</strong>{' '}
                    {cabecera.destino_descripcion || cabecera.destino_id || '-'}
                </p>

                <p>
                    <strong>Tipo Transacción:</strong>{' '}
                    {cabecera.tipo_transaccion_descripcion || cabecera.tipo_transaccion || '-'}
                </p>

                <p>
                    <strong>Fecha Programación:</strong>{' '}
                    {cabecera.fecha_programacion || '-'}
                </p>

                <p>
                    <strong>Estado:</strong>{' '}
                    {cabecera.estado_despacho_descripcion || cabecera.estado_despacho || '-'}
                </p>

                <p>
                    <strong>Fecha Despacho:</strong>{' '}
                    {cabecera.fecha_despacho || '-'}
                </p>

                <p>
                    <strong>Fecha Cancelación:</strong>{' '}
                    {cabecera.fecha_cancelacion || '-'}
                </p>

                <p>
                    <strong>Observaciones:</strong>{' '}
                    {cabecera.observaciones || '-'}
                </p>

            </div>

            <div style={{ marginTop: '30px' }}>

    <h2>Detalle del Despacho</h2>

    {detalles.length === 0 ? (

        <p>
            No existen registros de detalle para este despacho.
        </p>

    ) : (

        <div
            style={{
                width: '100%',
                overflowX: 'auto',
                marginTop: '15px'
            }}
        >

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px'
                }}
            >

                <thead>

                    <tr>
                        {(columnasPorRubro[cabecera.tipo_rubro] || []).map(
                            (columna) => (
                                <th
                                    key={columna.campo}
                                    style={{
                                        border: '1px solid #ccc',
                                        padding: '8px',
                                        backgroundColor: '#0f2a4d',
                                        color: '#fff',
                                        textAlign: 'left',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {columna.titulo}
                                </th>
                            )
                        )}
                    </tr>

                </thead>

                <tbody>

                    {detalles.map((detalle) => (

                        <tr key={detalle.linea_id}>

                            {(columnasPorRubro[cabecera.tipo_rubro] || []).map(
                                (columna) => {

                                    const valor =
                                        detalle[columna.campo];

                                    const esFecha =
                                        columna.campo.includes('fecha_');

                                    return (
                                        <td
                                            key={columna.campo}
                                            style={{
                                                border: '1px solid #ccc',
                                                padding: '8px',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {esFecha
                                                ? formatearFecha(valor)
                                                : (valor ?? '-')}
                                        </td>
                                    );
                                }
                            )}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    )}

</div>

        </div>
    );
};

export default DespachoVerPage;
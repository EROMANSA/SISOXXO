import { useEffect, useState } from 'react';
import ProveedorForm from '../../components/proveedores/ProveedoresForm';

import {
    obtenerMiFicha
} from '../../services/proveedores.services';



function MiFichaPage() {

    const [proveedor, setProveedor] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [tieneFicha, setTieneFicha] = useState(false);
    const [mensaje, setMensaje] = useState('');


    const cargarMiFicha = async () => {

        try {

            setCargando(true);
            setError('');

           const response = await obtenerMiFicha();

/*console.log('=== MI FICHA ===');
console.log('Respuesta servicio:', response);
console.log('response.ok:', response?.ok);
console.log('response.data:', response?.data);*/

if (!response?.ok) {
    setError(
        response?.mensaje ||
        'No fue posible consultar su ficha.'
    );
    return;
}

const datos = response.data;

/*console.log('Datos de ficha:', datos);
console.log('proveedor_id:', datos?.proveedor_id);*/

if (datos) {
    /*console.log('>>> ESTABLECIENDO tieneFicha = TRUE');*/
    setProveedor(datos);
    setTieneFicha(true);
} else {
    /*console.log('>>> ESTABLECIENDO tieneFicha = FALSE');*/
    setProveedor(null);
    setTieneFicha(false);
}

        } catch (err) {

            console.error(
                'Error al cargar Mi Ficha:',
                err
            );

            setError(
                err.response?.data?.mensaje ||
                'No fue posible cargar su ficha.'
            );

        } finally {

            setCargando(false);

        }
    };


    useEffect(() => {

        cargarMiFicha();

    }, []);


    const handleCancelar = () => {

        cargarMiFicha();

    };

    const handleGuardado = async () => {

    setMensaje(
        tieneFicha
            ? 'Ficha actualizada correctamente.'
            : 'Ficha registrada correctamente.'
    );

    await cargarMiFicha();
};


    if (cargando) {

        return (
            <div className="page-container">

                <h1>Mi Ficha</h1>

                <div className="loading-message">
                    Cargando información de su ficha...
                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="page-container">

                <h1>Mi Ficha</h1>

                <div className="error-message">
                    {error}
                </div>

            </div>
        );
    }


    return (

        <div className="page-container">

            <h1>Mi Ficha</h1>

            {mensaje && (
    <div
        style={{
            marginBottom: '20px',
            padding: '12px 16px',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            color: '#166534',
            fontSize: '14px'
        }}
    >
        {mensaje}
    </div>
)}

            {!tieneFicha && (

                <div
                    style={{
                        marginBottom: '20px',
                        padding: '12px 16px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        color: '#1E40AF',
                        fontSize: '14px'
                    }}
                >
                    No tiene una ficha registrada.
                    Complete la información para registrar
                    su ficha de proveedor.
                </div>

            )}


            {tieneFicha && (

                <div
                    style={{
                        marginBottom: '20px',
                        padding: '12px 16px',
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '6px',
                        color: '#166534',
                        fontSize: '14px'
                    }}
                >
                    Ficha registrada.
                    Puede consultar y actualizar su información.
                </div>

            )}


    <ProveedorForm
    modo={tieneFicha ? 'editar' : 'nuevo'}
    proveedor={proveedor}
    onCancelar={handleCancelar}
    onGuardado={handleGuardado}
    miFicha={true}
/>

        </div>

    );

}


export default MiFichaPage;
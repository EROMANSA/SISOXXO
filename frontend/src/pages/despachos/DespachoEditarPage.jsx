import { useParams } from 'react-router-dom';

const DespachoEditarPage = () => {

    const { transacId } = useParams();

    return (
        <div style={{ padding: '20px' }}>

            <h1>Editar Despacho</h1>

            <p>
                Transacción:
                <strong> {transacId}</strong>
            </p>

        </div>
    );
};

export default DespachoEditarPage;
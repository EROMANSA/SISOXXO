import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../../services/auth.services';
import { registrarSolicitudUsuario } from '../../services/usuarios.services';

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const [formRegistro, setFormRegistro] = useState({
                                                        username: '',
                                                        correo: '',
                                                        password: ''
        });

    const [errorRegistro, setErrorRegistro] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!username.trim() || !password) {
            setError('Ingrese usuario y contraseña.');
            return;
        }

        try {
            setCargando(true);

            const data = await iniciarSesion(
                username.trim(),
                password
            );

            if (!data?.ok || !data?.token || !data?.usuario) {
                setError(
                    data?.mensaje || 'No fue posible iniciar sesión.'
                );
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem(
                'usuario',
                JSON.stringify(data.usuario)
            );

            navigate('/dashboard', { replace: true });

        } catch (error) {
            const mensaje =
                error.response?.data?.mensaje ||
                'No fue posible iniciar sesión.';

            setError(mensaje);

        } finally {
            setCargando(false);
        }
    };

    const handleRegistro = async (e) => {
    e.preventDefault();

    setErrorRegistro('');

    const usernameNormalizado = formRegistro.username.trim();
    const correoNormalizado = formRegistro.correo.trim().toLowerCase();

    if (!usernameNormalizado || !correoNormalizado || !formRegistro.password) {
        setErrorRegistro(
            'Usuario, correo electrónico y contraseña son obligatorios.'
        );
        return;
    }

    if (formRegistro.password.length < 8) {
        setErrorRegistro(
            'La contraseña debe tener al menos 8 caracteres.'
        );
        return;
    }

    try {
        const data = await registrarSolicitudUsuario({
            username: usernameNormalizado,
            correo: correoNormalizado,
            password: formRegistro.password
        });

        if (!data?.ok) {
            setErrorRegistro(
                data?.mensaje || 'No fue posible enviar la solicitud.'
            );
            return;
        }

        setMostrarRegistro(false);

        setFormRegistro({
            username: '',
            correo: '',
            password: ''
        });

        setErrorRegistro('');

        setError(
            data?.mensaje ||
            'Solicitud de registro enviada correctamente.'
        );

    } catch (error) {
        const mensaje =
            error.response?.data?.mensaje ||
            'No fue posible enviar la solicitud.';

        setErrorRegistro(mensaje);
    }
};

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#F8FAFC'
            }}
        >
            <div
                style={{
                    width: '380px',
                    background: '#FFFFFF',
                    padding: '35px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
            >
                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: '8px',
                        color: '#0F172A'
                    }}
                >
                    SISOXXO
                </h1>

                <p
                    style={{
                        marginTop: 0,
                        marginBottom: '30px',
                        color: '#64748B'
                    }}
                >
                    Gestión de Despachos
                </p>

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: '18px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600'
                            }}
                        >
                            Usuario
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            disabled={cargando}
                            autoComplete="username"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '11px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: '600'
                            }}
                        >
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            disabled={cargando}
                            autoComplete="current-password"
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '11px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px'
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: '18px',
                                padding: '10px',
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#B91C1C',
                                borderRadius: '6px'
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            fontWeight: '600',
                            cursor: cargando
                                ? 'default'
                                : 'pointer'
                        }}
                    >
                        {cargando
                            ? 'Ingresando...'
                            : 'Iniciar Sesión'}
                    </button>

              

                                    <div
                        style={{
                            marginTop: '22px',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                marginBottom: '10px',
                                color: '#64748B',
                                fontSize: '14px'
                            }}
                        >
                            ¿No tienes una cuenta?
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setErrorRegistro('');
                                setFormRegistro({
                                    username: '',
                                    correo: '',
                                    password: ''
                                });
                                setMostrarRegistro(true);
                            }}
                            style={{
                                width: '100%',
                                padding: '11px',
                                border: '1px solid #2563EB',
                                borderRadius: '6px',
                                background: '#FFFFFF',
                                color: '#2563EB',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Registrarse
                        </button>
                    </div>            

                  </form>

                {mostrarRegistro && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.55)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}
                    >
                        <div
                            style={{
                                width: '380px',
                                background: '#FFFFFF',
                                borderRadius: '10px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.20)',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style={{
                                    background: '#1E3A5F',
                                    color: '#FFFFFF',
                                    padding: '18px 20px'
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '18px'
                                    }}
                                >
                                    Solicitar Acceso
                                </h2>

                                <p
                                    style={{
                                        margin: '5px 0 0',
                                        fontSize: '13px',
                                        color: '#CBD5E1'
                                    }}
                                >
                                    Un administrador revisará tu solicitud
                                </p>
                            </div>

                            <div
                                style={{
                                    padding: '22px'
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: '16px'
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '6px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Usuario (RUC/DNI)*
                                    </label>

                                    <input
                                        type="text"
                                        value={formRegistro.username}
                                        onChange={(e) =>
                                            setFormRegistro({
                                                ...formRegistro,
                                                username: e.target.value
                                            })
                                        }
                                        placeholder="Ingrese un usuario (RUC/DNI)"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '11px',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        marginBottom: '16px'
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '6px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Correo Electrónico *
                                    </label>

                                    <input
                                        type="email"
                                        value={formRegistro.correo}
                                        onChange={(e) =>
                                            setFormRegistro({
                                                ...formRegistro,
                                                correo: e.target.value
                                            })
                                        }
                                        placeholder="tucorreo@ejemplo.com"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '11px',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        marginBottom: '16px'
                                    }}
                                >
                                    <label
                                        style={{
                                            display: 'block',
                                            marginBottom: '6px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Contraseña *
                                    </label>

                                    <input
                                        type="password"
                                        value={formRegistro.password}
                                        onChange={(e) =>
                                            setFormRegistro({
                                                ...formRegistro,
                                                password: e.target.value
                                            })
                                        }
                                        placeholder="Crea una contraseña segura"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '11px',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </div>

                                {errorRegistro && (
                                    <div
                                        style={{
                                            marginBottom: '16px',
                                            padding: '10px',
                                            background: '#FEF2F2',
                                            border: '1px solid #FECACA',
                                            color: '#B91C1C',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {errorRegistro}
                                    </div>
                                )}

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '10px'
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMostrarRegistro(false)
                                        }
                                        style={{
                                            padding: '10px 18px',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px',
                                            background: '#FFFFFF',
                                            color: '#475569',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    <button
    type="button"
    onClick={handleRegistro}
    style={{
        padding: '10px 18px',
        border: 'none',
        borderRadius: '6px',
        background: '#2563EB',
        color: '#FFFFFF',
        fontWeight: '600',
        cursor: 'pointer'
    }}
>
    Enviar Solicitud
</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>  
    );
}

export default LoginPage;
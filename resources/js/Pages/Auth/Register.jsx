import { useForm, Head, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Registrarse" />
            <div style={styles.page}>
                <div style={styles.card}>

                    <div style={styles.logoArea}>
                        <h1 style={styles.logo}>FLICKA</h1>
                        <p style={styles.tagline}>Tu diario cinematográfico</p>
                    </div>

                    <div style={styles.tabs}>
                        <Link href={route('login')} style={styles.tab}>
                            Iniciar sesión
                        </Link>
                        <span style={{ ...styles.tab, ...styles.tabActive }}>
                            Registrarse
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div style={styles.group}>
                            <label style={styles.label}>Nombre de usuario</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                placeholder="cinéfilo_123"
                                style={errors.username ? { ...styles.input, ...styles.inputError } : styles.input}
                            />
                            {errors.username && <p style={styles.errorMsg}>{errors.username}</p>}
                        </div>

                        <div style={styles.group}>
                            <label style={styles.label}>Correo electrónico</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="tu@correo.com"
                                style={errors.email ? { ...styles.input, ...styles.inputError } : styles.input}
                            />
                            {errors.email && <p style={styles.errorMsg}>{errors.email}</p>}
                        </div>

                        <div style={styles.group}>
                            <label style={styles.label}>Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
                            />
                            {errors.password && <p style={styles.errorMsg}>{errors.password}</p>}
                        </div>

                        <div style={styles.group}>
                            <label style={styles.label}>Confirmar contraseña</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Repite tu contraseña"
                                style={errors.password_confirmation ? { ...styles.input, ...styles.inputError } : styles.input}
                            />
                            {errors.password_confirmation && <p style={styles.errorMsg}>{errors.password_confirmation}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={processing ? { ...styles.btn, opacity: 0.6 } : styles.btn}
                        >
                            {processing ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

// Reutilizamos exactamente los mismos estilos del Login
const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'linear-gradient(160deg, rgba(48,20,19,0.97), rgba(15,5,5,0.99))',
        border: '1px solid #594B36',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
    },
    logoArea: { textAlign: 'center', marginBottom: '2rem' },
    logo: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '40px',
        fontWeight: '700',
        color: '#e8e0d5',
        letterSpacing: '4px',
    },
    tagline: {
        fontFamily: "'Forum', serif",
        color: '#ae8c5f',
        fontSize: '13px',
        marginTop: '4px',
        letterSpacing: '1px',
    },
    tabs: {
        display: 'flex',
        borderBottom: '1px solid #594B36',
        marginBottom: '2rem',
    },
    tab: {
        flex: 1,
        textAlign: 'center',
        padding: '0.75rem',
        fontSize: '13px',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: '500',
        color: '#ae8c5f',
        textDecoration: 'none',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        borderBottom: '2px solid transparent',
        marginBottom: '-1px',
        cursor: 'pointer',
    },
    tabActive: {
        color: '#e8e0d5',
        borderBottom: '2px solid #e8e0d5',
    },
    group: { marginBottom: '1.25rem' },
    label: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        color: '#ae8c5f',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        background: 'rgba(89,75,54,0.2)',
        border: '1px solid #594B36',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '14px',
        color: '#f7f4ef',
        outline: 'none',
    },
    inputError: { borderColor: '#e8856a' },
    errorMsg: { fontSize: '12px', color: '#e8856a', marginTop: '4px' },
    btn: {
        width: '100%',
        background: 'linear-gradient(to right, #4D1519, #72463b)',
        border: '1px solid #72463b',
        borderRadius: '8px',
        padding: '0.85rem',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        color: '#e8e0d5',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
};
import { useForm } from '@inertiajs/react'
import styles from './Register.module.css'
import fondo from '../../../images/fondo-login.jpg'

export default function Register() {

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',  
  })

  function handleSubmit(e) {
    e.preventDefault()
    // Hace POST a /register — que es la ruta que apunta a RegisteredUserController@store
    post('/register')
  }

  return (
    <div className={styles.page}>

      {/* Imagen de fondo al 100% */}
      <img src={fondo} alt="" className={styles.bgImage} />

      {/* Overlay oscuro para legibilidad */}

      {/* Panel central: 30% ancho, 80vh alto */}
      <div className={styles.panel}>

        <div className={styles.brand}>
          Fl<span>i</span>cka
        </div>

        <span className={styles.newBadge}>● Nuevo crítico</span>

        <h2 className={styles.formTitle}>Únete a Flicka</h2>
        <p className={styles.formSubtitle}>
          Crea tu cuenta y empieza a registrar tus películas
        </p>

        <form onSubmit={handleSubmit}>

          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Nombre de usuario</label>
            <input
              className={styles.fieldInput}
              type="text"
              name="name"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              placeholder="ej. cinefilop99"
              autoComplete="username"
            />
            {errors.name && (
              <span className={styles.fieldError}>{errors.name}</span>
            )}
          </div>

          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Correo electrónico</label>
            <input
              className={styles.fieldInput}
              type="email"
              name="email"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Contraseña</label>
            <input
              className={styles.fieldInput}
              type="password"
              name="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Confirmar contraseña</label>
            <input
              className={styles.fieldInput}
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
            />
            {errors.password_confirmation && (
              <span className={styles.fieldError}>{errors.password_confirmation}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={processing}
          >
            {processing ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

        </form>

        <div className={styles.loginLink}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login">Inicia sesión</a>
        </div>

      </div>
    </div>
  )
}
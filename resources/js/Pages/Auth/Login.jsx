import { useState } from 'react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import styles from './Login.module.css'
import logo from '../../../images/logo-Flicka.jpeg';
import fondo from '../../../images/fondo-login.jpg';
export default function Login() {
  const [data, setData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  function handleChange(e) {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setProcessing(true)
    setErrors({})
    try {
      const response = await axios.post('/api/login', {
        email: data.email,
        password: data.password,
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      router.visit('/peliculas')
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else if (error.response?.status === 401) {
        setErrors({ email: 'Credenciales incorrectas. Intenta de nuevo.' })
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.leftPanel}>
        <img src={fondo} alt="" className={styles.bgImage} />

        <svg className={styles.arcs} viewBox="0 0 520 520">
          <circle cx="520" cy="0" r="140" fill="none" stroke="#fff" strokeWidth="1.5" />
          <circle cx="520" cy="0" r="210" fill="none" stroke="#fff" strokeWidth="1.5" />
          <circle cx="520" cy="0" r="280" fill="none" stroke="#fff" strokeWidth="1.5" />
          <circle cx="520" cy="0" r="350" fill="none" stroke="#fff" strokeWidth="1.5" />
          <circle cx="520" cy="0" r="420" fill="none" stroke="#fff" strokeWidth="1.5" />
        </svg>

        <div className={styles.leftLogo}>
          <img src={logo} alt="Flicka" />
        </div>

        <div className={styles.leftContent}>
          <h1 className={styles.headline}>
            ¡Hola,<br />
            <em>cinéfilo!</em>
          </h1>
          <p className={styles.description}>
            Flicka es tu <strong>diario personal de cine</strong> — el lugar donde cada
            película que viste merece ser recordada. Escribe reseñas, construye tu
            colección de favoritas y descubre qué ver a continuación.
            <br /><br />
            Flicka es para quienes creen que
            <strong> el cine no termina cuando caen los créditos.</strong>
          </p>
          <div className={styles.badge}>Creado por Lu, Kar y Andy</div>
        </div>

        <div className={styles.leftFooter}>
          © 2026 Flicka · Todos los derechos reservados
        </div>

      </div>

      <div className={styles.rightPanel}>

        <div className={styles.brand}>
          Fl<span>i</span>cka
        </div>

        <span className={styles.criticBadge}>● Crítico</span>

        <h2 className={styles.formTitle}>Bienvenido de vuelta</h2>
        <p className={styles.formSubtitle}>Accede a tu cuenta para continuar</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Correo electrónico</label>
            <input
              className={styles.fieldInput}
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={styles.fieldError}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={processing}
          >
            {processing ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => router.visit('/admin/login')}
          >
            Soy director
          </button>
        </form>

        <div className={styles.registerLink}>
          ¿Aún no estás registrado?{' '}
          <a href="/register">Crea tu cuenta aquí</a>
        </div>

      </div>
    </div>
  )
}
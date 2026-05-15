import { useState } from 'react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import styles from './Register.module.css'
import fondo from '../../../images/fondo-login.jpg'

export default function Register() {

  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
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
      const response = await axios.post('/api/register', {
        username:              data.username,
        email:                 data.email,
        password:              data.password,
        password_confirmation: data.password_confirmation,
      })

      // Guarda el token igual que en Login
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirige al catálogo tras registrarse
      window.location.href = '/peliculas'

    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ email: 'Ocurrió un error. Intenta de nuevo.' })
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />

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
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="ej. cinefilop99"
              autoComplete="username"
            />
            {errors.username && (
              <span className={styles.fieldError}>{errors.username}</span>
            )}
          </div>

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
              onChange={handleChange}
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

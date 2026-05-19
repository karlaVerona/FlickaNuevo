import { useState } from 'react'
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

  function handleChange(field, value) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setProcessing(true)
    setErrors({})

    try {
      const res = await axios.post('/api/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/peliculas'

    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: 'Ocurrió un error, intenta de nuevo.' })
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

        {errors.general && (
          <span className={styles.fieldError}>{errors.general}</span>
        )}

        <form onSubmit={handleSubmit}>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Nombre de usuario</label>
            <input
              className={styles.fieldInput}
              type="text"
              value={data.username}
              onChange={e => handleChange('username', e.target.value)}
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
              value={data.email}
              onChange={e => handleChange('email', e.target.value)}
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
              value={data.password}
              onChange={e => handleChange('password', e.target.value)}
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
              value={data.password_confirmation}
              onChange={e => handleChange('password_confirmation', e.target.value)}
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
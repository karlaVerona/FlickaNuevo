import { useState } from 'react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import styles from './AdminLogin.module.css'
import logo from '../../../images/logo-Flicka.jpeg'

export default function AdminLogin() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setProcesando(true)
    try {
      const res = await axios.post('/api/login', { email, password })
      const user = res.data.user

      if (user.role !== 'admin') {
        setError('No tienes permisos de administrador.')
        return
      }

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(user))
      router.visit('/admin/dashboard')
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 422) {
        setError('Credenciales incorrectas. Intenta de nuevo.')
      } else {
        setError('Ocurrió un error. Intenta de nuevo.')
      }
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoRow}>
          <img src={logo} alt="Flicka" className={styles.logoImg} />
          <span className={styles.logoText}>Fl<span>i</span>cka</span>
        </div>

        <div className={styles.adminBadge}>PANEL DE ADMINISTRACIÓN</div>

        <h1 className={styles.titulo}>Acceso restringido</h1>
        <p className={styles.subtitulo}>Ingresa tus credenciales de administrador</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.campo}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@flicka.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Contraseña</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={procesando}
          >
            {procesando ? 'Verificando...' : 'Ingresar al panel'}
          </button>

        </form>

        <button
          type="button"
          className={styles.backLink}
          onClick={() => router.visit('/login')}
        >
          ← Volver al inicio de sesión
        </button>

      </div>

    </div>
  )
}
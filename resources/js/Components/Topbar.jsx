import { Settings, LogOut } from 'lucide-react'
import axios from 'axios'
import styles from './TopBar.module.css'

export default function TopBar() {

  // Lee el usuario guardado en localStorage al hacer login/register
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const username = user.username || 'Usuario'
  const isPro    = user.is_pro === true || user.is_pro === 1
  const plan     = isPro ? 'Flicka PRO' : 'Gratuito'

  function getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function getFormattedDate() {
    return new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).toUpperCase()
  }

  async function handleLogout() {
    try {
      await axios.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      // Si falla igual limpiamos y redirigimos
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
  }

  return (
    <header className={styles.topbar}>

      {/* Saludo + fecha */}
      <div className={styles.greeting}>
        <span className={styles.greetingTitle}>
          Bienvenid@ de vuelta, {username}
        </span>
        <span className={styles.greetingDate}>
          {getFormattedDate()}
        </span>
      </div>

      {/* Usuario + controles */}
      <div className={styles.rightSection}>

        <div className={styles.userInfo}>
          <span className={styles.userName}>{username}</span>
          <span className={styles.userPlan}>{plan}</span>
        </div>

        {/* Avatar con iniciales */}
        <div className={styles.avatar}>
          {getInitials(username)}
        </div>

        {/* Botón configuración */}
        <button className={styles.iconBtn} title="Configuración">
          <Settings size={16} />
        </button>

        {/* Botón logout */}
        <button className={styles.iconBtn} title="Cerrar sesión" onClick={handleLogout}>
          <LogOut size={16} />
        </button>

      </div>
    </header>
  )
}
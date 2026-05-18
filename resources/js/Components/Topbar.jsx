import { useState } from 'react'
import { Settings, LogOut } from 'lucide-react'
import axios from 'axios'
import styles from './TopBar.module.css'
import ModalPerfil from './ModalPerfil'

export default function TopBar() {

  const [modalPerfil, setModalPerfil] = useState(false)

  const user     = JSON.parse(localStorage.getItem('user') || '{}')
  const username = user.username || 'Usuario'
  const isPro    = user.is_pro === true || user.is_pro === 1
  const plan     = isPro ? 'Flicka PRO' : 'Gratuito'

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  function getFormattedDate() {
    return new Date().toLocaleDateString('es-MX', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).toUpperCase()
  }

  async function handleLogout() {
    try {
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/logout-web'
  }

  function onPerfilActualizado(nuevoUser) {
    localStorage.setItem('user', JSON.stringify({ ...user, ...nuevoUser }))
    setModalPerfil(false)
    // Fuerza re-render del topbar refrescando la página (o puedes usar estado global)
    window.location.reload()
  }

  return (
    <>
      <header className={styles.topbar}>

        <div className={styles.greeting}>
          <span className={styles.greetingTitle}>
            Bienvenid@ de vuelta, {username}
          </span>
          <span className={styles.greetingDate}>
            {getFormattedDate()}
          </span>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{username}</span>
            <span className={styles.userPlan}>{plan}</span>
          </div>

          <div className={styles.avatar}>
            {user.photo
              ? <img src={user.photo} alt={username} className={styles.avatarImg} />
              : getInitials(username)
            }
          </div>

          <button className={styles.iconBtn} title="Configuración" onClick={() => setModalPerfil(true)}>
            <Settings size={16} />
          </button>

          <button className={styles.iconBtn} title="Cerrar sesión" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>

      </header>

      {modalPerfil && (
        <ModalPerfil
          user={user}
          onCerrar={() => setModalPerfil(false)}
          onActualizado={onPerfilActualizado}
        />
      )}
    </>
  )
}
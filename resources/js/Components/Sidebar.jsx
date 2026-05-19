import { useState } from 'react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import {
  Film, Search, Dices, ClipboardList, LayoutList,
  Heart, User, BarChart2, CreditCard, LogOut
} from 'lucide-react'
import styles from './Sidebar.module.css'
import logo from '../../images/logo-Flicka.jpeg'
import ModalPro from './ModalPro'

export default function Sidebar({ active = '' }) {

  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  const isPro = user.is_pro === true || user.is_pro === 1

  const [modalPro, setModalPro] = useState(false)

  function navClass(name) {
    return `${styles.navItem} ${active === name ? styles.navItemActive : ''}`
  }

  function navClassBloqueado(name) {
    return `${styles.navItem} ${styles.navItemBloqueado} ${active === name ? styles.navItemActive : ''}`
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

  return (
    <aside className={styles.sidebar}>

      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="Flicka" className={styles.logoImg} />
        <span className={styles.logoText}>
          Fl<span>i</span>cka
        </span>
      </div>

      {isPro
        ? <div className={styles.planBadge}>PRO</div>
        : <div className={styles.planBadgeFree}>GRATUITO</div>
      }

      {/* ── DESCUBRIR ── */}
      <span className={styles.sectionLabel}>Descubrir</span>

      <Link href="/peliculas" className={navClass('peliculas')}>
        <Film size={16} className={styles.navIcon} />
        Películas
      </Link>

      <Link href="/busqueda" className={navClass('busqueda')}>
        <Search size={16} className={styles.navIcon} />
        Búsqueda
      </Link>

      <Link href="/aleatoria" className={navClass('aleatoria')}>
        <Dices size={16} className={styles.navIcon} />
        Aleatoria
      </Link>

      <div className={styles.divider} />

      {/* ── MI ACTIVIDAD ── */}
      <span className={styles.sectionLabel}>Mi actividad</span>

      <Link href="/mis-resenas" className={navClass('resenas')}>
        <ClipboardList size={16} className={styles.navIcon} />
        Mis reseñas
      </Link>

      <Link href="/mis-listas" className={navClass('listas')}>
        <LayoutList size={16} className={styles.navIcon} />
        Mis listas
      </Link>

      {/* Favoritas — solo PRO */}
      {isPro
        ? (
          <Link href="/favoritas" className={navClass('favoritas')}>
            <Heart size={16} className={styles.navIcon} />
            Favoritas
          </Link>
        )
        : (
          <button
            className={navClassBloqueado('favoritas')}
            onClick={() => setModalPro(true)}
          >
            <Heart size={16} className={styles.navIcon} />
            Favoritas
            <span className={styles.lockBadge}>PRO</span>
          </button>
        )
      }

      <div className={styles.divider} />

      {/* ── CUENTA ── */}
      <span className={styles.sectionLabel}>Cuenta</span>

      <Link href="/perfil" className={navClass('perfil')}>
        <User size={16} className={styles.navIcon} />
        Perfil
      </Link>

      {/* Estadísticas — solo PRO */}
      {isPro
        ? (
          <Link href="/estadisticas" className={navClass('estadisticas')}>
            <BarChart2 size={16} className={styles.navIcon} />
            Estadísticas
          </Link>
        )
        : (
          <button
            className={navClassBloqueado('estadisticas')}
            onClick={() => setModalPro(true)}
          >
            <BarChart2 size={16} className={styles.navIcon} />
            Estadísticas
            <span className={styles.lockBadge}>PRO</span>
          </button>
        )
      }

      <Link href="/suscripcion" className={navClass('suscripcion')}>
        <CreditCard size={16} className={styles.navIcon} />
        Suscripción
      </Link>

      {/* Modal PRO */}
      {modalPro && (
        <ModalPro
          onAceptar={() => setModalPro(false)}
        />
      )}

    </aside>
  )
}
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import {
  LayoutDashboard, Film, Users, ClipboardList, LogOut,
} from 'lucide-react'
import styles from './AdminLayout.module.css'
import logo from '../../../images/logo-Flicka.jpeg'

export default function AdminLayout({ children, active = '' }) {

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const username = user.username || 'Admin'

  function navClass(name) {
    return `${styles.navItem} ${active === name ? styles.navItemActive : ''}`
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  async function handleLogout() {
    try {
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch { }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Usa logout-web para invalidar la sesión de Laravel también
    window.location.href = '/logout-web'
  }

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>

        <div className={styles.logo}>
          <img src={logo} alt="Flicka" className={styles.logoImg} />
          <span className={styles.logoText}>Fl<span>i</span>cka</span>
        </div>

        <div className={styles.adminBadge}>ADMIN</div>

        <span className={styles.sectionLabel}>Panel</span>

        <Link href="/admin/dashboard" className={navClass('dashboard')}>
          <LayoutDashboard size={16} className={styles.navIcon} />
          Dashboard
        </Link>

        <Link href="/admin/peliculas" className={navClass('peliculas')}>
          <Film size={16} className={styles.navIcon} />
          Películas
        </Link>

        <Link href="/admin/usuarios" className={navClass('usuarios')}>
          <Users size={16} className={styles.navIcon} />
          Usuarios
        </Link>

        <Link href="/admin/resenas" className={navClass('resenas')}>
          <ClipboardList size={16} className={styles.navIcon} />
          Reseñas
        </Link>

        <div className={styles.divider} />

        {/* Perfil admin en la parte inferior */}
        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>{getInitials(username)}</div>
          <div className={styles.adminMeta}>
            <span className={styles.adminNombre}>{username}</span>
            <span className={styles.adminRol}>Administrador</span>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={15} />
          Cerrar sesión
        </button>

      </aside>

      {/* ── Contenido principal ── */}
      <div className={styles.main}>
        {children}
      </div>

    </div>
  )
}
import { Link, router } from '@inertiajs/react'
import {
  Film,
  Search,
  Dices,
  ClipboardList,
  LayoutList,
  Heart,
  User,
  BarChart2,
  CreditCard,
  LogOut
} from 'lucide-react'
import styles from './Sidebar.module.css'
import logo from '../../images/logo-Flicka.jpeg'

export default function Sidebar({ active = '' }) {

  function navClass(name) {
    return `${styles.navItem} ${active === name ? styles.navItemActive : ''}`
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.post('/logout')
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

      {/* Badge PRO */}
      <div className={styles.planBadge}>PRO</div>

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

      <Link href="/favoritas" className={navClass('favoritas')}>
        <Heart size={16} className={styles.navIcon} />
        Favoritas
      </Link>

      <div className={styles.divider} />

      {/* ── CUENTA ── */}
      <span className={styles.sectionLabel}>Cuenta</span>

      <Link href="/perfil" className={navClass('perfil')}>
        <User size={16} className={styles.navIcon} />
        Perfil
      </Link>

      <Link href="/estadisticas" className={navClass('estadisticas')}>
        <BarChart2 size={16} className={styles.navIcon} />
        Estadísticas
      </Link>

      <Link href="/suscripcion" className={navClass('suscripcion')}>
        <CreditCard size={16} className={styles.navIcon} />
        Suscripción
      </Link>

      

    </aside>
  )
}
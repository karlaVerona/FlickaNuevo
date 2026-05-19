import { useState, useEffect } from 'react'
import { ChevronDown, Heart, Search, X } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Favoritas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'
import ModalDetalle from '../../Components/ModalDetalle'
import ModalResena from '../../Components/ModalResena'

const GENEROS = ['Terror', 'Romance', 'Ficción', 'Drama', 'Acción', 'Comedia']
const ORDENAR = ['Más reciente', 'Más antigua', 'A–Z', 'Z–A']

export default function Favoritas() {

  const [favoritas,            setFavoritas]            = useState([])
  const [cargando,             setCargando]             = useState(true)
  const [busqueda,             setBusqueda]             = useState('')
  const [filtroGenero,         setFiltroGenero]         = useState(null)
  const [filtroOrden,          setFiltroOrden]          = useState(null)
  const [dropdownAbierto,      setDropdownAbierto]      = useState(null)
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [modalResenaAbierto,   setModalResenaAbierto]   = useState(false)
  const [tieneSeisEstrellas,   setTieneSeisEstrellas]   = useState(false)

  useEffect(() => {
    cargarFavoritas()
  }, [])

  function cargarFavoritas() {
    setCargando(true)
    api.get('/favorites')
      .then(res => setFavoritas(res.data.favorites))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }

  function toggleDropdown(nombre) {
    setDropdownAbierto(prev => prev === nombre ? null : nombre)
  }

  function quitarFavorita(movieId) {
    const fav = favoritas.find(f => f.movie_id === movieId)
    if (!fav) return
    api.delete(`/favorites/${fav.id}`)
      .then(() => setFavoritas(prev => prev.filter(f => f.id !== fav.id)))
      .catch(err => console.error(err))
  }

  function abrirModalResena() {
    api.get('/my-reviews')
      .then(res => setTieneSeisEstrellas(res.data.some(r => r.is_six_star)))
      .catch(() => {})
      .finally(() => setModalResenaAbierto(true))
  }

  const favoritasFiltradas = [...favoritas]
    .filter(f => {
      const coincideTitulo = (f.movie?.title ?? '').toLowerCase().includes(busqueda.toLowerCase())
      const coincideGenero = filtroGenero ? f.movie?.genre === filtroGenero : true
      return coincideTitulo && coincideGenero
    })
    .sort((a, b) => {
      if (filtroOrden === 'Más reciente') return b.id - a.id
      if (filtroOrden === 'Más antigua')  return a.id - b.id
      if (filtroOrden === 'A–Z') return (a.movie?.title ?? '').localeCompare(b.movie?.title ?? '')
      if (filtroOrden === 'Z–A') return (b.movie?.title ?? '').localeCompare(a.movie?.title ?? '')
      return 0
    })

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="favoritas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Favoritas</h1>
            <p className={styles.pageSubtitle}>Las películas que más te gustaron</p>
          </div>

          {/* ── Búsqueda + filtros en la misma fila ── */}
          <div className={styles.controlesRow}>

            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar película por título"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className={styles.searchClear} onClick={() => setBusqueda('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className={styles.filtrosRow}>
              <span className={styles.filtrosLabel}>Filtrar por:</span>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroGenero ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('genero')}
                >
                  {filtroGenero ?? 'Género'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'genero' && (
                  <div className={styles.dropdownMenu}>
                    {GENEROS.map(g => (
                      <button key={g}
                        className={`${styles.dropdownItem} ${filtroGenero === g ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroGenero(g); setDropdownAbierto(null) }}
                      >{g}</button>
                    ))}
                    {filtroGenero && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroGenero(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroOrden ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('orden')}
                >
                  {filtroOrden ?? 'Ordenar'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'orden' && (
                  <div className={styles.dropdownMenu}>
                    {ORDENAR.map(o => (
                      <button key={o}
                        className={`${styles.dropdownItem} ${filtroOrden === o ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroOrden(o); setDropdownAbierto(null) }}
                      >{o}</button>
                    ))}
                    {filtroOrden && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroOrden(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <span className={styles.contador}>
                {favoritasFiltradas.length} película{favoritasFiltradas.length !== 1 ? 's' : ''}
              </span>
            </div>

          </div>

          {/* ── Grid ── */}
          {cargando
            ? <div className={styles.cargando}>Cargando favoritas...</div>
            : favoritasFiltradas.length > 0
              ? (
                <div className={styles.grid}>
                  {favoritasFiltradas.map(fav => (
                    <MovieCard
                      key={fav.id}
                      pelicula={fav.movie}
                      onVerDetalle={() => setPeliculaSeleccionada(fav.movie)}
                      onQuitarFavorita={() => quitarFavorita(fav.movie_id)}
                    />
                  ))}
                </div>
              )
              : (
                <div className={styles.vacio}>
                  <Heart size={48} className={styles.vacioIcono} />
                  <p className={styles.vacioTexto}>
                    {busqueda || filtroGenero
                      ? 'No se encontraron favoritas con esos filtros'
                      : 'Aún no tienes películas favoritas'}
                  </p>
                </div>
              )
          }

        </main>
      </div>

      {peliculaSeleccionada && (
        <ModalDetalle
          pelicula={peliculaSeleccionada}
          esFavorita={true}
          onToggleFavorito={() => {
            quitarFavorita(peliculaSeleccionada.id)
            setPeliculaSeleccionada(null)
          }}
          onCerrar={() => setPeliculaSeleccionada(null)}
          onAbrirResena={abrirModalResena}
        />
      )}

      {modalResenaAbierto && peliculaSeleccionada && (
        <ModalResena
          pelicula={peliculaSeleccionada}
          tieneSeisEstrellas={tieneSeisEstrellas}
          onCerrar={() => setModalResenaAbierto(false)}
          onExito={() => {
            setModalResenaAbierto(false)
            setPeliculaSeleccionada(null)
          }}
        />
      )}

    </div>
  )
}

function MovieCard({ pelicula, onVerDetalle, onQuitarFavorita }) {
  return (
    <div className={styles.card} onClick={onVerDetalle}>
      {pelicula?.poster
        ? <img src={pelicula.poster} alt={pelicula.title} className={styles.poster} />
        : <div className={styles.posterPlaceholder} />
      }
      <div className={styles.cardInfo}>
        <div className={styles.cardTitulo}>{pelicula?.title}</div>
        <div className={styles.cardMeta}>{pelicula?.anio} · {pelicula?.genre}</div>
        <div className={styles.cardAcciones}>
          
          <button
            className={styles.quitarBtn}
            onClick={e => { e.stopPropagation(); onQuitarFavorita() }}
            title="Quitar de favoritas"
          >
            <Heart size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  )
}
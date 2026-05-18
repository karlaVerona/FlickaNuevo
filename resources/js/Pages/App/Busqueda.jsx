import { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Busqueda.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import { ORDENAR } from './Busqueda.helpers.js'
import api from '@/lib/axios'
import ModalResena from '../../Components/ModalResena'
import ModalDetalle from '../../Components/ModalDetalle'

const OPCIONES_ANIO = [
  { label: 'Más reciente', value: 'mas_reciente' },
  { label: 'Más antigua', value: 'mas_antigua' },
]

export default function Busqueda() {

  const [busqueda, setBusqueda] = useState('')
  const [filtroGenero, setFiltroGenero] = useState(null)
  const [filtroAnio, setFiltroAnio] = useState(null)
  const [filtroOrden, setFiltroOrden] = useState(null)
  const [dropdownAbierto, setDropdownAbierto] = useState(null)
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [peliculas, setPeliculas] = useState([])
  const [generos, setGeneros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalResenaAbierto, setModalResenaAbierto] = useState(false)
  const [tieneSeisEstrellas, setTieneSeisEstrellas] = useState(false)
  const [favIds, setFavIds] = useState(new Set())
  const [favMap, setFavMap] = useState({})

  // Carga géneros y favoritas al montar
  useEffect(() => {
    Promise.all([
      api.get('/movies/genres'),
      api.get('/favorites'),
    ]).then(([genRes, favRes]) => {
      setGeneros(genRes.data)
      const ids = new Set(favRes.data.favorites.map(f => f.movie_id))
      const map = {}
      favRes.data.favorites.forEach(f => { map[f.movie_id] = f.id })
      setFavIds(ids)
      setFavMap(map)
    }).catch(() => { })
  }, [])

  // Busca películas cuando cambian los filtros
  useEffect(() => {
    const params = {}
    if (busqueda) params.search = busqueda
    if (filtroGenero) params.genre = filtroGenero
    if (filtroAnio) params.anio = filtroAnio
    if (filtroOrden) params.orden = filtroOrden

    setCargando(true)
    api.get('/movies', { params })
      .then(res => setPeliculas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [busqueda, filtroGenero, filtroAnio, filtroOrden])

  function toggleDropdown(nombre) {
    setDropdownAbierto(prev => prev === nombre ? null : nombre)
  }

  function toggleFavorito(movieId) {
    if (favIds.has(movieId)) {
      const favId = favMap[movieId]
      api.delete(`/favorites/${favId}`)
        .then(() => {
          setFavIds(prev => { const s = new Set(prev); s.delete(movieId); return s })
          setFavMap(prev => { const m = { ...prev }; delete m[movieId]; return m })
        })
        .catch(err => console.error(err))
    } else {
      api.post('/favorites', { movie_id: movieId })
        .then(res => {
          setFavIds(prev => new Set(prev).add(movieId))
          setFavMap(prev => ({ ...prev, [movieId]: res.data.favorite.id }))
        })
        .catch(err => console.error(err))
    }
  }

  function abrirModalResena() {
    api.get('/my-reviews')
      .then(res => setTieneSeisEstrellas(res.data.some(r => r.is_six_star)))
      .catch(() => { })
      .finally(() => setModalResenaAbierto(true))
  }

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="busqueda" />

      <div className={styles.mainColumn}>
        <TopBar />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Busca en nuestro catálogo</h1>
            <p className={styles.pageSubtitle}>Descubre una nueva historia</p>
          </div>

          <div className={styles.searchRow}>
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

            <div className={styles.filtros}>
              <span className={styles.filtrosLabel}>Filtrar por:</span>

              {/* Género — dinámico desde la BD */}
              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroGenero ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('genero')}
                >
                  {filtroGenero ?? 'Género'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'genero' && (
                  <div className={styles.dropdownMenu}>
                    {generos.map(g => (
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

              {/* Año — más reciente / más antigua */}
              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroAnio ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('anio')}
                >
                  {filtroAnio ? OPCIONES_ANIO.find(o => o.value === filtroAnio)?.label : 'Año'}
                  <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'anio' && (
                  <div className={styles.dropdownMenu}>
                    {OPCIONES_ANIO.map(a => (
                      <button key={a.value}
                        className={`${styles.dropdownItem} ${filtroAnio === a.value ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroAnio(a.value); setDropdownAbierto(null) }}
                      >{a.label}</button>
                    ))}
                    {filtroAnio && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroAnio(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Valoración */}
              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroOrden ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('orden')}
                >
                  {filtroOrden ?? 'Valoración'} <ChevronDown size={14} />
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
            </div>
          </div>

          <div className={styles.resultsGrid}>
            {cargando
              ? <div className={styles.cargando}>Cargando películas...</div>
              : peliculas.length > 0
                ? peliculas.map(pelicula => (
                  <MovieCard
                    key={pelicula.id}
                    pelicula={pelicula}
                    esFavorita={favIds.has(pelicula.id)}
                    onToggleFavorito={() => toggleFavorito(pelicula.id)}
                    onVerDetalle={() => setPeliculaSeleccionada(pelicula)}
                  />
                ))
                : <div className={styles.sinResultados}>No se encontraron películas con esos filtros.</div>
            }
          </div>

        </main>
      </div>

      {peliculaSeleccionada && (
        <ModalDetalle
          pelicula={peliculaSeleccionada}
          esFavorita={favIds.has(peliculaSeleccionada.id)}
          onToggleFavorito={() => toggleFavorito(peliculaSeleccionada.id)}
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

function MovieCard({ pelicula, esFavorita, onToggleFavorito, onVerDetalle }) {
  return (
    <div className={styles.movieCard} onClick={onVerDetalle}>
      {pelicula.poster
        ? <img src={pelicula.poster} alt={pelicula.title} className={styles.moviePoster} />
        : <div className={styles.posterPlaceholder} />
      }
      <div className={styles.movieInfo}>
        <div className={styles.movieTitle}>{pelicula.title}</div>
        <div className={styles.movieMeta}>{pelicula.anio} · {pelicula.genre}</div>
        <div className={styles.movieActions}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < pelicula.rating ? '★' : '☆'}</span>
            ))}
          </div>
          <button
            className={`${styles.favBtn} ${esFavorita ? styles.favBtnActive : ''}`}
            onClick={e => { e.stopPropagation(); onToggleFavorito() }}
            title={esFavorita ? 'Quitar de favoritas' : 'Agregar a favoritas'}
          >
            {esFavorita ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  )
}
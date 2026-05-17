import { useState, useEffect } from 'react'
import { Search, ChevronDown, X, Plus } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Busqueda.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import { GENEROS, ANIOS, ORDENAR } from './Busqueda.helpers.js'
import api from '@/lib/axios'
import ModalResena from '../../Components/ModalResena'
import ModalDetalle from '../../Components/ModalDetalle'

export default function Busqueda() {

  const [busqueda, setBusqueda] = useState('')
  const [filtroGenero, setFiltroGenero] = useState(null)
  const [filtroAnio, setFiltroAnio] = useState(null)
  const [filtroOrden, setFiltroOrden] = useState(null)
  const [dropdownAbierto, setDropdownAbierto] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [peliculas, setPeliculas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalResenaAbierto, setModalResenaAbierto] = useState(false)
  const [tieneSeisEstrellas, setTieneSeisEstrellas] = useState(false)

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

  function toggleFavorito(id) {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  function toggleDropdown(nombre) {
    setDropdownAbierto(prev => prev === nombre ? null : nombre)
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
        <TopBar username="Usuario" plan="Flicka PRO" />

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

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroGenero ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('genero')}
                >
                  {filtroGenero ?? 'Género'}
                  <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'genero' && (
                  <div className={styles.dropdownMenu}>
                    {GENEROS.map(g => (
                      <button
                        key={g}
                        className={`${styles.dropdownItem} ${filtroGenero === g ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroGenero(g); setDropdownAbierto(null) }}
                      >
                        {g}
                      </button>
                    ))}
                    {filtroGenero && (
                      <button className={styles.dropdownLimpiar} onClick={() => { setFiltroGenero(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroAnio ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('anio')}
                >
                  {filtroAnio ?? 'Año'}
                  <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'anio' && (
                  <div className={styles.dropdownMenu}>
                    {ANIOS.map(a => (
                      <button
                        key={a}
                        className={`${styles.dropdownItem} ${filtroAnio === a ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroAnio(a); setDropdownAbierto(null) }}
                      >
                        {a}
                      </button>
                    ))}
                    {filtroAnio && (
                      <button className={styles.dropdownLimpiar} onClick={() => { setFiltroAnio(null); setDropdownAbierto(null) }}>
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
                  {filtroOrden ?? 'Valoración'}
                  <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'orden' && (
                  <div className={styles.dropdownMenu}>
                    {ORDENAR.map(o => (
                      <button
                        key={o}
                        className={`${styles.dropdownItem} ${filtroOrden === o ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroOrden(o); setDropdownAbierto(null) }}
                      >
                        {o}
                      </button>
                    ))}
                    {filtroOrden && (
                      <button className={styles.dropdownLimpiar} onClick={() => { setFiltroOrden(null); setDropdownAbierto(null) }}>
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
              ? <div>Cargando...</div>
              : peliculas.length > 0
                ? peliculas.map(pelicula => (
                  <MovieCard
                    key={pelicula.id}
                    pelicula={pelicula}
                    esFavorita={favoritos.includes(pelicula.id)}
                    onToggleFavorito={toggleFavorito}
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
          esFavorita={favoritos.includes(peliculaSeleccionada.id)}
          onToggleFavorito={toggleFavorito}
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
        : <div className={styles.posterPlaceholder}>🎬</div>
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
            onClick={e => { e.stopPropagation(); onToggleFavorito(pelicula.id) }}
            title={esFavorita ? 'Quitar de favoritas' : 'Agregar a favoritas'}
          >
            {esFavorita ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Modal({ pelicula, esFavorita, onToggleFavorito, onCerrar, onAbrirResena }) {
  return (
    <>
      <div className={styles.modalOverlay} onClick={onCerrar} />
      <div className={styles.modal}>
        <button className={styles.modalCerrar} onClick={onCerrar}>
          <X size={18} />
        </button>
        <div className={styles.modalPoster}>
          {pelicula.poster
            ? <img src={pelicula.poster} alt={pelicula.title} className={styles.moviePoster} />
            : <div className={styles.modalPosterPlaceholder}>🎬</div>
          }
        </div>
        <div className={styles.modalInfo}>
          <div className={styles.modalSinopsisBox}>
            <h3 className={styles.modalSinopsisLabel}>Sinópsis</h3>
            <p className={styles.modalSinopsis}>{pelicula.synopsis}</p>
          </div>
          <div className={styles.modalMeta}>
            <h2 className={styles.modalTitulo}>{pelicula.title}</h2>
            <p className={styles.modalMetaLine}>{pelicula.anio} · {pelicula.genre}</p>
            <div className={styles.modalStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < pelicula.rating ? '★' : '☆'}</span>
              ))}
            </div>
          </div>
          <div className={styles.modalAcciones}>
            <button
              className={`${styles.modalFavBtn} ${esFavorita ? styles.modalFavBtnActive : ''}`}
              onClick={() => onToggleFavorito(pelicula.id)}
            >
              {esFavorita ? '♥' : '♡'}
            </button>
            <button className={styles.modalResenaBtn} onClick={onAbrirResena}>
              <Plus size={16} />
              Agregar reseña
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
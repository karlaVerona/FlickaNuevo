import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import ModalDetalle from '../../Components/ModalDetalle'
import ModalResena from '../../Components/ModalResena'
import styles from './Peliculas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import { scrollCarrusel, dragProps } from './Peliculas.helpers.js'
import api from '@/lib/axios'

const SECCIONES = [
  { key: 'recientes', titulo: '🎬 Agregadas recientemente' },
  { key: 'valoradas', titulo: '🏆 Las mejor valoradas' },
  { key: 'familia',   titulo: '👨‍👩‍👧 Modo familia activado' },
  { key: 'comedia',   titulo: '🎪 Noche de carcajadas' },
  { key: 'terror',    titulo: '😭 Las de terror...' },
  { key: 'romantica', titulo: '❤️ Mariposas en el estómago' },
  { key: 'miedo',     titulo: '😱 Si te atreves...' },
  { key: 'scifi',     titulo: '🚀 Fuera de este mundo' },
  { key: 'musical',   titulo: '🎵 A todo volumen' },
  { key: 'drama',     titulo: '🥀 Grandes historias' },
  { key: 'accion',    titulo: '⚡ Al filo del asiento' },
]

export default function Peliculas() {

  const [secciones,            setSecciones]            = useState({})
  const [cargando,             setCargando]             = useState(true)
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [modalResenaAbierto,   setModalResenaAbierto]   = useState(false)
  const [tieneSeisEstrellas,   setTieneSeisEstrellas]   = useState(false)
  const [favIds,               setFavIds]               = useState(new Set())
  const [favMap,               setFavMap]               = useState({})

  useEffect(() => {
    Promise.all([
      api.get('/movies/sections'),
      api.get('/favorites'),
    ])
      .then(([secRes, favRes]) => {
        setSecciones(secRes.data)
        const ids = new Set(favRes.data.favorites.map(f => f.movie_id))
        const map = {}
        favRes.data.favorites.forEach(f => { map[f.movie_id] = f.id })
        setFavIds(ids)
        setFavMap(map)
      })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

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
      .catch(() => {})
      .finally(() => setModalResenaAbierto(true))
  }

  if (cargando) return <div>Cargando...</div>

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="peliculas" />

      <div className={styles.mainColumn}>
        <TopBar />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Catálogo de películas</h1>
            <p className={styles.pageSubtitle}>Descubre una nueva historia</p>
          </div>

          {SECCIONES.map(seccion => {
            const peliculas = secciones[seccion.key]
            if (!peliculas || peliculas.length === 0) return null
            return (
              <Carrusel
                key={seccion.key}
                titulo={seccion.titulo}
                peliculas={peliculas}
                favIds={favIds}
                onToggleFavorito={toggleFavorito}
                onVerDetalle={setPeliculaSeleccionada}
              />
            )
          })}

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

function Carrusel({ titulo, peliculas, favIds, onToggleFavorito, onVerDetalle }) {
  const ref = useRef(null)
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{titulo}</h2>
      <div className={styles.carruselWrapper}>
        <button className={styles.flechaIzquierda} onClick={() => scrollCarrusel(ref, 'izquierda')}>
          <ChevronLeft size={18} />
        </button>
        <div className={styles.movieGrid} ref={ref} {...dragProps}>
          {peliculas.map(pelicula => (
            <MovieCard
              key={pelicula.id}
              pelicula={pelicula}
              esFavorita={favIds.has(pelicula.id)}
              onToggleFavorito={() => onToggleFavorito(pelicula.id)}
              onVerDetalle={() => onVerDetalle(pelicula)}
            />
          ))}
        </div>
        <button className={styles.flechaDerecha} onClick={() => scrollCarrusel(ref, 'derecha')}>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
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
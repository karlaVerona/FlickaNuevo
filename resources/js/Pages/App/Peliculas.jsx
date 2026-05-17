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

export default function Peliculas() {

  const [peliculas,            setPeliculas]            = useState([])
  const [cargando,             setCargando]             = useState(true)
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [modalResenaAbierto,   setModalResenaAbierto]   = useState(false)
  const [tieneSeisEstrellas,   setTieneSeisEstrellas]   = useState(false)
  // Set de movie_ids que el usuario tiene en favoritas
  const [favIds,               setFavIds]               = useState(new Set())
  // Mapa de movie_id → favorite.id (para poder hacer DELETE)
  const [favMap,               setFavMap]               = useState({})
  const carruselRecientes = useRef(null)
  const carruselValoradas = useRef(null)

  useEffect(() => {
    api.get('/movies')
      .then(res => setPeliculas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))

    // Carga favoritas al montar para marcar los corazones correctamente
    api.get('/favorites')
      .then(res => {
        const ids = new Set(res.data.favorites.map(f => f.movie_id))
        const map = {}
        res.data.favorites.forEach(f => { map[f.movie_id] = f.id })
        setFavIds(ids)
        setFavMap(map)
      })
      .catch(() => {})
  }, [])

  const peliculasValoradas = [...peliculas].sort((a, b) => b.rating - a.rating)

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
<<<<<<< Updated upstream
        <TopBar username="Usuario" plan="Flicka PRO" />
=======
        <TopBar />
>>>>>>> Stashed changes

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Catálogo de películas</h1>
            <p className={styles.pageSubtitle}>Descubre una nueva historia</p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Agregadas recientemente</h2>
            <div className={styles.carruselWrapper}>
              <button className={styles.flechaIzquierda} onClick={() => scrollCarrusel(carruselRecientes, 'izquierda')}>
                <ChevronLeft size={18} />
              </button>
              <div className={styles.movieGrid} ref={carruselRecientes} {...dragProps}>
                {peliculas.map(pelicula => (
                  <MovieCard
                    key={pelicula.id}
                    pelicula={pelicula}
                    esFavorita={favIds.has(pelicula.id)}
                    onToggleFavorito={() => toggleFavorito(pelicula.id)}
                    onVerDetalle={() => setPeliculaSeleccionada(pelicula)}
                  />
                ))}
              </div>
              <button className={styles.flechaDerecha} onClick={() => scrollCarrusel(carruselRecientes, 'derecha')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Las mejores valoradas</h2>
            <div className={styles.carruselWrapper}>
              <button className={styles.flechaIzquierda} onClick={() => scrollCarrusel(carruselValoradas, 'izquierda')}>
                <ChevronLeft size={18} />
              </button>
              <div className={styles.movieGrid} ref={carruselValoradas} {...dragProps}>
                {peliculasValoradas.map(pelicula => (
                  <MovieCard
                    key={pelicula.id}
                    pelicula={pelicula}
                    esFavorita={favIds.has(pelicula.id)}
                    onToggleFavorito={() => toggleFavorito(pelicula.id)}
                    onVerDetalle={() => setPeliculaSeleccionada(pelicula)}
                  />
                ))}
              </div>
              <button className={styles.flechaDerecha} onClick={() => scrollCarrusel(carruselValoradas, 'derecha')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </section>

        </main>
      </div>

      {/* Modal de detalle — reemplaza al Modal local que tenías antes */}
      {peliculaSeleccionada && (
        <ModalDetalle
          pelicula={peliculaSeleccionada}
          esFavorita={favIds.has(peliculaSeleccionada.id)}
          onToggleFavorito={() => toggleFavorito(peliculaSeleccionada.id)}
          onCerrar={() => setPeliculaSeleccionada(null)}
          onAbrirResena={abrirModalResena}
        />
      )}

      {/* Modal de reseña */}
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
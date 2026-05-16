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
  const [favoritos,            setFavoritos]            = useState([])
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const [cargando,             setCargando]             = useState(true)
  const [modalResenaAbierto,   setModalResenaAbierto]   = useState(false)
  const [tieneSeisEstrellas,   setTieneSeisEstrellas]   = useState(false)
  const carruselRecientes = useRef(null)
  const carruselValoradas = useRef(null)

  useEffect(() => {
    api.get('/movies')
      .then(res => setPeliculas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  const peliculasValoradas = [...peliculas].sort((a, b) => b.rating - a.rating)

  function toggleFavorito(id) {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
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
        {/* TopBar ya lee el usuario y plan desde localStorage — sin props */}
        <TopBar />

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
                    esFavorita={favoritos.includes(pelicula.id)}
                    onToggleFavorito={toggleFavorito}
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
                    esFavorita={favoritos.includes(pelicula.id)}
                    onToggleFavorito={toggleFavorito}
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

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Peliculas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import { scrollCarrusel, dragProps } from './Peliculas.helpers.js'

const MOCK_PELICULAS = [
  { id: 1, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.' },
  { id: 2, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 3, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 4, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 5, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 6, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 7, titulo: 'Título de la película', anio: 2026, genero: 'Género', rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
]

export default function Peliculas() {

  const [favoritos, setFavoritos] = useState([])
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null)
  const carruselRecientes = useRef(null)
  const carruselValoradas = useRef(null)

  function toggleFavorito(id) {
    setFavoritos(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="peliculas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

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
                {MOCK_PELICULAS.map(pelicula => (
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
                {MOCK_PELICULAS.map(pelicula => (
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
        <Modal
          pelicula={peliculaSeleccionada}
          esFavorita={favoritos.includes(peliculaSeleccionada.id)}
          onToggleFavorito={toggleFavorito}
          onCerrar={() => setPeliculaSeleccionada(null)}
        />
      )}

    </div>
  )
}

function MovieCard({ pelicula, esFavorita, onToggleFavorito, onVerDetalle }) {
  return (
    <div className={styles.movieCard} onClick={onVerDetalle}>

      <div className={styles.posterPlaceholder}>🎬</div>

      <div className={styles.movieInfo}>
        <div className={styles.movieTitle}>{pelicula.titulo}</div>
        <div className={styles.movieMeta}>{pelicula.anio} · {pelicula.genero}</div>

        <div className={styles.movieActions}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < pelicula.rating ? '★' : '☆'}</span>
            ))}
          </div>

          <button
            className={`${styles.favBtn} ${esFavorita ? styles.favBtnActive : ''}`}
            onClick={e => {
              e.stopPropagation()
              onToggleFavorito(pelicula.id)
            }}
            title={esFavorita ? 'Quitar de favoritas' : 'Agregar a favoritas'}
          >
            {esFavorita ? '♥' : '♡'}
          </button>
        </div>
      </div>

    </div>
  )
}

function Modal({ pelicula, esFavorita, onToggleFavorito, onCerrar }) {
  return (
    <>
      <div className={styles.modalOverlay} onClick={onCerrar} />

      <div className={styles.modal}>

        <button className={styles.modalCerrar} onClick={onCerrar}>
          <X size={18} />
        </button>

        <div className={styles.modalPoster}>
          <div className={styles.modalPosterPlaceholder}>🎬</div>
        </div>

        <div className={styles.modalInfo}>

          <div className={styles.modalSinopsisBox}>
            <h3 className={styles.modalSinopsisLabel}>Sinópsis</h3>
            <p className={styles.modalSinopsis}>{pelicula.sinopsis}</p>
          </div>

          <div className={styles.modalMeta}>
            <h2 className={styles.modalTitulo}>{pelicula.titulo}</h2>
            <p className={styles.modalMetaLine}>{pelicula.anio} · {pelicula.genero}</p>
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

            <button className={styles.modalResenaBtn}>
              <Plus size={16} />
              Agregar reseña
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
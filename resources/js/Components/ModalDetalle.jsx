import { X, Plus } from 'lucide-react'
import styles from './ModalDetalle.module.css'


export default function ModalDetalle({ pelicula, esFavorita, onToggleFavorito, onCerrar, onAbrirResena }) {
  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />

      <div className={styles.modal}>

        <button className={styles.cerrarBtn} onClick={onCerrar}>
          <X size={18} />
        </button>

        {/* Poster */}
        <div className={styles.poster}>
          {pelicula.poster
            ? <img src={pelicula.poster} alt={pelicula.title} className={styles.posterImg} />
            : <div className={styles.posterPlaceholder}>🎬</div>
          }
        </div>

        {/* Info */}
        <div className={styles.info}>

          <div className={styles.sinopsisBox}>
            <h3 className={styles.sinopsisLabel}>Sinópsis</h3>
            <p className={styles.sinopsis}>{pelicula.synopsis}</p>
          </div>

          <div className={styles.meta}>
            <h2 className={styles.titulo}>{pelicula.title}</h2>
            <p className={styles.metaLine}>{pelicula.anio} · {pelicula.genre}</p>
            {/*<div className={styles.stars}>
            {Array.from({ length: 6}).map((_, i) => (
              <span key={i}>{i < (pelicula?.rating ?? 0) ? '★' : '☆'}</span>
            ))}
          </div>*/}
          </div>

          <div className={styles.acciones}>
            <button
              className={`${styles.favBtn} ${esFavorita ? styles.favBtnActive : ''}`}
              onClick={() => onToggleFavorito(pelicula.id)}
            >
              {esFavorita ? '♥' : '♡'}
            </button>
            <button className={styles.resenaBtn} onClick={onAbrirResena}>
              <Plus size={16} />
              Agregar reseña
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
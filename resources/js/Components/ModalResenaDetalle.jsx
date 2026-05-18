import { useState } from 'react'
import { X, Pencil, Trash2 } from 'lucide-react'
import styles from './ModalResenaDetalle.module.css'
import ModalEditarResena from './ModalEditarResena'
import ModalEliminar from './ModalEliminar'

export default function ModalResenaDetalle({ resena, onCerrar, onEliminar, onActualizar, tieneSeisEstrellas }) {

  const [editarAbierto,   setEditarAbierto]   = useState(false)
  const [eliminarAbierto, setEliminarAbierto] = useState(false)

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />

      <div className={styles.modal}>

        <button className={styles.cerrarBtn} onClick={onCerrar}>
          <X size={18} />
        </button>

        {/* Poster */}
        <div className={styles.poster}>
          {resena.movie.poster
            ? <img src={resena.movie.poster} alt={resena.movie.title} className={styles.posterImg} />
            : <div className={styles.posterPlaceholder} />
          }
          <div className={styles.peliculaMeta}>
            <h2 className={styles.peliculaTitulo}>{resena.movie.title}</h2>
            <p className={styles.peliculaLinea}>{resena.movie.anio} · {resena.movie.genre}</p>
            <div className={styles.estrellas}>
              {Array.from({ length: resena.is_six_star ? 6 : 5 }).map((_, i) => (
                <span key={i}>{i < resena.rating ? '★' : '☆'}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className={styles.info}>

          <div className={styles.resenaBox}>
            <h3 className={styles.resenaLabel}>Reseña</h3>
            <p className={styles.resenaTexto}>{resena.review_text}</p>
          </div>

          <div className={styles.moodBox}>
            <span className={styles.moodLabel}>Estado de ánimo</span>
            <span className={styles.moodValor}>{resena.mood}</span>
          </div>

          <div className={styles.acciones}>
            <button className={styles.editarBtn} onClick={() => setEditarAbierto(true)}>
              <Pencil size={15} />
              Editar reseña
            </button>
            <button className={styles.eliminarBtn} onClick={() => setEliminarAbierto(true)}>
              <Trash2 size={15} />
              Eliminar reseña
            </button>
          </div>

        </div>
      </div>

      {/* Modal de editar */}
      {editarAbierto && (
        <ModalEditarResena
          resena={resena}
          tieneSeisEstrellas={tieneSeisEstrellas}
          onCerrar={() => setEditarAbierto(false)}
          onExito={(resenaActualizada) => {
    onActualizar?.(resenaActualizada)
    setEditarAbierto(false)
}}
        />
      )}

      {/* Modal de confirmar eliminación */}
      {eliminarAbierto && (
        <ModalEliminar
          onCancelar={() => setEliminarAbierto(false)}
          onAceptar={() => {
            setEliminarAbierto(false)
            onEliminar(resena.id)  // ejecuta la eliminación y cierra todo desde el padre
          }}
        />
      )}
    </>
  )
}
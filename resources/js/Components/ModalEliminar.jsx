import { AlertTriangle } from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './ModalEliminar.module.css'

/*
  Props:
    - onAceptar: cierra todo y ejecuta la eliminación
    - onCancelar: cierra solo este modal
*/
export default function ModalEliminar({ onAceptar, onCancelar }) {
  return createPortal(
    <>
      <div className={styles.overlay} onClick={onCancelar} />

      <div className={styles.wrapper}>

        <div className={styles.iconWrapper}>
          <AlertTriangle size={40} className={styles.icon} />
        </div>

        <div className={styles.modal}>
          <h2 className={styles.titulo}>Eliminar reseña</h2>
          <p className={styles.subtitulo}>¿Estás seguro? Esta acción no se puede deshacer</p>
          <div className={styles.botones}>
            <button className={styles.cancelarBtn} onClick={onCancelar}>
              Cancelar
            </button>
            <button className={styles.aceptarBtn} onClick={onAceptar}>
              Sí, eliminar
            </button>
          </div>
        </div>

      </div>
    </>,
    document.body
  )
}
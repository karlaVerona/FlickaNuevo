import { CheckCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './Modalwarning.module.css'

export default function ModalExito({ onAceptar }) {
  return createPortal(
    <>
      <div className={styles.overlay} />

      <div className={styles.wrapper}>

        <div className={styles.iconWrapper}>
          <message-circle-warning size={40} className={styles.icon} />
        </div>

        {/* Panel blanco */}
        <div className={styles.modal}>
          <h2 className={styles.titulo}>Alerta</h2>
          <p className={styles.subtitulo}>Esta película ya cuenta con una reseña</p>
          <button className={styles.aceptarBtn} onClick={onAceptar}>
            Aceptar
          </button>
        </div>

      </div>
    </>,
    document.body
  )
}
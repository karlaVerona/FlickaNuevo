import { CheckCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './ModalExito.module.css'

export default function ModalExito({ onAceptar }) {
  return createPortal(
    <>
      <div className={styles.overlay} />

      <div className={styles.wrapper}>

        {/* Círculo con palomita — sobresale hacia arriba con position absolute */}
        <div className={styles.iconWrapper}>
          <CheckCircle size={40} className={styles.icon} />
        </div>

        {/* Panel blanco */}
        <div className={styles.modal}>
          <h2 className={styles.titulo}>Creada</h2>
          <p className={styles.subtitulo}>La reseña se añadió a tu perfil</p>
          <button className={styles.aceptarBtn} onClick={onAceptar}>
            Aceptar
          </button>
        </div>

      </div>
    </>,
    document.body
  )
}
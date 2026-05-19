import { Star } from 'lucide-react'
import { createPortal } from 'react-dom'
import styles from './ModalPro.module.css'

/*
  Props:
    - onAceptar: cierra todo y ejecuta la eliminación
    - onCancelar: cierra solo este modal
*/
export default function ModalEliminar({onAceptar}) {
  return createPortal(
    <>
    <div className={styles.overlay} />

      <div className={styles.wrapper}>

        <div className={styles.iconWrapper}>
          <Star size={40} className={styles.icon} fill="currentColor" />
        </div>

        <div className={styles.modal}>
          <h2 className={styles.titulo}>Función pro</h2>
          <p className={styles.subtitulo}>Para accerder a esta y más funciones cambiate a pro</p>
          <div className={styles.botones}>

            <button className={styles.aceptarBtn} onClick={onAceptar}>
              Aceptar
            </button>
          </div>
        </div>

      </div>
    </>,
    document.body
  )
}
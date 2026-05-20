import { X, Star } from 'lucide-react'
import { router } from '@inertiajs/react'
import styles from './ModalUpgradePro.module.css'

export default function ModalUpgradePro({ onCerrar, mensaje }) {
  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />
      <div className={styles.modal}>
        <button className={styles.cerrarBtn} onClick={onCerrar}>
          <X size={18} />
        </button>

        <div className={styles.estrella}>
          <Star size={40} fill="currentColor" />
        </div>

        <h2 className={styles.titulo}>Función PRO</h2>
        <p className={styles.mensaje}>
          {mensaje ?? 'Esta función está disponible únicamente para usuarios PRO.'}
        </p>

        <button
          className={styles.btnPro}
          onClick={() => router.visit('/suscripcion')}
        >
          ✨ Hazte PRO
        </button>

        <button className={styles.btnCancelar} onClick={onCerrar}>
          Ahora no
        </button>
      </div>
    </>
  )
}
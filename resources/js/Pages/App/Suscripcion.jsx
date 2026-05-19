import { useState } from 'react'
import { Trash2, Plus, Check, X } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Suscripcion.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'

const BENEFICIOS_GRATUITO = [
  'Reseñas ilimitadas',
  'Máximo 6 listas',
  'Sin acceso a sección "Favoritos"',
  'Sin acceso a estadísticas del perfil',
  'Calificación más alta de 5 estrellas',
  'Sin tarjeta mensual personalizada',
]

const BENEFICIOS_PRO = [
  'Reseñas ilimitadas',
  'Listas ilimitadas',
  'Acceso a sección "Favoritos"',
  'Acceso a estadísticas del perfil',
  'Calificación más alta de 6 estrellas',
  'Tarjeta mensual personalizada',
]

export default function Suscripcion() {

  const user   = JSON.parse(localStorage.getItem('user') || '{}')
  const isPro  = user.is_pro === true || user.is_pro === 1

  const [cancelando, setCancelando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)

  function handleCancelar() {
    setConfirmando(true)
  }

  function handleConfirmarCancelar() {
    setCancelando(true)
    // mockup — aquí iría la llamada a la API
    setTimeout(() => {
      setCancelando(false)
      setConfirmando(false)
    }, 1500)
  }

  return (
    <div className={styles.page}>
      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="suscripcion" />

      <div className={styles.mainColumn}>
        <TopBar />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Suscripción</h1>
            <p className={styles.pageSubtitle}>Se parte de nuestra comunidad</p>
          </div>

          {/* ── Estado actual ── */}
          {isPro && (
            <div className={styles.estadoCard}>
              <div className={styles.estadoFila}>
                <span className={styles.estadoLabel}>Estatus:</span>
                <span className={styles.estadoActivo}>
                  <span className={styles.estadoDot} />
                  Activo
                </span>
              </div>
              <div className={styles.estadoFila}>
                <span className={styles.estadoLabel}>Próximo cobro:</span>
                <span className={styles.estadoValor}>06 de abril de 2026</span>
              </div>

              {!confirmando
                ? (
                  <button className={styles.cancelarBtn} onClick={handleCancelar}>
                    <Trash2 size={15} />
                    Cancelar suscripción
                  </button>
                )
                : (
                  <div className={styles.confirmBox}>
                    <p className={styles.confirmTexto}>
                      ¿Estás seguro? Perderás acceso a todas las funciones PRO al final del período.
                    </p>
                    <div className={styles.confirmBtns}>
                      <button
                        className={styles.confirmNo}
                        onClick={() => setConfirmando(false)}
                      >
                        <X size={14} /> No, conservar
                      </button>
                      <button
                        className={styles.confirmSi}
                        onClick={handleConfirmarCancelar}
                        disabled={cancelando}
                      >
                        <Trash2 size={14} />
                        {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
                      </button>
                    </div>
                  </div>
                )
              }
            </div>
          )}

          {/* ── Comparativa de planes ── */}
          <h2 className={styles.seccionTitulo}>Beneficios de Flicka PRO</h2>

          <div className={styles.planesGrid}>

            {/* Plan gratuito */}
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planNombre}>Plan gratuito</span>
              </div>
              <div className={styles.planDivider} />
              <ul className={styles.planLista}>
                {BENEFICIOS_GRATUITO.map((b, i) => (
                  <li key={i} className={styles.planItem}>
                    {b.startsWith('Sin') || b.includes('Máximo')
                      ? <X size={14} className={styles.itemX} />
                      : <Check size={14} className={styles.itemCheck} />
                    }
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan PRO */}
            <div className={`${styles.planCard} ${styles.planCardPro}`}>
              <div className={styles.planHeader}>
                <span className={styles.planNombre}>Flicka PRO</span>
              </div>
              <div className={styles.planDivider} />
              <ul className={styles.planLista}>
                {BENEFICIOS_PRO.map((b, i) => (
                  <li key={i} className={styles.planItem}>
                    <Check size={14} className={styles.itemCheck} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── CTA para no PRO ── */}
          {!isPro && (
            <div className={styles.ctaSection}>
              <p className={styles.ctaTexto}>¿Aún no eres PRO?</p>
              <button className={styles.ctaBtn}>
                <Plus size={16} />
                Obtener suscripción
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
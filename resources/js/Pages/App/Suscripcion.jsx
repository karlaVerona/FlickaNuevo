import { useState, useEffect } from 'react'
import { Trash2, Plus, Check, X } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Suscripcion.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'

const BENEFICIOS_GRATUITO = [
  'Reseñas ilimitadas',
  'Máximo 3 listas',
  'Sin acceso a sección "Favoritos"',
  'Sin acceso a estadísticas del perfil',
  'Calificación más alta de 5 estrellas',
]

const BENEFICIOS_PRO = [
  'Reseñas ilimitadas',
  'Listas ilimitadas',
  'Acceso a sección "Favoritos"',
  'Acceso a estadísticas del perfil',
  'Calificación más alta de 6 estrellas',
]

export default function Suscripcion() {

  const [user,        setUser]        = useState(() => JSON.parse(localStorage.getItem('user') || '{}'))
  const isPro = user.is_pro === true || user.is_pro === 1

  const [subscription,  setSubscription]  = useState(null)
  const [cancelando,    setCancelando]    = useState(false)
  const [confirmando,   setConfirmando]   = useState(false)
  const [suscribiendo,  setSuscribiendo]  = useState(false)
  const [planElegido,   setPlanElegido]   = useState(null)
  const [exito,         setExito]         = useState(null)
  const [error,         setError]         = useState(null)

  useEffect(() => {
    api.get('/subscription')
      .then(res => setSubscription(res.data.subscription))
      .catch(() => {})
  }, [])

  async function handleSuscribirse(plan) {
    setSuscribiendo(true)
    setError(null)
    try {
      const res = await api.post('/subscription', { plan })
      const updatedUser = res.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setExito(`¡Bienvenido a Flicka PRO! Revisa tu correo para ver el comprobante.`)
      setPlanElegido(null)
      api.get('/subscription').then(r => setSubscription(r.data.subscription))
    } catch (err) {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setSuscribiendo(false)
    }
  }

  async function handleConfirmarCancelar() {
    setCancelando(true)
    setError(null)
    try {
      const res = await api.delete('/subscription')
      const updatedUser = res.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSubscription(null)
      setConfirmando(false)
      setExito('Suscripción cancelada. Tu cuenta ha vuelto al plan gratuito.')
    } catch (err) {
      setError('Ocurrió un error al cancelar. Intenta de nuevo.')
    } finally {
      setCancelando(false)
    }
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
            <p className={styles.pageSubtitle}>Sé parte de nuestra comunidad</p>
          </div>

          {/* ── Mensaje de éxito ── */}
          {exito && (
            <div className={styles.mensajeExito}>
              <Check size={16} />
              {exito}
              <button onClick={() => setExito(null)}><X size={14} /></button>
            </div>
          )}

          {/* ── Mensaje de error ── */}
          {error && (
            <div className={styles.mensajeError}>
              <X size={16} />
              {error}
              <button onClick={() => setError(null)}><X size={14} /></button>
            </div>
          )}

          {/* ── Estado actual PRO ── */}
          {isPro && (
            <div className={styles.estadoCard}>
              <div className={styles.estadoFila}>
                <span className={styles.estadoLabel}>Estatus:</span>
                <span className={styles.estadoActivo}>
                  <span className={styles.estadoDot} />
                  Activo
                </span>
              </div>
              {subscription && (
                <>
                  <div className={styles.estadoFila}>
                    <span className={styles.estadoLabel}>Plan:</span>
                    <span className={styles.estadoValor}>{subscription.plan === 'mensual' ? 'Mensual' : 'Anual'}</span>
                  </div>
                  <div className={styles.estadoFila}>
                    <span className={styles.estadoLabel}>Próximo cobro:</span>
                    <span className={styles.estadoValor}>
                      {new Date(subscription.end_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </>
              )}

              {!confirmando
                ? (
                  <button className={styles.cancelarBtn} onClick={() => setConfirmando(true)}>
                    <Trash2 size={15} />
                    Cancelar suscripción
                  </button>
                )
                : (
                  <div className={styles.confirmBox}>
                    <p className={styles.confirmTexto}>
                      ¿Estás seguro? Perderás acceso a todas las funciones PRO.
                    </p>
                    <div className={styles.confirmBtns}>
                      <button className={styles.confirmNo} onClick={() => setConfirmando(false)}>
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

              {!planElegido
                ? (
                  <div className={styles.planesBtn}>
                    <button
                      className={styles.ctaBtn}
                      onClick={() => setPlanElegido('mensual')}
                    >
                      <Plus size={16} />
                      Plan mensual — $1 MXN
                    </button>
                    <button
                      className={`${styles.ctaBtn} ${styles.ctaBtnAnual}`}
                      onClick={() => setPlanElegido('anual')}
                    >
                      <Plus size={16} />
                      Plan anual — $10 MXN
                    </button>
                  </div>
                )
                : (
                  <div className={styles.confirmBox}>
                    <p className={styles.confirmTexto}>
                      ¿Confirmas tu suscripción al plan <strong>{planElegido}</strong>?
                      Recibirás un comprobante en tu correo.
                    </p>
                    <div className={styles.confirmBtns}>
                      <button
                        className={styles.confirmNo}
                        onClick={() => setPlanElegido(null)}
                      >
                        <X size={14} /> Cancelar
                      </button>
                      <button
                        className={styles.confirmSi}
                        onClick={() => handleSuscribirse(planElegido)}
                        disabled={suscribiendo}
                      >
                        <Check size={14} />
                        {suscribiendo ? 'Procesando...' : 'Confirmar'}
                      </button>
                    </div>
                  </div>
                )
              }
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
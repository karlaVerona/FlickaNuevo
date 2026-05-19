import { useState } from 'react'
import { X } from 'lucide-react'
import api from '@/lib/axios'
import styles from './ModalResena.module.css'
import { MOODS, validarResena } from './Modalresena.helpers.js'
import ModalExito from './ModalExito'

export default function ModalEditarResena({ resena, onCerrar, onExito, tieneSeisEstrellas }) {

  const user  = JSON.parse(localStorage.getItem('user') || '{}')
  const isPro = user.is_pro === true || user.is_pro === 1

  const [form, setForm] = useState({
    rating:      resena.rating,
    review_text: resena.review_text,
    mood:        resena.mood,
  })

  const [errores,           setErrores]           = useState({})
  const [enviando,          setEnviando]           = useState(false)
  const [alertaSeis,        setAlertaSeis]         = useState(false)
  const [exitoVisible,      setExitoVisible]       = useState(false)
  const [hoverRating,       setHoverRating]        = useState(0)
  const [resenaActualizada, setResenaActualizada]  = useState(null)

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: null }))
  }

  function handleStarClick(valor) {
    if (valor === 6 && !isPro) {
      setAlertaSeis(true)
      return
    }
    if (valor === 6 && tieneSeisEstrellas && !resena.is_six_star) {
      setAlertaSeis(true)
      return
    }
    setAlertaSeis(false)
    handleChange('rating', valor)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const erroresValidacion = validarResena(form)
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setEnviando(true)

    try {
      const response = await api.put(`/reviews/${resena.id}`, {
        rating:      form.rating,
        review_text: form.review_text,
        mood:        form.mood,
        is_six_star: form.rating === 6,
      })

      setResenaActualizada(response.data.review)
      setExitoVisible(true)

    } catch (error) {
      if (error.response?.status === 422) {
        setErrores(error.response.data.errors ?? {})
      } else if (error.response?.status === 403) {
        setAlertaSeis(true)
      } else {
        setErrores({ general: 'Ocurrió un error. Intenta de nuevo.' })
      }
    } finally {
      setEnviando(false)
    }
  }

  const estrellaActiva = hoverRating || form.rating

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />

      <div className={styles.modal}>

        <div className={styles.header}>
          <div>
            <h2 className={styles.titulo}>Editar reseña</h2>
            <p className={styles.subtitulo}>{resena.movie.title}</p>
          </div>
          <button className={styles.cerrarBtn} onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {alertaSeis && (
            <div className={styles.alertaSeis}>
              {!isPro
                ? 'La calificación de 6 estrellas es exclusiva del plan PRO'
                : 'Solo se permite una reseña de 6 estrellas en el perfil'
              }
            </div>
          )}

          {errores.general && (
            <div className={styles.errorGeneral}>{errores.general}</div>
          )}

          {/* Calificación */}
          <div className={styles.campo}>
            <label className={styles.label}>Calificación</label>
            <div className={styles.estrellas}>
              {Array.from({ length: 6 }).map((_, i) => {
                const valor    = i + 1
                const activa   = valor <= estrellaActiva
                const esSeis   = valor === 6
                const bloqueada = esSeis && !isPro
                return (
                  <button
                    key={valor}
                    type="button"
                    className={`
                      ${styles.estrella}
                      ${activa    ? styles.estrellaActiva        : ''}
                      ${esSeis    ? styles.estrellaSeis          : ''}
                      ${bloqueada ? styles.estrellaDeshabilitada : ''}
                    `}
                    onClick={() => handleStarClick(valor)}
                    onMouseEnter={() => !bloqueada && setHoverRating(valor)}
                    onMouseLeave={() => setHoverRating(0)}
                    title={
                      bloqueada
                        ? 'Exclusivo PRO'
                        : esSeis
                          ? 'Reseña destacada de 6 estrellas'
                          : `${valor} estrellas`
                    }
                  >
                    ★
                  </button>
                )
              })}
              {form.rating > 0 && (
                <span className={styles.ratingLabel}>
                  {form.rating === 6 ? '6 — Reseña destacada' : `${form.rating} / 5`}
                </span>
              )}
            </div>
            {errores.rating && <span className={styles.error}>{errores.rating}</span>}
          </div>

          {/* Mood */}
          <div className={styles.campo}>
            <label className={styles.label}>Mood</label>
            <div className={styles.moodGrid}>
              {MOODS.map(mood => (
                <button
                  key={mood}
                  type="button"
                  className={`${styles.moodChip} ${form.mood === mood ? styles.moodChipActivo : ''}`}
                  onClick={() => handleChange('mood', mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
            {errores.mood && <span className={styles.error}>{errores.mood}</span>}
          </div>

          {/* Texto */}
          <div className={styles.campo}>
            <label className={styles.label}>Tu reseña</label>
            <textarea
              className={styles.textarea}
              placeholder="¿Qué te pareció la película?"
              value={form.review_text}
              onChange={e => handleChange('review_text', e.target.value)}
              rows={5}
            />
            <span className={styles.contador}>{form.review_text.length} caracteres</span>
            {errores.review_text && <span className={styles.error}>{errores.review_text}</span>}
          </div>

          <div className={styles.botones}>
            <button type="button" className={styles.cancelarBtn} onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className={styles.guardarBtn} disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

        </form>
      </div>

      {exitoVisible && (
        <ModalExito
          onAceptar={() => {
            setExitoVisible(false)
            onExito?.(resenaActualizada)
          }}
        />
      )}
    </>
  )
}
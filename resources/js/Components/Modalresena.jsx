import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import api from '@/lib/axios'
import styles from './ModalResena.module.css'
import { MOODS, validarResena } from './ModalResena.helpers.js'
import ModalExito from './ModalExito'

export default function ModalResena({ pelicula, onCerrar, onExito, tieneSeisEstrellas }) {

  const [form, setForm] = useState({
    rating:      0,
    review_text: '',
    mood:        '',
  })

  const [errores,      setErrores]      = useState({})
  const [enviando,     setEnviando]     = useState(false)
  const [alertaSeis,   setAlertaSeis]   = useState(false)
  const [exitoVisible, setExitoVisible] = useState(false)
  const [hoverRating,  setHoverRating]  = useState(0)

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }))
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: null }))
  }

  function handleStarClick(valor) {
    if (valor === 6 && tieneSeisEstrellas) {
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
      await api.post('/reviews', {
        movie_id:    pelicula.id,
        rating:      form.rating,
        review_text: form.review_text,
        mood:        form.mood,
        is_six_star: form.rating === 6,
      })

      // Muestra el modal de éxito en lugar de cerrar directamente
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
            <h2 className={styles.titulo}>Agregar reseña</h2>
            <p className={styles.subtitulo}>{pelicula.title ?? pelicula.titulo}</p>
          </div>
          <button className={styles.cerrarBtn} onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {alertaSeis && (
            <div className={styles.alertaSeis}>
              Solo se permite una reseña de 6 estrellas en el perfil
            </div>
          )}

          {errores.general && (
            <div className={styles.errorGeneral}>{errores.general}</div>
          )}

          <div className={styles.campo}>
            <label className={styles.label}>Calificación</label>
            <div className={styles.estrellas}>
              {Array.from({ length: 6 }).map((_, i) => {
                const valor = i + 1
                const activa = valor <= estrellaActiva
                const esSeis = valor === 6
                return (
                  <button
                    key={valor}
                    type="button"
                    className={`${styles.estrella} ${activa ? styles.estrellaActiva : ''} ${esSeis ? styles.estrellaSeis : ''}`}
                    onClick={() => handleStarClick(valor)}
                    onMouseEnter={() => setHoverRating(valor)}
                    onMouseLeave={() => setHoverRating(0)}
                    title={esSeis ? 'Reseña destacada de 6 estrellas (solo una en tu perfil)' : `${valor} estrellas`}
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
              {enviando ? 'Guardando...' : 'Guardar reseña'}
            </button>
          </div>

        </form>
      </div>

      {/*
        createPortal renderiza el ModalExito directamente en el <body>,
        completamente fuera del árbol del ModalResena.
        Esto evita que el z-index del padre lo atrape.
      */}
      {exitoVisible && createPortal(
        <ModalExito
          onAceptar={() => {
            setExitoVisible(false)
            onExito?.()
            onCerrar()
          }}
        />,
        document.body
      )}
    </>
  )
}
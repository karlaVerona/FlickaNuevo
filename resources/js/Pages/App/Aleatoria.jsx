import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Aleatoria.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'
import ModalResena from '../../Components/ModalResena'
import ModalPro from '../../Components/ModalPro'

export default function Aleatoria() {

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isPro = user.is_pro === true || user.is_pro === 1

  const [pelicula, setPelicula] = useState(null)
  const [girando, setGirando] = useState(false)
  const [esFavorita, setEsFavorita] = useState(false)
  const [modalResenaAbierto, setModalResenaAbierto] = useState(false)
  const [tieneSeisEstrellas, setTieneSeisEstrellas] = useState(false)
  const [modalPro, setModalPro] = useState(false)
  const audioRef = useRef(null)

  function lanzarDado() {
    if (girando) return
    setGirando(true)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => { })
    }
    setTimeout(() => {
      api.get('/movies/random')
        .then(res => {
          const peli = res.data
          setPelicula(peli)
          if (isPro) {
            api.get('/favorites')
              .then(r => {
                const ids = r.data.favorites.map(f => f.movie_id)
                setEsFavorita(ids.includes(peli.id))
              })
              .catch(() => setEsFavorita(false))
          }
        })
        .catch(err => console.error(err))
        .finally(() => setGirando(false))
    }, 800)
  }

  function toggleFavorito() {
    if (!isPro) { setModalPro(true); return }
    if (!pelicula) return
    if (esFavorita) {
      api.get('/favorites')
        .then(r => {
          const fav = r.data.favorites.find(f => f.movie_id === pelicula.id)
          if (fav) {
            api.delete(`/favorites/${fav.id}`)
              .then(() => setEsFavorita(false))
              .catch(err => console.error(err))
          }
        })
    } else {
      api.post('/favorites', { movie_id: pelicula.id })
        .then(() => setEsFavorita(true))
        .catch(err => console.error(err))
    }
  }

  function abrirModalResena() {
    api.get('/my-reviews')
      .then(res => {
        setTieneSeisEstrellas(res.data.some(r => r.is_six_star))
        setModalResenaAbierto(true)
      })
      .catch(() => setModalResenaAbierto(true))
  }

  return (
    <div className={styles.page}>
      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="aleatoria" />

      <div className={styles.mainColumn}>
        <TopBar />
        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Selección aleatoria</h1>
            <p className={styles.pageSubtitle}>¿No sabes qué ver? Nosotros te ayudamos</p>
          </div>

          <div className={styles.layout}>

            <div className={styles.dadoPanel}>
              <button
                className={`${styles.dadoBtn} ${girando ? styles.dadoGirando : ''}`}
                onClick={lanzarDado}
                disabled={girando}
                title="Lanzar dado"
              >
                <svg viewBox="0 0 100 100" className={styles.dadoSvg}>
                  <rect x="8" y="8" width="84" height="84" rx="14" ry="14"
                    fill="#3d1a0a" stroke="#c9a84c" strokeWidth="2.5" />
                  <circle cx="30" cy="30" r="7" fill="#c9a84c" />
                  <circle cx="70" cy="30" r="7" fill="#c9a84c" />
                  <circle cx="50" cy="50" r="7" fill="#c9a84c" />
                  <circle cx="30" cy="70" r="7" fill="#c9a84c" />
                  <circle cx="70" cy="70" r="7" fill="#c9a84c" />
                </svg>
              </button>
              <p className={styles.dadoHint}>
                {pelicula
                  ? '¿No es de tu interés? Presiona nuevamente para descubrir otra película'
                  : 'Presiona el dado para descubrir una película'}
              </p>
            </div>

            {pelicula && (
              <div className={styles.resultadoPanel}>
                <div className={styles.poster}>
                  {pelicula.poster
                    ? <img src={pelicula.poster} alt={pelicula.title} className={styles.posterImg} />
                    : <div className={styles.posterPlaceholder} />
                  }
                  <h2 className={styles.peliculaTitulo}>{pelicula.title}</h2>
                  <p className={styles.peliculaMeta}>{pelicula.anio} · {pelicula.genre}</p>
                  {/*<div className={styles.stars}>
            {Array.from({ length: 6}).map((_, i) => (
              <span key={i}>{i < (pelicula?.rating ?? 0) ? '★' : '☆'}</span>
            ))}
          </div>*/}
                </div>

                <div className={styles.sinopsisPanel}>
                  <div className={styles.sinopsisBox}>
                    <h3 className={styles.sinopsisLabel}>Sinópsis</h3>
                    <p className={styles.sinopsisTexto}>{pelicula.synopsis}</p>
                  </div>
                  <div className={styles.acciones}>
                    <button
                      className={`${styles.favBtn} ${esFavorita ? styles.favBtnActive : ''} ${!isPro ? styles.favBtnBloqueado : ''}`}
                      onClick={toggleFavorito}
                      title={!isPro ? 'Exclusivo PRO' : esFavorita ? 'Quitar de favoritas' : 'Agregar a favoritas'}
                    >
                      {esFavorita ? '♥' : '♡'}
                    </button>
                    <button className={styles.resenaBtn} onClick={abrirModalResena}>
                      <Plus size={16} />
                      Agregar reseña
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      <audio ref={audioRef} src="/sounds/dado.mp3" preload="auto" />

      {modalResenaAbierto && pelicula && (
        <ModalResena
          pelicula={pelicula}
          tieneSeisEstrellas={tieneSeisEstrellas}
          onCerrar={() => setModalResenaAbierto(false)}
          onExito={() => setModalResenaAbierto(false)}
        />
      )}

      {modalPro && (
        <ModalPro
          onAceptar={() => setModalPro(false)}
        />
      )}
    </div>
  )
}
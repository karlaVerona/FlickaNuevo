import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Aleatoria.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'

export default function Aleatoria() {

  const [pelicula,    setPelicula]    = useState(null)
  const [girando,     setGirando]     = useState(false)
  const [favoritos,   setFavoritos]   = useState([])
  const audioRef = useRef(null)

  function toggleFavorito(id) {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  function lanzarDado() {
    if (girando) return

    setGirando(true)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }

    setTimeout(() => {
      api.get('/movies/random')
        .then(res => setPelicula(res.data))
        .catch(err => console.error(err))
        .finally(() => setGirando(false))
    }, 800)
  }

  const esFavorita = pelicula ? favoritos.includes(pelicula.id) : false

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="aleatoria" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

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
                    : <div className={styles.posterPlaceholder}>🎬</div>
                  }
                  <h2 className={styles.peliculaTitulo}>{pelicula.title}</h2>
                  <p className={styles.peliculaMeta}>{pelicula.anio} · {pelicula.genre}</p>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < pelicula.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.sinopsisPanel}>
                  <div className={styles.sinopsisBox}>
                    <h3 className={styles.sinopsisLabel}>Sinópsis</h3>
                    <p className={styles.sinopsisTexto}>{pelicula.synopsis}</p>
                  </div>

                  <div className={styles.acciones}>
                    <button
                      className={`${styles.favBtn} ${esFavorita ? styles.favBtnActive : ''}`}
                      onClick={() => toggleFavorito(pelicula.id)}
                    >
                      {esFavorita ? '♥' : '♡'}
                    </button>

                    <button className={styles.resenaBtn}>
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

    </div>
  )
}
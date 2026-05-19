import { useState, useEffect } from 'react'
import { Smile } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Perfil.module.css'
import api from '@/lib/axios'

const GENERO_ICONOS = {
  'Acción':         '⚔️',
  'Aventura':       '🗺️',
  'Animación':      '🎨',
  'Comedia':        '😂',
  'Crimen':         '🔪',
  'Documental':     '🎥',
  'Drama':          '🎭',
  'Fantasía':       '🧙',
  'Historia':       '📜',
  'Horror':         '👻',
  'Música':         '🎵',
  'Misterio':       '🔍',
  'Romance':        '❤️',
  'Ciencia Ficción':'🚀',
  'Suspenso':       '😰',
  'Terror':         '🕷️',
  'Bélica':         '🪖',
  'Western':        '🤠',
  'Familiar':       '👨‍👩‍👧',
  'Ficción':        '📖',
}

const GENERO_COLORES = ['#c9a84c', '#8b1a1a', '#4a6a8a']

export default function Perfil() {

  const [user,     setUser]     = useState(null)
  const [generos,  setGeneros]  = useState([])
  const [sixStar,  setSixStar]  = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(userLocal)

    Promise.all([
      api.get('/profile/genres'),
      api.get('/my-reviews', { params: { six_star: true } }),
      api.get('/profile'),
    ])
      .then(([genRes, reviewRes, profileRes]) => {
        setGeneros(genRes.data)
        const reviews = Array.isArray(reviewRes.data)
          ? reviewRes.data
          : reviewRes.data.reviews ?? []
        setSixStar(reviews[0] ?? null)
        setUser(profileRes.data)
      })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  function getInitials(name) {
    return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  // ── Estado de carga dentro del layout ──
  if (cargando || !user) return (
    <div className={styles.page}>
      <Sidebar active="perfil" />
      <div className={styles.mainColumn}>
        <TopBar />
        <main className={styles.content}>
          <div className={styles.cargando}>Cargando perfil...</div>
        </main>
      </div>
    </div>
  )

  const isPro  = user.is_pro === true || user.is_pro === 1
  const color  = user.color  ?? '#8b1a1a'
  const banner = user.banner ?? null
  const photo  = user.photo  ?? null

  return (
    <div className={styles.page}>
      <Sidebar active="perfil" />

      <div className={styles.mainColumn}>
        <TopBar />

        <main className={styles.content}>

          <div className={styles.heroBanner}>
            <div className={styles.bannerImg}>
              {banner
                ? <img src={banner} alt="banner" className={styles.bannerFoto} />
                : <div className={styles.bannerPlaceholder} />
              }
            </div>

            <div className={styles.avatarArea}>
              <div className={styles.avatarWrapper}>
                {photo
                  ? <img src={photo} alt={user.username} className={styles.avatarFoto} />
                  : <div className={styles.avatarInitials}>{getInitials(user.username)}</div>
                }
                <div className={`${styles.planPlaca} ${isPro ? styles.planPlacaPro : styles.planPlacaFree}`}>
                  {isPro ? 'PRO' : 'Gratis'}
                </div>
              </div>

              <div className={styles.infoBox} style={{ background: color }}>
                <span className={styles.infoNombre}>{user.username}</span>
                {user.bio && <p className={styles.infoBio}>{user.bio}</p>}
              </div>
            </div>
          </div>

          <div className={styles.gridContenido}>

            <section className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Tus géneros favoritos</h2>
              <div className={styles.generosRow}>
                {generos.length > 0
                  ? generos.map((g, i) => (
                    <div
                      key={g.id}
                      className={styles.generoCard}
                      style={{ background: GENERO_COLORES[i] ?? '#6b4a2a' }}
                    >
                      <div className={styles.generoIconoCirculo}>
                        <span className={styles.generoEmoji}>
                          {GENERO_ICONOS[g.genre] ?? '🎬'}
                        </span>
                      </div>
                      <span className={styles.generoNombre}>{g.genre}</span>
                    </div>
                  ))
                  : (
                    <p className={styles.vacioPequeno}>
                      No hay géneros favoritos — configúralos en tu perfil
                    </p>
                  )
                }
              </div>
            </section>

            <div className={styles.filaInferior}>

              <section className={`${styles.seccion} ${styles.clubSeccion}`}>
                <h2 className={styles.seccionTitulo}>El club al que perteneces</h2>
                <div className={styles.clubCard}>
                  <div className={styles.clubImgWrapper}>
                    <div className={styles.clubImgPlaceholder} />
                  </div>
                  <div className={styles.clubInfo}>
                    <span className={styles.clubNombre}>Nombre del club</span>
                    <p className={styles.clubDesc}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Mauris a fermentum orci. Pellentesque blandit lobortis leo,
                      at maximus metus gravida sit amet. Orci varius natoque
                      penatibus et magnis dis parturient montes, nascetur
                      ridiculus mus. Aliquam eu felis in justo viverra lacinia...
                    </p>
                  </div>
                </div>
              </section>

              <section className={`${styles.seccion} ${styles.sixStarSeccion}`}>
                <h2 className={styles.seccionTitulo}>Tu favorito de favoritos</h2>
                {sixStar
                  ? <SixStarCard resena={sixStar} />
                  : (
                    <p className={styles.vacioPequeno}>
                      Aún no tienes una reseña de 6 estrellas
                    </p>
                  )
                }
              </section>

            </div>

          </div>

        </main>
      </div>
    </div>
  )
}

function SixStarCard({ resena }) {
  return (
    <div className={styles.sixStarCard}>
      <div className={styles.sixStarPosterCol}>
        {resena.movie?.poster
          ? <img src={resena.movie.poster} alt={resena.movie.title} className={styles.sixStarPoster} />
          : <div className={styles.sixStarPosterPlaceholder} />
        }
        <div className={styles.sixStarMeta}>
          <span className={styles.sixStarTitulo}>{resena.movie?.title}</span>
          <span className={styles.sixStarAnio}>{resena.movie?.anio} · {resena.movie?.genre}</span>
          <div className={styles.sixStarEstrellas}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>{i < resena.rating ? '★' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.sixStarContenido}>
        <div className={styles.sixStarBox}>
          <p className={styles.sixStarLabel}>Reseña</p>
          <p className={styles.sixStarTexto}>{resena.review_text}</p>
        </div>

        {resena.mood && (
          <div className={styles.sixStarMood}>
            <div className={styles.moodIcono}>
              <Smile size={13} />
            </div>
            <span className={styles.moodLabel}>Estado:</span>
            <span className={styles.moodValor}>{resena.mood}</span>
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Search, ChevronDown, X, Smile } from 'lucide-react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './MisResenas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import ModalResenaDetalle from '../../Components/ModalResenaDetalle'
import api from '@/lib/axios'
import {ORDENAR_AGREGADA, ORDENAR_VALORACION, filtrarResenas } from './MisResenas.helpers.js'

export default function MisResenas() {

  const [resenas,            setResenas]            = useState([])
  const [cargando,           setCargando]           = useState(true)
  const [busqueda,           setBusqueda]           = useState('')
  const [filtroGenero,       setFiltroGenero]       = useState(null)
  const [filtroAgregada,     setFiltroAgregada]     = useState(null)
  const [filtroValoracion,   setFiltroValoracion]   = useState(null)
  const [dropdownAbierto,    setDropdownAbierto]    = useState(null)
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null)
  const [generos, setGeneros] = useState([])

  useEffect(() => {
    cargarResenas()
    api.get('/movies/genres')
      .then(res => setGeneros(res.data))
      .catch(() => {})
}, [])

  function cargarResenas() {
    setCargando(true)
    api.get('/my-reviews')
      .then(res => setResenas(res.data.reviews))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }

  function eliminarResena(id) {
    api.delete(`/reviews/${id}`)
      .then(() => {
        setResenas(prev => prev.filter(r => r.id !== id))
        setResenaSeleccionada(null)
      })
      .catch(err => console.error(err))
  }

  function toggleDropdown(nombre) {
    setDropdownAbierto(prev => prev === nombre ? null : nombre)
  }

  const resenaDestacada  = resenas.find(r => r.is_six_star) ?? null
  const resenasNormales  = resenas.filter(r => !r.is_six_star)

  const resenasFiltradas = filtrarResenas(resenasNormales, {
    busqueda, filtroGenero, filtroAgregada, filtroValoracion
  })

  if (cargando) return <div>Cargando...</div>

  return (
    <div className={styles.page}>

      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="resenas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Reseñas</h1>
            <p className={styles.pageSubtitle}>Esto es lo que piensas</p>
          </div>

          {/* ── Búsqueda + filtros ── */}
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar película por título"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className={styles.searchClear} onClick={() => setBusqueda('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className={styles.filtros}>
              <span className={styles.filtrosLabel}>Filtrar por:</span>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroGenero ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('genero')}
                >
                  {filtroGenero ?? 'Género'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'genero' && (
                  <div className={styles.dropdownMenu}>
                    {generos.map(g => (
                      <button key={g}
                        className={`${styles.dropdownItem} ${filtroGenero === g ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroGenero(g); setDropdownAbierto(null) }}
                      >{g}</button>
                    ))}
                    {filtroGenero && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroGenero(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroAgregada ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('agregada')}
                >
                  {filtroAgregada ?? 'Agregada'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'agregada' && (
                  <div className={styles.dropdownMenu}>
                    {ORDENAR_AGREGADA.map(o => (
                      <button key={o}
                        className={`${styles.dropdownItem} ${filtroAgregada === o ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroAgregada(o); setDropdownAbierto(null) }}
                      >{o}</button>
                    ))}
                    {filtroAgregada && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroAgregada(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={`${styles.dropdownBtn} ${filtroValoracion ? styles.dropdownBtnActivo : ''}`}
                  onClick={() => toggleDropdown('valoracion')}
                >
                  {filtroValoracion ?? 'Valoración'} <ChevronDown size={14} />
                </button>
                {dropdownAbierto === 'valoracion' && (
                  <div className={styles.dropdownMenu}>
                    {ORDENAR_VALORACION.map(o => (
                      <button key={o}
                        className={`${styles.dropdownItem} ${filtroValoracion === o ? styles.dropdownItemActivo : ''}`}
                        onClick={() => { setFiltroValoracion(o); setDropdownAbierto(null) }}
                      >{o}</button>
                    ))}
                    {filtroValoracion && (
                      <button className={styles.dropdownLimpiar}
                        onClick={() => { setFiltroValoracion(null); setDropdownAbierto(null) }}>
                        Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Destacada ── */}
          {resenaDestacada && (
            <section className={styles.seccionDestacada}>
              <h2 className={styles.tituloDestacada}>Destacada: 6 estrellas</h2>
              <div className={styles.destacadaLayout}>
                <div className={styles.estrellaDecorativa}>
                  <div className={styles.estrellaCirculo}>
                    <span className={styles.estrellaIcono}>★</span>
                  </div>
                </div>
                <ResenaCard
                  resena={resenaDestacada}
                  destacada
                  onClick={() => setResenaSeleccionada(resenaDestacada)}
                />
              </div>
            </section>
          )}

          {/* ── Todas las reseñas ── */}
          <section className={styles.seccionTodas}>
            <h2 className={styles.tituloTodas}>Todas las reseñas</h2>
            {resenasFiltradas.length > 0
              ? (
                <div className={styles.resenasGrid}>
                  {resenasFiltradas.map(resena => (
                    <ResenaCard
                      key={resena.id}
                      resena={resena}
                      onClick={() => setResenaSeleccionada(resena)}
                    />
                  ))}
                </div>
              )
              : (
                <div className={styles.sinResultados}>
                  No se encontraron reseñas con esos filtros.
                </div>
              )
            }
          </section>

        </main>
      </div>

      {resenaSeleccionada && (
        <ModalResenaDetalle
          resena={resenaSeleccionada}
          onCerrar={() => setResenaSeleccionada(null)}
          onEliminar={eliminarResena}
          tieneSeisEstrellas={resenas.some(r => r.is_six_star && r.id !== resenaSeleccionada.id)}
        />
      )}

    </div>
  )
}

function ResenaCard({ resena, destacada = false, onClick }) {

  const tituloCorto = resena.movie.title.length > 22
    ? resena.movie.title.slice(0, 18) + '...'
    : resena.movie.title

  return (
    <div
      className={`${styles.resenaCard} ${destacada ? styles.resenaCardDestacada : ''}`}
      onClick={onClick}
    >
      <div className={styles.resenaPoster}>
        {resena.movie.poster
          ? <img src={resena.movie.poster} alt={resena.movie.title} className={styles.posterImg} />
          : <div className={styles.posterPlaceholder} />
        }
        <div className={styles.peliculaInfo}>
          <span className={styles.peliculaTitulo}>{tituloCorto}</span>
          <span className={styles.peliculaMeta}>{resena.movie.anio} · {resena.movie.genre}</span>
          <div className={styles.estrellas}>
            {Array.from({ length: resena.is_six_star ? 6 : 5 }).map((_, i) => (
              <span key={i}>{i < resena.rating ? '★' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.resenaContenido}>
        <div className={styles.resenaBox}>
          <p className={styles.resenaLabel}>Reseña</p>
          <p className={styles.resenaTexto}>{resena.review_text}</p>
        </div>
        <div className={styles.resenaMood}>
          <div className={styles.moodIcono}>
            <Smile size={14} />
          </div>
          <span className={styles.moodLabel}>Estado: </span>
          <span className={styles.moodValor}>{resena.mood}</span>
        </div>
      </div>

    </div>
  )
}
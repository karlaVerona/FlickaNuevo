import { useState, useEffect, useRef } from 'react'
import { router } from '@inertiajs/react'
import { Icon } from '@iconify/react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './ListaDetalle.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'
import ModalEditarLista from '../../Components/ModalEditarLista'
import ModalDetalle from '../../Components/ModalDetalle'
import ModalResena from '../../Components/ModalResena'
import { Search, X, Pencil, Undo2 } from 'lucide-react'

export default function ListaDetalle({ id }) {

  const [lista, setLista] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [peliculaDetalle, setPeliculaDetalle] = useState(null)
  const [modalResenaAbierto, setModalResenaAbierto] = useState(false)
  const [tieneSeisEstrellas, setTieneSeisEstrellas] = useState(false)
  const [favIds, setFavIds] = useState(new Set())
  const [favMap, setFavMap] = useState({})

  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  useEffect(() => {
    api.get('/lists')
      .then(res => {
        const found = res.data.find(l => l.id === Number(id))
        setLista(found ?? null)
      })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))

    api.get('/favorites')
      .then(res => {
        const ids = new Set(res.data.favorites.map(f => f.movie_id))
        const map = {}
        res.data.favorites.forEach(f => { map[f.movie_id] = f.id })
        setFavIds(ids)
        setFavMap(map)
      })
      .catch(() => { })
  }, [id])

  useEffect(() => {
    if (!busqueda.trim()) { setResultados([]); return }
    const t = setTimeout(() => {
      setBuscando(true)
      api.get('/movies', { params: { search: busqueda } })
        .then(res => setResultados(res.data.slice(0, 5)))
        .catch(() => { })
        .finally(() => setBuscando(false))
    }, 350)
    return () => clearTimeout(t)
  }, [busqueda])

  function agregarPelicula(pelicula) {
    if (lista.movies?.some(m => m.id === pelicula.id)) return
    api.post(`/lists/${lista.id}/movies`, { movie_id: pelicula.id })
      .then(() => {
        setLista(prev => ({ ...prev, movies: [...(prev.movies ?? []), pelicula] }))
        setBusqueda('')
        setResultados([])
      })
      .catch(err => console.error(err))
  }

  function eliminarPelicula(movieId) {
    api.delete(`/lists/${lista.id}/movies/${movieId}`)
      .then(() => setLista(prev => ({ ...prev, movies: prev.movies.filter(m => m.id !== movieId) })))
      .catch(err => console.error(err))
  }

  function toggleFavorito(movieId) {
    if (favIds.has(movieId)) {
      const favId = favMap[movieId]
      api.delete(`/favorites/${favId}`)
        .then(() => {
          setFavIds(prev => { const s = new Set(prev); s.delete(movieId); return s })
          setFavMap(prev => { const m = { ...prev }; delete m[movieId]; return m })
        })
        .catch(err => console.error(err))
    } else {
      api.post('/favorites', { movie_id: movieId })
        .then(res => {
          setFavIds(prev => new Set(prev).add(movieId))
          setFavMap(prev => ({ ...prev, [movieId]: res.data.favorite.id }))
        })
        .catch(err => console.error(err))
    }
  }

  function abrirModalResena() {
    api.get('/my-reviews')
      .then(res => setTieneSeisEstrellas(res.data.some(r => r.is_six_star)))
      .catch(() => { })
      .finally(() => setModalResenaAbierto(true))
  }

  function onDragStart(e, index) {
    dragItem.current = index
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragEnter(index) {
    if (dragItem.current === index) return
    dragOverItem.current = index
    const movies = [...lista.movies]
    const dragged = movies.splice(dragItem.current, 1)[0]
    movies.splice(index, 0, dragged)
    dragItem.current = index
    setLista(prev => ({ ...prev, movies }))
  }

  function onDragEnd() {
    dragItem.current = null
    dragOverItem.current = null
  }

  function onListaEditada(datosActualizados) {
    setLista(prev => ({ ...prev, ...datosActualizados }))
    setModalEditar(false)
  }

  return (
    <div className={styles.page}>
      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="listas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

        <main className={styles.content}>

          {/* ── Banner ── */}
          <div className={styles.banner} style={{ background: lista?.color ?? '#301413' }}>
            <div className={styles.bannerLeft}>
              <button className={styles.backBtn} onClick={() => router.visit('/mis-listas')}>
                <Undo2 size={18} />
              </button>
              <div className={styles.iconoCirculo}>
                <Icon icon={lista?.icon ?? 'noto:movie-camera'} width={34} />
              </div>
              <div>
                <h1 className={styles.bannerTitulo}>{lista?.name ?? 'Cargando...'}</h1>
                <p className={styles.bannerSubtitulo}>
                  {lista?.movies?.length ?? 0} película{(lista?.movies?.length ?? 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button className={styles.editarBtn} onClick={() => setModalEditar(true)}>
              <Pencil size={15} />
              Editar
            </button>
          </div>

          {/* ── Buscador ── */}
          <div className={styles.searchWrapper}>
            <div className={styles.searchRow}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Buscar película para agregar a la lista"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button className={styles.searchClear} onClick={() => { setBusqueda(''); setResultados([]) }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {(resultados.length > 0 || buscando) && (
              <div className={styles.resultadosDropdown}>
                {buscando && <p className={styles.buscandoMsg}>Buscando...</p>}
                {resultados.map(p => {
                  const yaEsta = lista?.movies?.some(m => m.id === p.id)
                  return (
                    <button
                      key={p.id}
                      className={`${styles.resultadoItem} ${yaEsta ? styles.resultadoItemActivo : ''}`}
                      onClick={() => !yaEsta && agregarPelicula(p)}
                      disabled={yaEsta}
                    >
                      {p.poster && <img src={p.poster} alt={p.title} className={styles.resultadoPoster} />}
                      <span className={styles.resultadoTitulo}>{p.title}</span>
                      <span className={styles.resultadoAnio}>{p.anio} · {p.genre}</span>
                      {yaEsta
                        ? <span className={styles.yaEstaLabel}>Ya está</span>
                        : <span className={styles.agregarLabel}>+ Agregar</span>
                      }
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Grid ── */}
          {cargando ? (
            <div className={styles.vacio}>
              <p className={styles.vacioTexto}>Cargando lista...</p>
            </div>
          ) : !lista ? (
            <div className={styles.vacio}>
              <p className={styles.vacioTexto}>Lista no encontrada</p>
            </div>
          ) : lista.movies?.length > 0 ? (
            <div className={styles.peliculasGrid}>
              {lista.movies.map((pelicula, index) => (
                <div
                  key={pelicula.id}
                  className={styles.peliculaCard}
                  draggable
                  onDragStart={e => onDragStart(e, index)}
                  onDragEnter={() => onDragEnter(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => setPeliculaDetalle(pelicula)}
                >
                  <div className={styles.posterWrapper}>
                    {pelicula.poster
                      ? <img
                          src={pelicula.poster}
                          alt={pelicula.title}
                          className={styles.peliculaPoster}
                          draggable={false}
                        />
                      : <div className={styles.peliculaPlaceholder} />
                    }
                    <div className={styles.posterOverlay} />
                  </div>

                  <div className={styles.peliculaInfo}>
                    <span className={styles.peliculaTitulo}>{pelicula.title}</span>
                    <span className={styles.peliculaMeta}>{pelicula.anio} · {pelicula.genre}</span>
                    <div className={styles.peliculaAcciones}>
                      <div className={styles.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < (pelicula.rating ?? 0) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <button
                        className={styles.quitarBtn}
                        onClick={e => { e.stopPropagation(); eliminarPelicula(pelicula.id) }}
                        title="Quitar de la lista"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.vacio}>
              <p className={styles.vacioTexto}>
                Esta lista está vacía — busca películas arriba para agregarlas
              </p>
            </div>
          )}

        </main>
      </div>

      {modalEditar && lista && (
        <ModalEditarLista
          lista={lista}
          onCerrar={() => setModalEditar(false)}
          onGuardado={onListaEditada}
        />
      )}

      {peliculaDetalle && (
        <ModalDetalle
          pelicula={peliculaDetalle}
          esFavorita={favIds.has(peliculaDetalle.id)}
          onToggleFavorito={() => toggleFavorito(peliculaDetalle.id)}
          onCerrar={() => setPeliculaDetalle(null)}
          onAbrirResena={abrirModalResena}
        />
      )}

      {modalResenaAbierto && peliculaDetalle && (
        <ModalResena
          pelicula={peliculaDetalle}
          tieneSeisEstrellas={tieneSeisEstrellas}
          onCerrar={() => setModalResenaAbierto(false)}
          onExito={() => {
            setModalResenaAbierto(false)
            setPeliculaDetalle(null)
          }}
        />
      )}

    </div>
  )
}
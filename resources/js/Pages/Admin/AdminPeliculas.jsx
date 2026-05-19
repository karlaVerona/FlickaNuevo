import { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from './AdminLayout'
import styles from './AdminPeliculas.module.css'
import api from '@/lib/axios'

export default function AdminPeliculas() {

  const [peliculas,  setPeliculas]  = useState([])
  const [meta,       setMeta]       = useState(null)
  const [busqueda,   setBusqueda]   = useState('')
  const [pagina,     setPagina]     = useState(1)
  const [cargando,   setCargando]   = useState(true)
  const [modal,      setModal]      = useState(null)  // null | 'crear' | pelicula

  function cargar(pag = 1, search = busqueda) {
    setCargando(true)
    api.get('/admin/movies', { params: { page: pag, search } })
      .then(res => {
        setPeliculas(res.data.data)
        setMeta(res.data)
      })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(1, busqueda) }, 350)
    return () => clearTimeout(t)
  }, [busqueda])

  useEffect(() => { cargar(pagina) }, [pagina])

  function eliminar(id) {
    if (!confirm('¿Eliminar esta película?')) return
    api.delete(`/admin/movies/${id}`)
      .then(() => cargar(pagina))
      .catch(err => console.error(err))
  }

  return (
    <AdminLayout active="peliculas">
      <main className={styles.content}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Películas</h1>
            <p className={styles.pageSubtitle}>Gestión del catálogo</p>
          </div>
          <button className={styles.crearBtn} onClick={() => setModal('crear')}>
            <Plus size={15} /> Agregar película
          </button>
        </div>

        {/* Buscador */}
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className={styles.searchClear} onClick={() => setBusqueda('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Tabla */}
        {cargando
          ? <div className={styles.cargando}>Cargando...</div>
          : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Director</th>
                    <th>Año</th>
                    <th>Género</th>
                    <th>Rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {peliculas.map(p => (
                    <tr key={p.id}>
                      <td className={styles.tdTitulo}>
                        {p.poster && <img src={p.poster} alt={p.title} className={styles.miniPoster} />}
                        {p.title}
                      </td>
                      <td>{p.director}</td>
                      <td>{p.anio}</td>
                      <td>{p.genre}</td>
                      <td>{p.rating ?? '—'}</td>
                      <td className={styles.tdAcciones}>
                        <button className={styles.editBtn} onClick={() => setModal(p)}>
                          <Pencil size={13} />
                        </button>
                        <button className={styles.deleteBtn} onClick={() => eliminar(p.id)}>
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        {/* Paginación */}
        {meta && meta.last_page > 1 && (
          <div className={styles.paginacion}>
            <button
              className={styles.pageBtn}
              disabled={pagina === 1}
              onClick={() => setPagina(p => p - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            <span className={styles.pageInfo}>{pagina} / {meta.last_page}</span>
            <button
              className={styles.pageBtn}
              disabled={pagina === meta.last_page}
              onClick={() => setPagina(p => p + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

      </main>

      {/* Modal crear / editar */}
      {modal && (
        <ModalPelicula
          pelicula={modal === 'crear' ? null : modal}
          onCerrar={() => setModal(null)}
          onGuardado={() => { setModal(null); cargar(pagina) }}
        />
      )}

    </AdminLayout>
  )
}

function ModalPelicula({ pelicula, onCerrar, onGuardado }) {

  const [form, setForm] = useState({
    title:    pelicula?.title    ?? '',
    director: pelicula?.director ?? '',
    anio:     pelicula?.anio     ?? '',
    genre:    pelicula?.genre    ?? '',
    synopsis: pelicula?.synopsis ?? '',
    poster:   pelicula?.poster   ?? '',
  })
  const [enviando, setEnviando] = useState(false)
  const [errores,  setErrores]  = useState({})

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleGuardar() {
    setErrores({})
    setEnviando(true)
    try {
      if (pelicula) {
        await api.put(`/admin/movies/${pelicula.id}`, form)
      } else {
        await api.post('/admin/movies', form)
      }
      onGuardado()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors ?? {})
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitulo}>
            {pelicula ? 'Editar película' : 'Nueva película'}
          </h2>
          <button className={styles.cerrarBtn} onClick={onCerrar}>
            <X size={17} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {[
            { name: 'title',    label: 'Título',    type: 'text' },
            { name: 'director', label: 'Director',  type: 'text' },
            { name: 'anio',     label: 'Año',       type: 'number' },
            { name: 'genre',    label: 'Género',    type: 'text' },
            { name: 'poster',   label: 'URL Poster', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name} className={styles.campo}>
              <label className={styles.label}>{label}</label>
              <input
                className={styles.input}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
              />
              {errores[name] && <span className={styles.errorMsg}>{errores[name]}</span>}
            </div>
          ))}

          <div className={styles.campo}>
            <label className={styles.label}>Sinopsis</label>
            <textarea
              className={styles.textarea}
              name="synopsis"
              value={form.synopsis}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelarBtn} onClick={onCerrar}>Cancelar</button>
          <button className={styles.guardarBtn} onClick={handleGuardar} disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

      </div>
    </>
  )
}
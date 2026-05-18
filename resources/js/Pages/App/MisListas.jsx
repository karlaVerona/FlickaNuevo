import { useState, useEffect } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Icon } from '@iconify/react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './MisListas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'
import ModalCrearLista from '../../Components/ModalCrearLista'

export default function MisListas() {

  const [listas, setListas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalCrear, setModalCrear] = useState(false)

  useEffect(() => {
    api.get('/lists')
      .then(res => setListas(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  function eliminarLista(e, id) {
    e.stopPropagation()
    api.delete(`/lists/${id}`)
      .then(() => setListas(prev => prev.filter(l => l.id !== id)))
      .catch(err => console.error(err))
  }

  function onListaCreada(nuevaLista) {
    setListas(prev => [...prev, nuevaLista])
    setModalCrear(false)
  }

  const listasFiltradas = listas.filter(l =>
    l.name.toLowerCase().includes(busqueda.toLowerCase())
  )


  return (
    <div className={styles.page}>
      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="listas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Listas</h1>
            <p className={styles.pageSubtitle}>Organiza tus películas</p>
          </div>

          <div className={styles.controlesRow}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar lista"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className={styles.searchClear} onClick={() => setBusqueda('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button className={styles.crearBtn} onClick={() => setModalCrear(true)}>
              <Plus size={16} />
              Agregar lista
            </button>
          </div>

          {cargando ? (
            <div className={styles.cargando}>Cargando listas...</div>
          ) : listasFiltradas.length > 0 ? (
            <div className={styles.grid}>
              {listasFiltradas.map(lista => (
                <div
                  key={lista.id}
                  className={styles.listaCard}
                  style={{ background: lista.color ?? '#301413' }}
                  onClick={() => router.visit(`/mis-listas/${lista.id}`)}
                >
                  <div className={styles.listaIcono}>
                    <Icon icon={lista.icon ?? 'noto:movie-camera'} width={28} />
                  </div>
                  <div className={styles.listaInfo}>
                    <span className={styles.listaNombre}>{lista.name}</span>
                    <span className={styles.listaContador}>
                      {lista.movies?.length ?? 0} película{(lista.movies?.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    className={styles.listaEliminarBtn}
                    onClick={e => eliminarLista(e, lista.id)}
                    title="Eliminar lista"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.vacio}>
              <p className={styles.vacioTexto}>
                {busqueda ? 'No se encontraron listas' : 'Aún no tienes listas creadas'}
              </p>
            </div>
          )}

        </main>
      </div>

      {modalCrear && (
        <ModalCrearLista
          onCerrar={() => setModalCrear(false)}
          onCreada={onListaCreada}
        />
      )}

    </div>
  )
}
import { useState, useEffect } from 'react'
import { Search, Pencil, Trash2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import AdminLayout from './AdminLayout'
import styles from './AdminPeliculas.module.css'
import api from '@/lib/axios'

export default function AdminUsuarios() {

  const [usuarios,  setUsuarios]  = useState([])
  const [meta,      setMeta]      = useState(null)
  const [busqueda,  setBusqueda]  = useState('')
  const [pagina,    setPagina]    = useState(1)
  const [cargando,  setCargando]  = useState(true)
  const [modal,     setModal]     = useState(null)

  function cargar(pag = 1, search = busqueda) {
    setCargando(true)
    api.get('/admin/users', { params: { page: pag, search } })
      .then(res => { setUsuarios(res.data.data); setMeta(res.data) })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(1, busqueda) }, 350)
    return () => clearTimeout(t)
  }, [busqueda])

  useEffect(() => { cargar(pagina) }, [pagina])

  function eliminar(id) {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
    api.delete(`/admin/users/${id}`)
      .then(() => cargar(pagina))
      .catch(err => console.error(err))
  }

  return (
    <AdminLayout active="usuarios">
      <main className={styles.content}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Usuarios</h1>
            <p className={styles.pageSubtitle}>Gestión de cuentas</p>
          </div>
        </div>

        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className={styles.searchClear} onClick={() => setBusqueda('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {cargando
          ? <div className={styles.cargando}>Cargando...</div>
          : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Plan</th>
                    <th>Rol</th>
                    <th>Registro</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td className={styles.tdTitulo}>
                        <div className={styles.userAvatar}>
                          {u.photo
                            ? <img src={u.photo} alt={u.username} />
                            : (u.username?.[0] ?? 'U').toUpperCase()
                          }
                        </div>
                        {u.username}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={u.is_pro ? styles.badgePro : styles.badgeFree}>
                          {u.is_pro ? 'PRO' : 'Free'}
                        </span>
                      </td>
                      <td>{u.role ?? 'user'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString('es-MX')}</td>
                      <td className={styles.tdAcciones}>
                        <button className={styles.editBtn} onClick={() => setModal(u)}>
                          <Pencil size={13} />
                        </button>
                        <button className={styles.deleteBtn} onClick={() => eliminar(u.id)}>
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

        {meta && meta.last_page > 1 && (
          <div className={styles.paginacion}>
            <button className={styles.pageBtn} disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>
              <ChevronLeft size={15} />
            </button>
            <span className={styles.pageInfo}>{pagina} / {meta.last_page}</span>
            <button className={styles.pageBtn} disabled={pagina === meta.last_page} onClick={() => setPagina(p => p + 1)}>
              <ChevronRight size={15} />
            </button>
          </div>
        )}

      </main>

      {modal && (
        <ModalUsuario
          usuario={modal}
          onCerrar={() => setModal(null)}
          onGuardado={() => { setModal(null); cargar(pagina) }}
        />
      )}

    </AdminLayout>
  )
}

function ModalUsuario({ usuario, onCerrar, onGuardado }) {

  const [isPro,    setIsPro]    = useState(usuario.is_pro === true || usuario.is_pro === 1)
  const [role,     setRole]     = useState(usuario.role ?? 'user')
  const [enviando, setEnviando] = useState(false)

  async function handleGuardar() {
    setEnviando(true)
    try {
      await api.put(`/admin/users/${usuario.id}`, { is_pro: isPro, role })
      onGuardado()
    } catch (err) {
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitulo}>Editar usuario</h2>
          <button className={styles.cerrarBtn} onClick={onCerrar}><X size={17} /></button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.userModalInfo}>
            <strong>{usuario.username}</strong>
            <span>{usuario.email}</span>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Plan</label>
            <div className={styles.toggleRow}>
              <button
                className={`${styles.toggleBtn} ${!isPro ? styles.toggleBtnActivo : ''}`}
                onClick={() => setIsPro(false)}
              >
                Gratuito
              </button>
              <button
                className={`${styles.toggleBtn} ${isPro ? styles.toggleBtnActivo : ''}`}
                onClick={() => setIsPro(true)}
              >
                PRO
              </button>
            </div>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Rol</label>
            <div className={styles.toggleRow}>
              <button
                className={`${styles.toggleBtn} ${role === 'user' ? styles.toggleBtnActivo : ''}`}
                onClick={() => setRole('user')}
              >
                Usuario
              </button>
              <button
                className={`${styles.toggleBtn} ${role === 'admin' ? styles.toggleBtnActivo : ''}`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
            </div>
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
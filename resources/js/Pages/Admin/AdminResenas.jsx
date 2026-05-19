import { useState, useEffect } from 'react'
import { Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import AdminLayout from './AdminLayout'
import styles from './AdminPeliculas.module.css'
import api from '@/lib/axios'

export default function AdminResenas() {

  const [resenas,  setResenas]  = useState([])
  const [meta,     setMeta]     = useState(null)
  const [pagina,   setPagina]   = useState(1)
  const [cargando, setCargando] = useState(true)

  function cargar(pag = 1) {
    setCargando(true)
    api.get('/admin/reviews', { params: { page: pag } })
      .then(res => { setResenas(res.data.data); setMeta(res.data) })
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar(pagina) }, [pagina])

  function eliminar(id) {
    if (!confirm('¿Eliminar esta reseña?')) return
    api.delete(`/admin/reviews/${id}`)
      .then(() => cargar(pagina))
      .catch(err => console.error(err))
  }

  return (
    <AdminLayout active="resenas">
      <main className={styles.content}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Reseñas</h1>
            <p className={styles.pageSubtitle}>Moderación de contenido</p>
          </div>
        </div>

        {cargando
          ? <div className={styles.cargando}>Cargando...</div>
          : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Película</th>
                    <th>Rating</th>
                    <th>Reseña</th>
                    <th>Fecha</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resenas.map(r => (
                    <tr key={r.id}>
                      <td>{r.user?.username ?? '—'}</td>
                      <td>{r.movie?.title ?? '—'}</td>
                      <td>
                        <div className={styles.ratingCell}>
                          {r.is_six_star && <span className={styles.sixStarBadge}>★6</span>}
                          {r.rating}★
                        </div>
                      </td>
                      <td className={styles.tdResena}>
                        {r.review_text?.slice(0, 80)}{r.review_text?.length > 80 ? '...' : ''}
                      </td>
                      <td>{new Date(r.created_at).toLocaleDateString('es-MX')}</td>
                      <td className={styles.tdAcciones}>
                        <button className={styles.deleteBtn} onClick={() => eliminar(r.id)}>
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
    </AdminLayout>
  )
}
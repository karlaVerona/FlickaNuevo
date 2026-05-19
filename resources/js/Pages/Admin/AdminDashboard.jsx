import { useState, useEffect } from 'react'
import { Users, Film, ClipboardList, Star } from 'lucide-react'
import AdminLayout from './AdminLayout'
import styles from './AdminDashboard.module.css'
import api from '@/lib/axios'

// Construye los segmentos del pie chart SVG
function buildPie(free, pro) {
  const total = free + pro
  if (total === 0) return []
  const pctFree = free / total
  const pctPro  = pro  / total
  const TAU = 2 * Math.PI

  // Segmento gratuito
  const x1f = Math.cos(0), y1f = Math.sin(0)
  const ang1 = pctFree * TAU
  const x2f = Math.cos(ang1), y2f = Math.sin(ang1)
  const largeF = pctFree > 0.5 ? 1 : 0
  const pathFree = `M 0 0 L ${x1f} ${y1f} A 1 1 0 ${largeF} 1 ${x2f} ${y2f} Z`

  // Segmento PRO
  const x1p = x2f, y1p = y2f
  const x2p = Math.cos(TAU), y2p = Math.sin(TAU)
  const largeP = pctPro > 0.5 ? 1 : 0
  const pathPro = `M 0 0 L ${x1p} ${y1p} A 1 1 0 ${largeP} 1 ${x2p} ${y2p} Z`

  return [
    { path: pathFree, color: '#5dade2', label: 'Plan gratuito', num: free,  pct: Math.round(pctFree * 100) },
    { path: pathPro,  color: '#c9a84c', label: 'Flicka PRO',    num: pro,   pct: Math.round(pctPro  * 100) },
  ]
}

export default function AdminDashboard() {

  const [stats,    setStats]    = useState(null)
  const [cargando, setCargando] = useState(true)
  const [tooltip,  setTooltip]  = useState(null)

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  return (
    <AdminLayout active="dashboard">
      <main className={styles.content}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Resumen general del sistema</p>
        </div>

        {cargando
          ? <div className={styles.cargando}>Cargando estadísticas...</div>
          : (
            <>
              {/* ── KPI cards ── */}
              <div className={styles.kpiRow}>

                <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #1a2a4a, #2e4482)' }}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiLabel}>Usuarios totales</span>
                    <Users size={20} className={styles.kpiIcon} />
                  </div>
                  <span className={styles.kpiValor}>{stats.total_users}</span>
                  <div className={styles.kpiSub}>
                    <span className={styles.kpiFree}>{stats.users_free} gratuitos</span>
                    <span className={styles.kpiPro}>{stats.users_pro} PRO</span>
                  </div>
                </div>

                <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #1a3a2a, #2ecc71)' }}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiLabel}>Películas en catálogo</span>
                    <Film size={20} className={styles.kpiIcon} />
                  </div>
                  <span className={styles.kpiValor}>{stats.total_movies}</span>
                </div>

                <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #4a1a4a, #7b3f9e)' }}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiLabel}>Reseñas escritas</span>
                    <ClipboardList size={20} className={styles.kpiIcon} />
                  </div>
                  <span className={styles.kpiValor}>{stats.total_reviews}</span>
                </div>

                <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #4a3a1a, #c9a84c)' }}>
                  <div className={styles.kpiTop}>
                    <span className={styles.kpiLabel}>Reseñas 6 estrellas</span>
                    <Star size={20} className={styles.kpiIcon} />
                  </div>
                  <span className={styles.kpiValor}>{stats.six_star_reviews}</span>
                </div>

              </div>

              {/* ── Distribución de planes — pie chart ── */}
              <div className={styles.planesSection}>
                <h2 className={styles.seccionTitulo}>Distribución de planes</h2>

                <div className={styles.pieCard}>

                  {/* Donut SVG */}
                  <div className={styles.pieWrapper}>
                    <svg
                      viewBox="-1 -1 2 2"
                      className={styles.pieSvg}
                      style={{ transform: 'rotate(-90deg)' }}
                    >
                      {buildPie(stats.users_free, stats.users_pro).map((seg, i) => (
                        <path
                          key={i}
                          d={seg.path}
                          fill={seg.color}
                          stroke="#2a1010"
                          strokeWidth="0.025"
                          className={styles.pieSlice}
                          onMouseEnter={e => {
                            const rect = e.currentTarget.closest('svg').getBoundingClientRect()
                            setTooltip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                              label: seg.label,
                              num:   seg.num,
                              pct:   seg.pct,
                            })
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))}
                      {/* Círculo central donut */}
                      <circle cx="0" cy="0" r="0.55" fill="#2a1010" />
                    </svg>

                    {/* Centro del donut: total de usuarios */}
                    <div className={styles.pieCentro}>
                      <span className={styles.pieCentroNum}>{stats.total_users}</span>
                      <span className={styles.pieCentroLabel}>usuarios</span>
                    </div>

                    {tooltip && (
                      <div
                        className={styles.tooltip}
                        style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
                      >
                        <span className={styles.tooltipLabel}>{tooltip.label}</span>
                        <span className={styles.tooltipValue}>{tooltip.num} · {tooltip.pct}%</span>
                      </div>
                    )}
                  </div>

                  {/* Leyenda */}
                  <div className={styles.pieLeyenda}>
                    {buildPie(stats.users_free, stats.users_pro).map((seg, i) => (
                      <div key={i} className={styles.leyendaItem}>
                        <div className={styles.leyendaColor} style={{ background: seg.color }} />
                        <div className={styles.leyendaInfo}>
                          <span className={styles.leyendaNombre}>{seg.label}</span>
                          <span className={styles.leyendaNum}>{seg.num} usuarios</span>
                        </div>
                        <span className={styles.leyendaPct}>{seg.pct}%</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </>
          )
        }

      </main>
    </AdminLayout>
  )
}
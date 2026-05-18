import { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar'
import TopBar from '../../Components/TopBar'
import styles from './Estadisticas.module.css'
import fondo from '../../../images/fondo-paginas2.jpg'
import api from '@/lib/axios'
import { buildPieSegments, getGenreColor, buildBarData } from './Estadisticas.helpers.js'
import { Film, Heart, BarChart2, Star } from 'lucide-react'

export default function Estadisticas() {

  const [stats,    setStats]    = useState(null)
  const [cargando, setCargando] = useState(true)
  const [tooltip,  setTooltip]  = useState(null)

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <div>Cargando...</div>
  if (!stats)   return <div>No se pudieron cargar las estadísticas</div>

  const pieSegments = buildPieSegments(stats.genres)
  const barData     = buildBarData(stats.genres)
  const topGenero   = stats.genres[0]?.genre ?? '—'

  return (
    <div className={styles.page}>
      <img src={fondo} alt="" className={styles.bgImage} />
      <Sidebar active="estadisticas" />

      <div className={styles.mainColumn}>
        <TopBar username="Usuario" plan="Flicka PRO" />

        <main className={styles.content}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Estadísticas</h1>
            <p className={styles.pageSubtitle}>Tu actividad en Flicka</p>
          </div>

          {/* ── Fila de KPI cards ── */}
          <div className={styles.kpiRow}>

            <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #8b1a1a, #c0392b)' }}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Películas reseñadas</span>
                <Film size={20} className={styles.kpiIcon} />
              </div>
              <span className={styles.kpiValor}>{stats.total_reviews}</span>
              <div className={styles.kpiDeco}>
                {[30,50,40,65,55,75,60].map((h,i) => (
                  <div key={i} className={styles.kpiBar} style={{ height: h, opacity: 0.3 + i*0.1 }} />
                ))}
              </div>
            </div>

            <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #4a1a4a, #7b3f9e)' }}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Películas favoritas</span>
                <Heart size={20} className={styles.kpiIcon} />
              </div>
              <span className={styles.kpiValor}>{stats.total_favorites}</span>
              <div className={styles.kpiDeco}>
                {[40,60,50,70,45,80,65].map((h,i) => (
                  <div key={i} className={styles.kpiBar} style={{ height: h, opacity: 0.3 + i*0.1 }} />
                ))}
              </div>
            </div>

            <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #1a3a4a, #1a6a8a)' }}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Géneros explorados</span>
                <BarChart2 size={20} className={styles.kpiIcon} />
              </div>
              <span className={styles.kpiValor}>{stats.genres.length}</span>
              <div className={styles.kpiDeco}>
                {[55,45,70,35,65,50,75].map((h,i) => (
                  <div key={i} className={styles.kpiBar} style={{ height: h, opacity: 0.3 + i*0.1 }} />
                ))}
              </div>
            </div>

            <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #4a3a1a, #c9a84c)' }}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>Género favorito</span>
                <Star size={20} className={styles.kpiIcon} />
              </div>
              <span className={styles.kpiValorSm}>{topGenero}</span>
              <div className={styles.kpiDeco}>
                {[60,40,75,55,65,45,70].map((h,i) => (
                  <div key={i} className={styles.kpiBar} style={{ height: h, opacity: 0.3 + i*0.1 }} />
                ))}
              </div>
            </div>

          </div>

          {stats.genres.length > 0 && (
            <div className={styles.chartsRow}>

              {/* ── Gráfica de barras ── */}
              <div className={styles.chartCard} style={{ flex: 2 }}>
                <h2 className={styles.chartTitle}>Películas por género</h2>
                <div className={styles.barChart}>
                  {barData.map((b, i) => (
                    <div key={i} className={styles.barGroup}>
                      <span className={styles.barValue}>{b.total}</span>
                      <div
                        className={styles.bar}
                        style={{ height: `${b.pct}%`, background: b.color }}
                        title={`${b.genre}: ${b.total}`}
                      />
                      <span className={styles.barLabel}>{b.genre}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Gráfica de pastel ── */}
              <div className={styles.chartCard} style={{ flex: 1 }}>
                <h2 className={styles.chartTitle}>Distribución</h2>
                <div className={styles.pieLayout}>

                  <div className={styles.pieWrapper}>
                    <svg
                      viewBox="-1 -1 2 2"
                      className={styles.pieSvg}
                      style={{ transform: 'rotate(-90deg)' }}
                    >
                      {pieSegments.map((seg, i) => (
                        <path
                          key={i}
                          d={seg.path}
                          fill={seg.color}
                          stroke="#ffffff"
                          strokeWidth="0.01"
                          className={styles.pieSlice}
                          onMouseEnter={e => {
                            const rect = e.currentTarget.closest('svg').getBoundingClientRect()
                            setTooltip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                              label: seg.genre,
                              value: seg.total,
                              pct: seg.pct,
                            })
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      ))}
                    </svg>

                    {tooltip && (
                      <div className={styles.tooltip} style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}>
                        <span className={styles.tooltipLabel}>{tooltip.label}</span>
                        <span className={styles.tooltipValue}>{tooltip.value} · {tooltip.pct}%</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.leyenda}>
                    {stats.genres.map((g, i) => (
                      <div key={i} className={styles.leyendaItem}>
                        <div className={styles.leyendaColor} style={{ background: getGenreColor(i) }} />
                        <span className={styles.leyendaGenero}>{g.genre}</span>
                        <span className={styles.leyendaPct}>
                          {Math.round((g.total / stats.total_reviews) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          )}

          {stats.total_reviews === 0 && (
            <div className={styles.vacio}>
              <p className={styles.vacioTexto}>
                Aún no tienes estadísticas — agrega reseñas para ver tu actividad
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
export const GENRE_COLORS = [
  '#c9a84c', // dorado
  '#4a9a8a', // teal
  '#e07070', // rojo suave
  '#7a8ae0', // azul/violeta
  '#e0a070', // naranja
  '#70c0e0', // celeste
  '#a070e0', // morado
  '#70e0a0', // verde menta
  '#e070b0', // rosa
  '#b0e070', // verde lima
]

export function getGenreColor(index) {
  return GENRE_COLORS[index % GENRE_COLORS.length]
}

/* Segmentos SVG para el pie chart */
export function buildPieSegments(genres) {
  const total = genres.reduce((sum, g) => sum + g.total, 0)
  if (total === 0) return []

  let currentAngle = 0
  const TAU = 2 * Math.PI

  return genres.map((g, i) => {
    const fraction   = g.total / total
    const startAngle = currentAngle
    const endAngle   = currentAngle + fraction * TAU
    currentAngle     = endAngle

    const x1 = Math.cos(startAngle)
    const y1 = Math.sin(startAngle)
    const x2 = Math.cos(endAngle)
    const y2 = Math.sin(endAngle)

    const largeArc = fraction > 0.5 ? 1 : 0

    return {
      path:  `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: getGenreColor(i),
      genre: g.genre,
      total: g.total,
      pct:   Math.round(fraction * 100),
    }
  })
}

/* Datos para las barras — normaliza al 100% relativo al máximo */
export function buildBarData(genres) {
  if (!genres.length) return []
  const max = Math.max(...genres.map(g => g.total))
  return genres.map((g, i) => ({
    genre: g.genre,
    total: g.total,
    pct:   Math.round((g.total / max) * 85) + 8, // mín 8% para que se vea
    color: getGenreColor(i),
  }))
}
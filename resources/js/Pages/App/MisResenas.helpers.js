export const GENEROS          = ['Terror', 'Romance', 'Ficción']
export const ORDENAR_AGREGADA = ['Más reciente', 'Más antigua']
export const ORDENAR_VALORACION = ['Mejor valorada', 'Peor valorada']

export function filtrarResenas(resenas, { busqueda, filtroGenero, filtroAgregada, filtroValoracion }) {
  return [...resenas]
    .filter(r => {
      const coincideTitulo = r.movie.title.toLowerCase().includes(busqueda.toLowerCase())
      const coincideGenero = filtroGenero ? r.movie.genre === filtroGenero : true
      return coincideTitulo && coincideGenero
    })
    .sort((a, b) => {
      if (filtroValoracion === 'Mejor valorada') return b.rating - a.rating
      if (filtroValoracion === 'Peor valorada')  return a.rating - b.rating
      if (filtroAgregada   === 'Más reciente')   return b.id - a.id
      if (filtroAgregada   === 'Más antigua')    return a.id - b.id
      return 0
    })
}
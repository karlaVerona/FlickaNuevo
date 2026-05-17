// ── DATOS MOCK ──
export const MOCK_PELICULAS = [
  { id: 1,  titulo: 'Chilemorron', anio: 2026, genero: 'Terror',   rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 2,  titulo: 'Título de la película', anio: 2025, genero: 'Romance',  rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 3,  titulo: 'Título de la película', anio: 2024, genero: 'Ficción',  rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 4,  titulo: 'Título de la película', anio: 2026, genero: 'Terror',   rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 5,  titulo: 'Título de la película', anio: 2025, genero: 'Romance',  rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 6,  titulo: 'Título de la película', anio: 2023, genero: 'Ficción',  rating: 2, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 7,  titulo: 'Título de la película', anio: 2026, genero: 'Terror',   rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 8,  titulo: 'Título de la película', anio: 2024, genero: 'Romance',  rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 9,  titulo: 'Título de la película', anio: 2025, genero: 'Ficción',  rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 10, titulo: 'Título de la película', anio: 2026, genero: 'Terror',   rating: 1, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 11, titulo: 'Título de la película', anio: 2023, genero: 'Romance',  rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 12, titulo: 'Título de la película', anio: 2024, genero: 'Ficción',  rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 13, titulo: 'Título de la película', anio: 2026, genero: 'Terror',   rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
  { id: 14, titulo: 'Título de la película', anio: 2025, genero: 'Romance',  rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci.' },
]

// ── OPCIONES DE FILTROS ──
export const GENEROS = ['Terror', 'Romance', 'Ficción']
export const ANIOS   = [2026, 2025, 2024, 2023]
export const ORDENAR = ['Mejor valorada', 'Peor valorada']

// ── LÓGICA DE FILTRADO Y ORDENAMIENTO ──
// Recibe el array de películas y los filtros activos, devuelve el array filtrado
export function filtrarPeliculas(peliculas, { busqueda, filtroGenero, filtroAnio, filtroOrden }) {
  return peliculas
    .filter(p => {
      const coincideTitulo = p.titulo.toLowerCase().includes(busqueda.toLowerCase())
      const coincideGenero = filtroGenero ? p.genero === filtroGenero : true
      const coincideAnio   = filtroAnio   ? p.anio   === filtroAnio   : true
      return coincideTitulo && coincideGenero && coincideAnio
    })
    .sort((a, b) => {
      if (filtroOrden === 'Mejor valorada') return b.rating - a.rating
      if (filtroOrden === 'Peor valorada')  return a.rating - b.rating
      return 0
    })
}
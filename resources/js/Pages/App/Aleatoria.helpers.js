// ── DATOS MOCK ──
export const MOCK_PELICULAS = [
  { id: 1,  titulo: 'Título de la película', anio: 2026, genero: 'Terror',  rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam eu felis in justo viverra lacinia et vel risus. Quisque eu rutrum purus.' },
  { id: 2,  titulo: 'Título de la película', anio: 2025, genero: 'Romance', rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet. Donec magna purus, ultrices et ullamcorper ac, dapibus nec libero.' },
  { id: 3,  titulo: 'Título de la película', anio: 2024, genero: 'Ficción', rating: 3, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet. Suspendisse purus nisl, condimentum at neque euismod.' },
  { id: 4,  titulo: 'Título de la película', anio: 2026, genero: 'Terror',  rating: 4, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 5,  titulo: 'Título de la película', anio: 2025, genero: 'Romance', rating: 5, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
  { id: 6,  titulo: 'Título de la película', anio: 2023, genero: 'Ficción', rating: 2, sinopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a fermentum orci. Pellentesque blandit lobortis leo, at maximus metus gravida sit amet.' },
]

// Devuelve una película aleatoria distinta a la actual
export function getPeliculaAleatoria(peliculas, idActual) {
  const disponibles = peliculas.filter(p => p.id !== idActual)
  const idx = Math.floor(Math.random() * disponibles.length)
  return disponibles[idx]
}
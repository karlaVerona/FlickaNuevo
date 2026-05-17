// ── OPCIONES DEL ENUM mood ──
export const MOODS = [
  'Risa explosiva',
  'Inspirador',
  'Cozy',
  'Nudo en la garganta',
  'Nostalgia pura',
  'Al borde del asiento',
  'Corazón al mil',
  'Incomodidad',
  'Misterio',
  'Crisis existencial',
  'Mind-bending',
  'Reflexivo',
  'Empoderado',
]

// Valida los campos del formulario antes de enviar
// Devuelve un objeto de errores — si está vacío, el form es válido
export function validarResena({ rating, review_text, mood }) {
  const errores = {}

  if (!rating || rating < 1)
    errores.rating = 'Selecciona una calificación'

  if (!review_text || review_text.trim().length < 10)
    errores.review_text = 'La reseña debe tener al menos 10 caracteres'

  if (!mood)
    errores.mood = 'Selecciona el mood de la película'

  return errores
}
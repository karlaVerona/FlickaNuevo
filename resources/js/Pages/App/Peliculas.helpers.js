// ── CARRUSEL ──

export function scrollCarrusel(ref, direccion) {
  ref.current.scrollBy({
    left: direccion === 'derecha' ? 400 : -400,
    behavior: 'smooth'
  })
}

// ── DRAG (arrastrar con mouse en desktop) ──

export function onMouseDown(e) {
  const el = e.currentTarget
  el.dataset.dragging = 'true'
  el.dataset.startX = e.pageX - el.offsetLeft
  el.dataset.scrollLeft = el.scrollLeft
  el.style.cursor = 'grabbing'
}

export function onMouseMove(e) {
  const el = e.currentTarget
  if (el.dataset.dragging !== 'true') return
  const x = e.pageX - el.offsetLeft
  const walk = x - el.dataset.startX
  el.scrollLeft = el.dataset.scrollLeft - walk
}

export function onMouseUp(e) {
  e.currentTarget.dataset.dragging = 'false'
  e.currentTarget.style.cursor = 'grab'
}

export function onMouseLeave(e) {
  e.currentTarget.dataset.dragging = 'false'
  e.currentTarget.style.cursor = 'grab'
}

// Objeto listo para hacer spread en cualquier movieGrid
// Uso: <div {...dragProps} />
export const dragProps = {
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  style: { cursor: 'grab' }
}
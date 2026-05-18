import { useState } from 'react'
import { X } from 'lucide-react'
import { Icon } from '@iconify/react'
import api from '@/lib/axios'
import styles from './ModalEditarLista.module.css'

const COLORES = [
    '#1a1a1a', // Negro
    '#2a2a2a', // Gris oscuro
    '#580101', // Blanco hueso
    '#8b1a1a', // Rojo oscuro
    '#c0392b', // Rojo vivo
    '#e8547a', // Rosa fuerte
    '#f4a7b9', // Rosa claro
    '#6b3a1a', // Naranja oscuro / marrón
    '#c06a2a', // Naranja
    '#c9a84c', // Amarillo dorado
    '#f0e040', // Amarillo vivo
    '#3a4a1a', // Verde oliva
    '#1a3a2a', // Verde oscuro
    '#2ecc71', // Verde medio
    '#54b793', // Verde menta
    '#1a4a4a', // Turquesa oscuro
    '#1abc9c', // Turquesa
    '#5dade2', // Azul claro
    '#1a2a4a', // Azul oscuro
    '#2e4482', // Azul medio
    '#6c5ce7', // Índigo / violeta
    '#3a1a4a', // Morado oscuro
    '#8e44ad', // Morado
    '#4a1a3a', // Vino / magenta oscuro
]

const ICONOS = [
    'noto:glowing-star',
    'noto:star',
    'noto:performing-arts',
    'noto:trophy',
    'noto:rocket',
    'noto:clapper-board',
    'noto:movie-camera',
    'noto:popcorn',
    'noto:red-heart',
    'noto:broken-heart',
    'noto:fork-and-knife-with-plate',
    'noto:test-tube',
    'noto:books',
    'noto:desktop-computer',
    'noto:video-game',
    'noto:magnifying-glass-tilted-right',
    'noto:musical-notes',
    'noto:horse',
    'noto:t-rex',
    'noto:military-helmet',
    'noto:airplane',
    'noto:teddy-bear',
    'noto:castle',
    'noto:cherry-blossom',
    'noto:fish-cake-with-swirl',
    'noto:ribbon',
    'noto:rainbow-flag',
    'noto:bouquet',
    'noto:christmas-tree',
    'noto:jack-o-lantern', 
]

/*
  Props:
    - lista: objeto con { id, name, color, icon }
    - onCerrar: cierra el modal
    - onGuardado: función(datosActualizados) — notifica al padre con los nuevos datos
*/
export default function ModalEditarLista({ lista, onCerrar, onGuardado }) {

  const [nombre,   setNombre]   = useState(lista.name)
  const [color,    setColor]    = useState(lista.color  ?? COLORES[0])
  const [icono,    setIcono]    = useState(lista.icon   ?? ICONOS[0])
  const [enviando, setEnviando] = useState(false)
  const [error,    setError]    = useState('')

  async function handleGuardar() {
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return }
    setEnviando(true)
    try {
      const res = await api.put(`/lists/${lista.id}`, {
        name:  nombre.trim(),
        color,
        icon:  icono,
      })
      onGuardado({ name: res.data.name, color: res.data.color, icon: res.data.icon })
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />

      <div className={styles.modal}>

        <div className={styles.header}>
          <h2 className={styles.titulo}>Editar lista</h2>
          <button className={styles.cerrarBtn} onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>

          {/* Preview en vivo */}
          <div className={styles.preview} style={{ background: color }}>
            <div className={styles.previewIcono}>
              <Icon icon={icono} width={36} />
            </div>
            <span className={styles.previewNombre}>{nombre || 'Nombre de la lista'}</span>
          </div>

          {/* Nombre */}
          <div className={styles.campo}>
            <label className={styles.label}>Nombre</label>
            <input
              className={styles.input}
              type="text"
              value={nombre}
              onChange={e => { setNombre(e.target.value); setError('') }}
              maxLength={50}
            />
            {error && <span className={styles.errorMsg}>{error}</span>}
          </div>

          {/* Color */}
          <div className={styles.campo}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorGrid}>
              {COLORES.map(c => (
                <button
                  key={c}
                  className={`${styles.colorBtn} ${color === c ? styles.colorBtnActivo : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Icono */}
          <div className={styles.campo}>
            <label className={styles.label}>Icono</label>
            <div className={styles.iconoGrid}>
              {ICONOS.map(i => (
                <button
                  key={i}
                  className={`${styles.iconoBtn} ${icono === i ? styles.iconoBtnActivo : ''}`}
                  onClick={() => setIcono(i)}
                >
                  <Icon icon={i} width={22} />
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.footer}>
          <button className={styles.cancelarBtn} onClick={onCerrar}>Cancelar</button>
          <button className={styles.guardarBtn} onClick={handleGuardar} disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </>
  )
}
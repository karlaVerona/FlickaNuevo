import { useState, useEffect } from 'react'
import { X, Search, Check, Plus } from 'lucide-react'
import { Icon } from '@iconify/react'
import api from '@/lib/axios'
import styles from './ModalCrearLista.module.css'

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

export default function ModalCrearLista({ onCerrar, onCreada }) {

    const [nombre, setNombre] = useState('')
    const [color, setColor] = useState(COLORES[0])
    const [icono, setIcono] = useState(ICONOS[0])
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')
    const [busqPelicula, setBusqPelicula] = useState('')
    const [resultados, setResultados] = useState([])
    const [buscando, setBuscando] = useState(false)
    const [seleccionadas, setSeleccionadas] = useState([])

    useEffect(() => {
        if (!busqPelicula.trim()) { setResultados([]); return }
        const t = setTimeout(() => {
            setBuscando(true)
            api.get('/movies', { params: { search: busqPelicula } })
                .then(res => setResultados(res.data.slice(0, 8)))
                .catch(() => { })
                .finally(() => setBuscando(false))
        }, 350)
        return () => clearTimeout(t)
    }, [busqPelicula])

    function togglePelicula(pelicula) {
        setSeleccionadas(prev =>
            prev.some(p => p.id === pelicula.id)
                ? prev.filter(p => p.id !== pelicula.id)
                : [...prev, pelicula]
        )
    }

    async function handleCrear() {
        if (!nombre.trim()) { setError('El nombre es obligatorio'); return }
        setEnviando(true)
        try {
            const res = await api.post('/lists', { name: nombre.trim(), color, icon: icono })
            const nuevaLista = res.data
            console.log('Lista creada:', nuevaLista)

            if (seleccionadas.length > 0) {
                const resultados = await Promise.all(
                    seleccionadas.map(p =>
                        api.post(`/lists/${nuevaLista.id}/movies`, { movie_id: p.id })
                            .then(r => { console.log('Película agregada:', p.title, r.data); return r })
                            .catch(e => { console.error('Error agregando', p.title, e.response?.data); throw e })
                    )
                )
            }

            onCreada({ ...nuevaLista, movies: seleccionadas })
        } catch (e) {
            console.error('Error completo:', e.response?.data ?? e.message)
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
                    <h2 className={styles.titulo}>Nueva lista</h2>
                    <button className={styles.cerrarBtn} onClick={onCerrar}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.body}>

                    {/* Preview en vivo */}
                    <div className={styles.preview} style={{ background: color }}>
                        <div className={styles.previewIcono}>
                            <Icon icon={icono} width={32} />
                        </div>
                        <span className={styles.previewNombre}>{nombre || 'Nombre de la lista'}</span>
                    </div>

                    {/* Nombre */}
                    <div className={styles.campo}>
                        <label className={styles.label}>Nombre</label>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Nombre de la lista"
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

                    {/* Agregar películas */}
                    <div className={styles.campo}>
                        <label className={styles.label}>Agregar películas</label>
                        <div className={styles.searchBox}>
                            <Search size={14} className={styles.searchIcon} />
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="Buscar película..."
                                value={busqPelicula}
                                onChange={e => setBusqPelicula(e.target.value)}
                            />
                            {busqPelicula && (
                                <button className={styles.searchClear} onClick={() => { setBusqPelicula(''); setResultados([]) }}>
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {buscando && <p className={styles.buscandoMsg}>Buscando...</p>}

                        {resultados.length > 0 && (
                            <div className={styles.resultadosList}>
                                {resultados.map(p => {
                                    const yaSeleccionada = seleccionadas.some(s => s.id === p.id)
                                    return (
                                        <button
                                            key={p.id}
                                            className={`${styles.resultadoItem} ${yaSeleccionada ? styles.resultadoItemActivo : ''}`}
                                            onClick={() => togglePelicula(p)}
                                        >
                                            {p.poster && <img src={p.poster} alt={p.title} className={styles.resultadoPoster} />}
                                            <span className={styles.resultadoTitulo}>{p.title}</span>
                                            <span className={styles.resultadoAnio}>{p.anio}</span>
                                            {yaSeleccionada
                                                ? <Check size={14} className={styles.checkIcon} />
                                                : <Plus size={14} className={styles.plusIcon} />
                                            }
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {seleccionadas.length > 0 && (
                            <div className={styles.seleccionadas}>
                                <p className={styles.seleccionadasLabel}>
                                    {seleccionadas.length} película{seleccionadas.length !== 1 ? 's' : ''} seleccionada{seleccionadas.length !== 1 ? 's' : ''}
                                </p>
                                <div className={styles.chips}>
                                    {seleccionadas.map(p => (
                                        <div key={p.id} className={styles.chip}>
                                            <span>{p.title}</span>
                                            <button onClick={() => togglePelicula(p)}><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelarBtn} onClick={onCerrar}>Cancelar</button>
                    <button className={styles.guardarBtn} onClick={handleCrear} disabled={enviando}>
                        {enviando ? 'Creando...' : 'Crear lista'}
                    </button>
                </div>

            </div>
        </>
    )
}
import { useState, useEffect } from 'react'
import { X, Camera, User, Lock, Eye, EyeOff, ImagePlus, Lock as LockIcon } from 'lucide-react'
import api from '@/lib/axios'
import styles from './ModalPerfil.module.css'

const COLORES = [
  '#1a1a1a', '#2a2a2a', '#580101', '#8b1a1a',
  '#c0392b', '#e8547a', '#f4a7b9', '#6b3a1a',
  '#c06a2a', '#c9a84c', '#f0e040', '#3a4a1a',
  '#1a3a2a', '#2ecc71', '#54b793', '#1a4a4a',
  '#1abc9c', '#5dade2', '#1a2a4a', '#2e4482',
  '#6c5ce7', '#3a1a4a', '#8e44ad', '#4a1a3a',
]

// Calcula el próximo 1° del mes siguiente
function proximoCambio(fechaStr) {
  const d = new Date(fechaStr)
  return new Date(d.getFullYear(), d.getMonth() + 1, 1)
    .toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Devuelve true si genre_updated_at es del mes actual
function yaActualizoEsteMes(fechaStr) {
  if (!fechaStr) return false
  const d = new Date(fechaStr)
  const hoy = new Date()
  return d.getFullYear() === hoy.getFullYear() && d.getMonth() === hoy.getMonth()
}

export default function ModalPerfil({ user, onCerrar, onActualizado }) {

  const [tab, setTab] = useState('perfil')

  // ── Perfil ──
  const [username, setUsername] = useState(user.username ?? '')
  const [bio,      setBio]      = useState(user.bio      ?? '')
  const [color,    setColor]    = useState(user.color    ?? '#8b1a1a')

  // ── Foto ──
  const [fotoPreview, setFotoPreview] = useState(user.photo  ?? null)
  const [fotoFile,    setFotoFile]    = useState(null)

  // ── Banner ──
  const [bannerPreview, setBannerPreview] = useState(user.banner ?? null)
  const [bannerFile,    setBannerFile]    = useState(null)

  // ── Géneros favoritos ──
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])
  const [generosDisponibles,   setGenerosDisponibles]   = useState([])
  const [generosBloqueados,    setGenerosBloqueados]     = useState(false)
  const [generosFechaBloqueo,  setGenerosFechaBloqueo]   = useState(null)

  // ── Contraseña ──
  const [currentPass, setCurrentPass] = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ── Estado general ──
  const [enviando, setEnviando] = useState(false)
  const [errores,  setErrores]  = useState({})
  const [exito,    setExito]    = useState('')

  useEffect(() => {
    // Carga géneros disponibles desde el catálogo real
    api.get('/movies/genres')
      .then(res => setGenerosDisponibles(res.data))
      .catch(() => {})

    // Carga géneros actuales del usuario
    api.get('/profile/genres')
      .then(res => setGenerosSeleccionados(res.data.map(g => g.genre)))
      .catch(() => {})

    // Verifica bloqueo mensual desde el perfil
    api.get('/profile')
      .then(res => {
        const fecha = res.data.genre_updated_at ?? null
        if (yaActualizoEsteMes(fecha)) {
          setGenerosBloqueados(true)
          setGenerosFechaBloqueo(fecha)
        }
      })
      .catch(() => {})
  }, [])

  function getInitials(name) {
    return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  function handleFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  function handleBanner(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
  }

  function toggleGenero(genero) {
    if (generosBloqueados) return
    setGenerosSeleccionados(prev => {
      if (prev.includes(genero)) return prev.filter(g => g !== genero)
      if (prev.length >= 3) return prev
      return [...prev, genero]
    })
  }

  async function handleGuardarPerfil() {
    setErrores({})
    setExito('')
    setEnviando(true)
    try {
      let photoUrl  = user.photo  ?? null
      let bannerUrl = user.banner ?? null

      if (fotoFile) {
        const fd = new FormData()
        fd.append('photo', fotoFile)
        const r = await api.post('/profile/photo', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        photoUrl = r.data.photo
        setFotoFile(null)
      }

      if (bannerFile) {
        const fd = new FormData()
        fd.append('banner', bannerFile)
        const r = await api.post('/profile/banner', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        bannerUrl = r.data.banner
        setBannerFile(null)
      }

      await api.put('/profile/color', { color })

      // Guarda géneros solo si no están bloqueados
      if (!generosBloqueados && generosSeleccionados.length > 0) {
        await api.post('/profile/genres', {
          genres: generosSeleccionados.map((g, i) => ({
            genre:    g,
            position: i + 1,
          }))
        }).then(() => {
          // Si el backend lo aceptó, marca como bloqueado localmente
          setGenerosBloqueados(true)
          setGenerosFechaBloqueo(new Date().toISOString())
        }).catch(err => {
          if (err.response?.status === 429) {
            setGenerosBloqueados(true)
          }
        })
      }

      const res = await api.put('/profile', { username, bio })
      setExito('Perfil actualizado correctamente')
      onActualizado({ ...res.data.user, photo: photoUrl, banner: bannerUrl, color })
    } catch (err) {
      if (err.response?.status === 422) {
        setErrores(err.response.data.errors ?? {})
      } else {
        setErrores({ general: 'Ocurrió un error. Intenta de nuevo.' })
      }
    } finally {
      setEnviando(false)
    }
  }

  async function handleCambiarPassword() {
    setErrores({})
    setExito('')
    if (newPass !== confirmPass) {
      setErrores({ confirm: 'Las contraseñas no coinciden' })
      return
    }
    setEnviando(true)
    try {
      await api.put('/profile/password', {
        current_password:      currentPass,
        password:              newPass,
        password_confirmation: confirmPass,
      })
      setExito('Contraseña actualizada correctamente')
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
    } catch (err) {
      if (err.response?.status === 403) {
        setErrores({ current_password: 'La contraseña actual es incorrecta' })
      } else if (err.response?.status === 422) {
        setErrores(err.response.data.errors ?? {})
      } else {
        setErrores({ general: 'Ocurrió un error. Intenta de nuevo.' })
      }
    } finally {
      setEnviando(false)
    }
  }

  const hayPendientes = fotoFile || bannerFile

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar} />

      <div className={styles.modal}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.titulo}>Configuración de perfil</h2>
          <button className={styles.cerrarBtn} onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>

        {/* ── Avatar ── */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {fotoPreview
              ? <img src={fotoPreview} alt={username} className={styles.avatarImg} />
              : <div className={styles.avatarInitials}>{getInitials(username)}</div>
            }
            {hayPendientes && <div className={styles.avatarPendiente} title="Cambios pendientes de guardar" />}
            <label className={styles.avatarUpload} title="Cambiar foto">
              <Camera size={14} />
              <input type="file" accept="image/*" onChange={handleFoto} hidden />
            </label>
          </div>
          <div className={styles.avatarInfo}>
            <span className={styles.avatarNombre}>{username}</span>
            <span className={styles.avatarPlan}>
              {(user.is_pro === true || user.is_pro === 1) ? 'Flicka PRO' : 'Plan Gratuito'}
            </span>
            <span className={styles.avatarEmail}>{user.email}</span>
            {hayPendientes && (
              <span className={styles.fotoNota}>Cambios listos para guardar</span>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'perfil' ? styles.tabActivo : ''}`}
            onClick={() => { setTab('perfil'); setErrores({}); setExito('') }}
          >
            <User size={14} />
            Perfil
          </button>
          <button
            className={`${styles.tab} ${tab === 'password' ? styles.tabActivo : ''}`}
            onClick={() => { setTab('password'); setErrores({}); setExito('') }}
          >
            <Lock size={14} />
            Contraseña
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {errores.general && (
            <div className={styles.errorGeneral}>{errores.general}</div>
          )}
          {exito && (
            <div className={styles.exitoMsg}>{exito}</div>
          )}

          {/* ── Tab perfil ── */}
          {tab === 'perfil' && (
            <>
              <div className={styles.campo}>
                <label className={styles.label}>
                  <User size={12} /> Nombre de usuario
                </label>
                <input
                  className={styles.input}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  maxLength={30}
                />
                {errores.username && <span className={styles.errorMsg}>{errores.username}</span>}
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Correo electrónico</label>
                <input
                  className={`${styles.input} ${styles.inputReadonly}`}
                  type="email"
                  value={user.email ?? ''}
                  readOnly
                  tabIndex={-1}
                />
                <span className={styles.readonlyNota}>El correo no se puede modificar</span>
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Biografía</label>
                <textarea
                  className={styles.textarea}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti..."
                  maxLength={500}
                  rows={3}
                />
                <span className={styles.contador}>{bio.length} / 500</span>
                {errores.bio && <span className={styles.errorMsg}>{errores.bio}</span>}
              </div>

              {/* ── Géneros favoritos ── */}
              <div className={styles.campo}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Géneros favoritos</label>
                  {generosBloqueados && (
                    <span className={styles.bloqueoIcono}>
                      <LockIcon size={11} />
                    </span>
                  )}
                </div>

                {generosBloqueados
                  ? (
                    /* Aviso de bloqueo mensual */
                    <div className={styles.bloqueoMsg}>
                      <LockIcon size={14} className={styles.bloqueoIconoMsg} />
                      <div>
                        <p className={styles.bloqueoTitulo}>Ya actualizaste tus géneros este mes</p>
                        <p className={styles.bloqueoSub}>
                          Podrás cambiarlos a partir del{' '}
                          <strong>{proximoCambio(generosFechaBloqueo)}</strong>
                        </p>
                      </div>
                    </div>
                  )
                  : (
                    <p className={styles.generosNota}>
                      Selecciona hasta 3 · {generosSeleccionados.length}/3 elegidos
                    </p>
                  )
                }

                {/* Chips de seleccionados */}
                {generosSeleccionados.length > 0 && (
                  <div className={styles.generosSeleccionados}>
                    {generosSeleccionados.map((g, i) => (
                      <div key={g} className={`${styles.generoChip} ${generosBloqueados ? styles.generoChipBloqueado : ''}`}>
                        <span className={styles.generoChipPos}>{i + 1}</span>
                        <span>{g}</span>
                        {!generosBloqueados && (
                          <button onClick={() => toggleGenero(g)}>
                            <X size={11} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid — solo se muestra si no está bloqueado */}
                {!generosBloqueados && (
                  <div className={styles.generosGrid}>
                    {generosDisponibles.map(g => {
                      const idx = generosSeleccionados.indexOf(g)
                      const seleccionado  = idx !== -1
                      const deshabilitado = !seleccionado && generosSeleccionados.length >= 3
                      return (
                        <button
                          key={g}
                          className={`${styles.generoBtn} ${seleccionado ? styles.generoBtnActivo : ''} ${deshabilitado ? styles.generoBtnDeshabilitado : ''}`}
                          onClick={() => toggleGenero(g)}
                          disabled={deshabilitado}
                        >
                          {seleccionado && <span className={styles.generoBtnNum}>{idx + 1}</span>}
                          {g}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Color de perfil */}
              <div className={styles.campo}>
                <label className={styles.label}>Color de perfil</label>
                <div className={styles.colorGrid}>
                  {COLORES.map(c => (
                    <button
                      key={c}
                      className={`${styles.colorBtn} ${color === c ? styles.colorBtnActivo : ''}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Banner */}
              <div className={styles.campo}>
                <label className={styles.label}>
                  <ImagePlus size={12} /> Banner de perfil
                </label>
                <label className={styles.bannerUpload}>
                  {bannerPreview
                    ? <img src={bannerPreview} alt="Banner" className={styles.bannerPreview} />
                    : (
                      <div className={styles.bannerPlaceholder}>
                        <ImagePlus size={22} />
                        <span>Subir imagen de banner</span>
                        <span className={styles.bannerFormatos}>JPG, PNG, WEBP · máx. 4 MB</span>
                      </div>
                    )
                  }
                  <input type="file" accept="image/*" onChange={handleBanner} hidden />
                  {bannerPreview && (
                    <div className={styles.bannerOverlay}>
                      <Camera size={18} />
                      <span>Cambiar banner</span>
                    </div>
                  )}
                </label>
              </div>
            </>
          )}

          {/* ── Tab contraseña ── */}
          {tab === 'password' && (
            <>
              <div className={styles.campo}>
                <label className={styles.label}>Contraseña actual</label>
                <div className={styles.inputPass}>
                  <input
                    className={styles.input}
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button className={styles.eyeBtn} onClick={() => setShowCurrent(p => !p)}>
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errores.current_password && (
                  <span className={styles.errorMsg}>{errores.current_password}</span>
                )}
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Nueva contraseña</label>
                <div className={styles.inputPass}>
                  <input
                    className={styles.input}
                    type={showNew ? 'text' : 'password'}
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button className={styles.eyeBtn} onClick={() => setShowNew(p => !p)}>
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errores.password && <span className={styles.errorMsg}>{errores.password}</span>}
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Confirmar nueva contraseña</label>
                <div className={styles.inputPass}>
                  <input
                    className={styles.input}
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errores.confirm && <span className={styles.errorMsg}>{errores.confirm}</span>}
              </div>
            </>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <button className={styles.cancelarBtn} onClick={onCerrar}>Cancelar</button>
          <button
            className={styles.guardarBtn}
            onClick={tab === 'perfil' ? handleGuardarPerfil : handleCambiarPassword}
            disabled={enviando}
          >
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </>
  )
}
import { useState } from 'react'
import { X, Camera, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import api from '@/lib/axios'
import styles from './ModalPerfil.module.css'

export default function ModalPerfil({ user, onCerrar, onActualizado }) {

  const [tab, setTab] = useState('perfil')

  // ── Perfil ──
  const [username, setUsername] = useState(user.username ?? '')
  const [email,    setEmail]    = useState(user.email    ?? '')
  const [bio,      setBio]      = useState(user.bio      ?? '')

  // ── Foto ──
  const [fotoPreview, setFotoPreview] = useState(user.photo ?? null)
  const [fotoFile,    setFotoFile]    = useState(null)

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

  function getInitials(name) {
    return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  // Solo guarda la preview local, no llama a la API todavía
  function handleFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  async function handleGuardarPerfil() {
    setErrores({})
    setExito('')
    setEnviando(true)
    try {
      let photoUrl = user.photo ?? null

      // Si hay foto pendiente, súbela primero
      if (fotoFile) {
        const formData = new FormData()
        formData.append('photo', fotoFile)
        const fotoRes = await api.post('/profile/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        photoUrl = fotoRes.data.photo
        setFotoFile(null) // ya no hay foto pendiente
      }

      const res = await api.put('/profile', { username, email, bio })
      setExito('Perfil actualizado correctamente')
      onActualizado({ ...res.data.user, photo: photoUrl })
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
            {/* Indicador de cambio pendiente */}
            {fotoFile && <div className={styles.avatarPendiente} title="Foto pendiente de guardar" />}
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
            {fotoFile && (
              <span className={styles.fotoNota}>Foto lista para guardar</span>
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

          {/* Tab perfil */}
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
                <label className={styles.label}>
                  <Mail size={12} /> Correo electrónico
                </label>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {errores.email && <span className={styles.errorMsg}>{errores.email}</span>}
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
            </>
          )}

          {/* Tab contraseña */}
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
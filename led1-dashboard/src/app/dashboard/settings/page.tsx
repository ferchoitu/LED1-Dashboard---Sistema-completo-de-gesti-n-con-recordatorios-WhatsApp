'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  Menu,
  Monitor,
  Home,
  Users,
  LogOut,
  Lock,
  Globe,
  UserPlus,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
  Clock,
  Mail,
  User,
  Check,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Configuración inicial mock
const initialSettings = {
  profile: {
    email: 'admin@led1.com',
    name: 'Administrador LED1',
    timezone: 'America/Argentina/Buenos_Aires'
  },
  security: {
    lastPasswordChange: '2024-01-15'
  },
  moderators: [
    {
      id: 1,
      email: 'moderador@led1.com',
      name: 'Juan Pérez',
      role: 'Moderador',
      addedDate: '2024-01-10',
      status: 'active'
    }
  ]
}

export default function SettingsPage() {
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showAddModeratorForm, setShowAddModeratorForm] = useState(false)
  const [settings, setSettings] = useState(initialSettings)
  const [saveMessage, setSaveMessage] = useState('')

  // Formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  })

  // Formulario de nuevo moderador
  const [moderatorForm, setModeratorForm] = useState({
    email: '',
    name: '',
    role: 'Moderador'
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const timezones = [
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (Buenos Aires)' },
    { value: 'America/Argentina/Cordoba', label: 'Argentina (Córdoba)' },
    { value: 'America/Argentina/Mendoza', label: 'Argentina (Mendoza)' },
    { value: 'America/Sao_Paulo', label: 'Brasil (São Paulo)' },
    { value: 'America/Santiago', label: 'Chile (Santiago)' },
    { value: 'America/Lima', label: 'Perú (Lima)' },
    { value: 'America/Bogota', label: 'Colombia (Bogotá)' },
    { value: 'America/Mexico_City', label: 'México (Ciudad de México)' },
    { value: 'Europe/Madrid', label: 'España (Madrid)' },
    { value: 'UTC', label: 'UTC (Tiempo Universal)' }
  ]

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }

    // Simular cambio de contraseña
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        lastPasswordChange: new Date().toISOString().split('T')[0]
      }
    }))

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    })
    setShowPasswordForm(false)
    setSaveMessage('Contraseña actualizada exitosamente')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleAddModerator = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(moderatorForm.email)) {
      alert('Por favor ingresa un email válido')
      return
    }

    // Verificar que el email no esté ya registrado
    const emailExists = settings.moderators.some(mod => mod.email === moderatorForm.email)
    if (emailExists) {
      alert('Este email ya está registrado como moderador')
      return
    }

    const newModerator = {
      id: settings.moderators.length + 1,
      email: moderatorForm.email,
      name: moderatorForm.name || 'Sin nombre',
      role: moderatorForm.role,
      addedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }

    setSettings(prev => ({
      ...prev,
      moderators: [...prev.moderators, newModerator]
    }))

    setModeratorForm({ email: '', name: '', role: 'Moderador' })
    setShowAddModeratorForm(false)
    setSaveMessage('Moderador agregado exitosamente')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleRemoveModerator = (moderatorId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este moderador?')) {
      setSettings(prev => ({
        ...prev,
        moderators: prev.moderators.filter(mod => mod.id !== moderatorId)
      }))
      setSaveMessage('Moderador eliminado exitosamente')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleTimezoneChange = (timezone: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        timezone
      }
    }))
    setSaveMessage('Zona horaria actualizada')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`nexus-sidebar fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30`}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <img src="/logo-led1.png" alt="LED1" className="h-8" />
          </div>

          <nav className="space-y-2">
            <a href="/dashboard" className="nexus-sidebar-item">
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </a>
            <a href="/dashboard/clients" className="nexus-sidebar-item">
              <Users className="w-5 h-5 mr-3" />
              Clientes
            </a>
            <a href="/dashboard/reports" className="nexus-sidebar-item">
              <TrendingUp className="w-5 h-5 mr-3" />
              Reportes
            </a>
            <a href="/dashboard/expenses" className="nexus-sidebar-item">
              <DollarSign className="w-5 h-5 mr-3" />
              Gastos
            </a>
            <a href="/dashboard/settings" className="nexus-sidebar-item active">
              <Settings className="w-5 h-5 mr-3" />
              Configuración
            </a>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="nexus-sidebar-item w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            </div>
            {saveMessage && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <Check className="w-4 h-4" />
                {saveMessage}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Tabs */}
          <div className="nexus-card mb-8 fade-in">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 mr-2 inline" />
                  Perfil y Cuenta
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Lock className="w-4 h-4 mr-2 inline" />
                  Seguridad
                </button>
                <button
                  onClick={() => setActiveTab('moderators')}
                  className={`px-6 py-3 border-b-2 font-medium text-sm ${
                    activeTab === 'moderators'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Moderadores
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Tab: Perfil y Cuenta */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Perfil</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, name: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, email: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Configuración Regional
                    </h3>

                    <div className="max-w-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria del País
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => handleTimezoneChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Hora actual: {new Date().toLocaleString('es-AR', {
                          timeZone: settings.profile.timezone,
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad de la Cuenta</h3>

                    <div className="nexus-card p-6 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Contraseña</h4>
                          <p className="text-sm text-gray-600">
                            Última actualización: {new Date(settings.security.lastPasswordChange).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="nexus-btn nexus-btn-primary"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Cambiar Contraseña
                        </button>
                      </div>
                    </div>

                    <div className="nexus-card p-6 bg-blue-50 border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Recomendaciones de Seguridad</h4>
                          <ul className="mt-2 text-sm text-blue-800 space-y-1">
                            <li>• Usa una contraseña de al menos 8 caracteres</li>
                            <li>• Incluye mayúsculas, minúsculas, números y símbolos</li>
                            <li>• No compartas tu contraseña con terceros</li>
                            <li>• Cambia tu contraseña periódicamente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Moderadores */}
              {activeTab === 'moderators' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Moderadores y Administradores</h3>
                      <p className="text-sm text-gray-600">Gestiona quién puede acceder a la plataforma</p>
                    </div>
                    <button
                      onClick={() => setShowAddModeratorForm(true)}
                      className="nexus-btn nexus-btn-primary"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Moderador
                    </button>
                  </div>

                  <div className="nexus-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Alta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {settings.moderators.map((moderator) => (
                            <tr key={moderator.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{moderator.name}</div>
                                  <div className="text-sm text-gray-500">{moderator.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {moderator.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(moderator.addedDate).toLocaleDateString('es-AR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Activo
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleRemoveModerator(moderator.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Cambiar Contraseña */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-card max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h2>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      type={passwordForm.showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordForm(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {passwordForm.showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={passwordForm.showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordForm(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {passwordForm.showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={passwordForm.showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordForm(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {passwordForm.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="nexus-btn nexus-btn-primary flex-1 py-3"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Moderador */}
      {showAddModeratorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="nexus-card max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Agregar Moderador</h2>
                <button
                  onClick={() => setShowAddModeratorForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddModerator} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={moderatorForm.email}
                    onChange={(e) => setModeratorForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="moderador@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={moderatorForm.name}
                    onChange={(e) => setModeratorForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Nombre del moderador"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={moderatorForm.role}
                    onChange={(e) => setModeratorForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Moderador">Moderador</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Se enviará un email de invitación a la dirección especificada con las instrucciones para acceder a la plataforma.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModeratorForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="nexus-btn nexus-btn-primary flex-1 py-3"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Eye, EyeOff, Monitor, TrendingUp, Users, DollarSign } from 'lucide-react'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulamos autenticación por ahora
    setTimeout(() => {
      // Redirigir al dashboard
      window.location.href = '/dashboard'
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-10 h-10" />
              <h1 className="text-3xl font-bold">LED1</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Gestión Inteligente de
              <span className="block text-cyan-300">Pantallas LED</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Dashboard completo para administrar clientes, facturación y métricas financieras de tu negocio de pantallas LED publicitarias.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <Users className="w-8 h-8 text-cyan-300" />
              <div>
                <h3 className="font-semibold">Gestión de Clientes</h3>
                <p className="text-sm text-blue-100">Control completo de altas, bajas y datos de facturación</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <DollarSign className="w-8 h-8 text-green-300" />
              <div>
                <h3 className="font-semibold">Métricas Financieras</h3>
                <p className="text-sm text-blue-100">Seguimiento de ingresos mensuales y cobros pendientes</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-300" />
              <div>
                <h3 className="font-semibold">Dashboard en Tiempo Real</h3>
                <p className="text-sm text-blue-100">KPIs y reportes actualizados automáticamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="nexus-card p-8 fade-in">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src="/logo-led1.png" alt="LED1" className="h-8" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? 'Accede a tu dashboard de LED1'
                  : 'Crea tu cuenta para gestionar pantallas LED'
                }
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="nexus-btn nexus-btn-primary w-full py-3 text-base"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </div>
                ) : (
                  isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                Dashboard MVP para gestión de pantallas LED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

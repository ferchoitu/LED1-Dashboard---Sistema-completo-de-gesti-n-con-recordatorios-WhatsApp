'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Menu,
  Home,
  Settings,
  LogOut,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react'
import { useClients } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const { clients, payments, getClientPayments } = useClients()
  const { logout } = useAuth()

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  // Funciones para obtener datos según el período
  const getDateRangeInfo = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth() + 1
    const day = selectedDate.getDate()

    switch (selectedPeriod) {
      case 'day': {
        const dateStr = selectedDate.toLocaleDateString('es-AR')
        return {
          title: `Día ${dateStr}`,
          filterPayments: (payments: any[]) => payments.filter(p => {
            const paymentDate = new Date(p.date)
            return paymentDate.getDate() === day &&
                   paymentDate.getMonth() + 1 === month &&
                   paymentDate.getFullYear() === year
          })
        }
      }
      case 'week': {
        const startOfWeek = new Date(selectedDate)
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        return {
          title: `Semana del ${startOfWeek.toLocaleDateString('es-AR')} al ${endOfWeek.toLocaleDateString('es-AR')}`,
          filterPayments: (payments: any[]) => payments.filter(p => {
            const paymentDate = new Date(p.date)
            return paymentDate >= startOfWeek && paymentDate <= endOfWeek
          })
        }
      }
      case 'year': {
        return {
          title: `Año ${year}`,
          filterPayments: (payments: any[]) => payments.filter(p => p.year === year)
        }
      }
      default: // month
        return {
          title: selectedDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
          filterPayments: (payments: any[]) => payments.filter(p => p.month === month && p.year === year)
        }
    }
  }

  const dateRangeInfo = getDateRangeInfo()

  // Obtener clientes activos
  const activeClients = clients.filter(client => client.status === 'active')

  // Obtener pagos del período seleccionado
  const periodPayments = dateRangeInfo.filterPayments(payments)

  // Calcular estadísticas del período
  const totalExpectedIncome = selectedPeriod === 'year'
    ? activeClients.reduce((sum, client) => sum + (client.monthlyAmount * 12), 0)
    : activeClients.reduce((sum, client) => sum + client.monthlyAmount, 0)

  const paidThisPeriod = periodPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = selectedPeriod === 'day' || selectedPeriod === 'week'
    ? 0 // Para día/semana no calculamos pendiente
    : totalExpectedIncome - paidThisPeriod

  // Clientes que ya pagaron en este período
  const paidClientIds = new Set(periodPayments.map(payment => payment.clientId))
  const paidClients = activeClients.filter(client => paidClientIds.has(client.id))
  const pendingClients = selectedPeriod === 'day' || selectedPeriod === 'week'
    ? [] // Para día/semana no mostramos pendientes
    : activeClients.filter(client => !paidClientIds.has(client.id))

  // Clientes vencidos (solo para vista mensual)
  const today = new Date()
  const currentDay = today.getDate()
  const overdueClients = selectedPeriod === 'month' && selectedDate.getMonth() === today.getMonth() && selectedDate.getFullYear() === today.getFullYear()
    ? pendingClients.filter(client => client.billingDay < currentDay)
    : []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
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
            <a href="/dashboard/cobros" className="nexus-sidebar-item">
              <Calendar className="w-5 h-5 mr-3" />
              Cobros
            </a>
            <a href="/dashboard/reports" className="nexus-sidebar-item active">
              <TrendingUp className="w-5 h-5 mr-3" />
              Reportes
            </a>
            <a href="/dashboard/expenses" className="nexus-sidebar-item">
              <DollarSign className="w-5 h-5 mr-3" />
              Gastos
            </a>
            <a href="/dashboard/settings" className="nexus-sidebar-item">
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
              <h1 className="text-2xl font-bold text-gray-900">Reportes - {dateRangeInfo.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Selector de período */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="nexus-btn nexus-btn-secondary flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedPeriod === 'day' && 'Día'}
                  {selectedPeriod === 'week' && 'Semana'}
                  {selectedPeriod === 'month' && 'Mes'}
                  {selectedPeriod === 'year' && 'Año'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-80 nexus-card p-4 z-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Período
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'day', label: 'Día' },
                            { value: 'week', label: 'Semana' },
                            { value: 'month', label: 'Mes' },
                            { value: 'year', label: 'Año' }
                          ].map((period) => (
                            <button
                              key={period.value}
                              onClick={() => setSelectedPeriod(period.value)}
                              className={`px-3 py-2 text-sm rounded-lg border ${
                                selectedPeriod === period.value
                                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                  : 'bg-gray-50 border-gray-300 text-gray-700'
                              }`}
                            >
                              {period.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha
                        </label>
                        <input
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full nexus-btn nexus-btn-primary text-sm"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => alert('Exportando reporte...')}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* KPIs del mes actual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {selectedPeriod === 'day' || selectedPeriod === 'week' ? 'Ingresos Recibidos' : 'Ingresos Esperados'}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {selectedPeriod === 'day' || selectedPeriod === 'week'
                  ? formatCurrency(paidThisPeriod)
                  : formatCurrency(totalExpectedIncome)
                }
              </p>
              <p className="text-sm text-gray-600 mt-1">{activeClients.length} clientes activos</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Cobrado en {dateRangeInfo.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(paidThisPeriod)}</p>
              <p className="text-sm text-green-600 mt-1">{paidClients.length} clientes pagaron</p>
            </div>

            {(selectedPeriod === 'month' || selectedPeriod === 'year') && (
              <div className="nexus-card p-6 fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pendiente de Cobro</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(pendingAmount)}</p>
                <p className="text-sm text-yellow-600 mt-1">{pendingClients.length} clientes pendientes</p>
              </div>
            )}

            {selectedPeriod === 'month' && (
              <div className="nexus-card p-6 fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Clientes Vencidos</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{overdueClients.length}</p>
                <p className="text-sm text-red-600 mt-1">{formatCurrency(overdueClients.reduce((sum, client) => sum + client.monthlyAmount, 0))}</p>
              </div>
            )}

            {(selectedPeriod === 'day' || selectedPeriod === 'week') && (
              <div className="nexus-card p-6 fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Transacciones</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{periodPayments.length}</p>
                <p className="text-sm text-gray-600 mt-1">Pagos registrados</p>
              </div>
            )}
          </div>

          {/* Lista de pagos realizados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clientes que pagaron */}
            <div className="nexus-card p-6 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Pagos Realizados - {dateRangeInfo.title}
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {paidClients.length}
                </span>
              </h2>

              {periodPayments.length > 0 ? (
                <div className="space-y-4">
                  {periodPayments.map((payment) => (
                    <div key={payment.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{payment.clientName}</h3>
                          <p className="text-sm text-gray-600">Pagado el {new Date(payment.date).toLocaleDateString('es-AR')}</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No hay pagos registrados en {dateRangeInfo.title.toLowerCase()}</p>
                </div>
              )}
            </div>

            {/* Clientes pendientes - Solo para vista mensual/anual */}
            {(selectedPeriod === 'month' || selectedPeriod === 'year') && (
              <div className="nexus-card p-6 fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Pendientes de Pago
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {pendingClients.length}
                  </span>
                </h2>

              {pendingClients.length > 0 ? (
                <div className="space-y-4">
                  {pendingClients.map((client) => {
                    const isOverdue = client.billingDay < currentDay
                    return (
                      <div
                        key={client.id}
                        className={`p-4 rounded-lg border ${
                          isOverdue
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{client.name}</h3>
                            <p className="text-sm text-gray-600">
                              Día de facturación: {client.billingDay}
                              {isOverdue && (
                                <span className="ml-2 text-red-600 font-medium">
                                  (Vencido hace {currentDay - client.billingDay} días)
                                </span>
                              )}
                            </p>
                            <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                              {formatCurrency(client.monthlyAmount)}
                            </p>
                          </div>
                          {isOverdue ? (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-yellow-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p>¡Todos los clientes están al día!</p>
                </div>
              )}
              </div>
            )}
          </div>

          {/* Resumen del progreso - Solo para vista mensual/anual */}
          {(selectedPeriod === 'month' || selectedPeriod === 'year') && (
            <div className="nexus-card p-6 mt-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Progreso de Cobros - {dateRangeInfo.title}</h2>

              <div className="mb-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Progreso de cobros</span>
                  <span>{totalExpectedIncome > 0 ? Math.round((paidThisPeriod / totalExpectedIncome) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${totalExpectedIncome > 0 ? Math.min((paidThisPeriod / totalExpectedIncome) * 100, 100) : 0}%` }}
                  ></div>
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{paidClients.length}</p>
                <p className="text-sm text-gray-600">Clientes al día</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{pendingClients.length - overdueClients.length}</p>
                <p className="text-sm text-gray-600">Pendientes (en tiempo)</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{overdueClients.length}</p>
                <p className="text-sm text-gray-600">Clientes vencidos</p>
              </div>
            </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
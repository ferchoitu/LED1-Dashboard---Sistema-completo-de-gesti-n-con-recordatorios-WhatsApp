'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Menu,
  Monitor,
  Home,
  Settings,
  LogOut,
  Download,
  Filter,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useClients } from '@/contexts/ClientContext'
import { useAuth } from '@/contexts/AuthContext'

// Función para generar datos de reportes basados en clientes reales
const generateReportData = (period: string, clients: any[]) => {
  const activeClients = clients.filter(client => client.status === 'active')
  const totalMonthlyIncome = activeClients.reduce((sum, client) => sum + client.monthlyAmount, 0)

  // Generar datos simulados basados en datos reales
  const baseData = {
    daily: [
      { date: '2024-01-20', ingresos: Math.round(totalMonthlyIncome * 0.15), clientes: Math.round(activeClients.length * 0.3), label: 'Lun 20' },
      { date: '2024-01-21', ingresos: Math.round(totalMonthlyIncome * 0.12), clientes: Math.round(activeClients.length * 0.25), label: 'Mar 21' },
      { date: '2024-01-22', ingresos: Math.round(totalMonthlyIncome * 0.18), clientes: Math.round(activeClients.length * 0.35), label: 'Mié 22' },
      { date: '2024-01-23', ingresos: Math.round(totalMonthlyIncome * 0.10), clientes: Math.round(activeClients.length * 0.20), label: 'Jue 23' },
      { date: '2024-01-24', ingresos: Math.round(totalMonthlyIncome * 0.08), clientes: Math.round(activeClients.length * 0.15), label: 'Vie 24' },
      { date: '2024-01-25', ingresos: Math.round(totalMonthlyIncome * 0.22), clientes: Math.round(activeClients.length * 0.40), label: 'Sáb 25' },
      { date: '2024-01-26', ingresos: Math.round(totalMonthlyIncome * 0.20), clientes: Math.round(activeClients.length * 0.35), label: 'Dom 26' }
    ],
    weekly: [
      { date: '2024-W1', ingresos: Math.round(totalMonthlyIncome * 0.8), clientes: activeClients.length, label: 'Semana 1' },
      { date: '2024-W2', ingresos: Math.round(totalMonthlyIncome * 1.1), clientes: Math.round(activeClients.length * 1.1), label: 'Semana 2' },
      { date: '2024-W3', ingresos: Math.round(totalMonthlyIncome * 0.9), clientes: Math.round(activeClients.length * 0.95), label: 'Semana 3' },
      { date: '2024-W4', ingresos: Math.round(totalMonthlyIncome * 1.2), clientes: Math.round(activeClients.length * 1.15), label: 'Semana 4' },
      { date: '2024-W5', ingresos: Math.round(totalMonthlyIncome * 1.0), clientes: activeClients.length, label: 'Semana 5' },
      { date: '2024-W6', ingresos: Math.round(totalMonthlyIncome * 1.3), clientes: Math.round(activeClients.length * 1.2), label: 'Semana 6' }
    ],
    monthly: [
      { date: '2024-07', ingresos: Math.round(totalMonthlyIncome * 0.85), clientes: Math.round(activeClients.length * 0.9), label: 'Julio' },
      { date: '2024-08', ingresos: Math.round(totalMonthlyIncome * 0.95), clientes: Math.round(activeClients.length * 0.95), label: 'Agosto' },
      { date: '2024-09', ingresos: Math.round(totalMonthlyIncome * 1.05), clientes: Math.round(activeClients.length * 1.05), label: 'Septiembre' },
      { date: '2024-10', ingresos: Math.round(totalMonthlyIncome * 0.90), clientes: Math.round(activeClients.length * 0.95), label: 'Octubre' },
      { date: '2024-11', ingresos: Math.round(totalMonthlyIncome * 1.10), clientes: Math.round(activeClients.length * 1.1), label: 'Noviembre' },
      { date: '2024-12', ingresos: totalMonthlyIncome, clientes: activeClients.length, label: 'Diciembre' }
    ],
    yearly: [
      { date: '2021', ingresos: Math.round(totalMonthlyIncome * 8), clientes: Math.round(activeClients.length * 0.6), label: '2021' },
      { date: '2022', ingresos: Math.round(totalMonthlyIncome * 10), clientes: Math.round(activeClients.length * 0.75), label: '2022' },
      { date: '2023', ingresos: Math.round(totalMonthlyIncome * 11), clientes: Math.round(activeClients.length * 0.9), label: '2023' },
      { date: '2024', ingresos: Math.round(totalMonthlyIncome * 12), clientes: activeClients.length, label: '2024' }
    ]
  }

  return baseData[period as keyof typeof baseData] || baseData.monthly
}

// Distribución de planes basada en datos reales
const getPlanDistribution = (clients: any[]) => {
  const activeClients = clients.filter(client => client.status === 'active')
  const planCounts = activeClients.reduce((acc, client) => {
    acc[client.plan] = (acc[client.plan] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = activeClients.length
  if (total === 0) return []

  const colors = {
    'Premium': '#8B5CF6',
    'Standard': '#3B82F6',
    'Básico': '#10B981',
    'Basic': '#10B981'
  }

  return Object.entries(planCounts).map(([plan, count]) => ({
    name: plan,
    value: Math.round((count / total) * 100),
    color: colors[plan as keyof typeof colors] || '#6B7280'
  }))
}

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [reportData, setReportData] = useState<any[]>([])
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showCustomRange, setShowCustomRange] = useState(false)
  const { clients } = useClients()
  const { logout } = useAuth()

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  useEffect(() => {
    setReportData(generateReportData(selectedPeriod, clients))
  }, [selectedPeriod, clients])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const maxValue = Math.max(...reportData.map(item => item.ingresos))

  const exportData = (type: string) => {
    const filename = `LED1_${type}_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`

    let csvContent = 'Fecha,Ingresos,Clientes\n'
    reportData.forEach(item => {
      csvContent += `${item.label},${item.ingresos},${item.clientes}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const generateCustomRangeData = () => {
    if (!customStartDate || !customEndDate) {
      alert('Por favor selecciona ambas fechas')
      return
    }

    const startDate = new Date(customStartDate)
    const endDate = new Date(customEndDate)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

    // Generar datos para el rango personalizado
    const customData = []
    const activeClients = clients.filter(client => client.status === 'active')
    const totalMonthlyIncome = activeClients.reduce((sum, client) => sum + client.monthlyAmount, 0)
    const dailyAverage = totalMonthlyIncome / 30

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      customData.push({
        date: currentDate.toISOString().split('T')[0],
        ingresos: Math.round(dailyAverage * (0.8 + Math.random() * 0.4)),
        clientes: Math.round(activeClients.length * (0.1 + Math.random() * 0.3)),
        label: currentDate.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })
      })
    }

    setReportData(customData)
    setSelectedPeriod('custom')
  }

  const planDistribution = getPlanDistribution(clients)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="nexus-card p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Reportes y Analíticas</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportData('datos_actuales')}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos
              </button>
              <button
                onClick={() => exportData('resumen_mensual')}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Resumen Mensual
              </button>
              <button
                onClick={() => exportData('resumen_anual')}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Resumen Anual
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Period Selector */}
          <div className="nexus-card p-6 mb-6 fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                {[
                  { key: 'daily', label: 'Diario' },
                  { key: 'weekly', label: 'Semanal' },
                  { key: 'monthly', label: 'Mensual' },
                  { key: 'yearly', label: 'Anual' }
                ].map(period => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period.key
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCustomRange(!showCustomRange)}
                  className="nexus-btn nexus-btn-secondary text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Rango Personalizado
                </button>
              </div>
            </div>

            {showCustomRange && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={generateCustomRangeData}
                    className="nexus-btn nexus-btn-primary"
                  >
                    Generar Reporte
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="nexus-card p-6 mb-6 fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Curva de Ingresos</h2>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span>Tendencia positiva</span>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2">
              {reportData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 relative"
                    style={{ height: `${(item.ingresos / maxValue) * 200}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(item.ingresos)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary Stats */}
            <div className="nexus-card p-6 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Período</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ingresos Totales:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(reportData.reduce((sum, item) => sum + item.ingresos, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Promedio por período:</span>
                  <span className="text-lg font-medium text-gray-900">
                    {formatCurrency(reportData.reduce((sum, item) => sum + item.ingresos, 0) / reportData.length)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clientes Activos:</span>
                  <span className="text-lg font-medium text-blue-600">
                    {clients.filter(client => client.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor máximo:</span>
                  <span className="text-lg font-medium text-purple-600">
                    {formatCurrency(Math.max(...reportData.map(item => item.ingresos)))}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="nexus-card p-6 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución por Planes</h2>
              <div className="space-y-4">
                {planDistribution.length > 0 ? planDistribution.map((plan, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                      <span className="text-sm text-gray-600">{plan.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${plan.value}%`,
                          backgroundColor: plan.color
                        }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center">No hay datos de planes disponibles</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
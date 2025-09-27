'use client'

import { useState, useEffect } from 'react'
// Charts implementados con CSS puro para evitar dependencias externas
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

// Mock data para reportes
const generateReportData = (period: string) => {
  const baseData = {
    daily: [
      { date: '2024-01-20', ingresos: 4500, clientes: 3, label: 'Lun 20' },
      { date: '2024-01-21', ingresos: 3200, clientes: 2, label: 'Mar 21' },
      { date: '2024-01-22', ingresos: 4600, clientes: 3, label: 'Mié 22' },
      { date: '2024-01-23', ingresos: 2800, clientes: 2, label: 'Jue 23' },
      { date: '2024-01-24', ingresos: 600, clientes: 1, label: 'Vie 24' },
      { date: '2024-01-25', ingresos: 5200, clientes: 4, label: 'Sáb 25' },
      { date: '2024-01-26', ingresos: 3800, clientes: 3, label: 'Dom 26' }
    ],
    weekly: [
      { date: '2024-W1', ingresos: 18500, clientes: 12, label: 'Semana 1' },
      { date: '2024-W2', ingresos: 22300, clientes: 15, label: 'Semana 2' },
      { date: '2024-W3', ingresos: 19800, clientes: 13, label: 'Semana 3' },
      { date: '2024-W4', ingresos: 25100, clientes: 18, label: 'Semana 4' },
      { date: '2024-W5', ingresos: 21700, clientes: 14, label: 'Semana 5' },
      { date: '2024-W6', ingresos: 28300, clientes: 20, label: 'Semana 6' }
    ],
    monthly: [
      { date: '2024-07', ingresos: 45200, clientes: 22, label: 'Julio' },
      { date: '2024-08', ingresos: 48750, clientes: 24, label: 'Agosto' },
      { date: '2024-09', ingresos: 52100, clientes: 26, label: 'Septiembre' },
      { date: '2024-10', ingresos: 49800, clientes: 25, label: 'Octubre' },
      { date: '2024-11', ingresos: 55300, clientes: 28, label: 'Noviembre' },
      { date: '2024-12', ingresos: 58900, clientes: 30, label: 'Diciembre' }
    ],
    yearly: [
      { date: '2021', ingresos: 380000, clientes: 180, label: '2021' },
      { date: '2022', ingresos: 445000, clientes: 210, label: '2022' },
      { date: '2023', ingresos: 520000, clientes: 250, label: '2023' },
      { date: '2024', ingresos: 625000, clientes: 300, label: '2024' }
    ]
  }

  return baseData[period as keyof typeof baseData] || baseData.monthly
}

const planDistribution = [
  { name: 'Premium', value: 45, color: '#8B5CF6' },
  { name: 'Standard', value: 35, color: '#3B82F6' },
  { name: 'Basic', value: 20, color: '#10B981' }
]

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [reportData, setReportData] = useState<any[]>([])
  const [customDateRange, setCustomDateRange] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  useEffect(() => {
    setReportData(generateReportData(selectedPeriod))
  }, [selectedPeriod])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateGrowth = () => {
    if (reportData.length < 2) return 0
    const current = reportData[reportData.length - 1].ingresos
    const previous = reportData[reportData.length - 2].ingresos
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const getTotalIngresos = () => {
    return reportData.reduce((sum, item) => sum + item.ingresos, 0)
  }

  const getAverageIngresos = () => {
    return Math.round(getTotalIngresos() / reportData.length)
  }

  const getPeriodLabel = () => {
    if (customDateRange && startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('es-AR')
      const end = new Date(endDate).toLocaleDateString('es-AR')
      return `Del ${start} al ${end}`
    }

    const labels = {
      daily: 'Últimos 7 días',
      weekly: 'Últimas 6 semanas',
      monthly: 'Últimos 6 meses',
      yearly: 'Últimos 4 años'
    }
    return labels[selectedPeriod as keyof typeof labels]
  }

  const generateCustomRangeData = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const data = []

    const current = new Date(startDate)
    while (current <= endDate) {
      const randomIngresos = Math.floor(Math.random() * 8000) + 2000
      const randomClientes = Math.floor(Math.random() * 5) + 1

      data.push({
        date: current.toISOString().split('T')[0],
        ingresos: randomIngresos,
        clientes: randomClientes,
        label: current.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit'
        })
      })
      current.setDate(current.getDate() + 1)
    }

    return data
  }

  const exportData = () => {
    const csvContent = [
      ['Período', 'Ingresos', 'Clientes'],
      ...reportData.map(item => [item.label, item.ingresos, item.clientes])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fileName = customDateRange && startDate && endDate
      ? `reporte-${startDate}-${endDate}.csv`
      : `reporte-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateMonthlySummary = () => {
    const summary = [
      ['Mes', 'Ingresos Totales', 'Clientes Promedio', 'Mejor Día'],
      ['Enero 2024', '$52,300', '25', 'Día 15'],
      ['Febrero 2024', '$48,750', '23', 'Día 28'],
      ['Marzo 2024', '$55,900', '27', 'Día 12'],
      ['Abril 2024', '$49,200', '24', 'Día 22'],
      ['Mayo 2024', '$58,100', '29', 'Día 8'],
      ['Junio 2024', '$51,400', '26', 'Día 19']
    ]

    const csvContent = summary.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumen-mensual-${new Date().getFullYear()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateYearlySummary = () => {
    const summary = [
      ['Año', 'Ingresos Totales', 'Clientes Totales', 'Crecimiento', 'Mejor Mes'],
      ['2021', '$380,000', '180', '-', 'Diciembre'],
      ['2022', '$445,000', '210', '+17.1%', 'Noviembre'],
      ['2023', '$520,000', '250', '+16.9%', 'Diciembre'],
      ['2024', '$625,000', '300', '+20.2%', 'Mayo']
    ]

    const csvContent = summary.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumen-anual-${new Date().getFullYear()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      const customData = generateCustomRangeData(startDate, endDate)
      setReportData(customData)
    }
  }

  const resetToPresetPeriod = () => {
    setCustomDateRange(false)
    setStartDate('')
    setEndDate('')
    setReportData(generateReportData(selectedPeriod))
  }

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

  const growth = parseFloat(calculateGrowth())

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
          <button className="nexus-sidebar-item w-full justify-start text-red-600 hover:bg-red-50">
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
              <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateMonthlySummary}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Resumen Mensual
              </button>
              <button
                onClick={generateYearlySummary}
                className="nexus-btn nexus-btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Resumen Anual
              </button>
              <button
                onClick={exportData}
                className="nexus-btn nexus-btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Controls */}
          <div className="nexus-card p-6 mb-8 fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Ingresos</h2>
                <p className="text-gray-600">{getPeriodLabel()}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="customRange"
                    checked={customDateRange}
                    onChange={(e) => {
                      setCustomDateRange(e.target.checked)
                      if (!e.target.checked) {
                        resetToPresetPeriod()
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="customRange" className="text-sm font-medium text-gray-700">
                    Rango personalizado
                  </label>
                </div>

                {customDateRange ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleCustomDateFilter}
                      disabled={!startDate || !endDate}
                      className="nexus-btn nexus-btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Filtrar
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="daily">Por día</option>
                    <option value="weekly">Por semana</option>
                    <option value="monthly">Por mes</option>
                    <option value="yearly">Por año</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className={`flex items-center text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {Math.abs(growth)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total del Período</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(getTotalIngresos())}</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Promedio</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(getAverageIngresos())}</p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Mejor Período</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(Math.max(...reportData.map(d => d.ingresos)))}
              </p>
            </div>

            <div className="nexus-card p-6 fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Clientes</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {reportData.reduce((sum, item) => sum + item.clientes, 0)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Line Chart */}
            <div className="nexus-card p-6 fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Ingresos</h3>
              <div className="h-80 relative">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                  {reportData.map((item, index) => {
                    const maxValue = Math.max(...reportData.map(d => d.ingresos))
                    const height = (item.ingresos / maxValue) * 100
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="relative group">
                          <div
                            className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm cursor-pointer hover:from-indigo-700 hover:to-indigo-500 transition-colors"
                            style={{ height: `${height * 2.4}px`, minHeight: '20px', width: '24px' }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {formatCurrency(item.ingresos)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                          {item.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                <div className="absolute bottom-0 left-0 top-0 w-px bg-gray-300"></div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="nexus-card p-6 fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cantidad de Clientes</h3>
              <div className="h-80 relative">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                  {reportData.map((item, index) => {
                    const maxValue = Math.max(...reportData.map(d => d.clientes))
                    const height = (item.clientes / maxValue) * 100
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 mx-1">
                        <div className="relative group">
                          <div
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t cursor-pointer hover:from-green-700 hover:to-green-500 transition-colors"
                            style={{ height: `${height * 2.4}px`, minHeight: '20px', width: '32px' }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.clientes} clientes
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-center">
                          {item.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
                <div className="absolute bottom-0 left-0 top-0 w-px bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="nexus-card p-6 fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Plan</h3>
              <div className="h-80 flex items-center justify-center">
                <div className="relative">
                  {/* Donut Chart simulado con CSS */}
                  <div className="w-48 h-48 rounded-full relative" style={{
                    background: `conic-gradient(
                      #8B5CF6 0deg ${planDistribution[0].value * 3.6}deg,
                      #3B82F6 ${planDistribution[0].value * 3.6}deg ${(planDistribution[0].value + planDistribution[1].value) * 3.6}deg,
                      #10B981 ${(planDistribution[0].value + planDistribution[1].value) * 3.6}deg 360deg
                    )`
                  }}>
                    <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                        <p className="text-sm text-gray-600">Clientes</p>
                      </div>
                    </div>
                  </div>

                  {/* Leyenda */}
                  <div className="mt-6 space-y-3">
                    {planDistribution.map((plan, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: plan.color }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {plan.name}: {plan.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="nexus-card p-6 fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Período</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Período más rentable:</span>
                    <span className="font-semibold text-gray-900">
                      {reportData.find(d => d.ingresos === Math.max(...reportData.map(r => r.ingresos)))?.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crecimiento promedio:</span>
                    <span className={`font-semibold ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {growth >= 0 ? '+' : ''}{growth}%
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ingresos por cliente promedio:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(getTotalIngresos() / reportData.reduce((sum, item) => sum + item.clientes, 0))}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-medium">Proyección próximo período:</span>
                    <span className="font-bold text-green-800">
                      {formatCurrency(reportData[reportData.length - 1]?.ingresos * 1.1 || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
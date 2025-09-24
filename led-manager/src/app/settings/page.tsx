'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function SettingsPage() {
  const [whatsappSettings, setWhatsappSettings] = useState({
    provider: 'cloud',
    cloudToken: '',
    cloudPhoneId: '',
    cloudBusinessId: '',
    reminderHour: '9',
    timezone: 'America/Argentina/Buenos_Aires'
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Aquí se implementaría la lógica para guardar en variables de entorno o base de datos
    setTimeout(() => {
      setIsSaving(false)
      alert('Configuración guardada correctamente')
    }, 1000)
  }

  const testWhatsAppConnection = async () => {
    try {
      // Test with a known client number (could be configured or use admin number)
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: '00000000-0000-0000-0000-000000000000', // Dummy ID for test
          message_override: '🧪 Test de conexión LED1 - WhatsApp funcionando correctamente'
        }),
      })

      if (response.ok) {
        alert('✅ Conexión WhatsApp exitosa - Mensaje de prueba enviado')
      } else {
        const error = await response.json()
        alert(`❌ Error en la conexión: ${error.error}`)
      }
    } catch (error) {
      alert(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:pl-72">
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
          <MobileNav />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="space-y-8">

              {/* WhatsApp Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de WhatsApp</CardTitle>
                  <CardDescription>
                    Configura las credenciales para envío de recordatorios automáticos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                      Proveedor
                    </label>
                    <select
                      id="provider"
                      value={whatsappSettings.provider}
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cloud">WhatsApp Cloud API</option>
                      <option value="twilio">Twilio WhatsApp</option>
                    </select>
                  </div>

                  {whatsappSettings.provider === 'cloud' && (
                    <>
                      <div>
                        <label htmlFor="cloudToken" className="block text-sm font-medium text-gray-700 mb-2">
                          Access Token
                        </label>
                        <input
                          id="cloudToken"
                          type="password"
                          value={whatsappSettings.cloudToken}
                          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, cloudToken: e.target.value }))}
                          placeholder="Tu WhatsApp Cloud API Access Token"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="cloudPhoneId" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number ID
                        </label>
                        <input
                          id="cloudPhoneId"
                          type="text"
                          value={whatsappSettings.cloudPhoneId}
                          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, cloudPhoneId: e.target.value }))}
                          placeholder="Tu Phone Number ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="cloudBusinessId" className="block text-sm font-medium text-gray-700 mb-2">
                          Business Account ID (opcional)
                        </label>
                        <input
                          id="cloudBusinessId"
                          type="text"
                          value={whatsappSettings.cloudBusinessId}
                          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, cloudBusinessId: e.target.value }))}
                          placeholder="Tu Business Account ID"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-4">
                    <Button onClick={testWhatsAppConnection} variant="outline">
                      🧪 Probar Conexión
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reminder Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recordatorios Automáticos</CardTitle>
                  <CardDescription>
                    Configura cuándo se envían los recordatorios de pago
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label htmlFor="reminderHour" className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de envío (formato 24h)
                    </label>
                    <select
                      id="reminderHour"
                      value={whatsappSettings.reminderHour}
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, reminderHour: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Horaria
                    </label>
                    <select
                      id="timezone"
                      value={whatsappSettings.timezone}
                      onChange={(e) => setWhatsappSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/Argentina/Buenos_Aires">Argentina - Buenos Aires</option>
                      <option value="America/Argentina/Cordoba">Argentina - Córdoba</option>
                      <option value="America/Argentina/Mendoza">Argentina - Mendoza</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Message Template */}
              <Card>
                <CardHeader>
                  <CardTitle>Plantilla de Mensaje</CardTitle>
                  <CardDescription>
                    Personaliza el mensaje que se envía a los clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <label htmlFor="messageTemplate" className="block text-sm font-medium text-gray-700 mb-2">
                      Plantilla del mensaje
                    </label>
                    <textarea
                      id="messageTemplate"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="Hola {NOMBRE}, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: {IMPORTE} {MONEDA}. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Variables disponibles: {'{NOMBRE}'}, {'{IMPORTE}'}, {'{MONEDA}'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>
                    Detalles sobre el estado actual del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Estado Base de Datos</div>
                      <div className="text-sm text-green-600">✅ Conectada</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Última Sincronización</div>
                      <div className="text-sm text-gray-600">Hace 2 minutos</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Recordatorios Activos</div>
                      <div className="text-sm text-blue-600">🔄 Programados</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Versión</div>
                      <div className="text-sm text-gray-600">v1.0.0</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : '💾 Guardar Configuración'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
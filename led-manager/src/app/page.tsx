import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-8xl mb-6">🚀</div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          LED1 Dashboard
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Sistema completo de gestión para pantalla LED con recordatorios automáticos por WhatsApp
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="text-lg font-semibold mb-2">Demo Interactivo</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Explora el dashboard sin configuración. Datos de ejemplo incluidos.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Ver Demo →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-lg font-semibold mb-2">Demo HTML</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Versión estática del dashboard para presentaciones.
            </p>
            <a
              href="/demo.html"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full"
            >
              Ver HTML →
            </a>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">🚀 Funcionalidades Implementadas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Dashboard con KPIs en tiempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Gestión completa de clientes (CRUD)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Integración WhatsApp Cloud API</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Autenticación con social login</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Diseño responsive y mobile-first</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Base de datos Supabase completa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Recordatorios automáticos diarios</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm">Configuración completa en UI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            <strong>Stack:</strong> Next.js 15 • TypeScript • Tailwind CSS • Supabase • shadcn/ui • WhatsApp Cloud API
          </p>
        </div>
      </div>
    </div>
  );
}

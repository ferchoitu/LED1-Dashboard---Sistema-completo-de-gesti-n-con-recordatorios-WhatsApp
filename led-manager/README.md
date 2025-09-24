# LED1 - Panel de Administración

Sistema completo de gestión para pantalla LED en vía pública con recordatorios automáticos por WhatsApp.

## 🚀 Características Principales

### 📊 Dashboard Intuitivo
- **KPIs en tiempo real**: Clientes activos, MRR esperado, pagos de hoy, vencidos
- **Vista centralizada**: Clientes a cobrar hoy y atrasados con acciones rápidas
- **Responsive**: Optimizado para desktop y mobile

### 👥 Gestión Completa de Clientes
- **CRUD completo**: Crear, editar, pausar y finalizar clientes
- **Formularios validados**: Con Zod y React Hook Form
- **Filtros avanzados**: Por estado, nombre, empresa o teléfono
- **Export CSV**: Exportar lista completa de clientes

### 📱 Integración WhatsApp
- **Recordatorios automáticos**: Enviados el día de vencimiento
- **Recordatorios manuales**: Botón desde dashboard y lista de clientes
- **Meta Cloud API**: Integración completa con WhatsApp Business
- **Plantillas personalizables**: Mensaje configurable con variables

### ⚙️ Configuración Avanzada
- **WhatsApp setup**: Configuración de tokens y credenciales
- **Horarios**: Configurar hora y zona horaria de envío
- **Plantillas**: Personalizar mensajes con variables dinámicas
- **Test de conexión**: Verificar configuración WhatsApp

### 🔒 Autenticación Segura
- **Social Login**: Google y Apple integrados
- **Magic Links**: Enlace por email sin contraseñas
- **Protección de rutas**: Middleware con Supabase Auth
- **RLS**: Row Level Security en base de datos

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Validaciones**: Zod + React Hook Form
- **WhatsApp**: WhatsApp Cloud API
- **Fechas**: date-fns (zona horaria Argentina)

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- WhatsApp Business Account (para recordatorios)

## 🔧 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
cd led-manager
npm install --legacy-peer-deps
```

### 2. Configurar Variables de Entorno

Crear archivo `.env.local` basado en `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# WhatsApp Configuration
WHATSAPP_PROVIDER=cloud
WHATSAPP_CLOUD_TOKEN=tu_whatsapp_token
WHATSAPP_CLOUD_PHONE_ID=tu_phone_id
WHATSAPP_CLOUD_BUSINESS_ID=tu_business_id

# Application Configuration
REMINDER_HOUR_LOCAL=9
TZ=America/Argentina/Buenos_Aires
```

### 3. Configurar Base de Datos

#### Crear tablas y vistas:
```sql
-- Ejecutar el contenido de supabase/schema.sql en tu proyecto Supabase
```

#### Poblar con datos de ejemplo:
```sql
-- Ejecutar el contenido de supabase/seed.sql
```

### 4. Desplegar Edge Function (Opcional)

Para recordatorios automáticos:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login y enlazar proyecto
supabase login
supabase link --project-ref TU_PROJECT_ID

# Desplegar función
supabase functions deploy send_whatsapp_reminders
```

Configurar CRON en el dashboard de Supabase:
```sql
select cron.schedule('whatsapp-reminders', '0 12 * * *', 'https://TU_PROJECT.supabase.co/functions/v1/send_whatsapp_reminders');
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Estructura del Proyecto

```
led-manager/
├── src/
│   ├── app/                 # App Router (Next.js 15)
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── clients/        # Gestión de clientes
│   │   ├── settings/       # Configuración
│   │   └── signin/         # Autenticación
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   └── layout/        # Layout components
│   └── lib/               # Utilidades y configuración
├── supabase/
│   ├── functions/         # Edge Functions
│   ├── schema.sql         # Esquema de base de datos
│   ├── seed.sql          # Datos de ejemplo
│   └── config.toml       # Configuración Supabase
└── public/               # Archivos estáticos
```

## 🗄 Modelo de Datos

### Tablas Principales

- **clients**: Información de clientes y configuración de cobros
- **payments**: Registro de pagos realizados
- **notifications_log**: Historial de mensajes WhatsApp enviados
- **profiles**: Perfiles de usuario (opcional)

### Vistas Materializadas

- **v_kpis**: KPIs del dashboard (clientes activos, MRR, pendientes)
- **v_expected_monthly**: Ingresos esperados por mes

## 🔐 Seguridad

- **RLS (Row Level Security)**: Habilitado en todas las tablas
- **Autenticación**: Magic links por email
- **Validación**: Esquemas Zod en frontend y backend
- **API Protection**: Middleware de autenticación

## 📱 WhatsApp Integration

### Configuración

1. Crear WhatsApp Business Account
2. Obtener credenciales de WhatsApp Cloud API
3. Configurar webhook (opcional)
4. Configurar variables de entorno

### Mensaje Template

Los mensajes siguen el formato:
```
Hola {NOMBRE}, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: {IMPORTE} {MONEDA}. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Conectar con Vercel
vercel

# Configurar variables de entorno en Vercel Dashboard
# Desplegar
vercel --prod
```

### Otras Plataformas

La aplicación es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify

## 📈 Uso

### Dashboard
- Vista general de KPIs
- Clientes a cobrar hoy
- Clientes con pagos vencidos
- Acciones rápidas de cobro

### Gestión de Clientes
- Lista completa con filtros
- Formulario de alta/edición
- Cambios de estado
- Exportación CSV

### Configuración
- Credenciales WhatsApp
- Horarios de recordatorios
- Plantillas de mensajes

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de dependencias**: Ejecutar `npm install --legacy-peer-deps`
2. **Error RLS**: Verificar políticas en Supabase Dashboard
3. **WhatsApp no envía**: Verificar tokens y phone_id
4. **Fechas incorrectas**: Verificar configuración de timezone

### Logs

- **Frontend**: Console del navegador
- **API Routes**: Logs de Vercel/plataforma
- **Edge Functions**: Logs en Supabase Dashboard

## 📞 Soporte

Para soporte técnico o consultas, crear issue en el repositorio.

---

**LED1 Manager** - Gestión simple y eficiente para tu negocio de publicidad LED 🚀

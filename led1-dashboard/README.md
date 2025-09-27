# LED1 Dashboard 🚀

Dashboard MVP para la gestión de pantallas LED publicitarias con diseño moderno inspirado en Nexus UI.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz limpia e intuitiva inspirada en Nexus UI
- 👤 **Autenticación por Email**: Acceso seguro desde cualquier computadora
- 📊 **Dashboard de Métricas**: KPIs financieros en tiempo real
- 👥 **Gestión de Clientes**: CRUD completo para administrar clientes
- 💰 **Control Financiero**: Seguimiento de ingresos mensuales y cobros pendientes
- 📱 **Responsive**: Optimizado para desktop y mobile
- ⚡ **Deploy en Netlify**: Configurado para deployment automático

## 🎯 Funcionalidades MVP

### Dashboard Principal
- Clientes activos
- Ingresos mensuales recurrentes (MRR)
- Clientes por cobrar hoy
- Clientes con pagos vencidos
- Acciones rápidas (marcar como pagado, enviar recordatorios)

### Gestión de Clientes
- Lista completa de clientes con filtros
- Agregar nuevos clientes
- Ver detalles de cada cliente
- Control de altas y bajas
- Planes y fechas de facturación

### Autenticación
- Login con email y contraseña
- Interfaz de registro
- Validación de formularios

## 🚀 Quick Start

### Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
# Construir para producción
npm run build

# El build se genera en la carpeta 'out'
```

## 🌐 Deploy en Netlify

### Opción 1: Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login a Netlify
netlify login

# Deploy
npm run build
netlify deploy --prod --dir=out
```

### Opción 2: Git Integration
1. Conecta tu repositorio con Netlify
2. Configuración automática:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

### Opción 3: Drag & Drop
1. Ejecuta `npm run build`
2. Arrastra la carpeta `out` a Netlify

## 🎨 Diseño y UX

El dashboard está diseñado con:
- **Colores**: Paleta inspirada en Nexus UI (púrpuras, azules, acentos verdes)
- **Tipografía**: Inter font para mejor legibilidad
- **Componentes**: Cards con glassmorphism y efectos hover
- **Animaciones**: Transiciones suaves y microinteracciones
- **Layout**: Sidebar responsive con navegación clara

## 📱 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page con auth
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard principal
│   │   └── clients/
│   │       └── page.tsx      # Gestión de clientes
│   ├── globals.css           # Estilos Nexus UI
│   └── layout.tsx
```

## 🔧 Tecnologías

- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Lucide React
- **TypeScript**: Para type safety
- **Deploy**: Netlify con static export

## 📊 Data Mock

Actualmente usa datos de ejemplo (mock data) para demostrar la funcionalidad:
- 24 clientes activos
- $48,750 ARS de ingresos mensuales
- 3 clientes por cobrar hoy
- 2 clientes con pagos vencidos

## 🎯 Próximos Pasos

Para convertir este MVP en una aplicación completa:

1. **Base de Datos**: Integrar Supabase o Firebase
2. **Autenticación Real**: Implementar auth providers
3. **API**: Crear endpoints para CRUD operations
4. **Notificaciones**: Sistema de recordatorios automáticos
5. **Reportes**: Gráficos y exportación de datos
6. **Multi-tenant**: Soporte para múltiples usuarios

## 📄 Licencia

MIT License - Siéntete libre de usar este código para tu negocio.

---

**LED1 Dashboard** - Gestión inteligente de pantallas LED 🖥️✨

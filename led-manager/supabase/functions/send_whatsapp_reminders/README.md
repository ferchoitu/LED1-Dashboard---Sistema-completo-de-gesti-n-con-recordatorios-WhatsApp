# WhatsApp Reminders Edge Function

Esta función de Supabase Edge Functions se encarga de enviar recordatorios automáticos de pago por WhatsApp a los clientes de LED1.

## Funcionalidad

- Ejecuta diariamente a las 09:00 (horario Argentina)
- Identifica clientes activos cuyo `billing_day` coincide con el día actual
- Verifica si el cliente ya pagó el mes actual
- Envía recordatorios por WhatsApp solo a clientes que no han pagado
- Registra todos los intentos de envío en `notifications_log`

## Variables de Entorno Requeridas

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# WhatsApp Cloud API
WHATSAPP_PROVIDER=cloud
WHATSAPP_CLOUD_TOKEN=your_access_token
WHATSAPP_CLOUD_PHONE_ID=your_phone_number_id
WHATSAPP_CLOUD_BUSINESS_ID=your_business_account_id
```

## Despliegue

1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

2. Login a Supabase:
```bash
supabase login
```

3. Enlazar proyecto:
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

4. Desplegar la función:
```bash
supabase functions deploy send_whatsapp_reminders
```

5. Configurar las variables de entorno en el dashboard de Supabase

## Programación CRON

La función se ejecuta automáticamente usando el CRON configurado en `supabase/config.toml`:

```toml
[functions.send_whatsapp_reminders]
verify_jwt = false
```

Y el CRON job:
```sql
select cron.schedule('whatsapp-reminders', '0 12 * * *', 'http://localhost:54321/functions/v1/send_whatsapp_reminders');
```

## Testing Manual

Puedes probar la función manualmente:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send_whatsapp_reminders' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

## Respuesta de la Función

```json
{
  "success": true,
  "message": "Processed 3 clients",
  "processed": 3,
  "sent": 2,
  "failed": 1,
  "details": [
    {
      "client_id": "uuid",
      "name": "Cliente Nombre",
      "status": "sent"
    }
  ]
}
```

## Logs y Auditoría

Todos los intentos de envío se registran en la tabla `notifications_log` con:
- Estado del envío (sent/failed/pending)
- ID del mensaje del proveedor
- Cuerpo del mensaje enviado
- Mensaje de error (si aplica)
- Timestamp del envío
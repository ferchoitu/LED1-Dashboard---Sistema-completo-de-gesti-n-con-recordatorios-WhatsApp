-- LED1 Manager Seed Data
-- Sample data for development and testing

-- Insert sample clients with different billing days
INSERT INTO clients (name, business_name, phone_e164, whatsapp_opt_in, status, start_date, end_date, ticket_amount, currency, billing_frequency, billing_day, notes) VALUES
  ('Juan Pérez', 'Panadería El Buen Pan', '+5491134567890', true, 'active', '2024-01-15', NULL, 150000.00, 'ARS', 'monthly', 15, 'Cliente fundador, siempre paga a tiempo'),
  ('María González', 'Farmacia Central', '+5491145678901', true, 'active', '2024-02-01', NULL, 180000.00, 'ARS', 'monthly', 1, 'Ubicación premium, muy visible'),
  ('Carlos Rodríguez', 'Taller Mecánico Rodriguez', '+5491156789012', true, 'active', '2024-01-20', NULL, 120000.00, 'ARS', 'monthly', 20, 'Descuento por pago anual'),
  ('Ana López', 'Inmobiliaria López & Asoc.', '+5491167890123', true, 'active', '2024-03-05', NULL, 200000.00, 'ARS', 'monthly', 5, 'Cliente VIP, múltiples propiedades'),
  ('Roberto Silva', 'Restaurante La Esquina', '+5491178901234', true, 'active', '2024-02-10', NULL, 150000.00, 'ARS', 'monthly', 10, 'Horarios especiales de publicidad'),
  ('Laura Martínez', 'Clínica Dental Sonrisas', '+5491189012345', true, 'paused', '2024-01-25', NULL, 175000.00, 'ARS', 'monthly', 25, 'Pausado temporalmente por renovaciones'),
  ('Diego Fernández', 'Librería Saber', '+5491190123456', true, 'active', '2024-03-12', NULL, 130000.00, 'ARS', 'monthly', 12, 'Promociona eventos culturales'),
  ('Silvia Morales', 'Peluquería Estilo', '+5491101234567', true, 'active', '2024-02-28', NULL, 140000.00, 'ARS', 'monthly', 28, 'Publicidad de servicios de belleza'),
  ('Fernando Castro', 'Ferretería El Tornillo', '+5491112345678', true, 'ended', '2023-12-01', '2024-08-31', 160000.00, 'ARS', 'monthly', 1, 'Contrato finalizado, posible renovación'),
  ('Patricia Ruiz', 'Boutique Moda Actual', '+5491123456789', true, 'active', '2024-03-18', NULL, 220000.00, 'ARS', 'monthly', 18, 'Cliente premium, campañas estacionales');

-- Insert some payment records (some clients have paid, others haven't)
-- Current month payments (some paid, some pending)
INSERT INTO payments (client_id, period_year, period_month, amount, paid_at, notes) VALUES
  -- Juan Pérez (billing_day 15) - PAID
  ((SELECT id FROM clients WHERE name = 'Juan Pérez'), 2024, 9, 150000.00, '2024-09-15 10:30:00-03', 'Pago puntual'),

  -- María González (billing_day 1) - NOT PAID (will be overdue)
  -- Carlos Rodríguez (billing_day 20) - PAID
  ((SELECT id FROM clients WHERE name = 'Carlos Rodríguez'), 2024, 9, 120000.00, '2024-09-20 14:20:00-03', 'Transferencia bancaria'),

  -- Ana López (billing_day 5) - NOT PAID (will be overdue)
  -- Roberto Silva (billing_day 10) - PAID
  ((SELECT id FROM clients WHERE name = 'Roberto Silva'), 2024, 9, 150000.00, '2024-09-10 16:45:00-03', 'Pago en efectivo'),

  -- Laura Martínez - PAUSED (no payment expected)
  -- Diego Fernández (billing_day 12) - PAID
  ((SELECT id FROM clients WHERE name = 'Diego Fernández'), 2024, 9, 130000.00, '2024-09-12 11:15:00-03', 'Pago online'),

  -- Silvia Morales (billing_day 28) - NOT PAID (will be overdue)
  -- Fernando Castro - ENDED (no payment expected)
  -- Patricia Ruiz (billing_day 18) - PAID
  ((SELECT id FROM clients WHERE name = 'Patricia Ruiz'), 2024, 9, 220000.00, '2024-09-18 09:30:00-03', 'Pago adelantado');

-- Insert previous month payments for all active clients
INSERT INTO payments (client_id, period_year, period_month, amount, paid_at, notes) VALUES
  ((SELECT id FROM clients WHERE name = 'Juan Pérez'), 2024, 8, 150000.00, '2024-08-15 10:30:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'María González'), 2024, 8, 180000.00, '2024-08-01 09:15:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Carlos Rodríguez'), 2024, 8, 120000.00, '2024-08-20 14:20:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Ana López'), 2024, 8, 200000.00, '2024-08-05 11:45:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Roberto Silva'), 2024, 8, 150000.00, '2024-08-10 16:45:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Diego Fernández'), 2024, 8, 130000.00, '2024-08-12 11:15:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Silvia Morales'), 2024, 8, 140000.00, '2024-08-28 13:30:00-03', 'Pago agosto'),
  ((SELECT id FROM clients WHERE name = 'Patricia Ruiz'), 2024, 8, 220000.00, '2024-08-18 09:30:00-03', 'Pago agosto');

-- Insert some notification logs
INSERT INTO notifications_log (client_id, sent_at, status, provider_message_id, message_body) VALUES
  ((SELECT id FROM clients WHERE name = 'María González'), '2024-09-01 09:00:00-03', 'sent', 'wamid.123456789', 'Hola María, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: $180.000 ARS. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!'),
  ((SELECT id FROM clients WHERE name = 'Ana López'), '2024-09-05 09:00:00-03', 'sent', 'wamid.234567890', 'Hola Ana, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: $200.000 ARS. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!'),
  ((SELECT id FROM clients WHERE name = 'Silvia Morales'), '2024-09-28 09:00:00-03', 'sent', 'wamid.345678901', 'Hola Silvia, ¿cómo va? Te escribimos de LED1 para recordarte el abono de este mes: $140.000 ARS. Podés responder a este WhatsApp ante cualquier duda. ¡Gracias!');

-- Verify the data
SELECT 'Clients created:' as info, COUNT(*) as count FROM clients
UNION ALL
SELECT 'Active clients:', COUNT(*) FROM clients WHERE status = 'active'
UNION ALL
SELECT 'Payments recorded:', COUNT(*) FROM payments
UNION ALL
SELECT 'Notifications sent:', COUNT(*) FROM notifications_log;
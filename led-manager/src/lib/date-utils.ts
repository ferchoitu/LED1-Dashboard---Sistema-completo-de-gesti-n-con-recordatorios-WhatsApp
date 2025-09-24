import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Timezone configuration for Argentina
export const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

export function getCurrentDateInArgentina(): Date {
  return new Date();
}

export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: es });
}

export function formatDateTimeForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
}

export function getCurrentPeriod(): { year: number; month: number } {
  const now = getCurrentDateInArgentina();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
  };
}

export function getTodayInArgentina(): { day: number; month: number; year: number } {
  const now = getCurrentDateInArgentina();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

export function getNext7Days(): Date[] {
  const today = getCurrentDateInArgentina();
  const next7Days: Date[] = [];

  for (let i = 1; i <= 7; i++) {
    next7Days.push(addDays(today, i));
  }

  return next7Days;
}

export function isBillingDayToday(billingDay: number): boolean {
  const today = getTodayInArgentina();
  return today.day === billingDay;
}

export function isBillingDayOverdue(billingDay: number): boolean {
  const today = getTodayInArgentina();
  return today.day > billingDay;
}

export function isBillingDayUpcoming(billingDay: number, daysAhead: number = 7): boolean {
  const today = getTodayInArgentina();
  const next7Days = getNext7Days();

  return next7Days.some(date => date.getDate() === billingDay);
}

export function formatCurrency(amount: number, currency: string = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function isClientActive(client: { status: string; end_date?: string | null }): boolean {
  if (client.status !== 'active') return false;

  if (!client.end_date) return true;

  const today = getCurrentDateInArgentina();
  const endDate = parseISO(client.end_date);

  return isAfter(endDate, today) || format(endDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
}
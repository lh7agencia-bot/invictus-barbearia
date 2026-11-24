import { BUSINESS_INFO, SERVICES } from '../data/barbershopData';

export interface BookingInput {
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const WEEKDAY_SLOTS = [
  '09:00',
  '09:45',
  '10:30',
  '11:15',
  '13:30',
  '14:15',
  '15:00',
  '15:45',
  '16:30',
  '17:15',
  '18:00',
  '18:45',
];

const SATURDAY_SLOTS = [
  '09:00',
  '09:45',
  '10:30',
  '11:15',
  '13:00',
  '13:45',
  '14:30',
  '15:15',
  '16:00',
  '16:45',
  '17:30',
];

export function formatIsoDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextOpenDateIso(referenceDate: Date = new Date()): string {
  const cursor = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  // 0 = Sunday, 1 = Monday (closed)
  while (cursor.getDay() === 0 || cursor.getDay() === 1) {
    cursor.setDate(cursor.getDate() + 1);
  }
  return formatIsoDateLocal(cursor);
}

export function getDayStatus(dateStr: string): { isOpen: boolean; label: string } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { isOpen: false, label: 'Data inválida' };
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const parsed = new Date(y, m - 1, d);
  const day = parsed.getDay();
  if (day === 0 || day === 1) {
    return { isOpen: false, label: 'Fechado aos domingos e segundas-feiras' };
  }
  if (day === 6) {
    return { isOpen: true, label: 'Sábado (09:00 – 18:00)' };
  }
  return { isOpen: true, label: 'Atendimento normal (09:00 – 19:30)' };
}

export function generateTimeSlots(dateStr: string, now: Date = new Date()): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return [];
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const day = target.getDay();

  // Closed Sunday (0) and Monday (1)
  if (day === 0 || day === 1) {
    return [];
  }

  const baseSlots = day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
  const todayStr = formatIsoDateLocal(now);

  if (dateStr < todayStr) {
    return [];
  }

  if (dateStr > todayStr) {
    return [...baseSlots];
  }

  // Same day: only show slots at least 30 minutes ahead
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30;
  return baseSlots.filter((slot) => {
    const [hh, mm] = slot.split(':').map(Number);
    return hh * 60 + mm >= currentMinutes;
  });
}

export function formatDisplayDatePtBr(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function validateBookingInput(input: BookingInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!SERVICES.some((s) => s.id === input.serviceId)) {
    errors.serviceId = 'Selecione um serviço válido.';
  }

  const dayStatus = getDayStatus(input.date);
  if (!input.date || !dayStatus.isOpen) {
    errors.date = dayStatus.isOpen
      ? 'Informe uma data válida.'
      : 'Atendemos de terça a sábado. Escolha outra data.';
  }

  if (!input.time) {
    errors.time = 'Selecione um horário disponível.';
  }

  if (input.clientName.trim().length < 2) {
    errors.clientName = 'Informe seu nome completo.';
  }

  const digits = normalizePhoneDigits(input.clientPhone);
  if (digits.length < 10 || digits.length > 13) {
    errors.clientPhone = 'Informe um WhatsApp/telefone válido com DDD.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppBookingUrl(input: BookingInput): string {
  const service = SERVICES.find((s) => s.id === input.serviceId)?.name ?? input.serviceId;
  const formattedDate = formatDisplayDatePtBr(input.date);
  const text = [
    `Olá, ${BUSINESS_INFO.name}! Gostaria de confirmar um agendamento:`,
    `- Nome: ${input.clientName.trim()}`,
    `- Telefone: ${input.clientPhone.trim()}`,
    `- Serviço: ${service}`,
    `- Data: ${formattedDate}`,
    `- Horário: ${input.time}`,
  ].join('\n');

  return `https://wa.me/${BUSINESS_INFO.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export function validateContactInput(input: ContactInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.name.trim().length < 2) {
    errors.name = 'Informe seu nome.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(input.email.trim())) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }

  if (input.message.trim().length < 10) {
    errors.message = 'Escreva sua mensagem (mínimo de 10 caracteres).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppContactUrl(input: ContactInput): string {
  const text = [
    `Olá, ${BUSINESS_INFO.name}! Mensagem enviada pelo site:`,
    `- Nome: ${input.name.trim()}`,
    `- E-mail: ${input.email.trim()}`,
    `- Mensagem: ${input.message.trim()}`,
  ].join('\n');

  return `https://wa.me/${BUSINESS_INFO.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export function buildMailtoContactUrl(input: ContactInput): string {
  const subject = `Contato pelo site — ${input.name.trim()}`;
  const body = [
    `Nome: ${input.name.trim()}`,
    `E-mail: ${input.email.trim()}`,
    '',
    input.message.trim(),
  ].join('\n');

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

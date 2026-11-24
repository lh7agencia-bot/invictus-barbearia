import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppBookingUrl,
  buildWhatsAppContactUrl,
  formatDisplayDatePtBr,
  generateTimeSlots,
  getDayStatus,
  getNextOpenDateIso,
  validateBookingInput,
  validateContactInput,
} from './barbershop';

test('generateTimeSlots returns empty array on Sunday and Monday', () => {
  // 2026-11-22 is Sunday, 2026-11-23 is Monday
  assert.deepEqual(generateTimeSlots('2026-11-22', new Date(2026, 10, 20, 8, 0)), []);
  assert.deepEqual(generateTimeSlots('2026-11-23', new Date(2026, 10, 20, 8, 0)), []);
});

test('generateTimeSlots filters past slots on same day and includes Saturday schedule', () => {
  // Tuesday 2026-11-24 at 14:00 -> only slots >= 14:30
  const sameDaySlots = generateTimeSlots('2026-11-24', new Date(2026, 10, 24, 14, 0));
  assert.equal(sameDaySlots.includes('14:15'), false);
  assert.equal(sameDaySlots.includes('15:00'), true);

  // Saturday 2026-11-28 ends at 17:30
  const saturdaySlots = generateTimeSlots('2026-11-28', new Date(2026, 10, 24, 9, 0));
  assert.equal(saturdaySlots[saturdaySlots.length - 1], '17:30');
});

test('getNextOpenDateIso skips Sunday and Monday', () => {
  const sunday = new Date(2026, 10, 22, 10, 0);
  assert.equal(getNextOpenDateIso(sunday), '2026-11-24');
});

test('getDayStatus reports open and closed days accurately', () => {
  assert.equal(getDayStatus('2026-11-22').isOpen, false);
  assert.equal(getDayStatus('2026-11-24').isOpen, true);
});

test('validateBookingInput catches missing fields and accepts valid data', () => {
  const invalid = validateBookingInput({
    serviceId: 'unknown',
    date: '2026-11-22',
    time: '',
    clientName: 'A',
    clientPhone: '123',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.serviceId);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.time);
  assert.ok(invalid.errors.clientName);
  assert.ok(invalid.errors.clientPhone);

  const valid = validateBookingInput({
    serviceId: 'combo-invictus',
    date: '2026-11-25',
    time: '15:00',
    clientName: 'Carlos Eduardo',
    clientPhone: '(62) 99988-7766',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('buildWhatsAppBookingUrl formats INVICTUS Barbearia WhatsApp link', () => {
  const url = buildWhatsAppBookingUrl({
    serviceId: 'corte-classico',
    date: '2026-11-25',
    time: '10:30',
    clientName: 'Pedro Henrique',
    clientPhone: '62991112233',
  });
  assert.ok(url.startsWith('https://wa.me/5562992215161?text='));
  const decoded = decodeURIComponent(url.split('text=')[1]);
  assert.ok(decoded.includes('Corte Clássico & Tesoura'));
  assert.ok(decoded.includes('25/11/2026'));
  assert.ok(decoded.includes('10:30'));
});

test('validateContactInput and buildWhatsAppContactUrl validate email and message', () => {
  const invalid = validateContactInput({
    name: 'Jo',
    email: 'invalid-email',
    message: 'Oi',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactInput({
    name: 'João Paulo',
    email: 'joao@exemplo.com.br',
    message: 'Gostaria de saber se atendem no sábado pela manhã.',
  });
  assert.equal(valid.valid, true);

  const waUrl = buildWhatsAppContactUrl({
    name: 'João Paulo',
    email: 'joao@exemplo.com.br',
    message: 'Gostaria de saber se atendem no sábado pela manhã.',
  });
  assert.ok(waUrl.startsWith('https://wa.me/5562992215161?text='));
  assert.equal(formatDisplayDatePtBr('2026-11-25'), '25/11/2026');
});

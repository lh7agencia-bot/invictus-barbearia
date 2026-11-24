import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { SERVICES } from '../data/barbershopData';
import {
  buildWhatsAppBookingUrl,
  formatDisplayDatePtBr,
  formatIsoDateLocal,
  generateTimeSlots,
  getDayStatus,
  getNextOpenDateIso,
  validateBookingInput,
} from '../utils/barbershop';

interface BookingSectionProps {
  selectedServiceId: string;
  onChangeServiceId: (serviceId: string) => void;
}

export function BookingSection({
  selectedServiceId,
  onChangeServiceId,
}: BookingSectionProps) {
  const minDate = useMemo(() => formatIsoDateLocal(new Date()), []);
  const [date, setDate] = useState<string>(() => getNextOpenDateIso());
  const [time, setTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<{
    serviceName: string;
    dateDisplay: string;
    time: string;
    clientName: string;
    clientPhone: string;
    whatsappUrl: string;
  } | null>(null);

  const dayStatus = useMemo(() => getDayStatus(date), [date]);
  const availableSlots = useMemo(() => generateTimeSlots(date), [date]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(time)) {
      setTime(availableSlots[0]);
    } else if (availableSlots.length === 0) {
      setTime('');
    }
  }, [availableSlots, time]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateBookingInput({
      serviceId: selectedServiceId,
      date,
      time,
      clientName,
      clientPhone,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const serviceName =
      SERVICES.find((s) => s.id === selectedServiceId)?.name ?? selectedServiceId;

    setConfirmedBooking({
      serviceName,
      dateDisplay: formatDisplayDatePtBr(date),
      time,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      whatsappUrl: buildWhatsAppBookingUrl({
        serviceId: selectedServiceId,
        date,
        time,
        clientName,
        clientPhone,
      }),
    });
  };

  return (
    <section
      id="agendamento"
      className="scroll-mt-16 bg-[#1A1A1A] text-[#F5F4F0] py-16 lg:py-24 border-b border-[#4A4A4A]/40"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left column: context & operating rules */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#A8A6A0] mb-3">
              Agendamento Online
            </p>
            <h2
              className="font-display font-bold text-[#F5F4F0] leading-tight mb-5"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              Reserve seu horário com tranquilidade
            </h2>
            <p className="text-base text-[#D4D2CC] leading-relaxed mb-8">
              Escolha o serviço, a data e o horário de sua preferência. Ao confirmar,
              geramos sua solicitação pronta para confirmação imediata pelo WhatsApp da
              INVICTUS Barbearia.
            </p>

            <div className="border-t border-[#4A4A4A]/50 pt-6 space-y-4 text-sm text-[#D4D2CC]">
              <div>
                <p className="font-semibold text-[#F5F4F0] mb-1">Funcionamento</p>
                <p className="tabular-nums">Terça a Sexta: 09:00 às 19:30</p>
                <p className="tabular-nums">Sábado: 09:00 às 18:00</p>
                <p className="text-[#A8A6A0]">Domingo e Segunda: Fechado</p>
              </div>
              <div>
                <p className="font-semibold text-[#F5F4F0] mb-1">Dica de pontualidade</p>
                <p className="text-[#B8B5AE]">
                  Chegue 5 minutos antes do horário reservado para um atendimento sem pressa.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Booking form or Confirmation */}
          <div className="lg:col-span-7 bg-[#222222] border border-[#4A4A4A]/60 rounded-sm p-6 sm:p-8">
            {confirmedBooking ? (
              <div data-testid="booking-confirmation" className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-[#F5F4F0] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#F5F4F0] mb-1">
                      Pré-agendamento registrado
                    </h3>
                    <p className="text-sm text-[#D4D2CC]">
                      Envie os dados pelo botão abaixo para concluir a confirmação direta no
                      WhatsApp da barbearia.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-[#4A4A4A]/50 text-sm">
                  <div>
                    <dt className="text-xs text-[#A8A6A0] mb-1">Cliente</dt>
                    <dd className="font-medium text-[#F5F4F0]">{confirmedBooking.clientName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#A8A6A0] mb-1">WhatsApp</dt>
                    <dd className="font-medium text-[#F5F4F0] tabular-nums">
                      {confirmedBooking.clientPhone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#A8A6A0] mb-1">Serviço</dt>
                    <dd className="font-medium text-[#F5F4F0]">{confirmedBooking.serviceName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#A8A6A0] mb-1">Data e Horário</dt>
                    <dd className="font-medium text-[#F5F4F0] tabular-nums">
                      {confirmedBooking.dateDisplay} às {confirmedBooking.time}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={confirmedBooking.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Enviar confirmação no WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => setConfirmedBooking(null)}
                    className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-medium text-[#F5F4F0] border border-[#4A4A4A] hover:bg-[#2C2C2C] rounded-sm transition-colors cursor-pointer"
                  >
                    Alterar ou novo horário
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* 1. Service selection */}
                <div>
                  <label
                    htmlFor="booking-service"
                    className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                  >
                    1. Escolha o serviço
                  </label>
                  <select
                    id="booking-service"
                    value={selectedServiceId}
                    onChange={(e) => onChangeServiceId(e.target.value)}
                    className="w-full h-12 px-4 text-sm text-[#F5F4F0] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm focus:outline-none focus:border-[#F5F4F0]"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.duration})
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && (
                    <p className="mt-1.5 text-xs text-red-300" role="alert">
                      {errors.serviceId}
                    </p>
                  )}
                </div>

                {/* 2. Date picker */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <label
                      htmlFor="booking-date"
                      className="text-xs font-semibold tracking-wide text-[#D4D2CC]"
                    >
                      2. Selecione a data
                    </label>
                    <span
                      className={`text-xs ${
                        dayStatus.isOpen ? 'text-[#B8B5AE]' : 'text-amber-300'
                      }`}
                    >
                      {dayStatus.label}
                    </span>
                  </div>
                  <div className="relative">
                    <Calendar
                      className="w-4 h-4 text-[#A8A6A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setErrors((prev) => ({ ...prev, date: '' }));
                      }}
                      className="w-full h-12 pl-10 pr-4 text-sm text-[#F5F4F0] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm tabular-nums focus:outline-none focus:border-[#F5F4F0]"
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1.5 text-xs text-red-300" role="alert">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* 3. Time slots */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold tracking-wide text-[#D4D2CC]">
                      3. Escolha o horário
                    </span>
                    <div className="flex items-center gap-3">
                      {availableSlots.length <= 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextDay = new Date();
                            nextDay.setDate(nextDay.getDate() + 1);
                            setDate(getNextOpenDateIso(nextDay));
                          }}
                          className="text-xs font-medium text-[#F5F4F0] underline underline-offset-4 hover:text-white cursor-pointer"
                        >
                          Ver próximo dia
                        </button>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-[#A8A6A0] tabular-nums">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {availableSlots.length} disponíveis
                      </span>
                    </div>
                  </div>

                  {availableSlots.length > 0 ? (
                    <div
                      role="radiogroup"
                      aria-label="Horários disponíveis"
                      className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                    >
                      {availableSlots.map((slot) => {
                        const selected = time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              setTime(slot);
                              setErrors((prev) => ({ ...prev, time: '' }));
                            }}
                            className={`h-11 text-xs sm:text-sm font-mono tabular-nums rounded-sm border transition-colors cursor-pointer ${
                              selected
                                ? 'bg-[#F5F4F0] text-[#1A1A1A] border-[#F5F4F0] font-semibold'
                                : 'bg-[#1A1A1A] text-[#D4D2CC] border-[#4A4A4A]/70 hover:border-[#8C8A84] hover:text-white'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-xs sm:text-sm text-[#D4D2CC] bg-[#1A1A1A] border border-[#4A4A4A]/60 rounded-sm">
                      Não há horários disponíveis para a data selecionada. Escolha um dia entre
                      terça-feira e sábado.
                    </div>
                  )}
                  {errors.time && (
                    <p className="mt-1.5 text-xs text-red-300" role="alert">
                      {errors.time}
                    </p>
                  )}
                </div>

                {/* 4. Client details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                    >
                      Seu nome
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        setErrors((prev) => ({ ...prev, clientName: '' }));
                      }}
                      placeholder="Ex.: Marcelo Augusto"
                      className="w-full h-12 px-4 text-sm text-[#F5F4F0] placeholder:text-[#78756E] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm focus:outline-none focus:border-[#F5F4F0]"
                    />
                    {errors.clientName && (
                      <p className="mt-1.5 text-xs text-red-300" role="alert">
                        {errors.clientName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                    >
                      WhatsApp / Telefone
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value);
                        setErrors((prev) => ({ ...prev, clientPhone: '' }));
                      }}
                      placeholder="(62) 99999-9999"
                      className="w-full h-12 px-4 text-sm text-[#F5F4F0] placeholder:text-[#78756E] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm tabular-nums focus:outline-none focus:border-[#F5F4F0]"
                    />
                    {errors.clientPhone && (
                      <p className="mt-1.5 text-xs text-red-300" role="alert">
                        {errors.clientPhone}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
                >
                  Confirmar agendamento
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

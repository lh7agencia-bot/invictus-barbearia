import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import {
  buildMailtoContactUrl,
  buildWhatsAppContactUrl,
  validateContactInput,
} from '../utils/barbershop';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedUrls, setSubmittedUrls] = useState<{
    whatsappUrl: string;
    mailtoUrl: string;
    senderName: string;
  } | null>(null);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    BUSINESS_INFO.address
  )}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validateContactInput({ name, email, message });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSubmittedUrls({
      whatsappUrl: buildWhatsAppContactUrl({ name, email, message }),
      mailtoUrl: buildMailtoContactUrl({ name, email, message }),
      senderName: name.trim(),
    });
  };

  return (
    <section
      id="contato"
      className="scroll-mt-16 bg-[#1A1A1A] text-[#F5F4F0] py-16 lg:py-24 border-b border-[#4A4A4A]/40"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left column: Address, Phone, Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#A8A6A0] mb-3">
                Contato e Localização
              </p>
              <h2
                className="font-display font-bold text-[#F5F4F0] leading-tight mb-4"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
              >
                Visite a INVICTUS Barbearia em Goiás - GO
              </h2>
              <p className="text-base text-[#D4D2CC] leading-relaxed">
                Tem alguma dúvida sobre serviços, horários ou atendimento? Envie sua mensagem
                ou fale diretamente pelo WhatsApp.
              </p>
            </div>

            <div className="space-y-5 pt-6 border-t border-[#4A4A4A]/50 text-sm">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#B8B5AE] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#A8A6A0] mb-1">Endereço</p>
                  <p className="text-[#F5F4F0] leading-relaxed">{BUSINESS_INFO.address}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1.5 text-xs font-medium text-[#D4D2CC] underline underline-offset-4 hover:text-white"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-4 h-4 text-[#B8B5AE] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-[#A8A6A0] mb-1">Telefone / WhatsApp</p>
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-[#F5F4F0] hover:underline underline-offset-4 tabular-nums"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-[#A8A6A0] mb-2">Horário de funcionamento</p>
                <ul className="space-y-1.5 text-[#D4D2CC]">
                  {BUSINESS_INFO.hours.map((item) => (
                    <li
                      key={item.days}
                      className="flex items-center justify-between gap-4 border-b border-[#4A4A4A]/25 pb-1.5"
                    >
                      <span>{item.days}</span>
                      <span className="font-mono text-xs tabular-nums text-[#F5F4F0]">
                        {item.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column: Contact form */}
          <div className="lg:col-span-7 bg-[#222222] border border-[#4A4A4A]/60 rounded-sm p-6 sm:p-8">
            {submittedUrls ? (
              <div data-testid="contact-confirmation" className="space-y-6">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-[#F5F4F0] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#F5F4F0] mb-1">
                      Mensagem pronta para envio, {submittedUrls.senderName}
                    </h3>
                    <p className="text-sm text-[#D4D2CC]">
                      Escolha abaixo como prefere enviar sua mensagem para a INVICTUS Barbearia.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={submittedUrls.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Enviar via WhatsApp
                  </a>

                  <a
                    href={submittedUrls.mailtoUrl}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium text-[#F5F4F0] border border-[#4A4A4A] hover:bg-[#2C2C2C] rounded-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Enviar por E-mail
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittedUrls(null);
                    setMessage('');
                  }}
                  className="text-xs font-medium text-[#B8B5AE] hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Escrever outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <h3 className="font-display text-2xl font-bold text-[#F5F4F0] mb-1">
                  Formulário de Contato
                </h3>
                <p className="text-sm text-[#B8B5AE] mb-4">
                  Preencha seus dados e escolha enviar via WhatsApp ou aplicativo de e-mail.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                    >
                      Nome
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Seu nome completo"
                      className="w-full h-12 px-4 text-sm text-[#F5F4F0] placeholder:text-[#78756E] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm focus:outline-none focus:border-[#F5F4F0]"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-300" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                    >
                      E-mail
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="voce@exemplo.com"
                      className="w-full h-12 px-4 text-sm text-[#F5F4F0] placeholder:text-[#78756E] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm focus:outline-none focus:border-[#F5F4F0]"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-300" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold tracking-wide text-[#D4D2CC] mb-2"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder="Escreva sua dúvida ou solicitação..."
                    className="w-full p-4 text-sm text-[#F5F4F0] placeholder:text-[#78756E] bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm focus:outline-none focus:border-[#F5F4F0]"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-300" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
                >
                  Preparar envio da mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

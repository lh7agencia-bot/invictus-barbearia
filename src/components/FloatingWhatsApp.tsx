import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';

export function FloatingWhatsApp() {
  const url = `https://wa.me/${BUSINESS_INFO.whatsappDigits}?text=${encodeURIComponent(
    `Olá, ${BUSINESS_INFO.name}! Gostaria de mais informações sobre horários.`
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Conversar no WhatsApp da ${BUSINESS_INFO.name} pelo número ${BUSINESS_INFO.phoneDisplay}`}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 h-12 px-4 sm:px-5 rounded-sm bg-[#1A1A1A] text-[#F5F4F0] border border-[#4A4A4A] shadow-lg hover:bg-[#2A2A2A] hover:border-[#8C8A84] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
    >
      <MessageCircle className="w-5 h-5 text-[#F5F4F0]" aria-hidden="true" />
      <span className="text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
        WhatsApp
      </span>
    </a>
  );
}

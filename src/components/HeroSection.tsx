import { ArrowDownRight, Calendar, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO, GALLERY_PHOTOS } from '../data/barbershopData';
import { ResilientImage } from './ResilientImage';

export function HeroSection() {
  const heroPhoto = GALLERY_PHOTOS[0];

  return (
    <section id="topo" className="bg-[#1A1A1A] text-[#F5F4F0] border-b border-[#4A4A4A]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left editorial column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-[0.16em] text-[#B8B5AE] mb-5">
                INVICTUS Barbearia · Goiás - GO
              </p>

              <h1
                className="font-display font-bold text-[#F5F4F0] leading-[1.08] tracking-tight mb-6"
                style={{
                  fontSize: 'clamp(2.35rem, 4.2vw, 3.85rem)',
                  textWrap: 'balance',
                }}
              >
                {BUSINESS_INFO.slogan}
              </h1>

              <p className="text-base sm:text-lg text-[#D4D2CC] leading-relaxed max-w-[52ch] mb-8">
                Corte clássico na tesoura, alinhamento à navalha com toalha quente e
                atendimento sem pressa no coração de Goiás. Um espaço pensado para homens
                que valorizam técnica apurada e discrição.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#agendamento"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Agendar horário
              </a>

              <a
                href="#galeria"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-[#F5F4F0] border border-[#4A4A4A] hover:border-[#8C8A84] hover:bg-[#242424] rounded-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
              >
                Conhecer o espaço
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right real photo column */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[430px] rounded-sm overflow-hidden border border-[#4A4A4A]/60 bg-[#242424]">
              <ResilientImage
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/15 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                <p className="text-xs sm:text-sm text-[#F5F4F0]/95 font-medium max-w-[38ch]">
                  {heroPhoto.caption}
                </p>
                <span className="text-xs font-mono text-[#D4D2CC] whitespace-nowrap shrink-0">
                  Centro · Goiás
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 3-column architectural info bar below the split */}
        <div className="mt-12 pt-8 border-t border-[#4A4A4A]/50 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex items-start gap-3.5">
            <MapPin className="w-4 h-4 text-[#B8B5AE] mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-[#A8A6A0] mb-1">Endereço</p>
              <p className="text-sm text-[#F5F4F0] leading-snug">{BUSINESS_INFO.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 md:border-l md:border-[#4A4A4A]/40 md:pl-8">
            <Calendar className="w-4 h-4 text-[#B8B5AE] mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-[#A8A6A0] mb-1">Horário de atendimento</p>
              <p className="text-sm text-[#F5F4F0] leading-snug tabular-nums">
                Ter–Sex 09:00–19:30 · Sáb 09:00–18:00
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 md:border-l md:border-[#4A4A4A]/40 md:pl-8">
            <Phone className="w-4 h-4 text-[#B8B5AE] mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-[#A8A6A0] mb-1">Telefone &amp; WhatsApp</p>
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#F5F4F0] hover:underline underline-offset-4 tabular-nums"
              >
                {BUSINESS_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

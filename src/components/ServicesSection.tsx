import { ArrowRight, Clock } from 'lucide-react';
import { SERVICES } from '../data/barbershopData';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section id="servicos" className="scroll-mt-16 bg-[#F5F4F0] text-[#1A1A1A] py-16 lg:py-24 border-b border-[#D4D2CC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#4A4A4A] mb-3">
              Serviços da Casa
            </p>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              Precisão artesanal em cada etapa do atendimento
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-base text-[#4A4A4A] leading-relaxed max-w-[60ch]">
              Cada serviço é conduzido de forma individual, combinando técnicas tradicionais
              de tesoura e navalha com higiene rigorosa e acabamento sob medida para o seu
              estilo.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#1A1A1A]/15 border-t border-b border-[#1A1A1A]/15">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="py-7 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center"
            >
              <div className="md:col-span-1 text-sm font-mono font-medium text-[#4A4A4A] tabular-nums">
                {service.index}
              </div>

              <div className="md:col-span-4">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  {service.name}
                </h3>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#4A4A4A] tabular-nums">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Duração média: {service.duration}</span>
                </div>
              </div>

              <p className="md:col-span-5 text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
                {service.description}
              </p>

              <div className="md:col-span-2 flex md:justify-end">
                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F4F0] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
                >
                  Agendar este
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/barbershopData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-16 bg-[#EBE9E3] text-[#1A1A1A] py-16 lg:py-24 border-b border-[#D4D2CC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#4A4A4A] mb-3">
              Dúvidas Frequentes
            </p>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', textWrap: 'balance' }}
            >
              Perguntas comuns sobre o atendimento
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
              Informações práticas sobre agendamentos, horários, duração dos serviços e
              localização no Centro de Goiás - GO.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-[#1A1A1A]/15 border-y border-[#1A1A1A]/15">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    className="w-full py-5 sm:py-6 flex items-center justify-between gap-6 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
                  >
                    <span className="font-display text-lg sm:text-xl font-semibold text-[#1A1A1A] leading-snug">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#4A4A4A] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-panel-${item.id}`}
                      className="pb-6 pr-8 text-sm sm:text-base text-[#4A4A4A] leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/barbershopData';

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="scroll-mt-16 bg-[#F5F4F0] text-[#1A1A1A] py-16 lg:py-24 border-b border-[#D4D2CC]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#4A4A4A] mb-3">
              Depoimentos
            </p>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              A opinião de quem frequenta nossa cadeira
            </h2>
          </div>
          <p className="text-sm text-[#4A4A4A] max-w-[42ch]">
            Relatos reais sobre atendimento, pontualidade e acabamento na INVICTUS Barbearia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#1A1A1A]/12 rounded-sm p-6 sm:p-7 flex flex-col justify-between gap-6"
            >
              <div>
                <div
                  className="flex items-center gap-1 mb-5"
                  aria-label={`${item.rating} de 5 estrelas`}
                >
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-[#1A1A1A] text-[#1A1A1A]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#1A1A1A] leading-relaxed">
                  “{item.text}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#1A1A1A]/10">
                <p className="font-display text-lg font-bold text-[#1A1A1A]">
                  {item.name}
                </p>
                <p className="text-xs text-[#4A4A4A] mt-0.5">{item.context}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

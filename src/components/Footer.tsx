import { BUSINESS_INFO } from '../data/barbershopData';

export function Footer() {
  return (
    <footer className="bg-[#121212] text-[#D4D2CC] py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#4A4A4A]/35">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.14em] text-[#F5F4F0]">
              {BUSINESS_INFO.name}
            </p>
            <p className="text-sm text-[#A8A6A0] mt-1">{BUSINESS_INFO.slogan}</p>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <a href="#servicos" className="hover:text-white transition-colors">
              Serviços
            </a>
            <a href="#galeria" className="hover:text-white transition-colors">
              Galeria
            </a>
            <a href="#agendamento" className="hover:text-white transition-colors">
              Agendamento
            </a>
            <a href="#depoimentos" className="hover:text-white transition-colors">
              Depoimentos
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#contato" className="hover:text-white transition-colors">
              Contato
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8C8A84]">
          <p>{BUSINESS_INFO.address}</p>
          <p className="tabular-nums">
            WhatsApp: {BUSINESS_INFO.phoneDisplay} · © {new Date().getFullYear()}{' '}
            {BUSINESS_INFO.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

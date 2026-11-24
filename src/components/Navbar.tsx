import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#agendamento', label: 'Agendamento' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1A1A1A]/95 border-b border-[#4A4A4A]/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#topo"
          className="font-display text-xl sm:text-2xl font-bold tracking-[0.14em] text-[#F5F4F0] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F4F0]"
        >
          {BUSINESS_INFO.shortName}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#D4D2CC] hover:text-white underline-offset-8 hover:underline decoration-[#4A4A4A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F4F0]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action on desktop + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#agendamento"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide text-[#1A1A1A] bg-[#F5F4F0] hover:bg-white rounded-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F4F0]"
          >
            Agendar horário
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="menu-mobile"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#F5F4F0] border border-[#4A4A4A] rounded-sm hover:bg-[#2A2A2A] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5F4F0]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="menu-mobile"
          aria-label="Menu móvel"
          className="md:hidden bg-[#1A1A1A] border-t border-[#4A4A4A]/40 px-5 py-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-2 text-sm font-medium text-[#F5F4F0] border-b border-[#4A4A4A]/25 hover:bg-[#242424] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 px-2 text-sm font-medium text-[#F5F4F0] border-b border-[#4A4A4A]/25 hover:bg-[#242424] transition-colors"
          >
            Contato
          </a>
          <a
            href="#agendamento"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-3 inline-flex items-center justify-center w-full py-3 text-sm font-semibold text-[#1A1A1A] bg-[#F5F4F0] rounded-sm"
          >
            Agendar horário
          </a>
        </nav>
      )}
    </header>
  );
}

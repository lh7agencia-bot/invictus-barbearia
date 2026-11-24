import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/barbershopData';
import { ResilientImage } from './ResilientImage';

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
        );
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const activePhoto = activeIndex !== null ? GALLERY_PHOTOS[activeIndex] : null;

  return (
    <section id="galeria" className="scroll-mt-16 bg-[#EBE9E3] text-[#1A1A1A] py-16 lg:py-24 border-b border-[#D4D2CC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#4A4A4A] mb-3">
              Galeria de Fotos
            </p>
            <h2
              className="font-display font-bold text-[#1A1A1A] leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              Conheça o ambiente da INVICTUS Barbearia
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4A4A] max-w-[44ch]">
            Clique em qualquer imagem para ampliar os detalhes do nosso espaço em Goiás - GO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {GALLERY_PHOTOS.map((photo, index) => {
            const isFramedScreenshot = photo.id === 'entrada-tradicional';
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ampliar foto ${index + 1}: ${photo.caption}`}
                className={`${photo.aspectClass} group relative overflow-hidden rounded-sm bg-[#1A1A1A] border border-[#1A1A1A]/15 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A1A1A]`}
              >
                <ResilientImage
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isFramedScreenshot
                      ? 'scale-[1.75] object-[50%_54%] group-hover:scale-[1.82]'
                      : 'group-hover:scale-[1.03]'
                  }`}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/15 to-transparent opacity-90 transition-opacity"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="block text-xs font-mono text-[#D4D2CC] mb-1 tabular-nums">
                      0{index + 1} / 0{GALLERY_PHOTOS.length}
                    </span>
                    <p className="text-sm font-medium text-[#F5F4F0] leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-[#1A1A1A]/80 border border-[#4A4A4A] text-[#F5F4F0] shrink-0 group-hover:bg-[#F5F4F0] group-hover:text-[#1A1A1A] transition-colors">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${activePhoto.caption}`}
          className="fixed inset-0 z-50 bg-[#121212]/95 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#1A1A1A] border border-[#4A4A4A] rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#4A4A4A]/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-[#D4D2CC] tabular-nums shrink-0">
                  {activeIndex + 1} / {GALLERY_PHOTOS.length}
                </span>
                <span className="text-xs sm:text-sm text-[#F5F4F0] truncate">
                  {activePhoto.caption}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Fechar galeria ampliada"
                className="inline-flex items-center justify-center w-10 h-10 text-[#F5F4F0] hover:bg-[#2A2A2A] rounded-sm transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F5F4F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-[#121212] flex items-center justify-center max-h-[72vh] overflow-hidden">
              <ResilientImage
                src={activePhoto.src}
                alt={activePhoto.alt}
                loading="eager"
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-[#4A4A4A]/50">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (activeIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
                  )
                }
                aria-label="Foto anterior"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#F5F4F0] border border-[#4A4A4A] hover:bg-[#2A2A2A] rounded-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {GALLERY_PHOTOS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Ir para foto ${idx + 1}`}
                    className={`h-2 rounded-sm transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-7 bg-[#F5F4F0]'
                        : 'w-2.5 bg-[#4A4A4A] hover:bg-[#8C8A84]'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveIndex((activeIndex + 1) % GALLERY_PHOTOS.length)
                }
                aria-label="Próxima foto"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#F5F4F0] border border-[#4A4A4A] hover:bg-[#2A2A2A] rounded-sm transition-colors cursor-pointer"
              >
                Próxima
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

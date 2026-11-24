import { useState } from 'react';
import { SERVICES } from './data/barbershopData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BarberAtelier3D } from './components/BarberAtelier3D';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { BookingSection } from './components/BookingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);

  const handleSelectServiceForBooking = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A] text-[#F5F4F0]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BarberAtelier3D />
        <ServicesSection onSelectService={handleSelectServiceForBooking} />
        <GallerySection />
        <BookingSection
          selectedServiceId={selectedServiceId}
          onChangeServiceId={setSelectedServiceId}
        />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

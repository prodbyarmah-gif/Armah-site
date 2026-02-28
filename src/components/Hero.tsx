import { siteConfig } from '../data/armah';

export default function Hero() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="top" 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/assets/hero-bg.jpg)' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Red Bloom Effect */}
      <div className="red-bloom opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Main Headline */}
        <h1 className="font-head text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-6">
          {siteConfig.artistName}
        </h1>
        
        {/* Subline */}
        <p className="text-white/80 text-lg sm:text-xl md:text-2xl tracking-wide max-w-2xl mx-auto mb-12">
          {siteConfig.tagline}
        </p>
        
        {/* CTA Button */}
        <button
          onClick={scrollToBooking}
          className="bg-armah-red hover:bg-[#ff4d56] text-white font-head text-sm tracking-[0.2em] uppercase px-10 py-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(251,54,64,0.5)]"
        >
          Booking Inquiry
        </button>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

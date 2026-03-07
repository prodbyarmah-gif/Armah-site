import { useState, useEffect, useRef } from 'react';
import { Mail, Send, Check, FileText } from 'lucide-react';

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    location: '',
    message: '',
    company: '', // honeypot (bots fill this)
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // simple client-side validation (matches backend requirements)
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.eventType.trim() ||
      !formData.location.trim() ||
      !formData.message.trim()
    ) {
      setError('Please fill in Name, Email, Event Type, Location, and Message.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventType: formData.eventType,
          location: formData.location,
          message: formData.message,
          company: formData.company, // honeypot
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Send failed');
      }

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        eventType: '',
        location: '',
        message: '',
        company: '',
      });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section 
      id="booking" 
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            Booking Inquiry
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Email Display */}
          <div className={`text-center mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a
              href="mailto:booking@prodbyarmah.com"
              className="inline-flex items-center gap-4 text-white hover:text-armah-red transition-colors duration-200 group"
            >
              <div className="w-12 h-12 rounded-full bg-armah-red/10 flex items-center justify-center group-hover:bg-armah-red/20 transition-colors duration-200">
                <Mail className="w-5 h-5 text-armah-red" />
              </div>
              <span className="text-xl md:text-2xl font-medium tracking-wide">
                booking@prodbyarmah.com
              </span>
            </a>
            <p className="text-white/50 text-sm mt-4">
              For bookings, collaborations and appearances.
            </p>
          </div>

          {/* Rider Buttons */}
          <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a
              href="/assets/TECHNICAL%20RIDER%20.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-armah-red/50 bg-white/5 hover:bg-armah-red/10 text-white/80 hover:text-white transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm tracking-wide">Technical Rider</span>
            </a>
            <a
              href="/assets/HOSPITALITY%20RIDER.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-armah-red/50 bg-white/5 hover:bg-armah-red/10 text-white/80 hover:text-white transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm tracking-wide">Hospitality Rider</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-armah-red flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-head text-white mb-2 uppercase">
                  Message Sent
                </h3>
                <p className="text-white/60">
                  We will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot (anti-spam) */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                {error ? (
                  <div className="border border-armah-red/40 bg-armah-red/10 text-white/80 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                ) : null}
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white/70 text-sm mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-armah-red focus:outline-none transition-colors duration-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-armah-red focus:outline-none transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Event Type & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventType" className="block text-white/70 text-sm mb-2">Event Type</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-armah-red focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select type</option>
                      <option value="club" className="bg-black">Club Show</option>
                      <option value="festival" className="bg-black">Festival</option>
                      <option value="private" className="bg-black">Private Event</option>
                      <option value="corporate" className="bg-black">Corporate</option>
                      <option value="other" className="bg-black">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-white/70 text-sm mb-2">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-armah-red focus:outline-none transition-colors duration-200"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white/70 text-sm mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-armah-red focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full bg-armah-red hover:bg-[#ff4d56] text-white font-head px-8 py-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(251,54,64,0.5)] flex items-center justify-center gap-3 ${isSending ? 'opacity-70 cursor-not-allowed hover:shadow-none' : ''}`}
                >
                  <span>{isSending ? 'Sending…' : 'Send Inquiry'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}

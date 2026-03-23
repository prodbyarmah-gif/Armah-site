import { useState, useEffect, useRef } from 'react';
import { Mail, Send, Check, FileText } from 'lucide-react';
import { beatOptions, type BeatOption } from './Producer';

const DJ_EVENT_TYPES = [
  { value: 'club', label: 'Club Show' },
  { value: 'festival', label: 'Festival' },
  { value: 'private', label: 'Private Event' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'other', label: 'Other' },
] as const;

const PRODUCER_TYPES = [
  { value: 'beat_license', label: 'Beat license' },
  { value: 'custom_beat', label: 'Custom beat' },
  { value: 'production', label: 'Production / Arrangement' },
  { value: 'mix_master', label: 'Mixing / Mastering' },
  { value: 'collab', label: 'Collab' },
  { value: 'other', label: 'Other' },
] as const;

type InquiryType = 'dj' | 'producer';

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('dj');
  const [selectedBeatId, setSelectedBeatId] = useState<string>('');
  const isAutoPrefillingRef = useRef(false);

  const selectedBeat = selectedBeatId ? beatOptions.find((b: BeatOption) => b.id === selectedBeatId) : undefined;

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

  useEffect(() => {
    // When we switch tabs due to URL auto-prefill, do NOT wipe eventType.
    if (isAutoPrefillingRef.current) return;
    setFormData((prev) => ({ ...prev, eventType: '' }));
    if (inquiryType !== 'producer') setSelectedBeatId('');
  }, [inquiryType]);

  useEffect(() => {
    // expected: #booking?beatId=<...> or #/booking?beatId=<...> or /booking?beatId=<...>
    const getBeatIdFromLocation = (): string => {
      // 1) normal query: /booking?beatId=...
      const direct = new URLSearchParams(window.location.search).get('beatId') || '';
      if (direct) return direct;

      // 2) hash query: #booking?beatId=... OR #/booking?beatId=...
      const rawHash = window.location.hash || '';
      const normalized = rawHash.startsWith('#/') ? rawHash.slice(2) : rawHash.slice(1);
      const withoutLeadingSlash = normalized.startsWith('/') ? normalized.slice(1) : normalized;

      if (!withoutLeadingSlash.startsWith('booking')) return '';

      const qIndex = withoutLeadingSlash.indexOf('?');
      if (qIndex === -1) return '';

      const query = withoutLeadingSlash.slice(qIndex + 1);
      const params = new URLSearchParams(query);
      return params.get('beatId') || '';
    };

    const applyPrefill = () => {
      const beatId = getBeatIdFromLocation();
      if (!beatId) return;

      isAutoPrefillingRef.current = true;
      setInquiryType('producer');
      setFormData((prev) => ({ ...prev, eventType: 'beat_license' }));
      setSelectedBeatId(beatId);

      // allow the inquiryType effect to run normally again after this tick
      setTimeout(() => {
        isAutoPrefillingRef.current = false;
      }, 0);

      requestAnimationFrame(() => {
        const el = document.getElementById('booking');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      // Clean beatId from URL so refresh doesn't re-trigger
      if (window.location.hash.includes('?')) {
        window.location.hash = window.location.hash.split('?')[0];
      }
      if (window.location.search.includes('beatId=')) {
        const u = new URL(window.location.href);
        u.searchParams.delete('beatId');
        window.history.replaceState({}, '', u.toString());
      }
    };

    applyPrefill();
    window.addEventListener('hashchange', applyPrefill);
    window.addEventListener('popstate', applyPrefill);
    return () => {
      window.removeEventListener('hashchange', applyPrefill);
      window.removeEventListener('popstate', applyPrefill);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // simple client-side validation (matches backend requirements)
    if (inquiryType === 'producer' && formData.eventType === 'beat_license' && !selectedBeatId) {
      setError('Please select a beat for Beat license inquiries.');
      return;
    }

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
          inquiryType,
          eventType: formData.eventType,
          beatId: inquiryType === 'producer' && formData.eventType === 'beat_license' ? selectedBeatId : undefined,
          beatTitle: inquiryType === 'producer' && formData.eventType === 'beat_license' ? (selectedBeat?.title || '') : undefined,
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
      setSelectedBeatId('');
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
                {/* Inquiry Type (DJ / Producer) */}
                <div>
                  <label className="block text-white/70 text-sm mb-2 text-center">Inquiry Type</label>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setInquiryType('dj')}
                      className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition
                        ${inquiryType === 'dj'
                          ? 'border-white/30 bg-white/[0.08] text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                    >
                      DJ Booking
                    </button>

                    <button
                      type="button"
                      onClick={() => setInquiryType('producer')}
                      className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition
                        ${inquiryType === 'producer'
                          ? 'border-white/30 bg-white/[0.08] text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                    >
                      Producer / Beats
                    </button>
                  </div>
                </div>
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
                    <label htmlFor="eventType" className="block text-white/70 text-sm mb-2">{inquiryType === 'dj' ? 'Event Type' : 'Producer Request'}</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-armah-red focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Select type</option>
                      {(inquiryType === 'dj' ? DJ_EVENT_TYPES : PRODUCER_TYPES).map((t) => (
                        <option key={t.value} value={t.value} className="bg-black">
                          {t.label}
                        </option>
                      ))}
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

                {inquiryType === 'producer' && formData.eventType === 'beat_license' ? (
                  <div>
                    <label htmlFor="beatId" className="block text-white/70 text-sm mb-2">
                      Select Beat
                    </label>

                    <select
                      id="beatId"
                      name="beatId"
                      value={selectedBeatId}
                      onChange={(e) => setSelectedBeatId(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-armah-red focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-black">Choose a beat</option>
                      <optgroup label="Afro" className="bg-black">
                        {beatOptions.filter((b: BeatOption) => b.mood === 'Afro').map((b: BeatOption) => (
                          <option key={b.id} value={b.id} className="bg-black">
                            {b.title} • {b.bpm} BPM
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Drill" className="bg-black">
                        {beatOptions.filter((b: BeatOption) => b.mood === 'Drill').map((b: BeatOption) => (
                          <option key={b.id} value={b.id} className="bg-black">
                            {b.title} • {b.bpm} BPM
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Trap" className="bg-black">
                        {beatOptions.filter((b: BeatOption) => b.mood === 'Trap').map((b: BeatOption) => (
                          <option key={b.id} value={b.id} className="bg-black">
                            {b.title} • {b.bpm} BPM
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    {selectedBeat ? (
                      <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <div className="text-white/60 text-xs tracking-wide uppercase">Selected beat</div>
                        <div className="mt-1 text-white font-semibold">
                          {selectedBeat.title}
                        </div>
                        <div className="mt-1 text-white/60 text-sm">
                          <span className="text-white/70">ID:</span> {selectedBeat.id} &nbsp;•&nbsp; <span className="text-white/70">BPM:</span> {selectedBeat.bpm} &nbsp;•&nbsp; <span className="text-white/70">Genre:</span> {selectedBeat.mood}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

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
                    placeholder={inquiryType === 'dj' ? 'Tell us about your event...' : 'Tell us what you need (license, custom beat, collab, etc.)...'}
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

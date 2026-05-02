import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    timeline: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formspreeEndpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined)?.trim();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Left column animation
      gsap.fromTo(
        leftColRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );

      // Form card animation
      gsap.fromTo(
        formCardRef.current,
        { x: '6vw', opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );

      // Contact details stagger
      const detailItems = detailsRef.current?.querySelectorAll('.detail-item');
      if (detailItems) {
        gsap.fromTo(
          detailItems,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formspreeEndpoint) {
      setSubmitError('Contact form is not configured yet. Please email me directly for now.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType,
          timeline: formData.timeline,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: '',
        timeline: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitError('Unable to send your inquiry right now. Please try again or use the email link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#F4F6F8] min-h-screen py-[10vh]"
      style={{ zIndex: 100 }}
    >
      <div className="max-w-[1400px] mx-auto px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <div ref={leftColRef} className="pt-8">
            <h2 className="headline-lg text-[#0B0F17] mb-6">
              Let's make something iconic.
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-12 max-w-md">
              Share a few details and I'll reply with availability, pricing, and next steps.
            </p>

            {/* Contact Details */}
            <div ref={detailsRef} className="space-y-6 mb-12">
              <div className="detail-item flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#3F8EFC] mt-0.5" />
                <div>
                  <p className="caption-mono text-[#6B7280] mb-1">EMAIL</p>
                  <a
                    href="mailto:anthonymhinojosa@gmail.com"
                    className="text-[#0B0F17] hover:text-[#3F8EFC] transition-colors"
                  >
                    anthonymhinojosa@gmail.com
                  </a>
                </div>
              </div>

              <div className="detail-item flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#3F8EFC] mt-0.5" />
                <div>
                  <p className="caption-mono text-[#6B7280] mb-1">LOCATION</p>
                  <p className="text-[#0B0F17]">Corpus Christi, TX — willing to travel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            ref={formCardRef}
            className="bg-white border border-[rgba(11,15,23,0.08)] p-8 md:p-10"
          >
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-16 h-16 bg-[#3F8EFC]/10 rounded-full flex items-center justify-center mb-6">
                  <Send className="w-8 h-8 text-[#3F8EFC]" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#0B0F17] mb-3">
                  Message Sent!
                </h3>
                <p className="text-[#6B7280]">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="form-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="commercial">Commercial</option>
                      <option value="events">Events</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="asap">ASAP</option>
                      <option value="1-2-weeks">1-2 Weeks</option>
                      <option value="1-month">1 Month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="form-input resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cta-button bg-[#0B0F17] text-white border-[#0B0F17] hover:bg-[#1a1f2a] justify-center"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                  <Send size={14} />
                </button>

                {submitError && (
                  <p role="alert" className="text-sm text-[#B91C1C]">
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-[rgba(11,15,23,0.08)]">
        <div className="max-w-[1400px] mx-auto px-[6vw]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-[#6B7280]">
              © {new Date().getFullYear()} COASTAL VISTA. ALL RIGHTS RESERVED.
            </p>
            <p className="font-mono text-xs text-[#6B7280]">
              FAA PART 107 LICENSED & INSURED
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}

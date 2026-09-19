import { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { Mail, MapPin, Send } from 'lucide-react';
import SocialLinks from '../components/SocialLinks';


export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current;
      if (!section) return;
      for (const target of section.querySelectorAll('.family-intro-copy, .contact-form-card, .contact-details')) {
        gsap.fromTo(target, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: target, start: 'top 95%', end: 'top 65%', scrub: .5 } });
      }
    }, sectionRef);
    return () => mm.revert();
  }, []);

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
      className="contact-section relative bg-[#F4F6F8] pb-[10vh]"
      style={{ zIndex: 100 }}
    >
            <div className="family-intro">
              <img className="family-intro-image" src={`${import.meta.env.BASE_URL}images/hero-family.jpg`} alt="Anthony and his family enjoying a day out with the drone" loading="lazy" decoding="async" />
              <div className="family-intro-shade" />
              <div className="family-intro-copy">
                <h2>Let’s make something worth sharing.</h2>
                <p>Share a few details and I'll reply with availability, pricing, and next steps.</p>
              </div>
            </div>

      <div className="max-w-[1400px] mx-auto px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pt-[8vh]">
          {/* Left Column - Content */}
          <div>
            <div className="family-signoff">
              <strong>Thanks for stopping by.</strong>
              <p>I’m Anthony, the person behind Coastal Vista. I’d love to hear what you have in mind.</p>
            </div>

            {/* Contact Details */}
            <div className="contact-details space-y-6 mb-12">
              <div className="detail-item flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#3F8EFC] mt-0.5" />
                <div>
                  <p className="caption-mono text-[#535D69] mb-1">EMAIL</p>
                  <a
                    href="mailto:coastalvista@alchemistlabs.cloud"
                    className="text-[#0B0F17] hover:text-[#3F8EFC] transition-colors"
                  >
                    coastalvista@alchemistlabs.cloud
                  </a>
                </div>
              </div>

              <div className="detail-item flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#3F8EFC] mt-0.5" />
                <div>
                  <p className="caption-mono text-[#535D69] mb-1">LOCATION</p>
                  <p className="text-[#0B0F17]">Corpus Christi, TX — willing to travel</p>
                </div>
              </div>
              <SocialLinks />
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className="contact-form-card self-start bg-white border border-[rgba(11,15,23,0.08)] p-8 md:p-10"
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
                <p className="text-[#535D69]">
                  Thanks for reaching out. I’ll be in touch about your project.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="contact-email"
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
                    <label htmlFor="contact-projectType" className="form-label">Project Type</label>
                    <select
                      id="contact-projectType"
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
                    <label htmlFor="contact-timeline" className="form-label">Timeline</label>
                    <select
                      id="contact-timeline"
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
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <textarea
                    id="contact-message"
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
            <p className="font-mono text-xs text-[#535D69]">
              © {new Date().getFullYear()} COASTAL VISTA. ALL RIGHTS RESERVED.
            </p>
            <p className="font-mono text-xs text-[#535D69]">
              FAA PART 107 LICENSED & INSURED
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}

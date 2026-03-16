import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  // Load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background fade in
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      );

      // Headline lines stagger
      const headlineLines = headlineRef.current?.querySelectorAll('.headline-line');
      if (headlineLines) {
        tl.fromTo(
          headlineLines,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 },
          '-=0.6'
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      );

      // Caption
      tl.fromTo(
        captionRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([bgRef.current, headlineRef.current, subheadlineRef.current, captionRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
          },
        },
      });

      // ENTRANCE (0-30%): Hold at visible state
      // SETTLE (30-70%): Static
      // EXIT (70-100%): Elements exit

      // Headline exit
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Subheadline exit
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Caption exit
      scrollTl.fromTo(
        captionRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Background parallax
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.06, x: '-2vw', ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-10"
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src="/images/hero-family.jpg"
        alt="Family with drone equipment"
        className="bg-image"
        style={{ objectPosition: '55% 50%' }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw]">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="absolute left-[6vw] top-[14vh] w-[60vw]"
        >
          <h1 className="headline-hero text-white">
            <span className="headline-line block">COASTAL</span>
            <span className="headline-line block">VISTA</span>
          </h1>
        </div>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="absolute left-[6vw] top-[62vh] w-[30vw] text-white/90 text-base md:text-lg leading-relaxed"
        >
          Aerial storytelling for brands, real estate, and life's big moments.
        </p>

        {/* Caption */}
        <div
          ref={captionRef}
          className="absolute right-[4vw] top-[18vh] w-[18vw] text-right"
        >
          <p className="caption-mono text-white/80 leading-relaxed">
            COASTAL VISTA | BASED IN TEXAS | AVAILABLE WORLDWIDE
          </p>
        </div>
      </div>
    </section>
  );
}

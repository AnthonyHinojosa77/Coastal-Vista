import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
  id: string;
  headline: string[];
  subheadline: string;
  cta: string;
  caption: string;
  image: string;
  zIndex: number;
  endOffset?: string;
  ctaAction?: () => void;
}

export default function PinnedSection({
  id,
  headline,
  subheadline,
  cta,
  caption,
  image,
  zIndex,
  endOffset = '+=130%',
  ctaAction,
}: PinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: endOffset,
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      // Background entrance
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline entrance
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Subheadline entrance
      scrollTl.fromTo(
        subheadlineRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // CTA entrance
      scrollTl.fromTo(
        ctaRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.12
      );

      // Caption entrance
      scrollTl.fromTo(
        captionRef.current,
        { x: '10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.15
      );

      // SETTLE (30-70%): Elements hold position - no animation needed

      // EXIT (70-100%)
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
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // CTA exit
      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      // Caption exit
      scrollTl.fromTo(
        captionRef.current,
        { x: 0, opacity: 1 },
        { x: '8vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Background exit
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1 },
        { scale: 1.05, ease: 'none' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [endOffset]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="section-pinned"
      style={{ zIndex }}
    >
      {/* Background Image */}
      <img
        ref={bgRef}
        src={image}
        alt={headline.join(' ')}
        className="bg-image"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw]">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="absolute left-[6vw] top-[18vh] w-[44vw]"
        >
          <h2 className="headline-xl text-white">
            {headline.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="absolute left-[6vw] top-[52vh] w-[30vw] text-white/90 text-base md:text-lg leading-relaxed"
        >
          {subheadline}
        </p>

        {/* CTA */}
        {cta && (
          <button
            ref={ctaRef}
            onClick={ctaAction}
            className="cta-button cta-button-dark absolute left-[6vw] top-[66vh]"
          >
            {cta}
            <ArrowRight size={14} />
          </button>
        )}

        {/* Caption */}
        <div
          ref={captionRef}
          className="absolute right-[4vw] top-[18vh] w-[20vw] text-right"
        >
          <p className="caption-mono text-white/80 leading-relaxed">
            {caption}
          </p>
        </div>
      </div>
    </section>
  );
}

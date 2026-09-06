import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Photo = { id: string; image: string; title: string[]; location: string; alt: string; description: string };

export default function PhotoPanel({ photo, index }: { photo: Photo; index: number }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const section = ref.current;
      if (!section) return;
      const copy = section.querySelector('.photo-copy');
      const image = section.querySelector('picture');
      const children = section.querySelectorAll('.photo-copy > *');
      const navHeight = () => document.querySelector('nav')?.getBoundingClientRect().height ?? 68;
      // One pinned timeline owns the copy's opacity in both directions.
      // The entrance happens with the complete text already inside the viewport.
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: section, start: () => `top ${navHeight()}px`, end: '+=100%', pin: true,
        scrub: .6, invalidateOnRefresh: true,
      } });
      timeline.fromTo(image, { scale: 1.04 }, { scale: 1, duration: 1, ease: 'none' }, 0);
      if (index > 0) {
        timeline.fromTo(copy, { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: .28, ease: 'none' }, 0);
      } else {
        gsap.fromTo(children, { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: .1, duration: .8, ease: 'power2.out' });
      }
      timeline.to(copy, { y: -24, opacity: 0, duration: .28, ease: 'none' }, .72);
    }, ref);
    return () => mm.revert();
  }, [index]);

  const Heading = index === 0 ? 'h1' : 'h2';
  return (
    <section ref={ref} className="photo-panel" id={photo.id} aria-labelledby={`${photo.id}-title`}>
      <picture>
        <source media="(max-width: 640px)" srcSet={`${import.meta.env.BASE_URL}images/real/mobile/${photo.image}.webp`} />
        <img src={`${import.meta.env.BASE_URL}images/real/desktop/${photo.image}.webp`} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" width="1920" height="1080" />
      </picture>
      <div className="photo-shade" />
      <div className="photo-copy">
        <p className="photo-caption">{String(index + 1).padStart(2, '0')} / 06 — {photo.location}</p>
        <Heading id={`${photo.id}-title`}>{photo.title.map(line => <span key={line}>{line}</span>)}</Heading>
        <p className="photo-description">{photo.description}</p>
        {index === 0 && <a className="photo-cta" href="#contact">Plan your shoot <span aria-hidden="true">↗</span></a>}
      </div>
    </section>
  );
}

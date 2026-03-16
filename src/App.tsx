import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import PinnedSection from './sections/PinnedSection';
import DroneLineupSection from './sections/DroneLineupSection';
import ContactSection from './sections/ContactSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const baseImagePath = `${import.meta.env.BASE_URL}images/`;

const sections = [
  {
    id: 'shoreline',
    headline: ['AERIAL', 'IMAGERY'],
    subheadline: 'Crisp, natural edits that keep the coast looking like the coast.',
    cta: '',
    caption: 'LICENSED PART 107 PILOT | INSURED',
    image: `${baseImagePath}beach-shoreline.jpg`,
    ctaAction: () => {},
  },
  {
    id: 'realestate',
    headline: ['REAL ESTATE', 'LISTINGS'],
    subheadline: 'Fast turnaround, cinematic tours, and angles that sell.',
    cta: 'Request a Quote',
    caption: 'TWILIGHT, INTERIORS, GROUNDS',
    image: `${baseImagePath}neighborhood-aerial.jpg`,
    ctaAction: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
  },
  {
    id: 'commercial',
    headline: ['COMMERCIAL', 'PROJECTS'],
    subheadline: 'Inspections, progress docs, and marketing footage, delivered clean.',
    cta: '',
    caption: 'CONSTRUCTION, MARINE, EVENTS',
    image: `${baseImagePath}harbor-approach.jpg`,
    ctaAction: () => {},
  },
  {
    id: 'showreels',
    headline: ['CINEMATIC', 'SHOWREELS'],
    subheadline: 'Color-graded, sound-designed, and built to hold attention.',
    cta: '',
    caption: '4K / 60FPS, HDR DELIVERY',
    image: `${baseImagePath}bridge-sweep.jpg`,
    endOffset: '+=140%',
    ctaAction: () => {},
  },
  {
    id: 'events',
    headline: ['EVENT', 'COVERAGE'],
    subheadline: 'From setup to sunset, every moment, every angle.',
    cta: 'Plan Your Shoot',
    caption: 'WEDDINGS, CORPORATE, FESTIVALS',
    image: `${baseImagePath}city-harbor.jpg`,
    ctaAction: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
  },
  {
    id: 'city',
    headline: ['CITY', 'STORIES'],
    subheadline: 'Tight coordination, safe flight plans, and stunning results.',
    cta: '',
    caption: 'PERMITS, LAANC, NIGHT WAIVERS',
    image: `${baseImagePath}downtown-flythrough.jpg`,
    ctaAction: () => {},
  },
  {
    id: 'ready',
    headline: ['READY WHEN', 'YOU ARE'],
    subheadline: 'Tell me what you\'re building. I\'ll bring the sky.',
    cta: 'Book Me',
    caption: 'TURNAROUND: 48 TO 72 HOURS',
    image: `${baseImagePath}city-to-coast.jpg`,
    ctaAction: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
  },
];

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Pinned Sections */}
      {sections.map((section, index) => (
        <PinnedSection
          key={section.id}
          {...section}
          zIndex={(index + 2) * 10}
        />
      ))}

      {/* Drone Lineup Section */}
      <DroneLineupSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}

export default App;

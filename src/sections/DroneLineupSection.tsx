import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Plane, Zap, Orbit } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const drones = [
  {
    name: 'DJI Mavic 4 Pro',
    icon: Camera,
    tagline: 'The Professional Workhorse',
    specs: ['6K/60fps HDR', '100MP 4/3 CMOS', '51-min Flight Time'],
    useCases: [
      'Commercial real estate photography',
      'Cinematic showreels and films',
      'High-resolution aerial mapping',
      'Professional client deliverables',
    ],
  },
  {
    name: 'DJI Mini 5 Pro',
    icon: Plane,
    tagline: 'The Agile All-Rounder',
    specs: ['4K/120fps', '249.9g Weight', '36-min Flight Time'],
    useCases: [
      'Quick real estate tours',
      'Travel and lifestyle content',
      'Events and weddings',
      'Restricted airspace operations',
    ],
  },
  {
    name: 'DJI Avata 2',
    icon: Zap,
    tagline: 'The FPV Speedster',
    specs: ['4K/60fps HDR', '155° Super-Wide FOV', '23-min Flight Time'],
    useCases: [
      'Dynamic FPV chase sequences',
      'Action sports coverage',
      'Immersive fly-throughs',
      'High-speed cinematic shots',
    ],
  },
  {
    name: 'DJI Avata 360',
    icon: Orbit,
    tagline: 'The Immersive 360° Rig',
    specs: ['5.7K 360° Capture', 'Invisible Gimbal', 'Reframe in Post'],
    useCases: [
      '360° virtual property tours',
      'VR and XR experiences',
      'Single-take reframable shots',
      'Event and venue flythroughs',
    ],
  },
];

export default function DroneLineupSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 0.5,
          },
        }
      );

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.drone-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.7,
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

  return (
    <section
      ref={sectionRef}
      id="equipment"
      className="relative bg-[#0B0F17] min-h-screen py-[12vh]"
      style={{ zIndex: 95 }}
    >
      <div className="max-w-[1400px] mx-auto px-[6vw]">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <p className="caption-mono text-[#3F8EFC] mb-4">THE FLEET</p>
          <h2 className="headline-lg text-white mb-6">PROFESSIONAL DRONE LINEUP</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Every project demands the right tool. Here is the gear that delivers the shots you need.
          </p>
        </div>

        {/* Drone Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {drones.map((drone, index) => {
            const Icon = drone.icon;
            return (
              <div
                key={index}
                className="drone-card group bg-[#141821] border border-white/10 p-8 hover:border-[#3F8EFC]/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#3F8EFC]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#3F8EFC]/20 transition-colors">
                  <Icon className="w-7 h-7 text-[#3F8EFC]" />
                </div>

                {/* Name & Tagline */}
                <h3 className="text-white text-xl font-display font-bold mb-2">
                  {drone.name}
                </h3>
                <p className="text-[#3F8EFC] text-sm font-mono tracking-wide mb-6">
                  {drone.tagline}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {drone.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 text-white/70 text-xs font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Use Cases */}
                <div>
                  <p className="caption-mono text-white/40 mb-4">BEST FOR</p>
                  <ul className="space-y-3">
                    {drone.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                        <span className="w-1.5 h-1.5 bg-[#3F8EFC] rounded-full mt-2 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            All equipment FAA Part 107 compliant and fully insured for commercial operations.
          </p>
        </div>
      </div>
    </section>
  );
}

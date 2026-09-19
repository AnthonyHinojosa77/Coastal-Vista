import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from './lib/navigation';
import PhotoPanel from './components/PhotoPanel';
import Navigation from './components/Navigation';
import ContactSection from './sections/ContactSection';
import DroneLineupSection from './sections/DroneLineupSection';
import PortfolioSection from './sections/PortfolioSection';
import './App.css';

const photographs = [
  { id: 'home', image: 'harbor-bridge-golden-hour', title: ['COASTAL', 'VISTA'], location: 'Corpus Christi, Texas', alt: 'Harbor Bridge in golden evening light over the Corpus Christi port', description: "Aerial storytelling for brands, real estate, and life's big moments." },
  { id: 'work', image: 'coastal-neighborhood-and-bay', title: ['COASTAL', 'PERSPECTIVE'], location: 'Neighborhoods along the bay', alt: 'Corpus Christi neighborhoods stretching toward the bay and distant skyline', description: 'A new perspective on the places we call home.' },
  { id: 'realestate', image: 'pool-daytime', title: ['PROPERTY', 'DETAIL'], location: 'Real estate & outdoor spaces', alt: 'Sunlit backyard pool with bright blue water and surrounding patio', description: 'Show the setting, the space, and the details that make a property stand out.' },
  { id: 'commercial', image: 'harbor-bridge-commercial', title: ['COMMERCIAL', 'PROJECTS'], location: 'Harbor Bridge & the working port', alt: 'Harbor Bridge spanning the working port with ships and construction below', description: 'Construction progress, marine projects, and commercial imagery.' },
  { id: 'city', image: 'city-warm-sky', title: ['CITY', 'STORIES'], location: 'Corpus Christi from above', alt: 'Corpus Christi beneath a warm orange and blue cloud-filled sky', description: 'Familiar places, seen in a different light.' },
  { id: 'after-dark', image: 'pool-after-dark', title: ['AFTER', 'DARK'], location: 'Outdoor living after sunset', alt: 'Illuminated backyard pool and a warm fire feature after dark', description: 'Capture the atmosphere that comes alive after sunset.' },
];

export default function App() {
  const galleryPage = window.location.pathname.endsWith('/gallery.html');
  useEffect(() => {
    if (galleryPage || !window.location.hash) return;
    let cancelled = false;
    void document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      scrollToSection(window.location.hash.slice(1), 'instant');
    }));
    return () => { cancelled = true; };
  }, [galleryPage]);
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation galleryPage={galleryPage} />
      <main id="main">
        {galleryPage ? <PortfolioSection /> : <>
        {photographs.map((photo, index) => <PhotoPanel key={photo.id} photo={photo} index={index} />)}
        <DroneLineupSection />
        <ContactSection />
        </>}
      </main>
    </>
  );
}

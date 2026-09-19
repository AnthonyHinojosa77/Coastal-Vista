import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import VideoPreview from '../components/VideoPreview';
import { gsap } from 'gsap';
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

type Media = { id: string; title: string; description: string; type: 'photo' | 'video'; duration?: string };
const photos: [string, string, string][] = [
  ['P045', 'Sunlit Harbor Bridge', 'Golden light across the bridge and working waterfront.'],
  ['P077', 'Neighborhoods & the bay', 'A coastal neighborhood stretching toward the water.'],
  ['P082', 'River through wooded hills', 'A winding river framed by green hills.'],
  ['P097', 'Clouds over the neighborhood', 'An expansive sky above familiar streets.'],
  ['P024', 'Harbor Bridge after dark', 'Bridge lights reflected in the Corpus Christi waterfront.'],
  ['P056', 'Pool & outdoor living', 'An elevated view of a backyard retreat.'],
  ['P064', 'Property from above', 'A direct overhead perspective of the property and its surroundings.'],
  ['P068', 'Pool geometry', 'Water, paving, and the lines of an outdoor space.'],
  ['harbor-bridge-golden-hour', 'Harbor Bridge at golden hour', 'The evening sun over the Corpus Christi port.'],
  ['coastal-neighborhood-and-bay', 'Coastal perspective', 'Neighborhoods, shoreline, and the distant city.'],
  ['pool-daytime', 'A place in the sun', 'Blue water and a sunlit patio.'],
  ['harbor-bridge-commercial', 'The working port', 'The bridge, ships, and construction along the harbor.'],
  ['city-warm-sky', 'City beneath a warm sky', 'Corpus Christi under orange and blue clouds.'],
  ['pool-after-dark', 'Outdoor living after sunset', 'Pool lighting and a warm fire feature after dark.'],
];
const media: Media[] = [
  ...photos.map(([id, title, description]): Media => ({ id, title, description, type: 'photo' })),
  { id: 'V063', title: 'Golden-hour Harbor Bridge', description: 'An evening view across the bridge and waterfront.', type: 'video', duration: '8 sec' },
  { id: 'V072', title: 'North Beach shoreline', description: 'A coastal flight along North Beach.', type: 'video', duration: '8 sec' },
  { id: 'V010', title: 'Blue-lit Harbor Bridge', description: 'The illuminated bridge against the night sky.', type: 'video', duration: '6 sec' },
  { id: 'V015', title: 'Sports field under lights', description: 'An aerial view of the field after sunset.', type: 'video', duration: '4 sec' },
  { id: 'V079', title: 'Warm sky over the city', description: 'A broad city view beneath a colorful sky.', type: 'video', duration: '8 sec' },
  { id: 'V048', title: 'Pool & outdoor living film', description: 'A short property film exploring the pool and surrounding outdoor spaces.', type: 'video', duration: '30 sec' },
];
const asset = (path: string) => `${import.meta.env.BASE_URL}portfolio/${path}`;

export default function PortfolioSection() {
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [active, setActive] = useState<Media | null>(null);
  const [previewsEnabled, setPreviewsEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [mediaError, setMediaError] = useState(false);
  const section = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = media.filter(item => filter === 'all' || item.type === filter);
  const position = active ? visible.findIndex(item => item.id === active.id) : -1;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.portfolio-heading', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out' });
    }, section);
    return () => mm.revert();
  }, []);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { if (motion.matches) setPreviewsEnabled(false); };
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    if (!active) return;
    const element = dialog.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previous; };
  }, [active]);

  const open = (item: Media) => { setMediaError(false); setActive(item); };
  const step = (direction: number) => open(visible[(position + direction + visible.length) % visible.length]);

  return (
    <section className="portfolio-section" id="portfolio" ref={section} aria-labelledby="portfolio-title">
      <div className="portfolio-shell">
        <header className="portfolio-heading">
          <div><p className="portfolio-eyebrow">Coastal Vista / Selected work</p><h1 id="portfolio-title">Photo & film<br />gallery.</h1></div>
          <p>From the Texas coast to the details of a backyard retreat. Explore photographs and films captured from above.</p>
        </header>
        <div className="portfolio-toolbar">
          <div className="portfolio-filters" role="group" aria-label="Filter portfolio">
            {(['all', 'photo', 'video'] as const).map(type => <button key={type} type="button" aria-pressed={filter === type} onClick={() => setFilter(type)}>{type === 'all' ? 'All work' : type === 'photo' ? 'Photos' : 'Videos'}</button>)}
          </div>
          <button className="preview-toggle" type="button" aria-pressed={previewsEnabled} onClick={() => setPreviewsEnabled(value => !value)}>{previewsEnabled ? 'Pause previews' : 'Enable previews'}</button>
          <p className="portfolio-count" role="status">{visible.length} {filter === 'photo' ? 'photographs' : filter === 'video' ? 'films' : 'perspectives'}</p>
        </div>
        <p className="portfolio-preview-note">Films preview silently as you browse, for up to 10 seconds. Open any photograph or film for a closer look.</p>
        <div className="portfolio-grid">
          {visible.map((item, index) => <button type="button" key={item.id} className={`portfolio-card${index === 0 ? ' portfolio-featured' : ''}`} onClick={() => open(item)} aria-label={`${item.type === 'video' ? 'Play' : 'View'} ${item.title}`}>
            <span className="portfolio-image">
              {item.type === 'photo' ? <img src={asset(`thumbs/${item.id}.webp`)} srcSet={`${asset(`thumbs/${item.id}.webp`)} 1x, ${asset(`photos/${item.id}.webp`)} 2x`} alt="" loading="lazy" decoding="async" width="720" height="480" />
                : <VideoPreview id={item.id} poster={asset(`posters/${item.id}.webp`)} enabled={previewsEnabled && !active} />}
              {item.type === 'video' && <span className="portfolio-play"><Play size={22} fill="currentColor" aria-hidden="true" /><span>{item.duration}</span></span>}
            </span>
            <span className="portfolio-card-caption"><span>{item.title}</span><ArrowUpRight size={18} aria-hidden="true" /></span>
          </button>)}
        </div>
        <div className="portfolio-signoff"><p>Have a place or a project in mind?</p><a href="./#contact">Let’s plan your shoot <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <footer className="gallery-footer"><a href="./">Back to Coastal Vista</a><span>© {new Date().getFullYear()} Coastal Vista</span></footer>
      </div>
      {active && <dialog ref={dialog} className="portfolio-dialog" aria-labelledby="media-title" aria-describedby="media-description" onCancel={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={event => {
        if (active.type === 'photo' && event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        if (active.type === 'photo' && event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      }}>
        <div className="portfolio-viewer">
          <div className="viewer-toolbar"><span>{active.type === 'photo' ? 'Photograph' : 'Film'} · {position + 1} / {visible.length}</span><button type="button" onClick={() => setActive(null)} aria-label="Close media" autoFocus><X aria-hidden="true" /></button></div>
          <div className="viewer-media">
            {active.type === 'photo' ? <img key={active.id} src={asset(`photos/${active.id}.webp`)} alt={active.description} onError={() => setMediaError(true)} /> : <video key={active.id} src={asset(`videos/${active.id}.mp4`)} poster={asset(`posters/${active.id}.webp`)} controls playsInline preload="metadata" onError={() => setMediaError(true)} aria-label={active.title} />}
          </div>
          {mediaError && <p role="alert" className="viewer-error">This media couldn’t load. Please check your connection and try opening it again.</p>}
          <div className="viewer-caption"><div><h3 id="media-title">{active.title}</h3><p id="media-description">{active.description}</p></div><div className="viewer-navigation"><button type="button" onClick={() => step(-1)} aria-label="Previous media"><ChevronLeft /></button><button type="button" onClick={() => step(1)} aria-label="Next media"><ChevronRight /></button></div></div>
        </div>
      </dialog>}
    </section>
  );
}

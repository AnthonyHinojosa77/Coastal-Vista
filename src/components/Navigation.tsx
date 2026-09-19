import type { MouseEvent } from 'react';
import { scrollToSection } from '../lib/navigation';

export default function Navigation({ galleryPage = false }: { galleryPage?: boolean }) {
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.currentTarget;
    if (link.pathname !== window.location.pathname || !link.hash) return;
    const id = link.hash.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    scrollToSection(id);
  };
  const home = galleryPage ? './' : '';
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a onClick={navigate} className="site-logo" href={`${home}#home`}>COASTAL VISTA</a>
      <div className="site-links">
        <a href="./gallery.html" aria-current={galleryPage ? 'page' : undefined}>Gallery</a>
        <a onClick={navigate} className="nav-services" href={`${home}#realestate`}>Services</a>
        <a onClick={navigate} className="nav-equipment" href={`${home}#equipment`}>Equipment</a>
        <a onClick={navigate} className="nav-contact" href={`${home}#contact`}>Let’s talk <span aria-hidden="true">↗</span></a>
      </div>
    </nav>
  );
}

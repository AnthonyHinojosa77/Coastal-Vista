import type { MouseEvent } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navigation() {
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = event.currentTarget.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const trigger = ScrollTrigger.getAll().find(item => item.vars.pin && item.trigger === target);
    // A pinned element's current visual position is not its reading position.
    const top = id === 'home' ? 0 : trigger
      ? trigger.start + (trigger.end - trigger.start) * .4
      : target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a onClick={navigate} className="site-logo" href="#home">COASTAL VISTA</a>
      <div className="site-links">
        <a onClick={navigate} href="#portfolio">Work</a>
        <a onClick={navigate} href="#realestate">Services</a>
        <a onClick={navigate} href="#equipment">Equipment</a>
        <a onClick={navigate} className="nav-contact" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
      </div>
    </nav>
  );
}

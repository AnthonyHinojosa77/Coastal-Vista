import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const target = document.getElementById(id);
  if (!target) return;
  const trigger = ScrollTrigger.getAll().find(item => item.vars.pin && item.trigger === target);
  const top = id === 'home' ? 0 : trigger
    ? trigger.start + (trigger.end - trigger.start) * .4
    : target.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : behavior });
}

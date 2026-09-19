import { useEffect, useRef } from 'react';

type Props = { id: string; poster: string; enabled: boolean };

export default function VideoPreview({ id, poster, enabled }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    let disposed = false;
    const pause = () => video.pause();
    const start = () => {
      if (!enabled || !visible || document.hidden || video.ended) return;
      if (!video.getAttribute('src')) {
        video.src = `${import.meta.env.BASE_URL}portfolio/previews/${id}.mp4`;
      }
      video.muted = true;
      void video.play().then(() => {
        if (disposed || !visible || document.hidden || !enabled) video.pause();
      }).catch(() => { /* The poster and full-film button remain available if autoplay is blocked. */ });
    };
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting && entry.intersectionRatio >= .55;
      if (visible) {
        if (!wasVisible && video.readyState > 0) video.currentTime = 0;
        start();
      } else { pause(); }
    }, { threshold: [0, .55], rootMargin: '-72px 0px 0px 0px' });
    const visibility = () => { if (document.hidden) pause(); else start(); };
    observer.observe(video);
    document.addEventListener('visibilitychange', visibility);
    if (!enabled) pause();
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', visibility); pause(); };
  }, [id, enabled]);
  return <video ref={ref} className="portfolio-preview" data-preview-id={id} poster={poster} muted playsInline preload="none" tabIndex={-1} aria-hidden="true" />;
}

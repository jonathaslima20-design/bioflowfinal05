'use client';

import { useEffect, useRef, useState } from 'react';
import { ThemeMockup } from '@/components/themes/ThemeMockup';
import {
  fetchLandingShowcase,
  fetchLandingCarouselSettings,
  landingDemoFor,
  DEFAULT_CAROUSEL_SETTINGS,
  LandingCarouselSettings,
  ShowcasePreset,
} from '@/lib/theme-showcase';
import { THEMES } from '@/themes/registry';

type Slide = {
  themeKey: string;
  demo: ReturnType<typeof landingDemoFor>;
};

export function ThemeCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [settings, setSettings] = useState<LandingCarouselSettings>(DEFAULT_CAROUSEL_SETTINGS);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const [dragDX, setDragDX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const [presets, cfg] = await Promise.all([
        fetchLandingShowcase(),
        fetchLandingCarouselSettings(),
      ]);
      const valid = (presets as ShowcasePreset[]).filter(p => THEMES[p.theme_key]);
      if (valid.length > 0) {
        setSlides(valid.map(p => ({ themeKey: p.theme_key, demo: landingDemoFor(p) })));
      }
      setSettings(cfg);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPrefersReduced(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const el = containerRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visibleRef.current = e.isIntersecting;
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReduced || paused || dragging || slides.length <= 1) return;
    const id = setInterval(() => {
      if (!visibleRef.current) return;
      setIndex((i) => (i + 1) % slides.length);
    }, Math.max(1500, settings.auto_advance_ms));
    return () => clearInterval(id);
  }, [prefersReduced, paused, dragging, slides.length, settings.auto_advance_ms]);

  function go(dir: -1 | 1) {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }

  function startDrag(clientX: number) {
    if (!settings.drag_enabled) return;
    dragStartX.current = clientX;
    setDragging(true);
  }
  function moveDrag(clientX: number) {
    if (dragStartX.current == null) return;
    setDragDX(clientX - dragStartX.current);
  }
  function endDrag() {
    if (dragStartX.current == null) return;
    const w = containerRef.current?.offsetWidth || 320;
    const threshold = Math.max(40, w * 0.15);
    if (Math.abs(dragDX) > threshold) go(dragDX < 0 ? 1 : -1);
    dragStartX.current = null;
    setDragDX(0);
    setDragging(false);
  }

  function onTouchStart(e: React.TouchEvent) { startDrag(e.touches[0].clientX); }
  function onTouchMove(e: React.TouchEvent) { moveDrag(e.touches[0].clientX); }
  function onTouchEnd() { endDrag(); }
  function onMouseDown(e: React.MouseEvent) {
    if (!settings.drag_enabled) return;
    e.preventDefault();
    startDrag(e.clientX);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (dragStartX.current == null) return;
    moveDrag(e.clientX);
  }
  function onMouseUp() { endDrag(); }
  function onMouseLeave() {
    if (settings.pause_on_hover) setPaused(false);
    if (dragStartX.current != null) endDrag();
  }

  const dragPct = (() => {
    const w = containerRef.current?.offsetWidth || 320;
    return (dragDX / w) * 100;
  })();

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[340px]"
      style={{ touchAction: settings.drag_enabled ? 'pan-y' : 'auto', cursor: settings.drag_enabled ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      onMouseEnter={() => { if (settings.pause_on_hover) setPaused(true); }}
      onMouseLeave={onMouseLeave}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      aria-roledescription="carousel"
      aria-label="Temas da BioFlowzy"
    >
      <div className="relative flex items-center justify-center min-h-[558px] select-none">
        {!loaded && (
          <div
            aria-hidden
            className="absolute rounded-[40px] bg-neutral-100 animate-pulse"
            style={{ width: 260, height: 540 }}
          />
        )}
        {slides.map((s, i) => {
          const offset = i - index;
          const isActive = i === index;
          const translate = offset * settings.translate_percent + dragPct;
          const scale = isActive ? settings.scale_active : settings.scale_inactive;
          const opacity = Math.abs(offset) > 1 ? 0 : isActive ? 1 : settings.inactive_opacity;
          const z = isActive ? 20 : 10 - Math.abs(offset);
          return (
            <div
              key={s.themeKey + i}
              aria-hidden={!isActive}
              className="absolute ease-out"
              style={{
                transform: `translateX(${translate}%) scale(${scale})`,
                opacity,
                zIndex: z,
                pointerEvents: isActive ? 'auto' : 'none',
                transition: dragging ? 'none' : `transform ${settings.transition_ms}ms ease-out, opacity ${settings.transition_ms}ms ease-out`,
              }}
            >
              <ThemeMockup
                themeKey={s.themeKey}
                overrides={s.demo.profile as any}
                links={s.demo.links}
                socials={s.demo.socials}
                videos={s.demo.videos}
                banners={s.demo.banners}
                themeSettings={s.demo.themeSettings}
                width={260}
                height={540}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

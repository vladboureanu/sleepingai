
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ subsets: ['latin'], weight: ['400','500','700'] });

export default function CarouselCoverflow({
  items = [],
  onChange,
  autoplay = true,
  autoplayMs = 4000,
}) {
  const [index, setIndex] = useState(0);
  const len = items.length || 1;

  
  const containerRef = useRef(null);
  const [cw, setCw] = useState(1000);
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      setCw(containerRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const centerW = Math.min(Math.max(cw * 0.35, 360), 780); 
  const centerH = Math.round(centerW * 0.52);
  const sideW   = Math.round(centerW * 0.48);
  const sideH   = Math.round(sideW * 0.47);
  const spacing = Math.round(centerW * 0.36);
  const depth   = Math.round(centerW * 0.16);

  const mod = (n, m) => ((n % m) + m) % m;
  const go = useCallback(
    (i) => {
      const next = mod(i, len);
      setIndex(next);
      onChange?.(next);
    },
    [len, onChange]
  );
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index]);

  
  const startX = useRef(null);
  const onPointerDown = (e) => (startX.current = e.clientX);
  const onPointerUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
  };

  
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!autoplay || hover || len < 2) return;
    const id = setInterval(() => next(), Math.max(autoplayMs, 1000));
    return () => clearInterval(id);
  }, [autoplay, hover, autoplayMs, index, len]); 

  return (
    <div
      className="w-full"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl"
        style={{ height: Math.max(centerH + 40, 280), perspective: '1200px', overflow: 'visible' }}
      >
        
        <div className="absolute inset-0 preserve-3d">
          {items.map((t, i) => {
            
            let offset = i - index;
            if (offset > len / 2) offset -= len;
            if (offset < -len / 2) offset += len;

            const abs = Math.abs(offset);
            const isCenter = abs === 0;

            const translateX = offset * spacing;
            const translateZ = -Math.min(abs, 2) * depth;
            const rotateY = offset * -18;
            const scale = 1 - Math.min(abs, 2) * 0.08;

            const width = isCenter ? centerW : sideW;
            const height = isCenter ? centerH : sideH;

            return (
              <div
                key={t.id}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity,filter] duration-500 will-change-transform ${
                  isCenter ? 'opacity-100' : 'opacity-85'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  width,
                  height,
                  zIndex: 100 - abs,
                }}
              >
                <img
                  src={`/images/${t.image}`}
                  alt={t.title}
                  className="w-full h-full object-cover rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  draggable={false}
                />
                {!isCenter && <div className="absolute inset-0 rounded-[28px] bg-black/15" />}
              </div>
            );
          })}
        </div>

        
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute -left-2 md:left-4 top-1/2 -translate-y-1/2 z-[200]
                     h-12 w-12 md:h-14 md:w-14 grid place-items-center rounded-full
                     bg-transparent shadow-xl hover:shadow-2xl active:scale-95 transition ring-1 ring-black/5"
        >
          <span className="text-xl md:text-2xl text-gray-700">‹</span>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute -right-2 md:right-4 top-1/2 -translate-y-1/2 z-[200]
                     h-12 w-12 md:h-14 md:w-14 grid place-items-center rounded-full
                     bg-transparent shadow-xl hover:shadow-2xl active:scale-95 transition ring-2 ring-black/5"
        >
          <span className="text-xl md:text-2xl text-gray-700">›</span>
        </button>
      </div>

      
<div className="mt-3 text-center">
  <h3 className="text-lg md:text-xl lg:text-2xl text-white font-medium drop-shadow">
    {items[index]?.title}
  </h3>
  {items[index]?.subtitle && (
    <p className="mt-1 text-white/85 text-sm md:text-base">
      {items[index].subtitle}
    </p>
  )}
</div>

      
      <div className="mt-3 flex items-center justify-center gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === index ? 'bg-purple-500 w-4' : 'bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

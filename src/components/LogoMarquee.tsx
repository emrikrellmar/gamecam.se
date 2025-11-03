import { useEffect, useMemo, useRef, useState } from 'react';

export type Logo = { name: string; image: string };

interface LogoMarqueeProps {
  logos: Logo[];
  speed?: number; // pixels per second
  className?: string;
}

// Infinite left-to-right marquee using two copies of the logo row.
export default function LogoMarquee({ logos, speed = 60, className }: LogoMarqueeProps) {
  // Measure the width of a single set to compute duration for a smooth, seamless loop.
  const setRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => setSetWidth(el.getBoundingClientRect().width);
    // Measure once after mount for stability; avoids restarting the animation mid-loop.
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, []);

  // Compute duration from width and speed (pixels/sec). The track moves -50% (one set width).
  const duration = useMemo(() => {
    if (setWidth <= 0) return 20; // fallback
    return Math.max(8, setWidth / speed);
  }, [setWidth, speed]);

  return (
    <div
      className={[
        'relative overflow-hidden',
        // Subtle edge fade to mask the loop seam
        '[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="sponsor-track"
        style={
          {
            animationDuration: `${duration}s`,
            // Use pixel-based shift to avoid percentage rounding seams
            ['--marquee-from' as any]: setWidth ? `-${Math.round(setWidth)}px` : undefined
          } as React.CSSProperties
        }
      >
        {/* First set (measured) */}
        <div ref={setRef} className="flex items-center">
          {logos.map((logo) => (
            <div
              key={`set1-${logo.name}`}
              className="mr-6 flex-none rounded-2xl border border-brand-blue/10 bg-neutral-50 px-6 py-6 w-[180px] sm:w-[200px]"
            >
              <img
                src={logo.image}
                alt={`${logo.name} logo`}
                className="h-12 w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        {/* Second set (aria-hidden) */}
        <div aria-hidden className="flex items-center">
          {logos.map((logo) => (
            <div
              key={`set2-${logo.name}`}
              className="mr-6 flex-none rounded-2xl border border-brand-blue/10 bg-neutral-50 px-6 py-6 w-[180px] sm:w-[200px]"
            >
              <img
                src={logo.image}
                alt=""
                className="h-12 w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

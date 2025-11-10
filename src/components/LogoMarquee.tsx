import { useEffect, useMemo, useRef, useState } from 'react';

export type Logo = { name: string; image: string };

interface LogoMarqueeProps {
  logos: Logo[];
  // I control marquee speed in pixels per second.
  speed?: number;
  className?: string;
}

// I render a seamless left-to-right sponsor marquee by duplicating the row.
export default function LogoMarquee({ logos, speed = 60, className }: LogoMarqueeProps) {
  // I measure one set to compute a smooth, seam-free animation duration.
  const setRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => setSetWidth(el.getBoundingClientRect().width);
    // I only measure once after mount so the loop doesn't restart mid-animation.
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, []);

  // I compute duration from width and speed; the track travels one set width per cycle.
  const duration = useMemo(() => {
    if (setWidth <= 0) return 20; // I fall back to a sensible default
    return Math.max(8, setWidth / speed);
  }, [setWidth, speed]);

  return (
    <div
      className={[
        'relative overflow-hidden',
        // I add a subtle edge fade to hide the loop seam
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
            // I prefer a pixel-based offset to avoid percentage rounding seams
            ['--marquee-from' as any]: setWidth ? `-${Math.round(setWidth)}px` : undefined
          } as React.CSSProperties
        }
      >
        {/* I measure this first set to calculate animation timing */}
        <div ref={setRef} className="flex items-center">
          {logos.map((logo) => (
            <div
              key={`set1-${logo.name}`}
              className="mr-6 flex-none rounded-2xl border border-brand-blue/10 bg-neutral-50 px-6 py-6 w-[180px] sm:w-[200px]"
            >
              <img
                src={logo.image}
                alt={`${logo.name} logo`}
                className="h-12 w-auto mx-auto object-contain"
                loading="lazy"
                decoding="async"
                width="160"
                height="48"
              />
            </div>
          ))}
        </div>
        {/* I duplicate the set (aria-hidden) to create a seamless loop */}
        <div aria-hidden className="flex items-center">
          {logos.map((logo) => (
            <div
              key={`set2-${logo.name}`}
              className="mr-6 flex-none rounded-2xl border border-brand-blue/10 bg-neutral-50 px-6 py-6 w-[180px] sm:w-[200px]"
            >
              <img
                src={logo.image}
                alt=""
                className="h-12 w-auto mx-auto object-contain"
                loading="lazy"
                decoding="async"
                width="160"
                height="48"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

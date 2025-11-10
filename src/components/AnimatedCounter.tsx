import { useEffect, useMemo, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number; // total animation time in ms
  easing?: 'easeOutQuad' | 'easeOutCubic' | 'easeOutQuart';
}

const AnimatedCounter = ({ value, duration = 7500, easing = 'easeOutQuad' }: AnimatedCounterProps) => {
  const frameRef = useRef<number>();
  const [displayValue, setDisplayValue] = useState(value);

  const { target, suffix } = useMemo(() => {
    const numericPart = value.replace(/[^0-9]/g, '');
    const parsed = Number.parseInt(numericPart, 10);
    return {
      target: Number.isNaN(parsed) ? undefined : parsed,
      suffix: value.replace(/[0-9.,]/g, '')
    };
  }, [value]);

  useEffect(() => {
    if (target === undefined) {
      setDisplayValue(value);
      return undefined;
    }

    const start = performance.now();

    const easeFn = (t: number) => {
      switch (easing) {
        case 'easeOutCubic':
          return 1 - Math.pow(1 - t, 3);
        case 'easeOutQuart':
          return 1 - Math.pow(1 - t, 4);
        case 'easeOutQuad':
        default:
          return 1 - Math.pow(1 - t, 2);
      }
    };

    const tick = (now: number) => {
      const linearProgress = Math.min((now - start) / duration, 1);
      const eased = easeFn(linearProgress);
      const current = Math.round(eased * target);
      const formatted = current.toLocaleString();
      setDisplayValue(`${formatted}${suffix}`);

      if (linearProgress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, suffix, target, value, easing]);

  return <span>{displayValue}</span>;
};

export default AnimatedCounter;



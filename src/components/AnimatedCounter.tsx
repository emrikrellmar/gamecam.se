import { useEffect, useMemo, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 5000 }: AnimatedCounterProps) => {
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

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = Math.round(progress * target);
      const formatted = current.toLocaleString();
      setDisplayValue(`${formatted}${suffix}`);

      if (progress < 1) {
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
  }, [duration, suffix, target, value]);

  return <span>{displayValue}</span>;
};

export default AnimatedCounter;



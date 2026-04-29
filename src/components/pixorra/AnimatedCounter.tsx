import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: { value: number; prefix?: string; suffix?: string; className?: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (latest) =>
    prefix + latest.toLocaleString('en-IN', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix
  );

  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
};

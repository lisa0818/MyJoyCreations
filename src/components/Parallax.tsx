"use client";
import { useEffect, useRef, useState, type ReactNode, type ComponentProps } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";

/**
 * Detects whether parallax effects should be enabled.
 * Disabled on small screens & for users who prefer reduced motion — both
 * for performance and accessibility.
 */
function useParallaxEnabled() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return !reduce && wide;
}

/**
 * Smoothly parallax a child element as it passes through the viewport.
 * `speed` is the vertical translation range in pixels.
 * `smooth` (default false) wraps the transform in a spring — costlier; use
 * for hero / featured elements only.
 */
export function Parallax({
  children,
  speed = 60,
  smooth = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  smooth?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useParallaxEnabled();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const spring = useSpring(raw, { stiffness: 80, damping: 20, mass: 0.4 });
  const y = smooth ? spring : raw;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ willChange: "transform" }}>
      <motion.div
        style={{ y: enabled ? (y as MotionValue<number>) : 0 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Parallax background image with a subtle slow zoom — for hero sections.
 */
export function ParallaxImage({
  src,
  alt = "",
  speed = 120,
  scale = 1.15,
  className = "",
  overlayClassName = "",
}: {
  src: string;
  alt?: string;
  speed?: number;
  scale?: number;
  className?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useParallaxEnabled();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, speed]);
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.5 });
  const scaleMv = useTransform(scrollYProgress, [0, 1], [scale, scale * 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0.4]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={
          enabled
            ? { y: y as MotionValue<number>, scale: scaleMv, opacity }
            : { transform: `scale(${scale})` }
        }
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      {overlayClassName && <div className={`absolute inset-0 ${overlayClassName}`} />}
    </div>
  );
}

/**
 * Background-only parallax for any section — places an absolutely positioned
 * image behind content with subtle vertical translation. Useful for wrapping
 * full-bleed sections with a parallax backdrop.
 */
export function ParallaxBg({
  src,
  speed = 80,
  opacity = 0.18,
  className = "",
}: {
  src: string;
  speed?: number;
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useParallaxEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.img
        src={src}
        alt=""
        aria-hidden
        style={{
          y: enabled ? (y as MotionValue<number>) : 0,
          opacity,
        }}
        className="absolute -inset-y-[10%] inset-x-0 w-full h-[120%] object-cover will-change-transform"
      />
    </div>
  );
}

/**
 * Floats a decorative element with a gentle infinite motion.
 */
export function FloatingElement({
  children,
  duration = 6,
  distance = 12,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fixed scroll-progress indicator at the very top of the viewport.
 * Uses a spring-smoothed scaleX transform — cheap and GPU-accelerated.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[80] bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-gold)] to-[var(--color-brand-warm)] pointer-events-none"
      aria-hidden
    />
  );
}

/**
 * Drop-in motion wrapper for CTA buttons / links. Adds hover-lift and
 * tap-press micro-interactions on top of whatever element you pass.
 */
type MotionCTAProps = ComponentProps<typeof motion.div> & {
  as?: "div";
  children: ReactNode;
};

export function MotionCTA({ children, className = "", ...rest }: MotionCTAProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`inline-block ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

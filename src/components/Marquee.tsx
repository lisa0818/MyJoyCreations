"use client";

import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number; // seconds per loop
  className?: string;
}

/**
 * Infinite horizontal marquee. Uses CSS animation (GPU-accelerated, cheap)
 * and duplicates the content track for a seamless loop.
 */
export function Marquee({ items, speed = 40, className = "" }: MarqueeProps) {
  const reduce = useReducedMotion();
  const track = (
    <div
      className="flex shrink-0 items-center gap-3 px-4 whitespace-nowrap"
      style={
        reduce
          ? undefined
          : { animation: `marquee ${speed}s linear infinite` }
      }
    >
      {items.concat(items).map((item, i) => (
        <span
          key={i}
          className="font-display text-1xl md:text-1xl whitespace-nowrap text-[var(--color-ink)]/80"
        >
          {item}
          <span className="inline-block mx-8 w-2 h-2 rounded-full bg-[var(--color-brand)] align-middle" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`flex overflow-hidden ${className}`} aria-hidden>
      {track}
      {track}
    </div>
  );
}

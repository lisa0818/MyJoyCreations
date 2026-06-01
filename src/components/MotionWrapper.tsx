"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Hero Fade-In Animation
export function HeroFadeIn({ children, className, delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hero Title Animation
export function HeroTitle({ children, className, delay = 0.4 }: MotionProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      className={className}
    >
      {children}
    </motion.h1>
  );
}
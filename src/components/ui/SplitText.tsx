'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface SplitTextProps {
  children: React.ReactNode;
  className?: string;
  split?: 'lines' | 'words' | 'chars';
  delay?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  onComplete?: () => void;
}

export function SplitTextComponent({
  children,
  className = '',
  split = 'lines',
  delay = 0,
  duration = 1.2,
  ease = 'expo.out',
  stagger = 0.08,
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  onComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const splitText = new SplitText(el, { 
      type: split, 
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    });

    const targets = split === 'lines' ? splitText.lines : split === 'words' ? splitText.words : splitText.chars;
    
    gsap.fromTo(targets, from, {
      ...to,
      duration,
      ease,
      stagger,
      delay,
      onComplete,
    });

    return () => {
      splitText.revert();
    };
  }, [children, split, delay, duration, ease, stagger, from, to, onComplete]);

  return <div ref={ref} className={className} aria-label={typeof children === 'string' ? children : ''}>{children}</div>;
}
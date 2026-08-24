"use client";
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

export default function Reveal({ children, className = '', delay = 0, direction = 'none', once = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once]);

  const getDirectionClass = () => {
    switch (direction) {
      case 'up': return 'reveal-up';
      case 'down': return 'reveal-down';
      case 'left': return 'reveal-left';
      case 'right': return 'reveal-right';
      default: return 'reveal-fade';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`reveal-wrapper ${getDirectionClass()} ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface StatsBarProps {
  totalCasinos: number;
  avgRating: number;
  featuredCount: number;
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 18 });
  const display = useTransform(spring, (v) => 
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function StatsBar({ totalCasinos, avgRating, featuredCount }: StatsBarProps) {
  const stats = [
    { label: 'Kasyn', value: totalCasinos, decimals: 0 },
    { label: 'Śr. ocena', value: avgRating, decimals: 1 },
    { label: 'Polecane', value: featuredCount, decimals: 0 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-2xl mx-auto">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, type: 'spring', stiffness: 200 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 text-center backdrop-blur-sm hover:border-gold-500/40 transition-colors"
        >
          <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-500">
            <AnimatedNumber value={stat.value} decimals={stat.decimals} />
          </div>
          <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
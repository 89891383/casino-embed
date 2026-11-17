'use client';

import { Casino } from '@/lib/types';
import { Star, Gift, ShieldCheck, Zap, Smartphone, Headphones, ExternalLink, Award, Heart, Clock, BadgeCheck, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CasinoCardProps {
  casino: Casino;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Szybkie wypłaty': Zap,
  'Live Casino': Award,
  'Aplikacja mobilna': Smartphone,
  'Wsparcie 24/7': Headphones,
  'Krypto': ShieldCheck,
  'Wysokie RTP': Star,
  'Program VIP': Award,
  'Bez wageringu': Gift,
  'Natychmiastowe wypłaty': Zap,
  'Turnieje': Flame,
};

export default function CasinoCard({ casino, isFavorite, onToggleFavorite }: CasinoCardProps) {
  const filledStars = Math.floor(casino.rating);
  const hasHalf = casino.rating % 1 >= 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative bg-gradient-to-br from-zinc-900/90 via-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 hover:border-gold-500/60 hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {casino.isFeatured && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 left-6 bg-gradient-to-r from-gold-500 to-amber-400 text-zinc-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 z-10 shadow-lg"
        >
          <Sparkles className="w-3 h-3" />
          POLECANE
        </motion.div>
      )}

      <button
        onClick={() => onToggleFavorite(casino.id)}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 backdrop-blur transition z-10 border border-zinc-700"
        aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      >
        <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400'}`} />
      </button>

      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-zinc-700 group-hover:border-gold-500/40 transition-colors">
          {casino.logoUrl ? (
            <img
              src={casino.logoUrl}
              alt={`Logo ${casino.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/64/27272a/f59e0b?text=${casino.name.slice(0, 2).toUpperCase()}`;
              }}
            />
          ) : (
            <span className="text-gold-400 font-display font-black text-xl">
              {casino.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 pr-10">
          <h3 className="font-display font-black text-xl text-white truncate tracking-tight">
            {casino.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < filledStars
                    ? 'fill-gold-400 text-gold-400'
                    : i === filledStars && hasHalf
                    ? 'fill-gold-400/50 text-gold-400'
                    : 'text-zinc-600'
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-bold text-gold-400">
              {casino.rating.toFixed(1)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-zinc-800/80 text-gold-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
            <Flame className="w-3 h-3" />
            {casino.category === 'slots' ? 'Automaty' : casino.category === 'live' ? 'Live' : casino.category === 'crypto' ? 'Krypto' : casino.category}
          </span>
        </div>
      </div>

      {casino.description && (
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2 relative z-10">{casino.description}</p>
      )}

      <div className="mb-4 flex items-center gap-2 bg-gradient-to-r from-gold-500/15 to-amber-500/10 border border-gold-500/30 rounded-xl px-3 py-2.5 relative z-10">
        <Gift className="w-5 h-5 text-gold-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-gold-100 leading-tight">{casino.bonus}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
        {casino.features.slice(0, 4).map((feature) => {
          const Icon = featureIcons[feature] || ShieldCheck;
          return (
            <span
              key={feature}
              className="inline-flex items-center gap-1 text-xs bg-zinc-800/70 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700/50"
            >
              <Icon className="w-3 h-3 text-gold-400" />
              {feature}
            </span>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800/80 space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            {casino.license}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            {casino.payoutSpeed}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Min. depozyt: <span className="text-zinc-200 font-semibold">{casino.minDeposit}</span>
          </span>
          <motion.a
            whileTap={{ scale: 0.96 }}
            href={casino.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-400 hover:to-amber-300 text-zinc-950 font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-gold-500/25 active:shadow-gold-500/40"
          >
            GRAJ TERAZ
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
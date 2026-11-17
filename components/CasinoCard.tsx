'use client';

import { Casino } from '@/lib/types';
import { Star, Gift, ShieldCheck, Zap, Smartphone, Headphones, ExternalLink, Award, Heart, Clock, BadgeCheck } from 'lucide-react';
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
  'Turnieje': Award,
};

export default function CasinoCard({ casino, isFavorite, onToggleFavorite }: CasinoCardProps) {
  const filledStars = Math.floor(casino.rating);
  const hasHalf = casino.rating % 1 >= 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-gold-500/50 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col h-full"
    >
      {casino.isFeatured && (
        <div className="absolute -top-3 left-6 bg-gold-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
          <Award className="w-3 h-3" />
          Polecane
        </div>
      )}

      <button
        onClick={() => onToggleFavorite(casino.id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition z-10"
        aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
      </button>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-zinc-700">
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
            <span className="text-gold-400 font-display font-extrabold text-xl">
              {casino.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-display font-extrabold text-xl text-white truncate">
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
            <span className="ml-1 text-sm font-semibold text-gold-400">
              {casino.rating.toFixed(1)}
            </span>
          </div>
          <span className="inline-block mt-1 text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full capitalize">
            {casino.category === 'slots' ? 'Automaty' : casino.category === 'live' ? 'Live' : casino.category === 'crypto' ? 'Krypto' : casino.category}
          </span>
        </div>
      </div>

      {casino.description && (
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{casino.description}</p>
      )}

      <div className="mb-4 flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-2">
        <Gift className="w-5 h-5 text-gold-400 flex-shrink-0" />
        <p className="text-sm font-medium text-gold-100 leading-tight">{casino.bonus}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {casino.features.slice(0, 4).map((feature) => {
          const Icon = featureIcons[feature] || ShieldCheck;
          return (
            <span
              key={feature}
              className="inline-flex items-center gap-1 text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full"
            >
              <Icon className="w-3 h-3" />
              {feature}
            </span>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <BadgeCheck className="w-3.5 h-3.5" />
            {casino.license}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {casino.payoutSpeed}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Min. depozyt: <span className="text-zinc-300 font-medium">{casino.minDeposit}</span>
          </span>
          <a
            href={casino.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors active:scale-[0.98]"
          >
            Graj teraz
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
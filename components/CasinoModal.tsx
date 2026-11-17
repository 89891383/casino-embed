'use client';

import { Casino } from '@/lib/types';
import { X, Star, ExternalLink, Gift, ShieldCheck, Clock, Award, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryLabel } from '@/lib/utils';

interface CasinoModalProps {
  casino: Casino | null;
  onClose: () => void;
}

export default function CasinoModal({ casino, onClose }: CasinoModalProps) {
  if (!casino) return null;

  const filledStars = Math.floor(casino.rating);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition z-10"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>

          {casino.isFeatured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gold-500 to-amber-400 text-zinc-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              POLECANE
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 mt-2">
            <div className="w-20 h-20 rounded-2xl bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex-shrink-0">
              {casino.logoUrl ? (
                <img src={casino.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gold-400 font-black text-2xl">
                  {casino.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-display font-black text-2xl text-white tracking-tight">{casino.name}</h2>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < filledStars ? 'fill-gold-400 text-gold-400' : 'text-zinc-600'}`} />
                ))}
                <span className="ml-1 font-bold text-gold-400">{casino.rating.toFixed(1)}</span>
              </div>
              <span className="inline-flex items-center gap-1 mt-2 text-xs bg-zinc-800 text-gold-200 px-2.5 py-0.5 rounded-full border border-zinc-700">
                <Flame className="w-3 h-3" />
                {getCategoryLabel(casino.category)}
              </span>
            </div>
          </div>

          {casino.description && (
            <p className="text-zinc-300 mb-6 leading-relaxed">{casino.description}</p>
          )}

          <div className="bg-gradient-to-r from-gold-500/15 to-amber-500/10 border border-gold-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Gift className="w-6 h-6 text-gold-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gold-300 uppercase tracking-wider font-medium">Bonus powitalny</div>
              <div className="font-semibold text-gold-100 text-lg">{casino.bonus}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-800">
              <div className="text-zinc-500 text-xs mb-1">Min. depozyt</div>
              <div className="font-semibold text-white">{casino.minDeposit}</div>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-800">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Wypłata</div>
              <div className="font-semibold text-white">{casino.payoutSpeed || '—'}</div>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-800">
              <div className="text-zinc-500 text-xs mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Licencja</div>
              <div className="font-semibold text-white">{casino.license || '—'}</div>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-800">
              <div className="text-zinc-500 text-xs mb-1">Kategoria</div>
              <div className="font-semibold text-white">{getCategoryLabel(casino.category)}</div>
            </div>
          </div>

          {casino.features.length > 0 && (
            <div className="mb-6">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-medium">Cechy</div>
              <div className="flex flex-wrap gap-2">
                {casino.features.map((f) => (
                  <span key={f} className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            href={casino.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-400 hover:from-gold-400 hover:to-amber-300 text-zinc-950 font-black py-4 rounded-2xl transition shadow-lg shadow-gold-500/30 active:scale-[0.98]"
          >
            GRAJ TERAZ <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
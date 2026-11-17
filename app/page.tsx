'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Casino } from '@/lib/types';
import CasinoCard from '@/components/CasinoCard';
import { Search, RefreshCw, AlertCircle, Sparkles, Filter, Heart } from 'lucide-react';

const DATA_URL = process.env.NEXT_PUBLIC_DATA_URL || 'https://raw.githubusercontent.com/your-username/your-repo/main/data/casinos.json';

export default function HomePage() {
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('casino-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('casino-favorites', JSON.stringify(next));
      return next;
    });
  };

  const fetchCasinos = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Casino[] = await res.json();
      setCasinos(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się załadować kasyn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEmbed(params.get('embed') === '1');
    fetchCasinos();

    const interval = setInterval(fetchCasinos, 15000);
    return () => clearInterval(interval);
  }, [fetchCasinos]);

  const filtered = useMemo(() => {
    let result = casinos;

    if (showFavorites) {
      result = result.filter((c) => favorites.includes(c.id));
    }

    if (category !== 'all') {
      result = result.filter((c) => c.category === category);
    }

    if (minRating > 0) {
      result = result.filter((c) => c.rating >= minRating);
    }

    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.bonus.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.rating - a.rating);
  }, [casinos, search, category, minRating, showFavorites, favorites]);

  const categories = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'slots', label: 'Automaty' },
    { value: 'live', label: 'Live Casino' },
    { value: 'crypto', label: 'Krypto' },
    { value: 'sports', label: 'Sport' },
  ];

  return (
    <div className={`embed-container min-h-screen ${isEmbed ? 'p-4' : 'p-4 md:p-8'}`}>
      {!isEmbed && (
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight text-white">
              Casino Hub
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">Najlepsze kasyna online. Aktualizowane na żywo.</p>
        </header>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Szukaj kasyn, bonusów, gier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                  showFavorites ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavorites ? 'fill-red-400' : ''}`} />
                Ulubione ({favorites.length})
              </button>
              <button
                onClick={fetchCasinos}
                disabled={loading}
                className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-gold-500/50 transition disabled:opacity-50"
                aria-label="Odśwież"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-zinc-500" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-3 py-1.5 text-sm rounded-full border transition ${
                  category === cat.value
                    ? 'bg-gold-500 text-zinc-950 border-gold-500 font-medium'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="ml-auto px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-300 focus:outline-none focus:border-gold-500"
            >
              <option value={0}>Wszystkie oceny</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
              <option value={4.8}>4.8+</option>
            </select>
          </div>
        </div>

        {lastUpdate && !isEmbed && (
          <p className="text-xs text-zinc-500 mb-4 text-right">
            Ostatnia aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-950/50 border border-red-800 text-red-200 px-4 py-3 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}. Sprawdź NEXT_PUBLIC_DATA_URL lub adres raw GitHub.</span>
          </div>
        )}

        {loading && casinos.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse h-80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-lg">{showFavorites ? 'Brak ulubionych kasyn.' : 'Nie znaleziono kasyn.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((casino) => (
              <CasinoCard
                key={casino.id}
                casino={casino}
                isFavorite={favorites.includes(casino.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
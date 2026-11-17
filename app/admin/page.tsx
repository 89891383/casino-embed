'use client';

import { useState, useCallback } from 'react';
import { Casino, GitHubConfig } from '@/lib/types';
import { Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle, Github, Eye, EyeOff } from 'lucide-react';

const DEFAULT_PATH = 'data/casinos.json';

export default function AdminPage() {
  const [config, setConfig] = useState<GitHubConfig>({
    token: '',
    owner: '',
    repo: '',
    path: DEFAULT_PATH,
    branch: 'main',
  });
  const [showToken, setShowToken] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [editing, setEditing] = useState<Casino | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Casino>>({
    name: '',
    logoUrl: '',
    rating: 4.5,
    bonus: '',
    affiliateLink: '',
    minDeposit: '10€',
    features: [],
    category: 'slots',
    description: '',
    license: 'MGA',
    payoutSpeed: '24h',
    isFeatured: false,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadFromGitHub = useCallback(async () => {
    if (!config.token || !config.owner || !config.repo) {
      setMessage({ type: 'error', text: 'Wypełnij token, owner i repo' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch || 'main'}`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (!res.ok) {
        if (res.status === 404) {
          setCasinos([]);
          setIsAuthenticated(true);
          setMessage({ type: 'success', text: 'Brak pliku — zacznij dodawać kasyna' });
          return;
        }
        throw new Error(`GitHub: ${res.status}`);
      }
      const data = await res.json();
      const content = atob(data.content.replace(/\n/g, ''));
      const parsed: Casino[] = JSON.parse(content);
      setCasinos(parsed);
      setIsAuthenticated(true);
      setMessage({ type: 'success', text: `Załadowano ${parsed.length} kasyn` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Błąd ładowania' });
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const saveToGitHub = async () => {
    if (!config.token || !config.owner || !config.repo) return;
    setSaving(true);
    setMessage(null);
    try {
      let sha: string | undefined;
      const getRes = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch || 'main'}`,
        {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(casinos, null, 2))));

      const putRes = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Aktualizacja kasyn przez panel admina`,
            content,
            sha,
            branch: config.branch || 'main',
          }),
        }
      );

      if (!putRes.ok) {
        const errData = await putRes.json();
        throw new Error(errData.message || `Zapis nieudany: ${putRes.status}`);
      }

      setMessage({ type: 'success', text: 'Zapisano! Strona publiczna zaktualizuje się w kilka sekund.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Błąd zapisu' });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (casino: Casino) => {
    setEditing(casino);
    setForm({ ...casino });
    setFeatureInput('');
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm({
      name: '',
      logoUrl: '',
      rating: 4.5,
      bonus: '',
      affiliateLink: '',
      minDeposit: '10€',
      features: [],
      category: 'slots',
      description: '',
      license: 'MGA',
      payoutSpeed: '24h',
      isFeatured: false,
    });
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.name || !form.affiliateLink) {
      setMessage({ type: 'error', text: 'Nazwa i link afiliacyjny są wymagane' });
      return;
    }
    const newCasino: Casino = {
      id: editing?.id || crypto.randomUUID(),
      name: form.name!,
      logoUrl: form.logoUrl || '',
      rating: Number(form.rating) || 4.5,
      bonus: form.bonus || '',
      affiliateLink: form.affiliateLink!,
      minDeposit: form.minDeposit || '10€',
      features: form.features || [],
      category: form.category || 'slots',
      description: form.description || '',
      license: form.license || 'MGA',
      payoutSpeed: form.payoutSpeed || '24h',
      isFeatured: form.isFeatured || false,
    };

    if (editing) {
      setCasinos(casinos.map((c) => (c.id === editing.id ? newCasino : c)));
    } else {
      setCasinos([...casinos, newCasino]);
    }
    setEditing(null);
    setShowForm(false);
    setMessage({ type: 'success', text: editing ? 'Zaktualizowano lokalnie — kliknij Zapisz do GitHub' : 'Dodano lokalnie — kliknij Zapisz do GitHub' });
  };

  const deleteCasino = (id: string) => {
    if (confirm('Usunąć to kasyno?')) {
      setCasinos(casinos.filter((c) => c.id !== id));
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && form.features) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    if (form.features) {
      setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center gap-3">
          <Github className="w-8 h-8 text-gold-400" />
          <h1 className="font-display font-black text-3xl md:text-4xl">Panel Admina</h1>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="font-display font-extrabold text-xl mb-4">Połączenie z GitHub</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 relative">
              <label className="block text-sm text-zinc-400 mb-1">Personal Access Token (scope: repo)</label>
              <input
                type={showToken ? 'text' : 'password'}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                placeholder="github_pat_..."
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-9 text-zinc-500 hover:text-zinc-300"
              >
                {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Owner</label>
              <input
                value={config.owner}
                onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                placeholder="twoj-username"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Repo</label>
              <input
                value={config.repo}
                onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                placeholder="casino-embed"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Ścieżka pliku</label>
              <input
                value={config.path}
                onChange={(e) => setConfig({ ...config, path: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Branch</label>
              <input
                value={config.branch}
                onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={loadFromGitHub}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            Załaduj z GitHub
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 ${
              message.type === 'success' ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-200' : 'bg-red-950/50 border border-red-800 text-red-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-extrabold text-xl">Kasyna ({casinos.length})</h2>
                <button
                  onClick={startNew}
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold px-4 py-2 rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj kasyno
                </button>
              </div>
              <div className="space-y-3">
                {casinos.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-zinc-400">{c.bonus}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => deleteCasino(c.id)}
                        className="p-2 text-red-400 hover:bg-red-950 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {casinos.length === 0 && <p className="text-zinc-500 text-center py-8">Brak kasyn. Dodaj pierwsze.</p>}
              </div>
            </div>

            {showForm && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
                <h3 className="font-display font-extrabold text-lg mb-4">
                  {editing ? 'Edytuj kasyno' : 'Nowe kasyno'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Nazwa *</label>
                    <input
                      value={form.name || ''}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">URL logo</label>
                    <input
                      value={form.logoUrl || ''}
                      onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Ocena (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={form.rating || 4.5}
                      onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Kategoria</label>
                    <select
                      value={form.category || 'slots'}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    >
                      <option value="slots">Automaty</option>
                      <option value="live">Live Casino</option>
                      <option value="crypto">Krypto</option>
                      <option value="sports">Sport</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Min. depozyt</label>
                    <input
                      value={form.minDeposit || ''}
                      onChange={(e) => setForm({ ...form, minDeposit: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Licencja</label>
                    <input
                      value={form.license || ''}
                      onChange={(e) => setForm({ ...form, license: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Czas wypłaty</label>
                    <input
                      value={form.payoutSpeed || ''}
                      onChange={(e) => setForm({ ...form, payoutSpeed: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                      placeholder="0-24h"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">Bonus</label>
                    <input
                      value={form.bonus || ''}
                      onChange={(e) => setForm({ ...form, bonus: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">Opis</label>
                    <textarea
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">Link afiliacyjny *</label>
                    <input
                      value={form.affiliateLink || ''}
                      onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1">Cechy</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-xl focus:border-gold-500 focus:outline-none"
                        placeholder="Wpisz i naciśnij Enter"
                      />
                      <button type="button" onClick={addFeature} className="px-4 bg-zinc-800 rounded-xl">
                        Dodaj
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.features || []).map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full text-sm">
                          {f}
                          <button onClick={() => removeFeature(i)} className="text-zinc-500 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.isFeatured || false}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-5 h-5 accent-gold-500"
                    />
                    <label htmlFor="featured" className="text-sm">Polecane</label>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={saveForm}
                    className="bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold px-6 py-2.5 rounded-xl transition"
                  >
                    {editing ? 'Zaktualizuj' : 'Dodaj'} do listy
                  </button>
                  <button
                    onClick={() => { setEditing(null); setShowForm(false); }}
                    className="px-6 py-2.5 border border-zinc-700 rounded-xl hover:bg-zinc-800"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}

            <div className="sticky bottom-4 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <p className="text-sm text-zinc-400">Zmiany są lokalne dopóki nie zapiszesz do GitHub.</p>
              <button
                onClick={saveToGitHub}
                disabled={saving || casinos.length === 0}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Zapisz do GitHub
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
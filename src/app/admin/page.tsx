'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Save, LogOut, Eye, EyeOff,
  CheckCircle2, XCircle, Loader2, ArrowLeft, Star,
  Github, Database, RefreshCw, ToggleLeft, ToggleRight,
  GripVertical, ChevronDown, ChevronUp,
} from 'lucide-react'
import { fetchSiteDataAuth, saveSiteData } from '@/lib/github'
import type { Casino, GithubConfig, SiteData, DepositBonus } from '@/lib/types'
import { getDefaultData } from '@/lib/types'

/* ─── CONSTANTS ─────────────────────────────────────────── */

const LS_CONFIG = 'casino_admin_cfg'
const LS_DATA   = 'casino_admin_data'

function emptyDepositBonuses(): DepositBonus[] {
  return [
    { deposit: 1, percent: 100, maxBonus: 0, freeSpins: 0 },
    { deposit: 2, percent: 75,  maxBonus: 0, freeSpins: 0 },
    { deposit: 3, percent: 75,  maxBonus: 0, freeSpins: 0 },
    { deposit: 4, percent: 75,  maxBonus: 0, freeSpins: 0 },
  ]
}

function emptyCasino(): Casino {
  return {
    id: `casino_${Date.now()}`,
    name: '',
    logo: '',
    bonusText: '',
    bonusAmount: 0,
    currency: 'PLN',
    freeSpins: 0,
    rating: 4.5,
    ratingCount: '',
    url: '',
    featured: false,
    badge: '',
    tags: [],
    depositBonuses: emptyDepositBonuses(),
    active: true,
    order: 99,
    createdAt: new Date().toISOString(),
  }
}

/* ─── TOAST ─────────────────────────────────────────────── */

interface Toast {
  type: 'success' | 'error' | 'info'
  msg: string
}

function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [toast, onClose])

  const bg =
    toast.type === 'success' ? 'bg-lime/10 border-lime/30 text-lime' :
    toast.type === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400' :
    'bg-white/10 border-white/20 text-t2'

  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Database

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 border rounded-xl px-5 py-3 text-sm font-heading font-semibold shadow-card backdrop-blur-md ${bg}`}
    >
      <Icon size={16} />
      {toast.msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <XCircle size={14} />
      </button>
    </div>
  )
}

/* ─── INPUT HELPERS ─────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-heading font-semibold text-t3 uppercase tracking-wider mb-1.5">
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-s3 border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-t1 font-body placeholder:text-t3 focus:outline-none focus:border-lime/40 transition-colors disabled:opacity-50"
    />
  )
}

/* ─── LOGIN VIEW ─────────────────────────────────────────── */

function LoginView({ onLogin }: { onLogin: (cfg: GithubConfig) => void }) {
  const [form, setForm] = useState<GithubConfig>({
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
    path: 'data/casinos.json',
  })
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const set = (k: keyof GithubConfig) => (v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async () => {
    if (!form.token || !form.owner || !form.repo) {
      setError('Wypełnij token, właściciela i nazwę repozytorium.')
      return
    }
    setLoading(true)
    setError('')
    const data = await fetchSiteDataAuth(form)
    setLoading(false)
    if (!data) {
      setError('Nie udało się pobrać danych. Sprawdź token i dane repozytorium.')
      return
    }
    // Store config (never store in local storage for real production —
    // this is acceptable for a personal admin panel)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_CONFIG, JSON.stringify(form))
    }
    onLogin(form)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime/10 border border-lime/20 mb-4">
            <Github size={26} className="text-lime" />
          </div>
          <h1 className="font-heading font-black text-2xl text-t1">Panel admina</h1>
          <p className="text-sm text-t3 font-body mt-1">
            Zaloguj się przez GitHub żeby zarządzać kasynami
          </p>
        </div>

        {/* Form */}
        <div className="bg-s2 border border-white/[0.08] rounded-2xl p-6 space-y-4">
          {/* Token */}
          <div>
            <Label>GitHub Personal Access Token</Label>
            <div className="relative">
              <Input
                type={showToken ? 'text' : 'password'}
                value={form.token}
                onChange={set('token')}
                placeholder="github_pat_..."
              />
              <button
                type="button"
                onClick={() => setShowToken(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t1"
              >
                {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[11px] text-t3 mt-1 font-body">
              Uprawnienia: <span className="text-lime">Contents: Read &amp; Write</span>
            </p>
          </div>

          {/* Owner + Repo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Właściciel repo</Label>
              <Input value={form.owner} onChange={set('owner')} placeholder="twoja-nazwa" />
            </div>
            <div>
              <Label>Nazwa repo</Label>
              <Input value={form.repo} onChange={set('repo')} placeholder="casino-site" />
            </div>
          </div>

          {/* Branch + Path */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Branch</Label>
              <Input value={form.branch} onChange={set('branch')} placeholder="main" />
            </div>
            <div>
              <Label>Ścieżka do pliku</Label>
              <Input value={form.path} onChange={set('path')} placeholder="data/casinos.json" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <XCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-lime text-bg font-heading font-black text-sm py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Github size={16} />}
            {loading ? 'Łączenie…' : 'Zaloguj się przez GitHub'}
          </button>
        </div>

        <p className="text-center text-xs text-t3 mt-4 font-body">
          Token jest przechowywany tylko w localStorage Twojej przeglądarki.
        </p>
      </div>
    </div>
  )
}

/* ─── CASINO FORM MODAL ─────────────────────────────────── */

interface CasinoFormProps {
  initial: Casino | null
  onSave: (c: Casino) => void
  onCancel: () => void
}

function CasinoFormModal({ initial, onSave, onCancel }: CasinoFormProps) {
  const [form, setForm] = useState<Casino>(initial ?? emptyCasino())
  const [tagsRaw, setTagsRaw] = useState((initial?.tags ?? []).join(', '))

  const set = <K extends keyof Casino>(k: K) =>
    (v: Casino[K]) => setForm(f => ({ ...f, [k]: v }))

  const setStr = (k: keyof Casino) => (v: string) =>
    setForm(f => ({ ...f, [k]: v as never }))

  const setNum = (k: keyof Casino) => (v: string) =>
    setForm(f => ({ ...f, [k]: parseFloat(v) || 0 as never }))

  const setDB = (i: number, k: keyof DepositBonus) => (v: string) =>
    setForm(f => ({
      ...f,
      depositBonuses: f.depositBonuses.map((d, idx) =>
        idx === i ? { ...d, [k]: parseFloat(v) || 0 } : d
      ),
    }))

  const handleSave = () => {
    const id = form.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || `casino_${Date.now()}`
    onSave({
      ...form,
      id: initial?.id ?? id,
      tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 bg-bg/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-s2 border border-white/[0.10] rounded-2xl shadow-card overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h2 className="font-heading font-black text-lg text-t1">
            {initial ? 'Edytuj kasyno' : 'Dodaj kasyno'}
          </h2>
          <button onClick={onCancel} className="text-t3 hover:text-t1 transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Basic info */}
          <div>
            <p className="text-xs text-lime font-heading font-semibold uppercase tracking-widest mb-3">Podstawowe info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Nazwa kasyna</Label>
                <Input value={form.name} onChange={setStr('name')} placeholder="SpinBetter" />
              </div>
              <div className="col-span-2">
                <Label>URL logo (bezpośredni link do obrazka)</Label>
                <Input value={form.logo} onChange={setStr('logo')} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <Label>Link afiliacyjny (URL)</Label>
                <Input value={form.url} onChange={setStr('url')} placeholder="https://spinbetter.com/?ref=..." />
              </div>
            </div>
          </div>

          {/* Bonus */}
          <div>
            <p className="text-xs text-lime font-heading font-semibold uppercase tracking-widest mb-3">Bonus</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Kwota bonusu (liczba)</Label>
                <Input type="number" value={form.bonusAmount} onChange={setNum('bonusAmount')} placeholder="6350" />
              </div>
              <div>
                <Label>Waluta</Label>
                <select
                  value={form.currency}
                  onChange={e => setStr('currency')(e.target.value)}
                  className="w-full bg-s3 border border-white/[0.10] rounded-lg px-3 py-2.5 text-sm text-t1 font-body focus:outline-none focus:border-lime/40"
                >
                  <option value="PLN">PLN</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <Label>Darmowe spiny (łącznie)</Label>
                <Input type="number" value={form.freeSpins} onChange={setNum('freeSpins')} placeholder="150" />
              </div>
              <div>
                <Label>Tekst bonusu (wyświetlany)</Label>
                <Input value={form.bonusText} onChange={setStr('bonusText')} placeholder="6350 PLN + 150 FS" />
              </div>
            </div>
          </div>

          {/* Deposit breakdown */}
          <div>
            <p className="text-xs text-lime font-heading font-semibold uppercase tracking-widest mb-3">Podział na depozyty</p>
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <div className="grid grid-cols-4 text-[10px] text-t3 font-heading font-semibold uppercase tracking-wide px-4 py-2 bg-s3 border-b border-white/[0.08]">
                <span>Depozyt</span><span>Procent</span><span>Maks. bonus</span><span>Free Spiny</span>
              </div>
              {form.depositBonuses.map((d, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 px-4 py-2 border-b border-white/[0.05] last:border-b-0">
                  <div className="flex items-center">
                    <span className="font-heading font-bold text-sm text-t2">{d.deposit}.</span>
                  </div>
                  <Input type="number" value={d.percent}   onChange={setDB(i, 'percent')}   placeholder="100" />
                  <Input type="number" value={d.maxBonus}  onChange={setDB(i, 'maxBonus')}  placeholder="1500" />
                  <Input type="number" value={d.freeSpins} onChange={setDB(i, 'freeSpins')} placeholder="50" />
                </div>
              ))}
            </div>
          </div>

          {/* Rating + badge */}
          <div>
            <p className="text-xs text-lime font-heading font-semibold uppercase tracking-widest mb-3">Ocena i etykiety</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ocena (0.0–5.0)</Label>
                <Input type="number" value={form.rating} onChange={setNum('rating')} placeholder="4.8" />
              </div>
              <div>
                <Label>Liczba ocen (tekst)</Label>
                <Input value={form.ratingCount} onChange={setStr('ratingCount')} placeholder="2.4k" />
              </div>
              <div>
                <Label>Badge (np. &quot;Polecane&quot;)</Label>
                <Input value={form.badge ?? ''} onChange={setStr('badge')} placeholder="Polecane" />
              </div>
              <div>
                <Label>Kolejność wyświetlania</Label>
                <Input type="number" value={form.order} onChange={setNum('order')} placeholder="1" />
              </div>
              <div className="col-span-2">
                <Label>Tagi (oddzielone przecinkiem)</Label>
                <Input
                  value={tagsRaw}
                  onChange={setTagsRaw}
                  placeholder="Szybkie wypłaty, Licencja, Support 24/7"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'featured' as const, label: 'Wyróżnione (featured)' },
              { key: 'active'   as const, label: 'Aktywne (widoczne)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => set(key)(!form[key] as never)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-heading font-semibold transition-all ${
                  form[key]
                    ? 'border-lime/30 bg-lime/10 text-lime'
                    : 'border-white/[0.10] text-t3 hover:border-white/[0.20]'
                }`}
              >
                {form[key] ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] bg-s1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-heading font-semibold text-t3 hover:text-t1 transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-lime text-bg font-heading font-black text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
          >
            <Save size={15} />
            Zapisz kasyno
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── CASINO ROW CARD ───────────────────────────────────── */

function CasinoRow({
  casino,
  onEdit,
  onDelete,
  onToggle,
}: {
  casino: Casino
  onEdit:   () => void
  onDelete: () => void
  onToggle: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        casino.active
          ? 'border-white/[0.08] bg-s2 hover:border-white/[0.14]'
          : 'border-white/[0.05] bg-s1 opacity-50'
      }`}
    >
      {/* Drag handle (cosmetic) */}
      <GripVertical size={15} className="text-t3 flex-shrink-0 cursor-grab" />

      {/* Logo */}
      <div className="flex-shrink-0 w-12 h-10 flex items-center justify-center bg-white/[0.04] rounded-lg overflow-hidden">
        {casino.logo ? (
          <img src={casino.logo} alt={casino.name} className="max-h-8 max-w-[44px] object-contain" />
        ) : (
          <Database size={16} className="text-t3" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-heading font-bold text-sm text-t1 truncate">{casino.name || '(bez nazwy)'}</span>
          {casino.featured && (
            <span className="text-[9px] font-heading font-bold border border-lime/30 text-lime rounded-full px-1.5 py-0.5 uppercase tracking-wide">
              featured
            </span>
          )}
          {casino.badge && (
            <span className="text-[9px] font-heading font-semibold text-t3 bg-white/[0.06] rounded-full px-1.5 py-0.5">
              {casino.badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-t3 font-body">
          <span className="text-lime font-heading font-bold">{casino.bonusAmount.toLocaleString('pl-PL')} {casino.currency}</span>
          <span>·</span>
          <span>{casino.freeSpins} FS</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <Star size={9} className="text-lime fill-lime" />
            {casino.rating.toFixed(1)}
          </span>
          <span>· #{casino.order}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={onToggle}
          title={casino.active ? 'Deaktywuj' : 'Aktywuj'}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-t3 hover:text-t1 transition-colors"
        >
          {casino.active ? <ToggleRight size={16} className="text-lime" /> : <ToggleLeft size={16} />}
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-white/[0.08] text-t3 hover:text-lime transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-t3 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

/* ─── DASHBOARD ─────────────────────────────────────────── */

interface DashboardProps {
  data:    SiteData
  config:  GithubConfig
  onLogout: () => void
  onUpdate: (d: SiteData) => void
  showToast: (t: Toast) => void
}

function Dashboard({ data, config, onLogout, onUpdate, showToast }: DashboardProps) {
  const [editing, setEditing] = useState<Casino | null | undefined>(undefined)
  // undefined = not open, null = new casino, Casino = existing
  const [saving, setSaving]   = useState(false)

  const casinos = [...data.casinos].sort((a, b) => a.order - b.order)

  const handleSaveCasino = (c: Casino) => {
    const idx = data.casinos.findIndex(x => x.id === c.id)
    const updated = idx >= 0
      ? data.casinos.map(x => x.id === c.id ? c : x)
      : [...data.casinos, c]
    onUpdate({ ...data, casinos: updated })
    setEditing(undefined)
    showToast({ type: 'info', msg: 'Kasyno zaktualizowane. Pamiętaj o zapisaniu do GitHub.' })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Usunąć to kasyno?')) return
    onUpdate({ ...data, casinos: data.casinos.filter(c => c.id !== id) })
    showToast({ type: 'info', msg: 'Usunięto. Zapisz do GitHub żeby zmiany były widoczne.' })
  }

  const handleToggle = (id: string) => {
    onUpdate({
      ...data,
      casinos: data.casinos.map(c => c.id === id ? { ...c, active: !c.active } : c),
    })
  }

  const handleSaveGithub = async () => {
    setSaving(true)
    const result = await saveSiteData(config, data)
    setSaving(false)
    showToast({ type: result.ok ? 'success' : 'error', msg: result.message })
  }

  const stats = {
    total:  data.casinos.length,
    active: data.casinos.filter(c => c.active).length,
    featured: data.casinos.filter(c => c.featured).length,
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-s1/90 backdrop-blur border-b border-white/[0.07]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime/10 grid place-items-center">
              <Database size={16} className="text-lime" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-t1">Casino Admin</span>
              <span className="ml-2 text-xs text-t3 font-body hidden sm:inline">
                {config.owner}/{config.repo}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-t3 hover:text-t1 font-heading font-semibold transition-colors"
            >
              <Eye size={13} />
              Podgląd strony
            </a>

            <button
              onClick={handleSaveGithub}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-lime text-bg font-heading font-black text-xs px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {saving
                ? <Loader2 size={13} className="animate-spin" />
                : <Save size={13} />}
              {saving ? 'Zapisuję…' : 'Zapisz do GitHub'}
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-t3 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Wyloguj"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Wszystkich',  value: stats.total,    color: 'text-t1' },
            { label: 'Aktywnych',   value: stats.active,   color: 'text-lime' },
            { label: 'Wyróżnionych', value: stats.featured, color: 'text-purple-soft' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-s2 border border-white/[0.08] rounded-xl p-4 text-center">
              <div className={`font-display font-black italic text-4xl ${color}`}>{value}</div>
              <div className="text-xs text-t3 font-body mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Casino list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-black text-lg text-t1">Lista kasyn</h2>
            <button
              onClick={() => setEditing(null)}
              className="inline-flex items-center gap-2 bg-s2 border border-lime/20 text-lime font-heading font-bold text-xs px-4 py-2 rounded-lg hover:bg-lime/10 transition-colors"
            >
              <Plus size={13} />
              Dodaj kasyno
            </button>
          </div>

          {casinos.length === 0 ? (
            <div className="text-center py-16 text-t3 font-body text-sm">
              Brak kasyn. Kliknij &quot;Dodaj kasyno&quot; żeby dodać pierwsze.
            </div>
          ) : (
            <div className="space-y-2">
              {casinos.map(c => (
                <CasinoRow
                  key={c.id}
                  casino={c}
                  onEdit={()   => setEditing(c)}
                  onDelete={() => handleDelete(c.id)}
                  onToggle={() => handleToggle(c.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="bg-s2 border border-white/[0.07] rounded-xl p-4 text-xs text-t3 font-body space-y-1">
          <p className="font-heading font-semibold text-t2 text-sm mb-2">Jak to działa?</p>
          <p>1. Dodaj / edytuj kasyna w panelu.</p>
          <p>2. Kliknij <span className="text-lime font-semibold">Zapisz do GitHub</span> — to zatwierdzi zmiany w pliku <code className="bg-s3 px-1 rounded text-lime">data/casinos.json</code>.</p>
          <p>3. Strona pobiera dane z GitHub w czasie rzeczywistym — odśwież i zmiany będą widoczne.</p>
          <p className="text-t3 mt-2">
            Ostatnia aktualizacja: {new Date(data.lastUpdated).toLocaleString('pl-PL')}
          </p>
        </div>
      </main>

      {/* Casino form modal */}
      {editing !== undefined && (
        <CasinoFormModal
          initial={editing}
          onSave={handleSaveCasino}
          onCancel={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}

/* ─── ROOT ──────────────────────────────────────────────── */

export default function AdminPage() {
  const [config, setConfig] = useState<GithubConfig | null>(null)
  const [data,   setData]   = useState<SiteData | null>(null)
  const [toast,  setToast]  = useState<Toast | null>(null)
  const [booting, setBooting] = useState(true)

  // Auto-login from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(LS_CONFIG)
    const cached = localStorage.getItem(LS_DATA)
    if (raw) {
      try {
        const cfg: GithubConfig = JSON.parse(raw)
        setConfig(cfg)
        // Use cached data first, then refresh
        if (cached) setData(JSON.parse(cached))
        fetchSiteDataAuth(cfg).then(d => {
          if (d) {
            setData(d)
            localStorage.setItem(LS_DATA, JSON.stringify(d))
          }
        })
      } catch { /* ignore */ }
    }
    setBooting(false)
  }, [])

  const handleLogin = useCallback(async (cfg: GithubConfig) => {
    const d = await fetchSiteDataAuth(cfg)
    setConfig(cfg)
    setData(d ?? getDefaultData())
    if (d) localStorage.setItem(LS_DATA, JSON.stringify(d))
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LS_CONFIG)
      localStorage.removeItem(LS_DATA)
    }
    setConfig(null)
    setData(null)
  }

  const handleUpdate = (d: SiteData) => {
    setData(d)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_DATA, JSON.stringify(d))
    }
  }

  const showToast = (t: Toast) => setToast(t)

  if (booting) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 size={28} className="text-lime animate-spin" />
      </div>
    )
  }

  return (
    <>
      {(!config || !data) ? (
        <LoginView onLogin={handleLogin} />
      ) : (
        <Dashboard
          data={data}
          config={config}
          onLogout={handleLogout}
          onUpdate={handleUpdate}
          showToast={showToast}
        />
      )}

      {toast && (
        <ToastBanner toast={toast} onClose={() => setToast(null)} />
      )}
    </>
  )
}

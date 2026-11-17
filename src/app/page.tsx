'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Star, Shield, Zap, Headphones, Lock, Smartphone,
  ArrowRight, CheckCircle2, ChevronDown, Gift,
  UserPlus, Wallet, Play, Tv2, Dice6, Rocket,
  Trophy, CreditCard, AlertCircle,
} from 'lucide-react'
import { fetchSiteData } from '@/lib/github'
import type { Casino, SiteData } from '@/lib/types'
import { getDefaultData } from '@/lib/types'

/* ─────────────────────────────────────────────────────── */
/* Small shared components                                */
/* ─────────────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? 'text-lime fill-lime' : 'text-t3'}
        />
      ))}
    </span>
  )
}

function AgeBanner() {
  return (
    <div className="bg-s1 border-b border-white/[0.06] py-1.5 px-4 text-center text-[11px] text-t3 font-body">
      <span className="text-lime font-semibold">18+</span>
      {' '}· Oferta wyłącznie dla osób pełnoletnich · Poza terytorium Polski ·{' '}
      <span className="font-medium">Graj odpowiedzialnie</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Hero section                                           */
/* ─────────────────────────────────────────────────────── */

function HeroSection({ featured }: { featured: Casino | null }) {
  if (!featured) return null

  return (
    <section className="scene-hero relative overflow-hidden">
      {/* radial accent glow on top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,240,0,.13) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        {/* Casino logo */}
        <div className="flex justify-center mb-7">
          <img
            src={featured.logo}
            alt={featured.name}
            className="h-10 md:h-12 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 border border-lime/20 rounded-full px-4 py-1.5 mb-7">
          <Star size={10} className="text-lime fill-lime" />
          <span className="text-xs text-t2 font-body">Ekskluzywna oferta powitalna</span>
        </div>

        {/* BIG bonus number */}
        <h1
          className="font-display font-black italic text-lime-glow leading-[.85] mb-2"
          style={{ fontSize: 'clamp(72px, 17vw, 150px)' }}
        >
          {featured.bonusAmount.toLocaleString('pl-PL')}
          <sup
            className="font-heading font-black not-italic"
            style={{ fontSize: '.28em', verticalAlign: 'super' }}
          >
            {featured.currency}
          </sup>
        </h1>

        <p className="font-heading font-extrabold text-xl md:text-3xl text-t1 mb-10 tracking-tight">
          + {featured.freeSpins} Darmowych Spinów
        </p>

        {/* Hero CTA */}
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-lime text-bg font-heading font-black text-base md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-full shadow-lime hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-150"
        >
          <Gift size={19} />
          Odbierz pakiet powitalny
          <ArrowRight size={17} />
        </a>

        <p className="mt-5 text-xs text-t3 font-body">
          Bez kodu promocyjnego · Rejestracja w 2 minuty · 18+
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Trust strip                                            */
/* ─────────────────────────────────────────────────────── */

const TRUST = [
  { icon: Shield,     label: 'Licencja',         value: 'Legalny operator' },
  { icon: Zap,        label: 'Szybkie wypłaty',   value: 'Do 24 h na konto' },
  { icon: Lock,       label: 'Szyfrowanie SSL',   value: 'Dane chronione' },
  { icon: Headphones, label: 'Support 24/7',      value: 'Pomoc po polsku' },
]

function TrustStrip() {
  return (
    <div className="bg-s1 border-y border-white/[0.07]">
      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-0">
        {TRUST.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-2 ${i > 0 ? 'border-l border-white/[0.07]' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-white/[0.07]' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg bg-lime/10 grid place-items-center flex-shrink-0">
              <Icon size={15} className="text-lime" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-t1 leading-tight">{label}</div>
              <div className="text-xs text-t3 font-body">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Casino ranking list card                               */
/* ─────────────────────────────────────────────────────── */

function CasinoCard({ casino, rank }: { casino: Casino; rank: number }) {
  const isFirst = rank === 1

  return (
    <div
      className={`
        relative flex flex-col md:flex-row md:items-center gap-0
        rounded-2xl overflow-hidden border transition-all duration-200 group
        ${isFirst
          ? 'border-lime/30 bg-feat-grad shadow-glow'
          : 'border-white/[0.08] bg-card-grad hover:border-white/[0.16] hover:shadow-card'
        }
      `}
    >
      {/* Rank column */}
      <div className="hidden md:flex flex-shrink-0 w-14 self-stretch items-center justify-center bg-white/[0.03] border-r border-white/[0.06]">
        <span
          className={`font-display font-black italic text-3xl ${
            isFirst ? 'text-lime' : 'text-t3'
          }`}
        >
          {rank}
        </span>
      </div>

      {/* Logo */}
      <div className="flex-shrink-0 flex items-center md:justify-center w-full md:w-28 p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/[0.06]">
        <div className="flex items-center gap-3 md:flex-col md:gap-2 md:items-center w-full">
          {/* Mobile rank */}
          <span
            className={`md:hidden font-display font-black italic text-2xl flex-shrink-0 ${
              isFirst ? 'text-lime' : 'text-t3'
            }`}
          >
            #{rank}
          </span>
          <img
            src={casino.logo}
            alt={casino.name}
            className="h-9 md:h-11 object-contain max-w-[120px]"
          />
        </div>
      </div>

      {/* Casino info */}
      <div className="flex-1 p-4 md:p-5 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="font-heading font-extrabold text-base md:text-lg text-t1 leading-tight">
            {casino.name}
          </span>
          {casino.badge && (
            <span className="text-[10px] font-heading font-bold bg-lime/10 text-lime border border-lime/25 rounded-full px-2 py-0.5 uppercase tracking-wide">
              {casino.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Stars rating={casino.rating} />
          <span className="text-sm font-heading font-bold text-t2">
            {casino.rating.toFixed(1)}
          </span>
          {casino.ratingCount && (
            <span className="text-xs text-t3 font-body">· {casino.ratingCount} ocen</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {casino.tags.map(tag => (
            <span key={tag} className="chip">
              <CheckCircle2 size={9} className="text-lime" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bonus + CTA column */}
      <div
        className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 md:p-5 md:pl-0 w-full md:w-auto ${
          isFirst ? '' : ''
        }`}
      >
        <div className="text-center md:text-right w-full">
          <div
            className="font-display font-black italic text-lime leading-none"
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              textShadow: isFirst ? '0 0 40px rgba(212,240,0,.25)' : 'none',
            }}
          >
            {casino.bonusAmount.toLocaleString('pl-PL')}
            <span className="font-heading font-black not-italic text-sm ml-1">
              {casino.currency}
            </span>
          </div>
          <div className="text-xs text-t2 font-body mt-0.5">
            + {casino.freeSpins} Free Spinów
          </div>
        </div>

        <a
          href={casino.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            w-full md:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2
            font-heading font-black text-sm px-5 py-3 rounded-full
            transition-all duration-150 active:scale-95
            ${isFirst
              ? 'bg-lime text-bg shadow-lime hover:opacity-90 animate-pulse_lime'
              : 'bg-lime/90 text-bg hover:bg-lime hover:shadow-lime-sm'
            }
          `}
        >
          <Gift size={14} />
          Odbierz bonus
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Deposit bonus breakdown table                          */
/* ─────────────────────────────────────────────────────── */

function BonusBreakdown({ casino }: { casino: Casino }) {
  if (!casino.depositBonuses?.length) return null

  return (
    <div className="mt-10">
      <p className="sec-tag">Szczegóły pakietu</p>
      <h3 className="font-heading font-black text-2xl md:text-3xl text-t1 mb-5 tracking-tight">
        Jak podzielony jest bonus
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {casino.depositBonuses.map(d => (
          <div
            key={d.deposit}
            className="bg-s2 border border-white/[0.08] rounded-xl p-4 hover:border-lime/20 transition-colors"
          >
            <div className="text-xs text-t3 font-body mb-1">Depozyt {d.deposit}.</div>
            <div className="font-display font-black italic text-lime text-3xl leading-none mb-1">
              {d.percent}%
            </div>
            <div className="font-heading font-bold text-sm text-t1">do {d.maxBonus.toLocaleString('pl-PL')} PLN</div>
            {d.freeSpins > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-lime bg-lime/10 rounded-full px-2 py-0.5">
                <Star size={9} className="fill-lime" />
                +{d.freeSpins} FS
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 bg-lime/10 border border-lime/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-t2 font-body mb-0.5">Łączny pakiet powitalny</div>
          <div className="font-display font-black italic text-lime text-4xl leading-none" style={{ textShadow: '0 0 40px rgba(212,240,0,.2)' }}>
            {casino.bonusAmount.toLocaleString('pl-PL')}{' '}
            <span className="font-heading font-black not-italic text-lg">{casino.currency}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            '4 bonusy depozytowe',
            `${casino.freeSpins} darmowych spinów`,
            'Aktywacja automatyczna',
          ].map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-t2 font-body">
              <CheckCircle2 size={12} className="text-lime flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Casino section wrapper                                 */
/* ─────────────────────────────────────────────────────── */

function CasinoSection({ casinos }: { casinos: Casino[] }) {
  const featured = casinos.find(c => c.featured) ?? casinos[0] ?? null

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <p className="sec-tag">Top kasyna</p>
        <h2 className="font-heading font-black text-3xl md:text-5xl text-t1 mb-2 tracking-tight">
          Ranking kasyn
        </h2>
        <p className="text-t2 text-sm font-body mb-8 max-w-lg">
          Kasyna sprawdzone pod kątem bezpieczeństwa, bonusów i szybkości wypłat.
        </p>

        <div className="flex flex-col gap-3">
          {casinos.map((c, i) => (
            <CasinoCard key={c.id} casino={c} rank={i + 1} />
          ))}
        </div>

        {featured && <BonusBreakdown casino={featured} />}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/* How to claim — 3 steps                                 */
/* ─────────────────────────────────────────────────────── */

const STEPS = [
  {
    n: '01',
    icon: UserPlus,
    title: 'Zarejestruj się',
    desc: 'Kliknij nasz link i załóż konto w SpinBetter. E-mail, hasło i gotowe — zajmuje dosłownie 2 minuty.',
  },
  {
    n: '02',
    icon: Wallet,
    title: 'Wpłać depozyt',
    desc: 'Zasil konto dowolną metodą płatności. Bonus aktywuje się automatycznie po zaksięgowaniu wpłaty.',
  },
  {
    n: '03',
    icon: Play,
    title: 'Graj i odbieraj',
    desc: 'Kolejne trzy depozyty przynoszą kolejne transze bonusu. Freespiny czekają od razu na twoim koncie.',
  },
]

function HowToSection() {
  return (
    <section className="bg-s1 py-14 md:py-20 border-y border-white/[0.07]">
      <div className="max-w-4xl mx-auto px-4">
        <p className="sec-tag">Trzy kroki</p>
        <h2 className="font-heading font-black text-3xl md:text-5xl text-t1 mb-2 tracking-tight">
          Jak odebrać bonus
        </h2>
        <p className="text-t2 text-sm font-body mb-10 max-w-md">
          Od kliknięcia do gry mija kilka minut — rejestracja, wpłata, bonus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="bg-s2 border border-white/[0.08] rounded-2xl p-6 hover:border-lime/20 transition-colors group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-lime/10 grid place-items-center">
                  <Icon size={18} className="text-lime" />
                </div>
                <span className="font-display font-black italic text-5xl text-white/[0.07] group-hover:text-lime/10 transition-colors leading-none">
                  {n}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-base text-t1 mb-2">{title}</h3>
              <p className="text-sm text-t2 font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Game categories pill strip                             */
/* ─────────────────────────────────────────────────────── */

const GAMES = [
  { icon: Dice6,  label: 'Sloty',       count: '2000+' },
  { icon: Tv2,    label: 'Live Casino', count: 'z krupierami' },
  { icon: Rocket, label: 'Crash',       count: 'Aviator i inne' },
  { icon: Trophy, label: 'Jackpoty',    count: 'progresywne' },
  { icon: CreditCard, label: 'Blackjack', count: 'warianty' },
  { icon: Star,   label: 'Ruletka',     count: 'Euro & Ameryk.' },
]

function GamesStrip() {
  return (
    <div className="bg-s2 border-b border-white/[0.07] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {GAMES.map(({ icon: Icon, label, count }) => (
            <div
              key={label}
              className="flex-shrink-0 flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-full px-4 py-2.5 hover:border-lime/20 hover:bg-lime/5 transition-colors cursor-default"
            >
              <Icon size={15} className="text-lime" />
              <span className="font-heading font-bold text-sm text-t1 whitespace-nowrap">{label}</span>
              <span className="text-xs text-t3 font-body whitespace-nowrap">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* FAQ accordion                                          */
/* ─────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'Czy muszę podawać kod promocyjny?',
    a: 'Nie — wystarczy zarejestrować się przez nasz link. Bonus aktywuje się automatycznie po spełnieniu warunków depozytu, bez konieczności wpisywania żadnego kodu.',
  },
  {
    q: 'Kiedy i jak dostanę freespiny?',
    a: 'Darmowe spiny pojawiają się na koncie po każdym z kwalifikujących się depozytów. Zazwyczaj są dostępne w ciągu kilku minut od zaksięgowania wpłaty. Sprawdź czas ważności spinów w regulaminie SpinBetter.',
  },
  {
    q: 'Ile czasu mam na odebranie kolejnych transz bonusu?',
    a: 'Każda transza bonusu ma określony czas ważności. Szczegółowe warunki — w tym minimalne kwoty depozytów i wymagania dotyczące obrotu — znajdziesz w regulaminie bonusu na stronie SpinBetter.',
  },
  {
    q: 'Czy SpinBetter jest legalnym kasynem?',
    a: 'SpinBetter posiada licencję wymaganą przez właściwy organ regulacyjny i działa zgodnie z przepisami prawa. Zanim zaczniesz grać, upewnij się, że online gaming jest legalny w Twoim kraju zamieszkania.',
  },
  {
    q: 'Jakie metody płatności są dostępne?',
    a: 'SpinBetter obsługuje popularne metody płatności — karty kredytowe i debetowe, e-portfele oraz przelewy bankowe. Pełna lista jest dostępna w kasie na stronie SpinBetter.',
  },
]

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <p className="sec-tag">FAQ</p>
        <h2 className="font-heading font-black text-3xl md:text-5xl text-t1 mb-10 tracking-tight">
          Często pytane
        </h2>

        <div className="flex flex-col gap-2">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className={`bg-s2 border rounded-xl overflow-hidden transition-colors ${
                open === i ? 'border-lime/20 faq-open' : 'border-white/[0.07]'
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:text-lime transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-heading font-bold text-sm md:text-base text-t1">
                  {q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-t3 flex-shrink-0 faq-chevron transition-transform duration-250 ${
                    open === i ? 'rotate-180 text-lime' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? 'max-h-64' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4 pt-0 text-sm text-t2 font-body leading-relaxed border-t border-white/[0.06]">
                  {a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Final CTA banner                                       */
/* ─────────────────────────────────────────────────────── */

function CtaBanner({ featured }: { featured: Casino | null }) {
  if (!featured) return null

  return (
    <section className="scene-cta relative overflow-hidden text-center py-20 md:py-28">
      {/* glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 55%, rgba(212,240,0,.12) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <h2
          className="font-display font-black italic leading-[.88] mb-5 tracking-tight"
          style={{ fontSize: 'clamp(48px, 10vw, 86px)' }}
        >
          <span className="text-t1">Gotowy na </span>
          <span className="text-lime-glow">start?</span>
        </h2>

        <p className="text-t2 text-base font-body leading-relaxed max-w-sm mx-auto mb-9">
          Zarejestruj się przez nasz link i odbierz pełny pakiet{' '}
          <span className="text-t1 font-heading font-bold">
            {featured.bonusAmount.toLocaleString('pl-PL')} {featured.currency}
          </span>{' '}
          + {featured.freeSpins} FS. Rejestracja trwa 2 minuty.
        </p>

        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-lime text-bg font-heading font-black text-base md:text-lg px-10 py-5 rounded-full shadow-lime hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Gift size={19} />
          Odbierz bonus w SpinBetter
          <ArrowRight size={17} />
        </a>

        <p className="mt-5 text-xs text-t3 font-body">
          18+ · Warunki obrotu bonusem obowiązują · Graj odpowiedzialnie
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Stream note + legal footer                             */
/* ─────────────────────────────────────────────────────── */

function StreamNote() {
  return (
    <div className="bg-s1 border-t border-white/[0.07] py-5 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h3 className="font-heading font-bold text-sm text-t1 mb-1 inline-flex items-center gap-2">
          <Smartphone size={14} className="text-purple-soft" />
          Nie interesuje Cię kasyno?
        </h3>
        <p className="text-xs text-t3 font-body leading-relaxed">
          Zostajesz na miejscu i oglądasz dalej. Dzięki SpinBetter opłacamy serwer
          i utrzymujemy stronę. Na stronie używasz przełączników, na telefonie klikasz
          zębatkę i zmieniasz streamerów.
        </p>
      </div>
    </div>
  )
}

function LegalFooter() {
  return (
    <footer className="bg-bg border-t border-white/[0.06] py-6 px-4" role="contentinfo">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {[
            { label: '18+',               extra: 'text-lime border-lime/30' },
            { label: 'Odpowiedzialna gra', extra: '' },
            { label: 'Oferta sponsorowana', extra: '' },
          ].map(({ label, extra }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-heading font-semibold text-t3 border-white/[0.10] ${extra}`}
            >
              <AlertCircle size={10} />
              {label}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-t3 font-body leading-relaxed">
          Oferty dostępne wyłącznie dla osób pełnoletnich (18+) poza terytorium Rzeczypospolitej
          Polskiej. Grasz na własną odpowiedzialność. Możesz stracić wszystkie postawione
          pieniądze — wygrana nie jest gwarantowana. Sprawdź, czy hazard online jest legalny
          w Twoim kraju, i czy operator posiada wymagane przez prawo lokalne zezwolenia.
          Ustaw limity depozytu i korzystaj z narzędzi odpowiedzialnej gry na stronie operatora.
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Loading skeleton                                       */
/* ─────────────────────────────────────────────────────── */

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="h-28 rounded-2xl bg-s2" />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────── */
/* Root page                                              */
/* ─────────────────────────────────────────────────────── */

export default function HomePage() {
  const [data, setData]       = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const d = await fetchSiteData()
    setData(d)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const casinos  = data
    ? data.casinos.filter(c => c.active).sort((a, b) => a.order - b.order)
    : getDefaultData().casinos
  const featured = casinos.find(c => c.featured) ?? casinos[0] ?? null

  return (
    <main className="min-h-screen bg-bg">
      <AgeBanner />
      <HeroSection featured={featured} />
      <TrustStrip />
      <GamesStrip />

      {loading ? (
        <Skeleton />
      ) : (
        <CasinoSection casinos={casinos} />
      )}

      <HowToSection />
      <FaqSection />
      <CtaBanner featured={featured} />
      <StreamNote />
      <LegalFooter />
    </main>
  )
}

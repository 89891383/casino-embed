# Casino Hub v2 — Embeddable lista kasyn online

Nowoczesny, dopaminowy hub kasyn z aktualizacjami na żywo przez GitHub JSON.

## Stack

- **Next.js 15** (App Router, static export)
- **React 19**
- **Tailwind CSS** + custom gold theme
- **Framer Motion** — animacje kart, modal, stats
- **Zod** — walidacja danych
- **Lucide React** — ikony
- **date-fns**, **recharts**, **sonner**, **clsx**, **tailwind-merge**, **cva**

## Funkcje

- Całość po polsku (fonty z latin-ext)
- Kasynowy design: złote gradienty, glow, dark premium
- Animowane statystyki (licznik kasyn, średnia ocena, polecane)
- Modal szczegółów po kliknięciu karty
- Filtry kategorii + ocena + wyszukiwanie
- Ulubione (localStorage)
- Real-time poll co 15 s z GitHub raw
- Tryb embed: `?embed=1`
- Panel admina `/admin` z pełną edycją + commit przez GitHub PAT
- Static export → Cloudflare Pages

## Setup Cloudflare Pages

1. Push na GitHub.
2. Cloudflare Pages:
   - Build command: `npm run build`
   - Output directory: `out`
   - Env: `NEXT_PUBLIC_DATA_URL` = `https://raw.githubusercontent.com/TWOJ_USER/TWOJ_REPO/main/data/casinos.json`
3. Wejdź na `/admin`, wklej token (scope `repo`) → Załaduj → edytuj → Zapisz.

## Embed

```html
<iframe src="https://twoja-strona.pages.dev/?embed=1" width="100%" height="900" frameborder="0"></iframe>
```

## Lokalnie

```bash
npm install
npm run dev
```
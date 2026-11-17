# Casino Affiliate — Next.js + Cloudflare Pages

Strona afiliacyjna kasyna z panelem admina opartym na GitHub.

## Stack

- **Next.js 14** (static export — `output: 'export'`)
- **Tailwind CSS 3** z custom design systemem
- **Lucide React** — ikony
- **GitHub Contents API** — dane kasyn w `data/casinos.json`

---

## Szybki start lokalnie

```bash
npm install
cp .env.local.example .env.local
# uzupełnij .env.local swoimi danymi
npm run dev
```

Otwórz `http://localhost:3000` — strona główna  
Otwórz `http://localhost:3000/admin` — panel admina

---

## Deploy na Cloudflare Pages

### 1. Wrzuć repo na GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/TWOJA_NAZWA/casino-affiliate.git
git push -u origin main
```

### 2. Połącz z Cloudflare Pages

1. Cloudflare Dashboard → **Pages** → **Create a project** → **Connect to Git**
2. Wybierz repozytorium
3. Build settings:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node.js version:** 20

### 3. Ustaw zmienne środowiskowe

W Cloudflare Pages → Settings → Environment Variables dodaj:

| Nazwa | Wartość |
|-------|---------|
| `NEXT_PUBLIC_GITHUB_OWNER` | twoja-nazwa-uzytkownika |
| `NEXT_PUBLIC_GITHUB_REPO`  | casino-affiliate |
| `NEXT_PUBLIC_GITHUB_BRANCH` | main |
| `NEXT_PUBLIC_DATA_PATH`    | data/casinos.json |

Po zapisaniu zmiennych — kliknij **Retry deployment** żeby przebudować z nowymi zmiennymi.

---

## Panel admina

Otwórz `https://twoja-strona.pages.dev/admin`

**Dane logowania:**
- **GitHub PAT** — wygeneruj na: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
  - Uprawnienia: `Contents: Read and write` dla Twojego repo
- **Właściciel repo** — Twoja nazwa użytkownika na GitHub
- **Nazwa repo** — np. `casino-affiliate`
- **Branch** — `main`
- **Ścieżka** — `data/casinos.json`

**Bezpieczeństwo:** Token jest przechowywany tylko w `localStorage` Twojej przeglądarki i nigdy nie jest wysyłany nigdzie poza `api.github.com`.

---

## Jak działa real-time update

```
Admin edytuje kasyno
       ↓
Kliknięcie "Zapisz do GitHub"
       ↓
GitHub API: PUT /repos/{owner}/{repo}/contents/data/casinos.json
       ↓
Plik data/casinos.json na GitHub zostaje zaktualizowany
       ↓
Strona główna przy każdym otwarciu pobiera dane z GitHub API
       ↓
Zmiany widoczne natychmiast (bez rebuildowania!)
```

---

## Osadzanie (embed)

Strona nie zawiera żadnego brandingu poza zawartością kasyn.  
Możesz ją osadzić przez iframe:

```html
<iframe
  src="https://twoja-strona.pages.dev"
  width="100%"
  height="2400"
  frameborder="0"
  scrolling="auto"
  style="border:none;"
></iframe>
```

Dla lepszego dopasowania wysokości możesz użyć `iframe-resizer` lub `postMessage`.

---

## Struktura pliku `data/casinos.json`

```json
{
  "version": "1.0",
  "lastUpdated": "2026-11-17T00:00:00.000Z",
  "casinos": [
    {
      "id":          "spinbetter",
      "name":        "SpinBetter",
      "logo":        "https://...",
      "bonusText":   "6350 PLN + 150 FS",
      "bonusAmount": 6350,
      "currency":    "PLN",
      "freeSpins":   150,
      "rating":      4.8,
      "ratingCount": "2.4k",
      "url":         "https://spinbetter.com/?ref=...",
      "featured":    true,
      "badge":       "Polecane",
      "tags":        ["Szybkie wypłaty", "Licencja", "Live Casino"],
      "depositBonuses": [
        { "deposit": 1, "percent": 100, "maxBonus": 1500, "freeSpins": 50 }
      ],
      "active":    true,
      "order":     1,
      "createdAt": "2026-11-17T00:00:00.000Z"
    }
  ]
}
```

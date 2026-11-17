# Casino Hub - Embeddable lista kasyn online

Nowoczesny, embeddable hub kasyn z aktualizacjami na żywo przez GitHub JSON.

## Funkcje

- Całość po polsku
- Ciemny premium design (Outfit extrabold + Inter, złote akcenty)
- Dużo ikon Lucide + animacje Framer Motion
- Filtry (kategoria, ocena), wyszukiwanie, sortowanie po ocenie
- Ulubione (localStorage)
- Nowe pola: opis, kategoria, licencja, czas wypłaty
- Aktualizacje w czasie rzeczywistym (poll co 15s)
- Tryb embed: `?embed=1` ukrywa header
- Panel admina `/admin` — pełna edycja + commit do GitHub przez PAT
- Static export → Cloudflare Pages

## Setup

1. Wypchnij repo na GitHub.
2. Cloudflare Pages:
   - Build command: `npm run build`
   - Output directory: `out`
   - Env: `NEXT_PUBLIC_DATA_URL` = `https://raw.githubusercontent.com/TWOJ_USER/TWOJ_REPO/main/data/casinos.json`
3. Utwórz GitHub PAT ze scope `repo`.
4. Wejdź na `/admin`, wklej token/owner/repo → Załaduj → dodawaj/edytuj → Zapisz do GitHub.

Strona publiczna od razu widzi zmiany.

## Embed

```html
<iframe src="https://twoja-strona.pages.dev/?embed=1" width="100%" height="800" frameborder="0"></iframe>
```

## Lokalnie

```bash
npm install
npm run dev
```

Ustaw `NEXT_PUBLIC_DATA_URL` w `.env.local`.
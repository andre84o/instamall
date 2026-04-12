# Lyxery — redigeringsguide

Snabbreferens för var allt ligger i `src/components/Lyxery/index.tsx`.
Canvas är **1080×1920 px**, CSS-previewen är **360×640 px** (exakt 1/3 skala).
Ändrar du något i canvas måste motsvarande värde i CSS skalas till 1/3 och tvärtom.

---

## Toppen av filen (konstanter + helpers)

| Vad | Rad (ca) | Förklaring |
|---|---|---|
| Guld-färgpalett | 12–15 | `GOLD_LIGHT`, `GOLD`, `GOLD_DARK`, `GOLD_TEXT` — ändra här så följer allt med |
| Font-konstanter | 17–18 | `SS` (Montserrat sans), `SF` (Georgia serif fallback) |
| `iconToDataUrl()` | 22–30 | Serialiserar react-icons-komponenter till data-URL |
| `HOUSE_ICON_URL` | 32–34 | GiHouse från react-icons som data-URL (används i både canvas & CSS) |
| `Editable` | 37–82 | Inline-editerbar text (klicka för att byta) |
| `Photo` | 85–163 | Upload-zon med placeholder-badge (pt-[90px] / pb-[90px]) |

---

## State (data i kortet)

| Vad | Rad (ca) | Förklaring |
|---|---|---|
| `d`-state | 167–176 | `brand`, `title`, `ref`, `price`, `beds`, `baths`, `type`, `location` |
| `p1`, `p2` | 177–178 | Uppladdade bilder (topp + botten) |
| `preview` (TEMP) | 181 | Live canvas preview — raderas när editor är klar |
| Font-useEffect | 184–193 | Laddar Cormorant Garamond + Montserrat via Google Fonts |

---

## `renderCanvas` — PNG-genereringen

### Setup

| Vad | Rad (ca) | Värde / förklaring |
|---|---|---|
| Font-laddning | 197–225 | Vercel-säker: fetch Google CSS, extract woff2, FontFace.load() |
| `W`, `H` | 227 | 1080 × 1920 |
| Clip ytter-canvas | 233–236 | `roundRect(0, 0, W, H, 0)` → raka ytterhörn |
| `loadImg` | 238–245 | Helper för att ladda bilder till HTMLImageElement |
| Promise.all bilder/ikoner | 247–252 | Alla SVG-ikoner + GiHouse laddas här |
| `roundRect` | 254–262 | Ritar rundad rect-path |

### Bakgrundsbilder (50/50 split)

| Vad | Rad (ca) | Värde |
|---|---|---|
| Svart bas | 265–266 | `#0b1220` fillRect |
| P1 topp-halva | 270–282 | y: 0 → 960, `object-fit: cover` |
| P2 botten-halva | 284–296 | y: 960 → 1920 |
| Topp-mörkning | 298–302 | Gradient för brand-text läsbarhet |

### Brand-text (topp-vänster)

| Vad | Rad (ca) | Värde |
|---|---|---|
| Text | 304–310 | `600 32px ${SS}` (Montserrat), vit, pos `55, 85` |

### Info-kort geometri

| Vad | Rad (ca) | Värde |
|---|---|---|
| `cardW` | 313 | 880 |
| `cardH` | 314 | 840 |
| `cardX` | 315 | (W - cardW) / 2 = 100 |
| `cardY` | 316 | (H - cardH) / 2 = 540 |

### Kortets visuella lager (rad ~319–388)

| # | Vad | Rad (ca) | Förklaring |
|---|---|---|---|
| 1 | Drop shadow | 319–325 | Mjuk svart skugga under kortet |
| 2 | Snapshot + blur | 328–358 | `blur(18px)` av allt som redan ritats |
| 3 | Vit glaston | 361–362 | `rgba(255,255,255,0.22)` — matchar CSS backdrop-filter |
| 4 | Top shine | 365–371 | Vit gradient från topp till transparent botten |
| 5 | Inner glow | 374–379 | Subtil varm glöd via `shadowBlur` |
| 6 | Outer outline | 382–385 | `2px rgba(255,255,255,0.22)` stroke runt kortet |

### Inre guld-border (ram inuti kortet)

| Vad | Rad (ca) | Värde |
|---|---|---|
| `innerInset` | 390 | 50 (avstånd från kortets insida) |
| `lineWidth` | 402 | 6 (tjocklek) |
| Corner radius | 408 | 18 |
| Gradient | 392–400 | GOLD_LIGHT → GOLD_TEXT → GOLD_DARK (samma som priset) |

### Innehåll i kortet

| Element | Rad (ca) | Värde |
|---|---|---|
| **FOR SALE** title | 417–427 | `700 118px Cormorant Garamond`, vit, drop shadow |
| `titleY` | 417 | `cardY + 250` |
| **Ref** (Ref: 58272) | 429–432 | `400 32px Montserrat`, `rgba(255,255,255,0.85)` |
| Ref Y | 432 | `titleY + 48` |
| **Pris** (599.000€) | 434–451 | `700 118px Cormorant`, gold gradient text |
| Pris Y | 437 | `titleY + 170` |
| **Stats grid (2×2)** | 453–505 | bed, bath (rad 1) / home, pin (rad 2) |
| `ICON_SIZE` | 472 | 72 |
| Gold ikoner | 473–491 | Offscreen canvas + `source-in` tint |
| `gridLeftX` | 495 | `cardX + 120` |
| `gridRightX` | 496 | `cardX + cardW/2 + 70` |
| `row1Y` / `row2Y` | 497–498 | `dividerY + 100` / `+ 200` |

---

## `downloadStory` — nedladdning
Rad ~530–550

Anropar `renderCanvas()`, postar base64-PNG till `/api/download`, triggar browser-nedladdning som `lyxery_<ref>.png`.

---

## CSS-preview (JSX — rad ~565+)

Proportionellt skalat 1:3 från canvas.

| Element | Rad (ca) | Canvas-motsvarighet |
|---|---|---|
| Story canvas wrapper | 566–568 | 360×640, raka hörn, `border-[6px] slate-800` |
| P1 topp-bakgrund | 573–580 | `absolute top-0 h-1/2` + `<Photo placeholderAlign="start">` |
| P2 botten-bakgrund | 583–590 | `absolute bottom-0 h-1/2` + `<Photo placeholderAlign="end">` |
| Topp-mörkning | 593–599 | Gradient |
| Brand-text | 601–611 | `absolute left-3 top-3`, `11px`, editable |
| **Info card** | 615–624 | `left-[33px] right-[33px] top-[180px] bottom-[180px]` rounded-[10px] |
| Card styling | 616–623 | `backdrop-filter: blur(18px)`, `rgba(255,255,255,0.22)`, shadow |
| **Inre guld-border** | 627–642 | `top: 17, padding: 2, rounded-[6px]`, mask-trick |
| Top shine | 644–651 | `rounded-t-[10px]` matchar kortet |
| Content wrapper | 653 | Centrerar FOR SALE / ref / pris / grid |
| FOR SALE | 655–669 | Cormorant `40px 700`, editable |
| Ref | 671–679 | Montserrat `11px`, ljus grå, editable |
| Pris | 681–693 | Cormorant `40px 700`, gold gradient, editable |
| Stats 2×2 grid | 695–734 | 4 items: bed, bath, home, pin |

---

## Nedladdningsknapp
Rad ~760–785 — gold gradient button.

---

## Skala-referens (Canvas ↔ CSS)

Eftersom CSS är 1/3 av canvas ska värden ändras proportionellt:

| Canvas | CSS |
|---|---|
| 10px | ~3px |
| 30px | ~10px |
| 50px | ~17px |
| 100px | ~33px |
| 180px | ~60px |
| 540px | ~180px |
| 880px | ~294px |
| 1080px | 360px |

Typsnitt följer samma regel: canvas `118px ≈ CSS 40px`, canvas `32px ≈ CSS 11px`.

---

## Så ändrar du vanliga saker

### Byta färger
Ändra konstanterna överst i filen (rad 12–15):
```ts
const GOLD_LIGHT = "#F1D27A";
const GOLD       = "#D4AF37";
const GOLD_DARK  = "#A8892A";
const GOLD_TEXT  = "#E5C76B";
```

### Byta kortstorlek
1. Canvas: ändra `cardW` / `cardH` / `cardY` (rad 313–316)
2. CSS: skala värdena med 1/3 i `left-[Npx] right-[Npx] top-[Npx] bottom-[Npx]` (rad 615)

### Byta typsnitt
1. Canvas `ctx.font`: sök på `ctx.font =` i renderCanvas
2. CSS `fontFamily` / `fontSize`: i motsvarande JSX-element
3. Font-laddning: `useEffect` (rad 184) och `loadGoogleFont()` i renderCanvas (rad 197)

### Lägga till ett nytt textfält
1. Lägg till ny nyckel i `d`-state (rad 167)
2. Rita i canvas med `ctx.fillText(d.nyttFält, x, y)`
3. Rendera i CSS-preview med `<Editable value={d.nyttFält} onChange={set("nyttFält")} />`

### Byta ikon (t.ex. house)
1. Importera från `react-icons/*` eller lägg SVG-fil i `/public`
2. För react-icons: använd `iconToDataUrl(<Icon size={256} color="#fff" />)`
3. Ersätt URL:en i både `loadImg(...)` i canvas och `src={...}` i CSS-preview

---

## Viktigt att tänka på

- **Canvas och CSS-preview är två separata renderers.** Ändrar du i ena måste du uppdatera andra för att förhandsvisning ska matcha nedladdning.
- **Z-ordning i canvas = ritordning**: det som ritas sist hamnar överst. Ordning: bakgrund → P1/P2 → brand → kort-skugga → glas → inre border → titel → ref → pris → stats.
- **`ctx.save()` / `ctx.restore()`** måste alltid balanseras.
- **`ctx.shadowBlur` läcker** till nästa ritning. Nollställ med `shadowBlur = 0; shadowOffsetY = 0;` efter användning.
- **`letterSpacing` på `ctx`** måste också nollställas efter användning.
- **`ctx.filter`** (blur, etc) måste sättas tillbaka till `"none"` efter användning.

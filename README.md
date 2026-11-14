# komeksamen_2026
kommunikasjonsdesign eksamen 
# kommunikasjonsdesign-eksamen-2026
# Eksamensportefølje – ITM31719 Kommunikasjonsdesign

Digital journalistisk portefølje laget med ren HTML, CSS og JavaScript. Ingen rammeverk, ingen eksterne API-er, ingen eksterne fonter. Alt fungerer lokalt og offline.

## Filstruktur

```
index.html                         Startside
articles/
  en-konge-for-alle.html           Artikkel 1 – kong Harald og minoritetsbakgrunn
  ung-i-norsk-politikk.html        Artikkel 2 – Hashim Abdi
  ki-i-studenthverdagen.html       Artikkel 3 – KI i studenthverdagen
  xl-en-konge-for-alle.html        XL-artikkel (ca. 1500 ord)
css/style.css                      Hele designet (variabler, layout, komponenter)
js/main.js                         Meny, animasjoner, lesefremdrift, ordtelling
assets/
  favicon.svg
  img/                             Bilder (nå: plassholdere som skal byttes ut)
```

## Teste lokalt (VS Code + Live Server)

1. Åpne mappen i VS Code (**File → Open Folder**).
2. Installer utvidelsen **Live Server** (Ritwick Dey) hvis du ikke har den.
3. Høyreklikk `index.html` → **Open with Live Server**.
4. Mobiltest: trykk F12 i nettleseren → ikonet for enhetsvisning (Ctrl+Shift+M).

Sidene fungerer også ved å dobbeltklikke `index.html` direkte, fordi alle stier er relative.

## Slik setter dere inn eget innhold

- **Plassholdere** har oransje stiplet ramme (klassen `ph`). Erstatt teksten og **fjern `class="ph"`** (og eventuelle `<span class="ph-tag">…</span>`).
- **Veiledningsbokser** (`<aside class="ph-note">`) slettes når artikkelen er ferdig.
- Den oransje telleren nede i hjørnet viser hvor mange plassholdere som er igjen. Klikk på den for å skjule merkingen midlertidig.
- **Bilder:** legg filene i `assets/img/` (f.eks. `konge-hoved.jpg`, ca. 2000 px bredt, komprimert) og endre `src`, `alt`, bildetekst og fotokreditering.
- **Ordtelling:** åpne konsollen (F12 → Console) på en artikkel for å se antall ord i brødteksten. Plassholdere telles ikke.
- **Aksentfarge** per artikkel styres av klassen på `<body>` (`theme-konge`, `theme-politikk`, `theme-ki`, `theme-xl`) og kan endres øverst i `css/style.css`.

Nyttige byggeklosser i artiklene: `pullquote` (sitat fra intervju), `blockquote` (utdrag fra tale), `factbox`, `figure--wide` / `figure--full` (store bilder), `chapter-break` (XL: stort bilde med sitat), `sources` (kilder).

## Etikk

- Ingen intervjuer, sitater, hendelser eller kilder er funnet på. Alt som mangler, er merket som plassholder.
- Fakta som står oppført (f.eks. kong Haralds fødselsdato) er merket **Verifiser** og må kontrolleres og få kilde.
- Sitater fra kongens taler skal kopieres ordrett fra kongehuset.no, ikke gjengis fra hukommelsen.
- Bruk bare ekte foto av intervjupersoner, tatt med samtykke. KI-genererte bilder skal aldri fremstilles som ekte personer. Brukes en KI-illustrasjon, merkes den i bildeteksten med `<span class="ai-label">KI-generert illustrasjon</span>`.

## Før levering

1. Søk etter `class="ph"` og `ph-note` i alle filer – det skal ikke være treff.
2. Sett `showPlaceholderCounter: false` øverst i `js/main.js`.
3. Test alle sider på desktop og mobil.
4. Lag ZIP: høyreklikk prosjektmappen → *Komprimer* / *Send til → Komprimert mappe*. Ta ikke med `.git`-mappen.
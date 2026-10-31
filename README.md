# International Catholic Jurists Forum — website prototype

Static rebuild of icjurist.org by Lickity Split. All text is carried over verbatim from the current site
(99 live pages, 535 news posts). No build step: open `index.html` through any static host.

- `index.html` — the whole front end (hash router, styles, scripts)
- `data/index.json` — page and news index used by navigation and search
- `data/p/*.json` — one file per page
- `data/n/*.json` — news bodies and thumbnails, in chunks
- `data/hero.json` — homepage photography and the ICJF seal

Noindexed until launch.

# cv
Kirill Chistov CV
- 👋 Pleased to meet you. I’m a martech product & entrepreneur
- 👀 interested in supporting martech saas startups at early growth stage as investor or co-founder
- 🌱 here to develop programming and data analysis skills to look savvy in tech context
- 📫 Reach me if you feel like networking... [Telegram](https://t.me/kirchistov) or [email](mailto:kchistov@gmail.com)

<!---
kirillchistov/kirillchistov is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->
- [short bio in Russian](https://www.notion.so/iroiru/350222a6897e4eb888bd5c8e1b09408c)

## Solo martech founder roadmap

**Under construction.** `roadmap.html` is not linked from the CV menu.

The page is still a Vite entry and is included in the default build, so it stays reachable at
http://localhost:5173/cv/roadmap.html and, after deploy, at https://kirillchistov.github.io/cv/roadmap.html.
It reuses the CV theme, tokens and `src/projects.ts`; content lives in `src/roadmap/data.ts` (skills, stages, bets, CV integrations).
Progress, skill estimates and bet scores are saved in `localStorage` only.

## Resume tailor

`tailor.html` adapts a pasted resume to a pasted job post without sign-up or a backend: ATS keyword coverage
(RU/EN synonyms in `src/tailor/lexicon.ts`), the 5-second rule, a tailored resume that only reorders and re-labels
the candidate's own facts, "what to add" recommendations and export to `.txt`, `.md` and `.docx`.
The engine (`src/tailor/engine.ts`) is pure TypeScript and covered by `pnpm test`.
For an AI review with follow-up questions it links to [Career Evidence OS](https://github.com/kirillchistov/carrer-os).

## Cases and notes

`cases.html` tells six cases from the CV, each in the format of its own channel (bank statement, metro map,
inbox, media plan, changelog, Windows 98 dialog). `notes.html` renders `content/hindsight/*.md`, a series of
"what I would do differently" notes, one per CV entry. Both pages pilot the editorial look in
`src/editorial/editorial.css` (self-hosted Onest, Source Serif 4, JetBrains Mono). Review notes and open
questions are in `docs/`.

Cases and notes are drafts with restricted access. The default build leaves them out, the CV does not link to them,
and both pages carry `noindex`. Preview them with `pnpm dev`. See below before publishing them.

The public CV has a separate case catalog on the homepage. It is rendered from `docs/all-cases.md` and is part of `index.html`,
so it ships with every build.

## Build and deploy

Vite multi-page app. `base` is `/cv/`, so local URLs and GitHub Pages use the same prefix. Package manager is pnpm
(`pnpm-lock.yaml`). The deploy script calls `pnpm build`, so run it with pnpm.

```bash
pnpm install
pnpm test          # vitest
pnpm dev           # http://localhost:5173/cv/
pnpm build         # tsc && vite build → dist/
pnpm preview       # http://localhost:4173/cv/
pnpm gh-pages      # rebuild dist/, then publish it
```

`pnpm build` writes:

- `index.html` — CV, including the case catalog
- `tailor.html` — resume tailor
- `roadmap.html` — roadmap, under construction, not linked from the menu

`pnpm gh-pages` runs that build and pushes `dist/` to the `gh-pages` branch of the `cv` remote
(`git@github.com:kirillchistov/cv.git`). GitHub Pages serves that branch at https://kirillchistov.github.io/cv/.

Drafts stay off the live site. `DRAFTS=1 pnpm build` adds `cases.html` and `notes.html` to `dist/` for a local check.
Do not deploy that build: `pnpm gh-pages` always uses a normal build without `DRAFTS`.

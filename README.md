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

`roadmap.html` is a second Vite entry: an interactive roadmap from CMO / Head of Growth to a one-person martech company.
It reuses the CV theme, tokens and `src/projects.ts`; content lives in `src/roadmap/data.ts` (skills, stages, bets, CV integrations).
Progress, skill estimates and bet scores are saved in `localStorage` only.

- Dev: `pnpm dev` → http://localhost:5173/cv/roadmap.html
- Build: `pnpm build` emits `index.html`, `roadmap.html` and `tailor.html`

## Resume tailor

`tailor.html` adapts a pasted resume to a pasted job post without sign-up or a backend: ATS keyword coverage
(RU/EN synonyms in `src/tailor/lexicon.ts`), the 5-second rule, a tailored resume that only reorders and re-labels
the candidate's own facts, "what to add" recommendations and export to `.txt`, `.md` and `.docx`.
The engine (`src/tailor/engine.ts`) is pure TypeScript and covered by `pnpm test`.
For an AI review with follow-up questions it links to [Career Evidence OS](https://github.com/kirillchistov/carrer-os).

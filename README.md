# itrummer.github.io

Personal academic site for [Immanuel Trummer](https://itrummer.github.io) (Cornell CS). Built with [Astro](https://astro.build/) and deployed to GitHub Pages. The previous Jekyll site lives in [`archive/jekyll/`](archive/jekyll/).

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

Pushing to `main` triggers the GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Updating the site

### New or updated publication

1. Add or edit the entry in [`src/data/publications.bib`](src/data/publications.bib).
2. Add the BibTeX citekey to [`src/data/cv-publication-keys.json`](src/data/cv-publication-keys.json) if it should appear on the site (keep your LaTeX CV `\nocite` lists in sync separately).
3. Optionally set a `note` field for award badges (see below).
4. Run `npm run build` locally, then push to `main`.

To regenerate the allowlist from archived `index.md` (approximate matching), run:

```bash
node scripts/generate-allowlist.mjs
```

Prefer updating `cv-publication-keys.json` from your CV source of truth when available.

### Award badge on a paper

Add or edit the BibTeX `note` field on that entry in `publications.bib` (for example, `Best Demo Runner Up, SIGMOD 2023`). No allowlist change is needed unless the paper is new.

### Research theme

- Edit [`src/data/research-themes.json`](src/data/research-themes.json) (`summary`, `citekeys`, `talks`, `systems`, `status`).
- Longer prose goes in [`src/content/research/{slug}.md`](src/content/research/).
- For a new theme, add both a JSON entry and a new Markdown file, and ensure `slug` matches the filename.

### Bio, title, profile links

- Bio: [`src/content/pages/about.md`](src/content/pages/about.md)
- Name, title, email, GitHub, LinkedIn, CV path: [`src/data/site.ts`](src/data/site.ts)

### Teaching, funding, students

Edit [`src/content/pages/teaching.md`](src/content/pages/teaching.md), [`funding.md`](src/content/pages/funding.md), or [`students.md`](src/content/pages/students.md).

### Static assets

- CV: [`public/CV.pdf`](public/CV.pdf)
- Photo: [`public/img/itrummer.png`](public/img/itrummer.png) (hero; same as former Jekyll `_includes/itrummer.png`)
- Conference slides/posters (stable URLs): [`public/SIGMOD2025/`](public/SIGMOD2025/) — keep filenames unchanged when replacing files so old links keep working.

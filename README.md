# open-coven-weekly

Weekly Open Coven slide decks — [Slidev](https://sli.dev)-powered, dark-themed, reusable every Sunday.

## What's here

```
slides/              # One .md file per Sunday
  2026-05-24.md      # This week's deck
  template.md        # Base template for new weeks
theme/               # @opencoven/slidev-theme-coven
  layouts/           # cover.vue, default.vue
  components/        # ApiExplorer.vue (interactive, mock responses)
  styles/            # index.css (violet/black system)
scripts/
  new-week.mjs       # Scaffold next Sunday's deck
```

## Run this week's deck

```bash
npm install
npm run dev
# → opens slides/2026-05-24.md with hot reload
```

## Start next week's deck

```bash
npm run new
# → creates slides/YYYY-MM-DD.md from template
npm run dev  # edit slides/YYYY-MM-DD.md in package.json scripts first
```

## Export to PDF

```bash
npm run export
# → exports current week to PDF
```

## Theme

The `theme/` directory contains `@opencoven/slidev-theme-coven`:

- **Colors:** `#080808` background, `#9A8ECD` violet, `#111` surface cards
- **Typography:** Inter (display) + JetBrains Mono (code)
- **Components:** `<ApiExplorer />` — fully interactive API explorer with 6 mock endpoints, params, and animated responses

## Weekly format

| Slide | Content |
|---|---|
| 1 | Title — date + tagline |
| 2 | Core concept or framing |
| 3 | What shipped this week |
| 4 | Live demo / API explorer |
| 5 | Ecosystem or project spotlight |
| 6 | Open floor — asks + show-and-tell |

## Community

- Discord: [discord.gg/opencoven](https://discord.gg/opencoven)
- Sundays 19:00 CST

---

AGPL-3.0 © OpenCoven

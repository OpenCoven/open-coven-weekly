# open-coven-weekly

Weekly Open Coven slide decks: [Slidev](https://sli.dev)-powered, dark-themed, reusable every Sunday.

## What's here

```text
slides/              # One .md file per Sunday
  YYYY-MM-DD.md      # Dated deck files; latest date is published
  template.md        # Base template for new weeks
theme/               # @opencoven/slidev-theme-coven
  layouts/           # cover.vue, default.vue
  components/        # ApiExplorer.vue (interactive, mock responses)
  styles/            # index.css (violet/black system)
scripts/
  new-week.mjs       # Scaffold next Sunday's deck
  slidev-current.mjs # Runs Slidev against the latest dated deck
  verify-week.mjs    # Checks the latest deck/API content, then builds
```

## Run this week's deck

```bash
pnpm install
pnpm dev
```

## Verify

```bash
pnpm verify
```

`pnpm build` keeps the GitHub Pages-style `/open-coven-weekly/` base. Vercel uses `pnpm build:vercel` with a root `/` base and publishes `slides/dist`.

All Slidev commands resolve the latest `slides/YYYY-MM-DD.md` file automatically.

## Start next week's deck

```bash
pnpm new
pnpm dev
```

## Export to PDF

```bash
pnpm export
```

## Theme

The `theme/` directory contains `@opencoven/slidev-theme-coven`:

- Colors: `#080808` background, `#9A8ECD` violet, `#111` surface cards
- Typography: Inter display + JetBrains Mono code
- Components: `<ApiExplorer />`, an interactive API explorer with mock `coven.daemon.v1` responses

## Community

- Discord: [discord.gg/opencoven](https://discord.gg/opencoven)
- Sundays 19:00 CST

AGPL-3.0 © OpenCoven

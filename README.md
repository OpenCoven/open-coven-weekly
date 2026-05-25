# open-coven-weekly

Weekly Open Coven slide decks: [Slidev](https://sli.dev)-powered, dark-themed, reusable every Sunday.

## What's here

```text
slides/              # One .md file per Sunday
  2026-05-24.md      # This week's deck
  template.md        # Base template for new weeks
theme/               # @opencoven/slidev-theme-coven
  layouts/           # cover.vue, default.vue
  components/        # ApiExplorer.vue (interactive, mock responses)
  styles/            # index.css (violet/black system)
scripts/
  new-week.mjs       # Scaffold next Sunday's deck
  verify-week.mjs    # Checks required deck/API content, then builds
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

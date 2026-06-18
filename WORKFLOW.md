# WORKFLOW.md — Show'n Spells Deck

## Overview

This repo contains the weekly **Show'n Spells** Slidev presentation for [OpenCoven](https://opencoven.ai). One deck per week, published automatically to Vercel on push. The Coven builds it together — content is sourced from merged PRs, release notes, and live demos, then crafted into a slide deck that's part show, part walkthrough.

---

## Repo structure

```
slides/             weekly deck files (YYYY-MM-DD.md)
slides/template.md  base template for new weeks
scripts/            automation helpers
theme/              custom Slidev theme (coven)
public/             static assets
```

---

## Start a new week

```bash
pnpm new       # scaffolds slides/YYYY-MM-DD.md from template
pnpm dev       # live preview
```

> **Note:** After scaffolding, update the `dev` script in `package.json` to point at the new file if it references a specific filename.

---

## Deck structure

Every deck follows the same arc — consistent enough to feel familiar, flexible enough to fit the week's content.

**Cover** — Title slide with short, punchy deck name in italic emphasis. Includes the `.sub` div with show time and discord link.

**Agenda / "Tonight's Spells"** — A grid of `.card` items, one per topic. Sets the table for what's coming. Badges (`.badge-shipped`, `.badge-wip`) indicate status at a glance.

**Shipped slides** — One slide per major PR cluster or feature. Use `.label` div above the title to name the section. Speaker notes carry the full presenter script for each topic.

**Demo stop** — A dedicated pause-for-demo slide. Label: `Live demo`. Title: `Demo *time*.` Speaker note is a stage-direction cue using `.cue` spans.

**Q&A / open floor stops** — Two or three stops scattered through the deck. Label: `Open floor`. Title with `*open*` emphasis. Invites audience input between topics, not just at the end.

**Architecture / Big Picture** — Optional. Include when a feature has a meaningful system diagram, data flow, or structural change worth explaining visually.

**Outro / closing** — Links, Discord CTA (`discord.gg/opencoven`), and a teaser or call-to-action for next week.

---

## Slide anatomy

Each non-cover slide follows this pattern:

```md
---
layout: default
---

<div class=".label">Section Label</div>

# Slide title with one *italic* word

<!-- Full presenter sentences here. Natural tone — write it like you'd say it.
Use <span class="cue">[walk to demo]</span> for stage directions. -->
```

Custom theme classes:
- `.label` — small section label above the title
- `.card` — topic card with flex layout (used in agenda grids)
- `.badge-shipped` — green "shipped" status badge
- `.badge-wip` — amber "in progress" badge
- `.cue` — stage direction inside speaker notes

---

## Speaker notes

Every slide must have a `<!-- ... -->` speaker note block. No exceptions.

- Full presenter sentences, natural tone — write what you'd actually say
- Use `.cue` spans for stage directions:
  ```html
  <span class="cue">[switch to browser]</span>
  ```
- Notes are presenter-only; they don't appear in the published deck

---

## Writing the deck file

When writing the full deck (especially from Charm/automation):

- **Use `fs.writeFileSync` in a Node script** — shell heredocs and `echo` truncate on long content
- Template vars replaced by `new-week.mjs`:
  - `{{DATE}}` → `YYYY-MM-DD`
  - `{{MONTH_DAY_YEAR}}` → `Month D, YYYY`
- After writing, verify:
  ```bash
  pnpm verify
  # or
  node scripts/verify-week.mjs
  ```
- Check char count and line count; confirm all slides have speaker note blocks

---

## Git workflow

```bash
git add slides/YYYY-MM-DD.md
git commit -m "slides: add YYYY-MM-DD Show'n Spells deck"
git push origin main
```

Commit directly to `main`. No branches needed for weekly decks. For rebuilds:

```bash
git commit -m "slides: rebuild YYYY-MM-DD deck — [brief reason]"
```

---

## Familiar authoring (Charm)

Charm — the OpenCoven voice familiar — authors these decks. The skill is at `skills/open-coven-weekly/` in Charm's workspace (`/Users/buns/.coven/workspaces/familiars/charm/skills/open-coven-weekly/SKILL.md`).

Charm sources content from merged PRs (`gh pr list`), release notes (`gh release list`), and Sage briefs, then writes the file via Node's `fs.writeFileSync`, verifies with the verify script, and pushes to `main`.

---

## Deployment

Vercel auto-deploys on every push to `main`. Preview the live deck at the configured Vercel domain.

---

*Made with ✨ by the Coven.*

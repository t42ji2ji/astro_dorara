# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Astro using the Typography theme (forked from [astro-theme-typography](https://github.com/moeyua/astro-theme-typography)). It's a Chinese-language blog (zh-tw locale) optimized for Chinese typographic norms and reading experience.

**Tech Stack**: Astro, TypeScript, UnoCSS, MDX, Swup (page transitions), Three.js (interactive pages)

## Commands

```bash
pnpm dev          # Start dev server with type checking
pnpm build        # Production build with type checking
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix lint issues
pnpm typecheck    # TypeScript type checking only
pnpm theme:create # Create a new blog post interactively
```

## Architecture

### Configuration System

- `src/.config/default.ts` - Default theme configuration (site info, appearance, SEO, comments, analytics)
- `src/.config/user.ts` - User overrides for the default config
- `src/.config/index.ts` - Merges default + user configs and exports `themeConfig`
- `src/types/themeConfig.ts` - TypeScript types for all config options

### Content Collections

Defined in `src/content.config.ts`:

- **posts**: Blog posts in `src/content/posts/` (supports `.md` and `.mdx`)
- **spec**: Specification content in `src/content/spec/`

Post frontmatter schema: `title`, `pubDate`, `categories[]`, `description?`, `draft?`, `banner?`, `pin?`, `modDate?`

### Layout Hierarchy

- `LayoutDefault.astro` - Base layout with site navigation, header, footer, theme toggle
- `LayoutPost.astro` - Wraps LayoutDefault for post content
- `LayoutPostDetail.astro` - Post detail view with reading progress sidebar
- `LayoutPostList.astro` - Paginated post listing
- `LayoutMinimal.astro` - Minimal layout for special pages
- `LayoutInnovation.astro` - Layout with Three.js background for interactive pages

### Styling

- UnoCSS with `presetWind3`, `presetTypography`, `presetAttributify`, `presetIcons`
- Theme colors defined in config, applied via `unocss-preset-theme` for dark mode
- Custom typography CSS extensions in `uno.config.js`
- Path alias: `~/` maps to `src/`

### Key Utilities

`src/utils/index.ts`:

- `getPosts()` - Fetches and sorts posts (filters drafts in production)
- `getCategories()` - Groups posts by category
- `formatDate()` - Date formatting with dayjs

### Page Transitions

Uses Swup for smooth page transitions. Transition containers: `.transition-swup-header`, `.transition-swup-main`, `.transition-swup-aside`, `.transition-swup-footer`

### Interactive Components

Custom MDX components in `src/components/`:

- `wittgenstein/` - Interactive philosophy demos (BeetleBox, LanguageGame, etc.)
- `kinmen/` - Map and timeline visualizations
- `customer-success/` - Three.js particle effects
- `Figure.astro`, `LinkPreview.astro` - Enhanced content components

### Comment Systems

Supports Disqus, Giscus, and Twikoo. Configure in `src/.config/default.ts` under `comment`. Only the first configured service is displayed.

### i18n

Supported locales defined in `src/i18n.ts`: en-us, zh-cn, zh-tw, ja-jp, it-it

## Adding Content

Create posts in `src/content/posts/` as `.md` or `.mdx` files with frontmatter:

```md
---
title: title
pubDate: 2021-08-01
categories: ["article"]
description: "description"
draft: true
---
```

**Important**: Always set `draft: true` when creating new posts to prevent accidental publishing. Remove it only when the post is ready to go live.

Or use `pnpm theme:create` to create interactively.

## UI Design Guidelines

When creating interactive components:

### Colors

- **Use stone palette only** (stone-100 to stone-900) for most UI elements
- Avoid colorful gradients, shadows, and decorative borders
- Dark mode: use `dark:bg-stone-800`, `dark:text-stone-400` etc.
- Accent colors sparingly: only for critical emphasis (e.g., a single red button for danger action)

### Typography

- Keep text minimal and concise
- Use `text-xs` for labels, `text-sm` for body text
- Avoid uppercase tracking-widest labels except for very subtle section dividers

### Layout

- Prefer simple layouts over complex nested containers
- Use minimal padding and margins
- Avoid decorative boxes, cards with multiple borders, or layered backgrounds
- Let whitespace do the work

### Interactive Elements

- Buttons: simple, no shadows, minimal hover states
- Animations: subtle opacity/transform transitions (300-500ms)
- Avoid flashy effects, pulsing, or attention-grabbing animations

### General Principles

- **Less is more** - remove decorative elements when possible
- **Content first** - UI should not distract from the content
- **Functional** - every element should have a purpose

## Customization Notes

- Social link icons use [Material Design Icons](https://pictogrammers.com/library/mdi/) - the `name` field maps to icon name
- Changes to config require dev server restart
- Theme updates: use GitHub's "Sync Fork" (don't click Discard Changes to preserve local modifications)

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

Post frontmatter schema: `title`, `pubDate`, `categories[]`, `description?`, `slug`, `draft?`, `banner?`, `pin?`, `modDate?`

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

### Course Components (learn/)

用於課程講義的 MDX 組件，位於 `src/components/learn/`：

- `Callout` - 提示/警告/重點標示 (`type`: tip | warning | info | check)
- `Exercise` - 練習題容器 (slots: scenario, task, answer; `level`: 1=填空 | 2=改寫 | 3=設計)
- `Answer` - 可折疊的參考答案
- `SelfCheck` - 自我檢核清單 (傳入 `<li>` 項目)
- `Comparison` - 好壞對比 (slots: bad, good; 可自訂 `badLabel`/`goodLabel`)
- `Template` - 可填寫的模板框
- `Progress` - 進度條 (`current`, `total`)
- `Placeholder` - 待放置內容的佔位符 (`type`: image | diagram | video | component)

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
slug: my-post-slug
draft: true
---
```

**File naming convention**: Use date prefix format `YYYY-MM-DD-slug.mdx` (e.g., `2025-12-31-my-post.mdx`). This makes it easier to manage files chronologically. The date in the filename should match `pubDate`.

**Slug requirement**: Always set `slug` in frontmatter to define the URL path. The slug should match the filename slug part (e.g., filename `2025-12-31-my-post.mdx` → `slug: my-post`). This ensures URLs remain stable even if filenames change.

**Important**: Always set `draft: true` when creating new posts to prevent accidental publishing. Remove it only when the post is ready to go live.

Or use `pnpm theme:create` to create interactively.

## Writing Guidelines

**IMPORTANT**: Before writing any blog post content, you MUST read `how_to_write.md` first. This contains the writing style guide including:

- **Four-stage narrative structure**: Hook → Context → Friction → Payoff
- **Micro-techniques**: Paragraph hooks, visual anchors, pacing control
- **Avoiding AI-ish writing**: Minimize em-dashes (——), use natural sentence structures

Key principles:
- Never write in a flat, explanatory style - create reading momentum
- Each paragraph ending should be a "slide" to the next, not a rest point
- Use concrete imagery instead of abstract descriptions
- Maintain an unresolved question (information gap) in the reader's mind

### Formatting Guidelines

When formatting blog post content, follow these conventions:

**Section Structure**:
- Add a horizontal rule (`---`) before each section heading
- Use numbered sections in Chinese: `## 一、标题名称`, `## 二、标题名称`, etc.
- Use "结语" (Conclusion) as the final section title

**Text Formatting**:
- Use `> Blockquote` for emphasizing key quotes and important statements
- Use bullet lists (`-`) for presenting parallel items
- Use **bold** (`**text**`) to emphasize key concepts and terms

**Frontmatter Categories**:
- For philosophy/personal growth content: `categories: ["Philosophy", "Self-Growth"]`
- Use English category names for consistency

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

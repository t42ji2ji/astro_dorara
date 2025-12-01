# Astro Image Assets - Important Notes

## Issue: Images 404 in Production but Work in Dev

### Problem

When using images from `src/assets/` in Astro, referencing them as string paths (e.g., `"/src/assets/image.png"`) works in development but results in 404 errors in production.

### Root Cause

Astro processes and optimizes images during build time, generating hashed filenames. String paths bypass this optimization and don't get updated to the correct production URLs.

### Solution

**Always import images from `src/assets/` instead of using string paths:**

```mdx
// ❌ Wrong - will 404 in production
<Figure src="/src/assets/w1.png" alt="Description" />

// ✅ Correct - import the image first
import w1Image from '../../assets/w1.png';

<Figure src={w1Image} alt="Description" />
```

### Component Implementation

Components that accept image props should handle both `ImageMetadata` objects and string URLs:

```astro
---
import type { ImageMetadata } from 'astro'

interface Props {
  src: string | ImageMetadata
  alt: string
}

const { src, alt } = Astro.props
// Extract the actual URL from imported images
const imageSrc = typeof src === 'string' ? src : src.src
---

<img src={imageSrc} alt={alt} />
```

### When to Use Each Approach

1. **Import from `src/assets/`** (recommended for most cases):

   - Images that are part of your source code
   - Images that should be optimized and hashed
   - Images in blog posts, components, etc.

2. **Use `public/` folder** (for static assets):
   - Images that must have stable URLs
   - Third-party scripts that reference images
   - Images that shouldn't be processed

### Example Fix Applied

File: `src/content/posts/wittgenstein_ai_language_game.mdx`

- Added: `import w1Image from '../../assets/w1.png';`
- Changed: `<Figure src={w1Image} alt="Wittgenstein" />`

File: `src/components/Figure.astro`

- Updated to accept `string | ImageMetadata`
- Extracts `.src` property when needed

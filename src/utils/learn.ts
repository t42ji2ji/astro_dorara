import { getCollection } from 'astro:content'
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

export interface CourseMeta {
  title: string
  description?: string
  order?: number
  icon?: string
}

export interface NavItem {
  title: string
  href: string
  order: number
  children?: NavItem[]
}

export interface LearnEntry {
  id: string
  data: {
    title: string
    description?: string
    order: number
    draft?: boolean
  }
}

/**
 * Get course metadata from _meta.yaml
 */
export function getCourseMeta(course: string): CourseMeta | null {
  const metaPath = path.join(process.cwd(), 'src/content/learn', course, '_meta.yaml')
  try {
    const content = fs.readFileSync(metaPath, 'utf-8')
    return yaml.load(content) as CourseMeta
  } catch {
    return null
  }
}

/**
 * Get all courses with their metadata
 */
export async function getCourses(): Promise<{ slug: string; meta: CourseMeta }[]> {
  const learnDir = path.join(process.cwd(), 'src/content/learn')
  const entries = fs.readdirSync(learnDir, { withFileTypes: true })

  const courses: { slug: string; meta: CourseMeta }[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const meta = getCourseMeta(entry.name)
      if (meta) {
        courses.push({ slug: entry.name, meta })
      }
    }
  }

  return courses.sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999))
}

/**
 * Get all entries for a specific course
 */
export async function getCourseEntries(course: string): Promise<LearnEntry[]> {
  const allEntries = await getCollection('learn')
  const isProd = import.meta.env.PROD

  return allEntries
    .filter((entry) => {
      const entryPath = entry.id
      const entryCourse = entryPath.split('/')[0]
      if (entryCourse !== course) return false
      if (isProd && entry.data.draft) return false
      return true
    })
    .map((entry) => ({
      id: entry.id,
      data: entry.data as LearnEntry['data'],
    }))
}

/**
 * Build navigation tree for a course
 */
export async function buildNavTree(course: string): Promise<NavItem[]> {
  const entries = await getCourseEntries(course)
  const tree: NavItem[] = []
  const folderMap = new Map<string, NavItem>()

  // Sort entries by path depth first, then by order
  const sortedEntries = [...entries].sort((a, b) => {
    const depthA = a.id.split('/').length
    const depthB = b.id.split('/').length
    if (depthA !== depthB) return depthA - depthB
    return a.data.order - b.data.order
  })

  for (const entry of sortedEntries) {
    // entry.id is like "vibecoding/getting-started/index" or "vibecoding/getting-started/setup"
    // Note: Astro content collection may have .md/.mdx extension in id, or may not
    const parts = entry.id.split('/')
    const courseName = parts[0] // "vibecoding"
    const relativeParts = parts.slice(1) // ["getting-started", "index"] or ["getting-started", "setup"]

    // Handle edge case where relativeParts might be empty or have no elements
    if (relativeParts.length === 0) {
      continue // Skip malformed entries
    }

    const lastPart = relativeParts[relativeParts.length - 1]
    const fileName = lastPart.replace(/\.(md|mdx)$/, '')
    const isIndex = fileName === 'index'

    if (relativeParts.length === 1) {
      // Top-level file in course (e.g., vibecoding/intro.mdx)
      const href = `/learn/${courseName}/${fileName === 'index' ? '' : fileName}`
      tree.push({
        title: entry.data.title,
        href,
        order: entry.data.order,
      })
    } else {
      // Nested file (e.g., vibecoding/getting-started/setup.mdx)
      const folderPath = relativeParts.slice(0, -1).join('/')

      if (isIndex) {
        // This is a folder index file, create/update the folder node
        const href = `/learn/${courseName}/${folderPath}`
        const existing = folderMap.get(folderPath)
        if (existing) {
          existing.title = entry.data.title
          existing.href = href
          existing.order = entry.data.order
        } else {
          const node: NavItem = {
            title: entry.data.title,
            href,
            order: entry.data.order,
            children: [],
          }
          folderMap.set(folderPath, node)

          // Add to parent or root
          const parentPath = relativeParts.slice(0, -2).join('/')
          if (parentPath) {
            const parent = folderMap.get(parentPath)
            if (parent) {
              parent.children = parent.children || []
              parent.children.push(node)
            }
          } else {
            tree.push(node)
          }
        }
      } else {
        // Regular file in folder
        const href = `/learn/${courseName}/${folderPath}/${fileName}`
        const node: NavItem = {
          title: entry.data.title,
          href,
          order: entry.data.order,
        }

        const parent = folderMap.get(folderPath)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(node)
        } else {
          // Parent folder doesn't exist yet, create placeholder
          const placeholderNode: NavItem = {
            title: folderPath.split('/').pop() || folderPath,
            href: `/learn/${courseName}/${folderPath}`,
            order: 999,
            children: [node],
          }
          folderMap.set(folderPath, placeholderNode)
          tree.push(placeholderNode)
        }
      }
    }
  }

  // Sort all levels by order
  const sortItems = (items: NavItem[]): NavItem[] => {
    return items
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        ...item,
        children: item.children ? sortItems(item.children) : undefined,
      }))
  }

  return sortItems(tree)
}

/**
 * Get flat list of all pages in order for prev/next navigation
 */
export async function getFlatNavList(course: string): Promise<{ title: string; href: string }[]> {
  const tree = await buildNavTree(course)
  const flat: { title: string; href: string }[] = []

  const flatten = (items: NavItem[]) => {
    for (const item of items) {
      flat.push({ title: item.title, href: item.href })
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  flatten(tree)
  return flat
}

/**
 * Get prev/next navigation for current page
 */
export async function getPrevNext(course: string, currentPath: string) {
  const flat = await getFlatNavList(course)
  const currentIndex = flat.findIndex((item) => item.href === currentPath)

  return {
    prev: currentIndex > 0 ? flat[currentIndex - 1] : null,
    next: currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null,
  }
}

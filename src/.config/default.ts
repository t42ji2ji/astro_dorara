import type { ThemeConfig } from '~/types'

// This is the default configuration for the template, please do not modify it directly.
// You can override this configuration in the `.config/user.ts` file.

export const defaultConfig: ThemeConfig = {
  site: {
    title: '謝哆啦',
    subtitle: '給你點亮世界的鑰匙',
    author: '謝哆啦',
    description: '給你點亮世界的鑰匙',
    website: 'https://dorara.app/',
    pageSize: 5,
    socialLinks: [
      {
        name: 'github',
        href: 'https://github.com/t42ji2ji',
      },
      {
        name: 'rss',
        href: '/atom.xml',
      },
      {
        name: 'twitter',
        href: 'https://x.com/DoraraHsieh',
      },
      // {
      //   name: 'mastodon',
      //   href: 'https://github.com/moeyua/astro-theme-typography',
      // },
    ],
    navLinks: [
      {
        name: 'Posts',
        href: '/',
      },
      {
        name: 'Archive',
        href: '/archive',
      },
      {
        name: 'Categories',
        href: '/categories',
      },
      {
        name: 'About',
        href: '/resume',
      },
    ],
    categoryMap: [{ name: '--', path: 'dora' }],
    footer: [
      '© %year <a target="_blank" href="%website">%author</a>',
      'Theme <a target="_blank" href="https://github.com/t42ji2ji">Typography</a> by <a target="_blank" href="https://moeyua.com">Moeyua</a>',
      'Proudly published with <a target="_blank" href="https://astro.build/">Astro</a>',
    ],
  },
  appearance: {
    theme: 'system',
    locale: 'zh-tw',
    colorsLight: {
      primary: '#3F4348FF',
      background: '#ffffff',
    },
    colorsDark: {
      primary: '#F3F3F3FF',
      background: '#232222',
    },
    fonts: {
      header:
        '"HiraMinProN-W6","Source Han Serif CN","Source Han Serif SC","Source Han Serif TC",serif',
      ui: '"Source Sans Pro","Roboto","Helvetica","Helvetica Neue","Source Han Sans SC","Source Han Sans TC","PingFang SC","PingFang HK","PingFang TC",sans-serif',
    },
  },
  seo: {
    twitter: '@moeyua13',
    meta: [],
    link: [],
  },
  rss: {
    fullText: true,
  },
  comment: {
    // disqus: { shortname: "typography-astro" },
  },
  analytics: {
    googleAnalyticsId: '',
    umamiAnalyticsId: '',
  },
  latex: {
    katex: false,
  },
}

import presetAttributify from '@unocss/preset-attributify'
import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerVariantGroup,
} from 'unocss'
import presetTheme from 'unocss-preset-theme'
import { themeConfig } from './src/.config'

const { colorsDark, colorsLight, fonts } = themeConfig.appearance

const cssExtend = {
  'table': {
    'border-collapse': 'collapse',
    'border-spacing': '0',
  },

  'table th': {
    'border': '1px solid',
    'border-color': 'var(--prose-borders)',
    'padding': '0.5rem',
    'text-align': 'left',
  },

  'table td': {
    'border': '1px solid',
    'border-color': 'var(--prose-borders)',
    'padding': '0.5rem',
  },

  'blockquote': {
    'border-left': '4px solid',
    'border-left-color': colorsLight.primary,
    'padding-left': '1rem',
    'margin-top': '2rem',
    'margin-bottom': '2rem',
  },

  'blockquote p': {
    opacity: '0.8',
  },

  'img': {
    'max-width': '100%',
    'height': 'auto',
    'border-radius': '0.5rem',
    'margin-bottom': '1rem',
  },

  'code::before,code::after': {
    content: 'none',
  },

  'h2': {
    margin: '0',
  },

  'h3': {
    'margin-bottom': '0rem',
  },

  'hr': {
    'margin': '2rem 0',
    'height': '1px',
    'border': 'none',
    'opacity': '0.2',
    'background-color': '#ccc',
  },

  ':where(:not(pre):not(a) > code)': {
    'white-space': 'normal',
    'word-wrap': 'break-word',
    'padding': '2px 4px',
    'color': '#c7254e',
    'font-size': '90%',
    'background-color': '#f9f2f4',
    'border-radius': '4px',
  },

  'li': {
    'white-space': 'normal',
    'word-wrap': 'break-word',
  },
}

export default defineConfig({
  rules: [
    [
      /^row-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-row': `${start}/${end}` }),
    ],
    [
      /^col-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-column': `${start}/${end}` }),
    ],
    [
      /^scrollbar-hide$/,
      ([_]) => `.scrollbar-hide { scrollbar-width:none;-ms-overflow-style: none; }
      .scrollbar-hide::-webkit-scrollbar {display:none;}`,
    ],
  ],
  presets: [
    presetWind3(),
    presetTypography({ cssExtend }),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
    presetTheme ({
      theme: {
        dark: {
          colors: { ...colorsDark, shadow: '#FFFFFF0A' },
          // TODO 需要配置代码块颜色
        },
      },
    }),
  ],
  theme: {
    colors: { ...colorsLight, shadow: '#0000000A' },
    fontFamily: fonts,
  },
  shortcuts: [
    ['post-title', 'text-6 font-bold lh-7.5 m-0'],
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    ...themeConfig.site.socialLinks.map(social => `i-mdi-${social.name}`),
    'i-mdi-content-copy',
    'i-mdi-check',
  ],
})

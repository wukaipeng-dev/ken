import type { Config } from '@docusaurus/types'
import type * as PresetClassic from '@docusaurus/preset-classic'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { themes } from 'prism-react-renderer'
import 'dotenv/config'

// Common configuration constants
const SITE_CONFIG = {
  title: '楷鹏',
  tagline: '十年的时间，除了变成中年人，我还可以做多少很酷的事',
  url: 'https://wukaipeng.com/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'wukaipeng-dev',
  projectName: 'ken',
  deploymentBranch: 'gh-pages',
}

// Content configuration
const MATH_CONFIG = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
}

const CONTENT_CONFIG = {
  sidebarPath: require.resolve('./sidebars.js'),
  showLastUpdateTime: true,
  ...MATH_CONFIG,
}

// Theme configuration
const NAVBAR_ITEMS: PresetClassic.ThemeConfig['navbar']['items'] = [
  { to: 'technique', label: '🦄 知识库' },
  { to: 'blog', label: '🌌 文章' },
  // { to: 'class', label: '🐻‍❄️ 课程' },
  { to: 'english', label: '🐳 英语' },
  { to: 'read', label: '🦋 阅读' },
  {
    href: 'https://github.com/wukaipeng-dev/ken',
    position: 'right',
    className: 'header-github-link',
    'aria-label': 'GitHub repository',
  },
  {
    type: 'localeDropdown',
    position: 'right',
  },
  { type: 'search', position: 'right' },
]

const FOOTER_LINKS: PresetClassic.ThemeConfig['footer']['links'] = [
  {
    title: '联系方式',
    items: [
      { label: 'Email', href: 'mailto:wkpcoder@163.com' },
      { label: 'GitHub', href: 'https://github.com/wukaipeng-dev' },
      { label: 'X', href: 'https://twitter.com/x_wukaipeng' },
    ],
  },
  {
    title: '供应商',
    items: [
      {
        label: '由 UCloud 提供服务器',
        href: 'https://www.ucloud.cn/site/active/kuaijiesale.html?invitation_code=C1xCCE664C27422',
      },
      {
        html: `<a class="footer__link-item" style="display: flex;gap: 0.25rem;align-items: center;" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">
          由
          <img src="/img/provider/又拍云_logo6.png" style="height: 1.5rem" />
          提供云存储
          <svg width="13.5" height="13.5" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_node_modules-@docusaurus-theme-classic-lib-theme-Icon-ExternalLink-styles-module"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
          </a>`,
      },
      {
        label: '粤ICP备2023085392号',
        href: 'https://beian.miit.gov.cn',
      },
      {
        html: `<img src="/img/provider/备案图标.png" style="height: 1.5rem" /><a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002008170" rel="noreferrer" target="_blank">
        粤公网安备44030002008170号
        </a>`,
      },
    ],
  },
  // {
  //   title: '公众号',
  //   items: [
  //     {
  //       html: `<img src="/img/contact/qrcode_for_gh_36929351504f_430.jpg" style="height: 10rem" />`,
  //     },
  //   ],
  // },
  // {
  //   title: '支持一下',
  //   items: [
  //     {
  //       label: '爱发电',
  //       href: 'https://afdian.com/a/wukaipeng',
  //     },
  //   ],
  // },
]

const config: Config = {
  ...SITE_CONFIG,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  future: {
    // experimental_faster: {
    //   rspackBundler: true,
    //   rspackPersistentCache: true,
    //   ssgWorkerThreads: true,
    // },
    // v4: {
    //   removeLegacyPostBuildHeadAttribute: true,
    // },
    experimental_faster: true,
    v4: true,
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/MonaspaceRadonVarVF.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
  ],

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    localeConfigs: {
      'zh-CN': {
        label: '简体中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en',
      },
    },
  },

  customFields: {
    GISCUS_REPO_ID: process.env.GISCUS_REPO_ID,
    GISCUS_CATEGORY_ID: process.env.GISCUS_CATEGORY_ID,
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: CONTENT_CONFIG,
        blog: {
          showReadingTime: true,
          blogSidebarTitle: '✨',
          blogSidebarCount: 'ALL',
          onUntruncatedBlogPosts: 'ignore',
          ...MATH_CONFIG,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies PresetClassic.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],

  themeConfig: {
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      hideOnScroll: true,
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/Logokp-logo-v3@3x.png',
        srcDark: 'img/Logokp-logo-v1-dark@3x.png',
      },
      items: NAVBAR_ITEMS,
    },
    footer: {
      style: 'dark',
      links: FOOTER_LINKS,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['java', 'bash', 'php'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 6,
    },
    imageZoom: {
      selector: '.markdown img',
    },
  } satisfies PresetClassic.ThemeConfig,

  plugins: [
    'docusaurus-plugin-sass',
    'plugin-image-zoom',
    ...['tech', 'english', 'book', 'class'].map((id) => [
      '@docusaurus/plugin-content-docs',
      {
        id: `docs-${id}`,
        path: `docs-${id}`,
        routeBasePath:
          id === 'book' ? 'read' : id === 'tech' ? 'technique' : id,
        ...CONTENT_CONFIG,
      },
    ]),
  ],

  markdown: {
    mermaid: true,
  },
}

// Optional plugins based on environment variables
if (process.env?.POSTHOG_API_KEY) {
  config.plugins.push([
    'posthog-docusaurus',
    {
      apiKey: process.env.POSTHOG_API_KEY,
      appUrl: 'https://app.posthog.com',
      enableInDevelopment: true,
    },
  ])
} else {
  console.warn('[Warning]可添加 POSTHOG_API_KEY 环境变量以启用 PostHog 插件')
}

if (
  process.env.ALGOLIA_APP_ID &&
  process.env.ALGOLIA_API_KEY &&
  process.env.ALGOLIA_INDEX_NAME
) {
  config.themeConfig.algolia = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME,
    searchParameters: {},
    searchPagePath: 'search',
  }
} else {
  console.warn(
    '[Warning]可添加 ALGOLIA_APP_ID、ALGOLIA_API_KEY 和 ALGOLIA_INDEX_NAME 环境变量以启用 Algolia 搜索插件'
  )
}

export default config

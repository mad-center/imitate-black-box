import {defineConfig} from 'vitepress'

import sidebar from './sidebar.json'

const DOC_ROOT_DIR = "manuscript"
const GITHUB_REPO = `https://github.com/mad-center/imitate-black-box`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "仿黑盒",
  description: "【静止系MAD】仿黑盒——图文教程",
  srcDir: `./${DOC_ROOT_DIR}`,
  lastUpdated: true,
  markdown: {
    config: (md) => {
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
    ],
    lastUpdated: {
      text: "Last Updated"
    },
    sidebar: sidebar,
    search: {
      provider: 'local'
    },
    // deep to level 3 title
    outline: [2, 3],
    // show `return to top` button in menu on small screen
    returnToTopLabel: "Return to top",
    editLink: {
      pattern: `${GITHUB_REPO}/edit/main/${DOC_ROOT_DIR}/:path`
    },
    socialLinks: [
      {icon: 'github', link: GITHUB_REPO}
    ],
  },
  transformPageData(pageData) {
    // console.log(pageData)

    // make sure head is an array
    pageData.frontmatter.head ??= []

    // add more open graph property
    // e.g. <meta name="og:title" content="VitePress">
    pageData.frontmatter.head.push([
      'meta',
      {
        name: 'og:title',
        content:
          pageData.frontmatter.layout === 'home'
            ? `VitePress`
            : `${pageData.title} | VitePress`
      }
    ])

    // add custom web font
    // <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css"/>
    pageData.frontmatter.head.push([
      'link', {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css"
      }
    ])
  },
})
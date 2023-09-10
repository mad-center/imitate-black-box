// .vitepress/theme/index.js

// import DefaultTheme from 'vitepress/theme';
// @ts-ignore
import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'

// @ts-ignore
import {EnhanceAppContext, useData, useRoute} from 'vitepress';

import 'viewerjs/dist/viewer.min.css';
// Credit: modified from https://github.com/T-miracle/vitepress-plugin-image-viewer
import imageViewer from '../plugins/image-viewer/viewer';
// @ts-ignore
import vImageViewer from '../plugins/image-viewer/vImageViewer.vue';

// @ts-ignore
import giscusTalk from 'vitepress-plugin-comment-with-giscus';

// @ts-ignore
import MusicPlayer from '../plugins/music-player'

// back to top
import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import 'vitepress-plugin-back-to-top/dist/style.css'

function setupImageViewer() {
  const route = useRoute();
  imageViewer(route, ".vp-doc img", {
    // for more options, see also https://fengyuanchen.github.io/viewerjs/
  });
}

function setupGiscus() {
  // Get frontmatter and route
  const route = useRoute();
  const {frontmatter} = useData();
  // Obtain configuration from: https://giscus.app/
  // use your own repo
  giscusTalk({
    repo: 'mad-center/imitate-black-box',
    repoId: 'MDEwOlJlcG9zaXRvcnk0MDMyNzAyODI=',
    category: 'General',
    categoryId: 'DIC_kwDOGAlqis4CZNGJ',
    mapping: 'pathname',
    inputPosition: 'top',
    lang: 'zh-CN',
    // ...
  }, {
    frontmatter, route
  });
}

function setupBackToTop() {
  vitepressBackToTop({
    // default
    threshold: 200
  })
}

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);
    // Register global components, if you don't want to use it, you don't need to add it
    // ctx.app.component('vImageViewer', vImageViewer);
    ctx.app.component('MusicPlayer', MusicPlayer);
    setupBackToTop();
  },
  setup() {
    setupImageViewer();
    setupGiscus();
  }
};
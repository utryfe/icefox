const path = require('path')
require('./browserShim')

module.exports = {
  title: 'icefox',
  description: '基于 ElementUI 的企业中后台应用框架❤️',
  base: '/icefox-docs/',
  port: 12306,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('lib'),
        '@@': path.resolve('lib/components'),
      },
    },
  },
  serviceWorker: true,
  // 下面配置菜单，导航等
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduce' },
      { text: '组件', link: '/component/installation' },
      { text: '配置', link: '/config/builder' },
    ],
    sidebar: {
      '/guide/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            //
            'introduce',
            'getting-started',
          ],
        },
        {
          title: '进阶',
          collapsable: false,
          children: [
            //
            'mock',
            'request',
            'routing',
            'store-module',
          ],
        },
      ],
      '/component/': [
        {
          title: '开发指南',
          collapsable: false,
          children: [
            //
            'installation',
            'customize-theme',
          ],
        },
        {
          title: '组件',
          collapsable: false,
          children: [
            //
            'layout',
            'aside-menu',
            'router-tabs',
            'table-page'
          ],
        },
      ],
      '/config/': [
        {
          title: '配置参考',
          collapsable: false,
          children: [
            //
            'builder',
            'application',
            'plugins',
          ],
        },
      ],
    },
    //
    repo: 'utryfe/icefox',
    docsRepo: 'utryfe/icefox',
    docsDir: 'docs',
    lastUpdated: '最后更新',
    editLinks: true,
    editLinkText: '在 Github 上编辑此页',
    serviceWorker: {
      updatePopup: {
        message: '发现新的内容可用',
        buttonText: '刷新',
      },
    },
  },
}

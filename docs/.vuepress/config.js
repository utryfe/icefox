module.exports = {
  title: 'icefox',
  description: '基于 ElementUI 的企业中后台应用框架❤️',
  base: '/icefox-docs/',
  port: 12306,
  themeConfig: {
    nav: [{ text: '指南', link: '/guide/' }, { text: '配置', link: '/config/' }],
    sidebar: {
      '/guide/': [
        {
          title: '指南',
          collapsable: false,
          children: ['', 'getting-started'],
        },
      ],
      '/config/': [''],
      '/api/': [''],
    },
    repo: 'utryfe/icefox',
    docsRepo: 'utryfe/icefox',
    docsDir: 'docs',
    lastUpdated: '最后更新',
    editLinks: true,
    editLinkText: '在 Github 上编辑此页',
    serviceWorker: {
      updatePopup: {
        message: '有新的内容',
        buttonText: '刷新',
      },
    },
  },
}

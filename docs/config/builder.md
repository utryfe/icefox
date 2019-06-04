# 构建配置

这里的构建配置更多是指 [vue-cli-plugin-ut-builder](https://www.npmjs.com/package/vue-cli-plugin-ut-builder)
的配置。从 [快速上手](../guide/getting-started.md#脚手架) 里我们了解到，ut-builder 本质上是
[@vue/cli](https://cli.vuejs.org/zh/) 的插件，因此这里的配置也是基于
[vue.config.js](https://cli.vuejs.org/zh/config/#vue-config-js) 的
[插件配置项](https://cli.vuejs.org/zh/config/#pluginoptions) 。

:::warning 提示
构建配置文件 vue.config.js 更新后，需要手动重启构建。
:::

下面是目前 ut-builder 插件选项的概览：

```js
module.exports = {
  pluginOptions: {
    htmlTemplate: '', // html模板文件路径
    moduleEntry: '', // 构建入口文件路径模式
    preprocess: {}, // 约定式路由与应用框架配置
    services: {}, // 需启用的构建服务配置
    registerService: {}, // 注册自定义构建服务
    registerPlugin: {}, // 注册自定义webpack插件构造函数
  },
}
```

🛠 建设中...

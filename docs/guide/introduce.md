# 介绍

[icefox](https://github.com/utryfe/icefox) 是一些基于 [vue](https://cn.vuejs.org/) 和 [element-ui](https://element.eleme.cn/#/zh-CN) 的企业中后台应用开发工具和组件。

目前已有很多优秀的框架可以帮助我们来开发企业级中后台应用，与他们不同的是，我们从一开始就没计划着要来做这么一件事。

在工作的过程中，我们发现有很多后端开发工程师因各种原因也在参与着前端应用的开发，
因为 vue 的足够易用，借助于一些工具框架，他们也能完成一个系统的前端开发工作。
但术业有专攻，一些需要前端开发技巧的地方，他们可能就很难顾以周全了。这也是我们面临的问题。

icefox 也是我们在工作过程中的一些经验积累。在应用的构建、开发以及发布等各个环节，我们希望能够有一些易用的工具或框架来帮助我们提高开发效率和质量，
因此我们基于 [@vue/cli](https://cli.vuejs.org/zh/) 封装了一些 [构建工具](https://github.com/utryfe/vue-cli-builder)，
基于 element-ui 开发了一些常用的组件。仅此而已。

**保持尽可能的简单**是我们的初衷，我们希望这些工具和组件能够发挥更大的价值，所以我们就在这里了。

另外，我们也学习借鉴了一些社区优秀的前端应用框架方案，如 [Ant Design Pro](https://pro.ant.design/index-cn)、[UmiJS](https://umijs.org/zh/)、[Nuxt](https://zh.nuxtjs.org/)，
作为一个**学习锻炼的平台**，也是我们的初衷之一。

## 特性

- 🚀 基于 @vue/cli 插件的构建工具，**告别 webpack 繁琐配置**，打包压缩发布都不成问题。
- ❤️ **约定式生成路由代码**，告别繁琐的路由配置，有问题的地方还会有提示哦。
- ✨ **内置插件**助力开发，发送请求，日志级别，自动代理，开箱即用。
- 👉 **常用组件**，布局、菜单、路由页签等，打好基础，只需像写 html 一样简单。
- 🐶 **接口自动 Mock 或转发**，Mock 代码也能自动生成，还有 WebSocket 模拟客户端哦。
- 📦 本地一键打包，发布预览，**自动部署**。

## 构建工具

实际上，[icefox](https://www.npmjs.com/package/icefox) 也是一个单独的 [npm](https://www.npmjs.com/) 包。
正如特性里所描述的，icefox 也包含一套构建工具，它是另外一个 npm 包，名称是 [vue-cli-plugin-ut-builder
](https://www.npmjs.com/package/vue-cli-plugin-ut-builder)。

事实上，**vue-cli-plugin-ut-builder**（以下简称 **ut-builder**） 的存在要比 **icefox** 早很多，那时候我们只是想通过升级 vue 构建工具和 [webpack](https://webpack.docschina.org/) 来改善下已有项目的构建效率。
为考虑配置的易用性和可复用性，基于新版 vue 构建工具 [@vue/cli](https://cli.vuejs.org/zh)，我们以其插件的形式来提供构建扩展。

另外，为方便后续不断添加需要的构建能力，在 @vue/cli 插件体系的基础上，我们抽象出了一个简单的服务层，并通过服务的形式来打包构建插件，以提供具体的构建能力。
这里的构建插件不仅仅指 @vue/cli 插件，还包括 webpack 插件，[babel](https://www.babeljs.cn/) 插件，以及[express](http://www.expressjs.com.cn/) 中间件等等。

## 依赖关系

事实上，ut-builder 是可以脱离 icefox 单独使用的。从包的命名来看，你可能已经想到了，ut-builder 就是一个 @vue/cli 的插件而已。
但其能力远不止一个插件那么简单。实际上，其提供的构建能力，覆盖了从开发、构建到发布的各个阶段，通过服务的形式，你可以任意选择你需要启用的一些构建支持。

如果你有特定构建需求的话，你还能注册你自己的插件或服务，然后 ut-builder 会为你提供一些便捷的小工具，也会在合适的时机去调用你的插件或服务。

相比于 ut-builder，icefox 包本身充当的则是一个应用框架的角色，并强制依赖于 ut-builder 提供的构建能力。

**简而言之，其两者的特点是，ut-builder 运行在 node 环境，提供构建支持；icefox 运行在浏览器环境，包含很多 vue 组件和工具。**

## 为什么叫 icefox ？

现在要在 npm 上注册一个简短又有意思的包名，有点难于上青天啊 😂。
icefox 是之前已注册过的一个名字，字符序列看起来也规规整整的，直译下来是"冰狐"的意思，有点酷吧？😎
你又想到了啥？😂

# 快速上手

以下名称 **ut-builder** 均指 [@vue/cli](https://cli.vuejs.org/zh/) 命名行构建工具插件 [vue-cli-plugin-ut-builder](https://www.npmjs.com/package/vue-cli-plugin-ut-builder)。

## 环境准备

首先，你需要安装 [Node.js](https://nodejs.org/en/) 运行环境。

构建工具 **ut-builder** 依赖 **8.3.0** 以上版本的 **node** 运行环境。
因为从这一版本开始，node 运行环境提供了较完善的解构语法支持。

:::tip 提示
早期 1.x.x 版本的 ut-builder 最低是支持到 8.0.0 版本 node 的，由于此版本 node 的解构语法支持不完善，
又不想使用转译，写代码太难受，所以从 2.x.x 起就要求 8.3.0 以上 node 版本了。 😂
:::

:::warning 提示
如果你需要使用 @vue/cli 提供的脚手架来初始化创建工程的话，那么就需要安装至少 **8.9.x** 以上版本的 node。
:::

开发环境下，推荐尽量安装最新 **LTS** 版本的 [node](https://nodejs.org/en/download/)。

另外，你还可以使用 [nvm](https://github.com/nvm-sh/nvm)
或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 来管理你本地的 node 版本。

```bash
# 查看已安装的 node 版本
node -v
```

相应地，在 node 环境下，你需要使用**包管理器**来管理项目依赖。

你可以使用 [npm](https://www.npmjs.com/) 或者 [yarn](https://www.yarnpkg.com/zh-Hans/) 来管理你的依赖包。
**这里的示例都将以 npm 作为包管理器**。

为提升安装效率，你还需要切换下包管理器默认的下载仓库源。

```bash
# 切换 npm 仓库源至国内镜像源，提升包下载速率
npm config set registry https://registry.npm.taobao.org
```

如果你需要频繁切换不同的源，[nrm](https://github.com/Pana/nrm)(**npm registry manager**) 会是一个不错的工具。

```bash
# 全局安装 npm 仓库源管理工具 nrm
npm i nrm -g

# 查看可用的镜像源
# nrm ls

# 切换到国内源
nrm use taobao
```

## 脚手架

**ut-builder** 本身并没有提供完整的脚手架工具，因为 **@vue/cli** 提供的脚手架已经足够好用了。甚至你还可以基于 **@vue/cli** 的配置，定制或开发自己喜欢的脚手架。

另外，[前面](./#构建工具) 我们也了解到，**ut-builder** 本身就是一个 **@vue/cli** 插件。
所以，你可以**先使用 @vue/cli 初始化创建工程，然后再添加 [ut-builder](https://www.npmjs.com/package/vue-cli-plugin-ut-builder) 插件**。

如果你只想单独使用 **ut-builder** 这个插件也是可以的，甚至你还可以只使用 **icefox** 包里面的一些组件。
后面我们会提一些需要注意的地方，但在这里，推荐你按照下面的示例，先创建一个完整的示例项目。

首先我们需要 **安装 vue 官方命令行构建工具** ：

```bash
# 老版本命令行工具会对新版工具造成影响
# 如果你已安装过老版工具，你需要先卸载它
# npm uninstall vue-cli -g

# 全局安装 @vue/cli 命令行构建工具
npm i @vue/cli -g
```

你也可以在 [这里](https://cli.vuejs.org/zh/guide/installation.html) 了解下 vue 官方关于命令行构建工具的安装说明。

接下来我们创建一个示例项目：

```bash
# 在合适的工作目录下，创建一个名为 hello-world 的项目
vue create hello-world
```

交互式命令行会提示你选择一些构建特性，你可以根据你的需要来选择，然后脚手架就会帮我们创建好项目的基本骨架了。

:::tip 提示
icefox **内置的主题样式是基于 Less 预编译样式语言**的，这里我们推荐你在选择样式预处理器(CSS Pre-processors)时，将 **Less** 选上。
其他一些特性，比如 Babel、Linter / Formatter、Router、Vuex，一般都是需要的了。
代码风格配置选项里，ESLint + Prettier 的组合还不错。最后将配置文件单独外置，在需要以编程方式进行配置时将会更加便利。
:::

[这里](https://cli.vuejs.org/zh/guide/creating-a-project.html) 是 vue 官方使用命名行工具创建项目的详细示例，有兴趣的话你也可以过去瞧瞧。

创建好项目后，我们还需要添加下 [ut-builder](https://github.com/utryfe/vue-cli-builder#readme) 插件。
在安装插件前，推荐你先看一下 vue 官方关于 [命令行工具插件](https://cli.vuejs.org/zh/guide/plugins-and-presets.html) 的说明，
当然往后你再去了解也是可以的。

```bash
# 进入到示例项目根目录
cd hello-world

# 添加 ut-builder 插件
vue add ut-builder

# 或者直接使用 npm 安装开发依赖（注意依赖名称与上面的不同）
# npm i vue-cli-plugin-ut-builder -D
```

安装完成后，就可以运行命令，看看效果了。

```bash
# 启动开发服务器
npm run serve
```

如果没有遇到错误的话，你应当能看到类似下面这个样子的控制台输出，这里我们也暂且不需要了解这些输出项的意义。

![构建成功](../assets/images/build-completed.png)

:::tip 提示
2.x.x 以上版本的 ut-builder 在运行后会默认将 icefox 添加进 package.json 的依赖声明中，
这是因为 icefox 为内置的组件提供了声明文件，以便在 IDE（如：WebStorm）中获取编辑器智能提示的能力，而前提是需要将包添加进项目依赖声明中。
另外，deploy、stage 两个 npm 脚本命令也会被添加进 package.json 中。
:::

:::warning 提示
虽然你还可以安装其他的 @vue/cli 插件来丰富项目的构建能力，但这里其实是不太推荐你安装过多的其他插件的。
这是因为构建是个复杂的事情，ut-builder 本身已经实现了很多常用的构建特性，也会尽最大的努力来保证构建的稳定性。
另外，原则上 ut-builder 严格在 [@vue/cli 配置](https://cli.vuejs.org/zh/config/) 的基础上做增强，换言之你可以自己定义一些基础配置，
ut-builder 会考虑到用户自己的配置并做相应增强。其他命令行插件的构建行为也有可能会与 ut-builder 的构建行为相冲突。
:::

**ut-builder** 提供了较丰富的[构建配置项](../config/#构建配置)，能满足常用的 App 构建需求。这也是上面提到的，你可以把它**单独作为一个构建插件**来使用的原因。

在这里，结合 **icefox**，我们看看还能多做一些什么。

## 使用 icefox 组件

[icefox](https://github.com/utryfe/icefox) 提供了一些可快速搭建企业级中后台系统框架的组件和工具，其本身也依赖于 [element-ui](https://element.eleme.cn/#/zh-CN) 的一些基础组件。
与 **element-ui** 类似，我们也有两种方式来使用 **icefox** 提供的组件。

一种是直接从 [icefox](https://www.npmjs.com/package/icefox) 包里面导入需要的组件使用。

```vue
<script>
import { AsideMenu } from 'icefox'

export default {
  name: 'MyComponent',
  components: { AsideMenu },
}
</script>
```

另外一种是以 **vue 插件** 的形式全局安装 **icefox** 下的所有组件。

```js
import Vue from 'vue'
import icefox from 'icefox'

// 安装vue插件
Vue.use(icefox)
```

```vue
<template>
  <!--  在单文件组件模板中使用 icefox 组件，组件名都以 ice- 前缀开头 -->
  <ice-aside-menu />
</template>
```

:::tip 提示
由于依赖关系，以 vue 插件的形式安装 icefox 时，element-ui 默认也会作为插件被安装。
导入 icefox 包的同时，element-ui 的主题样式文件也会被同步导入。
:::

就像上面这样，我们可以把 **icefox** 里面的组件单独拿来使用，它就像个第三方的组件包一样。

下面是个使用菜单数据生成菜单的例子：

```vue
<template>
  <aside-menu :menu-items="items" default-active="id_2" style="width:200px" />
</template>

<script>
import { AsideMenu } from 'icefox'

export default {
  name: 'MyComponent',
  components: { AsideMenu },
  data() {
    return {
      items: [
        { id: 'id_1', title: '菜单项一' },
        { id: 'sub', title: '子菜单', children: [{ id: 'id_2', title: '菜单项二' }] },
      ],
    }
  },
}
</script>
```

运行结果：

<ice-aside-menu 
  default-active="id_2" 
  style="width:200px" 
  :menu-items="[{ id: 'id_1', title: '菜单项一' },
   { id: 'sub', title: '子菜单', children: [{ id: 'id_2', title: '菜单项二' }] }]"
/>

<br>

## 约定式路由

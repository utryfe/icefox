# 快速上手

## 环境准备

构建工具依赖 **8.3.0** 以上版本的 [node](https://nodejs.org/en/) 运行时。因为从这一版本开始，node 运行环境提供了较完善的解构语法支持。

:::tip 提示
早期构建工具 1.x.x 版本最低是支持到 8.0.0 版本 node 的，由于解构语法支持不到位，
又不想使用转译，写代码太难受，从 2.x.x 起就提升到 8.3.x 以上 node 版本要求了。 😂
:::

:::warning 提示
如果你需要使用 [@vue/cli](https://cli.vuejs.org/zh/) 提供的脚手架初始化创建工程的话，那么就需要安装至少 **8.9.x** 以上版本的 node。
:::

开发环境，推荐尽量安装最新 **LTS** 版本的 [node](https://nodejs.org/en/download/)。

另外，你还可以使用 [nvm](https://github.com/nvm-sh/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 来管理你本地的 node 版本。

```
# 查看已安装的 node 版本
$ node -v
```

你可以使用 [npm](https://www.npmjs.com/) 或者 [yarn](https://www.yarnpkg.com/zh-Hans/) 来管理你的依赖包。
**这里的示例都将以 npm 来作为包管理器**。

```
# 切换 npm 仓库源至国内镜像源，提升包下载速率
$ npm config set registry https://registry.npm.taobao.org
```

如果你有切换不同源的需要，[nrm](https://github.com/Pana/nrm)(**npm registry manager**) 会是一个不错的工具。

```
# 全局安装 npm 仓库源管理工具 nrm
$ npm i nrm -g

# 切换到国内源
$ nrm use taobao
```

## 脚手架

**icefox** 本身并没有提供完整的脚手架工具，因为 **@vue/cli** 提供的脚手架已经足够好用了。
另外，[前面](./#构建工具) 我们也了解到，与 **icefox** 配套的构建工具本身就是一个 **@vue/cli** 插件。
所以，你可以**先使用 [@vue/cli](https://cli.vuejs.org/zh/) 初始化创建工程，然后再添加 [vue-cli-plugin-ut-builder](https://www.npmjs.com/package/vue-cli-plugin-ut-builder) 插件**。

如果你只想单独使用 **vue-cli-plugin-ut-builder** 这个插件也是可以的，甚至你还可以只使用 **icefox** 包里面的一些组件。
后面我们也会说明不同选择之间的差别，但在这里，我们推荐你先按照下面的示例，创建一个完整的示例项目。

```
# 老版本命令行工具会对新版工具造成影响
# 如果你已安装过老版工具，你需要先卸载它
# $ npm uninstall vue-cli -g

# 全局安装 @vue/cli 命令行构建工具
$ npm i @vue/cli -g
```

你也可以在 [这里](https://cli.vuejs.org/zh/guide/installation.html) 了解下 vue 官方关于命令行构建工具的安装说明。

接下来我们创建一个示例项目：

```
# 在合适的工作目录下，创建一个名为 hello-world 的项目
$ vue create hello-world
```

交互式命令行会提示你选择一些特性，你可以根据你的需要来选择，然后脚手架就会帮我们创建好项目的基本骨架。
[这里](https://cli.vuejs.org/zh/guide/creating-a-project.html) 是官方的详细示例说明，关于一些细节，你也可以过去瞧瞧。

创建好项目后，我们还需要添加下 [vue-cli-plugin-ut-builder](https://github.com/utryfe/vue-cli-builder#readme) 插件。
在安装插件前，我们推荐你先看一下官方关于 [插件](https://cli.vuejs.org/zh/guide/plugins-and-presets.html) 的说明，当然往后你再去了解也是可以的。

```
# 进入到示例项目根目录
$ cd hello-world

# 添加 ut-builder 插件
$ vue add ut-builder

# 或者直接使用 npm 安装开发依赖（注意依赖名称与上面的不同）
# $ npm i vue-cli-plugin-ut-builder -D
```

安装完成后，就可以运行命令，看看效果了。

```
# 启动开发服务器
$ npm run serve
```

如果没有遇到错误的话，你应当能看到类似下面这个样子的控制台输出：

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
ut-builder 会考虑到用户自己的配置并做相应增强。其他插件的构建行为也可能会与 ut-builder 的构建行为相冲突。
:::

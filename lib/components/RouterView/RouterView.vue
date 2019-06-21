<template>
  <transition
    mode="out-in"
    :name="transitionName"
    @after-enter="afterRouteTransitionEnter"
    @after-leave="afterRouteTransitionLeave"
  >
    <keep-alive v-if="keepAlive" :include="aliveInclude" v-bind="$attrs">
      <router-view :name="name" />
    </keep-alive>
    <router-view v-else :name="name" />
  </transition>
</template>

<script>
import { escapeRegExp } from '../../utils/mixed'
import {
  getDefaultRouteComponent,
  getMatchedRoutesByView,
  getRouterViewPath,
  isRouteCaseSensitive,
  isSameRoute,
  trimPathTrailingSlash,
} from '../../utils/route'

export default {
  name: 'IceRouterView',
  inheritAttrs: false,
  props: {
    keepAlive: Boolean,

    transition: [Boolean, String],

    include: [String, RegExp, Array],

    // 用来与外部同步路由历史
    views: {
      type: Array,
      default: () => [],
    },

    root: String,

    name: {
      type: String,
      default: 'default',
    },
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  provide() {
    const _this = this
    return {
      /**
       * 获取缓存的视图路由记录列表
       */
      get $cachedViews() {
        return [..._this.cachedViews]
      },

      /**
       * 移除缓存的视图（根据路由记录）
       */
      $removeCachedView: this.removeCachedView.bind(this),

      /**
       * 重新加载当前组件
       */
      $reload: this.reload.bind(this),
    }
  },

  data() {
    const { views } = this
    return {
      cachedViews: Array.isArray(views) ? views : [],
    }
  },

  computed: {
    transitionName() {
      const { transition } = this
      if (!transition) {
        return ''
      }
      if (typeof transition === 'string') {
        return transition
      }
      return 'route-transition'
    },

    aliveInclude() {
      const { cachedViews, keepAlive } = this
      if (!keepAlive) {
        return []
      }

      const aliveNames = cachedViews
        .filter((view) => {
          const component = getDefaultRouteComponent(view)
          // 如果组件定义包含 noCache 或 nocache 声明，则该组件不作缓存处理
          return component ? !(component['noCache'] || component['nocache']) : false
        })
        .map((view) => view.aliveName)

      let { include: userInclude } = this
      let include

      // 在使用约定式目录路由时，router模块会保证路由组件都有独立的名称
      // 如果路由组件配置的名称有重复的，则会修改组件名称为唯一名称
      // 唯一的组件名称，能保证所有路由组件都能基于keep-alive被缓存起来
      // 所以如果用户自己配置了 alive 的 include 规则，则需要自己保证配置了相应的不重名组件名称
      if (userInclude instanceof RegExp) {
        // 使用正则规则
        const source = `(?:${userInclude.source})|(?:^(?:${aliveNames
          .map((name) => escapeRegExp(name))
          .join('|')})$)`

        include = new RegExp(source, userInclude.flags)
      } else {
        //
        if (typeof userInclude === 'string') {
          // 使用逗号分割的组件名列表
          userInclude = userInclude.trim().split(/\s*,\s*/g)
        }
        if (Array.isArray(userInclude)) {
          // 使用字符串数组格式匹配
          include = [
            ...new Set([
              ...userInclude.filter((item) => typeof item === 'string'),
              ...aliveNames,
            ]),
          ]
        } else {
          // 用户未指定需要alive的组件
          include = aliveNames
        }
      }

      return include
    },
  },

  watch: {
    $route: 'updateCachedView',
  },

  created() {
    this.updateCachedView(this.$route)
  },

  methods: {
    // 重新加载当前路由组件
    reload() {
      const { root, $route, $router } = this
      const { fullPath } = $route

      const to = getMatchedRoutesByView(this, root)[0]
      if (to) {
        this.removeCachedView(to)
      }

      const viewPath = getRouterViewPath(this, root)
      // 使用重定向跳板来刷新当前路由视图组件
      this.$nextTick(() => $router.replace(`${viewPath ? '302' : '301'}${fullPath}`))
    },

    // 移除路由视图
    removeCachedView(route) {
      const { cachedViews } = this
      for (let i = 0; i < cachedViews.length; i++) {
        if (isSameRoute(route, cachedViews[i])) {
          cachedViews.splice(i, 1)
          break
        }
      }
    },

    // 清空缓存的路由组件实例
    clearCachedViews() {
      const { cachedViews } = this
      cachedViews.length = 0
    },

    // 更新路由视图
    updateCachedView() {
      const { cachedViews, root } = this
      // 根据当前视图出口获取激活路由信息
      const to = getMatchedRoutesByView(this, root)[0]
      if (!to) {
        // 非可alive路由记录
        return
      }

      // 这里提前获取组件的keep-alive标识名，并保存到路由记录里面去
      // 如果用户需要进行alive动态控制，可以利用这个字段值
      const aliveName = this.getComponentAliveName(to)

      const index = cachedViews.findIndex((route) => isSameRoute(route, to))
      const route = cachedViews[index]

      let path = trimPathTrailingSlash(to.path)
      // 路由路径大小写敏感可通过路由初始化参数确定
      if (!isRouteCaseSensitive()) {
        path = path.toLowerCase()
      }

      if (!route) {
        // 冻结路由配置对象，不允许进行修改，保证路由记录参数等不会被变更
        cachedViews.push(Object.freeze({ ...to, path, aliveName }))
      } else {
        // 更新已有的路由记录，比如动态路由参数可能发生了变更等
        // 一般情况下不同动态路由参数，会使用相同的路由组件实例进行渲染
        cachedViews.splice(index, 1, Object.freeze({ ...route, ...to, path, aliveName }))
      }
    },

    getComponentAliveName(route) {
      const component = getDefaultRouteComponent(route)
      return component ? component['name'] : '(N/A)'
    },

    afterRouteTransitionEnter() {
      const { $basicLayout } = this
      this.$emit('after-route-enter')
      if ($basicLayout) {
        $basicLayout.$emit('after-route-enter')
      }
    },

    afterRouteTransitionLeave() {
      const { $basicLayout } = this
      this.$emit('after-route-leave')
      if ($basicLayout) {
        $basicLayout.$emit('after-route-leave')
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../theme/var.less';

.route-transition {
  &-leave-active,
  &-enter-active {
    transition: opacity @layout-route-transition-duration,
      transform @layout-route-transition-duration;
  }

  &-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>

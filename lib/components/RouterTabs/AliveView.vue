<template>
  <transition
    mode="out-in"
    :name="transitionName"
    @after-enter="afterRouteTransitionEnter"
    @after-leave="afterRouteTransitionLeave"
  >
    <keep-alive v-if="enableAlive" :include="aliveInclude" v-bind="$attrs">
      <router-view />
    </keep-alive>
    <router-view v-else />
  </transition>
</template>

<script>
import { escapeRegExp } from '../../utils/mixed'
import {
  getDefaultRouteComponent,
  isRouteCaseSensitive,
  isSameRoute,
  trimPathTrailingSlash,
} from '../../utils/route'

export default {
  name: 'AliveView',
  inheritAttrs: false,
  props: {
    enableAlive: Boolean,

    transition: [Boolean, String],

    include: [String, RegExp, Array],

    routes: {
      type: Array,
      default: () => [],
    },

    value: {
      type: String,
      default: '/',
    },
  },

  provide() {
    const _this = this
    return {
      get $activeView() {
        return _this.active
      },
      get $cachedViews() {
        return [..._this.routeViews]
      },
      $removeCachedView: this.removeRouteView.bind(this),
    }
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  data() {
    const { routes } = this
    return {
      routeViews: Array.isArray(routes) ? routes : [],
      active: this.value,
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
      const { include } = this
      return this.getKeepAliveInclude(include)
    },

    routingStatus() {
      const { $router, $route } = this
      if ($router && $route && typeof $router.getRoutingStatus === 'function') {
        return $router.getRoutingStatus($route)
      }
      return 0
    },
  },

  watch: {
    $route: 'updateRouteViews',

    value(val) {
      this.active = val
    },

    active(view) {
      const { $router } = this
      if ($router && view) {
        $router.push(this.getRouteByPath(view) || view)
      }
      this.$emit('input', view)
    },
  },

  mounted() {
    this.updateRouteViews(this.$route)
  },

  methods: {
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

    // 清除路由视图
    removeRouteView(path) {
      let { routeViews, active } = this
      let cursor = routeViews.findIndex((view) => isSameRoute(view, path))
      if (cursor === -1) {
        return
      }

      // 先找到当前已经激活的视图
      const activeView = routeViews.find((view) => isSameRoute(view, active))

      // 清除已经删除的视图
      const removedView = routeViews.splice(cursor--, 1)[0]

      // 如果没有激活的视图（比如404页等），则返回
      // 如果激活的视图不是被删除的视图，也返回
      if (!activeView || activeView !== removedView) {
        return
      }

      // 删除完了，返回到根路由
      if (!routeViews.length) {
        this.active = '/'
        return
      }

      // 找到临近的下一个路由
      const nextView = routeViews[Math.min(Math.max(cursor, 0), routeViews.length - 1)]

      // 如果临近的下一个路由就是当前激活的路由，则不做处理
      if (activeView === nextView) {
        return
      }

      // 指向下一个临近的路由视图
      this.active = nextView.path
    },

    // 更新路由视图
    updateRouteViews(to) {
      if (!to) {
        return
      }

      if (this.routingStatus) {
        //
        this.active = ''
        return
      }

      const component = getDefaultRouteComponent(to)
      if (!component) {
        // 404
        this.active = ''
        return
      }

      const { routeViews } = this
      // 这里提前获取组件的keep-alive标识名，并保存到路由记录里面去
      // 如果用户需要进行alive动态控制，可以利用这个字段值
      const aliveName = this.getComponentAliveName(to)

      const index = routeViews.findIndex((view) => isSameRoute(view, to))
      const route = routeViews[index]

      let path = trimPathTrailingSlash(to.path)
      // 路由路径大小写敏感可通过路由初始化参数确定
      if (!isRouteCaseSensitive()) {
        path = path.toLowerCase()
      }

      if (!route) {
        // 冻结路由配置对象，不允许进行修改，保证路由记录参数等不会被变更
        routeViews.push(Object.freeze({ ...to, path, aliveName }))
      } else {
        // 更新已有的路由记录，比如动态路由参数可能发生了变更等
        // 一般情况下不同动态路由参数，会使用相同的路由组件实例进行渲染
        routeViews.splice(index, 1, Object.freeze({ ...route, ...to, path, aliveName }))
      }

      // 设置当前激活的视图路径
      this.active = path
    },

    // 获取keep-alive组件的include属性
    // 用于控制组件缓存
    getKeepAliveInclude(userInclude) {
      const { routeViews } = this
      const aliveNames = routeViews
        .filter((view) => {
          const component = getDefaultRouteComponent(view)
          // 如果组件定义包含 noCache 或 nocache 声明，则该组件不作缓存处理
          return component ? !(component['noCache'] || component['nocache']) : false
        })
        .map((view) => view.aliveName)

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

    getRouteByPath(path) {
      const { routeViews } = this
      if (typeof path === 'string') {
        path = { path }
      }
      return routeViews.find((item) => isSameRoute(item, path))
    },

    getComponentAliveName(route) {
      const component = getDefaultRouteComponent(route)
      return component ? component['name'] : '(N/A)'
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

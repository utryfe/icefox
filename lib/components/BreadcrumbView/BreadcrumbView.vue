<template>
  <div class="ice-breadcrumb-view">
    <div class="ice-breadcrumb-view-bar">
      <slot :routes="breadcrumbRoutes" :active="activePath">
        <breadcrumb-bar
          :routes="breadcrumbRoutes"
          :transition="breadcrumbTransition"
          v-bind="$attrs"
          v-on="$listeners"
        />
      </slot>
    </div>

    <layout-content class="ice-breadcrumb-view-content" :scrollable="scrollable">
      <router-view
        ref="aliveView"
        :class="viewClassName"
        :root="root"
        :keep-alive="keepAlive"
        :name="viewName"
        :transition="transition"
        @after-route-enter="handleRouterEnter"
        @after-route-leave="handleRouterLeave"
        v-bind="aliveProps"
      />
    </layout-content>
  </div>
</template>

<script>
import RouterView from '../RouterView'
import LayoutContent from '../Layout/Content'
import BreadcrumbBar from './BreadcrumbBar'
import {
  getDefaultRouteComponent,
  getMatchedRoutes,
  getMatchedRoutesByView,
  getRouteComponentTitle,
  getRouterViewPath,
  isSameRoute,
} from '../../utils/route'
import { mergeClass, toCamelCaseProps } from '../../utils/vnode'

export default {
  name: 'IceBreadcrumbView',
  components: { BreadcrumbBar, RouterView, LayoutContent },
  inheritAttrs: false,

  props: {
    keepAlive: Boolean,

    keepAliveProps: {
      type: [Object, Function],
      default: null,
    },

    viewClass: {
      type: [String, Object, Array, Function],
      default: '',
    },

    transition: {
      type: [Boolean, String],
      default: false,
    },

    breadcrumbTransition: {
      type: [Boolean, String],
      default: false,
    },

    labelProp: {
      type: [String, Function],
      default: 'title',
    },

    root: String,

    viewName: String,

    scrollable: Boolean,
  },

  data() {
    return {
      $preservedRoute: null,
      $unregisterBeforeHooks: null,
      $unregisterAfterHooks: null,
    }
  },

  computed: {
    activeComponent() {
      return getDefaultRouteComponent(this.$route)
    },

    aliveProps() {
      const { $route, keepAliveProps, activeComponent } = this
      return toCamelCaseProps(
        typeof keepAliveProps === 'function'
          ? keepAliveProps($route, activeComponent)
          : keepAliveProps
      )
    },

    viewClassName() {
      const { viewClass, $route, activeComponent } = this
      return mergeClass(
        typeof viewClass === 'function' ? viewClass($route, activeComponent) : viewClass
      )
    },

    breadcrumbRoutes() {
      const { root, labelProp } = this
      const routes = getMatchedRoutesByView(this, root)
      for (const route of routes) {
        route.title = getRouteComponentTitle(route, labelProp)
      }
      return routes
    },

    activePath() {
      const { $route } = this
      return $route ? $route.path : ''
    },

    currentRouterState() {
      const { breadcrumbRoutes, activePath } = this
      return { routes: [...breadcrumbRoutes], active: activePath }
    },
  },

  watch: {
    currentRouterState() {
      this.$emit('change', { ...this.currentRouterState })
    },
  },

  created() {
    const { $router } = this
    if ($router) {
      this.registerBeforeHook()
      this.registerAfterHook()
    }
  },

  beforeDestroy() {
    const { $unregisterBeforeHooks, $unregisterAfterHooks } = this
    if ($unregisterBeforeHooks) {
      $unregisterBeforeHooks()
    }
    if ($unregisterAfterHooks) {
      $unregisterAfterHooks()
    }
  },

  methods: {
    removeCachedView(path) {
      const { aliveView } = this.$refs
      if (aliveView) {
        aliveView.removeCachedView(path)
      }
    },

    matchViewPath(to) {
      const viewPath = getRouterViewPath(this, this.root)
      if (viewPath) {
        const matched = getMatchedRoutes(to)
        if (matched.find((route) => isSameRoute(route, viewPath))) {
          return viewPath
        }
      }
      return ''
    },

    registerBeforeHook() {
      this.$unregisterBeforeHooks = this.$router.beforeEach((to, from, next) => {
        const { $preservedRoute } = this
        if ($preservedRoute) {
          const viewPath = this.matchViewPath(to)
          if (viewPath) {
            // 进入面包屑路由视图
            this.$preservedRoute = null
            if (isSameRoute(to, viewPath) && !isSameRoute(to, $preservedRoute)) {
              // 进入到已历史创建的面包屑路由组件
              next($preservedRoute)
              return
            }
          }
        }
        // 完成路由解析
        next()
      })
    },

    registerAfterHook() {
      this.$unregisterAfterHooks = this.$router.afterEach((to, from) => {
        if (this.matchViewPath(from) && !this.matchViewPath(to)) {
          this.$preservedRoute = { ...from }
        }
      })
    },

    handleRouterEnter() {
      this.$emit('after-route-enter')
    },

    handleRouterLeave() {
      this.$emit('after-route-leave')
    },
  },
}
</script>

<style lang="less" scoped>
.ice-breadcrumb-view {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &-bar {
    flex: none;
    margin-bottom: 12px;
  }

  &-content {
    flex: 1 1 auto;
    box-sizing: border-box;
  }
}
</style>

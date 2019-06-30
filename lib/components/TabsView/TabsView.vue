<template>
  <div class="ice-tabs-view">
    <div v-show="viewRoutes.length" class="ice-tabs-view-bar">
      <slot :routes="scopedRoutes" :active="activeName">
        <tabs-bar
          :routes="viewRoutes"
          :label-prop="labelProp"
          :active-name="activeName"
          :min-tabs-count="minTabsCount"
          :fixed-close-button="fixedCloseButton"
          v-bind="$attrs"
          v-on="$listeners"
          @tab-click="handleRouterLink"
          @tab-remove="removeCachedView"
        />
      </slot>
    </div>

    <layout-content :class="tabContentClassName" :scrollable="scrollable">
      <router-view
        ref="aliveView"
        :key="refreshViewKey"
        :class="viewClassName"
        :root="root"
        :views="viewRoutes"
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
import TabsBar from './TabsBar'
import { escapeRegExp, randomSequence } from '../../utils/mixed'
import { mergeClass, toCamelCaseProps } from '../../utils/vnode'
import {
  getDefaultRouteComponent,
  getRouteComponentTitle,
  isRouteCaseSensitive,
  isSameRoute,
  trimPathTrailingSlash,
} from '../../utils/route'

export default {
  name: 'IceTabsView',
  inheritAttrs: false,
  components: { RouterView, TabsBar, LayoutContent },

  props: {
    viewClass: {
      type: [String, Object, Array, Function],
      default: '',
    },

    keepAlive: {
      type: Boolean,
      default: true,
    },

    keepAliveProps: {
      type: [Object, Function],
      default: null,
    },

    labelProp: {
      type: [String, Function],
      default: 'title',
    },

    /**
     * 最小保留的页签数。达到最小个数时页签将不可被关闭。
     */
    minTabsCount: {
      type: Number,
      default: 1,
    },

    /**
     * 固定关闭按钮
     */
    fixedCloseButton: {
      type: Boolean,
      default: true,
    },

    transition: [Boolean, String],

    root: String,

    viewName: String,

    scrollable: Boolean,
  },

  data() {
    return {
      viewRoutes: [],
      activePath: '',
      refreshViewKey: randomSequence(10),
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

    tabContentClassName() {
      const { viewRoutes } = this
      return [
        'ice-tabs-view-content',
        {
          'ice-border-top': !viewRoutes.length,
        },
      ]
    },

    viewClassName() {
      const { viewClass, $route, activeComponent } = this
      return mergeClass(
        'ice-tabs-view-content-wrapper',
        typeof viewClass === 'function' ? viewClass($route, activeComponent) : viewClass
      )
    },

    scopedRoutes() {
      const { viewRoutes, labelProp } = this
      return viewRoutes.map((route) => ({
        ...route,
        title: getRouteComponentTitle(route, labelProp),
      }))
    },

    activeName() {
      const { activePath } = this
      return this.getTabNameByRoute(activePath)
    },

    currentRouterState() {
      const { scopedRoutes, activeName } = this
      return { routes: [...scopedRoutes], active: activeName }
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler(route) {
        this.activePath = route.path
      },
    },

    activePath(path) {
      const { $router, $route } = this
      if ($router && !isSameRoute($route, path)) {
        $router.push(path)
      }
    },

    currentRouterState() {
      this.$emit('change', { ...this.currentRouterState })
    },
  },

  methods: {
    reload() {
      const { aliveView } = this.$refs
      if (aliveView) {
        aliveView.reload()
      }
    },

    // 移除缓存的路由视图
    removeCachedView(path) {
      const { viewRoutes, activeName } = this
      const pathName = this.getTabNameByRoute(path)
      let cursor = viewRoutes.findIndex((route) => isSameRoute(route, pathName))
      if (cursor === -1) {
        return
      }

      // 当前已经激活的视图
      const activeView = viewRoutes.find((route) => isSameRoute(route, activeName))
      const removedView = viewRoutes[cursor]

      // 清除已经删除的视图
      const { aliveView } = this.$refs
      if (aliveView) {
        aliveView.removeCachedView(pathName)
      } else {
        viewRoutes.splice(cursor, 1)
      }
      cursor--

      // 如果没有激活的视图（比如404页等），则返回
      // 如果激活的视图不是被删除的视图，也返回
      if (!activeView || activeView !== removedView) {
        return
      }

      // 删除完了，返回到根路由
      if (!viewRoutes.length) {
        this.pushRoute(this.root || '/')
        return
      }

      // 找到临近的下一个路由
      const nextView = viewRoutes[Math.min(Math.max(cursor, 0), viewRoutes.length - 1)]

      // 如果临近的下一个路由就是当前激活的路由，则不做处理
      if (activeView === nextView) {
        return
      }

      // 指向下一个临近的路由视图
      this.pushRoute(nextView.path)
    },

    // 清空缓存的路由组件视图
    clearCachedViews() {
      const { viewRoutes, $refs, root } = this
      const { aliveView } = $refs
      if (aliveView) {
        aliveView.clearCachedViews()
      } else {
        viewRoutes.length = 0
      }
      this.pushRoute(root || '/')
      this.$nextTick(() => {
        this.refreshViewKey = randomSequence(10)
      })
    },

    pushRoute(route) {
      const { $router } = this
      if ($router && route) {
        $router.push(route)
      }
    },

    getTabNameByRoute(route) {
      const { viewRoutes } = this
      const caseSensitive = isRouteCaseSensitive()
      const path = route !== null && typeof route === 'object' ? route.path : route
      for (const view of viewRoutes) {
        const name = view.path
        if (name === path) {
          return name
        }
        const reg = new RegExp(
          `^${escapeRegExp(trimPathTrailingSlash(name))}(?:/[^/]+?)*(?:/(?=$))?$`,
          caseSensitive ? '' : 'i'
        )
        if (reg.test(path)) {
          return name
        }
      }
      return ''
    },

    handleRouterLink(tab) {
      const { activeName } = this
      const { disabled, name } = tab
      if (!disabled && activeName !== name) {
        this.pushRoute(name)
      }
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

<style lang="less">
@import '../../theme/common.less';
.ice-tabs-view-content-wrapper {
  box-sizing: border-box;
  padding: @layout-tabs-view-content-padding;
}
</style>

<style lang="less" scoped>
@import '../../theme/common.less';

.ice-tabs-view {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &-bar {
    flex: none;
  }

  &-content {
    flex: 1 1 0;
    box-sizing: border-box;
    background-color: @layout-tabs-view-content-background-color;
  }

  .ice-border-top {
    border-top: 1px solid @layout-tabs-bar-border-color;
  }
}
</style>

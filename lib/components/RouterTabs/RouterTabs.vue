<template>
  <div class="ice-router-tabs">
    <div class="ice-router-tabs-bar">
      <slot name="tabs" :routes="scopedRoutes" :active="active">
        <tabs-bar
          :routes="routes"
          :label-prop="labelProp"
          v-model="active"
          v-bind="$attrs"
          v-on="$listeners"
          @tab-remove="handleTabRemove"
        />
      </slot>
    </div>

    <div class="ice-router-tabs-view">
      <alive-view
        ref="aliveView"
        :class="viewClassName"
        :routes="routes"
        :enable-alive="keepAlive"
        :transition="transition"
        @after-route-enter="handleRouterEnter"
        @after-route-leave="handleRouterLeave"
        v-model="active"
        v-bind="aliveProps"
      />
    </div>
  </div>
</template>

<script>
import AliveView from './AliveView'
import TabsBar from './TabsBar'
import { mergeClass, toCamelCaseProps } from '../../utils/vnode'
import { getDefaultRouteComponent, getRouteComponentTitle } from '../../utils/route'

export default {
  name: 'IceRouterTabs',
  inheritAttrs: false,
  components: { AliveView, TabsBar },

  props: {
    tabPaneClass: {
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

    transition: [Boolean, String],
  },

  data() {
    return {
      routes: [],
      active: '/',
    }
  },

  computed: {
    aliveProps() {
      const { $route, keepAliveProps, activeComponent } = this
      return toCamelCaseProps(
        typeof keepAliveProps === 'function'
          ? keepAliveProps($route, activeComponent)
          : keepAliveProps
      )
    },

    viewClassName() {
      const { tabPaneClass, $route, activeComponent } = this
      return mergeClass(
        typeof tabPaneClass === 'function'
          ? tabPaneClass($route, activeComponent)
          : tabPaneClass
      )
    },

    activeComponent() {
      return getDefaultRouteComponent(this.$route)
    },

    scopedRoutes() {
      const { routes, labelProp } = this
      return routes.map((route) => ({
        ...route,
        title: getRouteComponentTitle(route, labelProp),
      }))
    },

    currentRouterState() {
      const { scopedRoutes, active } = this
      return { routes: [...scopedRoutes], active }
    },
  },

  watch: {
    currentRouterState() {
      this.$emit('change', this.currentRouterState)
    },
  },

  methods: {
    handleTabRemove(path) {
      this.$refs.aliveView.removeRouteView(path)
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
.ice-router-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-bar {
    flex: none;
  }

  &-view {
    flex: 1 1 auto;
  }
}
</style>

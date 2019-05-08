<template>
  <div class="ice-router-tabs">
    <div class="ice-router-tabs-bar">
      <slot name="tabs" :routes="routes" :active="active">
        <tabs-bar
          :routes="routes"
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
import { getDefaultRouteComponent } from '../../utils/route'

export default {
  name: 'IceRouterTabs',
  inheritAttrs: false,
  components: { AliveView, TabsBar },

  props: {
    tabPaneClass: {
      type: [String, Object, Array, Function],
      default: '',
    },

    keepAliveProps: {
      type: [Object, Function],
      default: null,
    },

    transition: Boolean,
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
  },

  methods: {
    handleTabRemove(path) {
      this.$refs.aliveView.removeRouteView(path)
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

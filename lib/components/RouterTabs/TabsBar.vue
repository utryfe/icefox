<template>
  <element-tabs
    class="ice-element-tabs"
    tab-position="top"
    :type="type"
    :closable="closable"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <element-tab-pane
      class="ice-element-tabs-pane-hidden"
      v-for="route of routes"
      :key="route.path"
      :name="route.path"
      v-bind="getTabPaneProps(route)"
    >
      <tab-label
        class="ice-router-tabs-label"
        slot="label"
        :route="route"
        :prop="labelProp"
      />
    </element-tab-pane>
  </element-tabs>
</template>

<script>
import { TabPane, Tabs } from 'element-ui'
import TabLabel from './TabsLabel'
import { getDefaultRouteComponent } from '../../utils/route'
import { toCamelCaseProps } from '../../utils/vnode'

export default {
  name: 'TabsView',
  inheritAttrs: false,
  components: { ElementTabs: Tabs, ElementTabPane: TabPane, TabLabel },

  props: {
    routes: {
      type: Array,
      default: () => [],
    },

    closable: {
      type: Boolean,
      default: true,
    },

    type: {
      type: String,
      default: 'card',
    },

    labelProp: {
      type: [String, Function],
      default: 'title',
    },

    tabPaneProps: {
      type: [Object, Function],
      default: null,
    },
  },

  methods: {
    getTabPaneProps(route) {
      const { tabPaneProps } = this
      return toCamelCaseProps(
        typeof tabPaneProps === 'function'
          ? tabPaneProps(route, getDefaultRouteComponent(route))
          : tabPaneProps
      )
    },
  },
}
</script>

<style lang="less">
.ice-router-tabs > .ice-router-tabs-bar {
  & > .ice-element-tabs {
    .el-tabs__header {
      margin-bottom: 0;
    }

    &-label {
    }
  }
}
</style>

<style lang="less" scoped>
.ice-element-tabs {
  position: relative;
  z-index: 0;

  &-pane-hidden {
    display: none !important;
  }
}
</style>

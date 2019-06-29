<template>
  <element-tabs
    class="ice-element-tabs"
    tab-position="top"
    :type="tabType"
    :closable="closable && routes.length > minTabsCount"
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
        class="ice-tabs-view-label"
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
  name: 'TabsBar',
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

    fixedCloseButton: Boolean,

    labelProp: {
      type: [String, Function],
      default: 'title',
    },

    tabPaneProps: {
      type: [Object, Function],
      default: null,
    },

    minTabsCount: Number,
  },

  data() {
    const { fixedCloseButton } = this
    return {
      tabType: fixedCloseButton ? 'border-card' : 'card',
    }
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
@import '../../theme/common.less';

.ice-tabs-view > .ice-tabs-view-bar {
  & > .ice-element-tabs {
    box-shadow: none;
    border: 1px none @layout-tabs-bar-border-color;
    border-top-style: solid;

    & > .el-tabs__header {
      margin: 0;
      background-color: @layout-tabs-bar-background-color;

      .el-tabs__nav {
        border-radius: 0;
        border: 0;
      }

      .el-tabs__item {
        border: 1px solid transparent;
        margin-top: -1px;
        color: @layout-tabs-tab-item-color;

        & + .el-tabs__item {
          margin-left: -1px;
        }

        &:not(.is-disabled):hover {
          color: @layout-tabs-tab-item-hover-color;
        }

        &.is-active {
          color: @layout-tabs-tab-item-active-color;
          background-color: @layout-tabs-tab-item-active-background-color;
          border-right-color: @layout-tabs-bar-border-color;
          border-left-color: @layout-tabs-bar-border-color;
        }
      }
    }

    & > .el-tabs__content {
      display: none;
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

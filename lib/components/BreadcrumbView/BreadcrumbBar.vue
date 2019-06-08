<template>
  <element-breadcrumb class="ice-router-breadcrumb" v-bind="$attrs" v-on="$listeners">
    <transition-group :name="transitionName">
      <breadcrumb-item
        v-for="route in routeItems"
        :key="route.path"
        :to="route.linkTo"
        :replace="replace"
      >
        {{ route.title || '(N/A)' }}
      </breadcrumb-item>
    </transition-group>
  </element-breadcrumb>
</template>

<script>
import { Breadcrumb as ElementBreadcrumb, BreadcrumbItem } from 'element-ui'
import { isSameRoute } from '../../utils/route'

export default {
  name: 'BreadcrumbBar',
  inheritAttrs: false,
  components: { ElementBreadcrumb, BreadcrumbItem },

  props: {
    routes: {
      type: Array,
      default: () => [],
    },

    replace: Boolean,

    transition: {
      type: [Boolean, String],
      default: false,
    },
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
      return 'breadcrumb-transition'
    },

    routeItems() {
      const { routes, $route } = this
      return routes.map((route) => ({
        ...route,
        linkTo: isSameRoute($route, route) ? undefined : route,
      }))
    },
  },
}
</script>

<style lang="less">
@import '../../theme/var.less';

.ice-router-breadcrumb {
  line-height: 1.5;
  margin: 0;

  .el-breadcrumb__separator {
    font-weight: normal;
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.45);
  }

  .el-breadcrumb__inner {
    &.is-link {
      font-weight: normal;
      color: rgba(0, 0, 0, 0.45);
      cursor: pointer;

      &:hover {
        color: @layout-breadcrumb-item-hover-color;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/var.less';

.breadcrumb-transition {
  &-enter-active,
  &-leave-active,
  &-move {
    transition: opacity @layout-route-transition-duration,
      transform @layout-route-transition-duration;
  }

  &-enter,
  &-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  &-leave-active {
    position: absolute;
  }
}
</style>

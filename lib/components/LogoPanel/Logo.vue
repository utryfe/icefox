<template>
  <div :class="className" @click="onClick">
    <div class="content">
      <div class="logo">
        <slot name="logo">
          <img :src="src" :alt="title" :title="title" />
        </slot>
      </div>

      <transition
        enter-active-class="animated fadeInLeftLittle"
        leave-active-class="animated fadeOutLeftLittle"
        @before-enter="titleHidden = false"
        @after-leave="titleHidden = true"
      >
        <div class="title" v-show="showTitle">
          <slot name="title">{{ title }}</slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IceLogoPanel',
  props: {
    /**
     * 注意！该选项值只能为远程URL地址。
     */
    src: String,

    /**
     * logo标题，或系统名称。
     */
    title: String,

    /**
     * 点击时切换至指定的路由路径。默认切换至根路由。
     */
    route: {
      type: [Boolean, String, Object],
      default: '/',
    },
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  data() {
    return {
      transition: true,
      showTitle: true,
      titleHidden: false,
    }
  },

  computed: {
    className() {
      const { titleHidden, transition, route } = this
      return [
        'ice-logo-panel',
        {
          'ice-collapsed': titleHidden,
          'ice-transition-none': !transition,
          'ice-cursor-pointer': !!route,
        },
      ]
    },
  },

  created() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$on('aside-state-change', this.updateState)
    }
  },

  beforeDestroy() {
    const { $basicLayout } = this
    if ($basicLayout) {
      $basicLayout.$off('aside-state-change', this.updateState)
    }
  },

  methods: {
    updateState(state, component) {
      if (component === this.$parent) {
        const { collapsed, transition } = Object.assign({}, state)
        if (typeof collapsed === 'boolean') {
          this.showTitle = !collapsed
          this.transition = !!transition
        }
      }
    },

    onClick() {
      const { route, $router } = this
      const type = typeof route
      if (route && $router && (type === 'string' || type === 'object')) {
        $router.push(route)
      }
    },
  },
}
</script>

<style lang="less">
.ice-logo-panel {
  & > .content > .logo > img {
    min-width: 24px;
    max-height: 61.8%;
  }
}
</style>

<style lang="less" scoped>
@import '../../theme/common.less';

.ice-logo-panel {
  display: inline-block;
  vertical-align: middle;
  height: 100%;
  box-sizing: border-box;
  flex: none;
  order: -1;
  padding: 0 @logo-panel-padding;
}

.ice-cursor-pointer {
  cursor: pointer;
}

.content {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  box-sizing: border-box;
  height: 100%;
}

.logo,
.title {
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  flex: none;
}

.logo {
  margin-right: 12px;
}

.title {
  color: @logo-title-color;
  font-size: @logo-title-font-size;
  text-wrap: none;
  white-space: nowrap;
  word-break: keep-all;
}

.ice-collapsed {
  padding: 0;
  width: 100%;

  .logo {
    width: 100%;
    margin: 0;
    justify-content: center;
  }

  .title {
    overflow: visible;
    width: 0;
  }
}

.fadeInLeftLittle {
  animation-name: fadeInLeftLittle;
}

.fadeOutLeftLittle {
  animation-name: fadeOutLeftLittle;
}

.fadeInLeftLittle,
.fadeOutLeftLittle {
  animation-duration: @layout-collapse-transition-duration;
}

.ice-transition-none {
  .fadeInLeftLittle,
  .fadeOutLeftLittle {
    transition: none;
    animation: none;
  }
}

@keyframes fadeInLeftLittle {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutLeftLittle {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(-12px);
  }
}
</style>

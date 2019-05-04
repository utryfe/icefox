<template>
  <div
    :class="className"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    v-resize="updateSizes"
  >
    <split-pane
      ref="one"
      :style="paneOneStyles"
      :position="positionOne"
      :force-sizing="forceSizing"
    >
      <slot :name="positionOne" />
    </split-pane>

    <split-handle
      :horizontal="horizontal"
      :disabled="disabled"
      @mousedown.native.stop.prevent="onMouseDown"
      @dblclick.native.stop.prevent="onDblClick"
    />

    <split-pane ref="two" :position="positionTwo" :force-sizing="forceSizing">
      <slot :name="positionTwo" />
    </split-pane>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import resize from 'vue-resize-directive'
import SplitPane from './SplitPane'
import SplitHandle from './SplitHandle'

export default {
  name: 'IceSplitPanes',
  components: { SplitHandle, SplitPane },
  directives: { resize },

  props: {
    /**
     * 水平分割
     */
    horizontal: {
      type: Boolean,
      default: false,
    },

    /**
     * 禁止调节大小
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * 最小尺寸
     */
    minSize: {
      type: [String, Number],
      default: '20%',
    },

    /**
     * 最大尺寸
     */
    maxSize: {
      type: [String, Number],
      default: '80%',
    },

    /**
     * 初始尺寸
     */
    initialSize: {
      type: [String, Number],
      default: '50%',
    },

    /**
     * resize事件节流阈值
     */
    throttle: {
      type: Number,
      default: 0,
    },

    /**
     * 双击分割线时重置面板尺寸
     */
    dblClickReset: {
      type: Boolean,
      default: false,
    },

    /**
     * 是否强制同步设置内容元素大小
     */
    forceSizing: Boolean,
  },

  data() {
    return {
      dragging: false,
      hasMoved: false,
      sizes: [[0, 0], [0, 0]],
      currentSize: this.initialSize,
      handler: this.doResize,
    }
  },

  computed: {
    className() {
      const { horizontal, dragging } = this
      return [
        'split-panes',
        'splitter-container-item',
        `splitter-container-${horizontal ? 'horizontal' : 'vertical'}`,
        { 'splitter-dragging': dragging },
      ]
    },

    styleType() {
      return this.horizontal ? 'height' : 'width'
    },

    paneOneStyles() {
      const { currentSize, minSize, maxSize, styleType, dragging } = this
      const style = {
        [styleType]: currentSize,
      }
      if (minSize) {
        style[`min-${styleType}`] = minSize
      }
      if (maxSize) {
        style[`max-${styleType}`] = maxSize
      }
      if (dragging) {
        style['transition'] = 'none'
        style['animation'] = 'none'
      }
      return style
    },

    positionOne() {
      return this.horizontal ? 'top' : 'left'
    },

    positionTwo() {
      return this.horizontal ? 'bottom' : 'right'
    },

    isVertical() {
      return !this.horizontal
    },
  },

  watch: {
    sizes(curr) {
      this.$emit('resize', curr[0], curr[1])
    },

    initialSize(size) {
      this.currentSize = size
    },

    currentSize() {
      this.updateSizes()
    },

    throttle() {
      this.updateHandler()
    },
  },

  created() {
    this.updateHandler()
  },

  mounted() {
    this.updateSizes()
  },

  methods: {
    updateHandler() {
      const { throttle } = this
      this.handler =
        throttle <= 0
          ? this.doResize
          : debounce(this.doResize, throttle, {
              leading: true,
              trailing: true,
              maxWait: +throttle,
            })
    },

    updateSizes() {
      const { one: paneOne, two: paneTwo } = this.$refs
      const oneEl = paneOne.$el
      const twoEl = paneTwo.$el
      this.sizes = [
        [oneEl.clientWidth, oneEl.clientHeight],
        [twoEl.clientWidth, twoEl.clientHeight],
      ]
      if (this.forceSizing) {
        paneOne.$emit('resize')
        paneTwo.$emit('resize')
      }
    },

    onDblClick() {
      if (!this.hasMoved && this.dblClickReset) {
        this.currentSize = this.initialSize
      }
    },

    onMouseDown() {
      this.dragging = true
      this.hasMoved = false
    },

    onMouseUp() {
      this.dragging = false
    },

    onMouseMove(event) {
      this.handler(event)
    },

    doResize(event) {
      if (event.buttons === 0) {
        this.dragging = false
      }

      if (
        this.dragging &&
        event.currentTarget &&
        event.currentTarget instanceof HTMLElement
      ) {
        const target = event.currentTarget
        const rect = target.getBoundingClientRect()

        const [currentPage, targetOffset, offset] = this.isVertical
          ? [event.pageX, target.offsetWidth, window.pageXOffset + rect.left]
          : [event.pageY, target.offsetHeight, window.pageYOffset + rect.top]

        const diff = currentPage - offset
        this.currentSize = `${(diff / targetOffset) * 100}%`

        this.hasMoved = true
      }
    },
  },
}
</script>

<style lang="less" scoped>
.splitter-container {
  &-item {
    width: 100%;
    height: 100%;
    display: flex;
    border: none;
    padding: 0.1px 0 0 0;
    margin: -0.1px 0 0 0;

    &.splitter-dragging {
      * {
        user-select: none;
      }
    }
  }

  &-horizontal {
    flex-direction: column;
  }

  &-vertical {
    flex-direction: row;
  }
}
</style>

<template>
  <div ref="container" :class="className" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <split-pane
      :ref="reversed ? 'two' : 'one'"
      :style="reversed ? null : paneOneStyles"
      :position="positionOne"
      :reversed="reversed"
      :force-sizing="forceSizing"
      @size-change="changeSizes"
      @resizable-change="changeResizable"
    >
      <slot :name="positionOne" />
    </split-pane>

    <split-handle
      v-show="!preventResize"
      :horizontal="horizontal"
      :show-line="showSplitLine"
      :as-layout="asLayout"
      :use-default-cursor="!resizable"
      @mousedown.native.stop.prevent="onMouseDown"
      @dblclick.native.stop.prevent="onDblClick"
    />

    <split-pane
      :ref="reversed ? 'one' : 'two'"
      :style="reversed ? paneOneStyles : null"
      :position="positionTwo"
      :reversed="reversed"
      :force-sizing="forceSizing"
      @size-change="changeSizes"
      @resizable-change="changeResizable"
    >
      <slot :name="positionTwo" />
    </split-pane>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import SplitPane from './SplitPane'
import SplitHandle from './SplitHandle'
import {
  addAnimationEndListener,
  addAnimationStartListener,
  addResizeListener,
  addTransitionEndListener,
  addTransitionStartListener,
  removeAnimationEndListener,
  removeAnimationStartListener,
  removeResizeListener,
  removeTransitionEndListener,
  removeTransitionStartListener,
} from '../../utils/dom'

export default {
  name: 'IceSplitPanes',
  components: { SplitHandle, SplitPane },

  props: {
    /**
     * 水平分割
     */
    horizontal: {
      type: Boolean,
      default: false,
    },

    /**
     * 可调节大小的
     */
    resizable: {
      type: Boolean,
      default: true,
    },

    /**
     * 显示分割线
     */
    showSplitLine: {
      type: Boolean,
      default: true,
    },

    /**
     * 最小尺寸
     */
    minSize: {
      type: [String, Number],
      default: '',
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

    /**
     * 反转flex部分
     */
    reversed: Boolean,
  },

  data() {
    const { minSize, maxSize, initialSize } = this
    return {
      limitSize: {
        min: minSize === '' ? initialSize : minSize,
        max: maxSize,
      },
      asLayout: false,
      $updateSizeTimer: 0,
      $changeSizeTimer: 0,
      dragging: false,
      hasMoved: false,
      useTransition: true,
      preventResize: false,
      sizes: [[0, 0], [0, 0]],
      currentSize: initialSize,
      handler: this.doResize,
    }
  },

  inject: {
    $basicLayout: {
      from: '$basicLayout',
      default: null,
    },
  },

  computed: {
    className() {
      const { horizontal, dragging } = this
      return [
        'ice-split-panes',
        'ice-splitter-container-item',
        `ice-splitter-container-${horizontal ? 'horizontal' : 'vertical'}`,
        { 'ice-dragging': dragging },
      ]
    },

    styleType() {
      return this.horizontal ? 'height' : 'width'
    },

    paneOneStyles() {
      const {
        limitSize: { min, max },
        currentSize,
        styleType,
        dragging,
        useTransition,
      } = this
      const style = {
        [styleType]: currentSize,
      }
      if (min) {
        style[`min-${styleType}`] = min
      }
      if (max) {
        style[`max-${styleType}`] = max
      }
      if (dragging || !useTransition) {
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
      const { $basicLayout, paneOneStyles, styleType } = this
      const component = this.$refs.one
      this.$emit('resize', curr[0], curr[1], component)
      if ($basicLayout) {
        const styles = { ...paneOneStyles }
        if (/%$/.test(styles[styleType])) {
          styles[styleType] = this.getPercentCurrentSize()
        }
        $basicLayout.$emit('split-resize', styles, component)
      }
    },

    initialSize(size) {
      this.currentSize = size
    },

    minSize(size) {
      this.limitSize.min = size
    },

    maxSize(size) {
      this.limitSize.max = size
    },

    currentSize() {
      this.updateSizes()
    },

    throttle() {
      this.updateHandler()
    },

    dragging(val) {
      const { $basicLayout } = this
      const component = this.$refs.one
      const type = val ? 'start' : 'end'
      this.$emit(`resize-${type}`, component)
      if ($basicLayout) {
        $basicLayout.$emit(`split-resize-${type}`, component)
      }
    },
  },

  created() {
    this.updateHandler()
  },

  mounted() {
    this.updateSizes()

    const { one, container } = this.$refs
    const elem = one.$el
    addTransitionStartListener(elem, this.onTransitionStart)
    addTransitionEndListener(elem, this.onTransitionEnd)
    addAnimationStartListener(elem, this.onTransitionStart)
    addAnimationEndListener(elem, this.onTransitionEnd)
    addResizeListener(container, this.updateSizes)
  },

  beforeDestroy() {
    const { one, container } = this.$refs
    const elem = one.$el
    removeTransitionStartListener(elem, this.onTransitionStart)
    removeTransitionEndListener(elem, this.onTransitionEnd)
    removeAnimationStartListener(elem, this.onTransitionStart)
    removeAnimationEndListener(elem, this.onTransitionEnd)
    removeResizeListener(container, this.updateSizes)
    clearTimeout(this.$updateSizeTimer)
    clearTimeout(this.$changeSizeTimer)
  },

  methods: {
    getPercentCurrentSize() {
      const { sizes, horizontal } = this
      const index = horizontal ? 1 : 0
      const oneSize = sizes[0][index]
      return `${(oneSize * 100) / (oneSize + sizes[1][index])}%`
    },

    changeSizes(size, useTransition) {
      const { limitSize, currentSize } = this
      const { min, max } = limitSize
      const { minSize, maxSize, initialSize } = Object.assign({}, size)
      const changedSize = {
        min: minSize !== undefined ? minSize : min,
        max: maxSize !== undefined ? maxSize : max,
        currentSize: initialSize !== undefined ? initialSize : currentSize,
      }
      this.asLayout = true
      if (
        changedSize.min !== min ||
        changedSize.max !== max ||
        changedSize.currentSize !== currentSize
      ) {
        limitSize.min = changedSize.min
        limitSize.max = changedSize.max
        this.currentSize = changedSize.currentSize
        this.useTransition = !!useTransition
        if (!useTransition) {
          clearTimeout(this.$changeSizeTimer)
          this.$changeSizeTimer = setTimeout(() => {
            this.useTransition = true
            this.onTransitionEnd()
          }, 100)
        }
      }
    },

    changeResizable(resizable) {
      this.preventResize = !resizable
    },

    onTransitionStart() {
      clearTimeout(this.$updateSizeTimer)
    },

    onTransitionEnd(callback) {
      clearTimeout(this.$updateSizeTimer)
      this.$updateSizeTimer = setTimeout(() => {
        this.updateSizes()
        if (typeof callback === 'function') {
          callback()
        }
      }, 100)
    },

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
      const { sizes, $refs } = this
      const { one: paneOne, two: paneTwo } = $refs
      const oneEl = paneOne.$el
      const twoEl = paneTwo.$el
      const newSizes = [
        [oneEl.clientWidth, oneEl.clientHeight],
        [twoEl.clientWidth, twoEl.clientHeight],
      ]
      if (
        sizes[0][0] !== newSizes[0][0] ||
        sizes[0][1] !== newSizes[0][1] ||
        sizes[1][0] !== newSizes[1][0] ||
        sizes[1][1] !== newSizes[1][1]
      ) {
        this.sizes = newSizes
        if (this.forceSizing) {
          paneOne.$emit('resize')
          paneTwo.$emit('resize')
        }
      }
    },

    onDblClick() {
      if (!this.hasMoved && this.dblClickReset && this.resizable) {
        this.currentSize = this.initialSize
      }
    },

    onMouseDown() {
      if (this.resizable) {
        this.dragging = true
        this.hasMoved = false
      }
    },

    onMouseUp() {
      if (this.dragging) {
        this.dragging = false
        this.onTransitionEnd(() => {
          this.currentSize = this.getPercentCurrentSize()
        })
      }
    },

    onMouseMove(event) {
      if (this.dragging) {
        this.handler(event)
      }
    },

    doResize(event) {
      if (event.buttons === 0) {
        this.dragging = false
      }

      const { dragging, reversed } = this
      const target = event.currentTarget
      if (dragging && target && target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect()

        const [currentPage, targetOffset, offset] = this.isVertical
          ? [event.pageX, target.offsetWidth, window.pageXOffset + rect.left]
          : [event.pageY, target.offsetHeight, window.pageYOffset + rect.top]

        const diff = currentPage - offset
        const percent = (diff / targetOffset) * 100

        this.currentSize = `${reversed ? 100 - percent : percent}%`
        this.hasMoved = true
      }
    },
  },
}
</script>

<style lang="less" scoped>
.ice-splitter-container {
  &-item {
    width: 100%;
    height: 100%;
    display: flex;
    border: none;
    padding: 0.1px 0 0 0;
    margin: -0.1px 0 0 0;

    &.ice-dragging {
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

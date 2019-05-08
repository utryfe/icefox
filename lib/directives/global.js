import Vue from 'vue'
import resize from 'vue-resize-directive'

// resize指令，元素大小改变时自动触发回调
Vue.directive('resize', resize)

// Vue.directive('resize', {
//   bind() {},
//   inserted(el) {},
//   update() {},
//   componentUpdated() {},
//   unbind() {},
// })

import BasicLayout from './BasicLayout'
import Layout from './Layout'
import LayoutAside from './Aside'
import LayoutContent from './Content'
import LayoutHeader from './Header'
import LayoutFooter from './Footer'

BasicLayout.install = function(Vue) {
  Vue.component(BasicLayout.name, BasicLayout)
}

Layout.install = function(Vue) {
  Vue.component(Layout.name, Layout)
}

LayoutAside.install = function(Vue) {
  Vue.component(LayoutAside.name, LayoutAside)
}

LayoutContent.install = function(Vue) {
  Vue.component(LayoutContent.name, LayoutContent)
}

LayoutHeader.install = function(Vue) {
  Vue.component(LayoutHeader.name, LayoutHeader)
}

LayoutFooter.install = function(Vue) {
  Vue.component(LayoutFooter.name, LayoutFooter)
}

export { BasicLayout, Layout, LayoutAside, LayoutContent, LayoutHeader, LayoutFooter }

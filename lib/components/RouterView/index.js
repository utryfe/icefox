import IceRouterView from './RouterView'

IceRouterView.install = function(Vue) {
  Vue.component(IceRouterView.name, IceRouterView)
}

export default IceRouterView

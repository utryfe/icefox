import IceAsideMenu from './AsideMenu'
import IceMenu from './ElementMenu'

IceAsideMenu.install = function(Vue) {
  Vue.component(IceAsideMenu.name, IceAsideMenu)
}

IceMenu.install = function(Vue) {
  Vue.component(IceMenu.name, IceMenu)
}

export { IceMenu }
export default IceAsideMenu

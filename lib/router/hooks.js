/**
 * 根据导航的路由组件，自动设置文档的标题。
 * @param router 路由器。
 */
function setDocumentTitle(router) {
  router.afterEach((to) => {
    const components = router.getMatchedComponents(to)
    const component = components.pop()
    if (component) {
      const { title } = component
      if (typeof title === 'string') {
        document.title = title
      } else {
        document.title = component.$appTitle || ''
      }
    }
  })
}

/**
 * 添加后置导航守卫。
 * @param router
 */
export function afterEach(router) {
  setDocumentTitle(router)
}

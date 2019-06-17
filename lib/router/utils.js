/**
 * 组件集，用于标记已声明的组件
 */
const COMPONENT_SET = new Set()

/**
 * 重复命名计数
 */
const COMPONENT_NAME_COUNT = {}

/**
 * 用于保存用户声明的组件名称
 */
const DECLARE_NAME_STUB = '__$declaredName'

/**
 * 用于保存组件的路由路径
 */
const ROUTE_PATH_STUB = '__$routePath'

/**
 * 重定向跳板组件
 */
const REDIRECT_COMPONENT = {
  nocache: true,
  render: (h) => h(),
  created() {
    const { $router, $route } = this
    const { params, query } = $route
    const { path } = params
    $router.replace({ path: `/${path}`, query })
  },
}

/**
 * 判断当前模块是否是ES模块
 * @param obj
 * @returns {boolean}
 */
export function isESModule(obj) {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'
  return !!(obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module'))
}

/**
 * 判定传入对象是否是组件声明
 * @param component
 * @returns {boolean}
 */
function isComponentDeclaration(component) {
  return !(
    component === null ||
    typeof component !== 'object' ||
    Array.isArray(component)
  )
}

/**
 * 定义组件名称，并返回组件定义
 * @param component
 * @param path
 * @returns {null|*}
 */
function defineComponentWithName(component, path) {
  //  先检查是否是组件声明
  if (!isComponentDeclaration(component)) {
    return null
  }

  // 如果是ES模块，取default导出
  if (isESModule(component)) {
    component = component.default
    // 再次检查是否是组件声明
    if (!isComponentDeclaration(component)) {
      return null
    }
  }

  // 关联组件的路由路径
  delete component[ROUTE_PATH_STUB]
  Object.defineProperty(component, ROUTE_PATH_STUB, {
    value: path,
    configurable: true,
    enumerable: true,
  })

  // 如果已经处理过名称定义了，则无需再处理
  if (component.hasOwnProperty(DECLARE_NAME_STUB)) {
    return component
  }

  // 先获取用户声明的组件名称
  let declaredName = component['name']
  if (typeof declaredName !== 'string') {
    declaredName = 'AnonymousComponent'
  }

  // 定义已声明的名称
  Object.defineProperty(component, DECLARE_NAME_STUB, {
    value: declaredName,
    enumerable: true,
  })

  // 获取按序号递增的组件定义名称
  const count = COMPONENT_NAME_COUNT[declaredName] || 0
  const name = `${declaredName}${count ? `_${count}` : ''}`
  COMPONENT_NAME_COUNT[declaredName] = count + 1

  // 清理已声明的组件名称属性
  delete component['name']

  // 重新设置组件定义名称
  // 将组件名称属性设置为只读，避免被用户修改
  Object.defineProperty(component, 'name', {
    value: name,
    configurable: true,
    enumerable: true,
  })

  return component
}

/**
 * 定义异步组件名称，并返回组件定义
 * @param asyncLoader
 * @param path
 * @returns {function(): Promise<any | never>}
 */
function defineAsyncComponentWithName(asyncLoader, path) {
  // 重新返回一个异步组件加载器
  return function AsyncComponentLoader() {
    // 进行组件加载
    return Promise.resolve(asyncLoader()).then((asyncComp) => {
      // 检查异步加载的组件是否是有效的组件定义
      if (!isComponentDeclaration(asyncComp)) {
        return null
      }

      // 检查组件定义格式是否是配置了异步加载参数的格式
      const { component: componentLoader } = asyncComp
      if (componentLoader instanceof Promise) {
        // 配置了异步加载参数的组件定义
        asyncComp['component'] = componentLoader.then((component) =>
          defineComponentWithName(component, path)
        )
      } else {
        // 定义已加载的组件
        asyncComp = defineComponentWithName(asyncComp, path)
      }

      // 返回已定义的组件或组件异步加载定义
      return asyncComp
    })
  }
}

/**
 * 处理组件声明
 * @param component
 * @param path
 * @returns {null|(function(): Promise<any|never>)|*}
 */
function defineComponent(component, path) {
  // 先检查是否是有效的组件声明
  if (typeof component !== 'function' && !isComponentDeclaration(component)) {
    return null
  }

  // 已经处理过该组件了，则无需再处理
  if (COMPONENT_SET.has(component)) {
    return component
  }

  // 存储已处理过的组件声明
  COMPONENT_SET.add(component)

  if (typeof component === 'function') {
    // 组件声明为一个异步组件加载器
    component = defineAsyncComponentWithName(component, path)
  } else {
    // 处理普通组件声明
    component = defineComponentWithName(component, path)
  }

  // 返回组件声明或者组件异步加载器
  return component
}

/**
 * 获取路由路径
 * @param routes
 * @returns {*|string}
 */
function joinRoutePath(routes) {
  let path
  for (const route of routes) {
    let routePath = route.path
    if (typeof routePath !== 'string') {
      return
    }
    routePath = routePath.trim()
    if (routePath.startsWith('/')) {
      path = routePath
    } else {
      if (!path) {
        path = ''
      }
      path = `${path}${path.endsWith('/') ? '' : '/'}${routePath}`
    }
  }
  return path
}

/**
 * 获取组件实例对象已声明的名称
 * @param component 组件的实例对象
 * @returns {string}
 */
export function getComponentDeclaredName(component) {
  const $options = component ? component['$options'] : null
  let name
  if ($options) {
    name = $options[DECLARE_NAME_STUB] || $options['name']
  } else if (component && component.hasOwnProperty(DECLARE_NAME_STUB)) {
    name = component[DECLARE_NAME_STUB]
  }
  return typeof name === 'string' ? name : ''
}

/**
 * 获取路由组件的路由路径
 * @param component 组件的实例对象或组件声明对象
 * @returns {string}
 */
export function getComponentRoutePath(component) {
  const $options = component ? component['$options'] : null
  if ($options) {
    return $options[ROUTE_PATH_STUB]
  }
  if (component && component.hasOwnProperty(ROUTE_PATH_STUB)) {
    return component[ROUTE_PATH_STUB]
  }
}

/**
 * 检查路由配置，并确保路由组件名称的唯一性
 * @param routes 路由配置
 * @param stack 内部递归辅助参数
 * @returns {Array}
 */
export function ensureRoutes(routes, stack) {
  if (!Array.isArray(routes)) {
    return []
  }

  const routeList = []

  if (!Array.isArray(stack)) {
    stack = []
  }

  // 对路由配置进行组件名定义检查
  for (const route of routes) {
    // 先检查是否是有效的路由记录配置
    if (route === null || typeof route !== 'object' || Array.isArray(route)) {
      continue
    }

    stack.push(route)

    const { component, components, children } = route
    // 定义路由组件声明
    route['component'] = defineComponent(component, joinRoutePath(stack))

    if (
      components !== null &&
      typeof components === 'object' &&
      !Array.isArray(components)
    ) {
      // 定义命名路由组件声明
      for (const [name, comp] of Object.entries(components)) {
        components[name] = defineComponent(
          comp,
          name === 'default' ? joinRoutePath(stack) : undefined
        )
      }
    } else {
      // 清理无效的命名组件声明
      delete route['components']
    }

    // 递归处理子路由组件声明
    if (Array.isArray(children)) {
      route['children'] = ensureRoutes(children, stack)
    }

    stack.pop()

    // 添加至路由配置列表
    routeList.push(route)
  }

  // 添加重定向跳板路由
  const redirect = `${stack.length ? '302' : '/301'}/:path*`
  if (!routeList.some(({ path }) => path === redirect)) {
    routeList.unshift({
      component: REDIRECT_COMPONENT,
      path: redirect,
    })
  }

  return routeList
}

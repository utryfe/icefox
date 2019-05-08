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
 * @returns {null|*}
 */
function defineComponentWithName(component) {
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
 * @returns {function(): Promise<any | never>}
 */
function defineAsyncComponentWithName(asyncLoader) {
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
        asyncComp['component'] = componentLoader.then(defineComponentWithName)
      } else {
        // 定义已加载的组件
        asyncComp = defineComponentWithName(asyncComp)
      }

      // 返回已定义的组件或组件异步加载定义
      return asyncComp
    })
  }
}

/**
 * 处理组件声明
 * @param component
 * @returns {null|(function(): Promise<any|never>)|*}
 */
function defineComponent(component) {
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
    component = defineAsyncComponentWithName(component)
  } else {
    // 处理普通组件声明
    component = defineComponentWithName(component)
  }

  // 返回组件声明或者组件异步加载器
  return component
}

/**
 * 获取组件实例对象已声明的名称
 * @param component 组件的实例对象
 * @returns {string}
 */
export function getComponentDeclaredName(component) {
  const $options = component ? component['$options'] : null
  const name = $options ? $options[DECLARE_NAME_STUB] || $options['name'] : ''
  return typeof name === 'string' ? name : ''
}

/**
 * 检查路由配置，并确保路由组件名称的唯一性
 * @param routes 路由配置
 * @returns {Array}
 */
export function ensureRouteComponentName(routes) {
  if (!Array.isArray(routes)) {
    return []
  }

  const routeList = []

  // 对路由配置进行组件名定义检查
  for (const route of routes) {
    // 先检查是否是有效的路由记录配置
    if (route === null || typeof route !== 'object' || Array.isArray(route)) {
      continue
    }

    const { component, components, children } = route
    // 定义路由组件声明
    route['component'] = defineComponent(component)

    if (
      components !== null &&
      typeof components === 'object' &&
      !Array.isArray(components)
    ) {
      // 定义命名路由组件声明
      for (const [name, comp] of Object.entries(components)) {
        components[name] = defineComponent(comp)
      }
    } else {
      // 清理无效的命名组件声明
      delete route['components']
    }

    // 递归处理子路由组件声明
    if (Array.isArray(children)) {
      route['children'] = ensureRouteComponentName(children)
    }

    // 添加至路由配置列表
    routeList.push(route)
  }

  return routeList
}

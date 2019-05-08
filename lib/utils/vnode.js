/**
 * 合并 className
 * @param args
 * @returns {string}
 */
export function mergeClass(...args) {
  const classNames = []
  for (const clz of args) {
    if (typeof clz === 'string') {
      classNames.push(clz)
    } else if (Array.isArray(clz)) {
      classNames.push(...clz)
    } else if (clz !== null && typeof clz === 'object') {
      classNames.push(clz)
    }
  }
  return [
    ...classNames.reduce((classSet, clz) => {
      if (typeof clz === 'string') {
        for (const c of clz.split(/\s+/)) {
          classSet.add(c)
        }
      } else if (clz && typeof clz === 'object') {
        for (const [name, enabled] of Object.entries(clz)) {
          if (enabled) {
            classSet.add(name)
          }
        }
      }
      return classSet
    }, new Set()),
  ].join(' ')
}

/**
 * 合并事件监听器
 * @param args
 * @returns {object}
 */
export function mergeListener(...args) {
  return args.reduce((listeners, on) => {
    if (on !== null && typeof on === 'object' && !Array.isArray(on)) {
      for (const [event, handler] of Object.entries(on)) {
        if (typeof handler === 'function') {
          const register = listeners[event] || []
          register.push(handler)
          listeners[event] = register
        }
      }
    }
    return listeners
  }, {})
}

/**
 * 将对象的属性转换为驼峰命名格式
 * @param props
 * @returns {{}}
 */
export function toCamelCaseProps(props) {
  if (props !== null && typeof props === 'object') {
    return Object.keys(props).reduce((camelCaseProps, prop) => {
      camelCaseProps[prop.replace(/-([a-zA-Z])/g, ($0, $1) => $1.toUpperCase())] =
        props[prop]
      return camelCaseProps
    }, {})
  }
  return {}
}

/**
 * 格式化 VNode 子节点参数
 * @param node
 * @returns {string[]|string[][]}
 */
export function getVNodeChildren(node) {
  if (node === null) {
    node = ''
  } else if (typeof node === 'number') {
    node = `${node}`
  }
  if (typeof node === 'string') {
    node = [node]
  }
  if (!Array.isArray(node)) {
    node = [node]
  }
  return node
}

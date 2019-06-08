/**
 * 调试器的token。用于标识debug插件对象。
 * @type {number}
 */
export const debugToken = Math.floor(Math.random() * 10e10)

/**
 * 将传入的值转换为一个对象，并过滤掉一些不需要的属性值。
 * @param obj 待处理的对象。
 * @param exclude 需要过滤的属性列表。
 * @returns {object}
 */
export function toObject(obj, exclude) {
  const object = {}
  for (const [key, value] of Object.entries(Object.assign({}, obj))) {
    if (typeof value !== 'undefined' && (!exclude || !exclude.includes(key))) {
      object[key] = value
    }
  }
  return object
}

/**
 * 处理配置对象。
 * @param setup
 * @param exclude
 * @returns {object}
 */
export function formatSetup(setup, exclude) {
  return typeof setup === 'function' ? { created: setup } : toObject(setup, exclude)
}

/**
 * 正则表达式转义处理
 * @param str
 * @returns {string}
 */
export function escapeRegExp(str) {
  return `${str}`.replace(/[*.?+$^[\](){}|\\]/g, '\\$&')
}

/**
 * 将字符串首字母大写
 * @param str
 * @returns {string}
 */
export function capitalize(str) {
  return str.replace(/^(\S)/, ($0, $1) => $1.toUpperCase())
}

/**
 * 将字符串转化为连字符格式
 * @param str
 * @returns {string}
 */
export function kebabCase(str) {
  return `${str}`.replace(/-?([A-Z]+)/g, ($0, $1, index) =>
    (!index ? $1 : `-${$1}`).toLowerCase()
  )
}

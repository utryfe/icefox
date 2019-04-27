/**
 * 判断传入的值是否是一个DOM元素。
 * @param obj 待判定的对象。
 * @returns {boolean}
 */
export function isElement(obj) {
  return (
    obj !== null &&
    typeof obj == 'object' &&
    typeof obj.tagName === 'string' &&
    obj.nodeType === 1
  )
}

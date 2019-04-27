import { isElement } from './assert'

/**
 * 获取可使用的HTML元素。如果没有传入有效的元素，或传入的元素不存在，则会创建一个新的元素。
 * @param el 传入的元素或元素选择器。
 * @returns {HTMLElement}
 */
export function getAvailableElement(el) {
  if (typeof el === 'string') {
    el = el.trim()
    if (/^#[\w-]+$/.test(el)) {
      el = document.getElementById(el.substring(1))
    } else if (document.querySelector) {
      el = document.querySelector(el)
    }
  }

  let elem = isElement(el) ? el : document.getElementById('app')
  if (!elem) {
    elem = document.createElement('div')

    const body = document.body
    const nodes = body.childNodes
    let i = 0
    let node

    while ((node = nodes[i++])) {
      if (node.nodeType === 1) {
        body.insertBefore(elem, node)
        return elem
      }
    }
    body.appendChild(elem)
  }

  return elem
}

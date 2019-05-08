import { isElement } from './assert'
import { capitalize } from './mixed'

function getEventName(type, name) {
  const cName = capitalize(name)
  const whichEvent = (obj) => {
    const el = document.createElement('div')
    for (const t of Object.keys(obj)) {
      if (el.style[t] !== undefined) {
        return obj[t]
      }
    }
  }
  return whichEvent(
    type === 'transition'
      ? {
          transition: 'transition' + name,
          OTransition: 'oTransition' + cName,
          MozTransition: 'transition' + name,
          WebkitTransition: 'webkitTransition' + cName,
          MsTransition: 'msTransition' + cName,
        }
      : {
          animation: 'animation' + name,
          OAnimation: 'oAnimation' + cName,
          MozAnimation: 'animation' + name,
          WebkitAnimation: 'webkitAnimation' + cName,
          MsAnimation: 'msAnimation' + cName,
        }
  )
}

const TRANSITION_START = getEventName('transition', 'start')
const TRANSITION_END = getEventName('transition', 'end')
const ANIMATION_START = getEventName('animation', 'start')
const ANIMATION_END = getEventName('animation', 'end')

export function addAnimationStartListener(elem, listener) {
  elem.addEventListener(ANIMATION_START, listener, false)
}

export function addAnimationEndListener(elem, listener) {
  elem.addEventListener(ANIMATION_END, listener, false)
}

export function addTransitionStartListener(elem, listener) {
  elem.addEventListener(TRANSITION_START, listener, false)
}

export function addTransitionEndListener(elem, listener) {
  elem.addEventListener(TRANSITION_END, listener, false)
}

export function removeAnimationStartListener(elem, listener) {
  elem.removeEventListener(ANIMATION_START, listener, false)
}

export function removeAnimationEndListener(elem, listener) {
  elem.removeEventListener(ANIMATION_END, listener, false)
}

export function removeTransitionStartListener(elem, listener) {
  elem.removeEventListener(TRANSITION_START, listener, false)
}

export function removeTransitionEndListener(elem, listener) {
  elem.removeEventListener(TRANSITION_END, listener, false)
}

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

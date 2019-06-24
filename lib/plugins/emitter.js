import { debugToken } from '../utils/mixed'
const emitterToken = Math.floor(Math.random() * 10e10)

/**
 * 打印错误异常信息
 * @param error
 * @param component
 */
function catchError(error, component) {
  let debug = component ? component.$debug : null
  if (debug && debug.token !== debugToken) {
    debug = null
  }
  ;(debug || console)['error'](error instanceof Error ? error.message : error)
}

/**
 * 获取订阅事件名称
 * @param eventName
 * @returns {string}
 */
function getSubscribeEventName(eventName) {
  return `subscribe_${emitterToken}_${eventName}`
}

/**
 * 触发已订阅的事件
 * @param component
 * @param eventName
 * @param args
 */
function emitSubscribeEvent(component, eventName, ...args) {
  try {
    component.$emit(getSubscribeEventName(eventName), ...args)
  } catch (e) {
    catchError(e, component)
  }
}

/**
 * 创建组件的广播事件订阅器
 * @param component 组件实例对象
 * @returns {Function} 解除订阅的函数
 */
function createEventSubscriber(component) {
  return (eventName, handler) => {
    if (!component) {
      return () => {}
    }
    let error
    if (typeof eventName !== 'string' || !(eventName = eventName.trim())) {
      error = 'event name must be a valid String.'
    } else if (typeof handler !== 'function') {
      error = 'handler must be a valid Function.'
    }
    if (error) {
      catchError(error, component)
      return () => {}
    }

    // 订阅事件用特殊事件名称进行标记
    const subscribeName = getSubscribeEventName(eventName)
    component.$on(subscribeName, handler)

    // 返回解除订阅的函数
    return () => component.$off(subscribeName, handler)
  }
}

/**
 * 创建冒泡事件派发器（祖先组件触发事件）（含当前组件）
 * @param emitter
 * @param context
 * @returns {Function}
 */
function createEventDispatcher(emitter, context) {
  return (eventName, ...args) => {
    if (!context || typeof eventName !== 'string' || !(eventName = eventName.trim())) {
      return emitter
    }
    // 当前组件触发订阅事件
    emitSubscribeEvent(context, eventName, ...args)
    // 向上触发订阅事件
    let parent = context
    while ((parent = parent.$parent)) {
      emitSubscribeEvent(parent, eventName, ...args)
    }
    return emitter
  }
}

/**
 * 创建事件广播器（子组件树触发事件）（不包含当前组件）
 * @param emitter
 * @param context
 */
function createEventBroadcaster(emitter, context) {
  // 递归遍历子组件树
  const broadcast = (component, eventName, ...args) => {
    emitSubscribeEvent(component, eventName, ...args)
    for (const child of component.$children) {
      broadcast(child, eventName, ...args)
    }
  }
  // 返回广播器
  return (eventName, ...args) => {
    if (!context || typeof eventName !== 'string' || !(eventName = eventName.trim())) {
      return emitter
    }
    // 子组件树广播订阅事件
    for (const child of context.$children) {
      broadcast(child, eventName, ...args)
    }
    return emitter
  }
}

/**
 * 创建事件派发器
 * @param $emitter
 * @param context
 */
function createEventEmitter($emitter, context) {
  // 事件派发器
  const emitter = {}

  // 定义基础事件总线
  for (const method of ['emit', 'on', 'once', 'off']) {
    const handler = (eventName, ...args) => {
      if (typeof eventName === 'string' && (eventName = eventName.trim())) {
        try {
          $emitter[`$${method}`](eventName, ...args)
        } catch (e) {
          catchError(e, context)
        }
      }
      return emitter
    }
    Object.defineProperty(emitter, method, { value: handler })
    Object.defineProperty(emitter, `$${method}`, { value: handler })
  }

  // 定义组件内广播方法
  const subscribe = createEventSubscriber(context)
  const dispatch = createEventDispatcher(emitter, context)
  const broadcast = createEventBroadcaster(emitter, context)

  Object.defineProperties(emitter, {
    // 广播事件订阅处理器
    subscribe: { value: subscribe },
    $subscribe: { value: subscribe },
    // 向上广播（祖先组件）
    dispatch: { value: dispatch },
    $dispatch: { value: dispatch },
    // 向下广播（子组件树）
    broadcast: { value: broadcast },
    $broadcast: { value: broadcast },
  })

  return emitter
}

/**
 * 事件派发插件
 */
export default {
  name: 'emitter',
  install(Vue) {
    const stub = '$emitter'
    const $emitter = new Vue()

    // 安装事件派发器到原型
    Object.defineProperty(Vue.prototype, stub, {
      get() {
        // 创建绑定了当前组件上下文的事件派发器
        return createEventEmitter($emitter, this)
      },
    })

    // 静态安装，方便全局使用
    Object.defineProperty(Vue, stub, {
      // 该派发器没有绑定具体的组件实例作用域
      value: createEventEmitter($emitter),
    })
  },
}

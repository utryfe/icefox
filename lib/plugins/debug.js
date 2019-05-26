/* eslint-disable no-console */
import debug from 'debug/dist/debug'
import { debugToken } from '../utils/mixed'
import { getComponentDeclaredName } from '../router/name'

const defaultLevel = process.env.NODE_ENV === 'production' ? 'error' : '*'
const levels = ['debug', 'log', 'info', 'warn', 'error']
const prefix = 'vue'
const prevTimestamp = {}
const printer = debug('')

// 禁用时，暂存当前命名空间
let preservedNamespaces = ''
// 使用标签格式输出
let printWithLabel = true

// 不同的调试级别，用不同的颜色标记出来
const levelColor = {
  debug: '#35495e',
  log: '#35495e',
  info: '#357edd',
  warn: '#d5ad29',
  error: '#e01563',
}

// 内部使用的调试输出
const $manager = function(level, name, ...args) {
  printMessage($manager, level, name || 'DebugManager', ...args)
}

function printMessage(name, level, ...args) {
  const isManager = name === $manager
  const namespace = `${prefix}:${level}:${(name = isManager ? args.shift() : name)}`
  // 根据当前命名空间，确定是否要输出调试信息
  printer.enabled = isManager ? true : debug['enabled'](namespace)

  if (printer.enabled) {
    const useColors = printer['useColors']
    printer.prev = prevTimestamp[namespace] || Date.now()
    prevTimestamp[namespace] = Date.now()
    // 如果支持多彩，那就上点色吧
    if (level === 'error' || level === 'warn') {
      printer.color = levelColor[level]
    } else {
      printer.color = useColors ? debug['selectColor'](namespace) : ''
    }
    printer.namespace = useColors ? ` ${level} %c ${name}` : namespace

    if (typeof args[0] === 'string') {
      args[0] = ` ${args[0]}`
    } else {
      args.unshift(' %O')
    }

    const printLevel = level === 'error' ? 'error' : 'log'
    if (useColors && printWithLabel) {
      printer.log = (...args) => {
        // 加个box
        args[1] = `background: ${levelColor[level] ||
          '#35495e'}; padding: 1px; border-radius: 3px 0 0 3px; color: #fff`
        args[2] =
          'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff'
        args.splice(3, 0, `color: ${printer.color}`)
        console[printLevel].apply(printer, args)
      }
    } else {
      printer.log = console[printLevel]
    }

    printer(...args)
  }
}

function disableDebug() {
  if (!preservedNamespaces) {
    preservedNamespaces = getCurrentDebugNamespaces()
    debug['enable']('')
  }
  $manager('info', '', 'All debug output has been suspend.')
}

function enableDebug() {
  const namespaces = preservedNamespaces || getCurrentDebugNamespaces().join(',')
  preservedNamespaces = ''
  setCurrentDebugNamespaces(namespaces)
  setCurrentDebugLevel(getCurrentDebugLevel())
}

function setCurrentDebugNamespaces(namespaces) {
  const level = getCurrentDebugLevel()
  const split = (typeof namespaces === 'string' ? namespaces : '')
    .split(/[\s,]+/)
    .map((name) => name.trim().replace(/:/g, ''))
    .filter((name) => !!name)

  if (!split.length) {
    split.push('*')
  }
  debug['enable'](
    [...new Set(split)].map((name) => `${prefix}:${level}:${name}`).join(',')
  )
  preservedNamespaces = ''
  $manager('info', '', `Debug namespaces switched to '${split.join(', ')}'.`)
}

function getCurrentDebugNamespaces() {
  const namespaces = debug['load']() || ''
  const splitReg = /:([^:]+)$/
  const names = []
  for (const space of namespaces.split(',')) {
    const [, name] = splitReg.exec(space) || []
    if (name) {
      names.push(name)
    }
  }
  return names
}

function getCurrentDebugLevel() {
  try {
    const level = localStorage.getItem('debug_level')
    if (['*'].concat(levels).includes(level)) {
      return level
    }
  } catch (e) {
    $manager('error', '', e)
  }
  return defaultLevel
}

/**
 * 设置当前的调试级别。
 * @param level 调试级别。
 */
function setCurrentDebugLevel(level) {
  try {
    if (getCurrentDebugLevel() !== level) {
      if (['*'].concat(levels).includes(level)) {
        localStorage.setItem('debug_level', level)

        // 设置级别时，如果当前时禁用状态，我们则优先取已保存的命名空间
        const names = preservedNamespaces
          ? preservedNamespaces.split(',').filter((name) => !!name)
          : getCurrentDebugNamespaces()

        // 如果没有设定默认的调试命名空间，则启用所有的
        if (!names.length) {
          names.push('*')
        }

        // 重新设置调试命名空间
        debug['enable'](
          [...new Set(names)].map((name) => `${prefix}:${level}:${name}`).join(',')
        )

        // 重新启用调试空间，并清除已暂存的空间名
        preservedNamespaces = ''
      } else {
        $manager(
          'info',
          '',
          `Debug level should be equal to one of the allowed values:\n[ ${levels
            .concat(['*'])
            .join(', ')} ]`
        )
        return
      }
    }

    $manager('info', '', `Debug level switched to '${level}'.`)
  } catch (e) {
    $manager('error', '', e)
  }
}

function createNamedDebug(name, level) {
  const $debug = function(...args) {
    printMessage(name, level, ...args)
  }
  // 挂载的$debug可能被用户给修改掉
  // token是为了方便判定是不是$debug对象
  Object.defineProperty($debug, 'token', {
    value: debugToken,
  })
  return $debug
}

function getComponentDebug(name) {
  return levels.reduce(($debug, level) => {
    Object.defineProperty($debug, level, {
      value: createNamedDebug(name, level),
    })
    return $debug
  }, createNamedDebug(name, 'debug'))
}

function getComponentName(component) {
  return (
    getComponentDeclaredName(component).replace(/^\s+|[\s,:]|\s+$/g, '') ||
    'AnonymousComponent'
  )
}

function handleErrors(error, vm, info) {
  $manager('error', getComponentName(vm), `${error} ${info}`)
}

function handleWarnings(message, vm, trace) {
  $manager('warn', getComponentName(vm), `${message} ${trace}`)
}

function setDebugManager(name) {
  // 挂载到window上，方便切换命名空间和调试级别
  if (typeof window[name] === 'undefined') {
    window[name] = (namespaces, level) => {
      if (typeof level === 'string') {
        setCurrentDebugLevel(level)
      }
      if (typeof namespaces === 'string') {
        setCurrentDebugNamespaces(namespaces)
      }
    }

    Object.defineProperties(window[name], {
      enable: {
        value: enableDebug,
      },
      disable: {
        value: disableDebug,
      },
      setLevel: {
        value: setCurrentDebugLevel,
      },
      setNamespaces: {
        value: setCurrentDebugNamespaces,
      },
    })
  }
}

/**
 * 调试信息输出插件。
 */
export default {
  name: 'debug',
  install(Vue, config) {
    // 关闭Vue产品构建提示
    Vue.config.productionTip = false

    const stub = '$debug'
    Object.defineProperty(Vue.prototype, stub, {
      get() {
        // 调用debug时，立即返回一个与当前实例对象绑定的debug
        return getComponentDebug(getComponentName(this))
      },
    })

    Object.defineProperty(Vue, stub, {
      value: getComponentDebug('Vue'),
    })

    // 在全局对象上关联debug管理工具
    setDebugManager(stub)

    const { global, namespaces, useLabel } = Object.assign({}, config)
    if (typeof useLabel === 'boolean') {
      printWithLabel = useLabel
    }

    if (global !== false) {
      // Vue运行时的警告和错误信息，通过debug来输出
      // 后面也有可能会支持错误日志的服务端上报存储
      if (typeof Vue.config.warnHandler !== 'function') {
        Vue.config.warnHandler = handleWarnings
      }
      if (typeof Vue.config.errorHandler !== 'function') {
        Vue.config.errorHandler = handleErrors
      }
    }

    // 启用调试输出
    if (typeof namespaces === 'string') {
      // 设置当前配置的命名空间
      setCurrentDebugNamespaces(namespaces)
    } else {
      enableDebug()
    }
  },
}

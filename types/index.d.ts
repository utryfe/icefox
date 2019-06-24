import Vue from 'vue'
import VueRouter, { RouteRecord } from 'vue-router'
import { Store } from 'vuex'
import { AxiosStatic } from 'axios'
import * as IceFox from './ice-ui'

export * from './ice-ui'

interface DebugStatic {
  /**
   * 输出 debug 级别的调试日志
   */
  (...args: any[]): void

  /**
   * 输出 debug 级别的调试日志
   */
  debug(...args: any[]): void

  /**
   * 输出 log 级别的调试日志
   */
  log(...args: any[]): void

  /**
   * 输出 info 级别的调试日志
   */
  info(...args: any[]): void

  /**
   * 输出 warn 级别的调试日志
   */
  warn(...args: any[]): void

  /**
   * 输入 error 级别的调试日志
   */
  error(...args: any[]): void
}

interface EventEmitterPlugin {
  /**
   * 发布全局事件
   * @param eventName
   * @param args
   */
  $emit(eventName: string, ...args: any[]): EventEmitterPlugin
  emit(eventName: string, ...args: any[]): EventEmitterPlugin

  /**
   * 订阅全局事件
   * @param eventName
   * @param args
   */
  $on(eventName: string, ...args: any[]): EventEmitterPlugin
  on(eventName: string, ...args: any[]): EventEmitterPlugin

  /**
   * 订阅一次性全局事件
   * @param eventName
   * @param args
   */
  $once(eventName: string, ...args: any[]): EventEmitterPlugin
  once(eventName: string, ...args: any[]): EventEmitterPlugin

  /**
   * 取消全局事件订阅
   * @param eventName
   * @param args
   */
  $off(eventName: string, ...args: any[]): EventEmitterPlugin
  off(eventName: string, ...args: any[]): EventEmitterPlugin

  /**
   * 订阅广播事件并返回订阅解绑函数
   * @param eventName
   * @param handler
   */
  $subscribe(eventName: string, handler: Function): Function
  subscribe(eventName: string, handler: Function): Function

  /**
   * 发布冒泡广播事件（向父组件往上逐级触发，含当前组件）
   * @param eventName
   * @param args
   */
  $dispatch(eventName: string, ...args: any[]): EventEmitterPlugin
  dispatch(eventName: string, ...args: any[]): EventEmitterPlugin

  /**
   * 发布子组件树广播事件（递归子树组件触发，不包含当前组件）
   * @param eventName
   * @param args
   */
  $broadcast(eventName: string, ...args: any[]): EventEmitterPlugin
  broadcast(eventName: string, ...args: any[]): EventEmitterPlugin
}

declare module 'vue-router/types/router' {
  interface VueRouter {
    /**
     * 获取当前路由记录状态码
     * 若非 403、404、500 等，则返回 0，否则返回状态码
     * @param to
     */
    getRoutingStatus: (to: RouteRecord) => number
  }
}

interface AxiosPromise<T = any> {
  readonly data: Promise<T>
  readonly status: Promise<T>
  readonly statusText: Promise<T>
  readonly headers: Promise<T>
  readonly config: Promise<T>
  readonly request: Promise<T>
  readonly message: Promise<T>
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    /**
     * 路由组件的标题（document title、tabs label）
     */
    title?: string

    /**
     * 路由重定向声明
     */
    redirect?:
      | string
      | RouteRecord
      | ((to: RouteRecord, from: RouteRecord) => string | RouteRecord)

    /**
     * 不缓存该路由组件实例
     */
    nocache?: boolean
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 基于 axios 封装的http请求实例
     */
    readonly $http?: AxiosStatic

    /**
     * 可根据命名空间打印指定日志级别的调试日志输出工具
     */
    readonly $debug?: DebugStatic

    /**
     * 事件订阅发布管理器
     */
    readonly $emitter?: EventEmitterPlugin

    /**
     * 全局设置的应用标题
     */
    readonly $appTitle?: String

    /**
     * IceFox 组件插件包全局安装配置
     */
    readonly $ICEFOX?: IceFox.InstallationOptions
  }

  interface VueConstructor {
    /**
     * 路由器实例
     */
    readonly $router?: VueRouter

    /**
     * Store实例
     */
    readonly $store?: Store<object>

    /**
     * 基于 axios 封装的http请求实例
     */
    readonly $http?: AxiosStatic

    /**
     * 可根据命名空间打印指定日志级别的调试日志输出工具
     */
    readonly $debug?: DebugStatic

    /**
     * 事件订阅发布管理器
     */
    readonly $emitter?: EventEmitterPlugin
  }
}

export default IceFox

import Vue from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { AxiosStatic } from 'axios'
import * as IceFox from './ice-ui'
export * from './ice-ui'

interface DebugStatic {
  (...args: any[]): void
  debug(...args: any[]): void
  log(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $http?: AxiosStatic
    readonly $debug?: DebugStatic
    readonly $appTitle?: String
    readonly $ICEFOX?: IceFox.InstallationOptions
  }
  interface VueConstructor {
    readonly $router?: VueRouter
    readonly $store?: Store<object>
    readonly $http?: AxiosStatic
    readonly $debug?: DebugStatic
  }
}

export default IceFox

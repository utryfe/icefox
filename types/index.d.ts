import Vue from 'vue'
import { AxiosStatic } from 'axios'
import * as IceUI from './ice-ui'
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
    readonly $http: AxiosStatic
    readonly $debug: DebugStatic
    readonly $ICEFOX: IceUI.InstallationOptions
  }
  interface VueConstructor {
    readonly $http: AxiosStatic
    readonly $debug: DebugStatic
  }
}

export default IceUI

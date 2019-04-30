import { AxiosStatic } from 'axios'

interface DebugStatic {
  (...args: any[]): void
  debug(...args: any[]): void
  log(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
}

declare module 'vue/types/vue' {
  export interface Vue {
    readonly $http: AxiosStatic
    readonly $debug: DebugStatic
  }
  export interface VueConstructor {
    $http: AxiosStatic
  }
}

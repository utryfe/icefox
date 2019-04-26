import { AxiosInstance } from 'axios'

interface DebugInstance {
  (...args: any[]): void
  debug(...args: any[]): void
  log(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $http: AxiosInstance

    readonly $debug: DebugInstance
  }
}

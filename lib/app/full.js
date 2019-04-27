import { toObject } from '../utils/mixed'
import createStore from '../store'
import createRouter from '../router'
import createApp from './createApp'

export default function createAppFull(base, global, plugins) {
  const { store: baseStore, router: baseRouter, ...baseApp } = toObject(base)
  const { store: globalStore, router: globalRouter, ...globalApp } = toObject(global)

  const store = createStore(baseStore, globalStore, plugins)
  const router = createRouter(baseRouter, globalRouter)

  return createApp({ ...baseApp, store, router }, globalApp, plugins)
}

import Vue from 'vue'

/**
 * 检查全局设置。
 * @param setup
 */
export function checkGlobalSetup(setup) {
  const storeProps = ['state', 'mutations', 'actions', 'getters', 'modules']
  const declared = storeProps.filter((prop) => setup.hasOwnProperty(prop))
  if (declared.length) {
    setTimeout(
      () =>
        (Vue.$debug || console)['warn'](
          `The store properties defined in the main.js file will override the automatically generated properties.\n[${declared.join(
            '、'
          )}]`
        ),
      0
    )
  }
}

/**
 * 检查全局设置。
 * @param setup
 * @param excluded
 */
export function checkGlobalSetup(setup, excluded) {
  for (const prop of excluded) {
    if (setup.hasOwnProperty(prop)) {
      console['error'](
        `The store properties include of '${excluded.join(
          '、'
        )}' defined in the main.js file will not take effect.`
      )
      break
    }
  }
}

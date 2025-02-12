import { ASSETS_TYPE } from './const.js'
export function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach((type) => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        // 注册全局组件
        // 使用extend 方法将对象变成构造函数
        definition.name = definition.name || id
        definition = this.options._base.extend(definition)
      }
      this.options[type + 's'][id] = definition
    }
  })
}

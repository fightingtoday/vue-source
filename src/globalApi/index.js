import { initMixin } from './mixin.js'
import { initAssetRegisters } from './assets.js'
import { ASSETS_TYPE } from './const.js'
import { initExtend } from './extend.js'

export function initGlobalAPI(Vue) {
  Vue.options = {}
  ASSETS_TYPE.forEach(function (type) {
    Vue.options[type + 's'] = {}
  })
  Vue.options._base = Vue // _base是vue的构造函数
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}

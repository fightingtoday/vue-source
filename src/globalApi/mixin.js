import { mergeOptions } from '../utils/index'
export function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
}

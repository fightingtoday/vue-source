import { mergeOptions } from '../utils/index'

export function initExtend(Vue) {
  // 创建出一个子类拥有父类的方法
  let cid = 0
  Vue.extend = function (extendOptions) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options, extendOptions)
    return Sub
  }
}

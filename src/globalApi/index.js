import { mergeOptions } from '../utils/index'
export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
  Vue.mixin({
    a: 1,
    beforeCreate: function () {
      console.log('beforeCreate1')
    },
  })
  Vue.mixin({
    b: 2,
    beforeCreate: function () {
      console.log('beforeCreate2')
    },
  })
  console.log(33333, Vue.options)
}

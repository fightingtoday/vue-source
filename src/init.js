import { initState } from './state.js'
import { compileToRender } from './compiler/index.js'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options || {}
    // 初始化状态
    initState(vm)
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    vm.$el = document.querySelector(el)
    const render = options.render
    if (!render) {
      let template = vm.template
      if (!template && vm.$el) {
        template = vm.$el.outerHTML
        const render = compileToRender()
        options.render = render
      }
    } else {
    }
  }
}

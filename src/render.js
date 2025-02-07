import { createElement, createTextVNode } from './vdom/create-element.js'
export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    return createElement(...arguments)
  }
  Vue.prototype._v = function (text) {
    return createTextVNode(text)
  }
  Vue.prototype._s = function (val) {
    return val === null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val)
      : val
  }
  Vue.prototype._render = function () {
    // _c创建元素虚拟节点
    // _v 创建文本虚拟节点
    // _s 转义文本JSON.stringify

    const vm = this
    const render = vm.$options.render
    return render.call(this)
  }
}

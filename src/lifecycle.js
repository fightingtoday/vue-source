import Watcher from './observer/watcher'
import { patch } from './vdom/patch.js'
export function lifecycleMixin(Vue) {
  // 通过虚拟dom创建真实dom
  Vue.prototype._update = function (vnode) {
    // 通过虚拟节点创建真实dom
    const vm = this
    vm.$el = patch(vm.$el, vnode)
    console.log('vnode', vnode)
  }
}
export function mountComponent(vm, el) {
  const options = vm.$options
  callHook(vm, 'beforeMount')
  // 渲染页面
  // 无论渲染还是更新都会调用此方法
  let updateComponent = () => {
    vm._update(vm._render())
  }
  // 渲染watcher 每个组件都有一个watcher
  new Watcher(vm, updateComponent, () => {}, true) // true表示他是一个渲染watcher
  callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    // 找到对应的钩子依次执行
    for (let i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(vm)
    }
  }
}

import Watcher from './observer/watcher'
export function lifecycleMixin(Vue) {
  // 通过虚拟dom创建真实dom
  Vue.prototype._update = function (el) {}
}
export function mountComponent(vm, el) {
  const options = vm.$options

  // 渲染页面
  // 无论渲染还是更新都会调用此方法
  let updateComponent = () => {
    // 返回的是虚拟dom
    vm._update(vm._render())
  }
  // 渲染watcher 每个组件都有一个watcher
  new Watcher(vm, updateComponent, () => {}, true) // true表示他是一个渲染watcher
}

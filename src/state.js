import { observer } from './observer/index';
export function initState(vm) {
  // vue 的props、methods、data、computed、watch、等的初始化
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethod(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}
function initProps(vm) {}
function initMethod(vm) {}
function initData(vm) {
  console.log('初始化数据', vm)
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 对象劫持
  // Object.defineProperty,给书香增加get、set 方法
  observer(data) // 响应式原理
}
function initComputed(vm) {}
function initWatch(vm) {}

import { pushTarget, popTarget } from './dep.js'
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.options = options
    this.get()
  }
  get() {
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update() {
    this.getter()
  }
}
export default Watcher

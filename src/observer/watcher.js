class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    this.getter = expOrFn
    this.cb = cb
    this.options = options
    this.get()
  }
  get() {
    this.getter()
  }
}
export default Watcher

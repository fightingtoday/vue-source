import { pushTarget, popTarget } from './dep.js'
let id = 0
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm
    this.id = id++
    this.getter = expOrFn
    this.depsId = new Set()
    this.deps = []
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
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSubs(this)
    }
  }
}
export default Watcher

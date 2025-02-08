let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSubs(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
let stack = []
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget() {
  stack.pop()
  Dep.target = stack.length && stack[stack.length - 1]
}

export default Dep

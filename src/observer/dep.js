let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target)
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

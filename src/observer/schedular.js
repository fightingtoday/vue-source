let queue = []
let has = {}
import { nextTick } from '../utils/next-tick'
function flush() {
  queue.forEach((watcher) => {
    watcher.run()
  })
  queue = []
  has = {}
}
export function queueWatcher(watcher) {
  let id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
  }
  nextTick(flush)
}

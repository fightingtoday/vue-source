let callbacks = []
let loading = false
function flushCallback() {
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]()
  }
  loading = false
  callbacks = []
}
export function nextTick(cb) {
  callbacks.push(cb)
  if (!loading) {
    loading = true
    setTimeout(flushCallback, 0)
  }
}

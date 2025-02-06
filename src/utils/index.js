export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false, // 不可遍历
    configurable: false,
    value: value,
  })
}
// 取值时实现代理效果
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key]
    },
    set(newValue) {
      target[sourceKey][key] = newValue
    },
  })
}

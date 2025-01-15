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

// Object.defineProperty 不能兼容IE8以下
import { isObject } from '../utils/index'

class Observer {
  constructor(value) {
    this.walk(value)
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}
function defineReactive(data, key, value) {
  observer(value) // 递归实现深度检测
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observer(newValue) // 新值也是对象的时候需要再次监测
      if (value !== newValue) {
        value = newValue
      }
    },
  })
}
export function observer(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}

// Object.defineProperty 不能兼容IE8以下
import { isObject, def } from '../utils/index'
import { arrayMethods } from './array.js'
class Observer {
  constructor(value) {
    value.__ob__ = this
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 数组不会对索引进行监控，性能差，前端开发中通过索引去操作也很少，一般用的push、 pop等方法
      // 重写数组方法
      value.__proto__ = arrayMethods
      // 对数组的对象去监控
      this.observerArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
  observerArray(data) {
    data.forEach((item) => {
      observer(item)
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

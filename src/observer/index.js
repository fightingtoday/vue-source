// Object.defineProperty 不能兼容IE8以下
import { isObject, def } from '../utils/index'
import { arrayMethods } from './array.js'
import Dep from './dep.js'

class Observer {
  constructor(value) {
    value.__ob__ = this
    this.dep = new Dep()
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
  let dep = new Dep()
  // 这里的value有可能是对象，也可能是数组， 返回的结果是observer的实例
  let childOb = observer(value) // 递归实现深度检测
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend() // 收集依赖
        if (childOb) {
          // 数组的依赖手机
          childOb.dep.depend() // 收集依赖

          // 数组中还有数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) {
      observer(newValue) // 新值也是对象的时候需要再次监测
      if (value !== newValue) {
        value = newValue
      }
      dep.notify() // 通知所有依赖更新
    },
  })
}
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i] //数组中的数组依赖收集
    current._ob_ && current._ob_.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}
export function observer(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}

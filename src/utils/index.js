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
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]
let strats = {}
function mergeHook(parent, child) {
  if (child) {
    if (parent) {
      return parent.concat(child)
    } else {
      return [child]
    }
  } else {
    return parent
  }
}
LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})
function mergeAssets(parentVal, childVal) {
  let res = Object.create(parentVal) // res.__proto__ = parentVal  把全局组件放到原型链上，自己的components上找不到去原型链上找
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}
strats.components = mergeAssets

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // 默认的合并策略，但是有些属性有特殊的合并方式（生命周期等）
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
      return
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key],
      }
    } else if (!child[key]) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }
  return options
}

export function isReservedTag(tagName) {
  let str = 'div,p,span,i,section,img,a,input,button,ul,li'
  let arr = str.split(',')
  let obj = {}
  arr.forEach((name) => {
    obj[name] = true
  })
  return obj[tagName] || false
}

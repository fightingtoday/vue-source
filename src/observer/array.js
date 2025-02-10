// 重写数组的方法 push、pop、shift、unshift、sort、splice、reverse(这些方法回改变原数组所以需要重写)，slice这个方法不会改变原数组所以不需要重写
let oldArrayMethods = Array.prototype
export const arrayMethods = Object.create(oldArrayMethods)

const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse']
methods.forEach(function (method) {
  arrayMethods[method] = function (...args) {
    // console.log('用户操作了', method)
    const result = oldArrayMethods[method].apply(this, args) // 这里得把args传过去才行
    // push unshift方法插入的值可能是对象需要观测
    let insert
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        insert = args
        break
      case 'splice':
        insert = args.slice(2)
      default:
        break
    }
    if (insert) {
      ob.observerArray(insert)
    }
    ob.dep.notify()
    return result
  }
})

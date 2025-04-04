import { isObject, isReservedTag } from '../utils/index'
export function createElement(vm, tag, data = {}, ...children) {
  let key = data && data.key
  if (key) {
    delete data.key
  }
  if (isReservedTag(tag)) {
    // 原始标签的处理 div span ...
    return vnode(tag, data, key, children, undefined)
  } else {
    // 组件的处理
    let Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, key, children, Ctor)
  }
}
function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hooks = {
    init(vnode) {
      // 当前组件的实例就是componentInstance
      let child = new Ctor({ _isComponent: true })
      vnode.componentInstance = child
      // 组件的挂载
      child.$mount()
    },
  }

  return vnode(
    `vue-component${Ctor.cid}-${tag}`,
    data,
    key,
    undefined,
    undefined,
    {
      Ctor,
      children,
    }
  )
}
export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  }
}

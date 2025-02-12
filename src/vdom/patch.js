export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 这里是组件的挂载
    let el = createElm(vnode)
    return el
  } else {
    // 1、判断是更新还是渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
      const oldElm = oldVnode // div app
      const parentElm = oldVnode.parentNode // body
      let el = createElm(vnode)
      parentElm.insertBefore(el, oldElm.nextSibling) // ��入到dom中
      parentElm.removeChild(oldElm)
      return el
    }
  }
}
function createComponent(vnode) {
  // 判断是不是组件
  let i = vnode.data
  if ((i = i.hooks) && (i = i.init)) {
    i(vnode)
  }
  if (vnode.componentInstance) {
    return true
  }
}
// 根据虚拟节点创建真实节点
export function createElm(vnode) {
  const { tag, data, children, key, text } = vnode
  if (typeof tag === 'string') {
    // 有可能是组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
function updateProperties(vnode) {
  let data = vnode.data
  let el = vnode.el
  for (let key in data) {
    if (key === 'style') {
      for (let styleName in data.style) {
        el.style[styleName] = data.style[styleName]
      }
    } else if (key === 'class') {
      el.className = data.class
    } else {
      el.setAttribute(key, data[key])
    }
  }
}

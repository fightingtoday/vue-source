export function patch(oldVnode, vnode) {
  console.log(oldVnode, vnode)
  // 1、判断是更新还是渲染
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode // div app
    const parentElm = oldVnode.parentNode // body
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling) // ��入到dom中
    parentElm.removeChild(oldElm)
  }
}
// 根据虚拟节点创建真实节点
export function createElm(vnode) {
  const { tag, data, children, key, text } = vnode
  if (typeof tag === 'string') {
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

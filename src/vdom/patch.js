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
    } else {
      // dom diff 平级比对，应为正常业务很少父变子，子变父亲
      if (oldVnode.tag !== vnode.tag) {
        // 1、标签不一致直接替换
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }
      // 2、如果文本呢？文本都没有tag
      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }
      // 3、标签一致而且不是文本（比对属性是否一致）
      let el = (vnode.el = oldVnode.el)
      updateProperties(vnode, oldVnode.data)

      // 比对子节点
      let oldChildren = oldVnode.children || []
      let newChildren = vnode.children || []
      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 新老都有子节点，需要比对子节点
        updateChildren(el, oldChildren, newChildren)
      } else if (newChildren.length > 0) {
        // 新的有子节点，老的没有
        for (let i = 0; i < newChildren.length; i++) {
          let child = newChildren[i]
          el.appendChild(createElm(child))
        }
      } else if (oldChildren.length > 0) {
        // 老的有子节点，新的没有
        el.innerHTML = ''
      }
    }
  }
}
function updateChildren(el, oldChildren, newChildren) {
  
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
function updateProperties(vnode, oldProps = {}) {
  let data = vnode.data || {}
  let el = vnode.el
  // 如果老的属性中有新的属性中没有则删掉
  for (let key in oldProps) {
    if (!data[key]) {
      el.removeAttribute(key)
    }
  }
  // style 比对
  let newStyle = data.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
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

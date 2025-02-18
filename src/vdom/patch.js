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
function isSameVnode(oVnode, nVnode, index) {
  return oVnode.tag === nVnode.tag && oVnode.key === nVnode.key
}

function updateChildren(parent, oldChildren, newChildren) {
  // vue 采用的是双指针
  let oldStartIdx = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIdx = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIdx]

  let newStartIdx = 0
  let newStartVnode = newChildren[0]
  let newEndIdx = newChildren.length - 1
  let newEndVnode = newChildren[newEndIdx]

  const makeIndexByKey = (children) => {
    let map = {}
    children.forEach((child, index) => {
      if (child.key) {
        map[child.key] = index // 根据key创建一个映射表
      }
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIdx]
    }
    if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIdx]
    }
    // 优化向后插入的情况
    if (isSameVnode(oldStartVnode, newStartVnode, 1)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIdx]
      newStartVnode = newChildren[++newStartIdx]
    }
    // 优化向前插入的情况
    else if (isSameVnode(oldEndVnode, newEndVnode, 2)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIdx]
      newEndVnode = newChildren[--newEndIdx]
    }
    // 头移尾 A B C D 变成   B C D A
    else if (isSameVnode(oldStartVnode, newEndVnode, 3)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIdx]
      newEndVnode = newChildren[--newEndIdx]
    }
    // 尾移头 A B C D 变成   D A B C
    else if (isSameVnode(oldEndVnode, newStartVnode, 4)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else {
      // A B C 变成 Q A F C N
      // 暴力比对 乱序
      // 先根据老节点的key 做一个映射表拿新的虚拟节点去映射表里找。如果可以查到就进行移动操作，找不到直接插入元素即可
      let moveIndex = map[newStartVnode.key]
      if (!moveIndex) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined // 占位防止塌陷
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, newStartVnode)
      }
      newStartVnode = newChildren[++newStartIdx]
    }
  }
  if (newStartIdx <= newEndIdx) {
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      // 将新增元素直接插入（可能是向后插入或向前插入）
      let el = !newChildren[newEndIdx + 1]
        ? null
        : newChildren[newEndIdx + 1].el
      parent.insertBefore(createElm(newChildren[i]), el)
    }
  }
  if (oldStartIdx <= oldEndIdx) {
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      // 删除多余的老节点
      let child = oldChildren[i]
      if (child) {
        parent.removeChild(child.el)
      }
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

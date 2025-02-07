export function createElement(tag, data, ...children) {
  let key = data && data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)
}
export function createTextVNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  }
}

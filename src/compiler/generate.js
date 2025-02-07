const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}}
function genProps(attrs) {
  // 处理属性 拼接成属性字符串
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        obj[key] = value.trim()
      })
      attr.value = obj
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
function genChildren(el) {
  let children = el.children
  if (children && children.length > 0) {
    return `${children.map((c) => gen(c)).join(',')}`
  } else {
    return false
  }
}
function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    let text = node.text
    let token = []
    let match, index
    let lastIndex = 0
    defaultTagRE.lastIndex = 0
    while ((match = defaultTagRE.exec(text))) {
      let index = match.index
      if (index > lastIndex) {
        token.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      let value = match[1].trim()
      token.push(`_s(${value})`)
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      token.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${token.join('+')})`
  }
}
export function generate(el) {
  let children = genChildren(el)
  let code = `_c("${el.tag}", ${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  }${children ? `,${children}` : ''})`
  return code
}

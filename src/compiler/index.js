import { parseHtml } from './parse-html'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}}

export function compileToRender(template) {
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
  function generate(el) {
    let children = genChildren(el)
    let code = `_c("${el.tag}", ${
      el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${children ? `,${children}` : ''})`
    return code
  }
  // 解析html字符串，将html字符串变成ast语法树
  let root = parseHtml(template)
  // console.log('root', root)
  // 将ast 语法树转成js语法
  // _c("div", {class: "app testcss tttccc",style: {"color":"red"," font-size":"16px"}},_c("p", undefined,_v()),_c("span", undefined,_v("hello"+_s(message))))
  let code = generate(root)
  // console.log(code)
  // 所有模版引擎的实现 都需要new Function + with with可改变当前取值的作用域
  let renderFn = new Function(`with(this){return ${code}}`)
  // vue 的render 返回的事虚拟dom
  // console.log('renderFn', renderFn)
  return renderFn
}

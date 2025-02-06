import { parseHtml } from './parse-html'
export function compileToRender(template) {
  function genProps(attrs) { // 处理属性 拼接成属性字符串
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
  function generate(el) {
    let code = `_c("${el.tag}", ${
      el.attrs.length ? genProps(el.attrs) : 'undefined'
    })`
    return code
  }
  // 解析html字符串，将html字符串变成ast语法树
  let root = parseHtml(template)
  console.log('root', root)
  let code = generate(root)
  console.log(code)
  return function render() {}
}

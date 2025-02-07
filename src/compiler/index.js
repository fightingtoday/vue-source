import { parseHtml } from './parse-html'
import { generate } from './generate'

export function compileToRender(template) {
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

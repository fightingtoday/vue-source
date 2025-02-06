import { parseHtml } from './parse-html'
export function compileToRender(template) {
  // 解析html字符串，将html字符串变成ast语法树
  let root = parseHtml(template)
  console.log('root', root)
  return function render() {}
}

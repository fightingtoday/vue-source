export const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

// Regular Expressions for parsing tags and attributes
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则，捕获的内容是标签名
const startTagClose = /^\s*(\/?)>/ // 捕获的内容是结尾标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}}
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/

let root = null //ast语法树树根
let currentParent = null // 当前父节点
let stack = [] // 栈存放dom 标签结构，判断标签是否正确闭合
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    type: ELEMENT_TYPE,
    tag: tagName,
    attrs: attrs,
    children: [],
    parent: null,
  }
}
function start(tagName, attrs) {
  console.log('开始标签：', tagName, '属性是：', attrs)
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element
  stack.push(element) // 标签入栈
}
function chars(text) {
  console.log('文本是：', text)
  text = text.replace(/\s/g, '')
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE,
    })
  }
}
function end(tagName) {
  console.log('结束标签：', tagName)
  let element = stack.pop()
  currentParent = stack.length > 0 ? stack[stack.length - 1] : null
  if (currentParent) {
    element.parent = currentParent
    currentParent.children.push(element) //实现了树的父子关系
  }
}
export function parseHtml(html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      let endTagMatch = html.match(endTag)
      console.log('endTagMatch', endTagMatch)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length) // 去掉属性
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
      }
      if (end) {
        // 去掉开始标签的 >
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}

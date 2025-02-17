import { initMixin } from './init.js'
import { renderMixin } from './render.js'
import { lifecycleMixin } from './lifecycle.js'
import { initGlobalAPI } from './globalApi/index.js'
import { compileToRender } from './compiler/index.js'
import { patch, createElm } from './vdom/patch.js'

function Vue(options) {
  this._init(options)
}
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
initGlobalAPI(Vue)

// demo 产生两个虚拟节点进行比对
const vm1 = new Vue({
  data: { name: 'test' },
})
let render1 = compileToRender(
  `<div class="vm1" id="app" style="background:red">Hello World!{{name}}</div>`
)
let vnode = render1.call(vm1)
let el = createElm(vnode)
document.body.appendChild(el)

const vm2 = new Vue({
  data: { test: 'zzzzzz' },
})
let render2 = compileToRender(
  `<div class="vm2 pClass" style="color:blue">Hello World1!{{test}}</div>`
)
let newvnode = render2.call(vm2)
setTimeout(() => {
  patch(vnode, newvnode)
}, 1000)
export default Vue

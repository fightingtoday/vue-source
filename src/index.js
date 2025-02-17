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
  `<div class="vm1" id="app" >
  <div style="background:red" key="A">A</div>
  <div style="background:yellow" key="B">B</div>
  <div style="background:blue" key="C">C</div>
  <div style="background:green" key="D">D</div>
  </div>`
)
let vnode = render1.call(vm1)
let el = createElm(vnode)
document.body.appendChild(el)

const vm2 = new Vue({
  data: { test: 'zzzzzz' },
})
let render2 = compileToRender(
  `<div class="vm2 pClass" >
    <div style="background:green" key="D">D</div>

       <div style="background:red" key="A">A</div>

  <div style="background:yellow" key="B">B</div>
  <div style="background:blue" key="C">C</div>


  </div>`
)
let newvnode = render2.call(vm2)
setTimeout(() => {
  patch(vnode, newvnode)
}, 1000)
export default Vue

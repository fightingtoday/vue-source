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
export default Vue

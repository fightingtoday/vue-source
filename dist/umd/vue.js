(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  // Object.defineProperty 不能兼容IE8以下
  function observer(data) {
    console.log('observer', data);
  }

  function initState(vm) {
    // vue 的props、methods、data、computed、watch、等的初始化
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) ;
    if (opts.watch) ;
  }
  function initData(vm) {
    console.log('初始化数据', vm);
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 对象劫持
    console.log(data);
    // Object.defineProperty,给书香增加get、set 方法
    observer(data); // 响应式原理
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options || {};
      // 初始化状态
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

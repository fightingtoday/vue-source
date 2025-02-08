(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = true,
        o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = true, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (undefined !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : undefined;
    }
  }

  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      // 不可遍历
      configurable: false,
      value: value
    });
  }
  // 取值时实现代理效果
  function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[sourceKey][key];
      },
      set: function set(newValue) {
        target[sourceKey][key] = newValue;
      }
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};
  function mergeHook(parent, child) {
    if (child) {
      if (parent) {
        return parent.concat(child);
      } else {
        return [child];
      }
    } else {
      return parent;
    }
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {};
    for (var key in parent) {
      mergeField(key);
    }
    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    // 默认的合并策略，但是有些属性有特殊的合并方式（生命周期等）
    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
        return;
      }
      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] === null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }
    return options;
  }

  // 重写数组的方法 push、pop、shift、unshift、sort、splice、reverse(这些方法回改变原数组所以需要重写)，slice这个方法不会改变原数组所以不需要重写
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // console.log('用户操作了', method)
      var result = oldArrayMethods[method].apply(this, args); // 这里得把args传过去才行
      // push unshift方法插入的值可能是对象需要观测
      var insert;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          insert = args;
          break;
        case 'splice':
          insert = args.slice(2);
      }
      if (insert) {
        ob.observerArray(insert);
      }
      return result;
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }
    return _createClass(Dep, [{
      key: "addSubs",
      value: function addSubs(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (sub) {
          sub.update();
        });
      }
    }]);
  }();
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack.length && stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      value.__ob__ = this;
      def(value, '__ob__', this);
      if (Array.isArray(value)) {
        // 数组不会对索引进行监控，性能差，前端开发中通过索引去操作也很少，一般用的push、 pop等方法
        // 重写数组方法
        value.__proto__ = arrayMethods;
        // 对数组的对象去监控
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }
    return _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        data.forEach(function (item) {
          observer(item);
        });
      }
    }]);
  }();
  function defineReactive(data, key, value) {
    var dep = new Dep();
    observer(value); // 递归实现深度检测
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend(); // 收集依赖
          console.log('dep-subs', dep.subs);
        }
        return value;
      },
      set: function set(newValue) {
        observer(newValue); // 新值也是对象的时候需要再次监测
        if (value !== newValue) {
          value = newValue;
        }
        dep.notify(); // 通知所有依赖更新
      }
    });
  }
  function observer(data) {
    if (!isObject(data)) {
      return;
    }
    return new Observer(data);
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
    // 代理 将vm.xxx 代理到vm._data.xxx(方便用户取值)
    for (var key in data) {
      proxy(vm, '_data', key);
    }
    // 对象劫持
    // Object.defineProperty,给书香增加get、set 方法
    observer(data); // 响应式原理
  }

  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  // Regular Expressions for parsing tags and attributes
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*");
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则，捕获的内容是标签名
  var startTagClose = /^\s*(\/?)>/; // 捕获的内容是结尾标签
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  function parseHtml(html) {
    var root = null; //ast语法树树根
    var currentParent = null; // 当前父节点
    var stack = []; // 栈存放dom 标签结构，判断标签是否正确闭合
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    function createASTElement(tagName, attrs) {
      return {
        type: ELEMENT_TYPE,
        tag: tagName,
        attrs: attrs,
        children: [],
        parent: null
      };
    }
    function start(tagName, attrs) {
      //   console.log('开始标签：', tagName, '属性是：', attrs)
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element); // 标签入栈
    }
    function chars(text) {
      //   console.log('文本是：', text)
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }
    function end(tagName) {
      //   console.log('结束标签：', tagName)
      var element = stack.pop();
      currentParent = stack.length > 0 ? stack[stack.length - 1] : null;
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); //实现了树的父子关系
      }
    }
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        //   console.log('endTagMatch', endTagMatch)
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      var text = undefined;
      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        chars(text);
      }
    }
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var _end, attr;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // 去掉属性
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }
        if (_end) {
          // 去掉开始标签的 >
          advance(_end[0].length);
          return match;
        }
      }
    }
    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配{{}}
  function genProps(attrs) {
    // 处理属性 拼接成属性字符串
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value.trim();
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function genChildren(el) {
    var children = el.children;
    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }
  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text;
      var token = [];
      var match;
      var lastIndex = 0;
      defaultTagRE.lastIndex = 0;
      while (match = defaultTagRE.exec(text)) {
        var _index = match.index;
        if (_index > lastIndex) {
          token.push(JSON.stringify(text.slice(lastIndex, _index)));
        }
        var value = match[1].trim();
        token.push("_s(".concat(value, ")"));
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        token.push(JSON.stringify(text.slice(lastIndex)));
      }
      return "_v(".concat(token.join('+'), ")");
    }
  }
  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\", ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToRender(template) {
    // 解析html字符串，将html字符串变成ast语法树
    var root = parseHtml(template);
    // console.log('root', root)
    // 将ast 语法树转成js语法
    // _c("div", {class: "app testcss tttccc",style: {"color":"red"," font-size":"16px"}},_c("p", undefined,_v()),_c("span", undefined,_v("hello"+_s(message))))
    var code = generate(root);
    // console.log(code)
    // 所有模版引擎的实现 都需要new Function + with with可改变当前取值的作用域
    var renderFn = new Function("with(this){return ".concat(code, "}"));
    // vue 的render 返回的事虚拟dom
    // console.log('renderFn', renderFn)
    return renderFn;
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb, options) {
      _classCallCheck(this, Watcher);
      this.vm = vm;
      this.id = id++;
      this.getter = expOrFn;
      this.depsId = new Set();
      this.deps = [];
      this.cb = cb;
      this.options = options;
      this.get();
    }
    return _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        this.getter();
        popTarget();
      }
    }, {
      key: "update",
      value: function update() {
        this.getter();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSubs(this);
        }
      }
    }]);
  }();

  function patch(oldVnode, vnode) {
    // 1、判断是更新还是渲染
    var isRealElement = oldVnode.nodeType;
    if (isRealElement) {
      var oldElm = oldVnode; // div app
      var parentElm = oldVnode.parentNode; // body
      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling); // ��入到dom中
      parentElm.removeChild(oldElm);
      return el;
    }
  }
  // 根据虚拟节点创建真实节点
  function createElm(vnode) {
    var tag = vnode.tag;
      vnode.data;
      var children = vnode.children;
      vnode.key;
      var text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function updateProperties(vnode) {
    var data = vnode.data;
    var el = vnode.el;
    for (var key in data) {
      if (key === 'style') {
        for (var styleName in data.style) {
          el.style[styleName] = data.style[styleName];
        }
      } else if (key === 'class') {
        el.className = data["class"];
      } else {
        el.setAttribute(key, data[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    // 通过虚拟dom创建真实dom
    Vue.prototype._update = function (vnode) {
      // 通过虚拟节点创建真实dom
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
      console.log('vnode', vnode);
    };
  }
  function mountComponent(vm, el) {
    vm.$options;
    callHook(vm, 'beforeMount');
    // 渲染页面
    // 无论渲染还是更新都会调用此方法
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    // 渲染watcher 每个组件都有一个watcher
    new Watcher(vm, updateComponent, function () {}, true); // true表示他是一个渲染watcher
    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      // 找到对应的钩子依次执行
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options) || {};
      callHook(vm, 'beforeCreate');
      // 初始化状态
      initState(vm);
      callHook(vm, 'created');
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      vm.$el = document.querySelector(el);
      var render = options.render;
      if (!render) {
        var template = vm.template;
        if (!template && vm.$el) {
          template = vm.$el.outerHTML;
          var _render = compileToRender(template);
          options.render = _render;
        }
      }
      mountComponent(vm);
    };
  }

  function createElement(tag, data) {
    var key = data && data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, data, key, children, undefined);
  }
  function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      return createElement.apply(undefined, arguments);
    };
    Vue.prototype._v = function (text) {
      return createTextVNode(text);
    };
    Vue.prototype._s = function (val) {
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._render = function () {
      // _c创建元素虚拟节点
      // _v 创建文本虚拟节点
      // _s 转义文本JSON.stringify

      var vm = this;
      var render = vm.$options.render;
      return render.call(this);
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
    Vue.mixin({
      a: 1,
      beforeCreate: function beforeCreate() {
        console.log('beforeCreate1');
      }
    });
    Vue.mixin({
      b: 2,
      beforeCreate: function beforeCreate() {
        console.log('beforeCreate2');
      }
    });
    console.log(33333, Vue.options);
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalAPI(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

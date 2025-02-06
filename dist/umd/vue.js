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
    return _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
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
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (undefined !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (String )(t);
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

  // 重写数组的方法 push、pop、shift、unshift、sort、splice、reverse(这些方法回改变原数组所以需要重写)，slice这个方法不会改变原数组所以不需要重写
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      console.log('用户操作了', method);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
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
    observer(value); // 递归实现深度检测
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        observer(newValue); // 新值也是对象的时候需要再次监测
        if (value !== newValue) {
          value = newValue;
        }
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
    console.log('开始标签：', tagName, '属性是：', attrs);
    var element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element); // 标签入栈
  }
  function chars(text) {
    console.log('文本是：', text);
    text = text.replace(/\s/g, '');
    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }
  function end(tagName) {
    console.log('结束标签：', tagName);
    var element = stack.pop();
    currentParent = stack.length > 0 ? stack[stack.length - 1] : null;
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element); //实现了树的父子关系
    }
  }
  function parseHtml(html) {
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        console.log('endTagMatch', endTagMatch);
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

  function compileToRender(template) {
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
    function generate(el) {
      var code = "_c(\"".concat(el.tag, "\", ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', ")");
      return code;
    }
    // 解析html字符串，将html字符串变成ast语法树
    var root = parseHtml(template);
    console.log('root', root);
    var code = generate(root);
    console.log(code);
    return function render() {};
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options || {};
      // 初始化状态
      initState(vm);
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
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

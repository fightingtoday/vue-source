(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  function compileToRender() {
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
          var _render = compileToRender();
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

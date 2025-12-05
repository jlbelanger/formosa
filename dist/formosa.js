import * as be from "react";
import de, { useContext as ae, useRef as Ce, useState as ne, useEffect as le, useMemo as Wt } from "react";
function lt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Ie = { exports: {} }, Se = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jt;
function Tr() {
  if (jt) return Se;
  jt = 1;
  var t = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function s(n, a, o) {
    var c = null;
    if (o !== void 0 && (c = "" + o), a.key !== void 0 && (c = "" + a.key), "key" in a) {
      o = {};
      for (var l in a)
        l !== "key" && (o[l] = a[l]);
    } else o = a;
    return a = o.ref, {
      $$typeof: t,
      type: n,
      key: c,
      ref: a !== void 0 ? a : null,
      props: o
    };
  }
  return Se.Fragment = r, Se.jsx = s, Se.jsxs = s, Se;
}
var Pe = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ot;
function wr() {
  return Ot || (Ot = 1, process.env.NODE_ENV !== "production" && (function() {
    function t(i) {
      if (i == null) return null;
      if (typeof i == "function")
        return i.$$typeof === Z ? null : i.displayName || i.name || null;
      if (typeof i == "string") return i;
      switch (i) {
        case j:
          return "Fragment";
        case _:
          return "Profiler";
        case E:
          return "StrictMode";
        case J:
          return "Suspense";
        case H:
          return "SuspenseList";
        case ee:
          return "Activity";
      }
      if (typeof i == "object")
        switch (typeof i.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), i.$$typeof) {
          case u:
            return "Portal";
          case N:
            return i.displayName || "Context";
          case P:
            return (i._context.displayName || "Context") + ".Consumer";
          case y:
            var T = i.render;
            return i = i.displayName, i || (i = T.displayName || T.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
          case Y:
            return T = i.displayName || null, T !== null ? T : t(i.type) || "Memo";
          case Q:
            T = i._payload, i = i._init;
            try {
              return t(i(T));
            } catch {
            }
        }
      return null;
    }
    function r(i) {
      return "" + i;
    }
    function s(i) {
      try {
        r(i);
        var T = !1;
      } catch {
        T = !0;
      }
      if (T) {
        T = console;
        var C = T.error, v = typeof Symbol == "function" && Symbol.toStringTag && i[Symbol.toStringTag] || i.constructor.name || "Object";
        return C.call(
          T,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          v
        ), r(i);
      }
    }
    function n(i) {
      if (i === j) return "<>";
      if (typeof i == "object" && i !== null && i.$$typeof === Q)
        return "<...>";
      try {
        var T = t(i);
        return T ? "<" + T + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function a() {
      var i = z.A;
      return i === null ? null : i.getOwner();
    }
    function o() {
      return Error("react-stack-top-frame");
    }
    function c(i) {
      if (K.call(i, "key")) {
        var T = Object.getOwnPropertyDescriptor(i, "key").get;
        if (T && T.isReactWarning) return !1;
      }
      return i.key !== void 0;
    }
    function l(i, T) {
      function C() {
        M || (M = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          T
        ));
      }
      C.isReactWarning = !0, Object.defineProperty(i, "key", {
        get: C,
        configurable: !0
      });
    }
    function O() {
      var i = t(this.type);
      return V[i] || (V[i] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), i = this.props.ref, i !== void 0 ? i : null;
    }
    function f(i, T, C, v, A, I) {
      var R = C.ref;
      return i = {
        $$typeof: h,
        type: i,
        key: T,
        props: C,
        _owner: v
      }, (R !== void 0 ? R : null) !== null ? Object.defineProperty(i, "ref", {
        enumerable: !1,
        get: O
      }) : Object.defineProperty(i, "ref", { enumerable: !1, value: null }), i._store = {}, Object.defineProperty(i._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(i, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(i, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: A
      }), Object.defineProperty(i, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: I
      }), Object.freeze && (Object.freeze(i.props), Object.freeze(i)), i;
    }
    function d(i, T, C, v, A, I) {
      var R = T.children;
      if (R !== void 0)
        if (v)
          if (U(R)) {
            for (v = 0; v < R.length; v++)
              b(R[v]);
            Object.freeze && Object.freeze(R);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else b(R);
      if (K.call(T, "key")) {
        R = t(i);
        var x = Object.keys(T).filter(function(q) {
          return q !== "key";
        });
        v = 0 < x.length ? "{key: someKey, " + x.join(": ..., ") + ": ...}" : "{key: someKey}", m[R + v] || (x = 0 < x.length ? "{" + x.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          v,
          R,
          x,
          R
        ), m[R + v] = !0);
      }
      if (R = null, C !== void 0 && (s(C), R = "" + C), c(T) && (s(T.key), R = "" + T.key), "key" in T) {
        C = {};
        for (var k in T)
          k !== "key" && (C[k] = T[k]);
      } else C = T;
      return R && l(
        C,
        typeof i == "function" ? i.displayName || i.name || "Unknown" : i
      ), f(
        i,
        R,
        C,
        a(),
        A,
        I
      );
    }
    function b(i) {
      w(i) ? i._store && (i._store.validated = 1) : typeof i == "object" && i !== null && i.$$typeof === Q && (i._payload.status === "fulfilled" ? w(i._payload.value) && i._payload.value._store && (i._payload.value._store.validated = 1) : i._store && (i._store.validated = 1));
    }
    function w(i) {
      return typeof i == "object" && i !== null && i.$$typeof === h;
    }
    var p = de, h = Symbol.for("react.transitional.element"), u = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), E = Symbol.for("react.strict_mode"), _ = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), N = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), J = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), Q = Symbol.for("react.lazy"), ee = Symbol.for("react.activity"), Z = Symbol.for("react.client.reference"), z = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = Object.prototype.hasOwnProperty, U = Array.isArray, F = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(i) {
        return i();
      }
    };
    var M, V = {}, $ = p.react_stack_bottom_frame.bind(
      p,
      o
    )(), D = F(n(o)), m = {};
    Pe.Fragment = j, Pe.jsx = function(i, T, C) {
      var v = 1e4 > z.recentlyCreatedOwnerStacks++;
      return d(
        i,
        T,
        C,
        !1,
        v ? Error("react-stack-top-frame") : $,
        v ? F(n(i)) : D
      );
    }, Pe.jsxs = function(i, T, C) {
      var v = 1e4 > z.recentlyCreatedOwnerStacks++;
      return d(
        i,
        T,
        C,
        !0,
        v ? Error("react-stack-top-frame") : $,
        v ? F(n(i)) : D
      );
    };
  })()), Pe;
}
var Tt;
function xr() {
  return Tt || (Tt = 1, process.env.NODE_ENV === "production" ? Ie.exports = Tr() : Ie.exports = wr()), Ie.exports;
}
var g = xr(), Fe = { exports: {} }, qe = { exports: {} }, G = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wt;
function _r() {
  if (wt) return G;
  wt = 1;
  var t = typeof Symbol == "function" && Symbol.for, r = t ? Symbol.for("react.element") : 60103, s = t ? Symbol.for("react.portal") : 60106, n = t ? Symbol.for("react.fragment") : 60107, a = t ? Symbol.for("react.strict_mode") : 60108, o = t ? Symbol.for("react.profiler") : 60114, c = t ? Symbol.for("react.provider") : 60109, l = t ? Symbol.for("react.context") : 60110, O = t ? Symbol.for("react.async_mode") : 60111, f = t ? Symbol.for("react.concurrent_mode") : 60111, d = t ? Symbol.for("react.forward_ref") : 60112, b = t ? Symbol.for("react.suspense") : 60113, w = t ? Symbol.for("react.suspense_list") : 60120, p = t ? Symbol.for("react.memo") : 60115, h = t ? Symbol.for("react.lazy") : 60116, u = t ? Symbol.for("react.block") : 60121, j = t ? Symbol.for("react.fundamental") : 60117, E = t ? Symbol.for("react.responder") : 60118, _ = t ? Symbol.for("react.scope") : 60119;
  function P(y) {
    if (typeof y == "object" && y !== null) {
      var J = y.$$typeof;
      switch (J) {
        case r:
          switch (y = y.type, y) {
            case O:
            case f:
            case n:
            case o:
            case a:
            case b:
              return y;
            default:
              switch (y = y && y.$$typeof, y) {
                case l:
                case d:
                case h:
                case p:
                case c:
                  return y;
                default:
                  return J;
              }
          }
        case s:
          return J;
      }
    }
  }
  function N(y) {
    return P(y) === f;
  }
  return G.AsyncMode = O, G.ConcurrentMode = f, G.ContextConsumer = l, G.ContextProvider = c, G.Element = r, G.ForwardRef = d, G.Fragment = n, G.Lazy = h, G.Memo = p, G.Portal = s, G.Profiler = o, G.StrictMode = a, G.Suspense = b, G.isAsyncMode = function(y) {
    return N(y) || P(y) === O;
  }, G.isConcurrentMode = N, G.isContextConsumer = function(y) {
    return P(y) === l;
  }, G.isContextProvider = function(y) {
    return P(y) === c;
  }, G.isElement = function(y) {
    return typeof y == "object" && y !== null && y.$$typeof === r;
  }, G.isForwardRef = function(y) {
    return P(y) === d;
  }, G.isFragment = function(y) {
    return P(y) === n;
  }, G.isLazy = function(y) {
    return P(y) === h;
  }, G.isMemo = function(y) {
    return P(y) === p;
  }, G.isPortal = function(y) {
    return P(y) === s;
  }, G.isProfiler = function(y) {
    return P(y) === o;
  }, G.isStrictMode = function(y) {
    return P(y) === a;
  }, G.isSuspense = function(y) {
    return P(y) === b;
  }, G.isValidElementType = function(y) {
    return typeof y == "string" || typeof y == "function" || y === n || y === f || y === o || y === a || y === b || y === w || typeof y == "object" && y !== null && (y.$$typeof === h || y.$$typeof === p || y.$$typeof === c || y.$$typeof === l || y.$$typeof === d || y.$$typeof === j || y.$$typeof === E || y.$$typeof === _ || y.$$typeof === u);
  }, G.typeOf = P, G;
}
var X = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xt;
function Er() {
  return xt || (xt = 1, process.env.NODE_ENV !== "production" && (function() {
    var t = typeof Symbol == "function" && Symbol.for, r = t ? Symbol.for("react.element") : 60103, s = t ? Symbol.for("react.portal") : 60106, n = t ? Symbol.for("react.fragment") : 60107, a = t ? Symbol.for("react.strict_mode") : 60108, o = t ? Symbol.for("react.profiler") : 60114, c = t ? Symbol.for("react.provider") : 60109, l = t ? Symbol.for("react.context") : 60110, O = t ? Symbol.for("react.async_mode") : 60111, f = t ? Symbol.for("react.concurrent_mode") : 60111, d = t ? Symbol.for("react.forward_ref") : 60112, b = t ? Symbol.for("react.suspense") : 60113, w = t ? Symbol.for("react.suspense_list") : 60120, p = t ? Symbol.for("react.memo") : 60115, h = t ? Symbol.for("react.lazy") : 60116, u = t ? Symbol.for("react.block") : 60121, j = t ? Symbol.for("react.fundamental") : 60117, E = t ? Symbol.for("react.responder") : 60118, _ = t ? Symbol.for("react.scope") : 60119;
    function P(S) {
      return typeof S == "string" || typeof S == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      S === n || S === f || S === o || S === a || S === b || S === w || typeof S == "object" && S !== null && (S.$$typeof === h || S.$$typeof === p || S.$$typeof === c || S.$$typeof === l || S.$$typeof === d || S.$$typeof === j || S.$$typeof === E || S.$$typeof === _ || S.$$typeof === u);
    }
    function N(S) {
      if (typeof S == "object" && S !== null) {
        var se = S.$$typeof;
        switch (se) {
          case r:
            var ge = S.type;
            switch (ge) {
              case O:
              case f:
              case n:
              case o:
              case a:
              case b:
                return ge;
              default:
                var $e = ge && ge.$$typeof;
                switch ($e) {
                  case l:
                  case d:
                  case h:
                  case p:
                  case c:
                    return $e;
                  default:
                    return se;
                }
            }
          case s:
            return se;
        }
      }
    }
    var y = O, J = f, H = l, Y = c, Q = r, ee = d, Z = n, z = h, K = p, U = s, F = o, M = a, V = b, $ = !1;
    function D(S) {
      return $ || ($ = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), m(S) || N(S) === O;
    }
    function m(S) {
      return N(S) === f;
    }
    function i(S) {
      return N(S) === l;
    }
    function T(S) {
      return N(S) === c;
    }
    function C(S) {
      return typeof S == "object" && S !== null && S.$$typeof === r;
    }
    function v(S) {
      return N(S) === d;
    }
    function A(S) {
      return N(S) === n;
    }
    function I(S) {
      return N(S) === h;
    }
    function R(S) {
      return N(S) === p;
    }
    function x(S) {
      return N(S) === s;
    }
    function k(S) {
      return N(S) === o;
    }
    function q(S) {
      return N(S) === a;
    }
    function B(S) {
      return N(S) === b;
    }
    X.AsyncMode = y, X.ConcurrentMode = J, X.ContextConsumer = H, X.ContextProvider = Y, X.Element = Q, X.ForwardRef = ee, X.Fragment = Z, X.Lazy = z, X.Memo = K, X.Portal = U, X.Profiler = F, X.StrictMode = M, X.Suspense = V, X.isAsyncMode = D, X.isConcurrentMode = m, X.isContextConsumer = i, X.isContextProvider = T, X.isElement = C, X.isForwardRef = v, X.isFragment = A, X.isLazy = I, X.isMemo = R, X.isPortal = x, X.isProfiler = k, X.isStrictMode = q, X.isSuspense = B, X.isValidElementType = P, X.typeOf = N;
  })()), X;
}
var _t;
function Jt() {
  return _t || (_t = 1, process.env.NODE_ENV === "production" ? qe.exports = _r() : qe.exports = Er()), qe.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var He, Et;
function Sr() {
  if (Et) return He;
  Et = 1;
  var t = Object.getOwnPropertySymbols, r = Object.prototype.hasOwnProperty, s = Object.prototype.propertyIsEnumerable;
  function n(o) {
    if (o == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(o);
  }
  function a() {
    try {
      if (!Object.assign)
        return !1;
      var o = new String("abc");
      if (o[5] = "de", Object.getOwnPropertyNames(o)[0] === "5")
        return !1;
      for (var c = {}, l = 0; l < 10; l++)
        c["_" + String.fromCharCode(l)] = l;
      var O = Object.getOwnPropertyNames(c).map(function(d) {
        return c[d];
      });
      if (O.join("") !== "0123456789")
        return !1;
      var f = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(d) {
        f[d] = d;
      }), Object.keys(Object.assign({}, f)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return He = a() ? Object.assign : function(o, c) {
    for (var l, O = n(o), f, d = 1; d < arguments.length; d++) {
      l = Object(arguments[d]);
      for (var b in l)
        r.call(l, b) && (O[b] = l[b]);
      if (t) {
        f = t(l);
        for (var w = 0; w < f.length; w++)
          s.call(l, f[w]) && (O[f[w]] = l[f[w]]);
      }
    }
    return O;
  }, He;
}
var Ge, St;
function ct() {
  if (St) return Ge;
  St = 1;
  var t = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Ge = t, Ge;
}
var Xe, Pt;
function Ut() {
  return Pt || (Pt = 1, Xe = Function.call.bind(Object.prototype.hasOwnProperty)), Xe;
}
var Ze, Ct;
function Pr() {
  if (Ct) return Ze;
  Ct = 1;
  var t = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var r = /* @__PURE__ */ ct(), s = {}, n = /* @__PURE__ */ Ut();
    t = function(o) {
      var c = "Warning: " + o;
      typeof console < "u" && console.error(c);
      try {
        throw new Error(c);
      } catch {
      }
    };
  }
  function a(o, c, l, O, f) {
    if (process.env.NODE_ENV !== "production") {
      for (var d in o)
        if (n(o, d)) {
          var b;
          try {
            if (typeof o[d] != "function") {
              var w = Error(
                (O || "React class") + ": " + l + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof o[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw w.name = "Invariant Violation", w;
            }
            b = o[d](c, d, O, l, null, r);
          } catch (h) {
            b = h;
          }
          if (b && !(b instanceof Error) && t(
            (O || "React class") + ": type specification of " + l + " `" + d + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof b + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), b instanceof Error && !(b.message in s)) {
            s[b.message] = !0;
            var p = f ? f() : "";
            t(
              "Failed " + l + " type: " + b.message + (p ?? "")
            );
          }
        }
    }
  }
  return a.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (s = {});
  }, Ze = a, Ze;
}
var Qe, Rt;
function Cr() {
  if (Rt) return Qe;
  Rt = 1;
  var t = Jt(), r = Sr(), s = /* @__PURE__ */ ct(), n = /* @__PURE__ */ Ut(), a = /* @__PURE__ */ Pr(), o = function() {
  };
  process.env.NODE_ENV !== "production" && (o = function(l) {
    var O = "Warning: " + l;
    typeof console < "u" && console.error(O);
    try {
      throw new Error(O);
    } catch {
    }
  });
  function c() {
    return null;
  }
  return Qe = function(l, O) {
    var f = typeof Symbol == "function" && Symbol.iterator, d = "@@iterator";
    function b(m) {
      var i = m && (f && m[f] || m[d]);
      if (typeof i == "function")
        return i;
    }
    var w = "<<anonymous>>", p = {
      array: E("array"),
      bigint: E("bigint"),
      bool: E("boolean"),
      func: E("function"),
      number: E("number"),
      object: E("object"),
      string: E("string"),
      symbol: E("symbol"),
      any: _(),
      arrayOf: P,
      element: N(),
      elementType: y(),
      instanceOf: J,
      node: ee(),
      objectOf: Y,
      oneOf: H,
      oneOfType: Q,
      shape: z,
      exact: K
    };
    function h(m, i) {
      return m === i ? m !== 0 || 1 / m === 1 / i : m !== m && i !== i;
    }
    function u(m, i) {
      this.message = m, this.data = i && typeof i == "object" ? i : {}, this.stack = "";
    }
    u.prototype = Error.prototype;
    function j(m) {
      if (process.env.NODE_ENV !== "production")
        var i = {}, T = 0;
      function C(A, I, R, x, k, q, B) {
        if (x = x || w, q = q || R, B !== s) {
          if (O) {
            var S = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw S.name = "Invariant Violation", S;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var se = x + ":" + R;
            !i[se] && // Avoid spamming the console because they are often not actionable except for lib authors
            T < 3 && (o(
              "You are manually calling a React.PropTypes validation function for the `" + q + "` prop on `" + x + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), i[se] = !0, T++);
          }
        }
        return I[R] == null ? A ? I[R] === null ? new u("The " + k + " `" + q + "` is marked as required " + ("in `" + x + "`, but its value is `null`.")) : new u("The " + k + " `" + q + "` is marked as required in " + ("`" + x + "`, but its value is `undefined`.")) : null : m(I, R, x, k, q);
      }
      var v = C.bind(null, !1);
      return v.isRequired = C.bind(null, !0), v;
    }
    function E(m) {
      function i(T, C, v, A, I, R) {
        var x = T[C], k = M(x);
        if (k !== m) {
          var q = V(x);
          return new u(
            "Invalid " + A + " `" + I + "` of type " + ("`" + q + "` supplied to `" + v + "`, expected ") + ("`" + m + "`."),
            { expectedType: m }
          );
        }
        return null;
      }
      return j(i);
    }
    function _() {
      return j(c);
    }
    function P(m) {
      function i(T, C, v, A, I) {
        if (typeof m != "function")
          return new u("Property `" + I + "` of component `" + v + "` has invalid PropType notation inside arrayOf.");
        var R = T[C];
        if (!Array.isArray(R)) {
          var x = M(R);
          return new u("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected an array."));
        }
        for (var k = 0; k < R.length; k++) {
          var q = m(R, k, v, A, I + "[" + k + "]", s);
          if (q instanceof Error)
            return q;
        }
        return null;
      }
      return j(i);
    }
    function N() {
      function m(i, T, C, v, A) {
        var I = i[T];
        if (!l(I)) {
          var R = M(I);
          return new u("Invalid " + v + " `" + A + "` of type " + ("`" + R + "` supplied to `" + C + "`, expected a single ReactElement."));
        }
        return null;
      }
      return j(m);
    }
    function y() {
      function m(i, T, C, v, A) {
        var I = i[T];
        if (!t.isValidElementType(I)) {
          var R = M(I);
          return new u("Invalid " + v + " `" + A + "` of type " + ("`" + R + "` supplied to `" + C + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return j(m);
    }
    function J(m) {
      function i(T, C, v, A, I) {
        if (!(T[C] instanceof m)) {
          var R = m.name || w, x = D(T[C]);
          return new u("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected ") + ("instance of `" + R + "`."));
        }
        return null;
      }
      return j(i);
    }
    function H(m) {
      if (!Array.isArray(m))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? o(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : o("Invalid argument supplied to oneOf, expected an array.")), c;
      function i(T, C, v, A, I) {
        for (var R = T[C], x = 0; x < m.length; x++)
          if (h(R, m[x]))
            return null;
        var k = JSON.stringify(m, function(B, S) {
          var se = V(S);
          return se === "symbol" ? String(S) : S;
        });
        return new u("Invalid " + A + " `" + I + "` of value `" + String(R) + "` " + ("supplied to `" + v + "`, expected one of " + k + "."));
      }
      return j(i);
    }
    function Y(m) {
      function i(T, C, v, A, I) {
        if (typeof m != "function")
          return new u("Property `" + I + "` of component `" + v + "` has invalid PropType notation inside objectOf.");
        var R = T[C], x = M(R);
        if (x !== "object")
          return new u("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected an object."));
        for (var k in R)
          if (n(R, k)) {
            var q = m(R, k, v, A, I + "." + k, s);
            if (q instanceof Error)
              return q;
          }
        return null;
      }
      return j(i);
    }
    function Q(m) {
      if (!Array.isArray(m))
        return process.env.NODE_ENV !== "production" && o("Invalid argument supplied to oneOfType, expected an instance of array."), c;
      for (var i = 0; i < m.length; i++) {
        var T = m[i];
        if (typeof T != "function")
          return o(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + $(T) + " at index " + i + "."
          ), c;
      }
      function C(v, A, I, R, x) {
        for (var k = [], q = 0; q < m.length; q++) {
          var B = m[q], S = B(v, A, I, R, x, s);
          if (S == null)
            return null;
          S.data && n(S.data, "expectedType") && k.push(S.data.expectedType);
        }
        var se = k.length > 0 ? ", expected one of type [" + k.join(", ") + "]" : "";
        return new u("Invalid " + R + " `" + x + "` supplied to " + ("`" + I + "`" + se + "."));
      }
      return j(C);
    }
    function ee() {
      function m(i, T, C, v, A) {
        return U(i[T]) ? null : new u("Invalid " + v + " `" + A + "` supplied to " + ("`" + C + "`, expected a ReactNode."));
      }
      return j(m);
    }
    function Z(m, i, T, C, v) {
      return new u(
        (m || "React class") + ": " + i + " type `" + T + "." + C + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + v + "`."
      );
    }
    function z(m) {
      function i(T, C, v, A, I) {
        var R = T[C], x = M(R);
        if (x !== "object")
          return new u("Invalid " + A + " `" + I + "` of type `" + x + "` " + ("supplied to `" + v + "`, expected `object`."));
        for (var k in m) {
          var q = m[k];
          if (typeof q != "function")
            return Z(v, A, I, k, V(q));
          var B = q(R, k, v, A, I + "." + k, s);
          if (B)
            return B;
        }
        return null;
      }
      return j(i);
    }
    function K(m) {
      function i(T, C, v, A, I) {
        var R = T[C], x = M(R);
        if (x !== "object")
          return new u("Invalid " + A + " `" + I + "` of type `" + x + "` " + ("supplied to `" + v + "`, expected `object`."));
        var k = r({}, T[C], m);
        for (var q in k) {
          var B = m[q];
          if (n(m, q) && typeof B != "function")
            return Z(v, A, I, q, V(B));
          if (!B)
            return new u(
              "Invalid " + A + " `" + I + "` key `" + q + "` supplied to `" + v + "`.\nBad object: " + JSON.stringify(T[C], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(m), null, "  ")
            );
          var S = B(R, q, v, A, I + "." + q, s);
          if (S)
            return S;
        }
        return null;
      }
      return j(i);
    }
    function U(m) {
      switch (typeof m) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !m;
        case "object":
          if (Array.isArray(m))
            return m.every(U);
          if (m === null || l(m))
            return !0;
          var i = b(m);
          if (i) {
            var T = i.call(m), C;
            if (i !== m.entries) {
              for (; !(C = T.next()).done; )
                if (!U(C.value))
                  return !1;
            } else
              for (; !(C = T.next()).done; ) {
                var v = C.value;
                if (v && !U(v[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function F(m, i) {
      return m === "symbol" ? !0 : i ? i["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && i instanceof Symbol : !1;
    }
    function M(m) {
      var i = typeof m;
      return Array.isArray(m) ? "array" : m instanceof RegExp ? "object" : F(i, m) ? "symbol" : i;
    }
    function V(m) {
      if (typeof m > "u" || m === null)
        return "" + m;
      var i = M(m);
      if (i === "object") {
        if (m instanceof Date)
          return "date";
        if (m instanceof RegExp)
          return "regexp";
      }
      return i;
    }
    function $(m) {
      var i = V(m);
      switch (i) {
        case "array":
        case "object":
          return "an " + i;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + i;
        default:
          return i;
      }
    }
    function D(m) {
      return !m.constructor || !m.constructor.name ? w : m.constructor.name;
    }
    return p.checkPropTypes = a, p.resetWarningCache = a.resetWarningCache, p.PropTypes = p, p;
  }, Qe;
}
var Ke, Nt;
function Rr() {
  if (Nt) return Ke;
  Nt = 1;
  var t = /* @__PURE__ */ ct();
  function r() {
  }
  function s() {
  }
  return s.resetWarningCache = r, Ke = function() {
    function n(c, l, O, f, d, b) {
      if (b !== t) {
        var w = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw w.name = "Invariant Violation", w;
      }
    }
    n.isRequired = n;
    function a() {
      return n;
    }
    var o = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: a,
      element: n,
      elementType: n,
      instanceOf: a,
      node: n,
      objectOf: a,
      oneOf: a,
      oneOfType: a,
      shape: a,
      exact: a,
      checkPropTypes: s,
      resetWarningCache: r
    };
    return o.PropTypes = o, o;
  }, Ke;
}
var $t;
function Nr() {
  if ($t) return Fe.exports;
  if ($t = 1, process.env.NODE_ENV !== "production") {
    var t = Jt(), r = !0;
    Fe.exports = /* @__PURE__ */ Cr()(t.isElement, r);
  } else
    Fe.exports = /* @__PURE__ */ Rr()();
  return Fe.exports;
}
var $r = /* @__PURE__ */ Nr();
const e = /* @__PURE__ */ lt($r);
function ft({
  className: t = "",
  children: r,
  type: s = null,
  ...n
}) {
  if (!r)
    return null;
  let a = "formosa-alert";
  return s && (a += ` formosa-alert--${s}`), t && (a += ` ${t}`), /* @__PURE__ */ g.jsx("div", { "aria-live": "polite", className: a, role: "alert", ...n, children: r });
}
ft.propTypes = {
  className: e.string,
  children: e.node.isRequired,
  type: e.string
};
const Le = (t, r, s, n) => {
  if (n && r === n.id && s === n.type) {
    const a = {
      id: n.id,
      type: n.type
    };
    return Object.prototype.hasOwnProperty.call(n, "attributes") && (a.attributes = n.attributes), Object.prototype.hasOwnProperty.call(n, "meta") && (a.meta = n.meta), a;
  }
  return t.find((a) => a.id === r && a.type === s);
}, _e = (t, r = [], s = [], n = null) => {
  if (!t)
    return t;
  const a = {
    id: t.id,
    type: t.type,
    ...t.attributes
  };
  if (Object.prototype.hasOwnProperty.call(t, "relationships")) {
    let o;
    Object.keys(t.relationships).forEach((c) => {
      a[c] = t.relationships[c].data, Array.isArray(a[c]) ? a[c].forEach((l, O) => {
        o = Le(s, l.id, l.type, n), o ? a[c][O] = _e(o, r, s, n) : (o = Le(r, l.id, l.type, n), o && (a[c][O] = _e(o, r, s, n)));
      }) : a[c] !== null && (o = Le(s, a[c].id, a[c].type, n), o ? a[c] = _e(o, r, s, n) : (o = Le(r, a[c].id, a[c].type, n), o && (a[c] = _e(o, r, s, n))));
    });
  }
  return Object.prototype.hasOwnProperty.call(t, "meta") && (a.meta = t.meta), a;
}, At = (t) => {
  if (Array.isArray(t.data)) {
    const r = [];
    return t.data.forEach((s) => {
      r.push(_e(s, t.data, t.included, null));
    }), Object.prototype.hasOwnProperty.call(t, "meta") ? { data: r, meta: t.meta } : r;
  }
  return _e(t.data, [], t.included, t.data);
};
class Ar {
  static init(r = {}) {
    window.FORMOSA_CONFIG = {
      apiPrefix: r.apiPrefix
    };
  }
  static get(r) {
    return r ? window.FORMOSA_CONFIG[r] : window.FORMOSA_CONFIG;
  }
  static set(r, s) {
    window.FORMOSA_CONFIG[r] = s;
  }
}
class kr {
  emit(r, ...s) {
    if (!r) return this;
    for (const n of this._e(r))
      n.apply(n.ctx, [...s]), n.off_event == !0 && this.off(r, n);
    return this;
  }
  on(r, s, n) {
    return r ? (s.ctx = n, this._e(r).push(s), this) : this;
  }
  once(r, s, n) {
    return r ? (s.ctx = n, s.off_event = !0, this.on(r, s)) : this;
  }
  off(r, s) {
    if (!r) return this;
    if (!this[r]) return this;
    const n = this._e(r);
    return s ? (this[r] = n.filter((a) => a != s), this) : (delete this[r], this);
  }
  _e(r) {
    return this[r] || (this[r] = []);
  }
}
const Je = "default-area", Me = new kr(), De = "promise-counter-update";
let Te = {
  [Je]: 0
};
const Ir = (t) => Te[t], Fr = (t, r) => {
  r = r || Je, qr(r);
  const s = () => Mr(r);
  return t.then(s, s), t;
}, qr = (t) => {
  Lr(t);
  const r = Yt(t);
  Me.emit(De, r, t);
}, Lr = (t) => {
  Te[t] ? Te[t]++ : Te[t] = 1;
}, Yt = (t) => Te[t] > 0, Mr = (t) => {
  Te[t] > 0 && Dr(t);
  const r = Yt(t);
  Me.emit(De, r, t);
}, Dr = (t) => {
  Te[t]--;
}, Vr = {
  area: Je,
  delay: 0
}, Wr = (t) => ({
  area: !t || !t.area ? Je : t.area,
  delay: !t || !t.delay ? 0 : t.delay
}), Jr = (t = Vr) => {
  let r = de.useRef(!1);
  de.useEffect(() => (r.current = !0, () => r.current = !1), []);
  const [s] = de.useState(Wr(t));
  de.useEffect(() => {
    r.current && s && s.area && Ir(s.area) > 0 && (a(!0), c(!0));
  }, [s]);
  const [n, a] = de.useState(!1), [o, c] = de.useState(!1), l = de.useRef(n), O = () => {
    !s || !s.delay || s.delay === 0 ? c(!0) : setTimeout(() => {
      r.current && l.current && c(!0);
    }, s.delay);
  }, f = (d, b) => {
    r.current && s.area === b && (a(d), l.current = d, d ? O() : c(!1));
  };
  return de.useEffect(() => (l.current = n, Me.on(De, f), () => Me.off(De, f)), []), {
    promiseInProgress: o
  };
};
class ce {
  static instance() {
    const r = {};
    return (s, n) => (Object.prototype.hasOwnProperty.call(r, s) || (r[s] = ce.get(s, n)), r[s]);
  }
  static get(r, s = !0) {
    return ce.request("GET", r, null, s);
  }
  static delete(r, s = !0) {
    return ce.request("DELETE", r, null, s);
  }
  static post(r, s, n = !0) {
    return ce.request("POST", r, s, n);
  }
  static put(r, s, n = !0) {
    return ce.request("PUT", r, s, n);
  }
  static request(r, s, n = null, a = !0) {
    const o = {
      method: r,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    };
    typeof n == "string" && (o.headers["Content-Type"] = "application/json"), ce.getToken() && (o.headers.Authorization = `Bearer ${ce.getToken()}`), n && (o.body = n);
    const c = Ar.get("apiPrefix");
    let l = s;
    c && !s.startsWith("http") && (l = `${c.replace(/\/$/, "")}/${s.replace(/^\//, "")}`);
    const O = new CustomEvent("formosaApiRequest", { cancelable: !0, detail: { url: l, options: o } });
    if (!document.dispatchEvent(O))
      return Promise.resolve();
    const f = fetch(l, o).then((d) => d.ok ? d.status === 204 ? {} : d.json() : d.json().catch((b) => {
      throw b instanceof SyntaxError ? {
        // eslint-disable-line no-throw-literal
        errors: [
          {
            title: "Unable to connect to the server. Please try again later.",
            status: "500",
            detail: "The server returned invalid JSON."
          }
        ],
        status: 500
      } : b;
    }).then((b) => {
      throw b.status = d.status, b;
    })).then((d) => Object.prototype.hasOwnProperty.call(d, "data") ? At(d) : d);
    return a ? Fr(f) : f;
  }
  static getToken() {
    return window.FORMOSA_TOKEN;
  }
  static setToken(r) {
    window.FORMOSA_TOKEN = r;
  }
  static deserialize(r) {
    return Object.prototype.hasOwnProperty.call(r, "data") ? At(r) : r;
  }
}
const zt = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M6.41 1l-.69.72L2.94 4.5l-.81-.78L1.41 3 0 4.41l.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72L6.41 1z" })), fe = de.createContext(
  {
    alertClass: "",
    alertText: "",
    errors: {},
    files: {},
    originalRow: {},
    row: {},
    response: null,
    setRow: null,
    toastClass: "",
    toastText: "",
    uuid: null
  }
);
function Bt({
  id: t = null,
  name: r = ""
}) {
  const { formState: s } = ae(fe), n = s && Object.prototype.hasOwnProperty.call(s.errors, r), a = {};
  return r && (a["data-name"] = r), (t || r) && (a.id = `${t || r}-error`), /* @__PURE__ */ g.jsx("div", { className: "formosa-field__error", ...a, children: n && s.errors[r].map((o) => /* @__PURE__ */ g.jsx("div", { children: o }, o)) });
}
Bt.propTypes = {
  id: e.string,
  name: e.string
};
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var et, kt;
function Ht() {
  return kt || (kt = 1, et = function(r) {
    return r != null && typeof r == "object" && Array.isArray(r) === !1;
  }), et;
}
/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */
var tt, It;
function Ur() {
  if (It) return tt;
  It = 1;
  const t = Ht();
  tt = function(o, c, l) {
    if (t(l) || (l = { default: l }), !a(o))
      return typeof l.default < "u" ? l.default : o;
    typeof c == "number" && (c = String(c));
    const O = Array.isArray(c), f = typeof c == "string", d = l.separator || ".", b = l.joinChar || (typeof d == "string" ? d : ".");
    if (!f && !O)
      return o;
    if (f && c in o)
      return n(c, o, l) ? o[c] : l.default;
    let w = O ? c : s(c, d, l), p = w.length, h = 0;
    do {
      let u = w[h];
      for (typeof u == "number" && (u = String(u)); u && u.slice(-1) === "\\"; )
        u = r([u.slice(0, -1), w[++h] || ""], b, l);
      if (u in o) {
        if (!n(u, o, l))
          return l.default;
        o = o[u];
      } else {
        let j = !1, E = h + 1;
        for (; E < p; )
          if (u = r([u, w[E++]], b, l), j = u in o) {
            if (!n(u, o, l))
              return l.default;
            o = o[u], h = E - 1;
            break;
          }
        if (!j)
          return l.default;
      }
    } while (++h < p && a(o));
    return h === p ? o : l.default;
  };
  function r(o, c, l) {
    return typeof l.join == "function" ? l.join(o) : o[0] + c + o[1];
  }
  function s(o, c, l) {
    return typeof l.split == "function" ? l.split(o) : o.split(c);
  }
  function n(o, c, l) {
    return typeof l.isValid == "function" ? l.isValid(o, c) : !0;
  }
  function a(o) {
    return t(o) || Array.isArray(o) || typeof o == "function";
  }
  return tt;
}
var Yr = Ur();
const re = /* @__PURE__ */ lt(Yr), ue = (t, r, s = null) => {
  if (!t)
    return [];
  const n = [];
  return Array.isArray(t) ? t.forEach((a) => {
    typeof a == "string" ? n.push({
      label: a,
      value: a
    }) : n.push({
      ...a,
      label: typeof r == "function" ? r(a) : re(a, r),
      value: typeof s == "function" ? s(a) : re(a, s)
    });
  }) : Object.keys(t).forEach((a) => {
    const o = t[a];
    typeof a == "string" ? n.push({
      label: o,
      value: a
    }) : n.push({
      ...o,
      label: typeof r == "function" ? r(o) : re(o, r),
      value: typeof s == "function" ? s(o) : re(o, s)
    });
  }), n;
}, zr = (t) => t.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), rt = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ & /g, "-and-").replace(/<[^>]+>/g, "").replace(/['’.]/g, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+/, "").replace(/-+$/, "").replace(/--+/g, "-"), Br = (t, r, s) => {
  s = s.toLowerCase();
  const n = zr(s);
  return t = t.filter((a) => (re(a, r).toString().toLowerCase() || "").match(new RegExp(`(^|[^a-z])${n}`))), s = rt(s), t = t.sort((a, o) => {
    const c = rt(re(a, r).toString()), l = rt(re(o, r).toString()), O = c.indexOf(s) === 0, f = l.indexOf(s) === 0;
    return O && f || !O && !f ? c.localeCompare(l) : O && !f ? -1 : 1;
  }), t;
}, at = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z" }));
function Gt({
  afterAdd: t = null,
  afterChange: r = null,
  clearable: s = !0,
  clearButtonAttributes: n = null,
  clearButtonClassName: a = "",
  clearIconAttributes: o = null,
  clearIconHeight: c = 12,
  clearIconWidth: l = 12,
  clearText: O = "Clear",
  disabled: f = !1,
  id: d = "",
  inputAttributes: b = null,
  inputClassName: w = "",
  labelFn: p = null,
  labelKey: h = "name",
  loadingText: u = "Loading...",
  max: j = null,
  name: E = "",
  optionButtonAttributes: _ = null,
  optionButtonClassName: P = "",
  optionLabelFn: N = null,
  optionListAttributes: y = null,
  optionListClassName: J = "",
  optionListItemAttributes: H = null,
  optionListItemClassName: Y = "",
  options: Q = null,
  placeholder: ee = "Search",
  readOnly: Z = !1,
  removeButtonAttributes: z = null,
  removeButtonClassName: K = "",
  removeIconAttributes: U = null,
  removeIconHeight: F = 12,
  removeIconWidth: M = 12,
  removeText: V = "Remove",
  setValue: $ = null,
  showLoading: D = !1,
  url: m = null,
  value: i = null,
  valueKey: T = null,
  valueListItemAttributes: C = null,
  wrapperAttributes: v = null,
  wrapperClassName: A = "",
  ...I
}) {
  const { formState: R, setValues: x } = ae(fe), k = Ce(null), q = Ce(null), B = Ce(null), S = Ce(null), [se, ge] = ne(""), [$e, Ae] = ne(!1), [we, xe] = ne(0), [pt, dt] = ne(Q ? ue(Q, h, T) : []), [fr, Ye] = ne(D || !!m), [mt, ur] = ne(""), pr = ce.instance();
  if (le(() => {
    m && pr(m, !1).catch((L) => {
      Object.prototype.hasOwnProperty.call(L, "errors") && (ur(L.errors.map((W) => W.title).join(" ")), Ye(!1));
    }).then((L) => {
      L && (dt(ue(L, h, T)), Ye(!1));
    });
  }, [m]), le(() => {
    dt(Q ? ue(Q, h, T) : []);
  }, [Q]), le(() => {
    Ye(D);
  }, [D]), fr)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-spinner", role: "status", children: u });
  if (mt)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-field__error", children: mt });
  let te = null;
  if ($ !== null)
    te = i;
  else {
    if (R === void 0)
      throw new Error("<Autocomplete> component must be inside a <Form> component.");
    te = re(R.row, E);
  }
  te == null || te === "" ? te = null : j === 1 && !Array.isArray(te) && (te = [te]);
  const Ee = te ? te.length : 0, dr = (L) => te ? te.findIndex((W) => typeof W == "object" ? JSON.stringify(W) === JSON.stringify(L.value) : W === L.value) > -1 : !1;
  let me = [];
  se && (me = Br(pt, "label", se), me = me.filter((L) => !dr(L)));
  const ze = () => {
    q.current && q.current.focus();
  }, yt = (L) => {
    let W;
    j === 1 ? W = L : te ? W = [...te, L] : W = [L];
    const oe = { target: B.current };
    $ ? $(W, oe) : x(oe, E, W, r), Ae(!1), ge(""), ze(), t && t();
  }, ht = (L) => {
    let W = [];
    if (te && (W = [...te]), j !== 1) {
      const pe = W.indexOf(L);
      pe > -1 && W.splice(pe, 1);
    } else
      W = "";
    const oe = { target: B.current };
    $ ? $(W, oe) : x(oe, E, W, r), ze();
  }, mr = (L) => {
    ge(L.target.value);
  }, yr = () => {
    xe(0), Ae(se.length > 0);
  }, hr = (L) => {
    const W = L.target.value;
    L.key === "Enter" && W && me.length > 0 ? L.preventDefault() : L.key === "Backspace" && !se && Ee > 0 && ht(te[Ee - 1]);
  }, gr = (L) => {
    const W = L.target.value;
    L.key === "Enter" && W && me.length > 0 ? (L.preventDefault(), yt(me[we].value)) : L.key === "ArrowDown" ? we >= me.length - 1 ? xe(0) : xe(we + 1) : L.key === "ArrowUp" ? we > 0 ? xe(we - 1) : xe(me.length - 1) : L.key === "Escape" ? Ae(!1) : (xe(0), Ae(W.length > 0));
  }, br = (L) => {
    let W = L.target.getAttribute("data-value");
    L.target.getAttribute("data-json") === "true" && (W = JSON.parse(W)), yt(W);
  }, vr = (L) => {
    let W = L.target;
    for (; W && W.tagName.toUpperCase() !== "BUTTON"; )
      W = W.parentNode;
    ht(te[W.getAttribute("data-index")]);
  }, jr = () => {
    const L = [], W = { target: B.current };
    $ ? $(L, W) : x(W, E, L, r), ge(""), ze();
  }, gt = s && j !== 1 && Ee > 0 && !f && !Z;
  let ke = ["formosa-autocomplete"];
  gt && ke.push("formosa-autocomplete--clearable"), ke = ke.join(" ");
  const Or = !f && !Z && (j === null || Ee < j), bt = {};
  return (d || E) && (bt.id = `${d || E}-wrapper`), /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: `${ke} ${A}`.trim(),
      "data-value": JSON.stringify(j === 1 && Ee > 0 ? te[0] : te),
      ...bt,
      ...v,
      children: [
        /* @__PURE__ */ g.jsxs("ul", { className: "formosa-autocomplete__values", children: [
          te && te.map((L, W) => {
            let oe = L, pe = !1;
            typeof oe == "object" && (oe = JSON.stringify(oe), pe = !0);
            const ye = pt.find((vt) => pe ? JSON.stringify(vt.value) === oe : vt.value === oe);
            let ve = "";
            p ? ve = p(ye || L) : ye && Object.prototype.hasOwnProperty.call(ye, "label") && (ve = ye.label);
            let je = {};
            typeof C == "function" ? je = C(ye) : C && typeof C == "object" && (je = C);
            let Oe = {};
            typeof z == "function" ? Oe = z(ye) : z && typeof z == "object" && (Oe = z);
            let Be = {};
            return typeof U == "function" ? Be = U(ye) : U && typeof U == "object" && (Be = U), /* @__PURE__ */ g.jsxs("li", { className: "formosa-autocomplete__value formosa-autocomplete__value--item", ...je, children: [
              ve,
              !f && !Z && /* @__PURE__ */ g.jsxs(
                "button",
                {
                  className: `formosa-autocomplete__value__remove ${K}`.trim(),
                  "data-index": W,
                  onClick: vr,
                  ref: S,
                  type: "button",
                  ...Oe,
                  children: [
                    /* @__PURE__ */ g.jsx(at, { "aria-hidden": "true", height: F, width: M, ...Be }),
                    V
                  ]
                }
              )
            ] }, oe);
          }),
          Or && /* @__PURE__ */ g.jsx("li", { className: "formosa-autocomplete__value formosa-autocomplete__value--input", children: /* @__PURE__ */ g.jsx(
            "input",
            {
              ...b,
              autoComplete: "off",
              className: `formosa-field__input formosa-autocomplete__input ${w}`.trim(),
              id: d || E,
              onChange: mr,
              onFocus: yr,
              onKeyDown: hr,
              onKeyUp: gr,
              placeholder: ee,
              ref: q,
              type: "text",
              value: se
            }
          ) })
        ] }),
        $e && me.length > 0 && /* @__PURE__ */ g.jsx("ul", { className: `formosa-autocomplete__options ${J}`.trim(), ...y, children: me.map((L, W) => {
          let oe = ["formosa-autocomplete__option"];
          we === W && oe.push("formosa-autocomplete__option--highlighted"), oe = oe.join(" ");
          let pe = L.value, ye = !1;
          typeof pe == "object" && (ye = !0, pe = JSON.stringify(pe));
          let ve = "";
          N ? ve = N(L) : L && Object.prototype.hasOwnProperty.call(L, "label") && (ve = L.label);
          let je = {};
          typeof H == "function" ? je = H(L) : H && typeof H == "object" && (je = H);
          let Oe = {};
          return typeof _ == "function" ? Oe = _(L) : _ && typeof _ == "object" && (Oe = _), /* @__PURE__ */ g.jsx(
            "li",
            {
              className: `${oe} ${Y}`.trim(),
              ...je,
              children: /* @__PURE__ */ g.jsx(
                "button",
                {
                  className: `formosa-autocomplete__option__button ${P}`.trim(),
                  "data-json": ye,
                  "data-value": pe,
                  onClick: br,
                  type: "button",
                  ...Oe,
                  children: ve
                }
              )
            },
            pe
          );
        }) }),
        gt && /* @__PURE__ */ g.jsx("div", { children: /* @__PURE__ */ g.jsxs(
          "button",
          {
            className: `formosa-autocomplete__clear ${a}`.trim(),
            onClick: jr,
            ref: k,
            type: "button",
            ...n,
            children: [
              /* @__PURE__ */ g.jsx(at, { "aria-hidden": "true", height: c, width: l, ...o }),
              O
            ]
          }
        ) }),
        /* @__PURE__ */ g.jsx(
          "input",
          {
            ...I,
            name: E,
            ref: B,
            type: "hidden",
            value: se
          }
        )
      ]
    }
  );
}
Gt.propTypes = {
  afterAdd: e.func,
  afterChange: e.func,
  clearable: e.bool,
  clearButtonAttributes: e.object,
  clearButtonClassName: e.string,
  clearIconAttributes: e.object,
  clearIconHeight: e.number,
  clearIconWidth: e.number,
  clearText: e.string,
  disabled: e.bool,
  id: e.string,
  inputAttributes: e.object,
  inputClassName: e.string,
  labelFn: e.func,
  labelKey: e.oneOfType([
    e.func,
    e.string
  ]),
  loadingText: e.string,
  max: e.number,
  name: e.string,
  optionButtonAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  optionButtonClassName: e.string,
  optionLabelFn: e.func,
  optionListAttributes: e.object,
  optionListClassName: e.string,
  optionListItemAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  optionListItemClassName: e.string,
  options: e.oneOfType([
    e.array,
    e.object
  ]),
  placeholder: e.string,
  readOnly: e.bool,
  removeButtonAttributes: e.object,
  removeButtonClassName: e.string,
  removeIconAttributes: e.object,
  removeIconHeight: e.number,
  removeIconWidth: e.number,
  removeText: e.string,
  setValue: e.func,
  showLoading: e.bool,
  url: e.string,
  value: e.oneOfType([
    e.arrayOf(e.number),
    e.arrayOf(e.object),
    e.arrayOf(e.string),
    e.number,
    e.object,
    e.string
  ]),
  valueKey: e.oneOfType([
    e.func,
    e.string
  ]),
  valueListItemAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
function Xt({
  afterChange: t = null,
  className: r = "",
  iconAttributes: s = null,
  iconClassName: n = "",
  iconHeight: a = 16,
  iconWidth: o = 16,
  id: c = null,
  name: l = "",
  setValue: O = null,
  value: f = null,
  ...d
}) {
  const { formState: b, setValues: w } = ae(fe);
  let p = !1;
  if (O !== null)
    p = f;
  else {
    if (b === void 0)
      throw new Error("<Checkbox> component must be inside a <Form> component.");
    p = !!re(b.row, l);
  }
  const h = (j) => {
    const E = j.target.checked;
    O ? O(E, j) : w(j, l, E, t);
  }, u = {};
  return (c || l) && (u.id = c || l), l && (u.name = l), /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(
      "input",
      {
        className: `formosa-field__input formosa-field__input--checkbox ${r}`.trim(),
        checked: p,
        onChange: h,
        type: "checkbox",
        ...u,
        ...d
      }
    ),
    /* @__PURE__ */ g.jsx(
      zt,
      {
        "aria-hidden": "true",
        className: `formosa-icon--check ${n}`.trim(),
        height: a,
        width: o,
        ...s
      }
    )
  ] });
}
Xt.propTypes = {
  afterChange: e.func,
  className: e.string,
  iconAttributes: e.object,
  iconClassName: e.string,
  iconHeight: e.number,
  iconWidth: e.number,
  id: e.string,
  name: e.string,
  setValue: e.func,
  value: e.bool
};
function Zt({
  afterChange: t = null,
  className: r = "",
  disabled: s = !1,
  fieldsetAttributes: n = null,
  fieldsetClassName: a = "",
  iconAttributes: o = null,
  iconClassName: c = "",
  iconHeight: l = 16,
  iconWidth: O = 16,
  inputAttributes: f = null,
  itemAttributes: d = null,
  itemClassName: b = "",
  itemLabelAttributes: w = null,
  itemLabelClassName: p = "",
  itemSpanAttributes: h = null,
  itemSpanClassName: u = "",
  labelKey: j = "name",
  legend: E = "",
  loadingText: _ = "Loading...",
  name: P = "",
  options: N = null,
  readOnly: y = !1,
  setValue: J = null,
  showLoading: H = !1,
  url: Y = null,
  value: Q = null,
  valueKey: ee = null,
  ...Z
}) {
  const { formState: z, setValues: K } = ae(fe), [U, F] = ne(N ? ue(N, j, ee) : []), [M, V] = ne(H || !!Y), [$, D] = ne(""), m = ce.instance();
  if (le(() => {
    Y && m(Y, !1).catch((v) => {
      Object.prototype.hasOwnProperty.call(v, "errors") && (D(v.errors.map((A) => A.title).join(" ")), V(!1));
    }).then((v) => {
      v && (F(ue(v, j, ee)), V(!1));
    });
  }, [Y]), le(() => {
    F(N ? ue(N, j, ee) : []);
  }, [N]), le(() => {
    V(H);
  }, [H]), M)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-spinner", role: "status", children: _ });
  if ($)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-field__error", children: $ });
  let i = [];
  if (J !== null)
    i = Q;
  else {
    if (z === void 0)
      throw new Error("<CheckboxList> component must be inside a <Form> component.");
    i = re(z.row, P);
  }
  (i == null || i === "") && (i = []);
  const T = i.map((v) => typeof v == "object" ? JSON.stringify(v) : v), C = (v) => {
    const A = [...i];
    let I = v.target.value;
    if (v.target.checked)
      v.target.getAttribute("data-json") === "true" && (I = JSON.parse(I)), A.push(I);
    else {
      const R = T.indexOf(I);
      R > -1 && A.splice(R, 1);
    }
    J ? J(A, v) : K(v, P, A, t);
  };
  return /* @__PURE__ */ g.jsxs("fieldset", { className: `formosa-radio ${a}`.trim(), ...n, children: [
    /* @__PURE__ */ g.jsx("legend", { className: "formosa-radio__legend", children: E }),
    U.map((v) => {
      let A = v.value, I = !1;
      typeof A == "object" && (I = !0, A = JSON.stringify(A));
      const R = T.includes(A);
      let x = {};
      typeof d == "function" ? x = d(v) : d && typeof d == "object" && (x = d);
      let k = {};
      typeof w == "function" ? k = w(v) : w && typeof w == "object" && (k = w);
      let q = {};
      typeof f == "function" ? q = f(v) : f && typeof f == "object" && (q = f), I && (q["data-json"] = !0), P && (q.name = `${P}[]`);
      let B = {};
      typeof o == "function" ? B = o(v) : o && typeof o == "object" && (B = o);
      let S = {};
      return typeof h == "function" ? S = h(v) : h && typeof h == "object" && (S = h), /* @__PURE__ */ g.jsx("div", { className: `formosa-radio__item ${b}`.trim(), ...x, children: /* @__PURE__ */ g.jsxs(
        "label",
        {
          className: `formosa-radio__label${R ? " formosa-radio__label--checked" : ""} ${p}`.trim(),
          ...k,
          children: [
            /* @__PURE__ */ g.jsx(
              "input",
              {
                "aria-label": v.label,
                checked: R,
                className: `formosa-field__input formosa-field__input--checkbox ${r}`.trim(),
                disabled: s,
                onChange: C,
                readOnly: y,
                value: A,
                ...q,
                ...Z,
                type: "checkbox"
              }
            ),
            /* @__PURE__ */ g.jsx(
              zt,
              {
                "aria-hidden": "true",
                className: `formosa-icon--check ${c}`.trim(),
                height: l,
                width: O,
                ...B
              }
            ),
            /* @__PURE__ */ g.jsx("span", { "aria-hidden": "true", className: `formosa-radio__span ${u}`.trim(), ...S, children: v.label })
          ]
        }
      ) }, A);
    })
  ] });
}
Zt.propTypes = {
  afterChange: e.func,
  className: e.string,
  disabled: e.bool,
  fieldsetAttributes: e.object,
  fieldsetClassName: e.string,
  iconAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  iconClassName: e.string,
  iconHeight: e.number,
  iconWidth: e.number,
  inputAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemClassName: e.string,
  itemLabelAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemLabelClassName: e.string,
  itemSpanAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemSpanClassName: e.string,
  labelKey: e.oneOfType([
    e.func,
    e.string
  ]),
  legend: e.string,
  loadingText: e.string,
  name: e.string,
  options: e.oneOfType([
    e.array,
    e.object
  ]),
  readOnly: e.bool,
  setValue: e.func,
  showLoading: e.bool,
  url: e.string,
  value: e.oneOfType([
    e.arrayOf(e.number),
    e.arrayOf(e.object),
    e.arrayOf(e.string)
  ]),
  valueKey: e.oneOfType([
    e.func,
    e.string
  ])
};
function Qt({
  afterChange: t = null,
  buttonAttributes: r = null,
  buttonClassName: s = "",
  className: n = "",
  disabled: a = !1,
  emptyText: o = "No file selected.",
  id: c = "",
  imageAttributes: l = null,
  imageClassName: O = "",
  imageHeight: f = 100,
  imagePrefix: d = "",
  imagePreview: b = !1,
  inputWrapperAttributes: w = null,
  inputWrapperClassName: p = "",
  linkAttributes: h = null,
  linkClassName: u = "",
  linkImage: j = !1,
  multiple: E = !1,
  name: _ = "",
  readOnly: P = !1,
  removeText: N = "Remove",
  required: y = !1,
  setValue: J = null,
  value: H = null,
  wrapperAttributes: Y = null,
  wrapperClassName: Q = "",
  ...ee
}) {
  const { formState: Z, setValues: z } = ae(fe), K = Ce(null);
  let U = "";
  if (J !== null)
    U = H;
  else {
    if (Z === void 0)
      throw new Error("<File> component must be inside a <Form> component.");
    U = re(Z.row, _);
  }
  U == null && (U = "");
  const F = E ? U.length > 0 : !!U, M = (x) => {
    if (x instanceof FileList) {
      const k = x.length, q = [];
      let B;
      for (B = 0; B < k; B += 1)
        q.push(x.item(B).name);
      return q.join(", ");
    }
    return Array.isArray(x) ? x.join(", ") : typeof x == "object" ? x.name : x;
  }, V = (x) => {
    const k = [];
    if (x instanceof FileList) {
      const q = x.length;
      let B;
      for (B = 0; B < q; B += 1)
        k.push(URL.createObjectURL(x.item(B)));
    } else {
      if (Array.isArray(x))
        return x.map((q) => `${d}${q}`);
      typeof x == "object" ? k.push(URL.createObjectURL(x)) : typeof x == "string" && k.push(`${d}${x}`);
    }
    return k;
  }, [$, D] = ne(M(U)), [m, i] = ne(V(U));
  le(() => {
    D(M(U)), i(V(U));
  }, [U]);
  const T = (x) => {
    const k = E ? x.target.files : x.target.files.item(0);
    D(M(k)), b && i(V(k)), J ? J(k, x) : z(x, _, k, t, k);
  }, C = (x) => {
    D("");
    const k = "";
    J ? J(k, x) : z(x, _, k, t, k), K.current.focus();
  };
  let v = p;
  F && !a && !P && (v += " formosa-prefix");
  const A = {};
  (c || _) && (A.id = c || _);
  const I = {};
  _ && (I.name = _);
  const R = {};
  return (c || _) && (R.id = `${c || _}-remove`), /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    F && b && m.map((x) => {
      const k = /* @__PURE__ */ g.jsx(
        "img",
        {
          alt: "",
          className: `formosa-file-image ${O}`.trim(),
          height: f,
          src: x,
          ...l
        },
        x
      );
      return j ? /* @__PURE__ */ g.jsx("a", { className: `formosa-file-link ${u}`.trim(), href: x, ...h, children: k }, x) : k;
    }),
    /* @__PURE__ */ g.jsxs("div", { className: `formosa-file-wrapper ${Q}`.trim(), ...Y, children: [
      /* @__PURE__ */ g.jsxs("div", { className: `formosa-file-input-wrapper ${v}`.trim(), ...w, children: [
        /* @__PURE__ */ g.jsx(
          "div",
          {
            className: `formosa-file-name${$ ? "" : " formosa-file-name--empty"}`,
            id: `${c || _}-name`,
            children: $ || o
          }
        ),
        !P && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
          /* @__PURE__ */ g.jsx(
            "input",
            {
              className: `formosa-field__input formosa-field__input--file ${n}`.trim(),
              disabled: a,
              multiple: E,
              onChange: T,
              ref: K,
              type: "file",
              ...A,
              ...ee
            }
          ),
          /* @__PURE__ */ g.jsx(
            "input",
            {
              disabled: a,
              required: y,
              type: "hidden",
              value: U,
              ...I
            }
          )
        ] })
      ] }),
      F && !a && !P && /* @__PURE__ */ g.jsx(
        "button",
        {
          className: `formosa-button formosa-button--remove-file formosa-postfix ${s}`.trim(),
          onClick: C,
          type: "button",
          ...R,
          ...r,
          children: N
        }
      )
    ] })
  ] });
}
Qt.propTypes = {
  afterChange: e.func,
  buttonAttributes: e.object,
  buttonClassName: e.string,
  className: e.string,
  disabled: e.bool,
  emptyText: e.string,
  id: e.string,
  imageAttributes: e.object,
  imageClassName: e.string,
  imageHeight: e.number,
  imagePrefix: e.string,
  imagePreview: e.bool,
  inputWrapperAttributes: e.object,
  inputWrapperClassName: e.string,
  linkAttributes: e.object,
  linkClassName: e.string,
  linkImage: e.bool,
  multiple: e.bool,
  name: e.string,
  readOnly: e.bool,
  removeText: e.string,
  required: e.bool,
  setValue: e.func,
  value: e.oneOfType([
    e.array,
    e.object,
    e.string
  ]),
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
function ut({
  children: t,
  condition: r = !1,
  ...s
}) {
  return r ? /* @__PURE__ */ g.jsx("div", { ...s, children: t }) : t;
}
ut.propTypes = {
  children: e.node.isRequired,
  condition: e.any
};
function Ue({
  afterChange: t = null,
  className: r = "",
  id: s = null,
  name: n = "",
  setValue: a = null,
  suffix: o = "",
  type: c = "text",
  value: l = null,
  ...O
}) {
  const { formState: f, setValues: d } = ae(fe);
  let b = "";
  if (a !== null)
    b = l;
  else {
    if (f === void 0)
      throw new Error("<Input> component must be inside a <Form> component.");
    c !== "file" && (b = re(f.row, n), b == null && (b = ""));
  }
  const w = (h) => {
    const u = h.target.value;
    a ? a(u, h) : d(h, n, u, t);
  }, p = {};
  return (s || n) && (p.id = s || n), n && (p.name = n), /* @__PURE__ */ g.jsxs(ut, { className: "formosa-suffix-container", condition: o, children: [
    /* @__PURE__ */ g.jsx(
      "input",
      {
        className: `formosa-field__input ${r}`.trim(),
        onChange: w,
        type: c,
        value: b,
        ...p,
        ...O
      }
    ),
    o && /* @__PURE__ */ g.jsx("span", { className: "formosa-suffix", children: o })
  ] });
}
Ue.propTypes = {
  afterChange: e.func,
  className: e.string,
  id: e.string,
  name: e.string,
  setValue: e.func,
  suffix: e.string,
  type: e.string,
  value: e.oneOfType([
    e.number,
    e.string
  ])
};
function Kt({
  buttonAttributes: t = null,
  buttonClassName: r = "",
  className: s = "",
  hideAria: n = "Hide Password",
  hideText: a = "Hide",
  showAria: o = "Show Password",
  showText: c = "Show",
  wrapperAttributes: l = null,
  wrapperClassName: O = "",
  ...f
}) {
  const [d, b] = ne("password"), w = () => {
    b(d === "password" ? "text" : "password");
  };
  return /* @__PURE__ */ g.jsxs("div", { className: `formosa-password-wrapper ${O}`.trim(), ...l, children: [
    /* @__PURE__ */ g.jsx(
      Ue,
      {
        className: `formosa-field__input--password formosa-prefix ${s}`.trim(),
        spellCheck: "false",
        ...f,
        type: d
      }
    ),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        "aria-controls": f.id || f.name,
        "aria-label": d === "password" ? o : n,
        className: `formosa-button formosa-button--toggle-password formosa-postfix ${r}`.trim(),
        onClick: w,
        type: "button",
        ...t,
        children: d === "password" ? c : a
      }
    )
  ] });
}
Kt.propTypes = {
  buttonAttributes: e.object,
  buttonClassName: e.string,
  className: e.string,
  hideAria: e.string,
  hideText: e.string,
  showAria: e.string,
  showText: e.string,
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
function er({
  afterChange: t = null,
  className: r = "",
  fieldsetAttributes: s = null,
  fieldsetClassName: n = "",
  inputAttributes: a = null,
  itemAttributes: o = null,
  itemClassName: c = "",
  itemLabelAttributes: l = null,
  itemLabelClassName: O = "",
  itemSpanAttributes: f = null,
  itemSpanClassName: d = "",
  labelKey: b = "name",
  legend: w = "",
  loadingText: p = "Loading...",
  name: h = "",
  options: u = null,
  required: j = !1,
  setValue: E = null,
  showLoading: _ = !1,
  url: P = null,
  value: N = null,
  valueKey: y = null,
  ...J
}) {
  const { formState: H, setValues: Y } = ae(fe), [Q, ee] = ne(u ? ue(u, b, y) : []), [Z, z] = ne(_ || !!P), [K, U] = ne(""), F = ce.instance();
  if (le(() => {
    P && F(P, !1).catch(($) => {
      Object.prototype.hasOwnProperty.call($, "errors") && (U($.errors.map((D) => D.title).join(" ")), z(!1));
    }).then(($) => {
      $ && (ee(ue($, b, y)), z(!1));
    });
  }, [P]), le(() => {
    ee(u ? ue(u, b, y) : []);
  }, [u]), le(() => {
    z(_);
  }, [_]), Z)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-spinner", role: "status", children: p });
  if (K)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-field__error", children: K });
  let M = "";
  if (E !== null)
    M = N;
  else {
    if (H === void 0)
      throw new Error("<Radio> component must be inside a <Form> component.");
    M = re(H.row, h);
  }
  M == null && (M = ""), typeof M == "object" && (M = JSON.stringify(M));
  const V = ($) => {
    let D = $.target.value;
    $.target.getAttribute("data-json") === "true" && (D = JSON.parse(D)), E ? E(D, $) : Y($, h, D, t);
  };
  return /* @__PURE__ */ g.jsxs("fieldset", { className: `formosa-radio ${n}`.trim(), ...s, children: [
    /* @__PURE__ */ g.jsx("legend", { className: "formosa-radio__legend", children: w }),
    Q.map(($) => {
      let D = $.value, m = !1;
      typeof D == "object" && (m = !0, D = JSON.stringify(D));
      const i = M === D;
      let T = {};
      typeof o == "function" ? T = o($) : o && typeof o == "object" && (T = o);
      let C = {};
      typeof l == "function" ? C = l($) : l && typeof l == "object" && (C = l);
      let v = {};
      typeof a == "function" ? v = a($) : a && typeof a == "object" && (v = a), m && (v["data-json"] = !0), h && (v.name = h);
      let A = {};
      return typeof f == "function" ? A = f($) : f && typeof f == "object" && (A = f), /* @__PURE__ */ g.jsx("div", { className: `formosa-radio__item ${c}`.trim(), ...T, children: /* @__PURE__ */ g.jsxs(
        "label",
        {
          className: `formosa-radio__label${i ? " formosa-radio__label--checked" : ""} ${O}`.trim(),
          ...C,
          children: [
            /* @__PURE__ */ g.jsx(
              "input",
              {
                "aria-label": $.label,
                checked: i,
                className: `formosa-field__input formosa-radio__input ${r}`.trim(),
                onChange: V,
                required: j,
                type: "radio",
                value: D,
                ...v,
                ...J
              }
            ),
            /* @__PURE__ */ g.jsx("span", { "aria-hidden": "true", className: `formosa-radio__span ${d}`.trim(), ...A, children: $.label })
          ]
        }
      ) }, D);
    })
  ] });
}
er.propTypes = {
  afterChange: e.func,
  className: e.string,
  fieldsetAttributes: e.object,
  fieldsetClassName: e.string,
  inputAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemClassName: e.string,
  itemLabelAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemLabelClassName: e.string,
  itemSpanAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  itemSpanClassName: e.string,
  label: e.string,
  labelKey: e.oneOfType([
    e.func,
    e.string
  ]),
  legend: e.string,
  loadingText: e.string,
  name: e.string,
  options: e.oneOfType([
    e.array,
    e.object
  ]),
  required: e.bool,
  setValue: e.func,
  showLoading: e.bool,
  url: e.string,
  value: e.oneOfType([
    e.number,
    e.object,
    e.string
  ]),
  valueKey: e.oneOfType([
    e.func,
    e.string
  ])
};
const Hr = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z" }));
function tr({
  className: t = "",
  iconAttributes: r = null,
  iconClassName: s = "",
  iconHeight: n = 16,
  iconWidth: a = 16,
  wrapperAttributes: o = null,
  wrapperClassName: c = "",
  ...l
}) {
  return /* @__PURE__ */ g.jsxs("div", { className: `formosa-search-wrapper ${c}`.trim(), ...o, children: [
    /* @__PURE__ */ g.jsx(
      Ue,
      {
        className: `formosa-field__input--search ${t}`.trim(),
        ...l
      }
    ),
    /* @__PURE__ */ g.jsx(
      Hr,
      {
        "aria-hidden": "true",
        className: `formosa-icon--search ${s}`.trim(),
        height: n,
        width: a,
        ...r
      }
    )
  ] });
}
tr.propTypes = {
  className: e.string,
  iconAttributes: e.object,
  iconClassName: e.string,
  iconHeight: e.number,
  iconWidth: e.number,
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
const Gr = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M0 2l4 4 4-4H0z" }));
function rr({
  afterChange: t = null,
  className: r = "",
  hideBlank: s = !1,
  iconAttributes: n = null,
  iconClassName: a = "",
  iconHeight: o = 16,
  iconWidth: c = 16,
  id: l = null,
  labelKey: O = "name",
  loadingText: f = "Loading...",
  multiple: d = !1,
  name: b = "",
  optionAttributes: w = null,
  options: p = null,
  setValue: h = null,
  showLoading: u = !1,
  url: j = null,
  value: E = null,
  valueKey: _ = null,
  wrapperAttributes: P = null,
  wrapperClassName: N = "",
  ...y
}) {
  const { formState: J, setValues: H } = ae(fe), [Y, Q] = ne(p ? ue(p, O, _) : []), [ee, Z] = ne(u || !!j), [z, K] = ne(""), U = ce.instance();
  if (le(() => {
    j && U(j, !1).catch(($) => {
      Object.prototype.hasOwnProperty.call($, "errors") && (K($.errors.map((D) => D.title).join(" ")), Z(!1));
    }).then(($) => {
      $ && (Q(ue($, O, _)), Z(!1));
    });
  }, [j]), le(() => {
    Q(p ? ue(p, O, _) : []);
  }, [p]), le(() => {
    Z(u);
  }, [u]), ee)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-spinner", role: "status", children: f });
  if (z)
    return /* @__PURE__ */ g.jsx("div", { className: "formosa-field__error", children: z });
  let F = d ? [] : "";
  if (h !== null)
    F = E;
  else {
    if (J === void 0)
      throw new Error("<Select> component must be inside a <Form> component.");
    F = re(J.row, b);
  }
  F == null && (F = d ? [] : ""), typeof F == "object" && !d && (F = JSON.stringify(F));
  const M = ($) => {
    let D;
    d ? D = Array.from($.target.options).filter((m) => m.selected).map((m) => m.value) : (D = $.target.value, $.target.querySelector(`[value="${D.replace(/"/g, '\\"')}"]`).getAttribute("data-json") === "true" && (D = JSON.parse(D))), h ? h(D, $) : H($, b, D, t);
  }, V = {};
  return (l || b) && (V.id = l || b), b && (V.name = b), d && (V.multiple = !0), /* @__PURE__ */ g.jsxs("div", { className: `formosa-select-wrapper ${N}`.trim(), ...P, children: [
    /* @__PURE__ */ g.jsxs(
      "select",
      {
        className: `formosa-field__input formosa-field__input--select ${r}`.trim(),
        onChange: M,
        value: F,
        ...V,
        ...y,
        children: [
          !s && !d && /* @__PURE__ */ g.jsx("option", { value: "" }),
          Y.map(($) => {
            let D = $.value, m = !1;
            typeof D == "object" && (m = !0, D = JSON.stringify(D));
            let i = {};
            return typeof w == "function" ? i = w($) : w && typeof w == "object" && (i = w), m && (i["data-json"] = !0), /* @__PURE__ */ g.jsx("option", { value: D, ...i, children: $.label }, D);
          })
        ]
      }
    ),
    !d && /* @__PURE__ */ g.jsx(
      Gr,
      {
        "aria-hidden": "true",
        className: `formosa-icon--caret ${a}`.trim(),
        height: o,
        width: c,
        ...n
      }
    )
  ] });
}
rr.propTypes = {
  afterChange: e.func,
  className: e.string,
  hideBlank: e.bool,
  iconAttributes: e.object,
  iconClassName: e.string,
  iconHeight: e.number,
  iconWidth: e.number,
  id: e.string,
  labelKey: e.oneOfType([
    e.func,
    e.string
  ]),
  loadingText: e.string,
  multiple: e.bool,
  name: e.string,
  optionAttributes: e.oneOfType([
    e.func,
    e.object
  ]),
  options: e.oneOfType([
    e.array,
    e.object
  ]),
  setValue: e.func,
  showLoading: e.bool,
  url: e.string,
  value: e.oneOfType([
    e.number,
    e.object,
    e.string
  ]),
  valueKey: e.oneOfType([
    e.func,
    e.string
  ]),
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
function nr({
  afterChange: t = null,
  className: r = "",
  id: s = null,
  name: n = "",
  setValue: a = null,
  value: o = null,
  ...c
}) {
  const { formState: l, setValues: O } = ae(fe);
  let f = "";
  if (a !== null)
    f = o;
  else {
    if (l === void 0)
      throw new Error("<Textarea> component must be inside a <Form> component.");
    f = re(l.row, n);
  }
  f == null && (f = "");
  const d = (w) => {
    const p = w.target.value;
    a ? a(p, w) : O(w, n, p, t);
  }, b = {};
  return (s || n) && (b.id = s || n), n && (b.name = n), /* @__PURE__ */ g.jsx(
    "textarea",
    {
      className: `formosa-field__input formosa-field__input--textarea ${r}`.trim(),
      onChange: d,
      value: f,
      ...b,
      ...c
    }
  );
}
nr.propTypes = {
  afterChange: e.func,
  className: e.string,
  id: e.string,
  name: e.string,
  setValue: e.func,
  value: e.string
};
const sr = (t, r) => r || (t === "select" ? rr : t === "textarea" ? nr : t === "radio" ? er : t === "checkbox" ? Xt : t === "password" ? Kt : t === "search" ? tr : t === "autocomplete" ? Gt : t === "file" ? Qt : t === "checkbox-list" ? Zt : Ue);
function Xr({
  component: t = null,
  type: r = "text",
  ...s
}) {
  const n = sr(r, t);
  return /* @__PURE__ */ g.jsx(n, { type: r, ...s });
}
Xr.propTypes = {
  component: e.func,
  type: e.string
};
function or({
  className: t = "",
  htmlFor: r = "",
  label: s = "",
  note: n = "",
  required: a = !1,
  type: o = "",
  ...c
}) {
  let l = "formosa-label";
  a && (l += " formosa-label--required");
  let O = "formosa-label-wrapper";
  o === "checkbox" && (O += " formosa-label-wrapper--checkbox");
  const f = ["radio", "checkbox-list"].includes(o), d = {};
  return r && !f && (d.htmlFor = r), f && (d["aria-hidden"] = !0), /* @__PURE__ */ g.jsxs("div", { className: O, children: [
    /* @__PURE__ */ g.jsx("label", { className: `${l} ${t}`.trim(), ...d, ...c, children: s }),
    n && /* @__PURE__ */ g.jsx("span", { className: "formosa-label__note", children: n })
  ] });
}
or.propTypes = {
  className: e.string,
  htmlFor: e.string,
  label: e.string,
  note: e.string,
  required: e.bool,
  type: e.string
};
function Zr({
  component: t = null,
  disabled: r = !1,
  id: s = null,
  inputInnerWrapperAttributes: n = {},
  inputInnerWrapperClassName: a = "",
  inputWrapperAttributes: o = {},
  inputWrapperClassName: c = "",
  label: l = "",
  labelAttributes: O = {},
  labelClassName: f = "",
  labelNote: d = "",
  labelPosition: b = "before",
  name: w = "",
  note: p = "",
  prefix: h = null,
  postfix: u = null,
  readOnly: j = !1,
  required: E = !1,
  suffix: _ = "",
  type: P = "text",
  wrapperAttributes: N = {},
  wrapperClassName: y = "",
  ...J
}) {
  const { formState: H } = ae(fe), Y = { ...J };
  s && (Y.id = s), w && (Y.name = w), r && (Y.disabled = r), j && (Y.readOnly = j), E && (Y.required = E), _ && (Y.suffix = _), P && (Y.type = P, j && P === "number" && (Y.type = "text"), ["radio", "checkbox-list"].includes(P) && !Y.legend && (Y.legend = l));
  const Q = sr(P, t), ee = /* @__PURE__ */ g.jsx(Q, { ...Y });
  if (P === "hidden")
    return ee;
  const Z = s || w, z = /* @__PURE__ */ g.jsx(
    or,
    {
      className: f,
      htmlFor: Z,
      label: l,
      note: d,
      required: E,
      type: P,
      ...O
    }
  ), K = H && w && Object.prototype.hasOwnProperty.call(H.errors, w), U = Z.replace(/[^a-z0-9_-]/gi, ""), F = ["formosa-field"];
  U && F.push(`formosa-field--${U}`), y && F.push(y), K && F.push("formosa-field--has-error"), r && F.push("formosa-field--disabled"), j && F.push("formosa-field--read-only"), h && F.push("formosa-field--has-prefix"), u && F.push("formosa-field--has-postfix"), b === "after" && F.push("formosa-field--label-after");
  const M = ["formosa-input-wrapper", `formosa-input-wrapper--${P}`];
  c && M.push(c), _ && M.push("formosa-field--has-suffix");
  const V = ["formosa-input-inner-wrapper"];
  return a && V.push(a), /* @__PURE__ */ g.jsxs("div", { className: F.join(" "), ...N, children: [
    l && b === "before" && z,
    l && b === "after" && /* @__PURE__ */ g.jsx("div", { className: "formosa-label-wrapper" }),
    /* @__PURE__ */ g.jsxs("div", { className: M.join(" "), ...o, children: [
      /* @__PURE__ */ g.jsxs(
        ut,
        {
          className: V.join(" "),
          condition: !!h || !!u,
          ...n,
          children: [
            h,
            ee,
            l && b === "after" && z,
            p && /* @__PURE__ */ g.jsx("div", { className: "formosa-field__note", children: p }),
            u
          ]
        }
      ),
      H && H.showInlineErrors && /* @__PURE__ */ g.jsx(Bt, { id: s, name: w })
    ] })
  ] });
}
Zr.propTypes = {
  component: e.func,
  disabled: e.bool,
  id: e.string,
  inputInnerWrapperAttributes: e.object,
  inputInnerWrapperClassName: e.string,
  inputWrapperAttributes: e.object,
  inputWrapperClassName: e.string,
  label: e.string,
  labelAttributes: e.object,
  labelClassName: e.string,
  labelNote: e.string,
  labelPosition: e.string,
  name: e.string,
  note: e.oneOfType([
    e.func,
    e.object,
    e.string
  ]),
  prefix: e.node,
  postfix: e.node,
  readOnly: e.bool,
  required: e.bool,
  suffix: e.string,
  type: e.string,
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
const Ne = de.createContext(
  {
    toasts: {},
    showWarningPrompt: !0,
    addToast: () => {
    },
    removeToast: () => {
    },
    disableWarningPrompt: () => {
    },
    enableWarningPrompt: () => {
    }
  }
);
/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
var nt, Ft;
function Qr() {
  return Ft || (Ft = 1, nt = function(r) {
    return typeof r == "object" ? r === null : typeof r != "function";
  }), nt;
}
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
var st, qt;
function Kr() {
  if (qt) return st;
  qt = 1;
  var t = Ht();
  function r(s) {
    return t(s) === !0 && Object.prototype.toString.call(s) === "[object Object]";
  }
  return st = function(n) {
    var a, o;
    return !(r(n) === !1 || (a = n.constructor, typeof a != "function") || (o = a.prototype, r(o) === !1) || o.hasOwnProperty("isPrototypeOf") === !1);
  }, st;
}
/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) Jon Schlinkert (https://github.com/jonschlinkert).
 * Released under the MIT License.
 */
var ot, Lt;
function en() {
  if (Lt) return ot;
  Lt = 1;
  const { deleteProperty: t } = Reflect, r = Qr(), s = Kr(), n = (p) => typeof p == "object" && p !== null || typeof p == "function", a = (p) => p === "__proto__" || p === "constructor" || p === "prototype", o = (p) => {
    if (!r(p))
      throw new TypeError("Object keys must be strings or symbols");
    if (a(p))
      throw new Error(`Cannot set unsafe key: "${p}"`);
  }, c = (p) => Array.isArray(p) ? p.flat().map(String).join(",") : p, l = (p, h) => {
    if (typeof p != "string" || !h) return p;
    let u = p + ";";
    return h.arrays !== void 0 && (u += `arrays=${h.arrays};`), h.separator !== void 0 && (u += `separator=${h.separator};`), h.split !== void 0 && (u += `split=${h.split};`), h.merge !== void 0 && (u += `merge=${h.merge};`), h.preservePaths !== void 0 && (u += `preservePaths=${h.preservePaths};`), u;
  }, O = (p, h, u) => {
    const j = c(h ? l(p, h) : p);
    o(j);
    const E = w.cache.get(j) || u();
    return w.cache.set(j, E), E;
  }, f = (p, h = {}) => {
    const u = h.separator || ".", j = u === "/" ? !1 : h.preservePaths;
    if (typeof p == "string" && j !== !1 && /\//.test(p))
      return [p];
    const E = [];
    let _ = "";
    const P = (N) => {
      let y;
      N.trim() !== "" && Number.isInteger(y = Number(N)) ? E.push(y) : E.push(N);
    };
    for (let N = 0; N < p.length; N++) {
      const y = p[N];
      if (y === "\\") {
        _ += p[++N];
        continue;
      }
      if (y === u) {
        P(_), _ = "";
        continue;
      }
      _ += y;
    }
    return _ && P(_), E;
  }, d = (p, h) => h && typeof h.split == "function" ? h.split(p) : typeof p == "symbol" ? [p] : Array.isArray(p) ? p : O(p, h, () => f(p, h)), b = (p, h, u, j) => {
    if (o(h), u === void 0)
      t(p, h);
    else if (j && j.merge) {
      const E = j.merge === "function" ? j.merge : Object.assign;
      E && s(p[h]) && s(u) ? p[h] = E(p[h], u) : p[h] = u;
    } else
      p[h] = u;
    return p;
  }, w = (p, h, u, j) => {
    if (!h || !n(p)) return p;
    const E = d(h, j);
    let _ = p;
    for (let P = 0; P < E.length; P++) {
      const N = E[P], y = E[P + 1];
      if (o(N), y === void 0) {
        b(_, N, u, j);
        break;
      }
      if (typeof y == "number" && !Array.isArray(_[N])) {
        _ = _[N] = [];
        continue;
      }
      n(_[N]) || (_[N] = {}), _ = _[N];
    }
    return p;
  };
  return w.split = d, w.cache = /* @__PURE__ */ new Map(), w.clear = () => {
    w.cache = /* @__PURE__ */ new Map();
  }, ot = w, ot;
}
var tn = en();
const he = /* @__PURE__ */ lt(tn), Re = (t) => ({
  id: t.id,
  type: t.type
}), rn = (t) => Array.isArray(t) ? t.map((r) => Re(r)) : Re(t), nn = (t) => {
  const r = Object.keys(t.attributes).length > 0;
  r || delete t.attributes;
  const s = Object.keys(t.relationships).length > 0;
  return s || delete t.relationships, !r && !s && !t.id.startsWith("temp-") ? null : t;
}, Ve = (t, r) => {
  const s = [];
  return t.forEach((n) => {
    if (n.startsWith(`${r}.`)) {
      const a = n.split(".");
      a.shift(), s.push(a.join("."));
    }
  }), s;
}, Mt = (t, r, s) => {
  let n = [];
  const a = Re(t);
  a.attributes = {}, a.relationships = {}, Object.keys(t).forEach((c) => {
    if (c !== "id" && c !== "type" && Object.prototype.hasOwnProperty.call(s, c))
      if (r.includes(c))
        if (Array.isArray(t[c])) {
          const l = [];
          t[c].forEach((O, f) => {
            if (typeof s[c][f] < "u") {
              const d = We(O, Ve(r, c), s[c][f]);
              n = n.concat(d);
            }
            l.push(Re(O));
          }), he(a.relationships, c, { data: l });
        } else {
          const l = We(t[c], Ve(r, c), s[c]), O = l.shift();
          n = n.concat(l), he(a.relationships, c, { data: O });
        }
      else
        he(a.attributes, c, t[c]);
  });
  const o = nn(a);
  return o !== null && n.unshift(o), n;
}, We = (t, r, s) => t.id.startsWith("temp-") ? Mt(t, r, s) : typeof s > "u" ? [] : Object.keys(s).length <= 0 ? [Re(t)] : Mt(t, r, s), sn = (t) => {
  const r = {};
  return t.forEach((s) => {
    const n = [];
    s.split(".").forEach((a) => {
      n.push(a), typeof re(r, n.join(".")) > "u" && he(r, n.join("."), {});
    });
  }), r;
}, on = (t, r, s) => {
  let n = [];
  if (r.length <= 0)
    return n;
  const a = sn(r);
  return Object.keys(a).forEach((o) => {
    if (Object.prototype.hasOwnProperty.call(t.relationships, o))
      if (Array.isArray(t.relationships[o].data))
        Object.keys(t.relationships[o].data).forEach((c) => {
          const l = t.relationships[o].data[c];
          if (l) {
            const O = We(l, Ve(s, o), a[o][c]);
            n = n.concat(O);
          }
        });
      else {
        const c = t.relationships[o].data;
        if (c) {
          const l = We(c, Ve(s, o), a[o]);
          n = n.concat(l);
        }
      }
  }), n.filter((o) => Object.keys(o).length > 2);
}, an = (t, r) => {
  if (Object.prototype.hasOwnProperty.call(t, r))
    return delete t[r];
  const s = r.split("."), n = s.pop();
  let a = t;
  return s.forEach((o) => {
    a = a[o];
  }), delete a[n];
}, ir = (t, r, s = "") => (Object.entries(t).forEach((n) => {
  const [a, o] = n, c = s ? `${s}[${a}]` : a;
  typeof o == "object" ? r = ir(o, r, c) : r.append(c, JSON.stringify(o));
}), r), ln = (t, r, s, n, a, o, c = null, l = null) => {
  let O = null;
  if (t === "PUT" || t === "POST") {
    const f = {
      type: r,
      attributes: {},
      relationships: {},
      meta: {}
    };
    t === "PUT" && s && (f.id = s);
    let d = { ...n.row };
    l && (d = l(d));
    const b = Object.keys(n.files);
    (t === "PUT" ? a : Object.keys(n.row)).forEach((u) => {
      const j = u.replace(/\..+$/, "");
      o.includes(j) ? f.relationships[j] = {
        data: re(d, j)
      } : o.includes(u) ? f.relationships[u] = {
        data: re(d, j)
      } : u.startsWith("meta.") ? he(f, u, re(d, u)) : u === "meta" ? f.meta = d.meta : b.includes(u) ? an(f.attributes, u) : he(f.attributes, u, re(d, u));
    }), O = { data: f };
    const p = on(f, a, o);
    p.length > 0 && (O.included = p), Object.keys(f.relationships).forEach((u) => {
      typeof f.relationships[u].data == "string" && (f.relationships[u].data === "" ? f.relationships[u].data = null : f.relationships[u].data = JSON.parse(f.relationships[u].data)), f.relationships[u].data && (f.relationships[u].data = rn(f.relationships[u].data));
    }), c && (O = c(O, n.row)), Object.keys(f.attributes).length <= 0 && delete f.attributes, Object.keys(f.meta).length <= 0 && delete f.meta, Object.keys(f.relationships).length <= 0 && delete f.relationships;
    const h = b.filter((u) => n.files[u] !== !1);
    if (h.length > 0) {
      const u = ir(O, new FormData());
      u.append("meta[files]", JSON.stringify(h)), h.forEach((j) => {
        Object.prototype.toString.call(n.files[j]) === "[object FileList]" ? Array.from(n.files[j]).forEach((E, _) => {
          u.append(`${j}[${_}]`, E);
        }) : u.append(j, n.files[j]);
      }), O = u;
    }
  }
  return O;
}, ie = [];
for (let t = 0; t < 256; ++t)
  ie.push((t + 256).toString(16).slice(1));
function cn(t, r = 0) {
  return (ie[t[r + 0]] + ie[t[r + 1]] + ie[t[r + 2]] + ie[t[r + 3]] + "-" + ie[t[r + 4]] + ie[t[r + 5]] + "-" + ie[t[r + 6]] + ie[t[r + 7]] + "-" + ie[t[r + 8]] + ie[t[r + 9]] + "-" + ie[t[r + 10]] + ie[t[r + 11]] + ie[t[r + 12]] + ie[t[r + 13]] + ie[t[r + 14]] + ie[t[r + 15]]).toLowerCase();
}
let it;
const fn = new Uint8Array(16);
function un() {
  if (!it) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    it = crypto.getRandomValues.bind(crypto);
  }
  return it(fn);
}
const pn = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Dt = { randomUUID: pn };
function Vt(t, r, s) {
  if (Dt.randomUUID && !t)
    return Dt.randomUUID();
  t = t || {};
  const n = t.random || (t.rng || un)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, cn(n);
}
function ar({
  afterNoSubmit: t = null,
  beforeSubmit: r = null,
  children: s = null,
  clearOnSubmit: n = !1,
  defaultRow: a = {},
  errorMessageText: o = "",
  errorToastText: c = "",
  filterBody: l = null,
  filterValues: O = null,
  htmlId: f = "",
  id: d = "",
  method: b = null,
  params: w = "",
  path: p = null,
  preventEmptyRequest: h = !1,
  preventEmptyRequestText: u = "No changes to save.",
  relationshipNames: j = [],
  showMessage: E = !0,
  successMessageText: _ = "",
  successToastText: P = "",
  ...N
}) {
  const { formState: y, setFormState: J, getDirtyKeys: H } = ae(fe), { addToast: Y } = ae(Ne), Q = (ee) => {
    ee.preventDefault();
    const Z = H();
    if (h && Z.length <= 0) {
      u && Y(u), t && t();
      return;
    }
    if (r && !r(ee))
      return;
    let z = p;
    d && (z = `${p}/${d}`), w && (z += `?${w}`);
    const K = ln(
      b,
      p,
      d,
      y,
      Z,
      j,
      l,
      O
    );
    J({
      ...y,
      alertClass: "",
      alertText: "",
      errors: {},
      response: null,
      toastClass: "",
      toastText: ""
    });
    const U = K instanceof FormData ? K : JSON.stringify(K);
    ce.request(b, z, U).catch((F) => {
      if (!Object.prototype.hasOwnProperty.call(F, "errors") || !Array.isArray(F.errors))
        throw F;
      const M = {};
      let V;
      F.errors.forEach(($) => {
        if (Object.prototype.hasOwnProperty.call($, "source")) {
          if (V = $.source.pointer.replace("/data/attributes/", ""), V = V.replace("/data/meta/", "meta."), V.startsWith("/included/")) {
            const D = V.replace(/^\/included\/(\d+)\/.+$/g, "$1"), m = K.included[parseInt(D, 10)];
            V = V.replace(/^\/included\/(\d+)\//g, `included.${m.type}.${m.id}.`);
          }
          V = V.replace(/\//g, "."), document.querySelector(`[data-name="${V}"].formosa-field__error`) || (V = "");
        } else
          V = "";
        Object.prototype.hasOwnProperty.call(M, V) || (M[V] = []), M[V].push($.title);
      }), J({
        ...y,
        alertClass: "error",
        alertText: typeof o == "function" ? o(F) : o,
        errors: M,
        response: F,
        toastClass: "error",
        toastText: typeof c == "function" ? c(F) : c,
        uuid: Vt()
      });
    }).then((F) => {
      if (!F)
        return;
      const M = {
        ...y,
        alertClass: "success",
        alertText: typeof _ == "function" ? _(F) : _,
        errors: {},
        response: F,
        toastClass: "success",
        toastText: typeof P == "function" ? P(F) : P,
        uuid: Vt()
      };
      n ? (M.originalRow = JSON.parse(JSON.stringify(a)), M.row = JSON.parse(JSON.stringify(a)), y.setRow && y.setRow(M.row)) : M.originalRow = JSON.parse(JSON.stringify(y.row)), J(M);
    });
  };
  return b && p && !Object.prototype.hasOwnProperty.call(N, "onSubmit") && (N.onSubmit = Q), f && (N.id = f), /* @__PURE__ */ g.jsxs("form", { ...N, children: [
    E && y.alertText && /* @__PURE__ */ g.jsx(ft, { type: y.alertClass, children: y.alertText }),
    s
  ] });
}
ar.propTypes = {
  afterNoSubmit: e.func,
  beforeSubmit: e.func,
  children: e.node,
  clearOnSubmit: e.bool,
  defaultRow: e.object,
  errorMessageText: e.oneOfType([
    e.func,
    e.string
  ]),
  errorToastText: e.oneOfType([
    e.func,
    e.string
  ]),
  filterBody: e.func,
  filterValues: e.func,
  htmlId: e.string,
  id: e.string,
  method: e.string,
  params: e.string,
  path: e.string,
  preventEmptyRequest: e.bool,
  preventEmptyRequestText: e.oneOfType([
    e.bool,
    e.string
  ]),
  relationshipNames: e.array,
  showMessage: e.bool,
  successMessageText: e.oneOfType([
    e.func,
    e.string
  ]),
  successToastText: e.oneOfType([
    e.func,
    e.string
  ])
};
function dn({
  afterSubmitFailure: t = null,
  afterSubmitSuccess: r = null,
  children: s = null,
  row: n = {},
  setRow: a = null,
  showInlineErrors: o = !0,
  ...c
}) {
  const { addToast: l } = ae(Ne), O = (h, u, j, E) => {
    const _ = { ...h.originalRow };
    he(_, j, E), u({
      ...h,
      originalRow: JSON.parse(JSON.stringify(_))
      // Deep copy.
    });
  }, [f, d] = ne({
    alertClass: "",
    alertText: "",
    errors: {},
    files: {},
    originalRow: JSON.parse(JSON.stringify(n)),
    // Deep copy.
    row: n,
    response: null,
    setOriginalValue: O,
    setRow: a,
    showInlineErrors: o,
    toastClass: "",
    toastText: "",
    uuid: null
  });
  le(() => {
    JSON.stringify(n) !== JSON.stringify(f.row) && d({
      ...f,
      row: n
    });
  }), le(() => {
    f.uuid && (f.toastText && l(f.toastText, f.toastClass), f.alertClass === "success" && r ? r(f.response, f, d) : f.alertClass === "error" && t && t(f.response, f, d));
  }, [f.uuid]);
  const b = (h, u) => {
    let j = [];
    return Object.keys(h).forEach((E) => {
      let _ = re(u, E), P = re(h, E);
      if (Array.isArray(_) || Array.isArray(P)) {
        let y;
        Object.keys(P).forEach((J) => {
          const H = _ ? _.findIndex((Y) => Y.id === P[J].id) : -1;
          y = b(P[J], H > -1 ? _[H] : {}), y = y.map((Y) => `${E}.${J}.${Y}`), j = j.concat(y);
        });
      }
      typeof _ != "string" && (_ = JSON.stringify(_)), typeof P != "string" && (P = JSON.stringify(P)), P !== _ && j.push(E);
    }), j;
  }, w = (h, u, j, E = null, _ = null) => {
    const P = { ...f.row };
    if (he(P, u, j), E) {
      const y = E(h, P, j);
      Object.keys(y).forEach((J) => {
        he(P, J, y[J]);
      });
    }
    const N = {
      ...f,
      row: P
    };
    _ !== null && he(N, `files.${u}`, _), d(N), f.setRow && f.setRow(P);
  }, p = Wt(() => ({
    formState: f,
    setFormState: d,
    clearAlert: () => d({ ...f, alertText: "", alertClass: "" }),
    clearErrors: () => d({ ...f, errors: {} }),
    getDirtyKeys: () => b(f.row, f.originalRow),
    setValues: w
  }), [f]);
  return /* @__PURE__ */ g.jsx(fe.Provider, { value: p, children: /* @__PURE__ */ g.jsx(ar, { ...c, children: s }) });
}
dn.propTypes = {
  afterSubmitFailure: e.func,
  afterSubmitSuccess: e.func,
  children: e.node,
  row: e.object,
  setRow: e.func,
  showInlineErrors: e.bool
};
function bn({ ...t }) {
  const { formState: r } = ae(fe);
  return r.alertText ? /* @__PURE__ */ g.jsx(ft, { type: r.alertClass, ...t, children: r.alertText }) : null;
}
function lr({ loadingText: t = "Loading..." }) {
  const { promiseInProgress: r } = Jr();
  return r ? /* @__PURE__ */ g.jsx("div", { className: "formosa-spinner formosa-spinner--fullscreen", role: "status", children: t }) : null;
}
lr.propTypes = {
  loadingText: e.string
};
function cr({
  className: t = "",
  id: r,
  milliseconds: s,
  text: n
}) {
  const { removeToast: a } = ae(Ne);
  return /* @__PURE__ */ g.jsxs("div", { "aria-live": "polite", className: `formosa-toast ${t}`.trim(), role: "alert", style: { animationDuration: `${s}ms` }, children: [
    /* @__PURE__ */ g.jsx("div", { className: "formosa-toast__text", children: n }),
    /* @__PURE__ */ g.jsxs("button", { className: "formosa-toast__close", onClick: () => a(r), type: "button", children: [
      /* @__PURE__ */ g.jsx(at, { "aria-hidden": "true", className: "formosa-toast__close-icon", height: 12, width: 12 }),
      "Close"
    ] })
  ] });
}
cr.propTypes = {
  className: e.string,
  id: e.string.isRequired,
  milliseconds: e.number.isRequired,
  text: e.string.isRequired
};
function mn() {
  const { toasts: t } = ae(Ne);
  return /* @__PURE__ */ g.jsx("div", { className: "formosa-toast-container", children: Object.keys(t).map((r) => /* @__PURE__ */ g.jsx(
    cr,
    {
      className: t[r].className,
      id: r,
      milliseconds: t[r].milliseconds,
      text: t[r].text
    },
    r
  )) });
}
function yn({ children: t, loadingText: r = "Loading..." }) {
  const [s, n] = ne(!0), [a, o] = ne({}), c = (b) => {
    const w = { ...a };
    Object.prototype.hasOwnProperty.call(a, b) && (delete w[b], o(w));
  }, l = (b, w = "", p = 5e3) => {
    const h = (/* @__PURE__ */ new Date()).getTime(), u = {
      className: w ? `formosa-toast--${w}` : "",
      text: b,
      milliseconds: p
    }, j = {
      ...a,
      [h]: u
    };
    o(j), setTimeout(() => {
      c(h);
    }, p);
  }, O = () => {
    n(!1);
  }, f = () => {
    n(!0);
  }, d = Wt(() => ({
    toasts: a,
    showWarningPrompt: s,
    addToast: l,
    removeToast: c,
    disableWarningPrompt: O,
    enableWarningPrompt: f
  }), [a, s]);
  return /* @__PURE__ */ g.jsxs(Ne.Provider, { value: d, children: [
    t,
    /* @__PURE__ */ g.jsx(lr, { loadingText: r }),
    /* @__PURE__ */ g.jsx(mn, {})
  ] });
}
yn.propTypes = {
  children: e.node.isRequired,
  loadingText: e.string
};
function hn({
  className: t = "",
  label: r = "Submit",
  prefix: s = null,
  postfix: n = null,
  ...a
}) {
  return /* @__PURE__ */ g.jsxs("div", { className: "formosa-field formosa-field--submit", children: [
    /* @__PURE__ */ g.jsx("div", { className: "formosa-label-wrapper formosa-label-wrapper--submit" }),
    /* @__PURE__ */ g.jsxs("div", { className: "formosa-input-wrapper formosa-input-wrapper--submit", children: [
      s,
      /* @__PURE__ */ g.jsx(
        "button",
        {
          className: `formosa-button formosa-button--submit ${t}`.trim(),
          type: "submit",
          ...a,
          children: r
        }
      ),
      n
    ] })
  ] });
}
hn.propTypes = {
  className: e.string,
  label: e.string,
  prefix: e.node,
  postfix: e.node
};
export {
  ft as Alert,
  ce as Api,
  zt as CheckIcon,
  Bt as Error,
  Zr as Field,
  dn as Form,
  bn as FormAlert,
  yn as FormContainer,
  fe as FormContext,
  Ar as FormosaConfig,
  Ne as FormosaContext,
  Xr as Input,
  or as Label,
  hn as Submit
};

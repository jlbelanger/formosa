import * as be from "react";
import pe, { useContext as ae, useRef as Re, useState as ne, useEffect as le, useMemo as Jt } from "react";
function Ut(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Fe = { exports: {} }, Ce = {};
var jt;
function xr() {
  if (jt) return Ce;
  jt = 1;
  var t = /* @__PURE__ */ Symbol.for("react.transitional.element"), r = /* @__PURE__ */ Symbol.for("react.fragment");
  function n(s, i, a) {
    var c = null;
    if (a !== void 0 && (c = "" + a), i.key !== void 0 && (c = "" + i.key), "key" in i) {
      a = {};
      for (var u in i)
        u !== "key" && (a[u] = i[u]);
    } else a = i;
    return i = a.ref, {
      $$typeof: t,
      type: s,
      key: c,
      ref: i !== void 0 ? i : null,
      props: a
    };
  }
  return Ce.Fragment = r, Ce.jsx = n, Ce.jsxs = n, Ce;
}
var Pe = {};
var Ot;
function _r() {
  return Ot || (Ot = 1, process.env.NODE_ENV !== "production" && (function() {
    function t(o) {
      if (o == null) return null;
      if (typeof o == "function")
        return o.$$typeof === Z ? null : o.displayName || o.name || null;
      if (typeof o == "string") return o;
      switch (o) {
        case O:
          return "Fragment";
        case _:
          return "Profiler";
        case P:
          return "StrictMode";
        case J:
          return "Suspense";
        case H:
          return "SuspenseList";
        case ee:
          return "Activity";
      }
      if (typeof o == "object")
        switch (typeof o.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), o.$$typeof) {
          case m:
            return "Portal";
          case N:
            return o.displayName || "Context";
          case S:
            return (o._context.displayName || "Context") + ".Consumer";
          case y:
            var T = o.render;
            return o = o.displayName, o || (o = T.displayName || T.name || "", o = o !== "" ? "ForwardRef(" + o + ")" : "ForwardRef"), o;
          case Y:
            return T = o.displayName || null, T !== null ? T : t(o.type) || "Memo";
          case Q:
            T = o._payload, o = o._init;
            try {
              return t(o(T));
            } catch {
            }
        }
      return null;
    }
    function r(o) {
      return "" + o;
    }
    function n(o) {
      try {
        r(o);
        var T = !1;
      } catch {
        T = !0;
      }
      if (T) {
        T = console;
        var C = T.error, v = typeof Symbol == "function" && Symbol.toStringTag && o[Symbol.toStringTag] || o.constructor.name || "Object";
        return C.call(
          T,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          v
        ), r(o);
      }
    }
    function s(o) {
      if (o === O) return "<>";
      if (typeof o == "object" && o !== null && o.$$typeof === Q)
        return "<...>";
      try {
        var T = t(o);
        return T ? "<" + T + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var o = z.A;
      return o === null ? null : o.getOwner();
    }
    function a() {
      return Error("react-stack-top-frame");
    }
    function c(o) {
      if (K.call(o, "key")) {
        var T = Object.getOwnPropertyDescriptor(o, "key").get;
        if (T && T.isReactWarning) return !1;
      }
      return o.key !== void 0;
    }
    function u(o, T) {
      function C() {
        M || (M = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          T
        ));
      }
      C.isReactWarning = !0, Object.defineProperty(o, "key", {
        get: C,
        configurable: !0
      });
    }
    function j() {
      var o = t(this.type);
      return V[o] || (V[o] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), o = this.props.ref, o !== void 0 ? o : null;
    }
    function l(o, T, C, v, A, I) {
      var R = C.ref;
      return o = {
        $$typeof: g,
        type: o,
        key: T,
        props: C,
        _owner: v
      }, (R !== void 0 ? R : null) !== null ? Object.defineProperty(o, "ref", {
        enumerable: !1,
        get: j
      }) : Object.defineProperty(o, "ref", { enumerable: !1, value: null }), o._store = {}, Object.defineProperty(o._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(o, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(o, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: A
      }), Object.defineProperty(o, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: I
      }), Object.freeze && (Object.freeze(o.props), Object.freeze(o)), o;
    }
    function f(o, T, C, v, A, I) {
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
        R = t(o);
        var x = Object.keys(T).filter(function(q) {
          return q !== "key";
        });
        v = 0 < x.length ? "{key: someKey, " + x.join(": ..., ") + ": ...}" : "{key: someKey}", p[R + v] || (x = 0 < x.length ? "{" + x.join(": ..., ") + ": ...}" : "{}", console.error(
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
        ), p[R + v] = !0);
      }
      if (R = null, C !== void 0 && (n(C), R = "" + C), c(T) && (n(T.key), R = "" + T.key), "key" in T) {
        C = {};
        for (var k in T)
          k !== "key" && (C[k] = T[k]);
      } else C = T;
      return R && u(
        C,
        typeof o == "function" ? o.displayName || o.name || "Unknown" : o
      ), l(
        o,
        R,
        C,
        i(),
        A,
        I
      );
    }
    function b(o) {
      w(o) ? o._store && (o._store.validated = 1) : typeof o == "object" && o !== null && o.$$typeof === Q && (o._payload.status === "fulfilled" ? w(o._payload.value) && o._payload.value._store && (o._payload.value._store.validated = 1) : o._store && (o._store.validated = 1));
    }
    function w(o) {
      return typeof o == "object" && o !== null && o.$$typeof === g;
    }
    var d = pe, g = /* @__PURE__ */ Symbol.for("react.transitional.element"), m = /* @__PURE__ */ Symbol.for("react.portal"), O = /* @__PURE__ */ Symbol.for("react.fragment"), P = /* @__PURE__ */ Symbol.for("react.strict_mode"), _ = /* @__PURE__ */ Symbol.for("react.profiler"), S = /* @__PURE__ */ Symbol.for("react.consumer"), N = /* @__PURE__ */ Symbol.for("react.context"), y = /* @__PURE__ */ Symbol.for("react.forward_ref"), J = /* @__PURE__ */ Symbol.for("react.suspense"), H = /* @__PURE__ */ Symbol.for("react.suspense_list"), Y = /* @__PURE__ */ Symbol.for("react.memo"), Q = /* @__PURE__ */ Symbol.for("react.lazy"), ee = /* @__PURE__ */ Symbol.for("react.activity"), Z = /* @__PURE__ */ Symbol.for("react.client.reference"), z = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = Object.prototype.hasOwnProperty, U = Array.isArray, F = console.createTask ? console.createTask : function() {
      return null;
    };
    d = {
      react_stack_bottom_frame: function(o) {
        return o();
      }
    };
    var M, V = {}, $ = d.react_stack_bottom_frame.bind(
      d,
      a
    )(), D = F(s(a)), p = {};
    Pe.Fragment = O, Pe.jsx = function(o, T, C) {
      var v = 1e4 > z.recentlyCreatedOwnerStacks++;
      return f(
        o,
        T,
        C,
        !1,
        v ? Error("react-stack-top-frame") : $,
        v ? F(s(o)) : D
      );
    }, Pe.jsxs = function(o, T, C) {
      var v = 1e4 > z.recentlyCreatedOwnerStacks++;
      return f(
        o,
        T,
        C,
        !0,
        v ? Error("react-stack-top-frame") : $,
        v ? F(s(o)) : D
      );
    };
  })()), Pe;
}
var Tt;
function Er() {
  return Tt || (Tt = 1, process.env.NODE_ENV === "production" ? Fe.exports = xr() : Fe.exports = _r()), Fe.exports;
}
var h = Er(), qe = { exports: {} }, Le = { exports: {} }, G = {};
var wt;
function Sr() {
  if (wt) return G;
  wt = 1;
  var t = typeof Symbol == "function" && Symbol.for, r = t ? /* @__PURE__ */ Symbol.for("react.element") : 60103, n = t ? /* @__PURE__ */ Symbol.for("react.portal") : 60106, s = t ? /* @__PURE__ */ Symbol.for("react.fragment") : 60107, i = t ? /* @__PURE__ */ Symbol.for("react.strict_mode") : 60108, a = t ? /* @__PURE__ */ Symbol.for("react.profiler") : 60114, c = t ? /* @__PURE__ */ Symbol.for("react.provider") : 60109, u = t ? /* @__PURE__ */ Symbol.for("react.context") : 60110, j = t ? /* @__PURE__ */ Symbol.for("react.async_mode") : 60111, l = t ? /* @__PURE__ */ Symbol.for("react.concurrent_mode") : 60111, f = t ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112, b = t ? /* @__PURE__ */ Symbol.for("react.suspense") : 60113, w = t ? /* @__PURE__ */ Symbol.for("react.suspense_list") : 60120, d = t ? /* @__PURE__ */ Symbol.for("react.memo") : 60115, g = t ? /* @__PURE__ */ Symbol.for("react.lazy") : 60116, m = t ? /* @__PURE__ */ Symbol.for("react.block") : 60121, O = t ? /* @__PURE__ */ Symbol.for("react.fundamental") : 60117, P = t ? /* @__PURE__ */ Symbol.for("react.responder") : 60118, _ = t ? /* @__PURE__ */ Symbol.for("react.scope") : 60119;
  function S(y) {
    if (typeof y == "object" && y !== null) {
      var J = y.$$typeof;
      switch (J) {
        case r:
          switch (y = y.type, y) {
            case j:
            case l:
            case s:
            case a:
            case i:
            case b:
              return y;
            default:
              switch (y = y && y.$$typeof, y) {
                case u:
                case f:
                case g:
                case d:
                case c:
                  return y;
                default:
                  return J;
              }
          }
        case n:
          return J;
      }
    }
  }
  function N(y) {
    return S(y) === l;
  }
  return G.AsyncMode = j, G.ConcurrentMode = l, G.ContextConsumer = u, G.ContextProvider = c, G.Element = r, G.ForwardRef = f, G.Fragment = s, G.Lazy = g, G.Memo = d, G.Portal = n, G.Profiler = a, G.StrictMode = i, G.Suspense = b, G.isAsyncMode = function(y) {
    return N(y) || S(y) === j;
  }, G.isConcurrentMode = N, G.isContextConsumer = function(y) {
    return S(y) === u;
  }, G.isContextProvider = function(y) {
    return S(y) === c;
  }, G.isElement = function(y) {
    return typeof y == "object" && y !== null && y.$$typeof === r;
  }, G.isForwardRef = function(y) {
    return S(y) === f;
  }, G.isFragment = function(y) {
    return S(y) === s;
  }, G.isLazy = function(y) {
    return S(y) === g;
  }, G.isMemo = function(y) {
    return S(y) === d;
  }, G.isPortal = function(y) {
    return S(y) === n;
  }, G.isProfiler = function(y) {
    return S(y) === a;
  }, G.isStrictMode = function(y) {
    return S(y) === i;
  }, G.isSuspense = function(y) {
    return S(y) === b;
  }, G.isValidElementType = function(y) {
    return typeof y == "string" || typeof y == "function" || y === s || y === l || y === a || y === i || y === b || y === w || typeof y == "object" && y !== null && (y.$$typeof === g || y.$$typeof === d || y.$$typeof === c || y.$$typeof === u || y.$$typeof === f || y.$$typeof === O || y.$$typeof === P || y.$$typeof === _ || y.$$typeof === m);
  }, G.typeOf = S, G;
}
var X = {};
var xt;
function Cr() {
  return xt || (xt = 1, process.env.NODE_ENV !== "production" && (function() {
    var t = typeof Symbol == "function" && Symbol.for, r = t ? /* @__PURE__ */ Symbol.for("react.element") : 60103, n = t ? /* @__PURE__ */ Symbol.for("react.portal") : 60106, s = t ? /* @__PURE__ */ Symbol.for("react.fragment") : 60107, i = t ? /* @__PURE__ */ Symbol.for("react.strict_mode") : 60108, a = t ? /* @__PURE__ */ Symbol.for("react.profiler") : 60114, c = t ? /* @__PURE__ */ Symbol.for("react.provider") : 60109, u = t ? /* @__PURE__ */ Symbol.for("react.context") : 60110, j = t ? /* @__PURE__ */ Symbol.for("react.async_mode") : 60111, l = t ? /* @__PURE__ */ Symbol.for("react.concurrent_mode") : 60111, f = t ? /* @__PURE__ */ Symbol.for("react.forward_ref") : 60112, b = t ? /* @__PURE__ */ Symbol.for("react.suspense") : 60113, w = t ? /* @__PURE__ */ Symbol.for("react.suspense_list") : 60120, d = t ? /* @__PURE__ */ Symbol.for("react.memo") : 60115, g = t ? /* @__PURE__ */ Symbol.for("react.lazy") : 60116, m = t ? /* @__PURE__ */ Symbol.for("react.block") : 60121, O = t ? /* @__PURE__ */ Symbol.for("react.fundamental") : 60117, P = t ? /* @__PURE__ */ Symbol.for("react.responder") : 60118, _ = t ? /* @__PURE__ */ Symbol.for("react.scope") : 60119;
    function S(E) {
      return typeof E == "string" || typeof E == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      E === s || E === l || E === a || E === i || E === b || E === w || typeof E == "object" && E !== null && (E.$$typeof === g || E.$$typeof === d || E.$$typeof === c || E.$$typeof === u || E.$$typeof === f || E.$$typeof === O || E.$$typeof === P || E.$$typeof === _ || E.$$typeof === m);
    }
    function N(E) {
      if (typeof E == "object" && E !== null) {
        var se = E.$$typeof;
        switch (se) {
          case r:
            var ge = E.type;
            switch (ge) {
              case j:
              case l:
              case s:
              case a:
              case i:
              case b:
                return ge;
              default:
                var Ae = ge && ge.$$typeof;
                switch (Ae) {
                  case u:
                  case f:
                  case g:
                  case d:
                  case c:
                    return Ae;
                  default:
                    return se;
                }
            }
          case n:
            return se;
        }
      }
    }
    var y = j, J = l, H = u, Y = c, Q = r, ee = f, Z = s, z = g, K = d, U = n, F = a, M = i, V = b, $ = !1;
    function D(E) {
      return $ || ($ = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), p(E) || N(E) === j;
    }
    function p(E) {
      return N(E) === l;
    }
    function o(E) {
      return N(E) === u;
    }
    function T(E) {
      return N(E) === c;
    }
    function C(E) {
      return typeof E == "object" && E !== null && E.$$typeof === r;
    }
    function v(E) {
      return N(E) === f;
    }
    function A(E) {
      return N(E) === s;
    }
    function I(E) {
      return N(E) === g;
    }
    function R(E) {
      return N(E) === d;
    }
    function x(E) {
      return N(E) === n;
    }
    function k(E) {
      return N(E) === a;
    }
    function q(E) {
      return N(E) === i;
    }
    function B(E) {
      return N(E) === b;
    }
    X.AsyncMode = y, X.ConcurrentMode = J, X.ContextConsumer = H, X.ContextProvider = Y, X.Element = Q, X.ForwardRef = ee, X.Fragment = Z, X.Lazy = z, X.Memo = K, X.Portal = U, X.Profiler = F, X.StrictMode = M, X.Suspense = V, X.isAsyncMode = D, X.isConcurrentMode = p, X.isContextConsumer = o, X.isContextProvider = T, X.isElement = C, X.isForwardRef = v, X.isFragment = A, X.isLazy = I, X.isMemo = R, X.isPortal = x, X.isProfiler = k, X.isStrictMode = q, X.isSuspense = B, X.isValidElementType = S, X.typeOf = N;
  })()), X;
}
var _t;
function Yt() {
  return _t || (_t = 1, process.env.NODE_ENV === "production" ? Le.exports = Sr() : Le.exports = Cr()), Le.exports;
}
var Ge, Et;
function Pr() {
  if (Et) return Ge;
  Et = 1;
  var t = Object.getOwnPropertySymbols, r = Object.prototype.hasOwnProperty, n = Object.prototype.propertyIsEnumerable;
  function s(a) {
    if (a == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(a);
  }
  function i() {
    try {
      if (!Object.assign)
        return !1;
      var a = new String("abc");
      if (a[5] = "de", Object.getOwnPropertyNames(a)[0] === "5")
        return !1;
      for (var c = {}, u = 0; u < 10; u++)
        c["_" + String.fromCharCode(u)] = u;
      var j = Object.getOwnPropertyNames(c).map(function(f) {
        return c[f];
      });
      if (j.join("") !== "0123456789")
        return !1;
      var l = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(f) {
        l[f] = f;
      }), Object.keys(Object.assign({}, l)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Ge = i() ? Object.assign : function(a, c) {
    for (var u, j = s(a), l, f = 1; f < arguments.length; f++) {
      u = Object(arguments[f]);
      for (var b in u)
        r.call(u, b) && (j[b] = u[b]);
      if (t) {
        l = t(u);
        for (var w = 0; w < l.length; w++)
          n.call(u, l[w]) && (j[l[w]] = u[l[w]]);
      }
    }
    return j;
  }, Ge;
}
var Xe, St;
function ct() {
  if (St) return Xe;
  St = 1;
  var t = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Xe = t, Xe;
}
var Ze, Ct;
function zt() {
  return Ct || (Ct = 1, Ze = Function.call.bind(Object.prototype.hasOwnProperty)), Ze;
}
var Qe, Pt;
function Rr() {
  if (Pt) return Qe;
  Pt = 1;
  var t = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var r = /* @__PURE__ */ ct(), n = {}, s = /* @__PURE__ */ zt();
    t = function(a) {
      var c = "Warning: " + a;
      typeof console < "u" && console.error(c);
      try {
        throw new Error(c);
      } catch {
      }
    };
  }
  function i(a, c, u, j, l) {
    if (process.env.NODE_ENV !== "production") {
      for (var f in a)
        if (s(a, f)) {
          var b;
          try {
            if (typeof a[f] != "function") {
              var w = Error(
                (j || "React class") + ": " + u + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof a[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw w.name = "Invariant Violation", w;
            }
            b = a[f](c, f, j, u, null, r);
          } catch (g) {
            b = g;
          }
          if (b && !(b instanceof Error) && t(
            (j || "React class") + ": type specification of " + u + " `" + f + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof b + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), b instanceof Error && !(b.message in n)) {
            n[b.message] = !0;
            var d = l ? l() : "";
            t(
              "Failed " + u + " type: " + b.message + (d ?? "")
            );
          }
        }
    }
  }
  return i.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (n = {});
  }, Qe = i, Qe;
}
var Ke, Rt;
function Nr() {
  if (Rt) return Ke;
  Rt = 1;
  var t = Yt(), r = Pr(), n = /* @__PURE__ */ ct(), s = /* @__PURE__ */ zt(), i = /* @__PURE__ */ Rr(), a = function() {
  };
  process.env.NODE_ENV !== "production" && (a = function(u) {
    var j = "Warning: " + u;
    typeof console < "u" && console.error(j);
    try {
      throw new Error(j);
    } catch {
    }
  });
  function c() {
    return null;
  }
  return Ke = function(u, j) {
    var l = typeof Symbol == "function" && Symbol.iterator, f = "@@iterator";
    function b(p) {
      var o = p && (l && p[l] || p[f]);
      if (typeof o == "function")
        return o;
    }
    var w = "<<anonymous>>", d = {
      array: P("array"),
      bigint: P("bigint"),
      bool: P("boolean"),
      func: P("function"),
      number: P("number"),
      object: P("object"),
      string: P("string"),
      symbol: P("symbol"),
      any: _(),
      arrayOf: S,
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
    function g(p, o) {
      return p === o ? p !== 0 || 1 / p === 1 / o : p !== p && o !== o;
    }
    function m(p, o) {
      this.message = p, this.data = o && typeof o == "object" ? o : {}, this.stack = "";
    }
    m.prototype = Error.prototype;
    function O(p) {
      if (process.env.NODE_ENV !== "production")
        var o = {}, T = 0;
      function C(A, I, R, x, k, q, B) {
        if (x = x || w, q = q || R, B !== n) {
          if (j) {
            var E = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw E.name = "Invariant Violation", E;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var se = x + ":" + R;
            !o[se] && // Avoid spamming the console because they are often not actionable except for lib authors
            T < 3 && (a(
              "You are manually calling a React.PropTypes validation function for the `" + q + "` prop on `" + x + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), o[se] = !0, T++);
          }
        }
        return I[R] == null ? A ? I[R] === null ? new m("The " + k + " `" + q + "` is marked as required " + ("in `" + x + "`, but its value is `null`.")) : new m("The " + k + " `" + q + "` is marked as required in " + ("`" + x + "`, but its value is `undefined`.")) : null : p(I, R, x, k, q);
      }
      var v = C.bind(null, !1);
      return v.isRequired = C.bind(null, !0), v;
    }
    function P(p) {
      function o(T, C, v, A, I, R) {
        var x = T[C], k = M(x);
        if (k !== p) {
          var q = V(x);
          return new m(
            "Invalid " + A + " `" + I + "` of type " + ("`" + q + "` supplied to `" + v + "`, expected ") + ("`" + p + "`."),
            { expectedType: p }
          );
        }
        return null;
      }
      return O(o);
    }
    function _() {
      return O(c);
    }
    function S(p) {
      function o(T, C, v, A, I) {
        if (typeof p != "function")
          return new m("Property `" + I + "` of component `" + v + "` has invalid PropType notation inside arrayOf.");
        var R = T[C];
        if (!Array.isArray(R)) {
          var x = M(R);
          return new m("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected an array."));
        }
        for (var k = 0; k < R.length; k++) {
          var q = p(R, k, v, A, I + "[" + k + "]", n);
          if (q instanceof Error)
            return q;
        }
        return null;
      }
      return O(o);
    }
    function N() {
      function p(o, T, C, v, A) {
        var I = o[T];
        if (!u(I)) {
          var R = M(I);
          return new m("Invalid " + v + " `" + A + "` of type " + ("`" + R + "` supplied to `" + C + "`, expected a single ReactElement."));
        }
        return null;
      }
      return O(p);
    }
    function y() {
      function p(o, T, C, v, A) {
        var I = o[T];
        if (!t.isValidElementType(I)) {
          var R = M(I);
          return new m("Invalid " + v + " `" + A + "` of type " + ("`" + R + "` supplied to `" + C + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return O(p);
    }
    function J(p) {
      function o(T, C, v, A, I) {
        if (!(T[C] instanceof p)) {
          var R = p.name || w, x = D(T[C]);
          return new m("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected ") + ("instance of `" + R + "`."));
        }
        return null;
      }
      return O(o);
    }
    function H(p) {
      if (!Array.isArray(p))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? a(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : a("Invalid argument supplied to oneOf, expected an array.")), c;
      function o(T, C, v, A, I) {
        for (var R = T[C], x = 0; x < p.length; x++)
          if (g(R, p[x]))
            return null;
        var k = JSON.stringify(p, function(B, E) {
          var se = V(E);
          return se === "symbol" ? String(E) : E;
        });
        return new m("Invalid " + A + " `" + I + "` of value `" + String(R) + "` " + ("supplied to `" + v + "`, expected one of " + k + "."));
      }
      return O(o);
    }
    function Y(p) {
      function o(T, C, v, A, I) {
        if (typeof p != "function")
          return new m("Property `" + I + "` of component `" + v + "` has invalid PropType notation inside objectOf.");
        var R = T[C], x = M(R);
        if (x !== "object")
          return new m("Invalid " + A + " `" + I + "` of type " + ("`" + x + "` supplied to `" + v + "`, expected an object."));
        for (var k in R)
          if (s(R, k)) {
            var q = p(R, k, v, A, I + "." + k, n);
            if (q instanceof Error)
              return q;
          }
        return null;
      }
      return O(o);
    }
    function Q(p) {
      if (!Array.isArray(p))
        return process.env.NODE_ENV !== "production" && a("Invalid argument supplied to oneOfType, expected an instance of array."), c;
      for (var o = 0; o < p.length; o++) {
        var T = p[o];
        if (typeof T != "function")
          return a(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + $(T) + " at index " + o + "."
          ), c;
      }
      function C(v, A, I, R, x) {
        for (var k = [], q = 0; q < p.length; q++) {
          var B = p[q], E = B(v, A, I, R, x, n);
          if (E == null)
            return null;
          E.data && s(E.data, "expectedType") && k.push(E.data.expectedType);
        }
        var se = k.length > 0 ? ", expected one of type [" + k.join(", ") + "]" : "";
        return new m("Invalid " + R + " `" + x + "` supplied to " + ("`" + I + "`" + se + "."));
      }
      return O(C);
    }
    function ee() {
      function p(o, T, C, v, A) {
        return U(o[T]) ? null : new m("Invalid " + v + " `" + A + "` supplied to " + ("`" + C + "`, expected a ReactNode."));
      }
      return O(p);
    }
    function Z(p, o, T, C, v) {
      return new m(
        (p || "React class") + ": " + o + " type `" + T + "." + C + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + v + "`."
      );
    }
    function z(p) {
      function o(T, C, v, A, I) {
        var R = T[C], x = M(R);
        if (x !== "object")
          return new m("Invalid " + A + " `" + I + "` of type `" + x + "` " + ("supplied to `" + v + "`, expected `object`."));
        for (var k in p) {
          var q = p[k];
          if (typeof q != "function")
            return Z(v, A, I, k, V(q));
          var B = q(R, k, v, A, I + "." + k, n);
          if (B)
            return B;
        }
        return null;
      }
      return O(o);
    }
    function K(p) {
      function o(T, C, v, A, I) {
        var R = T[C], x = M(R);
        if (x !== "object")
          return new m("Invalid " + A + " `" + I + "` of type `" + x + "` " + ("supplied to `" + v + "`, expected `object`."));
        var k = r({}, T[C], p);
        for (var q in k) {
          var B = p[q];
          if (s(p, q) && typeof B != "function")
            return Z(v, A, I, q, V(B));
          if (!B)
            return new m(
              "Invalid " + A + " `" + I + "` key `" + q + "` supplied to `" + v + "`.\nBad object: " + JSON.stringify(T[C], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(p), null, "  ")
            );
          var E = B(R, q, v, A, I + "." + q, n);
          if (E)
            return E;
        }
        return null;
      }
      return O(o);
    }
    function U(p) {
      switch (typeof p) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !p;
        case "object":
          if (Array.isArray(p))
            return p.every(U);
          if (p === null || u(p))
            return !0;
          var o = b(p);
          if (o) {
            var T = o.call(p), C;
            if (o !== p.entries) {
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
    function F(p, o) {
      return p === "symbol" ? !0 : o ? o["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && o instanceof Symbol : !1;
    }
    function M(p) {
      var o = typeof p;
      return Array.isArray(p) ? "array" : p instanceof RegExp ? "object" : F(o, p) ? "symbol" : o;
    }
    function V(p) {
      if (typeof p > "u" || p === null)
        return "" + p;
      var o = M(p);
      if (o === "object") {
        if (p instanceof Date)
          return "date";
        if (p instanceof RegExp)
          return "regexp";
      }
      return o;
    }
    function $(p) {
      var o = V(p);
      switch (o) {
        case "array":
        case "object":
          return "an " + o;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + o;
        default:
          return o;
      }
    }
    function D(p) {
      return !p.constructor || !p.constructor.name ? w : p.constructor.name;
    }
    return d.checkPropTypes = i, d.resetWarningCache = i.resetWarningCache, d.PropTypes = d, d;
  }, Ke;
}
var et, Nt;
function $r() {
  if (Nt) return et;
  Nt = 1;
  var t = /* @__PURE__ */ ct();
  function r() {
  }
  function n() {
  }
  return n.resetWarningCache = r, et = function() {
    function s(c, u, j, l, f, b) {
      if (b !== t) {
        var w = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw w.name = "Invariant Violation", w;
      }
    }
    s.isRequired = s;
    function i() {
      return s;
    }
    var a = {
      array: s,
      bigint: s,
      bool: s,
      func: s,
      number: s,
      object: s,
      string: s,
      symbol: s,
      any: s,
      arrayOf: i,
      element: s,
      elementType: s,
      instanceOf: i,
      node: s,
      objectOf: i,
      oneOf: i,
      oneOfType: i,
      shape: i,
      exact: i,
      checkPropTypes: n,
      resetWarningCache: r
    };
    return a.PropTypes = a, a;
  }, et;
}
var $t;
function Ar() {
  if ($t) return qe.exports;
  if ($t = 1, process.env.NODE_ENV !== "production") {
    var t = Yt(), r = !0;
    qe.exports = /* @__PURE__ */ Nr()(t.isElement, r);
  } else
    qe.exports = /* @__PURE__ */ $r()();
  return qe.exports;
}
var kr = /* @__PURE__ */ Ar();
const e = /* @__PURE__ */ Ut(kr);
function ft({
  className: t = "",
  children: r,
  type: n = null,
  ...s
}) {
  if (!r)
    return null;
  let i = "formosa-alert";
  return n && (i += ` formosa-alert--${n}`), t && (i += ` ${t}`), /* @__PURE__ */ h.jsx("div", { "aria-live": "polite", className: i, role: "alert", ...s, children: r });
}
ft.propTypes = {
  children: e.node.isRequired,
  className: e.string,
  type: e.string
};
const Me = (t, r, n, s) => {
  if (s && r === s.id && n === s.type) {
    const i = {
      id: s.id,
      type: s.type
    };
    return Object.hasOwn(s, "attributes") && (i.attributes = s.attributes), Object.hasOwn(s, "meta") && (i.meta = s.meta), i;
  }
  return t.find((i) => i.id === r && i.type === n);
}, _e = (t, r = [], n = [], s = null) => {
  if (!t)
    return t;
  const i = {
    id: t.id,
    type: t.type,
    ...t.attributes
  };
  if (Object.hasOwn(t, "relationships")) {
    let a;
    Object.keys(t.relationships).forEach((c) => {
      i[c] = t.relationships[c].data, Array.isArray(i[c]) ? i[c].forEach((u, j) => {
        a = Me(n, u.id, u.type, s), a ? i[c][j] = _e(a, r, n, s) : (a = Me(r, u.id, u.type, s), a && (i[c][j] = _e(a, r, n, s)));
      }) : i[c] !== null && (a = Me(n, i[c].id, i[c].type, s), a ? i[c] = _e(a, r, n, s) : (a = Me(r, i[c].id, i[c].type, s), a && (i[c] = _e(a, r, n, s))));
    });
  }
  return Object.hasOwn(t, "meta") && (i.meta = t.meta), i;
}, At = (t) => {
  if (Array.isArray(t.data)) {
    const r = [];
    return t.data.forEach((n) => {
      r.push(_e(n, t.data, t.included, null));
    }), Object.hasOwn(t, "meta") ? { data: r, meta: t.meta } : r;
  }
  return _e(t.data, [], t.included, t.data);
};
class Ir {
  static init(r = {}) {
    window.FORMOSA_CONFIG = {
      apiPrefix: r.apiPrefix || ""
    };
  }
  static get(r) {
    return r ? window.FORMOSA_CONFIG[r] : window.FORMOSA_CONFIG;
  }
  static set(r, n) {
    window.FORMOSA_CONFIG[r] = n;
  }
}
class Fr {
  emit(r, ...n) {
    if (!r) return this;
    for (const s of this._e(r))
      s.apply(s.ctx, [...n]), s.off_event == !0 && this.off(r, s);
    return this;
  }
  on(r, n, s) {
    return r ? (n.ctx = s, this._e(r).push(n), this) : this;
  }
  once(r, n, s) {
    return r ? (n.ctx = s, n.off_event = !0, this.on(r, n)) : this;
  }
  off(r, n) {
    if (!r) return this;
    if (!this[r]) return this;
    const s = this._e(r);
    return n ? (this[r] = s.filter((i) => i != n), this) : (delete this[r], this);
  }
  _e(r) {
    return this[r] || (this[r] = []);
  }
}
const Ue = "default-area", De = new Fr(), Ve = "promise-counter-update";
let Te = {
  [Ue]: 0
};
const qr = (t) => Te[t], Lr = (t, r) => {
  r = r || Ue, Mr(r);
  const n = () => Vr(r);
  return t.then(n, n), t;
}, Mr = (t) => {
  Dr(t);
  const r = Bt(t);
  De.emit(Ve, r, t);
}, Dr = (t) => {
  Te[t] ? Te[t]++ : Te[t] = 1;
}, Bt = (t) => Te[t] > 0, Vr = (t) => {
  Te[t] > 0 && Wr(t);
  const r = Bt(t);
  De.emit(Ve, r, t);
}, Wr = (t) => {
  Te[t]--;
}, Jr = {
  area: Ue,
  delay: 0
}, Ur = (t) => ({
  area: !t || !t.area ? Ue : t.area,
  delay: !t || !t.delay ? 0 : t.delay
}), Yr = (t = Jr) => {
  let r = pe.useRef(!1);
  pe.useEffect(() => (r.current = !0, () => r.current = !1), []);
  const [n] = pe.useState(Ur(t));
  pe.useEffect(() => {
    r.current && n && n.area && qr(n.area) > 0 && (i(!0), c(!0));
  }, [n]);
  const [s, i] = pe.useState(!1), [a, c] = pe.useState(!1), u = pe.useRef(s), j = () => {
    !n || !n.delay || n.delay === 0 ? c(!0) : setTimeout(() => {
      r.current && u.current && c(!0);
    }, n.delay);
  }, l = (f, b) => {
    r.current && n.area === b && (i(f), u.current = f, f ? j() : c(!1));
  };
  return pe.useEffect(() => (u.current = s, De.on(Ve, l), () => De.off(Ve, l)), []), {
    promiseInProgress: a
  };
};
class ce {
  static instance() {
    const r = {};
    return (n, s) => (Object.hasOwn(r, n) || (r[n] = ce.get(n, s)), r[n]);
  }
  static get(r, n = !0) {
    return ce.request("GET", r, null, n);
  }
  static delete(r, n = !0) {
    return ce.request("DELETE", r, null, n);
  }
  static post(r, n, s = !0) {
    return ce.request("POST", r, n, s);
  }
  static put(r, n, s = !0) {
    return ce.request("PUT", r, n, s);
  }
  static request(r, n, s = null, i = !0) {
    const a = {
      method: r,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    };
    typeof s == "string" && (a.headers["Content-Type"] = "application/json"), ce.getToken() && (a.headers.Authorization = `Bearer ${ce.getToken()}`), s && (a.body = s);
    const c = Ir.get("apiPrefix");
    let u = n;
    c && !n.startsWith("http") && (u = `${c.replace(/\/$/, "")}/${n.replace(/^\//, "")}`);
    const j = new CustomEvent("formosaApiRequest", { cancelable: !0, detail: { url: u, options: a } });
    if (!document.dispatchEvent(j))
      return Promise.resolve();
    const l = fetch(u, a).then((f) => f.ok ? f.status === 204 ? {} : f.json() : f.json().catch((b) => {
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
      throw b.status = f.status, b;
    })).then((f) => Object.hasOwn(f, "data") ? At(f) : f);
    return i ? Lr(l) : l;
  }
  static getToken() {
    return window.FORMOSA_TOKEN;
  }
  static setToken(r) {
    window.FORMOSA_TOKEN = r;
  }
  static deserialize(r) {
    return Object.hasOwn(r, "data") ? At(r) : r;
  }
}
const Ht = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M6.41 1l-.69.72L2.94 4.5l-.81-.78L1.41 3 0 4.41l.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72L6.41 1z" })), fe = pe.createContext(
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
function Gt({
  id: t = null,
  name: r = ""
}) {
  const { formState: n } = ae(fe), s = n && Object.hasOwn(n.errors, r), i = {};
  return r && (i["data-name"] = r), (t || r) && (i.id = `${t || r}-error`), /* @__PURE__ */ h.jsx("div", { className: "formosa-field__error", ...i, children: s && n.errors[r].map((a) => /* @__PURE__ */ h.jsx("div", { children: a }, a)) });
}
Gt.propTypes = {
  id: e.string,
  name: e.string
};
var zr = Object.defineProperty, Ee = (t, r) => zr(t, "name", { value: r, configurable: !0 }), Xt = /* @__PURE__ */ Ee((t) => t !== null && typeof t == "object", "isObject"), kt = /* @__PURE__ */ Ee((t, r, n) => typeof n.join == "function" ? n.join(t) : t[0] + r + t[1], "join"), Br = /* @__PURE__ */ Ee((t, r, n) => typeof n.split == "function" ? n.split(t) : t.split(r), "split"), tt = /* @__PURE__ */ Ee((t, r = {}, n) => typeof n?.isValid == "function" ? n.isValid(t, r) : !0, "isValid"), It = /* @__PURE__ */ Ee((t) => Xt(t) || typeof t == "function", "isValidObject"), Hr = /* @__PURE__ */ Ee((t, r, n = {}) => {
  if (Xt(n) || (n = { default: n }), !It(t))
    return typeof n.default < "u" ? n.default : t;
  typeof r == "number" && (r = String(r));
  const s = Array.isArray(r), i = typeof r == "string", a = n.separator || ".", c = n.joinChar || (typeof a == "string" ? a : ".");
  if (!i && !s)
    return t;
  if (t[r] !== void 0)
    return tt(r, t, n) ? t[r] : n.default;
  const u = s ? r : Br(r, a, n), j = u.length;
  let l = 0;
  do {
    let f = u[l];
    for (typeof f != "string" && (f = String(f)); f && f.slice(-1) === "\\"; )
      f = kt([f.slice(0, -1), u[++l] || ""], c, n);
    if (t[f] !== void 0) {
      if (!tt(f, t, n))
        return n.default;
      t = t[f];
    } else {
      let b = !1, w = l + 1;
      for (; w < j; )
        if (f = kt([f, u[w++]], c, n), b = t[f] !== void 0) {
          if (!tt(f, t, n))
            return n.default;
          t = t[f], l = w - 1;
          break;
        }
      if (!b)
        return n.default;
    }
  } while (++l < j && It(t));
  return l === j ? t : n.default;
}, "getValue"), re = Hr;
const ue = (t, r, n = null) => {
  if (!t)
    return [];
  const s = [];
  return Array.isArray(t) ? t.forEach((i) => {
    typeof i == "string" ? s.push({
      label: i,
      value: i
    }) : s.push({
      ...i,
      label: typeof r == "function" ? r(i) : re(i, r),
      value: typeof n == "function" ? n(i) : re(i, n)
    });
  }) : Object.keys(t).forEach((i) => {
    const a = t[i];
    typeof i == "string" ? s.push({
      label: a,
      value: i
    }) : s.push({
      ...a,
      label: typeof r == "function" ? r(a) : re(a, r),
      value: typeof n == "function" ? n(a) : re(a, n)
    });
  }), s;
}, Gr = (t) => t.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), rt = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ & /g, "-and-").replace(/<[^>]+>/g, "").replace(/['’.]/g, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+/, "").replace(/-+$/, "").replace(/--+/g, "-"), Xr = (t, r, n) => {
  n = n.toLowerCase();
  const s = Gr(n);
  return t = t.filter((i) => (re(i, r).toString().toLowerCase() || "").match(new RegExp(`(^|[^a-z])${s}`))), n = rt(n), t = t.sort((i, a) => {
    const c = rt(re(i, r).toString()), u = rt(re(a, r).toString()), j = c.indexOf(n) === 0, l = u.indexOf(n) === 0;
    return j && l || !j && !l ? c.localeCompare(u) : j && !l ? -1 : 1;
  }), t;
}, lt = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z" }));
function Zt({
  // eslint-disable-line complexity
  afterAdd: t = null,
  afterChange: r = null,
  clearable: n = !0,
  clearButtonAttributes: s = null,
  clearButtonClassName: i = "",
  clearIconAttributes: a = null,
  clearIconHeight: c = 12,
  clearIconWidth: u = 12,
  clearText: j = "Clear",
  disabled: l = !1,
  id: f = "",
  inputAttributes: b = null,
  inputClassName: w = "",
  labelFn: d = null,
  labelKey: g = "name",
  loadingText: m = "Loading...",
  max: O = null,
  name: P = "",
  optionButtonAttributes: _ = null,
  optionButtonClassName: S = "",
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
  url: p = null,
  value: o = null,
  valueKey: T = null,
  valueListItemAttributes: C = null,
  wrapperAttributes: v = null,
  wrapperClassName: A = "",
  ...I
}) {
  const { formState: R, setValues: x } = ae(fe), k = Re(null), q = Re(null), B = Re(null), E = Re(null), [se, ge] = ne(""), [Ae, ke] = ne(!1), [we, xe] = ne(0), [dt, pt] = ne(Q ? ue(Q, g, T) : []), [dr, ze] = ne(D || !!p), [mt, pr] = ne(""), mr = ce.instance();
  if (le(() => {
    p && mr(p, !1).catch((L) => {
      Object.hasOwn(L, "errors") && (pr(L.errors.map((W) => W.title).join(" ")), ze(!1));
    }).then((L) => {
      L && (pt(ue(L, g, T)), ze(!1));
    });
  }, [p]), le(() => {
    pt(Q ? ue(Q, g, T) : []);
  }, [Q]), le(() => {
    ze(D);
  }, [D]), dr)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-spinner", role: "status", children: m });
  if (mt)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-field__error", children: mt });
  let te = null;
  if ($ === null) {
    if (R === void 0)
      throw new Error("<Autocomplete> component must be inside a <Form> component.");
    te = re(R.row, P);
  } else
    te = o;
  te == null || te === "" ? te = null : O === 1 && !Array.isArray(te) && (te = [te]);
  const Se = te ? te.length : 0, yr = (L) => te ? te.findIndex((W) => typeof W == "object" ? JSON.stringify(W) === JSON.stringify(L.value) : W === L.value) > -1 : !1;
  let me = [];
  se && (me = Xr(dt, "label", se), me = me.filter((L) => !yr(L)));
  const Be = () => {
    q.current && q.current.focus();
  }, yt = (L) => {
    let W;
    O === 1 ? W = L : te ? W = [...te, L] : W = [L];
    const oe = { target: B.current };
    $ ? $(W, oe) : x(oe, P, W, r), ke(!1), ge(""), Be(), t && t();
  }, ht = (L) => {
    let W = [];
    if (te && (W = [...te]), O === 1)
      W = "";
    else {
      const de = W.indexOf(L);
      de > -1 && W.splice(de, 1);
    }
    const oe = { target: B.current };
    $ ? $(W, oe) : x(oe, P, W, r), Be();
  }, hr = (L) => {
    ge(L.target.value);
  }, gr = () => {
    xe(0), ke(se.length > 0);
  }, br = (L) => {
    const W = L.target.value;
    L.key === "Enter" && W && me.length > 0 ? L.preventDefault() : L.key === "Backspace" && !se && Se > 0 && ht(te[Se - 1]);
  }, vr = (L) => {
    const W = L.target.value;
    L.key === "Enter" && W && me.length > 0 ? (L.preventDefault(), yt(me[we].value)) : L.key === "ArrowDown" ? we >= me.length - 1 ? xe(0) : xe(we + 1) : L.key === "ArrowUp" ? we > 0 ? xe(we - 1) : xe(me.length - 1) : L.key === "Escape" ? ke(!1) : (xe(0), ke(W.length > 0));
  }, jr = (L) => {
    let W = L.target.getAttribute("data-value");
    L.target.getAttribute("data-json") === "true" && (W = JSON.parse(W)), yt(W);
  }, Or = (L) => {
    let W = L.target;
    for (; W && W.tagName.toUpperCase() !== "BUTTON"; )
      W = W.parentNode;
    ht(te[W.getAttribute("data-index")]);
  }, Tr = () => {
    const L = [], W = { target: B.current };
    $ ? $(L, W) : x(W, P, L, r), ge(""), Be();
  }, gt = n && O !== 1 && Se > 0 && !l && !Z;
  let Ie = ["formosa-autocomplete"];
  gt && Ie.push("formosa-autocomplete--clearable"), Ie = Ie.join(" ");
  const wr = !l && !Z && (O === null || Se < O), bt = {};
  return (f || P) && (bt.id = `${f || P}-wrapper`), /* @__PURE__ */ h.jsxs(
    "div",
    {
      className: `${Ie} ${A}`.trim(),
      "data-value": JSON.stringify(O === 1 && Se > 0 ? te[0] : te),
      ...bt,
      ...v,
      children: [
        /* @__PURE__ */ h.jsxs("ul", { className: "formosa-autocomplete__values", children: [
          te && te.map((L, W) => {
            let oe = L, de = !1;
            typeof oe == "object" && (oe = JSON.stringify(oe), de = !0);
            const ye = dt.find((vt) => de ? JSON.stringify(vt.value) === oe : vt.value === oe);
            let ve = "";
            d ? ve = d(ye || L) : ye && Object.hasOwn(ye, "label") && (ve = ye.label);
            let je = {};
            typeof C == "function" ? je = C(ye) : C && typeof C == "object" && (je = C);
            let Oe = {};
            typeof z == "function" ? Oe = z(ye) : z && typeof z == "object" && (Oe = z);
            let He = {};
            return typeof U == "function" ? He = U(ye) : U && typeof U == "object" && (He = U), /* @__PURE__ */ h.jsxs("li", { className: "formosa-autocomplete__value formosa-autocomplete__value--item", ...je, children: [
              ve,
              !l && !Z && /* @__PURE__ */ h.jsxs(
                "button",
                {
                  className: `formosa-autocomplete__value__remove ${K}`.trim(),
                  "data-index": W,
                  onClick: Or,
                  ref: E,
                  type: "button",
                  ...Oe,
                  children: [
                    /* @__PURE__ */ h.jsx(lt, { "aria-hidden": "true", height: F, width: M, ...He }),
                    V
                  ]
                }
              )
            ] }, oe);
          }),
          wr && /* @__PURE__ */ h.jsx("li", { className: "formosa-autocomplete__value formosa-autocomplete__value--input", children: /* @__PURE__ */ h.jsx(
            "input",
            {
              ...b,
              autoComplete: "off",
              className: `formosa-field__input formosa-autocomplete__input ${w}`.trim(),
              id: f || P,
              onChange: hr,
              onFocus: gr,
              onKeyDown: br,
              onKeyUp: vr,
              placeholder: ee,
              ref: q,
              type: "text",
              value: se
            }
          ) })
        ] }),
        Ae && me.length > 0 && /* @__PURE__ */ h.jsx("ul", { className: `formosa-autocomplete__options ${J}`.trim(), ...y, children: me.map((L, W) => {
          let oe = ["formosa-autocomplete__option"];
          we === W && oe.push("formosa-autocomplete__option--highlighted"), oe = oe.join(" ");
          let de = L.value, ye = !1;
          typeof de == "object" && (ye = !0, de = JSON.stringify(de));
          let ve = "";
          N ? ve = N(L) : L && Object.hasOwn(L, "label") && (ve = L.label);
          let je = {};
          typeof H == "function" ? je = H(L) : H && typeof H == "object" && (je = H);
          let Oe = {};
          return typeof _ == "function" ? Oe = _(L) : _ && typeof _ == "object" && (Oe = _), /* @__PURE__ */ h.jsx(
            "li",
            {
              className: `${oe} ${Y}`.trim(),
              ...je,
              children: /* @__PURE__ */ h.jsx(
                "button",
                {
                  className: `formosa-autocomplete__option__button ${S}`.trim(),
                  "data-json": ye,
                  "data-value": de,
                  onClick: jr,
                  type: "button",
                  ...Oe,
                  children: ve
                }
              )
            },
            de
          );
        }) }),
        gt && /* @__PURE__ */ h.jsx("div", { children: /* @__PURE__ */ h.jsxs(
          "button",
          {
            className: `formosa-autocomplete__clear ${i}`.trim(),
            onClick: Tr,
            ref: k,
            type: "button",
            ...s,
            children: [
              /* @__PURE__ */ h.jsx(lt, { "aria-hidden": "true", height: c, width: u, ...a }),
              j
            ]
          }
        ) }),
        /* @__PURE__ */ h.jsx(
          "input",
          {
            ...I,
            name: P,
            ref: B,
            type: "hidden",
            value: se
          }
        )
      ]
    }
  );
}
Zt.propTypes = {
  afterAdd: e.func,
  afterChange: e.func,
  clearButtonAttributes: e.object,
  clearButtonClassName: e.string,
  clearIconAttributes: e.object,
  clearIconHeight: e.number,
  clearIconWidth: e.number,
  clearText: e.string,
  clearable: e.bool,
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
function Qt({
  afterChange: t = null,
  className: r = "",
  iconAttributes: n = null,
  iconClassName: s = "",
  iconHeight: i = 16,
  iconWidth: a = 16,
  id: c = null,
  name: u = "",
  setValue: j = null,
  value: l = null,
  ...f
}) {
  const { formState: b, setValues: w } = ae(fe);
  let d;
  if (j === null) {
    if (b === void 0)
      throw new Error("<Checkbox> component must be inside a <Form> component.");
    d = !!re(b.row, u);
  } else
    d = l;
  const g = (O) => {
    const P = O.target.checked;
    j ? j(P, O) : w(O, u, P, t);
  }, m = {};
  return (c || u) && (m.id = c || u), u && (m.name = u), /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    /* @__PURE__ */ h.jsx(
      "input",
      {
        checked: d,
        className: `formosa-field__input formosa-field__input--checkbox ${r}`.trim(),
        onChange: g,
        type: "checkbox",
        ...m,
        ...f
      }
    ),
    /* @__PURE__ */ h.jsx(
      Ht,
      {
        "aria-hidden": "true",
        className: `formosa-icon--check ${s}`.trim(),
        height: i,
        width: a,
        ...n
      }
    )
  ] });
}
Qt.propTypes = {
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
function Kt({
  // eslint-disable-line complexity
  afterChange: t = null,
  className: r = "",
  disabled: n = !1,
  fieldsetAttributes: s = null,
  fieldsetClassName: i = "",
  iconAttributes: a = null,
  iconClassName: c = "",
  iconHeight: u = 16,
  iconWidth: j = 16,
  inputAttributes: l = null,
  itemAttributes: f = null,
  itemClassName: b = "",
  itemLabelAttributes: w = null,
  itemLabelClassName: d = "",
  itemSpanAttributes: g = null,
  itemSpanClassName: m = "",
  labelKey: O = "name",
  legend: P = "",
  loadingText: _ = "Loading...",
  name: S = "",
  options: N = null,
  readOnly: y = !1,
  setValue: J = null,
  showLoading: H = !1,
  url: Y = null,
  value: Q = null,
  valueKey: ee = null,
  ...Z
}) {
  const { formState: z, setValues: K } = ae(fe), [U, F] = ne(N ? ue(N, O, ee) : []), [M, V] = ne(H || !!Y), [$, D] = ne(""), p = ce.instance();
  if (le(() => {
    Y && p(Y, !1).catch((v) => {
      Object.hasOwn(v, "errors") && (D(v.errors.map((A) => A.title).join(" ")), V(!1));
    }).then((v) => {
      v && (F(ue(v, O, ee)), V(!1));
    });
  }, [Y]), le(() => {
    F(N ? ue(N, O, ee) : []);
  }, [N]), le(() => {
    V(H);
  }, [H]), M)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-spinner", role: "status", children: _ });
  if ($)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-field__error", children: $ });
  let o = [];
  if (J === null) {
    if (z === void 0)
      throw new Error("<CheckboxList> component must be inside a <Form> component.");
    o = re(z.row, S);
  } else
    o = Q;
  (o == null || o === "") && (o = []);
  const T = o.map((v) => typeof v == "object" ? JSON.stringify(v) : v), C = (v) => {
    const A = [...o];
    let I = v.target.value;
    if (v.target.checked)
      v.target.getAttribute("data-json") === "true" && (I = JSON.parse(I)), A.push(I);
    else {
      const R = T.indexOf(I);
      R > -1 && A.splice(R, 1);
    }
    J ? J(A, v) : K(v, S, A, t);
  };
  return /* @__PURE__ */ h.jsxs("fieldset", { className: `formosa-radio ${i}`.trim(), ...s, children: [
    /* @__PURE__ */ h.jsx("legend", { className: "formosa-radio__legend", children: P }),
    U.map((v) => {
      let A = v.value, I = !1;
      typeof A == "object" && (I = !0, A = JSON.stringify(A));
      const R = T.includes(A);
      let x = {};
      typeof f == "function" ? x = f(v) : f && typeof f == "object" && (x = f);
      let k = {};
      typeof w == "function" ? k = w(v) : w && typeof w == "object" && (k = w);
      let q = {};
      typeof l == "function" ? q = l(v) : l && typeof l == "object" && (q = l), I && (q["data-json"] = !0), S && (q.name = `${S}[]`);
      let B = {};
      typeof a == "function" ? B = a(v) : a && typeof a == "object" && (B = a);
      let E = {};
      return typeof g == "function" ? E = g(v) : g && typeof g == "object" && (E = g), /* @__PURE__ */ h.jsx("div", { className: `formosa-radio__item ${b}`.trim(), ...x, children: /* @__PURE__ */ h.jsxs(
        "label",
        {
          className: `formosa-radio__label${R ? " formosa-radio__label--checked" : ""} ${d}`.trim(),
          ...k,
          children: [
            /* @__PURE__ */ h.jsx(
              "input",
              {
                "aria-label": v.label,
                checked: R,
                className: `formosa-field__input formosa-field__input--checkbox ${r}`.trim(),
                disabled: n,
                onChange: C,
                readOnly: y,
                value: A,
                ...q,
                ...Z,
                type: "checkbox"
              }
            ),
            /* @__PURE__ */ h.jsx(
              Ht,
              {
                "aria-hidden": "true",
                className: `formosa-icon--check ${c}`.trim(),
                height: u,
                width: j,
                ...B
              }
            ),
            /* @__PURE__ */ h.jsx("span", { "aria-hidden": "true", className: `formosa-radio__span ${m}`.trim(), ...E, children: v.label })
          ]
        }
      ) }, A);
    })
  ] });
}
Kt.propTypes = {
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
function er({
  // eslint-disable-line complexity
  afterChange: t = null,
  buttonAttributes: r = null,
  buttonClassName: n = "",
  className: s = "",
  disabled: i = !1,
  emptyText: a = "No file selected.",
  id: c = "",
  imageAttributes: u = null,
  imageClassName: j = "",
  imageHeight: l = 100,
  imagePrefix: f = "",
  imagePreview: b = !1,
  inputWrapperAttributes: w = null,
  inputWrapperClassName: d = "",
  linkAttributes: g = null,
  linkClassName: m = "",
  linkImage: O = !1,
  multiple: P = !1,
  name: _ = "",
  readOnly: S = !1,
  removeText: N = "Remove",
  required: y = !1,
  setValue: J = null,
  value: H = null,
  wrapperAttributes: Y = null,
  wrapperClassName: Q = "",
  ...ee
}) {
  const { formState: Z, setValues: z } = ae(fe), K = Re(null);
  let U = "";
  if (J === null) {
    if (Z === void 0)
      throw new Error("<File> component must be inside a <Form> component.");
    U = re(Z.row, _);
  } else
    U = H;
  U == null && (U = "");
  const F = P ? U.length > 0 : !!U, M = (x) => {
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
        return x.map((q) => `${f}${q}`);
      typeof x == "object" ? k.push(URL.createObjectURL(x)) : typeof x == "string" && k.push(`${f}${x}`);
    }
    return k;
  }, [$, D] = ne(M(U)), [p, o] = ne(V(U));
  le(() => {
    D(M(U)), o(V(U));
  }, [U]);
  const T = (x) => {
    const k = P ? x.target.files : x.target.files.item(0);
    D(M(k)), b && o(V(k)), J ? J(k, x) : z(x, _, k, t, k);
  }, C = (x) => {
    D("");
    const k = "";
    J ? J(k, x) : z(x, _, k, t, k), K.current.focus();
  };
  let v = d;
  F && !i && !S && (v += " formosa-prefix");
  const A = {};
  (c || _) && (A.id = c || _);
  const I = {};
  _ && (I.name = _);
  const R = {};
  return (c || _) && (R.id = `${c || _}-remove`), /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    F && b && p.map((x) => {
      const k = /* @__PURE__ */ h.jsx(
        "img",
        {
          alt: "",
          className: `formosa-file-image ${j}`.trim(),
          height: l,
          src: x,
          ...u
        },
        x
      );
      return O ? /* @__PURE__ */ h.jsx("a", { className: `formosa-file-link ${m}`.trim(), href: x, ...g, children: k }, x) : k;
    }),
    /* @__PURE__ */ h.jsxs("div", { className: `formosa-file-wrapper ${Q}`.trim(), ...Y, children: [
      /* @__PURE__ */ h.jsxs("div", { className: `formosa-file-input-wrapper ${v}`.trim(), ...w, children: [
        /* @__PURE__ */ h.jsx(
          "div",
          {
            className: `formosa-file-name${$ ? "" : " formosa-file-name--empty"}`,
            id: `${c || _}-name`,
            children: $ || a
          }
        ),
        !S && /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
          /* @__PURE__ */ h.jsx(
            "input",
            {
              className: `formosa-field__input formosa-field__input--file ${s}`.trim(),
              disabled: i,
              multiple: P,
              onChange: T,
              ref: K,
              type: "file",
              ...A,
              ...ee
            }
          ),
          /* @__PURE__ */ h.jsx(
            "input",
            {
              disabled: i,
              required: y,
              type: "hidden",
              value: U,
              ...I
            }
          )
        ] })
      ] }),
      F && !i && !S && /* @__PURE__ */ h.jsx(
        "button",
        {
          className: `formosa-button formosa-button--remove-file formosa-postfix ${n}`.trim(),
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
er.propTypes = {
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
  ...n
}) {
  return r ? /* @__PURE__ */ h.jsx("div", { ...n, children: t }) : t;
}
ut.propTypes = {
  children: e.node.isRequired,
  condition: e.any
};
function Ye({
  afterChange: t = null,
  className: r = "",
  id: n = null,
  name: s = "",
  setValue: i = null,
  suffix: a = "",
  type: c = "text",
  value: u = null,
  ...j
}) {
  const { formState: l, setValues: f } = ae(fe);
  let b = "";
  if (i === null) {
    if (l === void 0)
      throw new Error("<Input> component must be inside a <Form> component.");
    c !== "file" && (b = re(l.row, s), b == null && (b = ""));
  } else
    b = u;
  const w = (g) => {
    const m = g.target.value;
    i ? i(m, g) : f(g, s, m, t);
  }, d = {};
  return (n || s) && (d.id = n || s), s && (d.name = s), /* @__PURE__ */ h.jsxs(ut, { className: "formosa-suffix-container", condition: a, children: [
    /* @__PURE__ */ h.jsx(
      "input",
      {
        className: `formosa-field__input ${r}`.trim(),
        onChange: w,
        type: c,
        value: b,
        ...d,
        ...j
      }
    ),
    a && /* @__PURE__ */ h.jsx("span", { className: "formosa-suffix", children: a })
  ] });
}
Ye.propTypes = {
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
function tr({
  buttonAttributes: t = null,
  buttonClassName: r = "",
  className: n = "",
  hideAria: s = "Hide Password",
  hideText: i = "Hide",
  showAria: a = "Show Password",
  showText: c = "Show",
  wrapperAttributes: u = null,
  wrapperClassName: j = "",
  ...l
}) {
  const [f, b] = ne("password"), w = () => {
    b(f === "password" ? "text" : "password");
  };
  return /* @__PURE__ */ h.jsxs("div", { className: `formosa-password-wrapper ${j}`.trim(), ...u, children: [
    /* @__PURE__ */ h.jsx(
      Ye,
      {
        className: `formosa-field__input--password formosa-prefix ${n}`.trim(),
        spellCheck: "false",
        ...l,
        type: f
      }
    ),
    /* @__PURE__ */ h.jsx(
      "button",
      {
        "aria-controls": l.id || l.name,
        "aria-label": f === "password" ? a : s,
        className: `formosa-button formosa-button--toggle-password formosa-postfix ${r}`.trim(),
        onClick: w,
        type: "button",
        ...t,
        children: f === "password" ? c : i
      }
    )
  ] });
}
tr.propTypes = {
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
function rr({
  // eslint-disable-line complexity
  afterChange: t = null,
  className: r = "",
  fieldsetAttributes: n = null,
  fieldsetClassName: s = "",
  inputAttributes: i = null,
  itemAttributes: a = null,
  itemClassName: c = "",
  itemLabelAttributes: u = null,
  itemLabelClassName: j = "",
  itemSpanAttributes: l = null,
  itemSpanClassName: f = "",
  labelKey: b = "name",
  legend: w = "",
  loadingText: d = "Loading...",
  name: g = "",
  options: m = null,
  required: O = !1,
  setValue: P = null,
  showLoading: _ = !1,
  url: S = null,
  value: N = null,
  valueKey: y = null,
  ...J
}) {
  const { formState: H, setValues: Y } = ae(fe), [Q, ee] = ne(m ? ue(m, b, y) : []), [Z, z] = ne(_ || !!S), [K, U] = ne(""), F = ce.instance();
  if (le(() => {
    S && F(S, !1).catch(($) => {
      Object.hasOwn($, "errors") && (U($.errors.map((D) => D.title).join(" ")), z(!1));
    }).then(($) => {
      $ && (ee(ue($, b, y)), z(!1));
    });
  }, [S]), le(() => {
    ee(m ? ue(m, b, y) : []);
  }, [m]), le(() => {
    z(_);
  }, [_]), Z)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-spinner", role: "status", children: d });
  if (K)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-field__error", children: K });
  let M;
  if (P === null) {
    if (H === void 0)
      throw new Error("<Radio> component must be inside a <Form> component.");
    M = re(H.row, g);
  } else
    M = N;
  M == null && (M = ""), typeof M == "object" && (M = JSON.stringify(M));
  const V = ($) => {
    let D = $.target.value;
    $.target.getAttribute("data-json") === "true" && (D = JSON.parse(D)), P ? P(D, $) : Y($, g, D, t);
  };
  return /* @__PURE__ */ h.jsxs("fieldset", { className: `formosa-radio ${s}`.trim(), ...n, children: [
    /* @__PURE__ */ h.jsx("legend", { className: "formosa-radio__legend", children: w }),
    Q.map(($) => {
      let D = $.value, p = !1;
      typeof D == "object" && (p = !0, D = JSON.stringify(D));
      const o = M === D;
      let T = {};
      typeof a == "function" ? T = a($) : a && typeof a == "object" && (T = a);
      let C = {};
      typeof u == "function" ? C = u($) : u && typeof u == "object" && (C = u);
      let v = {};
      typeof i == "function" ? v = i($) : i && typeof i == "object" && (v = i), p && (v["data-json"] = !0), g && (v.name = g);
      let A = {};
      return typeof l == "function" ? A = l($) : l && typeof l == "object" && (A = l), /* @__PURE__ */ h.jsx("div", { className: `formosa-radio__item ${c}`.trim(), ...T, children: /* @__PURE__ */ h.jsxs(
        "label",
        {
          className: `formosa-radio__label${o ? " formosa-radio__label--checked" : ""} ${j}`.trim(),
          ...C,
          children: [
            /* @__PURE__ */ h.jsx(
              "input",
              {
                "aria-label": $.label,
                checked: o,
                className: `formosa-field__input formosa-radio__input ${r}`.trim(),
                onChange: V,
                required: O,
                type: "radio",
                value: D,
                ...v,
                ...J
              }
            ),
            /* @__PURE__ */ h.jsx("span", { "aria-hidden": "true", className: `formosa-radio__span ${f}`.trim(), ...A, children: $.label })
          ]
        }
      ) }, D);
    })
  ] });
}
rr.propTypes = {
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
const Zr = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z" }));
function nr({
  className: t = "",
  iconAttributes: r = null,
  iconClassName: n = "",
  iconHeight: s = 16,
  iconWidth: i = 16,
  wrapperAttributes: a = null,
  wrapperClassName: c = "",
  ...u
}) {
  return /* @__PURE__ */ h.jsxs("div", { className: `formosa-search-wrapper ${c}`.trim(), ...a, children: [
    /* @__PURE__ */ h.jsx(
      Ye,
      {
        className: `formosa-field__input--search ${t}`.trim(),
        ...u
      }
    ),
    /* @__PURE__ */ h.jsx(
      Zr,
      {
        "aria-hidden": "true",
        className: `formosa-icon--search ${n}`.trim(),
        height: s,
        width: i,
        ...r
      }
    )
  ] });
}
nr.propTypes = {
  className: e.string,
  iconAttributes: e.object,
  iconClassName: e.string,
  iconHeight: e.number,
  iconWidth: e.number,
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
const Qr = (t) => /* @__PURE__ */ be.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 8 8", ...t }, /* @__PURE__ */ be.createElement("path", { d: "M0 2l4 4 4-4H0z" }));
function sr({
  // eslint-disable-line complexity
  afterChange: t = null,
  className: r = "",
  hideBlank: n = !1,
  iconAttributes: s = null,
  iconClassName: i = "",
  iconHeight: a = 16,
  iconWidth: c = 16,
  id: u = null,
  labelKey: j = "name",
  loadingText: l = "Loading...",
  multiple: f = !1,
  name: b = "",
  optionAttributes: w = null,
  options: d = null,
  setValue: g = null,
  showLoading: m = !1,
  url: O = null,
  value: P = null,
  valueKey: _ = null,
  wrapperAttributes: S = null,
  wrapperClassName: N = "",
  ...y
}) {
  const { formState: J, setValues: H } = ae(fe), [Y, Q] = ne(d ? ue(d, j, _) : []), [ee, Z] = ne(m || !!O), [z, K] = ne(""), U = ce.instance();
  if (le(() => {
    O && U(O, !1).catch(($) => {
      Object.hasOwn($, "errors") && (K($.errors.map((D) => D.title).join(" ")), Z(!1));
    }).then(($) => {
      $ && (Q(ue($, j, _)), Z(!1));
    });
  }, [O]), le(() => {
    Q(d ? ue(d, j, _) : []);
  }, [d]), le(() => {
    Z(m);
  }, [m]), ee)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-spinner", role: "status", children: l });
  if (z)
    return /* @__PURE__ */ h.jsx("div", { className: "formosa-field__error", children: z });
  let F;
  if (g === null) {
    if (J === void 0)
      throw new Error("<Select> component must be inside a <Form> component.");
    F = re(J.row, b);
  } else
    F = P;
  F == null && (F = f ? [] : ""), typeof F == "object" && !f && (F = JSON.stringify(F));
  const M = ($) => {
    let D;
    f ? D = Array.from($.target.options).filter((p) => p.selected).map((p) => p.value) : (D = $.target.value, $.target.querySelector(`[value="${D.replace(/"/g, '\\"')}"]`).getAttribute("data-json") === "true" && (D = JSON.parse(D))), g ? g(D, $) : H($, b, D, t);
  }, V = {};
  return (u || b) && (V.id = u || b), b && (V.name = b), f && (V.multiple = !0), /* @__PURE__ */ h.jsxs("div", { className: `formosa-select-wrapper ${N}`.trim(), ...S, children: [
    /* @__PURE__ */ h.jsxs(
      "select",
      {
        className: `formosa-field__input formosa-field__input--select ${r}`.trim(),
        onChange: M,
        value: F,
        ...V,
        ...y,
        children: [
          !n && !f && /* @__PURE__ */ h.jsx("option", { value: "" }),
          Y.map(($) => {
            let D = $.value, p = !1;
            typeof D == "object" && (p = !0, D = JSON.stringify(D));
            let o = {};
            return typeof w == "function" ? o = w($) : w && typeof w == "object" && (o = w), p && (o["data-json"] = !0), /* @__PURE__ */ h.jsx("option", { value: D, ...o, children: $.label }, D);
          })
        ]
      }
    ),
    !f && /* @__PURE__ */ h.jsx(
      Qr,
      {
        "aria-hidden": "true",
        className: `formosa-icon--caret ${i}`.trim(),
        height: a,
        width: c,
        ...s
      }
    )
  ] });
}
sr.propTypes = {
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
function or({
  afterChange: t = null,
  className: r = "",
  id: n = null,
  name: s = "",
  setValue: i = null,
  value: a = null,
  ...c
}) {
  const { formState: u, setValues: j } = ae(fe);
  let l;
  if (i === null) {
    if (u === void 0)
      throw new Error("<Textarea> component must be inside a <Form> component.");
    l = re(u.row, s);
  } else
    l = a;
  l == null && (l = "");
  const f = (w) => {
    const d = w.target.value;
    i ? i(d, w) : j(w, s, d, t);
  }, b = {};
  return (n || s) && (b.id = n || s), s && (b.name = s), /* @__PURE__ */ h.jsx(
    "textarea",
    {
      className: `formosa-field__input formosa-field__input--textarea ${r}`.trim(),
      onChange: f,
      value: l,
      ...b,
      ...c
    }
  );
}
or.propTypes = {
  afterChange: e.func,
  className: e.string,
  id: e.string,
  name: e.string,
  setValue: e.func,
  value: e.string
};
const ir = (t, r) => r || (t === "select" ? sr : t === "textarea" ? or : t === "radio" ? rr : t === "checkbox" ? Qt : t === "password" ? tr : t === "search" ? nr : t === "autocomplete" ? Zt : t === "file" ? er : t === "checkbox-list" ? Kt : Ye);
function Kr({
  component: t = null,
  type: r = "text",
  ...n
}) {
  const s = ir(r, t);
  return /* @__PURE__ */ h.jsx(s, { type: r, ...n });
}
Kr.propTypes = {
  component: e.func,
  type: e.string
};
function ar({
  className: t = "",
  htmlFor: r = "",
  label: n = "",
  note: s = "",
  required: i = !1,
  type: a = "",
  ...c
}) {
  let u = "formosa-label";
  i && (u += " formosa-label--required");
  let j = "formosa-label-wrapper";
  a === "checkbox" && (j += " formosa-label-wrapper--checkbox");
  const l = ["radio", "checkbox-list"].includes(a), f = {};
  return r && !l && (f.htmlFor = r), l && (f["aria-hidden"] = !0), /* @__PURE__ */ h.jsxs("div", { className: j, children: [
    /* @__PURE__ */ h.jsx("label", { className: `${u} ${t}`.trim(), ...f, ...c, children: n }),
    s && /* @__PURE__ */ h.jsx("span", { className: "formosa-label__note", children: s })
  ] });
}
ar.propTypes = {
  className: e.string,
  htmlFor: e.string,
  label: e.string,
  note: e.string,
  required: e.bool,
  type: e.string
};
function en({
  // eslint-disable-line complexity
  component: t = null,
  disabled: r = !1,
  id: n = null,
  inputInnerWrapperAttributes: s = {},
  inputInnerWrapperClassName: i = "",
  inputWrapperAttributes: a = {},
  inputWrapperClassName: c = "",
  label: u = "",
  labelAttributes: j = {},
  labelClassName: l = "",
  labelNote: f = "",
  labelPosition: b = "before",
  name: w = "",
  note: d = "",
  prefix: g = null,
  postfix: m = null,
  readOnly: O = !1,
  required: P = !1,
  suffix: _ = "",
  type: S = "text",
  wrapperAttributes: N = {},
  wrapperClassName: y = "",
  ...J
}) {
  const { formState: H } = ae(fe), Y = { ...J };
  n && (Y.id = n), w && (Y.name = w), r && (Y.disabled = r), O && (Y.readOnly = O), P && (Y.required = P), _ && (Y.suffix = _), S && (Y.type = S, O && S === "number" && (Y.type = "text"), ["radio", "checkbox-list"].includes(S) && !Y.legend && (Y.legend = u));
  const Q = ir(S, t), ee = /* @__PURE__ */ h.jsx(Q, { ...Y });
  if (S === "hidden")
    return ee;
  const Z = n || w, z = /* @__PURE__ */ h.jsx(
    ar,
    {
      className: l,
      htmlFor: Z,
      label: u,
      note: f,
      required: P,
      type: S,
      ...j
    }
  ), K = H && w && Object.hasOwn(H.errors, w), U = Z.replace(/[^a-z0-9_-]/gi, ""), F = ["formosa-field"];
  U && F.push(`formosa-field--${U}`), y && F.push(y), K && F.push("formosa-field--has-error"), r && F.push("formosa-field--disabled"), O && F.push("formosa-field--read-only"), g && F.push("formosa-field--has-prefix"), m && F.push("formosa-field--has-postfix"), b === "after" && F.push("formosa-field--label-after");
  const M = ["formosa-input-wrapper", `formosa-input-wrapper--${S}`];
  c && M.push(c), _ && M.push("formosa-field--has-suffix");
  const V = ["formosa-input-inner-wrapper"];
  return i && V.push(i), /* @__PURE__ */ h.jsxs("div", { className: F.join(" "), ...N, children: [
    u && b === "before" && z,
    u && b === "after" && /* @__PURE__ */ h.jsx("div", { className: "formosa-label-wrapper" }),
    /* @__PURE__ */ h.jsxs("div", { className: M.join(" "), ...a, children: [
      /* @__PURE__ */ h.jsxs(
        ut,
        {
          className: V.join(" "),
          condition: !!g || !!m,
          ...s,
          children: [
            g,
            ee,
            u && b === "after" && z,
            d && /* @__PURE__ */ h.jsx("div", { className: "formosa-field__note", children: d }),
            m
          ]
        }
      ),
      H && H.showInlineErrors && /* @__PURE__ */ h.jsx(Gt, { id: n, name: w })
    ] })
  ] });
}
en.propTypes = {
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
  postfix: e.node,
  prefix: e.node,
  readOnly: e.bool,
  required: e.bool,
  suffix: e.string,
  type: e.string,
  wrapperAttributes: e.object,
  wrapperClassName: e.string
};
const $e = pe.createContext(
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
var nt, Ft;
function tn() {
  return Ft || (Ft = 1, nt = function(r) {
    return typeof r == "object" ? r === null : typeof r != "function";
  }), nt;
}
var st, qt;
function rn() {
  return qt || (qt = 1, st = function(r) {
    return r != null && typeof r == "object" && Array.isArray(r) === !1;
  }), st;
}
var ot, Lt;
function nn() {
  if (Lt) return ot;
  Lt = 1;
  var t = rn();
  function r(n) {
    return t(n) === !0 && Object.prototype.toString.call(n) === "[object Object]";
  }
  return ot = function(s) {
    var i, a;
    return !(r(s) === !1 || (i = s.constructor, typeof i != "function") || (a = i.prototype, r(a) === !1) || a.hasOwnProperty("isPrototypeOf") === !1);
  }, ot;
}
var it, Mt;
function sn() {
  if (Mt) return it;
  Mt = 1;
  const { deleteProperty: t } = Reflect, r = tn(), n = nn(), s = (d) => typeof d == "object" && d !== null || typeof d == "function", i = (d) => d === "__proto__" || d === "constructor" || d === "prototype", a = (d) => {
    if (!r(d))
      throw new TypeError("Object keys must be strings or symbols");
    if (i(d))
      throw new Error(`Cannot set unsafe key: "${d}"`);
  }, c = (d) => Array.isArray(d) ? d.flat().map(String).join(",") : d, u = (d, g) => {
    if (typeof d != "string" || !g) return d;
    let m = d + ";";
    return g.arrays !== void 0 && (m += `arrays=${g.arrays};`), g.separator !== void 0 && (m += `separator=${g.separator};`), g.split !== void 0 && (m += `split=${g.split};`), g.merge !== void 0 && (m += `merge=${g.merge};`), g.preservePaths !== void 0 && (m += `preservePaths=${g.preservePaths};`), m;
  }, j = (d, g, m) => {
    const O = c(g ? u(d, g) : d);
    a(O);
    const P = w.cache.get(O) || m();
    return w.cache.set(O, P), P;
  }, l = (d, g = {}) => {
    const m = g.separator || ".", O = m === "/" ? !1 : g.preservePaths;
    if (typeof d == "string" && O !== !1 && /\//.test(d))
      return [d];
    const P = [];
    let _ = "";
    const S = (N) => {
      let y;
      N.trim() !== "" && Number.isInteger(y = Number(N)) ? P.push(y) : P.push(N);
    };
    for (let N = 0; N < d.length; N++) {
      const y = d[N];
      if (y === "\\") {
        _ += d[++N];
        continue;
      }
      if (y === m) {
        S(_), _ = "";
        continue;
      }
      _ += y;
    }
    return _ && S(_), P;
  }, f = (d, g) => g && typeof g.split == "function" ? g.split(d) : typeof d == "symbol" ? [d] : Array.isArray(d) ? d : j(d, g, () => l(d, g)), b = (d, g, m, O) => {
    if (a(g), m === void 0)
      t(d, g);
    else if (O && O.merge) {
      const P = O.merge === "function" ? O.merge : Object.assign;
      P && n(d[g]) && n(m) ? d[g] = P(d[g], m) : d[g] = m;
    } else
      d[g] = m;
    return d;
  }, w = (d, g, m, O) => {
    if (!g || !s(d)) return d;
    const P = f(g, O);
    let _ = d;
    for (let S = 0; S < P.length; S++) {
      const N = P[S], y = P[S + 1];
      if (a(N), y === void 0) {
        b(_, N, m, O);
        break;
      }
      if (typeof y == "number" && !Array.isArray(_[N])) {
        _ = _[N] = [];
        continue;
      }
      s(_[N]) || (_[N] = {}), _ = _[N];
    }
    return d;
  };
  return w.split = f, w.cache = /* @__PURE__ */ new Map(), w.clear = () => {
    w.cache = /* @__PURE__ */ new Map();
  }, it = w, it;
}
var on = sn();
const he = /* @__PURE__ */ Ut(on), Ne = (t) => ({
  id: t.id,
  type: t.type
}), an = (t) => Array.isArray(t) ? t.map((r) => Ne(r)) : Ne(t), ln = (t) => {
  const r = Object.keys(t.attributes).length > 0;
  r || delete t.attributes;
  const n = Object.keys(t.relationships).length > 0;
  return n || delete t.relationships, !r && !n && !t.id.startsWith("temp-") ? null : t;
}, We = (t, r) => {
  const n = [];
  return t.forEach((s) => {
    if (s.startsWith(`${r}.`)) {
      const i = s.split(".");
      i.shift(), n.push(i.join("."));
    }
  }), n;
}, Dt = (t, r, n) => {
  let s = [];
  const i = Ne(t);
  i.attributes = {}, i.relationships = {}, Object.keys(t).forEach((c) => {
    if (c !== "id" && c !== "type" && Object.hasOwn(n, c))
      if (r.includes(c))
        if (Array.isArray(t[c])) {
          const u = [];
          t[c].forEach((j, l) => {
            if (typeof n[c][l] < "u") {
              const f = Je(j, We(r, c), n[c][l]);
              s = s.concat(f);
            }
            u.push(Ne(j));
          }), he(i.relationships, c, { data: u });
        } else {
          const u = Je(t[c], We(r, c), n[c]), j = u.shift();
          s = s.concat(u), he(i.relationships, c, { data: j });
        }
      else
        he(i.attributes, c, t[c]);
  });
  const a = ln(i);
  return a !== null && s.unshift(a), s;
}, Je = (t, r, n) => t.id.startsWith("temp-") ? Dt(t, r, n) : typeof n > "u" ? [] : Object.keys(n).length <= 0 ? [Ne(t)] : Dt(t, r, n), cn = (t) => {
  const r = {};
  return t.forEach((n) => {
    const s = [];
    n.split(".").forEach((i) => {
      s.push(i), typeof re(r, s.join(".")) > "u" && he(r, s.join("."), {});
    });
  }), r;
}, fn = (t, r, n) => {
  let s = [];
  if (r.length <= 0)
    return s;
  const i = cn(r);
  return Object.keys(i).forEach((a) => {
    if (Object.hasOwn(t.relationships, a))
      if (Array.isArray(t.relationships[a].data))
        Object.keys(t.relationships[a].data).forEach((c) => {
          const u = t.relationships[a].data[c];
          if (u) {
            const j = Je(u, We(n, a), i[a][c]);
            s = s.concat(j);
          }
        });
      else {
        const c = t.relationships[a].data;
        if (c) {
          const u = Je(c, We(n, a), i[a]);
          s = s.concat(u);
        }
      }
  }), s.filter((a) => Object.keys(a).length > 2);
}, un = (t, r) => {
  if (Object.hasOwn(t, r))
    return delete t[r];
  const n = r.split("."), s = n.pop();
  let i = t;
  return n.forEach((a) => {
    i = i[a];
  }), delete i[s];
}, lr = (t, r, n = "") => (Object.entries(t).forEach((s) => {
  const [i, a] = s, c = n ? `${n}[${i}]` : i;
  typeof a == "object" ? r = lr(a, r, c) : r.append(c, JSON.stringify(a));
}), r), dn = (t, r, n, s, i, a, c = null, u = null) => {
  let j = null;
  if (t === "PUT" || t === "POST") {
    const l = {
      type: r,
      attributes: {},
      relationships: {},
      meta: {}
    };
    t === "PUT" && n && (l.id = n);
    let f = { ...s.row };
    u && (f = u(f));
    const b = Object.keys(s.files);
    (t === "PUT" ? i : Object.keys(s.row)).forEach((m) => {
      const O = m.replace(/\..+$/, "");
      a.includes(O) ? l.relationships[O] = {
        data: re(f, O)
      } : a.includes(m) ? l.relationships[m] = {
        data: re(f, O)
      } : m.startsWith("meta.") ? he(l, m, re(f, m)) : m === "meta" ? l.meta = f.meta : b.includes(m) ? un(l.attributes, m) : he(l.attributes, m, re(f, m));
    }), j = { data: l };
    const d = fn(l, i, a);
    d.length > 0 && (j.included = d), Object.keys(l.relationships).forEach((m) => {
      typeof l.relationships[m].data == "string" && (l.relationships[m].data === "" ? l.relationships[m].data = null : l.relationships[m].data = JSON.parse(l.relationships[m].data)), l.relationships[m].data && (l.relationships[m].data = an(l.relationships[m].data));
    }), c && (j = c(j, s.row)), Object.keys(l.attributes).length <= 0 && delete l.attributes, Object.keys(l.meta).length <= 0 && delete l.meta, Object.keys(l.relationships).length <= 0 && delete l.relationships;
    const g = b.filter((m) => s.files[m] !== !1);
    if (g.length > 0) {
      const m = lr(j, new FormData());
      m.append("meta[files]", JSON.stringify(g)), g.forEach((O) => {
        Object.prototype.toString.call(s.files[O]) === "[object FileList]" ? Array.from(s.files[O]).forEach((P, _) => {
          m.append(`${O}[${_}]`, P);
        }) : m.append(O, s.files[O]);
      }), j = m;
    }
  }
  return j;
}, ie = [];
for (let t = 0; t < 256; ++t)
  ie.push((t + 256).toString(16).slice(1));
function pn(t, r = 0) {
  return (ie[t[r + 0]] + ie[t[r + 1]] + ie[t[r + 2]] + ie[t[r + 3]] + "-" + ie[t[r + 4]] + ie[t[r + 5]] + "-" + ie[t[r + 6]] + ie[t[r + 7]] + "-" + ie[t[r + 8]] + ie[t[r + 9]] + "-" + ie[t[r + 10]] + ie[t[r + 11]] + ie[t[r + 12]] + ie[t[r + 13]] + ie[t[r + 14]] + ie[t[r + 15]]).toLowerCase();
}
let at;
const mn = new Uint8Array(16);
function yn() {
  if (!at) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    at = crypto.getRandomValues.bind(crypto);
  }
  return at(mn);
}
const hn = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Vt = { randomUUID: hn };
function gn(t, r, n) {
  t = t || {};
  const s = t.random ?? t.rng?.() ?? yn();
  if (s.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, pn(s);
}
function Wt(t, r, n) {
  return Vt.randomUUID && !t ? Vt.randomUUID() : gn(t);
}
function cr({
  // eslint-disable-line complexity
  afterNoSubmit: t = null,
  beforeSubmit: r = null,
  children: n = null,
  clearOnSubmit: s = !1,
  defaultRow: i = {},
  errorMessageText: a = "",
  errorToastText: c = "",
  filterBody: u = null,
  filterValues: j = null,
  htmlId: l = "",
  id: f = "",
  method: b = null,
  params: w = "",
  path: d = null,
  preventEmptyRequest: g = !1,
  preventEmptyRequestText: m = "No changes to save.",
  relationshipNames: O = [],
  showMessage: P = !0,
  successMessageText: _ = "",
  successToastText: S = "",
  ...N
}) {
  const { formState: y, setFormState: J, getDirtyKeys: H } = ae(fe), { addToast: Y } = ae($e), Q = (ee) => {
    ee.preventDefault();
    const Z = H();
    if (g && Z.length <= 0) {
      m && Y(m), t && t();
      return;
    }
    if (r && !r(ee))
      return;
    let z = d;
    f && (z = `${d}/${f}`), w && (z += `?${w}`);
    const K = dn(
      b,
      d,
      f,
      y,
      Z,
      O,
      u,
      j
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
      if (!Object.hasOwn(F, "errors") || !Array.isArray(F.errors))
        throw F;
      const M = {};
      let V;
      F.errors.forEach(($) => {
        if (Object.hasOwn($, "source")) {
          if (V = $.source.pointer.replace("/data/attributes/", ""), V = V.replace("/data/meta/", "meta."), V.startsWith("/included/")) {
            const D = V.replace(/^\/included\/(\d+)\/.+$/g, "$1"), p = K.included[parseInt(D, 10)];
            V = V.replace(/^\/included\/(\d+)\//g, `included.${p.type}.${p.id}.`);
          }
          V = V.replace(/\//g, "."), document.querySelector(`[data-name="${V}"].formosa-field__error`) || (V = "");
        } else
          V = "";
        Object.hasOwn(M, V) || (M[V] = []), M[V].push($.title);
      }), J({
        ...y,
        alertClass: "error",
        alertText: typeof a == "function" ? a(F) : a,
        errors: M,
        response: F,
        toastClass: "error",
        toastText: typeof c == "function" ? c(F) : c,
        uuid: Wt()
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
        toastText: typeof S == "function" ? S(F) : S,
        uuid: Wt()
      };
      s ? (M.originalRow = JSON.parse(JSON.stringify(i)), M.row = JSON.parse(JSON.stringify(i)), y.setRow && y.setRow(M.row)) : M.originalRow = JSON.parse(JSON.stringify(y.row)), J(M);
    });
  };
  return b && d && !Object.hasOwn(N, "onSubmit") && (N.onSubmit = Q), l && (N.id = l), /* @__PURE__ */ h.jsxs("form", { ...N, children: [
    P && y.alertText && /* @__PURE__ */ h.jsx(ft, { type: y.alertClass, children: y.alertText }),
    n
  ] });
}
cr.propTypes = {
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
function bn({
  afterSubmitFailure: t = null,
  afterSubmitSuccess: r = null,
  children: n = null,
  row: s = {},
  setRow: i = null,
  showInlineErrors: a = !0,
  ...c
}) {
  const { addToast: u } = ae($e), j = (g, m, O, P) => {
    const _ = { ...g.originalRow };
    he(_, O, P), m({
      ...g,
      originalRow: JSON.parse(JSON.stringify(_))
      // Deep copy.
    });
  }, [l, f] = ne({
    alertClass: "",
    alertText: "",
    errors: {},
    files: {},
    originalRow: JSON.parse(JSON.stringify(s)),
    // Deep copy.
    row: s,
    response: null,
    setOriginalValue: j,
    setRow: i,
    showInlineErrors: a,
    toastClass: "",
    toastText: "",
    uuid: null
  });
  le(() => {
    JSON.stringify(s) !== JSON.stringify(l.row) && f({
      ...l,
      row: s
    });
  }), le(() => {
    l.uuid && (l.toastText && u(l.toastText, l.toastClass), l.alertClass === "success" && r ? r(l.response, l, f) : l.alertClass === "error" && t && t(l.response, l, f));
  }, [l.uuid]);
  const b = (g, m) => {
    let O = [];
    return Object.keys(g).forEach((P) => {
      let _ = re(m, P), S = re(g, P);
      if (Array.isArray(_) || Array.isArray(S)) {
        let y;
        Object.keys(S).forEach((J) => {
          const H = _ ? _.findIndex((Y) => Y.id === S[J].id) : -1;
          y = b(S[J], H > -1 ? _[H] : {}), y = y.map((Y) => `${P}.${J}.${Y}`), O = O.concat(y);
        });
      }
      typeof _ != "string" && (_ = JSON.stringify(_)), typeof S != "string" && (S = JSON.stringify(S)), S !== _ && O.push(P);
    }), O;
  }, w = (g, m, O, P = null, _ = null) => {
    const S = { ...l.row };
    if (he(S, m, O), P) {
      const y = P(g, S, O);
      Object.keys(y).forEach((J) => {
        he(S, J, y[J]);
      });
    }
    const N = {
      ...l,
      row: S
    };
    _ !== null && he(N, `files.${m}`, _), f(N), l.setRow && l.setRow(S);
  }, d = Jt(() => ({
    formState: l,
    setFormState: f,
    clearAlert: () => f({ ...l, alertText: "", alertClass: "" }),
    clearErrors: () => f({ ...l, errors: {} }),
    getDirtyKeys: () => b(l.row, l.originalRow),
    setValues: w
  }), [l]);
  return /* @__PURE__ */ h.jsx(fe.Provider, { value: d, children: /* @__PURE__ */ h.jsx(cr, { ...c, children: n }) });
}
bn.propTypes = {
  afterSubmitFailure: e.func,
  afterSubmitSuccess: e.func,
  children: e.node,
  row: e.object,
  setRow: e.func,
  showInlineErrors: e.bool
};
function wn({ ...t }) {
  const { formState: r } = ae(fe);
  return r.alertText ? /* @__PURE__ */ h.jsx(ft, { type: r.alertClass, ...t, children: r.alertText }) : null;
}
function fr({ loadingText: t = "Loading..." }) {
  const { promiseInProgress: r } = Yr();
  return r ? /* @__PURE__ */ h.jsx("div", { className: "formosa-spinner formosa-spinner--fullscreen", role: "status", children: t }) : null;
}
fr.propTypes = {
  loadingText: e.string
};
function ur({
  className: t = "",
  id: r,
  milliseconds: n,
  text: s
}) {
  const { removeToast: i } = ae($e);
  return /* @__PURE__ */ h.jsxs("div", { "aria-live": "polite", className: `formosa-toast ${t}`.trim(), role: "alert", style: { animationDuration: `${n}ms` }, children: [
    /* @__PURE__ */ h.jsx("div", { className: "formosa-toast__text", children: s }),
    /* @__PURE__ */ h.jsxs("button", { className: "formosa-toast__close", onClick: () => i(r), type: "button", children: [
      /* @__PURE__ */ h.jsx(lt, { "aria-hidden": "true", className: "formosa-toast__close-icon", height: 12, width: 12 }),
      "Close"
    ] })
  ] });
}
ur.propTypes = {
  className: e.string,
  id: e.string.isRequired,
  milliseconds: e.number.isRequired,
  text: e.string.isRequired
};
function vn() {
  const { toasts: t } = ae($e);
  return /* @__PURE__ */ h.jsx("div", { className: "formosa-toast-container", children: Object.keys(t).map((r) => /* @__PURE__ */ h.jsx(
    ur,
    {
      className: t[r].className,
      id: r,
      milliseconds: t[r].milliseconds,
      text: t[r].text
    },
    r
  )) });
}
function jn({ children: t, loadingText: r = "Loading..." }) {
  const [n, s] = ne(!0), [i, a] = ne({}), c = (b) => {
    const w = { ...i };
    Object.hasOwn(i, b) && (delete w[b], a(w));
  }, u = (b, w = "", d = 5e3) => {
    const g = (/* @__PURE__ */ new Date()).getTime(), m = {
      className: w ? `formosa-toast--${w}` : "",
      text: b,
      milliseconds: d
    }, O = {
      ...i,
      [g]: m
    };
    a(O), setTimeout(() => {
      c(g);
    }, d);
  }, j = () => {
    s(!1);
  }, l = () => {
    s(!0);
  }, f = Jt(() => ({
    toasts: i,
    showWarningPrompt: n,
    addToast: u,
    removeToast: c,
    disableWarningPrompt: j,
    enableWarningPrompt: l
  }), [i, n]);
  return /* @__PURE__ */ h.jsxs($e.Provider, { value: f, children: [
    t,
    /* @__PURE__ */ h.jsx(fr, { loadingText: r }),
    /* @__PURE__ */ h.jsx(vn, {})
  ] });
}
jn.propTypes = {
  children: e.node.isRequired,
  loadingText: e.string
};
function On({
  className: t = "",
  label: r = "Submit",
  prefix: n = null,
  postfix: s = null,
  ...i
}) {
  return /* @__PURE__ */ h.jsxs("div", { className: "formosa-field formosa-field--submit", children: [
    /* @__PURE__ */ h.jsx("div", { className: "formosa-label-wrapper formosa-label-wrapper--submit" }),
    /* @__PURE__ */ h.jsxs("div", { className: "formosa-input-wrapper formosa-input-wrapper--submit", children: [
      n,
      /* @__PURE__ */ h.jsx(
        "button",
        {
          className: `formosa-button formosa-button--submit ${t}`.trim(),
          type: "submit",
          ...i,
          children: r
        }
      ),
      s
    ] })
  ] });
}
On.propTypes = {
  className: e.string,
  label: e.string,
  postfix: e.node,
  prefix: e.node
};
export {
  ft as Alert,
  ce as Api,
  Ht as CheckIcon,
  Gt as Error,
  en as Field,
  bn as Form,
  wn as FormAlert,
  jn as FormContainer,
  fe as FormContext,
  Ir as FormosaConfig,
  $e as FormosaContext,
  Kr as Input,
  ar as Label,
  On as Submit
};

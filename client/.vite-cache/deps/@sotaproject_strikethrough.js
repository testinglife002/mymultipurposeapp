import {
  __commonJS
} from "./chunk-PR4QN5HX.js";

// node_modules/@sotaproject/strikethrough/dist/bundle.js
var require_bundle = __commonJS({
  "node_modules/@sotaproject/strikethrough/dist/bundle.js"(exports, module) {
    !(function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Strikethrough = t() : e.Strikethrough = t();
    })(window, (function() {
      return (function(e) {
        var t = {};
        function n(r) {
          if (t[r]) return t[r].exports;
          var o = t[r] = { i: r, l: false, exports: {} };
          return e[r].call(o.exports, o, o.exports, n), o.l = true, o.exports;
        }
        return n.m = e, n.c = t, n.d = function(e2, t2, r) {
          n.o(e2, t2) || Object.defineProperty(e2, t2, { enumerable: true, get: r });
        }, n.r = function(e2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        }, n.t = function(e2, t2) {
          if (1 & t2 && (e2 = n(e2)), 8 & t2) return e2;
          if (4 & t2 && "object" == typeof e2 && e2 && e2.__esModule) return e2;
          var r = /* @__PURE__ */ Object.create(null);
          if (n.r(r), Object.defineProperty(r, "default", { enumerable: true, value: e2 }), 2 & t2 && "string" != typeof e2) for (var o in e2) n.d(r, o, (function(t3) {
            return e2[t3];
          }).bind(null, o));
          return r;
        }, n.n = function(e2) {
          var t2 = e2 && e2.__esModule ? function() {
            return e2.default;
          } : function() {
            return e2;
          };
          return n.d(t2, "a", t2), t2;
        }, n.o = function(e2, t2) {
          return Object.prototype.hasOwnProperty.call(e2, t2);
        }, n.p = "/", n(n.s = 4);
      })([function(e, t, n) {
        var r = n(1), o = n(2);
        "string" == typeof (o = o.__esModule ? o.default : o) && (o = [[e.i, o, ""]]);
        var i = { insert: "head", singleton: false };
        r(o, i);
        e.exports = o.locals || {};
      }, function(e, t, n) {
        "use strict";
        var r, o = function() {
          return void 0 === r && (r = Boolean(window && document && document.all && !window.atob)), r;
        }, i = /* @__PURE__ */ (function() {
          var e2 = {};
          return function(t2) {
            if (void 0 === e2[t2]) {
              var n2 = document.querySelector(t2);
              if (window.HTMLIFrameElement && n2 instanceof window.HTMLIFrameElement) try {
                n2 = n2.contentDocument.head;
              } catch (e3) {
                n2 = null;
              }
              e2[t2] = n2;
            }
            return e2[t2];
          };
        })(), a = [];
        function u(e2) {
          for (var t2 = -1, n2 = 0; n2 < a.length; n2++) if (a[n2].identifier === e2) {
            t2 = n2;
            break;
          }
          return t2;
        }
        function c(e2, t2) {
          for (var n2 = {}, r2 = [], o2 = 0; o2 < e2.length; o2++) {
            var i2 = e2[o2], c2 = t2.base ? i2[0] + t2.base : i2[0], s2 = n2[c2] || 0, l2 = "".concat(c2, " ").concat(s2);
            n2[c2] = s2 + 1;
            var f2 = u(l2), d2 = { css: i2[1], media: i2[2], sourceMap: i2[3] };
            -1 !== f2 ? (a[f2].references++, a[f2].updater(d2)) : a.push({ identifier: l2, updater: g(d2, t2), references: 1 }), r2.push(l2);
          }
          return r2;
        }
        function s(e2) {
          var t2 = document.createElement("style"), r2 = e2.attributes || {};
          if (void 0 === r2.nonce) {
            var o2 = n.nc;
            o2 && (r2.nonce = o2);
          }
          if (Object.keys(r2).forEach((function(e3) {
            t2.setAttribute(e3, r2[e3]);
          })), "function" == typeof e2.insert) e2.insert(t2);
          else {
            var a2 = i(e2.insert || "head");
            if (!a2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
            a2.appendChild(t2);
          }
          return t2;
        }
        var l, f = (l = [], function(e2, t2) {
          return l[e2] = t2, l.filter(Boolean).join("\n");
        });
        function d(e2, t2, n2, r2) {
          var o2 = n2 ? "" : r2.media ? "@media ".concat(r2.media, " {").concat(r2.css, "}") : r2.css;
          if (e2.styleSheet) e2.styleSheet.cssText = f(t2, o2);
          else {
            var i2 = document.createTextNode(o2), a2 = e2.childNodes;
            a2[t2] && e2.removeChild(a2[t2]), a2.length ? e2.insertBefore(i2, a2[t2]) : e2.appendChild(i2);
          }
        }
        function p(e2, t2, n2) {
          var r2 = n2.css, o2 = n2.media, i2 = n2.sourceMap;
          if (o2 ? e2.setAttribute("media", o2) : e2.removeAttribute("media"), i2 && btoa && (r2 += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i2)))), " */")), e2.styleSheet) e2.styleSheet.cssText = r2;
          else {
            for (; e2.firstChild; ) e2.removeChild(e2.firstChild);
            e2.appendChild(document.createTextNode(r2));
          }
        }
        var h = null, v = 0;
        function g(e2, t2) {
          var n2, r2, o2;
          if (t2.singleton) {
            var i2 = v++;
            n2 = h || (h = s(t2)), r2 = d.bind(null, n2, i2, false), o2 = d.bind(null, n2, i2, true);
          } else n2 = s(t2), r2 = p.bind(null, n2, t2), o2 = function() {
            !(function(e3) {
              if (null === e3.parentNode) return false;
              e3.parentNode.removeChild(e3);
            })(n2);
          };
          return r2(e2), function(t3) {
            if (t3) {
              if (t3.css === e2.css && t3.media === e2.media && t3.sourceMap === e2.sourceMap) return;
              r2(e2 = t3);
            } else o2();
          };
        }
        e.exports = function(e2, t2) {
          (t2 = t2 || {}).singleton || "boolean" == typeof t2.singleton || (t2.singleton = o());
          var n2 = c(e2 = e2 || [], t2);
          return function(e3) {
            if (e3 = e3 || [], "[object Array]" === Object.prototype.toString.call(e3)) {
              for (var r2 = 0; r2 < n2.length; r2++) {
                var o2 = u(n2[r2]);
                a[o2].references--;
              }
              for (var i2 = c(e3, t2), s2 = 0; s2 < n2.length; s2++) {
                var l2 = u(n2[s2]);
                0 === a[l2].references && (a[l2].updater(), a.splice(l2, 1));
              }
              n2 = i2;
            }
          };
        };
      }, function(e, t, n) {
        (t = n(3)(false)).push([e.i, ".cdx-strikethrough {\n    text-decoration: line-through;\n}\n", ""]), e.exports = t;
      }, function(e, t, n) {
        "use strict";
        e.exports = function(e2) {
          var t2 = [];
          return t2.toString = function() {
            return this.map((function(t3) {
              var n2 = (function(e3, t4) {
                var n3 = e3[1] || "", r = e3[3];
                if (!r) return n3;
                if (t4 && "function" == typeof btoa) {
                  var o = (a = r, u = btoa(unescape(encodeURIComponent(JSON.stringify(a)))), c = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(u), "/*# ".concat(c, " */")), i = r.sources.map((function(e4) {
                    return "/*# sourceURL=".concat(r.sourceRoot || "").concat(e4, " */");
                  }));
                  return [n3].concat(i).concat([o]).join("\n");
                }
                var a, u, c;
                return [n3].join("\n");
              })(t3, e2);
              return t3[2] ? "@media ".concat(t3[2], " {").concat(n2, "}") : n2;
            })).join("");
          }, t2.i = function(e3, n2, r) {
            "string" == typeof e3 && (e3 = [[null, e3, ""]]);
            var o = {};
            if (r) for (var i = 0; i < this.length; i++) {
              var a = this[i][0];
              null != a && (o[a] = true);
            }
            for (var u = 0; u < e3.length; u++) {
              var c = [].concat(e3[u]);
              r && o[c[0]] || (n2 && (c[2] ? c[2] = "".concat(n2, " and ").concat(c[2]) : c[2] = n2), t2.push(c));
            }
          }, t2;
        };
      }, function(e, t, n) {
        "use strict";
        n.r(t), n.d(t, "default", (function() {
          return i;
        }));
        n(0);
        function r(e2, t2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var r2 = t2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, r2.key, r2);
          }
        }
        function o(e2, t2, n2) {
          return t2 && r(e2.prototype, t2), n2 && r(e2, n2), e2;
        }
        var i = (function() {
          function e2(t2) {
            var n2 = t2.api;
            !(function(e3, t3) {
              if (!(e3 instanceof t3)) throw new TypeError("Cannot call a class as a function");
            })(this, e2), this.api = n2, this.button = null, this.tag = "S", this.iconClasses = { base: this.api.styles.inlineToolButton, active: this.api.styles.inlineToolButtonActive };
          }
          return o(e2, null, [{ key: "CSS", get: function() {
            return "cdx-strikethrough";
          } }]), o(e2, [{ key: "render", value: function() {
            return this.button = document.createElement("button"), this.button.type = "button", this.button.classList.add(this.iconClasses.base), this.button.innerHTML = this.toolboxIcon, this.button;
          } }, { key: "surround", value: function(t2) {
            if (t2) {
              var n2 = this.api.selection.findParentTag(this.tag, e2.CSS);
              n2 ? this.unwrap(n2) : this.wrap(t2);
            }
          } }, { key: "wrap", value: function(t2) {
            var n2 = document.createElement(this.tag);
            n2.classList.add(e2.CSS), n2.appendChild(t2.extractContents()), t2.insertNode(n2), this.api.selection.expandToTag(n2);
          } }, { key: "unwrap", value: function(e3) {
            this.api.selection.expandToTag(e3);
            var t2 = window.getSelection(), n2 = t2.getRangeAt(0), r2 = n2.extractContents();
            e3.parentNode.removeChild(e3), n2.insertNode(r2), t2.removeAllRanges(), t2.addRange(n2);
          } }, { key: "checkState", value: function() {
            var t2 = this.api.selection.findParentTag(this.tag, e2.CSS);
            this.button.classList.toggle(this.iconClasses.active, !!t2);
          } }, { key: "toolboxIcon", get: function() {
            return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 8.50001C13.5 7 10.935 6.66476 9.75315 7.79706C9.27092 8.25909 9 8.88574 9 9.53915C9 10.1926 9.27092 10.8192 9.75315 11.2812C10.9835 12.46 13.0165 11.5457 14.2468 12.7244C14.7291 13.1865 15 13.8131 15 14.4665C15 15.1199 14.7291 15.7466 14.2468 16.2086C12.8659 17.5317 10 17.5 9 16"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H18"/></svg>';
          } }], [{ key: "isInline", get: function() {
            return true;
          } }, { key: "sanitize", get: function() {
            return { s: { class: e2.CSS } };
          } }]), e2;
        })();
      }]).default;
    }));
  }
});
export default require_bundle();
//# sourceMappingURL=@sotaproject_strikethrough.js.map

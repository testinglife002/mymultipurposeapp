import {
  __commonJS
} from "./chunk-PR4QN5HX.js";

// node_modules/editorjs-text-alignment-blocktune/dist/bundle.js
var require_bundle = __commonJS({
  "node_modules/editorjs-text-alignment-blocktune/dist/bundle.js"(exports, module) {
    !(function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.AlignmentBlockTune = e() : t.AlignmentBlockTune = e();
    })(self, (function() {
      return (function() {
        var t = { 966: function(t2, e2, n2) {
          function r(t3, e3) {
            for (var n3 = 0; n3 < e3.length; n3++) {
              var r2 = e3[n3];
              r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t3, r2.key, r2);
            }
          }
          n2(548).toString();
          var i = n2(630).make, a = (function() {
            function t3(e4) {
              var n4 = e4.api, r2 = e4.data, i2 = e4.config, a3 = e4.block;
              !(function(t4, e5) {
                if (!(t4 instanceof e5)) throw new TypeError("Cannot call a class as a function");
              })(this, t3), this.api = n4, this.block = a3, this.settings = i2, this.data = r2 || { alignment: this.getAlignment() }, this.alignmentSettings = [{ name: "left", icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>' }, { name: "center", icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>' }, { name: "right", icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer" enable-background="new 0 0 64 64" height="20" viewBox="0 0 64 64" width="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>' }], this._CSS = { alignment: { left: "ce-tune-alignment--left", center: "ce-tune-alignment--center", right: "ce-tune-alignment--right" } };
            }
            var e3, n3, a2;
            return e3 = t3, a2 = [{ key: "DEFAULT_ALIGNMENT", get: function() {
              return "left";
            } }, { key: "isTune", get: function() {
              return true;
            } }], (n3 = [{ key: "getAlignment", value: function() {
              var e4, n4;
              return null !== (e4 = this.settings) && void 0 !== e4 && e4.blocks && this.settings.blocks.hasOwnProperty(this.block.name) ? this.settings.blocks[this.block.name] : null !== (n4 = this.settings) && void 0 !== n4 && n4.default ? this.settings.default : t3.DEFAULT_ALIGNMENT;
            } }, { key: "wrap", value: function(t4) {
              return this.wrapper = i("div"), this.wrapper.classList.toggle(this._CSS.alignment[this.data.alignment]), this.wrapper.append(t4), this.wrapper;
            } }, { key: "render", value: function() {
              var t4 = this, e4 = i("div");
              return this.alignmentSettings.map((function(n4) {
                var r2 = document.createElement("button");
                return r2.classList.add(t4.api.styles.settingsButton), r2.innerHTML = n4.icon, r2.type = "button", r2.classList.toggle(t4.api.styles.settingsButtonActive, n4.name === t4.data.alignment), e4.appendChild(r2), r2;
              })).forEach((function(e5, n4, r2) {
                e5.addEventListener("click", (function() {
                  t4.data = { alignment: t4.alignmentSettings[n4].name }, r2.forEach((function(e6, n5) {
                    var r3 = t4.alignmentSettings[n5].name;
                    e6.classList.toggle(t4.api.styles.settingsButtonActive, r3 === t4.data.alignment), t4.wrapper.classList.toggle(t4._CSS.alignment[r3], r3 === t4.data.alignment);
                  }));
                }));
              })), e4;
            } }, { key: "save", value: function() {
              return this.data;
            } }]) && r(e3.prototype, n3), a2 && r(e3, a2), t3;
          })();
          t2.exports = a;
        }, 630: function(t2, e2, n2) {
          "use strict";
          function r(t3) {
            return (function(t4) {
              if (Array.isArray(t4)) return i(t4);
            })(t3) || (function(t4) {
              if ("undefined" != typeof Symbol && Symbol.iterator in Object(t4)) return Array.from(t4);
            })(t3) || (function(t4, e3) {
              if (t4) {
                if ("string" == typeof t4) return i(t4, e3);
                var n3 = Object.prototype.toString.call(t4).slice(8, -1);
                return "Object" === n3 && t4.constructor && (n3 = t4.constructor.name), "Map" === n3 || "Set" === n3 ? Array.from(t4) : "Arguments" === n3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3) ? i(t4, e3) : void 0;
              }
            })(t3) || (function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            })();
          }
          function i(t3, e3) {
            (null == e3 || e3 > t3.length) && (e3 = t3.length);
            for (var n3 = 0, r2 = new Array(e3); n3 < e3; n3++) r2[n3] = t3[n3];
            return r2;
          }
          function a(t3) {
            var e3, n3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, i2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, a2 = document.createElement(t3);
            for (var o in Array.isArray(n3) ? (e3 = a2.classList).add.apply(e3, r(n3)) : n3 && a2.classList.add(n3), i2) a2[o] = i2[o];
            return a2;
          }
          n2.r(e2), n2.d(e2, { make: function() {
            return a;
          } });
        }, 424: function(t2, e2, n2) {
          "use strict";
          var r = n2(645), i = n2.n(r)()((function(t3) {
            return t3[1];
          }));
          i.push([t2.id, ".ce-tune-alignment--right {\n    text-align: right;\n}\n.ce-tune-alignment--center {\n    text-align: center;\n}\n.ce-tune-alignment--left {\n    text-align: left;\n}", ""]), e2.Z = i;
        }, 645: function(t2) {
          "use strict";
          t2.exports = function(t3) {
            var e2 = [];
            return e2.toString = function() {
              return this.map((function(e3) {
                var n2 = t3(e3);
                return e3[2] ? "@media ".concat(e3[2], " {").concat(n2, "}") : n2;
              })).join("");
            }, e2.i = function(t4, n2, r) {
              "string" == typeof t4 && (t4 = [[null, t4, ""]]);
              var i = {};
              if (r) for (var a = 0; a < this.length; a++) {
                var o = this[a][0];
                null != o && (i[o] = true);
              }
              for (var s = 0; s < t4.length; s++) {
                var c = [].concat(t4[s]);
                r && i[c[0]] || (n2 && (c[2] ? c[2] = "".concat(n2, " and ").concat(c[2]) : c[2] = n2), e2.push(c));
              }
            }, e2;
          };
        }, 548: function(t2, e2, n2) {
          "use strict";
          var r = n2(379), i = n2.n(r), a = n2(424);
          i()(a.Z, { insert: "head", singleton: false }), a.Z.locals;
        }, 379: function(t2, e2, n2) {
          "use strict";
          var r, i = /* @__PURE__ */ (function() {
            var t3 = {};
            return function(e3) {
              if (void 0 === t3[e3]) {
                var n3 = document.querySelector(e3);
                if (window.HTMLIFrameElement && n3 instanceof window.HTMLIFrameElement) try {
                  n3 = n3.contentDocument.head;
                } catch (t4) {
                  n3 = null;
                }
                t3[e3] = n3;
              }
              return t3[e3];
            };
          })(), a = [];
          function o(t3) {
            for (var e3 = -1, n3 = 0; n3 < a.length; n3++) if (a[n3].identifier === t3) {
              e3 = n3;
              break;
            }
            return e3;
          }
          function s(t3, e3) {
            for (var n3 = {}, r2 = [], i2 = 0; i2 < t3.length; i2++) {
              var s2 = t3[i2], c2 = e3.base ? s2[0] + e3.base : s2[0], u2 = n3[c2] || 0, l2 = "".concat(c2, " ").concat(u2);
              n3[c2] = u2 + 1;
              var f2 = o(l2), d2 = { css: s2[1], media: s2[2], sourceMap: s2[3] };
              -1 !== f2 ? (a[f2].references++, a[f2].updater(d2)) : a.push({ identifier: l2, updater: g(d2, e3), references: 1 }), r2.push(l2);
            }
            return r2;
          }
          function c(t3) {
            var e3 = document.createElement("style"), r2 = t3.attributes || {};
            if (void 0 === r2.nonce) {
              var a2 = n2.nc;
              a2 && (r2.nonce = a2);
            }
            if (Object.keys(r2).forEach((function(t4) {
              e3.setAttribute(t4, r2[t4]);
            })), "function" == typeof t3.insert) t3.insert(e3);
            else {
              var o2 = i(t3.insert || "head");
              if (!o2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
              o2.appendChild(e3);
            }
            return e3;
          }
          var u, l = (u = [], function(t3, e3) {
            return u[t3] = e3, u.filter(Boolean).join("\n");
          });
          function f(t3, e3, n3, r2) {
            var i2 = n3 ? "" : r2.media ? "@media ".concat(r2.media, " {").concat(r2.css, "}") : r2.css;
            if (t3.styleSheet) t3.styleSheet.cssText = l(e3, i2);
            else {
              var a2 = document.createTextNode(i2), o2 = t3.childNodes;
              o2[e3] && t3.removeChild(o2[e3]), o2.length ? t3.insertBefore(a2, o2[e3]) : t3.appendChild(a2);
            }
          }
          function d(t3, e3, n3) {
            var r2 = n3.css, i2 = n3.media, a2 = n3.sourceMap;
            if (i2 ? t3.setAttribute("media", i2) : t3.removeAttribute("media"), a2 && "undefined" != typeof btoa && (r2 += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a2)))), " */")), t3.styleSheet) t3.styleSheet.cssText = r2;
            else {
              for (; t3.firstChild; ) t3.removeChild(t3.firstChild);
              t3.appendChild(document.createTextNode(r2));
            }
          }
          var h = null, p = 0;
          function g(t3, e3) {
            var n3, r2, i2;
            if (e3.singleton) {
              var a2 = p++;
              n3 = h || (h = c(e3)), r2 = f.bind(null, n3, a2, false), i2 = f.bind(null, n3, a2, true);
            } else n3 = c(e3), r2 = d.bind(null, n3, e3), i2 = function() {
              !(function(t4) {
                if (null === t4.parentNode) return false;
                t4.parentNode.removeChild(t4);
              })(n3);
            };
            return r2(t3), function(e4) {
              if (e4) {
                if (e4.css === t3.css && e4.media === t3.media && e4.sourceMap === t3.sourceMap) return;
                r2(t3 = e4);
              } else i2();
            };
          }
          t2.exports = function(t3, e3) {
            (e3 = e3 || {}).singleton || "boolean" == typeof e3.singleton || (e3.singleton = (void 0 === r && (r = Boolean(window && document && document.all && !window.atob)), r));
            var n3 = s(t3 = t3 || [], e3);
            return function(t4) {
              if (t4 = t4 || [], "[object Array]" === Object.prototype.toString.call(t4)) {
                for (var r2 = 0; r2 < n3.length; r2++) {
                  var i2 = o(n3[r2]);
                  a[i2].references--;
                }
                for (var c2 = s(t4, e3), u2 = 0; u2 < n3.length; u2++) {
                  var l2 = o(n3[u2]);
                  0 === a[l2].references && (a[l2].updater(), a.splice(l2, 1));
                }
                n3 = c2;
              }
            };
          };
        } }, e = {};
        function n(r) {
          var i = e[r];
          if (void 0 !== i) return i.exports;
          var a = e[r] = { id: r, exports: {} };
          return t[r](a, a.exports, n), a.exports;
        }
        return n.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return n.d(e2, { a: e2 }), e2;
        }, n.d = function(t2, e2) {
          for (var r in e2) n.o(e2, r) && !n.o(t2, r) && Object.defineProperty(t2, r, { enumerable: true, get: e2[r] });
        }, n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, n.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, n(966);
      })();
    }));
  }
});
export default require_bundle();
//# sourceMappingURL=editorjs-text-alignment-blocktune.js.map

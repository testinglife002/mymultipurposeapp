import {
  __commonJS
} from "./chunk-PR4QN5HX.js";

// node_modules/editorjs-change-case/dist/bundle.js
var require_bundle = __commonJS({
  "node_modules/editorjs-change-case/dist/bundle.js"(exports, module) {
    !(function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.ChangeCase = e() : t.ChangeCase = e();
    })(window, function() {
      return (function(t) {
        var e = {};
        function n(o) {
          if (e[o]) return e[o].exports;
          var r = e[o] = { i: o, l: false, exports: {} };
          return t[o].call(r.exports, r, r.exports, n), r.l = true, r.exports;
        }
        return n.m = t, n.c = e, n.d = function(t2, e2, o) {
          n.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: o });
        }, n.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, n.t = function(t2, e2) {
          if (1 & e2 && (t2 = n(t2)), 8 & e2) return t2;
          if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule) return t2;
          var o = /* @__PURE__ */ Object.create(null);
          if (n.r(o), Object.defineProperty(o, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2) for (var r in t2) n.d(o, r, (function(e3) {
            return t2[e3];
          }).bind(null, r));
          return o;
        }, n.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return n.d(e2, "a", e2), e2;
        }, n.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, n.p = "/", n(n.s = 5);
      })([function(t, e, n) {
        var o = n(1);
        "string" == typeof o && (o = [[t.i, o, ""]]);
        var r = { hmr: true, transform: void 0, insertInto: void 0 };
        n(3)(o, r);
        o.locals && (t.exports = o.locals);
      }, function(t, e, n) {
        (t.exports = n(2)(false)).push([t.i, ".change-case-action {\n    z-index: 90;\n    user-select: none;\n    -moz-user-select: none;\n    -khtml-user-select: none;\n    -webkit-user-select: none;\n    -o-user-select: none;    \n}\n\n.change-case-tool {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    padding: 5px 10px;\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: 500;\n    cursor: pointer;\n    -webkit-box-align: center;\n    -ms-flex-align: center;\n    align-items: center;\n}\n\n.change-case-tool:hover {\n    background: #eff2f5;\n}\n\n.change-case-toolbar__label {\n    color: #707684;\n    font-size: 11px;\n    font-weight: 500;\n    letter-spacing: .33px;\n    padding: 10px 10px 5px;\n    text-transform: uppercase;\n    cursor: pointer;\n}", ""]);
      }, function(t, e) {
        t.exports = function(t2) {
          var e2 = [];
          return e2.toString = function() {
            return this.map(function(e3) {
              var n = (function(t3, e4) {
                var n2 = t3[1] || "", o = t3[3];
                if (!o) return n2;
                if (e4 && "function" == typeof btoa) {
                  var r = (s = o, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(s)))) + " */"), i = o.sources.map(function(t4) {
                    return "/*# sourceURL=" + o.sourceRoot + t4 + " */";
                  });
                  return [n2].concat(i).concat([r]).join("\n");
                }
                var s;
                return [n2].join("\n");
              })(e3, t2);
              return e3[2] ? "@media " + e3[2] + "{" + n + "}" : n;
            }).join("");
          }, e2.i = function(t3, n) {
            "string" == typeof t3 && (t3 = [[null, t3, ""]]);
            for (var o = {}, r = 0; r < this.length; r++) {
              var i = this[r][0];
              "number" == typeof i && (o[i] = true);
            }
            for (r = 0; r < t3.length; r++) {
              var s = t3[r];
              "number" == typeof s[0] && o[s[0]] || (n && !s[2] ? s[2] = n : n && (s[2] = "(" + s[2] + ") and (" + n + ")"), e2.push(s));
            }
          }, e2;
        };
      }, function(t, e, n) {
        var o, r, i = {}, s = (o = function() {
          return window && document && document.all && !window.atob;
        }, function() {
          return void 0 === r && (r = o.apply(this, arguments)), r;
        }), a = /* @__PURE__ */ (function(t2) {
          var e2 = {};
          return function(t3) {
            if ("function" == typeof t3) return t3();
            if (void 0 === e2[t3]) {
              var n2 = (function(t4) {
                return document.querySelector(t4);
              }).call(this, t3);
              if (window.HTMLIFrameElement && n2 instanceof window.HTMLIFrameElement) try {
                n2 = n2.contentDocument.head;
              } catch (t4) {
                n2 = null;
              }
              e2[t3] = n2;
            }
            return e2[t3];
          };
        })(), c = null, l = 0, u = [], f = n(4);
        function p(t2, e2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var o2 = t2[n2], r2 = i[o2.id];
            if (r2) {
              r2.refs++;
              for (var s2 = 0; s2 < r2.parts.length; s2++) r2.parts[s2](o2.parts[s2]);
              for (; s2 < o2.parts.length; s2++) r2.parts.push(g(o2.parts[s2], e2));
            } else {
              var a2 = [];
              for (s2 = 0; s2 < o2.parts.length; s2++) a2.push(g(o2.parts[s2], e2));
              i[o2.id] = { id: o2.id, refs: 1, parts: a2 };
            }
          }
        }
        function d(t2, e2) {
          for (var n2 = [], o2 = {}, r2 = 0; r2 < t2.length; r2++) {
            var i2 = t2[r2], s2 = e2.base ? i2[0] + e2.base : i2[0], a2 = { css: i2[1], media: i2[2], sourceMap: i2[3] };
            o2[s2] ? o2[s2].parts.push(a2) : n2.push(o2[s2] = { id: s2, parts: [a2] });
          }
          return n2;
        }
        function h(t2, e2) {
          var n2 = a(t2.insertInto);
          if (!n2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
          var o2 = u[u.length - 1];
          if ("top" === t2.insertAt) o2 ? o2.nextSibling ? n2.insertBefore(e2, o2.nextSibling) : n2.appendChild(e2) : n2.insertBefore(e2, n2.firstChild), u.push(e2);
          else if ("bottom" === t2.insertAt) n2.appendChild(e2);
          else {
            if ("object" != typeof t2.insertAt || !t2.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var r2 = a(t2.insertInto + " " + t2.insertAt.before);
            n2.insertBefore(e2, r2);
          }
        }
        function v(t2) {
          if (null === t2.parentNode) return false;
          t2.parentNode.removeChild(t2);
          var e2 = u.indexOf(t2);
          e2 >= 0 && u.splice(e2, 1);
        }
        function b(t2) {
          var e2 = document.createElement("style");
          return void 0 === t2.attrs.type && (t2.attrs.type = "text/css"), y(e2, t2.attrs), h(t2, e2), e2;
        }
        function y(t2, e2) {
          Object.keys(e2).forEach(function(n2) {
            t2.setAttribute(n2, e2[n2]);
          });
        }
        function g(t2, e2) {
          var n2, o2, r2, i2;
          if (e2.transform && t2.css) {
            if (!(i2 = e2.transform(t2.css))) return function() {
            };
            t2.css = i2;
          }
          if (e2.singleton) {
            var s2 = l++;
            n2 = c || (c = b(e2)), o2 = x.bind(null, n2, s2, false), r2 = x.bind(null, n2, s2, true);
          } else t2.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n2 = (function(t3) {
            var e3 = document.createElement("link");
            return void 0 === t3.attrs.type && (t3.attrs.type = "text/css"), t3.attrs.rel = "stylesheet", y(e3, t3.attrs), h(t3, e3), e3;
          })(e2), o2 = (function(t3, e3, n3) {
            var o3 = n3.css, r3 = n3.sourceMap, i3 = void 0 === e3.convertToAbsoluteUrls && r3;
            (e3.convertToAbsoluteUrls || i3) && (o3 = f(o3));
            r3 && (o3 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r3)))) + " */");
            var s3 = new Blob([o3], { type: "text/css" }), a2 = t3.href;
            t3.href = URL.createObjectURL(s3), a2 && URL.revokeObjectURL(a2);
          }).bind(null, n2, e2), r2 = function() {
            v(n2), n2.href && URL.revokeObjectURL(n2.href);
          }) : (n2 = b(e2), o2 = (function(t3, e3) {
            var n3 = e3.css, o3 = e3.media;
            o3 && t3.setAttribute("media", o3);
            if (t3.styleSheet) t3.styleSheet.cssText = n3;
            else {
              for (; t3.firstChild; ) t3.removeChild(t3.firstChild);
              t3.appendChild(document.createTextNode(n3));
            }
          }).bind(null, n2), r2 = function() {
            v(n2);
          });
          return o2(t2), function(e3) {
            if (e3) {
              if (e3.css === t2.css && e3.media === t2.media && e3.sourceMap === t2.sourceMap) return;
              o2(t2 = e3);
            } else r2();
          };
        }
        t.exports = function(t2, e2) {
          if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
          (e2 = e2 || {}).attrs = "object" == typeof e2.attrs ? e2.attrs : {}, e2.singleton || "boolean" == typeof e2.singleton || (e2.singleton = s()), e2.insertInto || (e2.insertInto = "head"), e2.insertAt || (e2.insertAt = "bottom");
          var n2 = d(t2, e2);
          return p(n2, e2), function(t3) {
            for (var o2 = [], r2 = 0; r2 < n2.length; r2++) {
              var s2 = n2[r2];
              (a2 = i[s2.id]).refs--, o2.push(a2);
            }
            t3 && p(d(t3, e2), e2);
            for (r2 = 0; r2 < o2.length; r2++) {
              var a2;
              if (0 === (a2 = o2[r2]).refs) {
                for (var c2 = 0; c2 < a2.parts.length; c2++) a2.parts[c2]();
                delete i[a2.id];
              }
            }
          };
        };
        var m, C = (m = [], function(t2, e2) {
          return m[t2] = e2, m.filter(Boolean).join("\n");
        });
        function x(t2, e2, n2, o2) {
          var r2 = n2 ? "" : o2.css;
          if (t2.styleSheet) t2.styleSheet.cssText = C(e2, r2);
          else {
            var i2 = document.createTextNode(r2), s2 = t2.childNodes;
            s2[e2] && t2.removeChild(s2[e2]), s2.length ? t2.insertBefore(i2, s2[e2]) : t2.appendChild(i2);
          }
        }
      }, function(t, e) {
        t.exports = function(t2) {
          var e2 = "undefined" != typeof window && window.location;
          if (!e2) throw new Error("fixUrls requires window.location");
          if (!t2 || "string" != typeof t2) return t2;
          var n = e2.protocol + "//" + e2.host, o = n + e2.pathname.replace(/\/[^\/]*$/, "/");
          return t2.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(t3, e3) {
            var r, i = e3.trim().replace(/^"(.*)"$/, function(t4, e4) {
              return e4;
            }).replace(/^'(.*)'$/, function(t4, e4) {
              return e4;
            });
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i) ? t3 : (r = 0 === i.indexOf("//") ? i : 0 === i.indexOf("/") ? n + i : o + i.replace(/^\.\//, ""), "url(" + JSON.stringify(r) + ")");
          });
        };
      }, function(t, e, n) {
        "use strict";
        n.r(e);
        n(0);
        function o(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var o2 = e2[n2];
            o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(t2, o2.key, o2);
          }
        }
        function r(t2, e2, n2) {
          return e2 && o(t2.prototype, e2), n2 && o(t2, n2), t2;
        }
        n.d(e, "default", function() {
          return i;
        });
        var i = (function() {
          function t2(e2) {
            var n2 = e2.config, o2 = e2.api;
            !(function(t3, e3) {
              if (!(t3 instanceof e3)) throw new TypeError("Cannot call a class as a function");
            })(this, t2), this.api = o2, this.button = null, this.optionButtons = [], this._state = true, this.selectedText = null, this.range = null, this._settings = n2, this.CSS = { actions: "change-case-action", toolbarLabel: "change-case-toolbar__label", tool: "change-case-tool", toolbarBtnActive: this.api.styles.settingsButtonActive, inlineButton: this.api.styles.inlineToolButton }, this.caseOptions = { titleCase: "Title Case", lowerCase: "lower case", upperCase: "UPPER CASE", localeLowerCase: "localé lower casé", localeUpperCase: "LöCALE UPPER CASE", sentenceCase: "Sentence case", toggleCase: "tOOGLE cASE" };
          }
          return r(t2, [{ key: "state", get: function() {
            return this._state;
          } }], [{ key: "isInline", get: function() {
            return true;
          } }]), r(t2, [{ key: "render", value: function() {
            return this.button = document.createElement("button"), this.button.type = "button", this.button.innerHTML = '\n            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 100 100" stroke="currentColor">\n            <path d="m46.099 74.271-3.6868-13.686h-18.523l-3.6868 13.686h-11.605l17.934-57.653h13.17l18.001 57.653zm-6.2632-23.813q-5.0972-18.612-5.7524-21.056c-0.42199-1.6168-0.73293-2.9077-0.91061-3.8477q-1.1105 5.0133-6.5741 24.828z" stroke-width="1.1797"/>\n            <path d="m87.355 74.271-2.4938-8.4556h-12.529l-2.4938 8.4556h-7.8496l12.131-35.619h8.9087l12.176 35.619zm-4.2365-14.712q-3.4478-11.499-3.891-13.009c-0.28544-0.99887-0.49576-1.7964-0.61595-2.3772q-0.75116 3.0973-4.4469 15.339z" stroke-width=".76265"/>\n            </svg>', this.button.classList.add(this.CSS.inlineButton), this.button;
          } }, { key: "checkState", value: function(t3) {
            t3.anchorNode;
          } }, { key: "convertCase", value: function(t3, e2) {
            var n2 = this;
            if (t3) {
              var o2 = t3.cloneContents();
              o2 && (o2.childNodes.forEach(function(t4) {
                if ("#text" === t4.nodeName) switch (e2) {
                  case "titleCase":
                    t4.textContent = t4.textContent.replace(/\w\S*/g, function(t5) {
                      return t5.charAt(0).toUpperCase() + t5.slice(1, t5.length).toLowerCase();
                    });
                    break;
                  case "lowerCase":
                    t4.textContent = (function(t5) {
                      return t5.toLowerCase();
                    })(t4.textContent);
                    break;
                  case "upperCase":
                    t4.textContent = (function(t5) {
                      return t5.toUpperCase();
                    })(t4.textContent);
                    break;
                  case "localeLowerCase":
                    t4.textContent = (function(t5, e3) {
                      return t5.toLocaleLowerCase(e3);
                    })(t4.textContent, n2._settings.locale);
                    break;
                  case "localeUpperCase":
                    t4.textContent = (function(t5, e3) {
                      return t5.toLocaleUpperCase(e3);
                    })(t4.textContent, n2._settings.locale);
                    break;
                  case "sentenceCase":
                    t4.textContent = (function(t5) {
                      return t5.charAt(0).toUpperCase() + t5.slice(1, t5.length).toLowerCase();
                    })(t4.textContent);
                    break;
                  case "toggleCase":
                    t4.textContent = (function(t5) {
                      return t5.replace(/\w\S*/g, function(t6) {
                        return t6.charAt(0).toLowerCase() + t6.slice(1, t6.length).toUpperCase();
                      });
                    })(t4.textContent);
                }
              }), t3.extractContents(), t3.insertNode(o2), this.api.inlineToolbar.close());
            }
          } }, { key: "surround", value: function(t3) {
            this.selectedText = t3.cloneContents(), this.actions.hidden = !this.actions.hidden, this.range = this.actions.hidden ? null : t3, this.state = !this.actions.hidden;
          } }, { key: "renderActions", value: function() {
            var t3 = this;
            this.actions = document.createElement("div"), this.actions.classList.add(this.CSS.actions);
            var e2 = document.createElement("div");
            e2.classList.add(this.CSS.toolbarLabel), e2.innerHTML = "Change Case", this.actions.appendChild(e2), this.optionButtons = Object.keys(this.caseOptions).map(function(e3) {
              var n3 = document.createElement("div");
              return n3.classList.add(t3.CSS.tool), n3.dataset.mode = e3, n3.innerHTML = t3.caseOptions[e3], n3;
            });
            var n2 = true, o2 = false, r2 = void 0;
            try {
              for (var i2, s = function() {
                var e3 = i2.value;
                t3.actions.appendChild(e3), t3.api.listeners.on(e3, "click", function() {
                  t3.convertCase(t3.range, e3.dataset.mode);
                });
              }, a = this.optionButtons[Symbol.iterator](); !(n2 = (i2 = a.next()).done); n2 = true) s();
            } catch (t4) {
              o2 = true, r2 = t4;
            } finally {
              try {
                n2 || null == a.return || a.return();
              } finally {
                if (o2) throw r2;
              }
            }
            return this.actions.hidden = true, this.actions;
          } }, { key: "destroy", value: function() {
            var t3 = true, e2 = false, n2 = void 0;
            try {
              for (var o2, r2 = this.optionButtons[Symbol.iterator](); !(t3 = (o2 = r2.next()).done); t3 = true) {
                var i2 = o2.value;
                this.api.listeners.off(i2, "click");
              }
            } catch (t4) {
              e2 = true, n2 = t4;
            } finally {
              try {
                t3 || null == r2.return || r2.return();
              } finally {
                if (e2) throw n2;
              }
            }
          } }, { key: "state", set: function(t3) {
            this._state = t3, this.button.classList.toggle(this.CSS.toolbarBtnActive, t3);
          } }, { key: "title", get: function() {
            return "Change Case";
          } }]), t2;
        })();
      }]);
    });
  }
});
export default require_bundle();
//# sourceMappingURL=editorjs-change-case.js.map

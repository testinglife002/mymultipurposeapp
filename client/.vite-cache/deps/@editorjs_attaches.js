import {
  __commonJS
} from "./chunk-PR4QN5HX.js";

// node_modules/@editorjs/attaches/dist/bundle.js
var require_bundle = __commonJS({
  "node_modules/@editorjs/attaches/dist/bundle.js"(exports, module) {
    !(function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AttachesTool = t() : e.AttachesTool = t();
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
        }, n.p = "/", n(n.s = 6);
      })([function(e, t, n) {
        window, e.exports = (function(e2) {
          var t2 = {};
          function n2(r) {
            if (t2[r]) return t2[r].exports;
            var o = t2[r] = { i: r, l: false, exports: {} };
            return e2[r].call(o.exports, o, o.exports, n2), o.l = true, o.exports;
          }
          return n2.m = e2, n2.c = t2, n2.d = function(e3, t3, r) {
            n2.o(e3, t3) || Object.defineProperty(e3, t3, { enumerable: true, get: r });
          }, n2.r = function(e3) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e3, "__esModule", { value: true });
          }, n2.t = function(e3, t3) {
            if (1 & t3 && (e3 = n2(e3)), 8 & t3) return e3;
            if (4 & t3 && "object" == typeof e3 && e3 && e3.__esModule) return e3;
            var r = /* @__PURE__ */ Object.create(null);
            if (n2.r(r), Object.defineProperty(r, "default", { enumerable: true, value: e3 }), 2 & t3 && "string" != typeof e3) for (var o in e3) n2.d(r, o, (function(t4) {
              return e3[t4];
            }).bind(null, o));
            return r;
          }, n2.n = function(e3) {
            var t3 = e3 && e3.__esModule ? function() {
              return e3.default;
            } : function() {
              return e3;
            };
            return n2.d(t3, "a", t3), t3;
          }, n2.o = function(e3, t3) {
            return Object.prototype.hasOwnProperty.call(e3, t3);
          }, n2.p = "", n2(n2.s = 3);
        })([function(e2, t2) {
          var n2;
          n2 = /* @__PURE__ */ (function() {
            return this;
          })();
          try {
            n2 = n2 || new Function("return this")();
          } catch (e3) {
            "object" == typeof window && (n2 = window);
          }
          e2.exports = n2;
        }, function(e2, t2, n2) {
          "use strict";
          (function(e3) {
            var r = n2(2), o = setTimeout;
            function i() {
            }
            function a(e4) {
              if (!(this instanceof a)) throw new TypeError("Promises must be constructed via new");
              if ("function" != typeof e4) throw new TypeError("not a function");
              this._state = 0, this._handled = false, this._value = void 0, this._deferreds = [], d(e4, this);
            }
            function s(e4, t3) {
              for (; 3 === e4._state; ) e4 = e4._value;
              0 !== e4._state ? (e4._handled = true, a._immediateFn((function() {
                var n3 = 1 === e4._state ? t3.onFulfilled : t3.onRejected;
                if (null !== n3) {
                  var r2;
                  try {
                    r2 = n3(e4._value);
                  } catch (e5) {
                    return void l(t3.promise, e5);
                  }
                  c(t3.promise, r2);
                } else (1 === e4._state ? c : l)(t3.promise, e4._value);
              }))) : e4._deferreds.push(t3);
            }
            function c(e4, t3) {
              try {
                if (t3 === e4) throw new TypeError("A promise cannot be resolved with itself.");
                if (t3 && ("object" == typeof t3 || "function" == typeof t3)) {
                  var n3 = t3.then;
                  if (t3 instanceof a) return e4._state = 3, e4._value = t3, void u(e4);
                  if ("function" == typeof n3) return void d((r2 = n3, o2 = t3, function() {
                    r2.apply(o2, arguments);
                  }), e4);
                }
                e4._state = 1, e4._value = t3, u(e4);
              } catch (t4) {
                l(e4, t4);
              }
              var r2, o2;
            }
            function l(e4, t3) {
              e4._state = 2, e4._value = t3, u(e4);
            }
            function u(e4) {
              2 === e4._state && 0 === e4._deferreds.length && a._immediateFn((function() {
                e4._handled || a._unhandledRejectionFn(e4._value);
              }));
              for (var t3 = 0, n3 = e4._deferreds.length; t3 < n3; t3++) s(e4, e4._deferreds[t3]);
              e4._deferreds = null;
            }
            function f(e4, t3, n3) {
              this.onFulfilled = "function" == typeof e4 ? e4 : null, this.onRejected = "function" == typeof t3 ? t3 : null, this.promise = n3;
            }
            function d(e4, t3) {
              var n3 = false;
              try {
                e4((function(e5) {
                  n3 || (n3 = true, c(t3, e5));
                }), (function(e5) {
                  n3 || (n3 = true, l(t3, e5));
                }));
              } catch (e5) {
                if (n3) return;
                n3 = true, l(t3, e5);
              }
            }
            a.prototype.catch = function(e4) {
              return this.then(null, e4);
            }, a.prototype.then = function(e4, t3) {
              var n3 = new this.constructor(i);
              return s(this, new f(e4, t3, n3)), n3;
            }, a.prototype.finally = r.a, a.all = function(e4) {
              return new a((function(t3, n3) {
                if (!e4 || void 0 === e4.length) throw new TypeError("Promise.all accepts an array");
                var r2 = Array.prototype.slice.call(e4);
                if (0 === r2.length) return t3([]);
                var o2 = r2.length;
                function i2(e5, a3) {
                  try {
                    if (a3 && ("object" == typeof a3 || "function" == typeof a3)) {
                      var s2 = a3.then;
                      if ("function" == typeof s2) return void s2.call(a3, (function(t4) {
                        i2(e5, t4);
                      }), n3);
                    }
                    r2[e5] = a3, 0 == --o2 && t3(r2);
                  } catch (e6) {
                    n3(e6);
                  }
                }
                for (var a2 = 0; a2 < r2.length; a2++) i2(a2, r2[a2]);
              }));
            }, a.resolve = function(e4) {
              return e4 && "object" == typeof e4 && e4.constructor === a ? e4 : new a((function(t3) {
                t3(e4);
              }));
            }, a.reject = function(e4) {
              return new a((function(t3, n3) {
                n3(e4);
              }));
            }, a.race = function(e4) {
              return new a((function(t3, n3) {
                for (var r2 = 0, o2 = e4.length; r2 < o2; r2++) e4[r2].then(t3, n3);
              }));
            }, a._immediateFn = "function" == typeof e3 && function(t3) {
              e3(t3);
            } || function(e4) {
              o(e4, 0);
            }, a._unhandledRejectionFn = function(e4) {
              "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e4);
            }, t2.a = a;
          }).call(this, n2(5).setImmediate);
        }, function(e2, t2, n2) {
          "use strict";
          t2.a = function(e3) {
            var t3 = this.constructor;
            return this.then((function(n3) {
              return t3.resolve(e3()).then((function() {
                return n3;
              }));
            }), (function(n3) {
              return t3.resolve(e3()).then((function() {
                return t3.reject(n3);
              }));
            }));
          };
        }, function(e2, t2, n2) {
          "use strict";
          function r(e3) {
            return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            })(e3);
          }
          n2(4);
          var o, i, a, s, c, l, u, f = n2(8), d = (i = function(e3) {
            return new Promise((function(t3, n3) {
              e3 = s(e3), (e3 = c(e3)).beforeSend && e3.beforeSend();
              var r2 = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP");
              r2.open(e3.method, e3.url), r2.setRequestHeader("X-Requested-With", "XMLHttpRequest"), Object.keys(e3.headers).forEach((function(t4) {
                var n4 = e3.headers[t4];
                r2.setRequestHeader(t4, n4);
              }));
              var o2 = e3.ratio;
              r2.upload.addEventListener("progress", (function(t4) {
                var n4 = Math.round(t4.loaded / t4.total * 100), r3 = Math.ceil(n4 * o2 / 100);
                e3.progress(Math.min(r3, 100));
              }), false), r2.addEventListener("progress", (function(t4) {
                var n4 = Math.round(t4.loaded / t4.total * 100), r3 = Math.ceil(n4 * (100 - o2) / 100) + o2;
                e3.progress(Math.min(r3, 100));
              }), false), r2.onreadystatechange = function() {
                if (4 === r2.readyState) {
                  var e4 = r2.response;
                  try {
                    e4 = JSON.parse(e4);
                  } catch (e5) {
                  }
                  var o3 = f.parseHeaders(r2.getAllResponseHeaders()), i2 = { body: e4, code: r2.status, headers: o3 };
                  u(r2.status) ? t3(i2) : n3(i2);
                }
              }, r2.send(e3.data);
            }));
          }, a = function(e3) {
            return e3.method = "POST", i(e3);
          }, s = function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if (e3.url && "string" != typeof e3.url) throw new Error("Url must be a string");
            if (e3.url = e3.url || "", e3.method && "string" != typeof e3.method) throw new Error("`method` must be a string or null");
            if (e3.method = e3.method ? e3.method.toUpperCase() : "GET", e3.headers && "object" !== r(e3.headers)) throw new Error("`headers` must be an object or null");
            if (e3.headers = e3.headers || {}, e3.type && ("string" != typeof e3.type || !Object.values(o).includes(e3.type))) throw new Error("`type` must be taken from module's «contentType» library");
            if (e3.progress && "function" != typeof e3.progress) throw new Error("`progress` must be a function or null");
            if (e3.progress = e3.progress || function(e4) {
            }, e3.beforeSend = e3.beforeSend || function(e4) {
            }, e3.ratio && "number" != typeof e3.ratio) throw new Error("`ratio` must be a number");
            if (e3.ratio < 0 || e3.ratio > 100) throw new Error("`ratio` must be in a 0-100 interval");
            if (e3.ratio = e3.ratio || 90, e3.accept && "string" != typeof e3.accept) throw new Error("`accept` must be a string with a list of allowed mime-types");
            if (e3.accept = e3.accept || "*/*", e3.multiple && "boolean" != typeof e3.multiple) throw new Error("`multiple` must be a true or false");
            if (e3.multiple = e3.multiple || false, e3.fieldName && "string" != typeof e3.fieldName) throw new Error("`fieldName` must be a string");
            return e3.fieldName = e3.fieldName || "files", e3;
          }, c = function(e3) {
            switch (e3.method) {
              case "GET":
                var t3 = l(e3.data, o.URLENCODED);
                delete e3.data, e3.url = /\?/.test(e3.url) ? e3.url + "&" + t3 : e3.url + "?" + t3;
                break;
              case "POST":
              case "PUT":
              case "DELETE":
              case "UPDATE":
                var n3 = (function() {
                  return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).type || o.JSON;
                })(e3);
                (f.isFormData(e3.data) || f.isFormElement(e3.data)) && (n3 = o.FORM), e3.data = l(e3.data, n3), n3 !== d.contentType.FORM && (e3.headers["content-type"] = n3);
            }
            return e3;
          }, l = function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            switch (arguments.length > 1 ? arguments[1] : void 0) {
              case o.URLENCODED:
                return f.urlEncode(e3);
              case o.JSON:
                return f.jsonEncode(e3);
              case o.FORM:
                return f.formEncode(e3);
              default:
                return e3;
            }
          }, u = function(e3) {
            return e3 >= 200 && e3 < 300;
          }, { contentType: o = { URLENCODED: "application/x-www-form-urlencoded; charset=utf-8", FORM: "multipart/form-data", JSON: "application/json; charset=utf-8" }, request: i, get: function(e3) {
            return e3.method = "GET", i(e3);
          }, post: a, transport: function(e3) {
            return e3 = s(e3), f.selectFiles(e3).then((function(t3) {
              for (var n3 = new FormData(), r2 = 0; r2 < t3.length; r2++) n3.append(e3.fieldName, t3[r2], t3[r2].name);
              f.isObject(e3.data) && Object.keys(e3.data).forEach((function(t4) {
                var r3 = e3.data[t4];
                n3.append(t4, r3);
              }));
              var o2 = e3.beforeSend;
              return e3.beforeSend = function() {
                return o2(t3);
              }, e3.data = n3, a(e3);
            }));
          }, selectFiles: function(e3) {
            return delete (e3 = s(e3)).beforeSend, f.selectFiles(e3);
          } });
          e2.exports = d;
        }, function(e2, t2, n2) {
          "use strict";
          n2.r(t2);
          var r = n2(1);
          window.Promise = window.Promise || r.a;
        }, function(e2, t2, n2) {
          (function(e3) {
            var r = void 0 !== e3 && e3 || "undefined" != typeof self && self || window, o = Function.prototype.apply;
            function i(e4, t3) {
              this._id = e4, this._clearFn = t3;
            }
            t2.setTimeout = function() {
              return new i(o.call(setTimeout, r, arguments), clearTimeout);
            }, t2.setInterval = function() {
              return new i(o.call(setInterval, r, arguments), clearInterval);
            }, t2.clearTimeout = t2.clearInterval = function(e4) {
              e4 && e4.close();
            }, i.prototype.unref = i.prototype.ref = function() {
            }, i.prototype.close = function() {
              this._clearFn.call(r, this._id);
            }, t2.enroll = function(e4, t3) {
              clearTimeout(e4._idleTimeoutId), e4._idleTimeout = t3;
            }, t2.unenroll = function(e4) {
              clearTimeout(e4._idleTimeoutId), e4._idleTimeout = -1;
            }, t2._unrefActive = t2.active = function(e4) {
              clearTimeout(e4._idleTimeoutId);
              var t3 = e4._idleTimeout;
              t3 >= 0 && (e4._idleTimeoutId = setTimeout((function() {
                e4._onTimeout && e4._onTimeout();
              }), t3));
            }, n2(6), t2.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== e3 && e3.setImmediate || this && this.setImmediate, t2.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== e3 && e3.clearImmediate || this && this.clearImmediate;
          }).call(this, n2(0));
        }, function(e2, t2, n2) {
          (function(e3, t3) {
            !(function(e4, n3) {
              "use strict";
              if (!e4.setImmediate) {
                var r, o, i, a, s, c = 1, l = {}, u = false, f = e4.document, d = Object.getPrototypeOf && Object.getPrototypeOf(e4);
                d = d && d.setTimeout ? d : e4, "[object process]" === {}.toString.call(e4.process) ? r = function(e5) {
                  t3.nextTick((function() {
                    h(e5);
                  }));
                } : (function() {
                  if (e4.postMessage && !e4.importScripts) {
                    var t4 = true, n4 = e4.onmessage;
                    return e4.onmessage = function() {
                      t4 = false;
                    }, e4.postMessage("", "*"), e4.onmessage = n4, t4;
                  }
                })() ? (a = "setImmediate$" + Math.random() + "$", s = function(t4) {
                  t4.source === e4 && "string" == typeof t4.data && 0 === t4.data.indexOf(a) && h(+t4.data.slice(a.length));
                }, e4.addEventListener ? e4.addEventListener("message", s, false) : e4.attachEvent("onmessage", s), r = function(t4) {
                  e4.postMessage(a + t4, "*");
                }) : e4.MessageChannel ? ((i = new MessageChannel()).port1.onmessage = function(e5) {
                  h(e5.data);
                }, r = function(e5) {
                  i.port2.postMessage(e5);
                }) : f && "onreadystatechange" in f.createElement("script") ? (o = f.documentElement, r = function(e5) {
                  var t4 = f.createElement("script");
                  t4.onreadystatechange = function() {
                    h(e5), t4.onreadystatechange = null, o.removeChild(t4), t4 = null;
                  }, o.appendChild(t4);
                }) : r = function(e5) {
                  setTimeout(h, 0, e5);
                }, d.setImmediate = function(e5) {
                  "function" != typeof e5 && (e5 = new Function("" + e5));
                  for (var t4 = new Array(arguments.length - 1), n4 = 0; n4 < t4.length; n4++) t4[n4] = arguments[n4 + 1];
                  var o2 = { callback: e5, args: t4 };
                  return l[c] = o2, r(c), c++;
                }, d.clearImmediate = p;
              }
              function p(e5) {
                delete l[e5];
              }
              function h(e5) {
                if (u) setTimeout(h, 0, e5);
                else {
                  var t4 = l[e5];
                  if (t4) {
                    u = true;
                    try {
                      !(function(e6) {
                        var t5 = e6.callback, n4 = e6.args;
                        switch (n4.length) {
                          case 0:
                            t5();
                            break;
                          case 1:
                            t5(n4[0]);
                            break;
                          case 2:
                            t5(n4[0], n4[1]);
                            break;
                          case 3:
                            t5(n4[0], n4[1], n4[2]);
                            break;
                          default:
                            t5.apply(void 0, n4);
                        }
                      })(t4);
                    } finally {
                      p(e5), u = false;
                    }
                  }
                }
              }
            })("undefined" == typeof self ? void 0 === e3 ? this : e3 : self);
          }).call(this, n2(0), n2(7));
        }, function(e2, t2) {
          var n2, r, o = e2.exports = {};
          function i() {
            throw new Error("setTimeout has not been defined");
          }
          function a() {
            throw new Error("clearTimeout has not been defined");
          }
          function s(e3) {
            if (n2 === setTimeout) return setTimeout(e3, 0);
            if ((n2 === i || !n2) && setTimeout) return n2 = setTimeout, setTimeout(e3, 0);
            try {
              return n2(e3, 0);
            } catch (t3) {
              try {
                return n2.call(null, e3, 0);
              } catch (t4) {
                return n2.call(this, e3, 0);
              }
            }
          }
          !(function() {
            try {
              n2 = "function" == typeof setTimeout ? setTimeout : i;
            } catch (e3) {
              n2 = i;
            }
            try {
              r = "function" == typeof clearTimeout ? clearTimeout : a;
            } catch (e3) {
              r = a;
            }
          })();
          var c, l = [], u = false, f = -1;
          function d() {
            u && c && (u = false, c.length ? l = c.concat(l) : f = -1, l.length && p());
          }
          function p() {
            if (!u) {
              var e3 = s(d);
              u = true;
              for (var t3 = l.length; t3; ) {
                for (c = l, l = []; ++f < t3; ) c && c[f].run();
                f = -1, t3 = l.length;
              }
              c = null, u = false, (function(e4) {
                if (r === clearTimeout) return clearTimeout(e4);
                if ((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e4);
                try {
                  r(e4);
                } catch (t4) {
                  try {
                    return r.call(null, e4);
                  } catch (t5) {
                    return r.call(this, e4);
                  }
                }
              })(e3);
            }
          }
          function h(e3, t3) {
            this.fun = e3, this.array = t3;
          }
          function m() {
          }
          o.nextTick = function(e3) {
            var t3 = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n3 = 1; n3 < arguments.length; n3++) t3[n3 - 1] = arguments[n3];
            l.push(new h(e3, t3)), 1 !== l.length || u || s(p);
          }, h.prototype.run = function() {
            this.fun.apply(null, this.array);
          }, o.title = "browser", o.browser = true, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = m, o.addListener = m, o.once = m, o.off = m, o.removeListener = m, o.removeAllListeners = m, o.emit = m, o.prependListener = m, o.prependOnceListener = m, o.listeners = function(e3) {
            return [];
          }, o.binding = function(e3) {
            throw new Error("process.binding is not supported");
          }, o.cwd = function() {
            return "/";
          }, o.chdir = function(e3) {
            throw new Error("process.chdir is not supported");
          }, o.umask = function() {
            return 0;
          };
        }, function(e2, t2, n2) {
          function r(e3, t3) {
            for (var n3 = 0; n3 < t3.length; n3++) {
              var r2 = t3[n3];
              r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e3, r2.key, r2);
            }
          }
          var o = n2(9);
          e2.exports = (function() {
            function e3() {
              !(function(e4, t4) {
                if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
              })(this, e3);
            }
            var t3, n3;
            return t3 = e3, (n3 = [{ key: "urlEncode", value: function(e4) {
              return o(e4);
            } }, { key: "jsonEncode", value: function(e4) {
              return JSON.stringify(e4);
            } }, { key: "formEncode", value: function(e4) {
              if (this.isFormData(e4)) return e4;
              if (this.isFormElement(e4)) return new FormData(e4);
              if (this.isObject(e4)) {
                var t4 = new FormData();
                return Object.keys(e4).forEach((function(n4) {
                  var r2 = e4[n4];
                  t4.append(n4, r2);
                })), t4;
              }
              throw new Error("`data` must be an instance of Object, FormData or <FORM> HTMLElement");
            } }, { key: "isObject", value: function(e4) {
              return "[object Object]" === Object.prototype.toString.call(e4);
            } }, { key: "isFormData", value: function(e4) {
              return e4 instanceof FormData;
            } }, { key: "isFormElement", value: function(e4) {
              return e4 instanceof HTMLFormElement;
            } }, { key: "selectFiles", value: function() {
              var e4 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              return new Promise((function(t4, n4) {
                var r2 = document.createElement("INPUT");
                r2.type = "file", e4.multiple && r2.setAttribute("multiple", "multiple"), e4.accept && r2.setAttribute("accept", e4.accept), r2.style.display = "none", document.body.appendChild(r2), r2.addEventListener("change", (function(e5) {
                  var n5 = e5.target.files;
                  t4(n5), document.body.removeChild(r2);
                }), false), r2.click();
              }));
            } }, { key: "parseHeaders", value: function(e4) {
              var t4 = e4.trim().split(/[\r\n]+/), n4 = {};
              return t4.forEach((function(e5) {
                var t5 = e5.split(": "), r2 = t5.shift(), o2 = t5.join(": ");
                r2 && (n4[r2] = o2);
              })), n4;
            } }]) && r(t3, n3), e3;
          })();
        }, function(e2, t2) {
          var n2 = function(e3) {
            return encodeURIComponent(e3).replace(/[!'()*]/g, escape).replace(/%20/g, "+");
          }, r = function(e3, t3, o, i) {
            return t3 = t3 || null, o = o || "&", i = i || null, e3 ? (function(e4) {
              for (var t4 = new Array(), n3 = 0; n3 < e4.length; n3++) e4[n3] && t4.push(e4[n3]);
              return t4;
            })(Object.keys(e3).map((function(a) {
              var s, c, l = a;
              if (i && (l = i + "[" + l + "]"), "object" == typeof e3[a] && null !== e3[a]) s = r(e3[a], null, o, l);
              else {
                t3 && (c = l, l = !isNaN(parseFloat(c)) && isFinite(c) ? t3 + Number(l) : l);
                var u = e3[a];
                u = (u = 0 === (u = false === (u = true === u ? "1" : u) ? "0" : u) ? "0" : u) || "", s = n2(l) + "=" + n2(u);
              }
              return s;
            }))).join(o).replace(/[!'()*]/g, "") : "";
          };
          e2.exports = r;
        }]);
      }, function(e, t, n) {
        var r = n(2);
        "string" == typeof r && (r = [[e.i, r, ""]]);
        var o = { hmr: true, transform: void 0, insertInto: void 0 };
        n(4)(r, o);
        r.locals && (e.exports = r.locals);
      }, function(e, t, n) {
        (e.exports = n(3)(false)).push([e.i, `.cdx-attaches {
  --color-line: #EFF0F1;
  --color-bg: #fff;
  --color-bg-secondary: #F8F8F8;
  --color-bg-secondary--hover: #f2f2f2;
  --color-text-secondary: #707684;
}

  .cdx-attaches--with-file {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid var(--color-line);
    border-radius: 7px;
    background: var(--color-bg);
  }

  .cdx-attaches--with-file .cdx-attaches__file-info {
      display: grid;
      grid-gap: 4px;
      max-width: calc(100% - 80px);
      margin: auto 0;
      flex-grow: 2;
    }

  .cdx-attaches--with-file .cdx-attaches__download-button {
      display: flex;
      align-items: center;
      background: var(--color-bg-secondary);
      padding: 6px;
      border-radius: 6px;
      margin: auto 0 auto auto;
    }

  .cdx-attaches--with-file .cdx-attaches__download-button:hover {
        background: var(--color-bg-secondary--hover);
      }

  .cdx-attaches--with-file .cdx-attaches__download-button svg {
        width: 20px;
        height: 20px;
        fill: none;
      }

  .cdx-attaches--with-file .cdx-attaches__file-icon {
      position: relative;
    }

  .cdx-attaches--with-file .cdx-attaches__file-icon-background {
        background-color: #333;

        width: 27px;
        height: 30px;
        margin-right: 12px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

  @supports(-webkit-mask-box-image: url('')){

  .cdx-attaches--with-file .cdx-attaches__file-icon-background {
          border-radius: 0;
          -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10.3872C0 1.83334 1.83334 0 10.3872 0H13.6128C22.1667 0 24 1.83334 24 10.3872V13.6128C24 22.1667 22.1667 24 13.6128 24H10.3872C1.83334 24 0 22.1667 0 13.6128V10.3872Z' fill='black'/%3E%3C/svg%3E%0A") 48% 41% 37.9% 53.3%
      };
        }

  .cdx-attaches--with-file .cdx-attaches__file-icon-label {
        position: absolute;
        left: 3px;
        top: 11px;
        background: inherit;
        text-transform: uppercase;
        line-height: 1em;
        color: #fff;
        padding: 1px 2px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
        /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.22); */
        font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
        letter-spacing: 0.02em;
      }

  .cdx-attaches--with-file .cdx-attaches__file-icon svg {
        width: 20px;
        height: 20px;
      }

  .cdx-attaches--with-file .cdx-attaches__file-icon path {
        stroke: #fff;
      }

  .cdx-attaches--with-file .cdx-attaches__size {
      color: var(--color-text-secondary);
      font-size: 12px;
      line-height: 1em;
    }

  .cdx-attaches--with-file .cdx-attaches__size::after {
        content: attr(data-size);
        margin-left: 0.2em;
      }

  .cdx-attaches--with-file .cdx-attaches__title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      outline: none;
      max-width: 90%;
      font-size: 14px;
      font-weight: 500;
      line-height: 1em;
    }

  .cdx-attaches--with-file .cdx-attaches__title:empty::before {
      content: attr(data-placeholder);
      color: #7b7e89;
    }

  .cdx-attaches--loading .cdx-attaches__title,
    .cdx-attaches--loading .cdx-attaches__file-icon,
    .cdx-attaches--loading .cdx-attaches__size,
    .cdx-attaches--loading .cdx-attaches__download-button,
    .cdx-attaches--loading .cdx-attaches__button {
      opacity: 0;
      font-size: 0;
    }

  .cdx-attaches__button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    border-radius: 7px;
    font-weight: 500;
  }

  .cdx-attaches__button svg {
      margin-top: 0;
    }
`, ""]);
      }, function(e, t) {
        e.exports = function(e2) {
          var t2 = [];
          return t2.toString = function() {
            return this.map((function(t3) {
              var n = (function(e3, t4) {
                var n2 = e3[1] || "", r = e3[3];
                if (!r) return n2;
                if (t4 && "function" == typeof btoa) {
                  var o = (a = r, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(a)))) + " */"), i = r.sources.map((function(e4) {
                    return "/*# sourceURL=" + r.sourceRoot + e4 + " */";
                  }));
                  return [n2].concat(i).concat([o]).join("\n");
                }
                var a;
                return [n2].join("\n");
              })(t3, e2);
              return t3[2] ? "@media " + t3[2] + "{" + n + "}" : n;
            })).join("");
          }, t2.i = function(e3, n) {
            "string" == typeof e3 && (e3 = [[null, e3, ""]]);
            for (var r = {}, o = 0; o < this.length; o++) {
              var i = this[o][0];
              "number" == typeof i && (r[i] = true);
            }
            for (o = 0; o < e3.length; o++) {
              var a = e3[o];
              "number" == typeof a[0] && r[a[0]] || (n && !a[2] ? a[2] = n : n && (a[2] = "(" + a[2] + ") and (" + n + ")"), t2.push(a));
            }
          }, t2;
        };
      }, function(e, t, n) {
        var r, o, i = {}, a = (r = function() {
          return window && document && document.all && !window.atob;
        }, function() {
          return void 0 === o && (o = r.apply(this, arguments)), o;
        }), s = function(e2) {
          return document.querySelector(e2);
        }, c = /* @__PURE__ */ (function(e2) {
          var t2 = {};
          return function(e3) {
            if ("function" == typeof e3) return e3();
            if (void 0 === t2[e3]) {
              var n2 = s.call(this, e3);
              if (window.HTMLIFrameElement && n2 instanceof window.HTMLIFrameElement) try {
                n2 = n2.contentDocument.head;
              } catch (e4) {
                n2 = null;
              }
              t2[e3] = n2;
            }
            return t2[e3];
          };
        })(), l = null, u = 0, f = [], d = n(5);
        function p(e2, t2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2], o2 = i[r2.id];
            if (o2) {
              o2.refs++;
              for (var a2 = 0; a2 < o2.parts.length; a2++) o2.parts[a2](r2.parts[a2]);
              for (; a2 < r2.parts.length; a2++) o2.parts.push(b(r2.parts[a2], t2));
            } else {
              var s2 = [];
              for (a2 = 0; a2 < r2.parts.length; a2++) s2.push(b(r2.parts[a2], t2));
              i[r2.id] = { id: r2.id, refs: 1, parts: s2 };
            }
          }
        }
        function h(e2, t2) {
          for (var n2 = [], r2 = {}, o2 = 0; o2 < e2.length; o2++) {
            var i2 = e2[o2], a2 = t2.base ? i2[0] + t2.base : i2[0], s2 = { css: i2[1], media: i2[2], sourceMap: i2[3] };
            r2[a2] ? r2[a2].parts.push(s2) : n2.push(r2[a2] = { id: a2, parts: [s2] });
          }
          return n2;
        }
        function m(e2, t2) {
          var n2 = c(e2.insertInto);
          if (!n2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
          var r2 = f[f.length - 1];
          if ("top" === e2.insertAt) r2 ? r2.nextSibling ? n2.insertBefore(t2, r2.nextSibling) : n2.appendChild(t2) : n2.insertBefore(t2, n2.firstChild), f.push(t2);
          else if ("bottom" === e2.insertAt) n2.appendChild(t2);
          else {
            if ("object" != typeof e2.insertAt || !e2.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var o2 = c(e2.insertInto + " " + e2.insertAt.before);
            n2.insertBefore(t2, o2);
          }
        }
        function v(e2) {
          if (null === e2.parentNode) return false;
          e2.parentNode.removeChild(e2);
          var t2 = f.indexOf(e2);
          t2 >= 0 && f.splice(t2, 1);
        }
        function y(e2) {
          var t2 = document.createElement("style");
          return void 0 === e2.attrs.type && (e2.attrs.type = "text/css"), g(t2, e2.attrs), m(e2, t2), t2;
        }
        function g(e2, t2) {
          Object.keys(t2).forEach((function(n2) {
            e2.setAttribute(n2, t2[n2]);
          }));
        }
        function b(e2, t2) {
          var n2, r2, o2, i2;
          if (t2.transform && e2.css) {
            if (!(i2 = t2.transform(e2.css))) return function() {
            };
            e2.css = i2;
          }
          if (t2.singleton) {
            var a2 = u++;
            n2 = l || (l = y(t2)), r2 = _.bind(null, n2, a2, false), o2 = _.bind(null, n2, a2, true);
          } else e2.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n2 = (function(e3) {
            var t3 = document.createElement("link");
            return void 0 === e3.attrs.type && (e3.attrs.type = "text/css"), e3.attrs.rel = "stylesheet", g(t3, e3.attrs), m(e3, t3), t3;
          })(t2), r2 = E.bind(null, n2, t2), o2 = function() {
            v(n2), n2.href && URL.revokeObjectURL(n2.href);
          }) : (n2 = y(t2), r2 = S.bind(null, n2), o2 = function() {
            v(n2);
          });
          return r2(e2), function(t3) {
            if (t3) {
              if (t3.css === e2.css && t3.media === e2.media && t3.sourceMap === e2.sourceMap) return;
              r2(e2 = t3);
            } else o2();
          };
        }
        e.exports = function(e2, t2) {
          if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
          (t2 = t2 || {}).attrs = "object" == typeof t2.attrs ? t2.attrs : {}, t2.singleton || "boolean" == typeof t2.singleton || (t2.singleton = a()), t2.insertInto || (t2.insertInto = "head"), t2.insertAt || (t2.insertAt = "bottom");
          var n2 = h(e2, t2);
          return p(n2, t2), function(e3) {
            for (var r2 = [], o2 = 0; o2 < n2.length; o2++) {
              var a2 = n2[o2];
              (s2 = i[a2.id]).refs--, r2.push(s2);
            }
            e3 && p(h(e3, t2), t2);
            for (o2 = 0; o2 < r2.length; o2++) {
              var s2;
              if (0 === (s2 = r2[o2]).refs) {
                for (var c2 = 0; c2 < s2.parts.length; c2++) s2.parts[c2]();
                delete i[s2.id];
              }
            }
          };
        };
        var w, x = (w = [], function(e2, t2) {
          return w[e2] = t2, w.filter(Boolean).join("\n");
        });
        function _(e2, t2, n2, r2) {
          var o2 = n2 ? "" : r2.css;
          if (e2.styleSheet) e2.styleSheet.cssText = x(t2, o2);
          else {
            var i2 = document.createTextNode(o2), a2 = e2.childNodes;
            a2[t2] && e2.removeChild(a2[t2]), a2.length ? e2.insertBefore(i2, a2[t2]) : e2.appendChild(i2);
          }
        }
        function S(e2, t2) {
          var n2 = t2.css, r2 = t2.media;
          if (r2 && e2.setAttribute("media", r2), e2.styleSheet) e2.styleSheet.cssText = n2;
          else {
            for (; e2.firstChild; ) e2.removeChild(e2.firstChild);
            e2.appendChild(document.createTextNode(n2));
          }
        }
        function E(e2, t2, n2) {
          var r2 = n2.css, o2 = n2.sourceMap, i2 = void 0 === t2.convertToAbsoluteUrls && o2;
          (t2.convertToAbsoluteUrls || i2) && (r2 = d(r2)), o2 && (r2 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o2)))) + " */");
          var a2 = new Blob([r2], { type: "text/css" }), s2 = e2.href;
          e2.href = URL.createObjectURL(a2), s2 && URL.revokeObjectURL(s2);
        }
      }, function(e, t) {
        e.exports = function(e2) {
          var t2 = "undefined" != typeof window && window.location;
          if (!t2) throw new Error("fixUrls requires window.location");
          if (!e2 || "string" != typeof e2) return e2;
          var n = t2.protocol + "//" + t2.host, r = n + t2.pathname.replace(/\/[^\/]*$/, "/");
          return e2.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, (function(e3, t3) {
            var o, i = t3.trim().replace(/^"(.*)"$/, (function(e4, t4) {
              return t4;
            })).replace(/^'(.*)'$/, (function(e4, t4) {
              return t4;
            }));
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i) ? e3 : (o = 0 === i.indexOf("//") ? i : 0 === i.indexOf("/") ? n + i : r + i.replace(/^\.\//, ""), "url(" + JSON.stringify(o) + ")");
          }));
        };
      }, function(e, t, n) {
        "use strict";
        n.r(t), n.d(t, "default", (function() {
          return p;
        }));
        n(1);
        var r = n(0), o = n.n(r);
        function i(e2, t2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var r2 = t2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, r2.key, r2);
          }
        }
        var a = (function() {
          function e2(t3) {
            var n3 = t3.config, r3 = t3.onUpload, o2 = t3.onError;
            !(function(e3, t4) {
              if (!(e3 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e2), this.config = n3, this.onUpload = r3, this.onError = o2;
          }
          var t2, n2, r2;
          return t2 = e2, (n2 = [{ key: "uploadSelectedFile", value: function(e3) {
            var t3 = this, n3 = e3.onPreview;
            (this.config.uploader && "function" == typeof this.config.uploader.uploadByFile ? o.a.selectFiles({ accept: this.config.types }).then((function(e4) {
              n3();
              var r3, o2 = t3.config.uploader.uploadByFile(e4[0]);
              return (r3 = o2) && "function" == typeof r3.then || console.warn("Custom uploader method uploadByFile should return a Promise"), o2;
            })) : o.a.transport({ url: this.config.endpoint, accept: this.config.types, beforeSend: function() {
              return n3();
            }, fieldName: this.config.field, headers: this.config.additionalRequestHeaders || {} }).then((function(e4) {
              return e4.body;
            }))).then((function(e4) {
              t3.onUpload(e4);
            })).catch((function(e4) {
              var n4 = e4.body, r3 = n4 && n4.message ? n4.message : t3.config.errorMessage;
              t3.onError(r3);
            }));
          } }]) && i(t2.prototype, n2), r2 && i(t2, r2), e2;
        })();
        function s(e2) {
          return (function(e3) {
            if (Array.isArray(e3)) return c(e3);
          })(e2) || (function(e3) {
            if ("undefined" != typeof Symbol && null != e3[Symbol.iterator] || null != e3["@@iterator"]) return Array.from(e3);
          })(e2) || (function(e3, t2) {
            if (!e3) return;
            if ("string" == typeof e3) return c(e3, t2);
            var n2 = Object.prototype.toString.call(e3).slice(8, -1);
            "Object" === n2 && e3.constructor && (n2 = e3.constructor.name);
            if ("Map" === n2 || "Set" === n2) return Array.from(e3);
            if ("Arguments" === n2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2)) return c(e3, t2);
          })(e2) || (function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          })();
        }
        function c(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = new Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        function l(e2) {
          var t2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, r2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, o2 = document.createElement(e2);
          Array.isArray(n2) ? (t2 = o2.classList).add.apply(t2, s(n2)) : n2 && o2.classList.add(n2);
          for (var i2 in r2) o2[i2] = r2[i2];
          return o2;
        }
        function u(e2) {
          return 0 === Object.keys(e2).length;
        }
        const f = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.3236 8.43554L9.49533 12.1908C9.13119 12.5505 8.93118 13.043 8.9393 13.5598C8.94741 14.0767 9.163 14.5757 9.53862 14.947C9.91424 15.3182 10.4191 15.5314 10.9422 15.5397C11.4653 15.5479 11.9637 15.3504 12.3279 14.9908L16.1562 11.2355C16.8845 10.5161 17.2845 9.53123 17.2682 8.4975C17.252 7.46376 16.8208 6.46583 16.0696 5.72324C15.3184 4.98066 14.3086 4.55425 13.2624 4.53782C12.2162 4.52138 11.2193 4.91627 10.4911 5.63562L6.66277 9.39093C5.57035 10.4699 4.97032 11.9473 4.99467 13.4979C5.01903 15.0485 5.66578 16.5454 6.79264 17.6592C7.9195 18.7731 9.43417 19.4127 11.0034 19.4374C12.5727 19.462 14.068 18.8697 15.1604 17.7907L18.9887 14.0354"/></svg>';
        function d(e2, t2) {
          for (var n2 = 0; n2 < t2.length; n2++) {
            var r2 = t2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, r2.key, r2);
          }
        }
        var p = (function() {
          function e2(t3) {
            var n3 = this, r3 = t3.data, o2 = t3.config, i2 = t3.api, s2 = t3.readOnly;
            !(function(e3, t4) {
              if (!(e3 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            })(this, e2), this.api = i2, this.readOnly = s2, this.nodes = { wrapper: null, button: null, title: null }, this._data = { file: {}, title: "" }, this.config = { endpoint: o2.endpoint || "", field: o2.field || "file", types: o2.types || "*", buttonText: o2.buttonText || "Select file to upload", errorMessage: o2.errorMessage || "File upload failed", uploader: o2.uploader || void 0, additionalRequestHeaders: o2.additionalRequestHeaders || {} }, void 0 === r3 || u(r3) || (this.data = r3), this.uploader = new a({ config: this.config, onUpload: function(e3) {
              return n3.onUpload(e3);
            }, onError: function(e3) {
              return n3.uploadingFailed(e3);
            } }), this.enableFileUpload = this.enableFileUpload.bind(this);
          }
          var t2, n2, r2;
          return t2 = e2, r2 = [{ key: "toolbox", get: function() {
            return { icon: f, title: "Attachment" };
          } }, { key: "isReadOnlySupported", get: function() {
            return true;
          } }], (n2 = [{ key: "CSS", get: function() {
            return { baseClass: this.api.styles.block, apiButton: this.api.styles.button, loader: this.api.styles.loader, wrapper: "cdx-attaches", wrapperWithFile: "cdx-attaches--with-file", wrapperLoading: "cdx-attaches--loading", button: "cdx-attaches__button", title: "cdx-attaches__title", size: "cdx-attaches__size", downloadButton: "cdx-attaches__download-button", fileInfo: "cdx-attaches__file-info", fileIcon: "cdx-attaches__file-icon", fileIconBackground: "cdx-attaches__file-icon-background", fileIconLabel: "cdx-attaches__file-icon-label" };
          } }, { key: "EXTENSIONS", get: function() {
            return { doc: "#1483E9", docx: "#1483E9", odt: "#1483E9", pdf: "#DB2F2F", rtf: "#744FDC", tex: "#5a5a5b", txt: "#5a5a5b", pptx: "#E35200", ppt: "#E35200", mp3: "#eab456", mp4: "#f676a6", xls: "#11AE3D", html: "#2988f0", htm: "#2988f0", png: "#AA2284", jpg: "#D13359", jpeg: "#D13359", gif: "#f6af76", zip: "#4f566f", rar: "#4f566f", exe: "#e26f6f", svg: "#bf5252", key: "#00B2FF", sketch: "#FFC700", ai: "#FB601D", psd: "#388ae5", dmg: "#e26f6f", json: "#2988f0", csv: "#11AE3D" };
          } }, { key: "validate", value: function(e3) {
            return !u(e3.file);
          } }, { key: "save", value: function(e3) {
            if (this.pluginHasData()) {
              var t3 = e3.querySelector(".".concat(this.CSS.title));
              t3 && Object.assign(this.data, { title: t3.innerHTML });
            }
            return this.data;
          } }, { key: "render", value: function() {
            var e3 = l("div", this.CSS.baseClass);
            return this.nodes.wrapper = l("div", this.CSS.wrapper), this.pluginHasData() ? this.showFileData() : this.prepareUploadButton(), e3.appendChild(this.nodes.wrapper), e3;
          } }, { key: "prepareUploadButton", value: function() {
            this.nodes.button = l("div", [this.CSS.apiButton, this.CSS.button]), this.nodes.button.innerHTML = "".concat(f, " ").concat(this.config.buttonText), this.readOnly || this.nodes.button.addEventListener("click", this.enableFileUpload), this.nodes.wrapper.appendChild(this.nodes.button);
          } }, { key: "appendCallback", value: function() {
            this.nodes.button.click();
          } }, { key: "pluginHasData", value: function() {
            return "" !== this.data.title || Object.values(this.data.file).some((function(e3) {
              return void 0 !== e3;
            }));
          } }, { key: "enableFileUpload", value: function() {
            var e3 = this;
            this.uploader.uploadSelectedFile({ onPreview: function() {
              e3.nodes.wrapper.classList.add(e3.CSS.wrapperLoading, e3.CSS.loader);
            } });
          } }, { key: "onUpload", value: function(e3) {
            var t3, n3, r3, o2 = e3;
            try {
              o2.success && void 0 !== o2.file && !u(o2.file) ? (this.data = { file: o2.file, title: o2.file.title || "" }, this.nodes.button.remove(), this.showFileData(), t3 = this.nodes.title, n3 = document.createRange(), r3 = window.getSelection(), n3.selectNodeContents(t3), n3.collapse(false), r3.removeAllRanges(), r3.addRange(n3), this.removeLoader()) : this.uploadingFailed(this.config.errorMessage);
            } catch (e4) {
              console.error("Attaches tool error:", e4), this.uploadingFailed(this.config.errorMessage);
            }
            this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex()).dispatchChange();
          } }, { key: "appendFileIcon", value: function(e3) {
            var t3, n3 = e3.extension || (void 0 === (t3 = e3.name) ? "" : t3.split(".").pop()), r3 = this.EXTENSIONS[n3], o2 = l("div", this.CSS.fileIcon), i2 = l("div", this.CSS.fileIconBackground);
            if (r3 && (i2.style.backgroundColor = r3), o2.appendChild(i2), n3) {
              var a2 = n3;
              n3.length > 4 && (a2 = n3.substring(0, 4) + "…");
              var s2 = l("div", this.CSS.fileIconLabel, { textContent: a2, title: n3 });
              r3 && (s2.style.backgroundColor = r3), o2.appendChild(s2);
            } else i2.innerHTML = f;
            this.nodes.wrapper.appendChild(o2);
          } }, { key: "removeLoader", value: function() {
            var e3 = this;
            setTimeout((function() {
              return e3.nodes.wrapper.classList.remove(e3.CSS.wrapperLoading, e3.CSS.loader);
            }), 500);
          } }, { key: "showFileData", value: function() {
            this.nodes.wrapper.classList.add(this.CSS.wrapperWithFile);
            var e3 = this.data, t3 = e3.file, n3 = e3.title;
            this.appendFileIcon(t3);
            var r3 = l("div", this.CSS.fileInfo);
            if (this.nodes.title = l("div", this.CSS.title, { contentEditable: false === this.readOnly }), this.nodes.title.dataset.placeholder = this.api.i18n.t("File title"), this.nodes.title.textContent = n3 || "", r3.appendChild(this.nodes.title), t3.size) {
              var o2, i2, a2 = l("div", this.CSS.size);
              Math.log10(+t3.size) >= 6 ? (o2 = "MiB", i2 = t3.size / Math.pow(2, 20)) : (o2 = "KiB", i2 = t3.size / Math.pow(2, 10)), a2.textContent = i2.toFixed(1), a2.setAttribute("data-size", o2), r3.appendChild(a2);
            }
            if (this.nodes.wrapper.appendChild(r3), void 0 !== t3.url) {
              var s2 = l("a", this.CSS.downloadButton, { innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"/></svg>', href: t3.url, target: "_blank" });
              this.nodes.wrapper.appendChild(s2);
            }
          } }, { key: "uploadingFailed", value: function(e3) {
            this.api.notifier.show({ message: e3, style: "error" }), this.removeLoader();
          } }, { key: "data", get: function() {
            return this._data;
          }, set: function(e3) {
            var t3 = e3.file, n3 = e3.title;
            this._data = { file: t3, title: n3 };
          } }]) && d(t2.prototype, n2), r2 && d(t2, r2), e2;
        })();
      }]).default;
    }));
  }
});
export default require_bundle();
//# sourceMappingURL=@editorjs_attaches.js.map

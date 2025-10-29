import {
  __commonJS
} from "./chunk-PR4QN5HX.js";

// node_modules/editorjs-text-color-plugin/dist/bundle.js
var require_bundle = __commonJS({
  "node_modules/editorjs-text-color-plugin/dist/bundle.js"(exports, module) {
    !(function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.ColorPlugin = e() : t.ColorPlugin = e();
    })(self, (() => (() => {
      var t = { 424: (t2, e2, n2) => {
        (e2 = n2(645)(false)).push([t2.id, ".picker_wrapper.popup {\n  z-index: 99;\n  width: 170px;\n  margin: 0;\n  box-shadow: 0 0 10px 1px #eaeaea;\n  background: #ffffff;\n}\n\n.picker_arrow {\n  display: none;\n}\n\n.layout_default .picker_slider, .layout_default .picker_selector {\n  padding: 5px;\n}\n\n.colorPlugin.ce-inline-tool {\n  width: 32px;\n  border-radius: 3px;\n}\n\n.colorPlugin.ce-inline-tool--active svg {\n  fill: #3c99ff;\n}\n\n#color-left-btn {\n  height: 35px;\n  width: 18px;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n}\n\n#color-left-btn:hover {\n  border-radius: 5px 0 0 5px;\n  background: rgba(203, 203, 203, 0.49);\n}\n\n#color-text {\n  padding: 0 4px;\n}\n\n#color-btn-text {\n  height: 15px;\n}\n\n", ""]), t2.exports = e2;
      }, 645: (t2) => {
        "use strict";
        t2.exports = function(t3) {
          var e2 = [];
          return e2.toString = function() {
            return this.map((function(e3) {
              var n2 = (function(t4, e4) {
                var n3, o, i, s = t4[1] || "", r = t4[3];
                if (!r) return s;
                if (e4 && "function" == typeof btoa) {
                  var l = (n3 = r, o = btoa(unescape(encodeURIComponent(JSON.stringify(n3)))), i = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o), "/*# ".concat(i, " */")), a = r.sources.map((function(t5) {
                    return "/*# sourceURL=".concat(r.sourceRoot || "").concat(t5, " */");
                  }));
                  return [s].concat(a).concat([l]).join("\n");
                }
                return [s].join("\n");
              })(e3, t3);
              return e3[2] ? "@media ".concat(e3[2], " {").concat(n2, "}") : n2;
            })).join("");
          }, e2.i = function(t4, n2, o) {
            "string" == typeof t4 && (t4 = [[null, t4, ""]]);
            var i = {};
            if (o) for (var s = 0; s < this.length; s++) {
              var r = this[s][0];
              null != r && (i[r] = true);
            }
            for (var l = 0; l < t4.length; l++) {
              var a = [].concat(t4[l]);
              o && i[a[0]] || (n2 && (a[2] ? a[2] = "".concat(n2, " and ").concat(a[2]) : a[2] = n2), e2.push(a));
            }
          }, e2;
        };
      }, 548: (t2, e2, n2) => {
        var o = n2(379), i = n2(424);
        "string" == typeof (i = i.__esModule ? i.default : i) && (i = [[t2.id, i, ""]]);
        o(i, { insert: "head", singleton: false }), t2.exports = i.locals || {};
      }, 379: (t2, e2, n2) => {
        "use strict";
        var o, i = /* @__PURE__ */ (function() {
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
        })(), s = [];
        function r(t3) {
          for (var e3 = -1, n3 = 0; n3 < s.length; n3++) if (s[n3].identifier === t3) {
            e3 = n3;
            break;
          }
          return e3;
        }
        function l(t3, e3) {
          for (var n3 = {}, o2 = [], i2 = 0; i2 < t3.length; i2++) {
            var l2 = t3[i2], a2 = e3.base ? l2[0] + e3.base : l2[0], c2 = n3[a2] || 0, p2 = "".concat(a2, " ").concat(c2);
            n3[a2] = c2 + 1;
            var d2 = r(p2), h2 = { css: l2[1], media: l2[2], sourceMap: l2[3] };
            -1 !== d2 ? (s[d2].references++, s[d2].updater(h2)) : s.push({ identifier: p2, updater: b(h2, e3), references: 1 }), o2.push(p2);
          }
          return o2;
        }
        function a(t3) {
          var e3 = document.createElement("style"), o2 = t3.attributes || {};
          if (void 0 === o2.nonce) {
            var s2 = n2.nc;
            s2 && (o2.nonce = s2);
          }
          if (Object.keys(o2).forEach((function(t4) {
            e3.setAttribute(t4, o2[t4]);
          })), "function" == typeof t3.insert) t3.insert(e3);
          else {
            var r2 = i(t3.insert || "head");
            if (!r2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
            r2.appendChild(e3);
          }
          return e3;
        }
        var c, p = (c = [], function(t3, e3) {
          return c[t3] = e3, c.filter(Boolean).join("\n");
        });
        function d(t3, e3, n3, o2) {
          var i2 = n3 ? "" : o2.media ? "@media ".concat(o2.media, " {").concat(o2.css, "}") : o2.css;
          if (t3.styleSheet) t3.styleSheet.cssText = p(e3, i2);
          else {
            var s2 = document.createTextNode(i2), r2 = t3.childNodes;
            r2[e3] && t3.removeChild(r2[e3]), r2.length ? t3.insertBefore(s2, r2[e3]) : t3.appendChild(s2);
          }
        }
        function h(t3, e3, n3) {
          var o2 = n3.css, i2 = n3.media, s2 = n3.sourceMap;
          if (i2 ? t3.setAttribute("media", i2) : t3.removeAttribute("media"), s2 && "undefined" != typeof btoa && (o2 += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s2)))), " */")), t3.styleSheet) t3.styleSheet.cssText = o2;
          else {
            for (; t3.firstChild; ) t3.removeChild(t3.firstChild);
            t3.appendChild(document.createTextNode(o2));
          }
        }
        var u = null, g = 0;
        function b(t3, e3) {
          var n3, o2, i2;
          if (e3.singleton) {
            var s2 = g++;
            n3 = u || (u = a(e3)), o2 = d.bind(null, n3, s2, false), i2 = d.bind(null, n3, s2, true);
          } else n3 = a(e3), o2 = h.bind(null, n3, e3), i2 = function() {
            !(function(t4) {
              if (null === t4.parentNode) return false;
              t4.parentNode.removeChild(t4);
            })(n3);
          };
          return o2(t3), function(e4) {
            if (e4) {
              if (e4.css === t3.css && e4.media === t3.media && e4.sourceMap === t3.sourceMap) return;
              o2(t3 = e4);
            } else i2();
          };
        }
        t2.exports = function(t3, e3) {
          (e3 = e3 || {}).singleton || "boolean" == typeof e3.singleton || (e3.singleton = (void 0 === o && (o = Boolean(window && document && document.all && !window.atob)), o));
          var n3 = l(t3 = t3 || [], e3);
          return function(t4) {
            if (t4 = t4 || [], "[object Array]" === Object.prototype.toString.call(t4)) {
              for (var o2 = 0; o2 < n3.length; o2++) {
                var i2 = r(n3[o2]);
                s[i2].references--;
              }
              for (var a2 = l(t4, e3), c2 = 0; c2 < n3.length; c2++) {
                var p2 = r(n3[c2]);
                0 === s[p2].references && (s[p2].updater(), s.splice(p2, 1));
              }
              n3 = a2;
            }
          };
        };
      }, 452: (t2) => {
        t2.exports = { markerIcon: '<svg fill="#000000" height="34px" width="34px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n	 viewBox="0 0 491.644 491.644" xml:space="preserve">\n<g>\n	<path d="M456.623,2.282c-42.758-20.283-141.107,96.84-223.473,264.224c-2.35,4.776-2.686,10.294-0.936,15.32\n		c1.75,5.026,5.442,9.145,10.251,11.426L366.758,352.2c4.809,2.281,10.332,2.538,15.333,0.714c5.001-1.825,9.059-5.579,11.272-10.42\n		C470.883,172.829,499.385,22.562,456.623,2.282z"/>\n	<path d="M34.71,461.799l-17.257,16.708c-2.225,2.17-2.934,5.475-1.773,8.363c1.179,2.886,3.985,4.773,7.099,4.773h160.887\n		c-1.364-5.043-0.921-10.445,1.391-15.306l7.919-16.692H40.036C38.036,459.646,36.129,460.419,34.71,461.799z"/>\n	<path d="M264.766,448.864l-32.615-15.458c-1.046-0.502-2.161-0.744-3.257-0.744c-2.87,0-5.611,1.614-6.901,4.372l-22.001,46.384\n		c-0.871,1.789-0.723,3.895,0.341,5.564c1.046,1.661,2.888,2.661,4.855,2.661h0.046l44.275-0.378\n		c2.206-0.016,4.206-1.299,5.159-3.292l13.724-28.925c0.856-1.838,0.967-3.936,0.29-5.846\n		C268.004,451.292,266.585,449.728,264.766,448.864z"/>\n	<path d="M348.445,366.038l-112.572-51.392c-8.909-4.067-19.434-0.227-23.63,8.622c-2.551,5.378-3.58,11.353-2.975,17.275\n		l5.2,50.909c0.703,6.882,4.983,12.884,11.261,15.792l60.031,27.797c6.688,3.097,14.548,2.179,20.343-2.375l45.983-36.137\n		c4.931-3.875,7.487-10.041,6.743-16.269C358.086,374.032,354.151,368.642,348.445,366.038z"/>\n</g>\n</svg>', textIcon: '<svg fill="#000000" viewBox="-6 0 512 512" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><title>text</title><path d="M365 432L328 352 172 352 135 432 64 432 227 80 272 80 436 432 365 432ZM201 288L299 288 250 183 201 288Z"></path></g></svg>' };
      }, 138: (t2, e2, n2) => {
        const o = n2(442), { markerIcon: i, textIcon: s } = n2(452), { getDefaultColorCache: r, handleCSSVariables: l } = n2(697);
        n2(548).toString(), t2.exports = class {
          constructor({ config: t3, api: e3 }) {
            this.api = e3, this.config = t3, this.clickedOnLeft = false, this.pluginType = this.config.type || "text", this.parentTag = "marker" === this.pluginType ? "MARK" : "FONT", this.hasCustomPicker = this.config.customPicker || false, this.color = l(r(this.config.defaultColor, this.pluginType)), this.picker = null, this.icon = null, this.button = null, this.iconClasses = { base: this.api.styles.inlineToolButton, active: this.api.styles.inlineToolButtonActive };
          }
          static get isInline() {
            return true;
          }
          render() {
            return this.button = document.createElement("button"), this.button.type = "button", this.button.classList.add("colorPlugin"), this.button.classList.add(this.iconClasses.base), this.button.appendChild(this.createLeftButton()), this.button.appendChild(this.createRightButton(this)), this.button;
          }
          createLeftButton() {
            return this.icon || (this.icon = document.createElement("div"), this.icon.id = "color-left-btn", this.icon.appendChild(this.createButtonIcon()), this.icon.addEventListener("click", (() => this.clickedOnLeft = true))), this.icon;
          }
          createButtonIcon() {
            const t3 = document.createElement("div");
            t3.id = "color-btn-text";
            const e3 = "marker" === this.pluginType ? i : s;
            return t3.innerHTML = this.config.icon || e3, t3;
          }
          createRightButton(t3) {
            return this.picker || (this.picker = new o.ColorPlugin({ onColorPicked: function(e3) {
              t3.color = e3;
            }, hasCustomPicker: this.hasCustomPicker, defaultColor: this.config.defaultColor, colorCollections: this.config.colorCollections, type: this.pluginType })), this.picker;
          }
          surround(t3) {
            if (!t3) return;
            const e3 = this.api.selection.findParentTag("SPAN");
            e3 && this.unwrap(e3);
            const n3 = this.api.selection.findParentTag(this.parentTag);
            n3 ? this.unwrap(n3) : this.wrap(t3), this.clickedOnLeft = false;
          }
          wrap(t3) {
            const e3 = t3.extractContents(), n3 = document.createElement(this.parentTag);
            n3.appendChild(e3), t3.insertNode(n3), "marker" === this.pluginType ? this.wrapMarker(n3) : this.wrapTextColor(n3), this.api.selection.expandToTag(n3);
          }
          wrapMarker(t3) {
            t3.style.backgroundColor = this.color;
            const e3 = this.api.selection.findParentTag("FONT");
            e3 && (t3.style.color = e3.style.color);
          }
          wrapTextColor(t3) {
            t3.style.color = this.color;
          }
          unwrap(t3) {
            this.api.selection.expandToTag(t3);
            const e3 = window.getSelection(), n3 = e3.getRangeAt(0), o2 = n3.extractContents();
            this.clickedOnLeft ? this.removeWrapper(t3) : this.updateWrapper(t3), n3.insertNode(o2), e3.removeAllRanges(), e3.addRange(n3);
          }
          updateWrapper(t3) {
            "marker" === this.pluginType ? t3.style.backgroundColor = this.color : t3.style.color = this.color;
          }
          removeWrapper(t3) {
            t3.parentNode.removeChild(t3);
          }
          checkState() {
            const t3 = this.api.selection.findParentTag("SPAN"), e3 = this.api.selection.findParentTag(this.parentTag);
            let n3 = t3 ? this.handleLegacyWrapper(t3, e3) : e3;
            return this.button.classList.toggle(this.iconClasses.active, !!n3), !!n3;
          }
          handleLegacyWrapper(t3, e3) {
            return "marker" === this.pluginType ? t3 : e3 & t3;
          }
          static get sanitize() {
            return { font: true, span: true, mark: true };
          }
          clear() {
            this.picker = null, this.icon = null;
          }
        };
      }, 442: (t2, e2, n2) => {
        "use strict";
        n2.r(e2), n2.d(e2, { ColorPlugin: () => c });
        class o extends HTMLElement {
          static get observedAttributes() {
            return ["disabled", "icon", "loading", "href", "htmltype"];
          }
          constructor() {
            super(), this.attachShadow({ mode: "open" }).innerHTML = `
        <style>
        :host{ 
            position:relative; 
            display:inline-flex; 
            padding: .25em .625em;
            box-sizing:border-box; 
            vertical-align: middle;
            line-height: 1.8;
            width: 5px;
            overflow:hidden; 
            align-items:center;
            justify-content: center;
            font-size: 14px; 
            color: var(--fontColor,#333);  
            border-radius: var(--borderRadius,.25em);
            background: var(--fontColor,#333); 
            transition:background .3s,box-shadow .3s,border-color .3s,color .3s;
        }
        :host([shape="circle"]){ 
            border-radius:50%; 
        }
        /*
        :host(:not([disabled]):active){
            z-index:1;
            transform:translateY(.1em);
        }
        */
        :host([disabled]),:host([loading]){
            pointer-events: none; 
            opacity:.6; 
        }
        :host([block]){ 
            display:flex; 
        }
        :host([disabled]:not([type])){ 
            background:rgba(0,0,0,.1); 
        }
        :host([disabled]) .btn,:host([loading]) .btn{ 
            cursor: not-allowed; 
            pointer-events: all; 
        }
        :host(:not([type="primary"]):not([type="danger"]):not([disabled]):hover),
        :host(:not([type="primary"]):not([type="danger"]):focus-within),
        :host([type="flat"][focus]){ 
            color:var(--themeColor,#42b983); 
            border-color: var(--themeColor,#42b983); 
        }
        :host(:not([type="primary"]):not([type="danger"])) .btn::after{ 
            background-image: radial-gradient(circle, var(--themeColor,#42b983) 10%, transparent 10.01%); 
        }
        :host([type="primary"]){ 
            color: #fff; 
            background:var(--themeBackground,var(--themeColor,#42b983));
        }
        :host([type="danger"]){ 
            color: #fff; 
            background:var(--themeBackground,var(--dangerColor,#ff7875));
        }
        :host([type="dashed"]){ 
            border-style:dashed 
        }
        :host([type="flat"]),:host([type="primary"]),:host([type="danger"]){ 
            border:0;
            padding: calc( .25em + 1px ) calc( .625em + 1px );
        }
        :host([type="flat"]) .btn::before{ 
            content:''; 
            position:absolute; 
            background:var(--themeColor,#42b983);
            pointer-events:none; 
            left:0; 
            right:0; 
            top:0; 
            bottom:0; 
            opacity:0; 
            transition:.3s;
        }
        :host([type="flat"]:not([disabled]):hover) .btn::before{ 
            opacity:.1 
        }
        :host(:not([disabled]):hover){ 
            z-index:1 
        }
        :host([type="flat"]:focus-within) .btn:before,
        :host([type="flat"][focus]) .btn:before{ 
            opacity:.2; 
        }
        :host(:focus-within){ 
            /*box-shadow: 0 0 10px rgba(0,0,0,0.1);*/ 
        }
        .btn{ 
            background:none; 
            outline:0; 
            border:0; 
            position: 
            absolute; 
            left:0; 
            top:0;
            width:100%;
            height:100%;
            padding:0;
            user-select: none;
            cursor: unset;
        }
        xy-loading{ 
            margin-right: 0.35em;  
        }
        ::-moz-focus-inner{
            border:0;
        }
        .btn::before{
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left:0;
            top:0;
            transition:.2s;
            background:#fff;
            opacity:0;
        }
        :host(:not([disabled]):active) .btn::before{ 
            opacity:.2;
        }
        .btn::after {
            content: "";
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            left: var(--x,0); 
            top: var(--y,0);
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: translate(-50%,-50%) scale(10);
            opacity: 0;
            transition: transform .3s, opacity .8s;
        }
        .btn:not([disabled]):active::after {
            transform: translate(-50%,-50%) scale(0);
            opacity: .3;
            transition: 0s;
        }
        xy-icon{
            margin-right: 0.35em;
            transition: none;
        }
        :host(:empty) xy-icon{
            margin: auto;
        }
        :host(:empty){
            padding: .65em;
        }
        :host([type="flat"]:empty),:host([type="primary"]:empty){ 
            padding: calc( .65em + 1px );
        }
        ::slotted(xy-icon){
            transition: none;
        }
        :host([href]){
            cursor:pointer;
        }
        </style>
        <${this.href ? "a" : "button"} ${this.htmltype ? 'type="' + this.htmltype + '"' : ""} ${this.download && this.href ? 'download="' + this.download + '"' : ""} ${this.href ? 'href="' + this.href + '" target="' + this.target + '" rel="' + this.rel + '"' : ""} class="btn" id="btn"></${this.href ? "a" : "button"}>${!this.loading && this.icon && "null" != this.icon ? '<xy-icon id="icon" name=' + this.icon + "></xy-icon>" : ""}<slot></slot>
        `;
          }
          focus() {
            this.btn.focus();
          }
          get disabled() {
            return null !== this.getAttribute("disabled");
          }
          get toggle() {
            return null !== this.getAttribute("toggle");
          }
          get htmltype() {
            return this.getAttribute("htmltype");
          }
          get name() {
            return this.getAttribute("name");
          }
          get checked() {
            return null !== this.getAttribute("checked");
          }
          get href() {
            return this.getAttribute("href");
          }
          get target() {
            return this.getAttribute("target") || "_blank";
          }
          get rel() {
            return this.getAttribute("rel");
          }
          get download() {
            return this.getAttribute("download");
          }
          get icon() {
            return this.getAttribute("icon");
          }
          get loading() {
            return null !== this.getAttribute("loading");
          }
          set icon(t3) {
            this.setAttribute("icon", t3);
          }
          set htmltype(t3) {
            this.setAttribute("htmltype", t3);
          }
          set href(t3) {
            this.setAttribute("href", t3);
          }
          set disabled(t3) {
            null === t3 || false === t3 ? this.removeAttribute("disabled") : this.setAttribute("disabled", "");
          }
          set checked(t3) {
            null === t3 || false === t3 ? this.removeAttribute("checked") : this.setAttribute("checked", "");
          }
          set loading(t3) {
            null === t3 || false === t3 ? this.removeAttribute("loading") : this.setAttribute("loading", "");
          }
          connectedCallback() {
            this.btn = this.shadowRoot.getElementById("btn"), this.ico = this.shadowRoot.getElementById("icon"), this.load = document.createElement("xy-loading"), this.load.style.color = "inherit", this.btn.addEventListener("mousedown", (function(t3) {
              if (!this.disabled) {
                const { left: e3, top: n3 } = this.getBoundingClientRect();
                this.style.setProperty("--x", t3.clientX - e3 + "px"), this.style.setProperty("--y", t3.clientY - n3 + "px");
              }
            })), this.addEventListener("click", (function(t3) {
              this.toggle && (this.checked = !this.checked);
            })), this.btn.addEventListener("keydown", ((t3) => {
              13 === t3.keyCode && t3.stopPropagation();
            })), this.disabled = this.disabled, this.loading = this.loading;
          }
          attributeChangedCallback(t3, e3, n3) {
            "disabled" == t3 && this.btn && (null !== n3 ? (this.btn.setAttribute("disabled", "disabled"), this.href && this.btn.removeAttribute("href")) : (this.btn.removeAttribute("disabled"), this.href && (this.btn.href = this.href))), "loading" == t3 && this.btn && (null !== n3 ? (this.shadowRoot.prepend(this.load), this.btn.setAttribute("disabled", "disabled")) : (this.shadowRoot.removeChild(this.load), this.btn.removeAttribute("disabled"))), "icon" == t3 && this.ico && (this.ico.name = n3), "href" == t3 && this.btn && (this.disabled || (this.btn.href = n3)), "htmltype" == t3 && this.btn && (this.btn.type = n3);
          }
        }
        customElements.get("xy-button") || customElements.define("xy-button", o);
        class i extends HTMLElement {
          static get observedAttributes() {
            return ["disabled"];
          }
          constructor() {
            super(), this.attachShadow({ mode: "open" }).innerHTML = '\n        <style>\n        :host {\n            display:inline-flex;\n        }\n        ::slotted(xy-button:not(:first-of-type):not(:last-of-type)){\n            border-radius:0;\n        }\n        ::slotted(xy-button){\n            margin:0!important;\n        }\n        ::slotted(xy-button:not(:first-of-type)){\n            margin-left:-1px!important;\n        }\n        ::slotted(xy-button[type]:not([type="dashed"]):not(:first-of-type)){\n            margin-left:1px!important;\n        }\n        ::slotted(xy-button:first-of-type){\n            border-top-right-radius: 0;\n            border-bottom-right-radius: 0px;\n        }\n        ::slotted(xy-button:last-of-type){\n            border-top-left-radius: 0;\n            border-bottom-left-radius: 0;\n        }\n        </style>\n        <slot></slot>\n        ';
          }
          get disabled() {
            return null !== this.getAttribute("disabled");
          }
          set disabled(t3) {
            null === t3 || false === t3 ? this.removeAttribute("disabled") : this.setAttribute("disabled", "");
          }
          connectedCallback() {
          }
          attributeChangedCallback(t3, e3, n3) {
          }
        }
        customElements.get("xy-button-group") || customElements.define("xy-button-group", i);
        class s extends HTMLElement {
          static get observedAttributes() {
            return ["open", "title", "oktext", "canceltext", "loading", "type"];
          }
          constructor(t3) {
            super(), this.attachShadow({ mode: "open" }).innerHTML = `
        <style>
        :host{
            position:absolute;
            display:flex;
            box-shadow: 2px 2px 15px rgba(0,0,0,0.15);
            box-sizing: border-box;
            transform:scale(0);
            opacity:0.5;
            border-radius: 3px;
            z-index:10;
            transition:.3s cubic-bezier(.645, .045, .355, 1);
            transform-origin:inherit;
            background:#fff;
            visibility:hidden;
        }
        .popcon-content{
            box-sizing: border-box;
            display:flex;
            width: max-content;
            padding: 0 15px;
            flex:1;
            flex-direction:column;
        }
        .popcon-title {
            line-height: 30px;
            padding: 15px 30px 0 0;
            font-weight: 700;
            font-size: 14px;
            color: #4c5161;
            user-select: none;
            cursor: default;
        }
        .popcon-body {
            flex: 1;
            padding: 5px 0 15px 0;
        }
        .popcon-footer {
            padding: 3px 0 15px 0;
            margin-top: -3px;
            text-align: right;
            white-space: nowrap;
        }
        .btn-close{
            position:absolute;
            right:10px;
            top:10px;
            border:0;
        }
        .popcon-footer xy-button {
            font-size: .8em;
            margin-left: .8em;
        }
        .popcon-type{
            display:flex;
            width:30px;
            height:30px;
            font-size:22px;
            margin: 15px -10px 0 15px;
        }
        /*
        :host(:not([type="confirm"])) .popcon-type,
        :host(:not([type="confirm"])) .popcon-footer,
        :host(:not([type])) .popcon-title,
        :host(:not([type])) .btn-close{
            display:none;
        }
        */
        :host([type="confirm"]){
            min-width:250px;
        }
        :host([type="confirm"]) .popcon-body{
            font-size:14px;
        }
        :host(:not([type])) .popcon-content,:host(:not([type])) .popcon-body{
            padding: 0;
        }
        </style>
            ${"confirm" === (t3 || this.type) ? '<xy-icon id="popcon-type" class="popcon-type" name="question-circle" color="var(--waringColor,#faad14)"></xy-icon>' : ""}
            <div class="popcon-content">
                ${null !== (t3 || this.type) ? '<div class="popcon-title" id="title">' + this.title + '</div><xy-button class="btn-close" id="btn-close" icon="close"></xy-button>' : ""}
                <div class="popcon-body">
                    <slot></slot>
                </div>
                ${"confirm" === (t3 || this.type) ? '<div class="popcon-footer"><xy-button id="btn-cancel">' + this.canceltext + '</xy-button><xy-button id="btn-submit" type="primary">' + this.oktext + "</xy-button></div>" : ""}
            </div>
        `;
          }
          get open() {
            return null !== this.getAttribute("open");
          }
          get stopfocus() {
            return null !== this.getAttribute("stopfocus");
          }
          get title() {
            return this.getAttribute("title") || "popcon";
          }
          get type() {
            return this.getAttribute("type");
          }
          get oktext() {
            return this.getAttribute("oktext") || "confirm";
          }
          get canceltext() {
            return this.getAttribute("canceltext") || "cancel";
          }
          get loading() {
            return null !== this.getAttribute("loading");
          }
          set title(t3) {
            this.setAttribute("title", t3);
          }
          set type(t3) {
            null === t3 || false === t3 ? this.removeAttribute("type") : this.setAttribute("type", t3);
          }
          set oktext(t3) {
            this.setAttribute("oktext", t3);
          }
          set canceltext(t3) {
            this.setAttribute("canceltext", t3);
          }
          set open(t3) {
            null === t3 || false === t3 ? (this.removeAttribute("open"), this.parentNode.removeAttribute("open")) : (this.setAttribute("open", ""), this.parentNode.setAttribute("open", ""), this.loading && (this.loading = false));
          }
          set loading(t3) {
            null === t3 || false === t3 ? this.removeAttribute("loading") : this.setAttribute("loading", "");
          }
          connectedCallback() {
            this.remove = false, this.type && (this.titles = this.shadowRoot.getElementById("title"), this.btnClose = this.shadowRoot.getElementById("btn-close")), "confirm" == this.type && (this.btnCancel = this.shadowRoot.getElementById("btn-cancel"), this.btnSubmit = this.shadowRoot.getElementById("btn-submit")), this.addEventListener("transitionend", ((t3) => {
              "transform" === t3.propertyName && this.open && ("confirm" == this.type && this.btnSubmit.focus(), "pane" == this.type && this.btnClose.focus(), this.dispatchEvent(new CustomEvent("open")));
            })), this.addEventListener("transitionend", ((t3) => {
              "transform" !== t3.propertyName || this.open || (this.remove && this.parentNode.removeChild(this), this.dispatchEvent(new CustomEvent("close")));
            })), this.addEventListener("click", ((t3) => {
              t3.target.closest("[autoclose]") && (this.open = false, window.xyActiveElement.focus());
            })), this.type && this.btnClose.addEventListener("click", (() => {
              this.open = false, window.xyActiveElement.focus();
            })), "confirm" == this.type && (this.btnCancel.addEventListener("click", (async () => {
              this.dispatchEvent(new CustomEvent("cancel")), this.open = false, window.xyActiveElement.focus();
            })), this.btnSubmit.addEventListener("click", (() => {
              this.dispatchEvent(new CustomEvent("submit")), this.loading || (this.open = false, window.xyActiveElement.focus());
            })));
          }
          attributeChangedCallback(t3, e3, n3) {
            "open" == t3 && this.shadowRoot && null == n3 && this.stopfocus, "loading" == t3 && this.shadowRoot && (this.btnSubmit.loading = null !== n3), "title" == t3 && this.titles && null !== n3 && (this.titles.innerHTML = n3), "oktext" == t3 && this.btnSubmit && null !== n3 && (this.btnSubmit.innerHTML = n3), "canceltext" == t3 && this.btnCancel && null !== n3 && (this.btnCancel.innerHTML = n3);
          }
        }
        customElements.get("xy-popcon") || customElements.define("xy-popcon", s);
        class r extends HTMLElement {
          static get observedAttributes() {
            return ["title", "oktext", "canceltext", "loading", "type"];
          }
          constructor() {
            super(), this.attachShadow({ mode: "open" }).innerHTML = '\n        <style>\n        :host {\n            display:inline-block;\n            position:relative;\n            overflow:visible;\n        }\n        :host([dir="top"]) ::slotted(xy-popcon){\n            bottom:100%;\n            left:50%;\n            transform:translate(-50%,-10px) scale(0);\n            transform-origin: center bottom;\n        }\n        :host([dir="top"]) ::slotted(xy-popcon[open]),\n        :host([dir="top"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="top"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(-50%,-10px) scale(1);\n        }\n        :host([dir="right"]) ::slotted(xy-popcon){\n            left:100%;\n            top:50%;\n            transform:translate(10px,-50%) scale(0);\n            transform-origin: left;\n        }\n        :host([dir="right"]) ::slotted(xy-popcon[open]),\n        :host([dir="right"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="right"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(10px,-50%) scale(1);\n        }\n        :host([dir="bottom"]) ::slotted(xy-popcon){\n            top:100%;\n            left:50%;\n            transform:translate(-50%,10px) scale(0);\n            transform-origin: center top;\n        }\n        :host([dir="bottom"]) ::slotted(xy-popcon[open]),\n        :host([dir="bottom"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="bottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(-50%,10px) scale(1);\n        }\n        :host([dir="left"]) ::slotted(xy-popcon){\n            right:100%;\n            top:50%;\n            transform:translate(-10px,-50%) scale(0);\n            transform-origin: right;\n        }\n        :host([dir="left"]) ::slotted(xy-popcon[open]),\n        :host([dir="left"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="left"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(-10px,-50%) scale(1);\n        }\n        :host([dir="lefttop"]) ::slotted(xy-popcon){\n            right:100%;\n            top:0;\n            transform:translate(-10px) scale(0);\n            transform-origin: right top;\n        }\n        :host([dir="lefttop"]) ::slotted(xy-popcon[open]),\n        :host([dir="lefttop"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="lefttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(-10px) scale(1);\n        }\n        :host([dir="leftbottom"]) ::slotted(xy-popcon){\n            right:100%;\n            bottom:0;\n            transform:translate(-10px) scale(0);\n            transform-origin: right bottom;\n        }\n        :host([dir="leftbottom"]) ::slotted(xy-popcon[open]),\n        :host([dir="leftbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="leftbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(-10px) scale(1);\n        }\n        :host([dir="topleft"]) ::slotted(xy-popcon){\n            bottom:100%;\n            left:0;\n            transform:translate(0,-10px) scale(0);\n            transform-origin: left bottom;\n        }\n        :host([dir="topleft"]) ::slotted(xy-popcon[open]),\n        :host([dir="topleft"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="topleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(0,-10px) scale(1);\n        }\n        :host([dir="topright"]) ::slotted(xy-popcon){\n            bottom:100%;\n            right:0;\n            transform:translate(0,-10px) scale(0);\n            transform-origin: right bottom;\n        }\n        :host([dir="topright"]) ::slotted(xy-popcon[open]),\n        :host([dir="topright"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="topright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(0,-10px) scale(1);\n        }\n        :host([dir="righttop"]) ::slotted(xy-popcon){\n            left:100%;\n            top:0;\n            transform:translate(10px) scale(0);\n            transform-origin: left top;\n        }\n        :host([dir="righttop"]) ::slotted(xy-popcon[open]),\n        :host([dir="righttop"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="righttop"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(10px) scale(1);\n        }\n        :host([dir="rightbottom"]) ::slotted(xy-popcon){\n            left:100%;\n            bottom:0;\n            transform:translate(10px) scale(0);\n            transform-origin: left bottom;\n        }\n        :host([dir="rightbottom"]) ::slotted(xy-popcon[open]),\n        :host([dir="rightbottom"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="rightbottom"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(10px) scale(1);\n        }\n        :host([dir="bottomleft"]) ::slotted(xy-popcon),\n        :host(:not([dir])) ::slotted(xy-popcon){\n            left:0;\n            top:100%;\n            transform:translate(0,10px) scale(0);\n            transform-origin: left top;\n        }\n        :host(:not([dir])) ::slotted(xy-popcon[open]),\n        :host(:not([dir])[trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host(:not([dir])[trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon),\n        :host([dir="bottomleft"]) ::slotted(xy-popcon[open]),\n        :host([dir="bottomleft"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="bottomleft"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(0,10px) scale(1);\n        }\n        :host([dir="bottomright"]) ::slotted(xy-popcon){\n            right:0;\n            top:100%;\n            transform:translate(0,10px) scale(0);\n            transform-origin: right top;\n        }\n        :host([dir="bottomright"]) ::slotted(xy-popcon[open]),\n        :host([dir="bottomright"][trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([dir="bottomright"][trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            transform:translate(0,10px) scale(1);\n        }\n        :host([trigger="contextmenu"]) ::slotted(xy-popcon){\n            right:auto;\n            bottom:auto;\n            left:var(--x,0);\n            top:var(--y,100%);\n            transform-origin: left top;\n            transform:translate(5px,5px) scale(0);\n            transition: .15s;\n        }\n        :host([trigger="contextmenu"]) ::slotted(xy-popcon[open]){\n            transform:translate(5px,5px) scale(1);\n        }\n        :host ::slotted(xy-popcon[open]),\n        :host([trigger="hover"]:not([disabled]):hover) ::slotted(xy-popcon),\n        :host([trigger="focus"]:not([disabled]):focus-within) ::slotted(xy-popcon){\n            opacity:1;\n            visibility:visible;\n        }\n        slot{\n            border-radius: inherit;\n        }\n        </style>\n        <slot></slot>\n        ';
          }
          get title() {
            return this.getAttribute("title") || "popcon";
          }
          get trigger() {
            return this.getAttribute("trigger");
          }
          get disabled() {
            return null !== this.getAttribute("disabled");
          }
          get type() {
            return this.getAttribute("type");
          }
          get accomplish() {
            return null !== this.getAttribute("accomplish");
          }
          get content() {
            return this.getAttribute("content");
          }
          get oktext() {
            return this.getAttribute("oktext");
          }
          get canceltext() {
            return this.getAttribute("canceltext");
          }
          get dir() {
            return this.getAttribute("dir");
          }
          get loading() {
            return null !== this.getAttribute("loading");
          }
          set dir(t3) {
            this.setAttribute("dir", t3);
          }
          set title(t3) {
            this.setAttribute("title", t3);
          }
          set type(t3) {
            this.setAttribute("type", t3);
          }
          set oktext(t3) {
            this.setAttribute("oktext", t3);
          }
          set canceltext(t3) {
            this.setAttribute("canceltext", t3);
          }
          set loading(t3) {
            null === t3 || false === t3 ? this.removeAttribute("loading") : this.setAttribute("loading", "");
          }
          set disabled(t3) {
            null === t3 || false === t3 ? this.removeAttribute("disabled") : this.setAttribute("disabled", "");
          }
          show(t3) {
            if (this.popcon = this.querySelector("xy-popcon"), this.disabled) (this.popcon || this).dispatchEvent(new CustomEvent("submit"));
            else if (this.popcon || (this.popcon = new s(this.type), this.popcon.type = this.type, this.appendChild(this.popcon), this.popcon.title = this.title || "popover", this.popcon.innerHTML = this.content || "", "confirm" == this.type && (this.popcon.oktext = this.oktext || "confirm", this.popcon.canceltext = this.canceltext || "cancel", this.popcon.onsubmit = () => this.dispatchEvent(new CustomEvent("submit")), this.popcon.oncancel = () => this.dispatchEvent(new CustomEvent("cancel")))), "contextmenu" === this.trigger) {
              const { x: e3, y: n3 } = this.getBoundingClientRect();
              this.popcon.style.setProperty("--x", t3.clientX - e3 + "px"), this.popcon.style.setProperty("--y", t3.clientY - n3 + "px"), this.popcon.open = true;
            } else (t3.path || t3.composedPath && t3.composedPath()).includes(this.popcon) || (window.xyActiveElement = document.activeElement, this.accomplish ? this.popcon.open = true : this.popcon.open = !this.popcon.open);
            return this.popcon;
          }
          connectedCallback() {
            this.popcon = this.querySelector("xy-popcon"), this.trigger && "click" !== this.trigger || this.addEventListener("click", this.show), "contextmenu" === this.trigger && this.addEventListener("contextmenu", ((t3) => {
              t3.preventDefault(), (t3.path || t3.composedPath && t3.composedPath()).includes(this.popcon) || this.show(t3);
            })), document.addEventListener("mousedown", ((t3) => {
              const e3 = t3.path || t3.composedPath && t3.composedPath();
              (this.popcon && !e3.includes(this.popcon) && !this.popcon.loading && !e3.includes(this.children[0]) || "contextmenu" === this.trigger && !e3.includes(this.popcon) && "1" == t3.which) && (this.popcon.open = false);
            }));
          }
          attributeChangedCallback(t3, e3, n3) {
            "loading" == t3 && this.popcon && (this.popcon.loading = null !== n3), "title" == t3 && this.popcon && null !== n3 && (this.popcon.title = n3), "oktext" == t3 && this.popcon && null !== n3 && (this.popcon.oktext = n3), "canceltext" == t3 && this.popcon && null !== n3 && (this.popcon.canceltext = n3);
          }
        }
        customElements.get("xy-popover") || customElements.define("xy-popover", r);
        var l = n2(697);
        const a = ["#ff1300", "#EC7878", "#9C27B0", "#673AB7", "#3F51B5", "#0070FF", "#03A9F4", "#00BCD4", "#4CAF50", "#8BC34A", "#CDDC39", "#FFE500", "#FFBF00", "#FF9800", "#795548", "#9E9E9E", "#5A5A5A", "#FFF"];
        class c extends HTMLElement {
          static get observedAttributes() {
            return ["disabled", "dir"];
          }
          constructor(t3) {
            super();
            const e3 = this.attachShadow({ mode: "open" });
            this.colorCollections = t3.colorCollections || a, this.onColorPicked = t3.onColorPicked, this.defaulColor = (0, l.handleCSSVariables)(t3.defaultColor || this.colorCollections[0]), this.pluginType = t3.type, this.hasCustomPicker = t3.hasCustomPicker, this.customColor = (0, l.getCustomColorCache)(this.pluginType), e3.innerHTML = `
        <style>
        :host{
            display:inline-block;
            width:15px;
            font-size:14px;
            border: none;
        }
        :host([block]){
            display:block;
        }
        :host([disabled]){
            pointer-events:none;
        }
        
        :host(:focus-within) xy-popover,:host(:hover) xy-popover{ 
            z-index: 2;
        }
        input[type="color"]{
            -webkit-appearance: none;
            outline: none;
            border: none;
        }
        xy-popover{
            width: 12px;
            height:35px;
            padding-right: 1px;
        }
        xy-popover:hover {
            border-radius: 0 5px 5px 0;
            background: rgba(203, 203, 203, 0.49);
        }
        .color-btn {
            border: 1px solid #cab9b9;
            margin: 18px 3px 2px 3px;
            width: 7px;
            height: 7px;
            opacity: 0.9;
            padding: 1px 0 1px 0;
            color: var(--themeColor, #42b983);
            background: var(--themeColor, #42b983);
            font-weight: bolder;
            border-radius: 2px;
        }
        .color-btn:hover {
            opacity: 1;
            z-index: auto;
        }
        xy-popover{
            display:block;
        }
        xy-popcon{
            position: fixed;
            min-width:100%;
        }
        #custom-picker {
            position: relative;
            top: -1px;
            background-color: rgb(250, 250, 250);
            border-color: rgb(255 118 21) rgb(245 80 80 / 74%) #89c1c9 #95d5b6;
            border-width: 3px;
            border-radius: 8px;
            height: 18px;
        }
        .pop-footer{
            display:flex;
            justify-content:flex-end;
            padding:0 .8em .8em;
        }
        .pop-footer xy-button{
            font-size: .8em;
            margin-left: .8em;
        }
        .color-btn::before{
            content:'';
            position:absolute;
            left:5px;
            top:5px;
            right:5px;
            bottom:5px;
            z-index:-1;
            background: linear-gradient(45deg, #ddd 25%,transparent 0,transparent 75%,#ddd 0 ), linear-gradient(45deg, #ddd 25%, transparent 0, transparent 75%, #ddd 0);
            background-position: 0 0,5px 5px;
            background-size: 10px 10px;
        }
        .color-sign {
           max-width: 220px;
           padding: 10px;
           display:grid;
           cursor: default;
           grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
           grid-gap: 10px;     
        }
        .color-sign>button {
            position: relative;
            width: 16px;
            height: 16px;
            border-radius: 6px;
            border: 1px solid #b8b9b49e;
            outline: 0;
            opacity: 0.9;
        }
        .color-sign>button:hover {
            cursor: pointer;
            opacity: 1;
        }
        .color-section {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .color-fire-btn {
            font-size: 17px;
            font-weight: bold;
            height: 28px;
            padding-top: 8px;
            padding-right: 1px;
            margin-left: 3px;
            padding-left: 3px;
            border-radius: 5px 0 0 5px;
        }
        .color-fire-btn:hover {
            font-size: 17px;
            font-weight: bold;
            background: rgba(203, 203, 203, 0.49);
            border-radius: 5px 0 0 5px;
        }
        </style>
        <section class="color-section">
            <xy-popover id="popover" ${this.dir ? "dir='" + this.dir + "'" : ""}>
                <xy-button class="color-btn" id="color-btn" ${this.disabled ? "disabled" : ""}>_</xy-button>
                <xy-popcon id="popcon">
                    <div class="color-sign" id="colors">
                        ${this.hasCustomPicker ? '<button id="custom-picker" class="rainbow-mask"/>' : ""}
                        ${this.colorCollections.map(((t4) => '<button class="color-cube" style="background-color:' + t4 + '" data-color=' + t4 + "></button>")).join("")}
                    </div>
                </xy-popcon>
            </xy-popover>
        </section>`;
          }
          focus() {
            this.colorBtn.focus();
          }
          connectedCallback() {
            this.popoverEle = this.shadowRoot.getElementById("popover"), this.popcon = this.shadowRoot.getElementById("popcon"), this.colorBtn = this.shadowRoot.getElementById("color-btn"), this.colors = this.shadowRoot.getElementById("colors"), this.colors.addEventListener("click", ((t3) => {
              const e3 = t3.target.closest("button");
              e3 && "custom-picker" !== e3.id && (this.nativeclick = true, this.value = (0, l.handleCSSVariables)(e3.dataset.color), this.onColorPicked(this.value));
            })), this.popoverEle.addEventListener("click", (() => this.closeConverter())), this.hasCustomPicker && this.setupCustomPicker(), this.value = this.defaultvalue;
          }
          closeConverter() {
            if (document.getElementsByClassName(l.CONVERTER_PANEL)[0]) {
              const t3 = document.getElementsByClassName(l.CONVERTER_BTN)[0];
              t3?.click();
            }
          }
          disconnectedCallback() {
            this.pickerInput && document.body.removeChild(this.pickerInput);
          }
          setupCustomPicker() {
            let t3 = false;
            this.customPicker = this.shadowRoot.getElementById("custom-picker");
            const e3 = this.customPicker;
            e3.style.backgroundColor = this.customColor, this.customPicker.addEventListener("click", ((n3) => {
              if (t3) return void (t3 = false);
              this.pickerInput && document.body.removeChild(this.pickerInput), this.pickerInput = document.createElement("input");
              const o2 = this.pickerInput, i2 = this.popcon.getBoundingClientRect();
              o2.setAttribute("type", "color"), o2.value = this.customColor, o2.style.position = "fixed", o2.style.left = `${i2.x + 3}px`, o2.style.top = `${i2.y + 10}px`, o2.style.pointerEvents = "none", o2.style.zIndex = "999", o2.style.opacity = "0", o2.addEventListener("input", (0, l.throttle)(((n4) => {
                this.nativeclick = true, this.value = (0, l.handleCSSVariables)(n4.target.value), this.onColorPicked(this.value), (0, l.setCustomColorCache)(this.value, this.pluginType), e3.style.backgroundColor = this.value, t3 = true, e3.click();
              }), 30)), document.body.appendChild(o2), setTimeout((() => {
                o2.focus(), o2.click();
              }), 0);
            }));
          }
          get defaultvalue() {
            return this.defaulColor;
          }
          get value() {
            return this.$value;
          }
          get type() {
            return this.getAttribute("type");
          }
          get disabled() {
            return null !== this.getAttribute("disabled");
          }
          get dir() {
            return this.getAttribute("dir");
          }
          set dir(t3) {
            this.setAttribute("dir", t3);
          }
          set disabled(t3) {
            null === t3 || false === t3 ? this.removeAttribute("disabled") : this.setAttribute("disabled", "");
          }
          set defaultvalue(t3) {
            this.setAttribute("defaultvalue", t3);
          }
          set value(t3) {
            t3 && (this.$value = t3, this.colorBtn.style.setProperty("--themeColor", this.nativeclick ? (0, l.setDefaultColorCache)(t3, this.pluginType) : (0, l.getDefaultColorCache)(t3, this.pluginType)), this.nativeclick ? (this.nativeclick = false, this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value } }))) : this.colorPane ? this.colorPane.value = this.value : this.defaultvalue = this.value);
          }
          attributeChangedCallback(t3, e3, n3) {
            "disabled" == t3 && this.colorBtn && (null != n3 ? this.colorBtn.setAttribute("disabled", "disabled") : this.colorBtn.removeAttribute("disabled")), "dir" == t3 && this.popoverEle && null != n3 && (this.popoverEle.dir = n3);
          }
        }
        customElements.get("xy-color-picker") || customElements.define("xy-color-picker", c);
      }, 697: (t2, e2, n2) => {
        "use strict";
        n2.r(e2), n2.d(e2, { CONVERTER_BTN: () => p, CONVERTER_PANEL: () => d, getCustomColorCache: () => c, getDefaultColorCache: () => l, handleCSSVariables: () => i, setCustomColorCache: () => a, setDefaultColorCache: () => r, throttle: () => s });
        const o = "editor-js-text-color-cache";
        function i(t3) {
          if ((function(t4) {
            return ("string" == typeof (e3 = t4) || e3 instanceof String) && t4.includes("--");
            var e3;
          })(t3)) {
            const e3 = (function(t4) {
              const e4 = /\((.*?)\)/.exec(t4);
              if (e4) return e4[1];
            })(t3);
            return (function(t4) {
              return window.getComputedStyle(document.documentElement).getPropertyValue(t4);
            })(e3);
          }
          return t3;
        }
        function s(t3, e3) {
          let n3;
          return (...o2) => {
            n3 || (n3 = setTimeout((() => {
              t3(...o2), n3 = null;
            }), e3));
          };
        }
        function r(t3, e3) {
          return sessionStorage.setItem(`${o}-${e3}`, JSON.stringify(t3)), t3;
        }
        function l(t3, e3) {
          const n3 = sessionStorage.getItem(`${o}-${e3}`);
          return n3 ? JSON.parse(n3) : t3;
        }
        function a(t3, e3) {
          sessionStorage.setItem(`${o}-${e3}-custom`, JSON.stringify(t3));
        }
        function c(t3) {
          const e3 = sessionStorage.getItem(`${o}-${t3}-custom`);
          return e3 ? JSON.parse(e3) : null;
        }
        const p = "ce-inline-toolbar__dropdown", d = "ce-conversion-toolbar--showed";
      } }, e = {};
      function n(o) {
        var i = e[o];
        if (void 0 !== i) return i.exports;
        var s = e[o] = { id: o, exports: {} };
        return t[o](s, s.exports, n), s.exports;
      }
      return n.d = (t2, e2) => {
        for (var o in e2) n.o(e2, o) && !n.o(t2, o) && Object.defineProperty(t2, o, { enumerable: true, get: e2[o] });
      }, n.o = (t2, e2) => Object.prototype.hasOwnProperty.call(t2, e2), n.r = (t2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
      }, n.nc = void 0, n(138);
    })()));
  }
});
export default require_bundle();
//# sourceMappingURL=editorjs-text-color-plugin.js.map

var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_app2 = __commonJS({
  "assets/app2.js"(exports, module) {
    function toElement(selector2) {
      if (typeof selector2 == "string") {
        return document.querySelector(selector2);
      } else if (selector2 instanceof HTMLElement) {
        return selector2;
      } else if (selector2 instanceof Array && selector2[0] instanceof HTMLElement) {
        return selector2[0];
      } else if (selector2 instanceof HTMLCollection) {
        return selector2[0];
      } else if (selector2 instanceof NodeList) {
        return selector2[0];
      } else if (selector2 === window) {
        return window;
      } else {
        console.error("O que é isso? ", selector2);
      }
    }
    let watchList = [];
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const obj = watchList.find((item) => item.el == entry.target);
        if (obj.cb) {
          obj.cb(entry.isIntersecting, obj.el);
        } else {
          if (entry.isIntersecting) {
            if (obj.wasPlaying) {
              obj.el.play();
            }
          } else {
            if (!obj.el.paused) {
              obj.wasPlaying = true;
              obj.el.pause();
            } else {
              obj.wasPlaying = false;
            }
          }
        }
      });
    });
    document.addEventListener("pjax:send", () => {
      observer.disconnect();
      watchList = [];
    });
    function autoPause(element, callback) {
      let el = toElement(element);
      watchList.push({
        el,
        cb: callback,
        wasPlaying: false
      });
      observer.observe(el);
    }
    const defaultConfig = {
      rootMargin: "0px",
      threshold: 0,
      load: function load(a) {
        if ("picture" === a.nodeName.toLowerCase()) {
          let src = a.querySelector("source").getAttribute("srcset");
          let image = new Image();
          image.src = src;
          a.append(image);
          image.onload = function () {
            markAsLoaded(a);
          };
        }
        "iframe" === a.nodeName.toLowerCase() && a.getAttribute("data-src") && (a.setAttribute("src", a.getAttribute("data-src")), a.setAttribute("data-loaded", "true"));
        if ("video" === a.nodeName.toLowerCase() && !a.getAttribute("data-src") && a.children) {
          a.setAttribute("poster", a.getAttribute("data-poster"));
          b = a.children;
          for (var d, c = 0; c <= b.length - 1; c++)
            if (d = b[c].getAttribute("data-src")) b[c].src = d;
          a.load();
        }
        a.getAttribute("data-src") && (a.src = a.getAttribute("data-src"));
        a.getAttribute("data-srcset") && a.setAttribute("srcset", a.getAttribute("data-srcset"));
        a.getAttribute("data-background-image") && (a.style.backgroundImage = "url('" + a.getAttribute("data-background-image") + "')");
        a.getAttribute("data-toggle-class") && a.classList.toggle(a.getAttribute("data-toggle-class"));
      },
      loaded: function loaded(e) {
        e.onload = (e2) => {
          markAsLoaded(e2.target);
        };
      }
    };
    function markAsLoaded(element) {
      element.setAttribute("data-loaded", true);
      element.parentElement.setAttribute("data-loaded", true);
    }
    const isLoaded = function (element) {
      return element.getAttribute("data-loaded") === "true";
    };
    const onIntersection = function onIntersection2(load, loaded) {
      return function (entries, observer2) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0 || entry.isIntersecting) {
            observer2.unobserve(entry.target);
            if (!isLoaded(entry.target)) {
              load(entry.target);
              loaded(entry.target);
            }
          }
        });
      };
    };
    const getElements = function getElements2(selector2) {
      var root = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document;
      if (selector2 instanceof Element) {
        return [selector2];
      }
      if (selector2 instanceof NodeList) {
        return selector2;
      }
      return root.querySelectorAll(selector2);
    };
    function lozad(selector2 = ".lozad", options = {}) {
      var selector2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ".lozad";
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var _Object$assign = Object.assign({}, defaultConfig, options), root = _Object$assign.root, rootMargin = _Object$assign.rootMargin, threshold = _Object$assign.threshold, load = _Object$assign.load, loaded = _Object$assign.loaded;
      var observer2 = void 0;
      if (typeof window !== "undefined" && window.IntersectionObserver) {
        observer2 = new IntersectionObserver(onIntersection(load, loaded), {
          root,
          rootMargin,
          threshold
        });
      }
      return {
        observe: function observe() {
          var elements = getElements(selector2, root);
          for (var i = 0; i < elements.length; i++) {
            if (isLoaded(elements[i])) {
              continue;
            }
            if (observer2) {
              observer2.observe(elements[i]);
              continue;
            }
            load(elements[i]);
            markAsLoaded(elements[i]);
            loaded(elements[i]);
          }
        },
        triggerLoad: function triggerLoad(element) {
          if (isLoaded(element)) {
            return;
          }
          load(element);
          markAsLoaded(element);
          loaded(element);
        },
        observer: observer2
      };
    }
    function observers() {
      var pictureObserver = lozad("[data-lazy]", {
        threshold: 0.01,
        rootMargin: "1000px 0px"
      });
      pictureObserver.observe();
      var lazyVideoObserver = lozad("[data-lazy-video]:not(.js-video-running)", {
        threshold: 0.01,
        rootMargin: "1000px 1000px",
        loaded: function (el) {
          el.classList.add("js-video-running");
          if (el.hasAttribute("data-autoplay")) {
            el.play();
            autoPause(el, (intersecting, el2) => {
              if (intersecting) {
                let promise = el2.play();
                if (promise !== void 0) {
                  promise.then((_) => {
                  }).catch((error) => {
                    if (screen.isIphone) {
                      document.body.addEventListener("touchstart", function () {
                        const videosOnScreen = document.querySelectorAll("video[data-autoplay],video[data-autopause],video[autoplay]");
                        videosOnScreen.forEach((element) => {
                          if (element.playing);
                          else {
                            element.play();
                            let promise2 = element.play();
                            if (promise2 !== void 0) {
                              promise2.then((_) => {
                              }).catch((error2) => {
                                element.play();
                              });
                            }
                          }
                        });
                      }, {
                        once: true
                      });
                    }
                  });
                }
              } else {
                el2.pause();
              }
            });
          }
        }
      });
      lazyVideoObserver.observe();
      let video = document.querySelectorAll("video[data-play-pause]");
      let videoObserver = new IntersectionObserver(function (entries, videoObserver2) {
        entries.forEach(function (entry, key) {
          if (entry.intersectionRatio == 0 && !entry.target.paused) {
            entry.target.pause();
            this["isPaused" + key] = true;
          } else if (this["isPaused" + key] == true || entry.target.hasAttribute("autoplay")) {
            entry.target.play();
            this["isPaused" + key] = false;
          }
        });
      }, {
        threshold: 0
      });
      video.forEach(function (video2) {
        videoObserver.observe(video2);
      });
      let play = document.querySelectorAll("[data-play-toggle]");
      let playObserver = new IntersectionObserver(function (entries, playObserver2) {
        entries.forEach(function (entry) {
          let slide = entry.target.querySelector(".swiper-container").swiper;
          if (entry.intersectionRatio > 0) {
            slide.autoplay.start();
          } else {
            slide.autoplay.stop();
          }
        });
      }, {
        threshold: 0,
        rootMargin: "0px"
      });
      play.forEach(function (play2) {
        playObserver.observe(play2);
      });
    }
    (function () {
      const AddActive = function (options) {
        const addactive = active.bind(this);
        addactive(true, options);
      };
      const RemoveActive = function (options) {
        const removeactive = active.bind(this);
        removeactive(false, options);
      };
      const active = function (active2 = true, options) {
        const {
          delay: delay2 = -1,
          leave = true,
          leaveDelay = 600
        } = options ? options : {};
        if (active2) {
          this.futureActiveState = true;
          if (delay2 < 0) {
            this.classList.remove("leave");
            this.classList.add("active");
          } else {
            setTimeout(() => {
              if (this.futureActiveState) {
                this.classList.remove("leave");
                this.classList.add("active");
              }
            }, delay2);
          }
        } else {
          this.futureActiveState = false;
          let remove = removeActive.bind(this);
          if (delay2 < 0) {
            remove();
          } else {
            setTimeout(() => {
              if (this.futureActiveState === false) {
                remove();
              }
            }, delay2);
          }
        }
        function removeActive() {
          if (this.classList.contains("active")) {
            this.classList.remove("active");
            if (leave) {
              this.classList.add("leave");
              setTimeout(() => {
                this.classList.remove("leave");
              }, leaveDelay);
            }
          }
        }
      };
      HTMLElement.prototype.addActive = AddActive;
      HTMLElement.prototype.removeActive = RemoveActive;
    })();
    function parseAnimation(strAr) {
      let animation = "", duration = ".8s", timingFunction = "ease-in-out", delay2 = "", iteration = "", fill = "both";
      for (let i = 0; i < strAr.length; i++) {
        const str = strAr[i];
        const n = Number.parseFloat(str);
        if (i == 0) {
          animation = str;
          continue;
        }
        if (i == 1) {
          if (!isNaN(n)) {
            duration = str;
          } else if (isEase(str)) {
            timingFunction = timingDict[str];
          } else if (str === "infinite") {
            delay2 = "0s";
            iteration = str;
          }
          continue;
        }
        if (i == 2) {
          if (!isNaN(n)) {
            delay2 = str;
          } else if (str == "-") {
            delay2 = "0s";
          } else if (isEase(str)) {
            timingFunction = timingDict[str];
          } else if (str === "infinite") {
            delay2 = "0s";
            iteration = str;
          }
          continue;
        }
        if (i == 3) {
          if (!isNaN(n) && !delay2) {
            delay2 = str;
          } else if (!isNaN(n) && delay2) {
            iteration = str;
          } else if (str == "-") {
            delay2 = "0s";
          } else if (isEase(str)) {
            timingFunction = timingDict[str];
          } else if (str === "infinite") {
            delay2 = "0s";
            iteration = str;
          }
          continue;
        }
        if (i == 4) {
          if (!isNaN(str)) {
            iteration = str;
          } else if (str === "infinite") {
            iteration = str;
          }
        }
      }
      let result = `${animation} ${duration} ${timingFunction}`;
      if (delay2) result += " " + delay2;
      if (iteration) result += " " + iteration;
      result += " " + fill;
      return result;
    }
    function isEase(str) {
      if (timingDict[str]) {
        return true;
      } else {
        return false;
      }
    }
    const timingDict = {
      "ease": "ease",
      "linear": "linear",
      "ease-in": "ease-in",
      "ease-out": "ease-out",
      "ease-in-out": "ease-in-out",
      "ease-in-quad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      "ease-in-cubic": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
      "ease-in-quart": "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
      "ease-in-quint": "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
      "ease-in-sine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
      "ease-in-expo": "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
      "ease-in-circ": "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
      "ease-in-back": "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
      "ease-out-quad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
      "ease-out-cubic": "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      "ease-out-quart": "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
      "ease-out-quint": "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
      "ease-out-sine": "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
      "ease-out-expo": "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
      "ease-out-circ": "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
      "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
      "ease-in-out-quad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
      "ease-in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
      "ease-in-out-quart": "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
      "ease-in-out-quint": "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
      "ease-in-out-sine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
      "ease-in-out-expo": "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
      "ease-in-out-circ": "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
      "ease-in-out-back": "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
    };
    function tokenizer(input) {
      const regTokens = /([^,\s].[^,]*)/g;
      const regKey = /.+?(?=:)/;
      const regValues = /(?!.+?:)[^:\s]\S+|-|\d+/g;
      const result = [];
      const tokens2 = input.match(regTokens);
      if (!tokens2) return null;
      tokens2.forEach((t) => {
        const key = t.match(regKey);
        const values = t.match(regValues);
        result.push({ key: key ? key[0] : null, values });
      });
      return result;
    }
    let watched = [];
    let screenSize = "";
    const getsize = function () {
      const iw = window.innerWidth;
      if (iw < 768) screenSize = "phone";
      if (iw >= 768 && iw <= 1200) screenSize = "tablet";
      if (iw > 1200) screenSize = "desktop";
    };
    getsize();
    window.addEventListener("resize", getsize);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const defs = watched.filter((t) => t.trigger === entry.target);
        const vis = entry.isIntersecting;
        const scrollingDown = entry.boundingClientRect.top < 0;
        defs.forEach((def) => {
          if (!def.el.isConnected || vis && !def.isConnected) {
            def.isConnected = def.el.isConnected;
            return;
          }
          if (vis && !def.animated || vis && def.loop[screenSize]) {
            let animate2 = function () {
              def.animated = true;
              def.el.classList.add("aos-animate");
              if (def[screenSize]) {
                def.el.style.animation = def[screenSize];
                def.el.classList.add(def[screenSize].match(/^\S+/)[0]);
              }
            };
            var animate = animate2;
            let delay2 = 0;
            if (screenSize == "phone" && def.el.dataset.delayPhone) {
              delay2 = def.el.dataset.delayPhone;
            } else if (screenSize == "tablet" && def.el.dataset.delayTablet) {
              delay2 = def.el.dataset.delayTablet;
            } else if (screenSize == "desktop" && def.el.dataset.delayDesktop) {
              delay2 = def.el.dataset.delayDesktop;
            } else if (def.el.dataset.delay) {
              delay2 = def.el.dataset.delay;
            }
            if (delay2 > 0) {
              setTimeout(() => {
                animate2();
              }, delay2);
            } else {
              animate2();
            }
          }
          if (!vis && def.loop[screenSize] && !scrollingDown) {
            if (def[screenSize]) {
              def.el.style.animation = "";
              const elclass = def[screenSize].match(/^\S+/);
              if (elclass) def.el.classList.remove(elclass[0]);
            }
            def.el.classList.remove("aos-animate");
          }
        });
      });
    });
    const obsAttrbutes = new MutationObserver(() => {
      updateWatched();
    });
    const updateWatched = function () {
      watched = [];
      obs.disconnect();
      obsAttrbutes.disconnect();
      const els = document.querySelectorAll("[data-aos]");
      els.forEach((el) => {
        createAosParams(el);
      });
    };
    function createAosParams(el) {
      const aosdef = {
        el,
        isConnected: el.isConnected,
        trigger: el,
        loop: {
          desktop: false,
          tablet: false,
          phone: false
        },
        animated: false,
        desktop: null,
        tablet: null,
        phone: null
      };
      const tokens2 = tokenizer(el.dataset.aos);
      if (tokens2) {
        tokens2.forEach((t) => {
          if (t.key === "trigger") {
            let trigger2 = el.closest(t.values[0]);
            if (!trigger2) {
              trigger2 = document.querySelector(t.values[0]);
            }
            aosdef.trigger = trigger2;
            return;
          }
          if (t.values[0] === "loop") {
            if (!t.key) {
              aosdef.loop.desktop = true;
              aosdef.loop.tablet = true;
              aosdef.loop.phone = true;
            } else {
              if (t.key.includes("d")) aosdef.loop.desktop = true;
              if (t.key.includes("t")) aosdef.loop.tablet = true;
              if (t.key.includes("p")) aosdef.loop.phone = true;
            }
            return;
          }
          const v = parseAnimation(t.values);
          if (!t.key) {
            aosdef.desktop = v;
            aosdef.tablet = v;
            aosdef.phone = v;
            return;
          }
          if (t.key.includes("d")) aosdef.desktop = v;
          if (t.key.includes("t")) aosdef.tablet = v;
          if (t.key.includes("p")) aosdef.phone = v;
        });
      }
      obs.observe(aosdef.trigger);
      obsAttrbutes.observe(aosdef.el, { attributeFilter: ["data-aos"] });
      watched.push(aosdef);
    }
    function toElementArray(selector2) {
      if (typeof selector2 == "string") {
        return Array.from(document.querySelectorAll(selector2));
      } else if (selector2 instanceof Array) {
        return selector2;
      } else if (selector2 instanceof HTMLCollection || selector2 instanceof NodeList) {
        return Array.from(selector2);
      } else if (selector2 instanceof HTMLElement) {
        return [selector2];
      } else {
        console.error("O que é isso? ", selector2);
      }
    }
    function onClickOutside(internalAreas, callback, options) {
      const {
        autoStop = true,
        autoStart = true,
        once = false
      } = options ? options : {};
      const obj = {
        areas: toElementArray(internalAreas),
        clickInside: false,
        cb: callback,
        autoStop,
        once,
        in: (ev) => {
          obj.clickInside = true;
        },
        out: (ev) => {
          if (!obj.clickInside) {
            obj.cb(ev);
            if (obj.autoStop) obj.stop();
            if (obj.once) obj.destroy();
          }
          obj.clickInside = false;
        },
        start() {
          setTimeout(() => {
            this.areas.forEach((el) => el.addEventListener("click", this.in));
            document.addEventListener("click", this.out);
          }, 0);
        },
        stop() {
          this.areas.forEach((el) => el.removeEventListener("click", this.in));
          document.removeEventListener("click", this.out);
        },
        destroy() {
          this.stop();
          this.areas = null;
          this.cb = null;
        }
      };
      if (autoStart) obj.start();
      return obj;
    }
    class ModalGroup extends HTMLElement {
      constructor() {
        super();
        this.visible = false;
        this.leaveTime = 650;
      }
      connectedCallback() {
        const areas = this.querySelectorAll("[data-modal-area]");
        if (areas.length > 0) {
          this.hideOnClickOutside = onClickOutside(areas, this.close.bind(this), { autoStart: false });
        } else {
          this.hideOnClickOutside = null;
        }
      }
      disconnectedCallback() {
        if (this.hideOnClickOutside) this.hideOnClickOutside.stop();
      }
      static get observedAttributes() {
        return ["name", "active", "leave"];
      }
      attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
          case "active":
            queueMicrotask(() => {
              if (newValue === null) {
                this.close();
              } else {
                this.open(newValue);
              }
            });
            break;
          case "name":
            this.name = newValue;
            break;
          case "leave":
            this.leaveTime = Number.parseInt(newValue);
            break;
        }
      }
      handleEvent(ev) {
        if (ev.type === "keydown") {
          if (ev.key === "Escape") this.close();
        }
      }
      open(name) {
        const children = Array.from(this.querySelectorAll("modal-item"));
        const item = name ? children.find((c) => c.name == name) : children[0];
        this.bodyState("active", item.name);
        children.forEach((c) => c.close(0));
        this.addActive();
        item.open();
        this.dispatchEvent(new CustomEvent("modal:open", { detail: { item } }));
        document.dispatchEvent(new CustomEvent("modal:open", { detail: { item } }));
        if (this.hideOnClickOutside) this.hideOnClickOutside.start();
        document.addEventListener("keydown", this);
      }
      next() {
        const children = Array.from(this.querySelectorAll("modal-item"));
        const idx = children.indexOf(children.find((c) => c.visible));
        if (idx < children.length - 1) {
          children[idx].close();
          children[idx + 1].open();
        } else {
          children[idx].close();
          children[0].open();
        }
      }
      prev() {
        const children = Array.from(this.querySelectorAll("modal-item"));
        const idx = children.indexOf(children.find((c) => c.visible));
        if (idx > 0) {
          children[idx].close();
          children[idx - 1].open();
        } else {
          children[idx].close();
          children[children.length - 1].open();
        }
      }
      close() {
        const delay2 = this.leaveTime || 0;
        const children = Array.from(this.querySelectorAll("modal-item"));
        children.forEach((c) => {
          c.close(delay2);
        });
        this.removeActive({ leaveDelay: delay2 });
        if (delay2 > 0) this.bodyState("leave");
        setTimeout(() => {
          this.bodyState(null, null);
          this.dispatchEvent(new CustomEvent("modal:close"));
          document.dispatchEvent(new CustomEvent("modal:close"));
        }, delay2);
        if (this.hideOnClickOutside) this.hideOnClickOutside.stop();
        document.removeEventListener("keydown", this);
      }
      bodyState(state, item) {
        const ds = document.body.dataset;
        state ? ds.modalState = state : delete ds.modalState;
        item ? ds.modalItem = item : delete ds.modalItem;
        if (!state && !item) {
          delete ds.modal;
        } else {
          ds.modal = this.name;
        }
      }
    }
    function templateIframe(dataset) {
      const template = document.createElement("template");
      template.innerHTML = `
    <modal-group name="iframe" active>
      <modal-container>
        <modal-item>
        <div class="modal-container-iframe">
        <div class="modal-iframe" data-modal-area>
          <iframe src="${dataset.href} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
          
        <btn-modal-close></btn-modal-close>
        </modal-item>
      </modal-container>
      </modal-group>
      `;
      const modal = template.content;
      modal.firstElementChild.addEventListener("modal:close", function () {
        this.remove();
      }, {
        once: true
      });
      document.body.appendChild(modal);
    }
    function templateImage(dataset) {
      const template = document.createElement("template");
      let ext = dataset.href;
      ext = ext.substr(ext.lastIndexOf(".") + 1);
      let media;
      if (["mp4", "webm"].includes(ext)) {
        media = `<video src="${dataset.href}" autoplay playsInline muted loop data-modal-area ></video>`;
      } else {
        media = `<img src="${dataset.href}" data-modal-area />`;
      }
      template.innerHTML = `
    <modal-group name="image" active data-cursor-style="default">
      <modal-container>
        <modal-item>
          <div class="modal-container-image">
            <div class="modal-image">

          
            ${media}

            
              
            </div>
          </div>
        </modal-item>
      </modal-container>
      </modal-group>`;
      const modal = template.content;
      modal.firstElementChild.addEventListener("modal:close", function () {
        this.remove();
      }, { once: true });
      document.body.appendChild(modal);
    }
    function templateVideo(dataset) {
      const template = document.createElement("template");
      template.innerHTML = `
    <modal-group name="video" active>
      <modal-container>
        <modal-item>
          <div class="modal-container-video">
            <div class="modal-video" data-modal-area>
            <video autoplay loop controls src="${dataset.href}" />
              
            </div>
          </div>
        </modal-item>
      </modal-container>
      </modal-group>`;
      const modal = template.content;
      modal.firstElementChild.addEventListener("modal:close", function () {
        this.remove();
      }, { once: true });
      document.body.appendChild(modal);
    }
    const modalLocalName = "modal-group";
    class ModalItem extends HTMLElement {
      constructor() {
        super();
        this.visible = false;
        this.isOpening = false;
      }
      connectedCallback() {
        this.modal = this.closest(modalLocalName);
      }
      disconnectedCallback() {
      }
      open() {
        if (this.visible) return;
        this.visible = true;
        this.addActive();
      }
      close(timeout) {
        if (!this.visible) return;
        this.visible = false;
        this.removeActive({
          leave: timeout > 0 ? true : false,
          leaveDelay: timeout
        });
      }
      static get observedAttributes() {
        return ["name", "hash"];
      }
      attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
      }
    }
    class ModalButton extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        this.modal = this.closest(modalLocalName);
        this.addEventListener("click", this.action);
      }
      disconnectedCallback() {
        this.removeEventListener("click", this.action);
      }
      attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
      }
    }
    class ModalNext extends ModalButton {
      action() {
        this.modal.next();
        if (this.isOpening) return;
        this.isOpening = true;
        setTimeout(() => {
          this.isOpening = false;
        }, 1e3);
      }
    }
    class ModalPrevious extends ModalButton {
      action() {
        this.modal.prev();
        if (this.isOpening) return;
        this.isOpening = true;
        setTimeout(() => {
          this.isOpening = false;
        }, 1e3);
      }
    }
    class ModalClose extends ModalButton {
      action() {
        this.modal.close();
      }
    }
    class ModalOpen extends ModalButton {
      action(event) {
        const template = this.template;
        if (event.target.closest("a")) {
          return;
        }
        if (this.isOpening) return;
        this.isOpening = true;
        if (template) {
          if (template === "iframe") templateIframe(this.dataset);
          if (template === "image") templateImage(this.dataset);
          if (template === "video") templateVideo(this.dataset);
        } else {
          const selector2 = `${modalLocalName}[name=${this.group}]`;
          const modal = document.querySelector(selector2);
          if (!modal) {
            console.warn("não existe modal: " + selector2);
            this.isOpening = false;
            return;
          }
          modal.open(this.item);
        }
        setTimeout(() => {
          this.isOpening = false;
        }, 1e3);
      }
      static get observedAttributes() {
        return ["group", "item", "template"];
      }
      connectedCallback() {
        this.addEventListener("click", this.action);
      }
    }
    window.customElements.define("modal-group", ModalGroup);
    window.customElements.define("modal-item", ModalItem);
    window.customElements.define("btn-modal-close", ModalClose);
    window.customElements.define("btn-modal-open", ModalOpen);
    window.customElements.define("btn-modal-next", ModalNext);
    window.customElements.define("btn-modal-prev", ModalPrevious);
    const screen$1 = {
      isPhone: false,
      isTablet: false,
      isMobile: false,
      isDesktop: false,
      isIphone: false,
      isSafariDesktop: false,
      isMacChrome: false,
      isMac: false,
      isFirefox: false,
      isFirefoxIOS: false,
      isInstagram: false,
      size: "",
      width: 0,
      height: 0,
      tresholdPhone: 768,
      tresholdTablet: 1025,
      isIpadPro: false
    };
    const uA = navigator.userAgent;
    const vendor = navigator.vendor;
    const isIpadPro = () => {
      return /Macintosh/.test(uA) && "ontouchend" in document;
    };
    const isMobileUserAgent = /iPhone|iPad|iPod|Android/i.test(uA) || isIpadPro();
    screen$1.isSafariDesktop = /Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA);
    screen$1.isMac = uA.indexOf("Mac OS X") !== -1;
    screen$1.isIphone = /iPhone/i.test(uA);
    screen$1.isIpadPro = isIpadPro();
    if (screen$1.isMac && window.chrome) {
      screen$1.isMac = false;
      screen$1.isMacChrome = true;
    }
    screen$1.isFirefox = uA.toLowerCase().indexOf("firefox") > -1;
    screen$1.isFirefoxIOS = /FxiOS/i.test(uA);
    screen$1.isInstagram = /Instagram/i.test(uA);
    const size = function () {
      let w = window.innerWidth;
      let h = window.innerHeight;
      screen$1.isPhone = w < screen$1.tresholdPhone;
      screen$1.isTablet = w >= screen$1.tresholdPhone && w <= screen$1.tresholdTablet || screen$1.isIpadPro;
      screen$1.isMobile = w <= screen$1.tresholdTablet || isMobileUserAgent;
      screen$1.isDesktop = w >= screen$1.tresholdTablet && !screen$1.isIpadPro;
      screen$1.phonePlus = w >= screen$1.tresholdPhone;
      if (screen$1.isPhone) screen$1.size = "phone";
      if (screen$1.isTablet) screen$1.size = "tablet";
      if (screen$1.isDesktop) screen$1.size = "desktop";
      screen$1.width = w;
      screen$1.height = h;
    };
    window.addEventListener("resize", size);
    size();
    function viewportHeight() {
      function calcVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }
      function calcVH2() {
        let vh2 = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh2", `${vh2}px`);
      }
      if (!screen$1.isDesktop) {
        calcVH();
        calcVH2();
        window.addEventListener("resize", calcVH2, { passive: true });
        window.addEventListener("orientationchange", calcVH2, { passive: true });
        window.addEventListener("load", calcVH, { passive: true });
        window.addEventListener("load", calcVH2, { passive: true });
      }
    }
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
    }
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    /*!
     * GSAP 3.12.7
     * https://gsap.com
     *
     * @license Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var _config$1 = {
      autoSleep: 120,
      force3D: "auto",
      nullTargetWarn: 1,
      units: {
        lineHeight: ""
      }
    }, _defaults$1 = {
      duration: 0.5,
      overwrite: false,
      delay: 0
    }, _suppressOverwrites$1, _reverting$1, _context$3, _bigNum$1 = 1e8, _tinyNum = 1 / _bigNum$1, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString$2 = function _isString2(value) {
      return typeof value === "string";
    }, _isFunction$2 = function _isFunction2(value) {
      return typeof value === "function";
    }, _isNumber$1 = function _isNumber2(value) {
      return typeof value === "number";
    }, _isUndefined = function _isUndefined2(value) {
      return typeof value === "undefined";
    }, _isObject$1 = function _isObject2(value) {
      return typeof value === "object";
    }, _isNotFalse = function _isNotFalse2(value) {
      return value !== false;
    }, _windowExists$4 = function _windowExists2() {
      return typeof window !== "undefined";
    }, _isFuncOrString = function _isFuncOrString2(value) {
      return _isFunction$2(value) || _isString$2(value);
    }, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {
    }, _isArray = Array.isArray, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$4, _coreInitted$4, _doc$4, _globals = {}, _installScope = {}, _coreReady, _install = function _install2(scope) {
      return (_installScope = _merge(scope, _globals)) && gsap$4;
    }, _missingPlugin = function _missingPlugin2(property, value) {
      return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
    }, _warn = function _warn2(message, suppress) {
      return !suppress && console.warn(message);
    }, _addGlobal = function _addGlobal2(name, obj) {
      return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
    }, _emptyFunc = function _emptyFunc2() {
      return 0;
    }, _startAtRevertConfig = {
      suppressEvents: true,
      isStart: true,
      kill: false
    }, _revertConfigNoKill = {
      suppressEvents: true,
      kill: false
    }, _revertConfig = {
      suppressEvents: true
    }, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness2(targets) {
      var target = targets[0], harnessPlugin, i;
      _isObject$1(target) || _isFunction$2(target) || (targets = [targets]);
      if (!(harnessPlugin = (target._gsap || {}).harness)) {
        i = _harnessPlugins.length;
        while (i-- && !_harnessPlugins[i].targetTest(target)) {
        }
        harnessPlugin = _harnessPlugins[i];
      }
      i = targets.length;
      while (i--) {
        targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
      }
      return targets;
    }, _getCache = function _getCache2(target) {
      return target._gsap || _harness(toArray$1(target))[0]._gsap;
    }, _getProperty = function _getProperty2(target, property, v) {
      return (v = target[property]) && _isFunction$2(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
    }, _forEachName = function _forEachName2(names, func) {
      return (names = names.split(",")).forEach(func) || names;
    }, _round$2 = function _round2(value) {
      return Math.round(value * 1e5) / 1e5 || 0;
    }, _roundPrecise = function _roundPrecise2(value) {
      return Math.round(value * 1e7) / 1e7 || 0;
    }, _parseRelative = function _parseRelative2(start, value) {
      var operator = value.charAt(0), end = parseFloat(value.substr(2));
      start = parseFloat(start);
      return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
    }, _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
      var l = toFind.length, i = 0;
      for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {
      }
      return i < l;
    }, _lazyRender = function _lazyRender2() {
      var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
      _lazyLookup = {};
      _lazyTweens.length = 0;
      for (i = 0; i < l; i++) {
        tween = a[i];
        tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
      }
    }, _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
      _lazyTweens.length && !_reverting$1 && _lazyRender();
      animation.render(time, suppressEvents, _reverting$1 && time < 0 && (animation._initted || animation._startAt));
      _lazyTweens.length && !_reverting$1 && _lazyRender();
    }, _numericIfPossible = function _numericIfPossible2(value) {
      var n = parseFloat(value);
      return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString$2(value) ? value.trim() : value;
    }, _passThrough$1 = function _passThrough2(p) {
      return p;
    }, _setDefaults$1 = function _setDefaults2(obj, defaults2) {
      for (var p in defaults2) {
        p in obj || (obj[p] = defaults2[p]);
      }
      return obj;
    }, _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
      return function (obj, defaults2) {
        for (var p in defaults2) {
          p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults2[p]);
        }
      };
    }, _merge = function _merge2(base, toMerge) {
      for (var p in toMerge) {
        base[p] = toMerge[p];
      }
      return base;
    }, _mergeDeep = function _mergeDeep2(base, toMerge) {
      for (var p in toMerge) {
        p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject$1(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
      }
      return base;
    }, _copyExcluding = function _copyExcluding2(obj, excluding) {
      var copy = {}, p;
      for (p in obj) {
        p in excluding || (copy[p] = obj[p]);
      }
      return copy;
    }, _inheritDefaults = function _inheritDefaults2(vars) {
      var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults$1;
      if (_isNotFalse(vars.inherit)) {
        while (parent) {
          func(vars, parent.vars.defaults);
          parent = parent.parent || parent._dp;
        }
      }
      return vars;
    }, _arraysMatch = function _arraysMatch2(a1, a2) {
      var i = a1.length, match = i === a2.length;
      while (match && i-- && a1[i] === a2[i]) {
      }
      return i < 0;
    }, _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
      var prev = parent[lastProp], t;
      if (sortBy) {
        t = child[sortBy];
        while (prev && prev[sortBy] > t) {
          prev = prev._prev;
        }
      }
      if (prev) {
        child._next = prev._next;
        prev._next = child;
      } else {
        child._next = parent[firstProp];
        parent[firstProp] = child;
      }
      if (child._next) {
        child._next._prev = child;
      } else {
        parent[lastProp] = child;
      }
      child._prev = prev;
      child.parent = child._dp = parent;
      return child;
    }, _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
      if (firstProp === void 0) {
        firstProp = "_first";
      }
      if (lastProp === void 0) {
        lastProp = "_last";
      }
      var prev = child._prev, next = child._next;
      if (prev) {
        prev._next = next;
      } else if (parent[firstProp] === child) {
        parent[firstProp] = next;
      }
      if (next) {
        next._prev = prev;
      } else if (parent[lastProp] === child) {
        parent[lastProp] = prev;
      }
      child._next = child._prev = child.parent = null;
    }, _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
      child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
      child._act = 0;
    }, _uncache = function _uncache2(animation, child) {
      if (animation && (!child || child._end > animation._dur || child._start < 0)) {
        var a = animation;
        while (a) {
          a._dirty = 1;
          a = a.parent;
        }
      }
      return animation;
    }, _recacheAncestors = function _recacheAncestors2(animation) {
      var parent = animation.parent;
      while (parent && parent.parent) {
        parent._dirty = 1;
        parent.totalDuration();
        parent = parent.parent;
      }
      return animation;
    }, _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
      return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
    }, _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
      return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
    }, _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
      return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
    }, _animationCycle = function _animationCycle2(tTime, cycleDuration) {
      var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
      return tTime && whole === tTime ? whole - 1 : whole;
    }, _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
      return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
    }, _setEnd = function _setEnd2(animation) {
      return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
    }, _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
      var parent = animation._dp;
      if (parent && parent.smoothChildTiming && animation._ts) {
        animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
        _setEnd(animation);
        parent._dirty || _uncache(parent, animation);
      }
      return animation;
    }, _postAddChecks = function _postAddChecks2(timeline, child) {
      var t;
      if (child._time || !child._dur && child._initted || child._start < timeline._time && (child._dur || !child.add)) {
        t = _parentToChildTotalTime(timeline.rawTime(), child);
        if (!child._dur || _clamp$2(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
          child.render(t, true);
        }
      }
      if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
        if (timeline._dur < timeline.duration()) {
          t = timeline;
          while (t._dp) {
            t.rawTime() >= 0 && t.totalTime(t._tTime);
            t = t._dp;
          }
        }
        timeline._zTime = -1e-8;
      }
    }, _addToTimeline = function _addToTimeline2(timeline, child, position, skipChecks) {
      child.parent && _removeFromParent(child);
      child._start = _roundPrecise((_isNumber$1(position) ? position : position || timeline !== _globalTimeline ? _parsePosition$1(timeline, position, child) : timeline._time) + child._delay);
      child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
      _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
      _isFromOrFromStart(child) || (timeline._recent = child);
      skipChecks || _postAddChecks(timeline, child);
      timeline._ts < 0 && _alignPlayhead(timeline, timeline._tTime);
      return timeline;
    }, _scrollTrigger = function _scrollTrigger2(animation, trigger2) {
      return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger2)) && _globals.ScrollTrigger.create(trigger2, animation);
    }, _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
      _initTween(tween, time, tTime);
      if (!tween._initted) {
        return 1;
      }
      if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
        _lazyTweens.push(tween);
        tween._lazy = [tTime, suppressEvents];
        return 1;
      }
    }, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
      var parent = _ref.parent;
      return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
    }, _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
      var data = _ref2.data;
      return data === "isFromStart" || data === "isStart";
    }, _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
      var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
      if (repeatDelay && tween._repeat) {
        tTime = _clamp$2(0, tween._tDur, totalTime);
        iteration = _animationCycle(tTime, repeatDelay);
        tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
        if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
          prevRatio = 1 - ratio;
          tween.vars.repeatRefresh && tween._initted && tween.invalidate();
        }
      }
      if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
        if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
          return;
        }
        prevIteration = tween._zTime;
        tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
        suppressEvents || (suppressEvents = totalTime && !prevIteration);
        tween.ratio = ratio;
        tween._from && (ratio = 1 - ratio);
        tween._time = 0;
        tween._tTime = tTime;
        pt = tween._pt;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
        tween._onUpdate && !suppressEvents && _callback$1(tween, "onUpdate");
        tTime && tween._repeat && !suppressEvents && tween.parent && _callback$1(tween, "onRepeat");
        if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
          ratio && _removeFromParent(tween, 1);
          if (!suppressEvents && !_reverting$1) {
            _callback$1(tween, ratio ? "onComplete" : "onReverseComplete", true);
            tween._prom && tween._prom();
          }
        }
      } else if (!tween._zTime) {
        tween._zTime = totalTime;
      }
    }, _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
      var child;
      if (time > prevTime) {
        child = animation._first;
        while (child && child._start <= time) {
          if (child.data === "isPause" && child._start > prevTime) {
            return child;
          }
          child = child._next;
        }
      } else {
        child = animation._last;
        while (child && child._start >= time) {
          if (child.data === "isPause" && child._start < prevTime) {
            return child;
          }
          child = child._prev;
        }
      }
    }, _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
      var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
      totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
      animation._dur = dur;
      animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
      totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
      animation.parent && _setEnd(animation);
      skipUncache || _uncache(animation.parent, animation);
      return animation;
    }, _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
      return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
    }, _zeroPosition = {
      _start: 0,
      endTime: _emptyFunc,
      totalDuration: _emptyFunc
    }, _parsePosition$1 = function _parsePosition2(animation, position, percentAnimation) {
      var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$1 ? recent.endTime(false) : animation._dur, i, offset2, isPercent;
      if (_isString$2(position) && (isNaN(position) || position in labels)) {
        offset2 = position.charAt(0);
        isPercent = position.substr(-1) === "%";
        i = position.indexOf("=");
        if (offset2 === "<" || offset2 === ">") {
          i >= 0 && (position = position.replace(/=/, ""));
          return (offset2 === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
        }
        if (i < 0) {
          position in labels || (labels[position] = clippedDuration);
          return labels[position];
        }
        offset2 = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
        if (isPercent && percentAnimation) {
          offset2 = offset2 / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
        }
        return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset2 : clippedDuration + offset2;
      }
      return position == null ? clippedDuration : +position;
    }, _createTweenType = function _createTweenType2(type, params, timeline) {
      var isLegacy = _isNumber$1(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
      isLegacy && (vars.duration = params[1]);
      vars.parent = timeline;
      if (type) {
        irVars = vars;
        parent = timeline;
        while (parent && !("immediateRender" in irVars)) {
          irVars = parent.vars.defaults || {};
          parent = _isNotFalse(parent.vars.inherit) && parent.parent;
        }
        vars.immediateRender = _isNotFalse(irVars.immediateRender);
        type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
      }
      return new Tween(params[0], vars, params[varsIndex + 1]);
    }, _conditionalReturn = function _conditionalReturn2(value, func) {
      return value || value === 0 ? func(value) : func;
    }, _clamp$2 = function _clamp2(min2, max2, value) {
      return value < min2 ? min2 : value > max2 ? max2 : value;
    }, getUnit = function getUnit2(value, v) {
      return !_isString$2(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
    }, clamp = function clamp2(min2, max2, value) {
      return _conditionalReturn(value, function (v) {
        return _clamp$2(min2, max2, v);
      });
    }, _slice = [].slice, _isArrayLike = function _isArrayLike2(value, nonEmpty) {
      return value && _isObject$1(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject$1(value[0])) && !value.nodeType && value !== _win$4;
    }, _flatten = function _flatten2(ar, leaveStrings, accumulator) {
      if (accumulator === void 0) {
        accumulator = [];
      }
      return ar.forEach(function (value) {
        var _accumulator;
        return _isString$2(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray$1(value)) : accumulator.push(value);
      }) || accumulator;
    }, toArray$1 = function toArray2(value, scope, leaveStrings) {
      return _context$3 && !scope && _context$3.selector ? _context$3.selector(value) : _isString$2(value) && !leaveStrings && (_coreInitted$4 || !_wake()) ? _slice.call((scope || _doc$4).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
    }, selector = function selector2(value) {
      value = toArray$1(value)[0] || _warn("Invalid scope") || {};
      return function (v) {
        var el = value.current || value.nativeElement || value;
        return toArray$1(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$4.createElement("div") : value);
      };
    }, shuffle = function shuffle2(a) {
      return a.sort(function () {
        return 0.5 - Math.random();
      });
    }, distribute = function distribute2(v) {
      if (_isFunction$2(v)) {
        return v;
      }
      var vars = _isObject$1(v) ? v : {
        each: v
      }, ease = _parseEase(vars.ease), from2 = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from2 > 0 && from2 < 1, ratios = isNaN(from2) || isDecimal, axis = vars.axis, ratioX = from2, ratioY = from2;
      if (_isString$2(from2)) {
        ratioX = ratioY = {
          center: 0.5,
          edges: 0.5,
          end: 1
        }[from2] || 0;
      } else if (!isDecimal && ratios) {
        ratioX = from2[0];
        ratioY = from2[1];
      }
      return function (i, target, a) {
        var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max2, min2, wrapAt;
        if (!distances) {
          wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
          if (!wrapAt) {
            max2 = -1e8;
            while (max2 < (max2 = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
            }
            wrapAt < l && wrapAt--;
          }
          distances = cache[l] = [];
          originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from2 % wrapAt;
          originY = wrapAt === _bigNum$1 ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from2 / wrapAt | 0;
          max2 = 0;
          min2 = _bigNum$1;
          for (j = 0; j < l; j++) {
            x = j % wrapAt - originX;
            y = originY - (j / wrapAt | 0);
            distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
            d > max2 && (max2 = d);
            d < min2 && (min2 = d);
          }
          from2 === "random" && shuffle(distances);
          distances.max = max2 - min2;
          distances.min = min2;
          distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from2 === "edges" ? -1 : 1);
          distances.b = l < 0 ? base - l : base;
          distances.u = getUnit(vars.amount || vars.each) || 0;
          ease = ease && l < 0 ? _invertEase(ease) : ease;
        }
        l = (distances[i] - distances.min) / distances.max || 0;
        return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
      };
    }, _roundModifier = function _roundModifier2(v) {
      var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
      return function (raw) {
        var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
        return (n - n % 1) / p + (_isNumber$1(raw) ? 0 : getUnit(raw));
      };
    }, snap = function snap2(snapTo, value) {
      var isArray2 = _isArray(snapTo), radius, is2D;
      if (!isArray2 && _isObject$1(snapTo)) {
        radius = isArray2 = snapTo.radius || _bigNum$1;
        if (snapTo.values) {
          snapTo = toArray$1(snapTo.values);
          if (is2D = !_isNumber$1(snapTo[0])) {
            radius *= radius;
          }
        } else {
          snapTo = _roundModifier(snapTo.increment);
        }
      }
      return _conditionalReturn(value, !isArray2 ? _roundModifier(snapTo) : _isFunction$2(snapTo) ? function (raw) {
        is2D = snapTo(raw);
        return Math.abs(is2D - raw) <= radius ? is2D : raw;
      } : function (raw) {
        var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min2 = _bigNum$1, closest = 0, i = snapTo.length, dx, dy;
        while (i--) {
          if (is2D) {
            dx = snapTo[i].x - x;
            dy = snapTo[i].y - y;
            dx = dx * dx + dy * dy;
          } else {
            dx = Math.abs(snapTo[i] - x);
          }
          if (dx < min2) {
            min2 = dx;
            closest = i;
          }
        }
        closest = !radius || min2 <= radius ? snapTo[closest] : raw;
        return is2D || closest === raw || _isNumber$1(raw) ? closest : closest + getUnit(raw);
      });
    }, random = function random2(min2, max2, roundingIncrement, returnFunction) {
      return _conditionalReturn(_isArray(min2) ? !max2 : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
        return _isArray(min2) ? min2[~~(Math.random() * min2.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min2 - roundingIncrement / 2 + Math.random() * (max2 - min2 + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
      });
    }, pipe = function pipe2() {
      for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
        functions[_key] = arguments[_key];
      }
      return function (value) {
        return functions.reduce(function (v, f) {
          return f(v);
        }, value);
      };
    }, unitize = function unitize2(func, unit) {
      return function (value) {
        return func(parseFloat(value)) + (unit || getUnit(value));
      };
    }, normalize = function normalize2(min2, max2, value) {
      return mapRange(min2, max2, 0, 1, value);
    }, _wrapArray = function _wrapArray2(a, wrapper, value) {
      return _conditionalReturn(value, function (index) {
        return a[~~wrapper(index)];
      });
    }, wrap = function wrap2(min2, max2, value) {
      var range = max2 - min2;
      return _isArray(min2) ? _wrapArray(min2, wrap2(0, min2.length), max2) : _conditionalReturn(value, function (value2) {
        return (range + (value2 - min2) % range) % range + min2;
      });
    }, wrapYoyo = function wrapYoyo2(min2, max2, value) {
      var range = max2 - min2, total = range * 2;
      return _isArray(min2) ? _wrapArray(min2, wrapYoyo2(0, min2.length - 1), max2) : _conditionalReturn(value, function (value2) {
        value2 = (total + (value2 - min2) % total) % total || 0;
        return min2 + (value2 > range ? total - value2 : value2);
      });
    }, _replaceRandom = function _replaceRandom2(value) {
      var prev = 0, s = "", i, nums, end, isArray2;
      while (~(i = value.indexOf("random(", prev))) {
        end = value.indexOf(")", i);
        isArray2 = value.charAt(i + 7) === "[";
        nums = value.substr(i + 7, end - i - 7).match(isArray2 ? _delimitedValueExp : _strictNumExp);
        s += value.substr(prev, i - prev) + random(isArray2 ? nums : +nums[0], isArray2 ? 0 : +nums[1], +nums[2] || 1e-5);
        prev = end + 1;
      }
      return s + value.substr(prev, value.length - prev);
    }, mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
      var inRange = inMax - inMin, outRange = outMax - outMin;
      return _conditionalReturn(value, function (value2) {
        return outMin + ((value2 - inMin) / inRange * outRange || 0);
      });
    }, interpolate = function interpolate2(start, end, progress, mutate) {
      var func = isNaN(start + end) ? 0 : function (p2) {
        return (1 - p2) * start + p2 * end;
      };
      if (!func) {
        var isString2 = _isString$2(start), master = {}, p, i, interpolators, l, il;
        progress === true && (mutate = 1) && (progress = null);
        if (isString2) {
          start = {
            p: start
          };
          end = {
            p: end
          };
        } else if (_isArray(start) && !_isArray(end)) {
          interpolators = [];
          l = start.length;
          il = l - 2;
          for (i = 1; i < l; i++) {
            interpolators.push(interpolate2(start[i - 1], start[i]));
          }
          l--;
          func = function func2(p2) {
            p2 *= l;
            var i2 = Math.min(il, ~~p2);
            return interpolators[i2](p2 - i2);
          };
          progress = end;
        } else if (!mutate) {
          start = _merge(_isArray(start) ? [] : {}, start);
        }
        if (!interpolators) {
          for (p in end) {
            _addPropTween.call(master, start, p, "get", end[p]);
          }
          func = function func2(p2) {
            return _renderPropTweens(p2, master) || (isString2 ? start.p : start);
          };
        }
      }
      return _conditionalReturn(progress, func);
    }, _getLabelInDirection = function _getLabelInDirection2(timeline, fromTime, backward) {
      var labels = timeline.labels, min2 = _bigNum$1, p, distance, label;
      for (p in labels) {
        distance = labels[p] - fromTime;
        if (distance < 0 === !!backward && distance && min2 > (distance = Math.abs(distance))) {
          label = p;
          min2 = distance;
        }
      }
      return label;
    }, _callback$1 = function _callback2(animation, type, executeLazyFirst) {
      var v = animation.vars, callback = v[type], prevContext = _context$3, context = animation._ctx, params, scope, result;
      if (!callback) {
        return;
      }
      params = v[type + "Params"];
      scope = v.callbackScope || animation;
      executeLazyFirst && _lazyTweens.length && _lazyRender();
      context && (_context$3 = context);
      result = params ? callback.apply(scope, params) : callback.call(scope);
      _context$3 = prevContext;
      return result;
    }, _interrupt = function _interrupt2(animation) {
      _removeFromParent(animation);
      animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
      animation.progress() < 1 && _callback$1(animation, "onInterrupt");
      return animation;
    }, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin2(config) {
      if (!config) return;
      config = !config.name && config["default"] || config;
      if (_windowExists$4() || config.headless) {
        var name = config.name, isFunc = _isFunction$2(config), Plugin = name && !isFunc && config.init ? function () {
          this._props = [];
        } : config, instanceDefaults = {
          init: _emptyFunc,
          render: _renderPropTweens,
          add: _addPropTween,
          kill: _killPropTweensOf,
          modifier: _addPluginModifier,
          rawVars: 0
        }, statics = {
          targetTest: 0,
          get: 0,
          getSetter: _getSetter,
          aliases: {},
          register: 0
        };
        _wake();
        if (config !== Plugin) {
          if (_plugins[name]) {
            return;
          }
          _setDefaults$1(Plugin, _setDefaults$1(_copyExcluding(config, instanceDefaults), statics));
          _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
          _plugins[Plugin.prop = name] = Plugin;
          if (config.targetTest) {
            _harnessPlugins.push(Plugin);
            _reservedProps[name] = 1;
          }
          name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
        }
        _addGlobal(name, Plugin);
        config.register && config.register(gsap$4, Plugin, PropTween);
      } else {
        _registerPluginQueue.push(config);
      }
    }, _255 = 255, _colorLookup = {
      aqua: [0, _255, _255],
      lime: [0, _255, 0],
      silver: [192, 192, 192],
      black: [0, 0, 0],
      maroon: [128, 0, 0],
      teal: [0, 128, 128],
      blue: [0, 0, _255],
      navy: [0, 0, 128],
      white: [_255, _255, _255],
      olive: [128, 128, 0],
      yellow: [_255, _255, 0],
      orange: [_255, 165, 0],
      gray: [128, 128, 128],
      purple: [128, 0, 128],
      green: [0, 128, 0],
      red: [_255, 0, 0],
      pink: [_255, 192, 203],
      cyan: [0, _255, _255],
      transparent: [_255, _255, _255, 0]
    }, _hue = function _hue2(h, m1, m2) {
      h += h < 0 ? 1 : h > 1 ? -1 : 0;
      return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
    }, splitColor = function splitColor2(v, toHSL, forceAlpha) {
      var a = !v ? _colorLookup.black : _isNumber$1(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b2, h, s, l, max2, min2, d, wasHSL;
      if (!a) {
        if (v.substr(-1) === ",") {
          v = v.substr(0, v.length - 1);
        }
        if (_colorLookup[v]) {
          a = _colorLookup[v];
        } else if (v.charAt(0) === "#") {
          if (v.length < 6) {
            r = v.charAt(1);
            g = v.charAt(2);
            b2 = v.charAt(3);
            v = "#" + r + r + g + g + b2 + b2 + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
          }
          if (v.length === 9) {
            a = parseInt(v.substr(1, 6), 16);
            return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
          }
          v = parseInt(v.substr(1), 16);
          a = [v >> 16, v >> 8 & _255, v & _255];
        } else if (v.substr(0, 3) === "hsl") {
          a = wasHSL = v.match(_strictNumExp);
          if (!toHSL) {
            h = +a[0] % 360 / 360;
            s = +a[1] / 100;
            l = +a[2] / 100;
            g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            r = l * 2 - g;
            a.length > 3 && (a[3] *= 1);
            a[0] = _hue(h + 1 / 3, r, g);
            a[1] = _hue(h, r, g);
            a[2] = _hue(h - 1 / 3, r, g);
          } else if (~v.indexOf("=")) {
            a = v.match(_numExp);
            forceAlpha && a.length < 4 && (a[3] = 1);
            return a;
          }
        } else {
          a = v.match(_strictNumExp) || _colorLookup.transparent;
        }
        a = a.map(Number);
      }
      if (toHSL && !wasHSL) {
        r = a[0] / _255;
        g = a[1] / _255;
        b2 = a[2] / _255;
        max2 = Math.max(r, g, b2);
        min2 = Math.min(r, g, b2);
        l = (max2 + min2) / 2;
        if (max2 === min2) {
          h = s = 0;
        } else {
          d = max2 - min2;
          s = l > 0.5 ? d / (2 - max2 - min2) : d / (max2 + min2);
          h = max2 === r ? (g - b2) / d + (g < b2 ? 6 : 0) : max2 === g ? (b2 - r) / d + 2 : (r - g) / d + 4;
          h *= 60;
        }
        a[0] = ~~(h + 0.5);
        a[1] = ~~(s * 100 + 0.5);
        a[2] = ~~(l * 100 + 0.5);
      }
      forceAlpha && a.length < 4 && (a[3] = 1);
      return a;
    }, _colorOrderData = function _colorOrderData2(v) {
      var values = [], c = [], i = -1;
      v.split(_colorExp).forEach(function (v2) {
        var a = v2.match(_numWithUnitExp) || [];
        values.push.apply(values, a);
        c.push(i += a.length + 1);
      });
      values.c = c;
      return values;
    }, _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
      var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
      if (!colors) {
        return s;
      }
      colors = colors.map(function (color) {
        return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
      });
      if (orderMatchData) {
        d = _colorOrderData(s);
        c = orderMatchData.c;
        if (c.join(result) !== d.c.join(result)) {
          shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
          l = shell.length - 1;
          for (; i < l; i++) {
            result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
          }
        }
      }
      if (!shell) {
        shell = s.split(_colorExp);
        l = shell.length - 1;
        for (; i < l; i++) {
          result += shell[i] + colors[i];
        }
      }
      return result + shell[l];
    }, _colorExp = function () {
      var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
      for (p in _colorLookup) {
        s += "|" + p + "\\b";
      }
      return new RegExp(s + ")", "gi");
    }(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter2(a) {
      var combined = a.join(" "), toHSL;
      _colorExp.lastIndex = 0;
      if (_colorExp.test(combined)) {
        toHSL = _hslExp.test(combined);
        a[1] = _formatColors(a[1], toHSL);
        a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
        return true;
      }
    }, _tickerActive, _ticker = function () {
      var _getTime2 = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime2(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i2, _tick = function _tick2(v) {
        var elapsed = _getTime2() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
        (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
        _lastUpdate += elapsed;
        time = _lastUpdate - _startTime;
        overlap = time - _nextTime;
        if (overlap > 0 || manual) {
          frame = ++_self.frame;
          _delta = time - _self.time * 1e3;
          _self.time = time = time / 1e3;
          _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
          dispatch = 1;
        }
        manual || (_id = _req(_tick2));
        if (dispatch) {
          for (_i2 = 0; _i2 < _listeners2.length; _i2++) {
            _listeners2[_i2](time, _delta, frame, v);
          }
        }
      };
      _self = {
        time: 0,
        frame: 0,
        tick: function tick() {
          _tick(true);
        },
        deltaRatio: function deltaRatio(fps) {
          return _delta / (1e3 / (fps || 60));
        },
        wake: function wake() {
          if (_coreReady) {
            if (!_coreInitted$4 && _windowExists$4()) {
              _win$4 = _coreInitted$4 = window;
              _doc$4 = _win$4.document || {};
              _globals.gsap = gsap$4;
              (_win$4.gsapVersions || (_win$4.gsapVersions = [])).push(gsap$4.version);
              _install(_installScope || _win$4.GreenSockGlobals || !_win$4.gsap && _win$4 || {});
              _registerPluginQueue.forEach(_createPlugin);
            }
            _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
            _id && _self.sleep();
            _req = _raf || function (f) {
              return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
            };
            _tickerActive = 1;
            _tick(2);
          }
        },
        sleep: function sleep() {
          (_raf ? cancelAnimationFrame : clearTimeout)(_id);
          _tickerActive = 0;
          _req = _emptyFunc;
        },
        lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
          _lagThreshold = threshold || Infinity;
          _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
        },
        fps: function fps(_fps) {
          _gap = 1e3 / (_fps || 240);
          _nextTime = _self.time * 1e3 + _gap;
        },
        add: function add2(callback, once, prioritize) {
          var func = once ? function (t, d, f, v) {
            callback(t, d, f, v);
            _self.remove(func);
          } : callback;
          _self.remove(callback);
          _listeners2[prioritize ? "unshift" : "push"](func);
          _wake();
          return func;
        },
        remove: function remove(callback, i) {
          ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i2 >= i && _i2--;
        },
        _listeners: _listeners2
      };
      return _self;
    }(), _wake = function _wake2() {
      return !_tickerActive && _ticker.wake();
    }, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString2(value) {
      var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index, val, parsedVal;
      for (; i < l; i++) {
        val = split[i];
        index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
        parsedVal = val.substr(0, index);
        obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
        key = val.substr(index + 1).trim();
      }
      return obj;
    }, _valueInParentheses = function _valueInParentheses2(value) {
      var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
      return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
    }, _configEaseFromString = function _configEaseFromString2(name) {
      var split = (name + "").split("("), ease = _easeMap[split[0]];
      return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
    }, _invertEase = function _invertEase2(ease) {
      return function (p) {
        return 1 - ease(1 - p);
      };
    }, _propagateYoyoEase = function _propagateYoyoEase2(timeline, isYoyo) {
      var child = timeline._first, ease;
      while (child) {
        if (child instanceof Timeline) {
          _propagateYoyoEase2(child, isYoyo);
        } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
          if (child.timeline) {
            _propagateYoyoEase2(child.timeline, isYoyo);
          } else {
            ease = child._ease;
            child._ease = child._yEase;
            child._yEase = ease;
            child._yoyo = isYoyo;
          }
        }
        child = child._next;
      }
    }, _parseEase = function _parseEase2(ease, defaultEase) {
      return !ease ? defaultEase : (_isFunction$2(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
    }, _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
      if (easeOut === void 0) {
        easeOut = function easeOut2(p) {
          return 1 - easeIn(1 - p);
        };
      }
      if (easeInOut === void 0) {
        easeInOut = function easeInOut2(p) {
          return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
        };
      }
      var ease = {
        easeIn,
        easeOut,
        easeInOut
      }, lowercaseName;
      _forEachName(names, function (name) {
        _easeMap[name] = _globals[name] = ease;
        _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
        for (var p in ease) {
          _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
        }
      });
      return ease;
    }, _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
      return function (p) {
        return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
      };
    }, _configElastic = function _configElastic2(type, amplitude, period) {
      var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
        return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
      }, ease = type === "out" ? easeOut : type === "in" ? function (p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
      p2 = _2PI / p2;
      ease.config = function (amplitude2, period2) {
        return _configElastic2(type, amplitude2, period2);
      };
      return ease;
    }, _configBack = function _configBack2(type, overshoot) {
      if (overshoot === void 0) {
        overshoot = 1.70158;
      }
      var easeOut = function easeOut2(p) {
        return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
      }, ease = type === "out" ? easeOut : type === "in" ? function (p) {
        return 1 - easeOut(1 - p);
      } : _easeInOutFromOut(easeOut);
      ease.config = function (overshoot2) {
        return _configBack2(type, overshoot2);
      };
      return ease;
    };
    _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
      var power = i < 5 ? i + 1 : i;
      _insertEase(name + ",Power" + (power - 1), i ? function (p) {
        return Math.pow(p, power);
      } : function (p) {
        return p;
      }, function (p) {
        return 1 - Math.pow(1 - p, power);
      }, function (p) {
        return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
      });
    });
    _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
    _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
    (function (n, c) {
      var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
        return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
      };
      _insertEase("Bounce", function (p) {
        return 1 - easeOut(1 - p);
      }, easeOut);
    })(7.5625, 2.75);
    _insertEase("Expo", function (p) {
      return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
    });
    _insertEase("Circ", function (p) {
      return -(_sqrt(1 - p * p) - 1);
    });
    _insertEase("Sine", function (p) {
      return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
    });
    _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
    _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
      config: function config(steps, immediateStart) {
        if (steps === void 0) {
          steps = 1;
        }
        var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max2 = 1 - _tinyNum;
        return function (p) {
          return ((p2 * _clamp$2(0, max2, p) | 0) + p3) * p1;
        };
      }
    };
    _defaults$1.ease = _easeMap["quad.out"];
    _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
      return _callbackNames += name + "," + name + "Params,";
    });
    var GSCache = function GSCache2(target, harness) {
      this.id = _gsID++;
      target._gsap = this;
      this.target = target;
      this.harness = harness;
      this.get = harness ? harness.get : _getProperty;
      this.set = harness ? harness.getSetter : _getSetter;
    };
    var Animation = /* @__PURE__ */ function () {
      function Animation2(vars) {
        this.vars = vars;
        this._delay = +vars.delay || 0;
        if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
          this._rDelay = vars.repeatDelay || 0;
          this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
        }
        this._ts = 1;
        _setDuration(this, +vars.duration, 1, 1);
        this.data = vars.data;
        if (_context$3) {
          this._ctx = _context$3;
          _context$3.data.push(this);
        }
        _tickerActive || _ticker.wake();
      }
      var _proto = Animation2.prototype;
      _proto.delay = function delay2(value) {
        if (value || value === 0) {
          this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
          this._delay = value;
          return this;
        }
        return this._delay;
      };
      _proto.duration = function duration(value) {
        return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
      };
      _proto.totalDuration = function totalDuration(value) {
        if (!arguments.length) {
          return this._tDur;
        }
        this._dirty = 0;
        return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
      };
      _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
        _wake();
        if (!arguments.length) {
          return this._tTime;
        }
        var parent = this._dp;
        if (parent && parent.smoothChildTiming && this._ts) {
          _alignPlayhead(this, _totalTime);
          !parent._dp || parent.parent || _postAddChecks(parent, this);
          while (parent && parent.parent) {
            if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
              parent.totalTime(parent._tTime, true);
            }
            parent = parent.parent;
          }
          if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
            _addToTimeline(this._dp, this, this._start - this._delay);
          }
        }
        if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
          this._ts || (this._pTime = _totalTime);
          _lazySafeRender(this, _totalTime, suppressEvents);
        }
        return this;
      };
      _proto.time = function time(value, suppressEvents) {
        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
      };
      _proto.totalProgress = function totalProgress(value, suppressEvents) {
        return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
      };
      _proto.progress = function progress(value, suppressEvents) {
        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
      };
      _proto.iteration = function iteration(value, suppressEvents) {
        var cycleDuration = this.duration() + this._rDelay;
        return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
      };
      _proto.timeScale = function timeScale(value, suppressEvents) {
        if (!arguments.length) {
          return this._rts === -1e-8 ? 0 : this._rts;
        }
        if (this._rts === value) {
          return this;
        }
        var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
        this._rts = +value || 0;
        this._ts = this._ps || value === -1e-8 ? 0 : this._rts;
        this.totalTime(_clamp$2(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
        _setEnd(this);
        return _recacheAncestors(this);
      };
      _proto.paused = function paused(value) {
        if (!arguments.length) {
          return this._ps;
        }
        if (this._ps !== value) {
          this._ps = value;
          if (value) {
            this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
            this._ts = this._act = 0;
          } else {
            _wake();
            this._ts = this._rts;
            this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
          }
        }
        return this;
      };
      _proto.startTime = function startTime(value) {
        if (arguments.length) {
          this._start = value;
          var parent = this.parent || this._dp;
          parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
          return this;
        }
        return this._start;
      };
      _proto.endTime = function endTime(includeRepeats) {
        return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
      };
      _proto.rawTime = function rawTime(wrapRepeats) {
        var parent = this.parent || this._dp;
        return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
      };
      _proto.revert = function revert(config) {
        if (config === void 0) {
          config = _revertConfig;
        }
        var prevIsReverting = _reverting$1;
        _reverting$1 = config;
        if (this._initted || this._startAt) {
          this.timeline && this.timeline.revert(config);
          this.totalTime(-0.01, config.suppressEvents);
        }
        this.data !== "nested" && config.kill !== false && this.kill();
        _reverting$1 = prevIsReverting;
        return this;
      };
      _proto.globalTime = function globalTime(rawTime) {
        var animation = this, time = arguments.length ? rawTime : animation.rawTime();
        while (animation) {
          time = animation._start + time / (Math.abs(animation._ts) || 1);
          animation = animation._dp;
        }
        return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
      };
      _proto.repeat = function repeat(value) {
        if (arguments.length) {
          this._repeat = value === Infinity ? -2 : value;
          return _onUpdateTotalDuration(this);
        }
        return this._repeat === -2 ? Infinity : this._repeat;
      };
      _proto.repeatDelay = function repeatDelay(value) {
        if (arguments.length) {
          var time = this._time;
          this._rDelay = value;
          _onUpdateTotalDuration(this);
          return time ? this.time(time) : this;
        }
        return this._rDelay;
      };
      _proto.yoyo = function yoyo(value) {
        if (arguments.length) {
          this._yoyo = value;
          return this;
        }
        return this._yoyo;
      };
      _proto.seek = function seek(position, suppressEvents) {
        return this.totalTime(_parsePosition$1(this, position), _isNotFalse(suppressEvents));
      };
      _proto.restart = function restart(includeDelay, suppressEvents) {
        this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
        this._dur || (this._zTime = -1e-8);
        return this;
      };
      _proto.play = function play(from2, suppressEvents) {
        from2 != null && this.seek(from2, suppressEvents);
        return this.reversed(false).paused(false);
      };
      _proto.reverse = function reverse(from2, suppressEvents) {
        from2 != null && this.seek(from2 || this.totalDuration(), suppressEvents);
        return this.reversed(true).paused(false);
      };
      _proto.pause = function pause(atTime, suppressEvents) {
        atTime != null && this.seek(atTime, suppressEvents);
        return this.paused(true);
      };
      _proto.resume = function resume() {
        return this.paused(false);
      };
      _proto.reversed = function reversed(value) {
        if (arguments.length) {
          !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -1e-8 : 0));
          return this;
        }
        return this._rts < 0;
      };
      _proto.invalidate = function invalidate() {
        this._initted = this._act = 0;
        this._zTime = -1e-8;
        return this;
      };
      _proto.isActive = function isActive() {
        var parent = this.parent || this._dp, start = this._start, rawTime;
        return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
      };
      _proto.eventCallback = function eventCallback(type, callback, params) {
        var vars = this.vars;
        if (arguments.length > 1) {
          if (!callback) {
            delete vars[type];
          } else {
            vars[type] = callback;
            params && (vars[type + "Params"] = params);
            type === "onUpdate" && (this._onUpdate = callback);
          }
          return this;
        }
        return vars[type];
      };
      _proto.then = function then(onFulfilled) {
        var self = this;
        return new Promise(function (resolve) {
          var f = _isFunction$2(onFulfilled) ? onFulfilled : _passThrough$1, _resolve = function _resolve2() {
            var _then = self.then;
            self.then = null;
            _isFunction$2(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
            resolve(f);
            self.then = _then;
          };
          if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
            _resolve();
          } else {
            self._prom = _resolve;
          }
        });
      };
      _proto.kill = function kill() {
        _interrupt(this);
      };
      return Animation2;
    }();
    _setDefaults$1(Animation.prototype, {
      _time: 0,
      _start: 0,
      _end: 0,
      _tTime: 0,
      _tDur: 0,
      _dirty: 0,
      _repeat: 0,
      _yoyo: false,
      parent: null,
      _initted: false,
      _rDelay: 0,
      _ts: 1,
      _dp: 0,
      ratio: 0,
      _zTime: -1e-8,
      _prom: 0,
      _ps: false,
      _rts: 1
    });
    var Timeline = /* @__PURE__ */ function (_Animation) {
      _inheritsLoose(Timeline2, _Animation);
      function Timeline2(vars, position) {
        var _this;
        if (vars === void 0) {
          vars = {};
        }
        _this = _Animation.call(this, vars) || this;
        _this.labels = {};
        _this.smoothChildTiming = !!vars.smoothChildTiming;
        _this.autoRemoveChildren = !!vars.autoRemoveChildren;
        _this._sort = _isNotFalse(vars.sortChildren);
        _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
        vars.reversed && _this.reverse();
        vars.paused && _this.paused(true);
        vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
        return _this;
      }
      var _proto2 = Timeline2.prototype;
      _proto2.to = function to2(targets, vars, position) {
        _createTweenType(0, arguments, this);
        return this;
      };
      _proto2.from = function from2(targets, vars, position) {
        _createTweenType(1, arguments, this);
        return this;
      };
      _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
        _createTweenType(2, arguments, this);
        return this;
      };
      _proto2.set = function set2(targets, vars, position) {
        vars.duration = 0;
        vars.parent = this;
        _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
        vars.immediateRender = !!vars.immediateRender;
        new Tween(targets, vars, _parsePosition$1(this, position), 1);
        return this;
      };
      _proto2.call = function call(callback, params, position) {
        return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
      };
      _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
        vars.duration = duration;
        vars.stagger = vars.stagger || stagger;
        vars.onComplete = onCompleteAll;
        vars.onCompleteParams = onCompleteAllParams;
        vars.parent = this;
        new Tween(targets, vars, _parsePosition$1(this, position));
        return this;
      };
      _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
        vars.runBackwards = 1;
        _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
        return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
      };
      _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
        toVars.startAt = fromVars;
        _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
        return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
      };
      _proto2.render = function render(totalTime, suppressEvents, force) {
        var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
        this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
        if (tTime !== this._tTime || force || crossingStart) {
          if (prevTime !== this._time && dur) {
            tTime += this._time - prevTime;
            totalTime += this._time - prevTime;
          }
          time = tTime;
          prevStart = this._start;
          timeScale = this._ts;
          prevPaused = !timeScale;
          if (crossingStart) {
            dur || (prevTime = this._zTime);
            (totalTime || !suppressEvents) && (this._zTime = totalTime);
          }
          if (this._repeat) {
            yoyo = this._yoyo;
            cycleDuration = dur + this._rDelay;
            if (this._repeat < -1 && totalTime < 0) {
              return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
            }
            time = _roundPrecise(tTime % cycleDuration);
            if (tTime === tDur) {
              iteration = this._repeat;
              time = dur;
            } else {
              prevIteration = _roundPrecise(tTime / cycleDuration);
              iteration = ~~prevIteration;
              if (iteration && iteration === prevIteration) {
                time = dur;
                iteration--;
              }
              time > dur && (time = dur);
            }
            prevIteration = _animationCycle(this._tTime, cycleDuration);
            !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
            if (yoyo && iteration & 1) {
              time = dur - time;
              isYoyo = 1;
            }
            if (iteration !== prevIteration && !this._lock) {
              var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
              iteration < prevIteration && (rewinding = !rewinding);
              prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
              this._lock = 1;
              this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
              this._tTime = tTime;
              !suppressEvents && this.parent && _callback$1(this, "onRepeat");
              this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
              if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
                return this;
              }
              dur = this._dur;
              tDur = this._tDur;
              if (doesWrap) {
                this._lock = 2;
                prevTime = rewinding ? dur : -1e-4;
                this.render(prevTime, true);
                this.vars.repeatRefresh && !isYoyo && this.invalidate();
              }
              this._lock = 0;
              if (!this._ts && !prevPaused) {
                return this;
              }
              _propagateYoyoEase(this, isYoyo);
            }
          }
          if (this._hasPause && !this._forcing && this._lock < 2) {
            pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
            if (pauseTween) {
              tTime -= time - (time = pauseTween._start);
            }
          }
          this._tTime = tTime;
          this._time = time;
          this._act = !timeScale;
          if (!this._initted) {
            this._onUpdate = this.vars.onUpdate;
            this._initted = 1;
            this._zTime = totalTime;
            prevTime = 0;
          }
          if (!prevTime && time && !suppressEvents && !iteration) {
            _callback$1(this, "onStart");
            if (this._tTime !== tTime) {
              return this;
            }
          }
          if (time >= prevTime && totalTime >= 0) {
            child = this._first;
            while (child) {
              next = child._next;
              if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
                if (child.parent !== this) {
                  return this.render(totalTime, suppressEvents, force);
                }
                child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
                if (time !== this._time || !this._ts && !prevPaused) {
                  pauseTween = 0;
                  next && (tTime += this._zTime = -1e-8);
                  break;
                }
              }
              child = next;
            }
          } else {
            child = this._last;
            var adjustedTime = totalTime < 0 ? totalTime : time;
            while (child) {
              next = child._prev;
              if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
                if (child.parent !== this) {
                  return this.render(totalTime, suppressEvents, force);
                }
                child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && (child._initted || child._startAt));
                if (time !== this._time || !this._ts && !prevPaused) {
                  pauseTween = 0;
                  next && (tTime += this._zTime = adjustedTime ? -1e-8 : _tinyNum);
                  break;
                }
              }
              child = next;
            }
          }
          if (pauseTween && !suppressEvents) {
            this.pause();
            pauseTween.render(time >= prevTime ? 0 : -1e-8)._zTime = time >= prevTime ? 1 : -1;
            if (this._ts) {
              this._start = prevStart;
              _setEnd(this);
              return this.render(totalTime, suppressEvents, force);
            }
          }
          this._onUpdate && !suppressEvents && _callback$1(this, "onUpdate", true);
          if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
            if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
              if (!this._lock) {
                (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
                if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
                  _callback$1(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
                  this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
                }
              }
            }
          }
        }
        return this;
      };
      _proto2.add = function add2(child, position) {
        var _this2 = this;
        _isNumber$1(position) || (position = _parsePosition$1(this, position, child));
        if (!(child instanceof Animation)) {
          if (_isArray(child)) {
            child.forEach(function (obj) {
              return _this2.add(obj, position);
            });
            return this;
          }
          if (_isString$2(child)) {
            return this.addLabel(child, position);
          }
          if (_isFunction$2(child)) {
            child = Tween.delayedCall(0, child);
          } else {
            return this;
          }
        }
        return this !== child ? _addToTimeline(this, child, position) : this;
      };
      _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
        if (nested === void 0) {
          nested = true;
        }
        if (tweens === void 0) {
          tweens = true;
        }
        if (timelines === void 0) {
          timelines = true;
        }
        if (ignoreBeforeTime === void 0) {
          ignoreBeforeTime = -1e8;
        }
        var a = [], child = this._first;
        while (child) {
          if (child._start >= ignoreBeforeTime) {
            if (child instanceof Tween) {
              tweens && a.push(child);
            } else {
              timelines && a.push(child);
              nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
            }
          }
          child = child._next;
        }
        return a;
      };
      _proto2.getById = function getById(id) {
        var animations = this.getChildren(1, 1, 1), i = animations.length;
        while (i--) {
          if (animations[i].vars.id === id) {
            return animations[i];
          }
        }
      };
      _proto2.remove = function remove(child) {
        if (_isString$2(child)) {
          return this.removeLabel(child);
        }
        if (_isFunction$2(child)) {
          return this.killTweensOf(child);
        }
        child.parent === this && _removeLinkedListItem(this, child);
        if (child === this._recent) {
          this._recent = this._last;
        }
        return _uncache(this);
      };
      _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
        if (!arguments.length) {
          return this._tTime;
        }
        this._forcing = 1;
        if (!this._dp && this._ts) {
          this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
        }
        _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
        this._forcing = 0;
        return this;
      };
      _proto2.addLabel = function addLabel(label, position) {
        this.labels[label] = _parsePosition$1(this, position);
        return this;
      };
      _proto2.removeLabel = function removeLabel(label) {
        delete this.labels[label];
        return this;
      };
      _proto2.addPause = function addPause(position, callback, params) {
        var t = Tween.delayedCall(0, callback || _emptyFunc, params);
        t.data = "isPause";
        this._hasPause = 1;
        return _addToTimeline(this, t, _parsePosition$1(this, position));
      };
      _proto2.removePause = function removePause(position) {
        var child = this._first;
        position = _parsePosition$1(this, position);
        while (child) {
          if (child._start === position && child.data === "isPause") {
            _removeFromParent(child);
          }
          child = child._next;
        }
      };
      _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
        var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
        while (i--) {
          _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
        }
        return this;
      };
      _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
        var a = [], parsedTargets = toArray$1(targets), child = this._first, isGlobalTime = _isNumber$1(onlyActive), children;
        while (child) {
          if (child instanceof Tween) {
            if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
              a.push(child);
            }
          } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
            a.push.apply(a, children);
          }
          child = child._next;
        }
        return a;
      };
      _proto2.tweenTo = function tweenTo(position, vars) {
        vars = vars || {};
        var tl = this, endTime = _parsePosition$1(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults$1({
          ease: vars.ease || "none",
          lazy: false,
          immediateRender: false,
          time: endTime,
          overwrite: "auto",
          duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
          onStart: function onStart() {
            tl.pause();
            if (!initted) {
              var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
              tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
              initted = 1;
            }
            _onStart && _onStart.apply(tween, onStartParams || []);
          }
        }, vars));
        return immediateRender ? tween.render(0) : tween;
      };
      _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
        return this.tweenTo(toPosition, _setDefaults$1({
          startAt: {
            time: _parsePosition$1(this, fromPosition)
          }
        }, vars));
      };
      _proto2.recent = function recent() {
        return this._recent;
      };
      _proto2.nextLabel = function nextLabel(afterTime) {
        if (afterTime === void 0) {
          afterTime = this._time;
        }
        return _getLabelInDirection(this, _parsePosition$1(this, afterTime));
      };
      _proto2.previousLabel = function previousLabel(beforeTime) {
        if (beforeTime === void 0) {
          beforeTime = this._time;
        }
        return _getLabelInDirection(this, _parsePosition$1(this, beforeTime), 1);
      };
      _proto2.currentLabel = function currentLabel(value) {
        return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
      };
      _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
        if (ignoreBeforeTime === void 0) {
          ignoreBeforeTime = 0;
        }
        var child = this._first, labels = this.labels, p;
        while (child) {
          if (child._start >= ignoreBeforeTime) {
            child._start += amount;
            child._end += amount;
          }
          child = child._next;
        }
        if (adjustLabels) {
          for (p in labels) {
            if (labels[p] >= ignoreBeforeTime) {
              labels[p] += amount;
            }
          }
        }
        return _uncache(this);
      };
      _proto2.invalidate = function invalidate(soft) {
        var child = this._first;
        this._lock = 0;
        while (child) {
          child.invalidate(soft);
          child = child._next;
        }
        return _Animation.prototype.invalidate.call(this, soft);
      };
      _proto2.clear = function clear(includeLabels) {
        if (includeLabels === void 0) {
          includeLabels = true;
        }
        var child = this._first, next;
        while (child) {
          next = child._next;
          this.remove(child);
          child = next;
        }
        this._dp && (this._time = this._tTime = this._pTime = 0);
        includeLabels && (this.labels = {});
        return _uncache(this);
      };
      _proto2.totalDuration = function totalDuration(value) {
        var max2 = 0, self = this, child = self._last, prevStart = _bigNum$1, prev, start, parent;
        if (arguments.length) {
          return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
        }
        if (self._dirty) {
          parent = self.parent;
          while (child) {
            prev = child._prev;
            child._dirty && child.totalDuration();
            start = child._start;
            if (start > prevStart && self._sort && child._ts && !self._lock) {
              self._lock = 1;
              _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
            } else {
              prevStart = start;
            }
            if (start < 0 && child._ts) {
              max2 -= start;
              if (!parent && !self._dp || parent && parent.smoothChildTiming) {
                self._start += start / self._ts;
                self._time -= start;
                self._tTime -= start;
              }
              self.shiftChildren(-start, false, -Infinity);
              prevStart = 0;
            }
            child._end > max2 && child._ts && (max2 = child._end);
            child = prev;
          }
          _setDuration(self, self === _globalTimeline && self._time > max2 ? self._time : max2, 1, 1);
          self._dirty = 0;
        }
        return self._tDur;
      };
      Timeline2.updateRoot = function updateRoot(time) {
        if (_globalTimeline._ts) {
          _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
          _lastRenderedFrame = _ticker.frame;
        }
        if (_ticker.frame >= _nextGCFrame) {
          _nextGCFrame += _config$1.autoSleep || 120;
          var child = _globalTimeline._first;
          if (!child || !child._ts) {
            if (_config$1.autoSleep && _ticker._listeners.length < 2) {
              while (child && !child._ts) {
                child = child._next;
              }
              child || _ticker.sleep();
            }
          }
        }
      };
      return Timeline2;
    }(Animation);
    _setDefaults$1(Timeline.prototype, {
      _lock: 0,
      _hasPause: 0,
      _forcing: 0
    });
    var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
      var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (hasRandom = ~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (stringFilter) {
        a = [start, end];
        stringFilter(a, target, prop);
        start = a[0];
        end = a[1];
      }
      startNums = start.match(_complexStringNumExp) || [];
      while (result = _complexStringNumExp.exec(end)) {
        endNum = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (chunk.substr(-5) === "rgba(") {
          color = 1;
        }
        if (endNum !== startNums[matchIndex++]) {
          startNum = parseFloat(startNums[matchIndex - 1]) || 0;
          pt._pt = {
            _next: pt._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
            m: color && color < 4 ? Math.round : 0
          };
          index = _complexStringNumExp.lastIndex;
        }
      }
      pt.c = index < end.length ? end.substring(index, end.length) : "";
      pt.fp = funcParam;
      if (_relExp.test(end) || hasRandom) {
        pt.e = 0;
      }
      this._pt = pt;
      return pt;
    }, _addPropTween = function _addPropTween2(target, prop, start, end, index, targets, modifier, stringFilter, funcParam, optional) {
      _isFunction$2(end) && (end = end(index || 0, target, targets));
      var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction$2(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction$2(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction$2(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
      if (_isString$2(end)) {
        if (~end.indexOf("random(")) {
          end = _replaceRandom(end);
        }
        if (end.charAt(1) === "=") {
          pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
          if (pt || pt === 0) {
            end = pt;
          }
        }
      }
      if (!optional || parsedStart !== end || _forceAllPropTweens) {
        if (!isNaN(parsedStart * end) && end !== "") {
          pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
          funcParam && (pt.fp = funcParam);
          modifier && pt.modifier(modifier, this, target);
          return this._pt = pt;
        }
        !currentValue && !(prop in target) && _missingPlugin(prop, end);
        return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config$1.stringFilter, funcParam);
      }
    }, _processVars = function _processVars2(vars, index, target, targets, tween) {
      _isFunction$2(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
      if (!_isObject$1(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
        return _isString$2(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
      }
      var copy = {}, p;
      for (p in vars) {
        copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
      }
      return copy;
    }, _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
      var plugin, pt, ptLookup, i;
      if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
        if (tween !== _quickTween) {
          ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
          i = plugin._props.length;
          while (i--) {
            ptLookup[plugin._props[i]] = pt;
          }
        }
      }
      return plugin;
    }, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween2(tween, time, tTime) {
      var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites$1, tl = tween.timeline, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
      tl && (!keyframes || !ease) && (ease = "none");
      tween._ease = _parseEase(ease, _defaults$1.ease);
      tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults$1.ease)) : 0;
      if (yoyoEase && tween._yoyo && !tween._repeat) {
        yoyoEase = tween._yEase;
        tween._yEase = tween._ease;
        tween._ease = yoyoEase;
      }
      tween._from = !tl && !!vars.runBackwards;
      if (!tl || keyframes && !vars.stagger) {
        harness = targets[0] ? _getCache(targets[0]).harness : 0;
        harnessVars = harness && vars[harness.prop];
        cleanVars = _copyExcluding(vars, _reservedProps);
        if (prevStartAt) {
          prevStartAt._zTime < 0 && prevStartAt.progress(1);
          time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
          prevStartAt._lazy = 0;
        }
        if (startAt) {
          _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults$1({
            data: "isStart",
            overwrite: false,
            parent,
            immediateRender: true,
            lazy: !prevStartAt && _isNotFalse(lazy),
            startAt: null,
            delay: 0,
            onUpdate: onUpdate && function () {
              return _callback$1(tween, "onUpdate");
            },
            stagger: 0
          }, startAt)));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
          if (immediateRender) {
            if (dur && time <= 0 && tTime <= 0) {
              time && (tween._zTime = time);
              return;
            }
          }
        } else if (runBackwards && dur) {
          if (!prevStartAt) {
            time && (immediateRender = false);
            p = _setDefaults$1({
              overwrite: false,
              data: "isFromStart",
              //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
              lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
              immediateRender,
              //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
              stagger: 0,
              parent
              //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
            }, cleanVars);
            harnessVars && (p[harness.prop] = harnessVars);
            _removeFromParent(tween._startAt = Tween.set(targets, p));
            tween._startAt._dp = 0;
            tween._startAt._sat = tween;
            time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
            tween._zTime = time;
            if (!immediateRender) {
              _initTween2(tween._startAt, _tinyNum, _tinyNum);
            } else if (!time) {
              return;
            }
          }
        }
        tween._pt = tween._ptCache = 0;
        lazy = dur && _isNotFalse(lazy) || lazy && !dur;
        for (i = 0; i < targets.length; i++) {
          target = targets[i];
          gsData = target._gsap || _harness(targets)[i]._gsap;
          tween._ptLookup[i] = ptLookup = {};
          _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
          index = fullTargets === targets ? i : fullTargets.indexOf(target);
          if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
            tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
            plugin._props.forEach(function (name) {
              ptLookup[name] = pt;
            });
            plugin.priority && (hasPriority = 1);
          }
          if (!harness || harnessVars) {
            for (p in cleanVars) {
              if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
                plugin.priority && (hasPriority = 1);
              } else {
                ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
              }
            }
          }
          tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
          if (autoOverwrite && tween._pt) {
            _overwritingTween = tween;
            _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
            overwritten = !tween.parent;
            _overwritingTween = 0;
          }
          tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
        }
        hasPriority && _sortPropTweensByPriority(tween);
        tween._onInit && tween._onInit(tween);
      }
      tween._onUpdate = onUpdate;
      tween._initted = (!tween._op || tween._pt) && !overwritten;
      keyframes && time <= 0 && tl.render(_bigNum$1, true, true);
    }, _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
      var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
      if (!ptCache) {
        ptCache = tween._ptCache[property] = [];
        lookup = tween._ptLookup;
        i = tween._targets.length;
        while (i--) {
          pt = lookup[i][property];
          if (pt && pt.d && pt.d._pt) {
            pt = pt.d._pt;
            while (pt && pt.p !== property && pt.fp !== property) {
              pt = pt._next;
            }
          }
          if (!pt) {
            _forceAllPropTweens = 1;
            tween.vars[property] = "+=0";
            _initTween(tween, time);
            _forceAllPropTweens = 0;
            return skipRecursion ? _warn(property + " not eligible for reset") : 1;
          }
          ptCache.push(pt);
        }
      }
      i = ptCache.length;
      while (i--) {
        rootPT = ptCache[i];
        pt = rootPT._pt || rootPT;
        pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
        pt.c = value - pt.s;
        rootPT.e && (rootPT.e = _round$2(value) + getUnit(rootPT.e));
        rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
      }
    }, _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
      var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases2;
      if (!propertyAliases) {
        return vars;
      }
      copy = _merge({}, vars);
      for (p in propertyAliases) {
        if (p in copy) {
          aliases2 = propertyAliases[p].split(",");
          i = aliases2.length;
          while (i--) {
            copy[aliases2[i]] = copy[p];
          }
        }
      }
      return copy;
    }, _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
      var ease = obj.ease || easeEach || "power1.inOut", p, a;
      if (_isArray(obj)) {
        a = allProps[prop] || (allProps[prop] = []);
        obj.forEach(function (value, i) {
          return a.push({
            t: i / (obj.length - 1) * 100,
            v: value,
            e: ease
          });
        });
      } else {
        for (p in obj) {
          a = allProps[p] || (allProps[p] = []);
          p === "ease" || a.push({
            t: parseFloat(prop),
            v: obj[p],
            e: ease
          });
        }
      }
    }, _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
      return _isFunction$2(value) ? value.call(tween, i, target, targets) : _isString$2(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
    }, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", _staggerPropsToSkip = {};
    _forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function (name) {
      return _staggerPropsToSkip[name] = 1;
    });
    var Tween = /* @__PURE__ */ function (_Animation2) {
      _inheritsLoose(Tween2, _Animation2);
      function Tween2(targets, vars, position, skipInherit) {
        var _this3;
        if (typeof vars === "number") {
          position.duration = vars;
          vars = position;
          position = null;
        }
        _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
        var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay2 = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber$1(targets[0]) : "length" in vars) ? [targets] : toArray$1(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
        _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config$1.nullTargetWarn) || [];
        _this3._ptLookup = [];
        _this3._overwrite = overwrite;
        if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay2)) {
          vars = _this3.vars;
          tl = _this3.timeline = new Timeline({
            data: "nested",
            defaults: defaults2 || {},
            targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
          });
          tl.kill();
          tl.parent = tl._dp = _assertThisInitialized(_this3);
          tl._start = 0;
          if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay2)) {
            l = parsedTargets.length;
            staggerFunc = stagger && distribute(stagger);
            if (_isObject$1(stagger)) {
              for (p in stagger) {
                if (~_staggerTweenProps.indexOf(p)) {
                  staggerVarsToMerge || (staggerVarsToMerge = {});
                  staggerVarsToMerge[p] = stagger[p];
                }
              }
            }
            for (i = 0; i < l; i++) {
              copy = _copyExcluding(vars, _staggerPropsToSkip);
              copy.stagger = 0;
              yoyoEase && (copy.yoyoEase = yoyoEase);
              staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
              curTarget = parsedTargets[i];
              copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
              copy.delay = (+_parseFuncOrString(delay2, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
              if (!stagger && l === 1 && copy.delay) {
                _this3._delay = delay2 = copy.delay;
                _this3._start += delay2;
                copy.delay = 0;
              }
              tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
              tl._ease = _easeMap.none;
            }
            tl.duration() ? duration = delay2 = 0 : _this3.timeline = 0;
          } else if (keyframes) {
            _inheritDefaults(_setDefaults$1(tl.vars.defaults, {
              ease: "none"
            }));
            tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
            var time = 0, a, kf, v;
            if (_isArray(keyframes)) {
              keyframes.forEach(function (frame) {
                return tl.to(parsedTargets, frame, ">");
              });
              tl.duration();
            } else {
              copy = {};
              for (p in keyframes) {
                p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
              }
              for (p in copy) {
                a = copy[p].sort(function (a2, b2) {
                  return a2.t - b2.t;
                });
                time = 0;
                for (i = 0; i < a.length; i++) {
                  kf = a[i];
                  v = {
                    ease: kf.e,
                    duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
                  };
                  v[p] = kf.v;
                  tl.to(parsedTargets, v, time);
                  time += v.duration;
                }
              }
              tl.duration() < duration && tl.to({}, {
                duration: duration - tl.duration()
              });
            }
          }
          duration || _this3.duration(duration = tl.duration());
        } else {
          _this3.timeline = 0;
        }
        if (overwrite === true && !_suppressOverwrites$1) {
          _overwritingTween = _assertThisInitialized(_this3);
          _globalTimeline.killTweensOf(parsedTargets);
          _overwritingTween = 0;
        }
        _addToTimeline(parent, _assertThisInitialized(_this3), position);
        vars.reversed && _this3.reverse();
        vars.paused && _this3.paused(true);
        if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
          _this3._tTime = -1e-8;
          _this3.render(Math.max(0, -delay2) || 0);
        }
        scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
        return _this3;
      }
      var _proto3 = Tween2.prototype;
      _proto3.render = function render(totalTime, suppressEvents, force) {
        var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline, yoyoEase;
        if (!dur) {
          _renderZeroDurationTween(this, totalTime, suppressEvents, force);
        } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
          time = tTime;
          timeline = this.timeline;
          if (this._repeat) {
            cycleDuration = dur + this._rDelay;
            if (this._repeat < -1 && isNegative) {
              return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
            }
            time = _roundPrecise(tTime % cycleDuration);
            if (tTime === tDur) {
              iteration = this._repeat;
              time = dur;
            } else {
              prevIteration = _roundPrecise(tTime / cycleDuration);
              iteration = ~~prevIteration;
              if (iteration && iteration === prevIteration) {
                time = dur;
                iteration--;
              } else if (time > dur) {
                time = dur;
              }
            }
            isYoyo = this._yoyo && iteration & 1;
            if (isYoyo) {
              yoyoEase = this._yEase;
              time = dur - time;
            }
            prevIteration = _animationCycle(this._tTime, cycleDuration);
            if (time === prevTime && !force && this._initted && iteration === prevIteration) {
              this._tTime = tTime;
              return this;
            }
            if (iteration !== prevIteration) {
              timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
              if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
                this._lock = force = 1;
                this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
              }
            }
          }
          if (!this._initted) {
            if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
              this._tTime = 0;
              return this;
            }
            if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
              return this;
            }
            if (dur !== this._dur) {
              return this.render(totalTime, suppressEvents, force);
            }
          }
          this._tTime = tTime;
          this._time = time;
          if (!this._act && this._ts) {
            this._act = 1;
            this._lazy = 0;
          }
          this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
          if (this._from) {
            this.ratio = ratio = 1 - ratio;
          }
          if (time && !prevTime && !suppressEvents && !iteration) {
            _callback$1(this, "onStart");
            if (this._tTime !== tTime) {
              return this;
            }
          }
          pt = this._pt;
          while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
          }
          timeline && timeline.render(totalTime < 0 ? totalTime : timeline._dur * timeline._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
          if (this._onUpdate && !suppressEvents) {
            isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
            _callback$1(this, "onUpdate");
          }
          this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback$1(this, "onRepeat");
          if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
            isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
            (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
              _callback$1(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
              this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
            }
          }
        }
        return this;
      };
      _proto3.targets = function targets() {
        return this._targets;
      };
      _proto3.invalidate = function invalidate(soft) {
        (!soft || !this.vars.runBackwards) && (this._startAt = 0);
        this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
        this._ptLookup = [];
        this.timeline && this.timeline.invalidate(soft);
        return _Animation2.prototype.invalidate.call(this, soft);
      };
      _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
        _tickerActive || _ticker.wake();
        this._ts || this.play();
        var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
        this._initted || _initTween(this, time);
        ratio = this._ease(time / this._dur);
        if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
          return this.resetTo(property, value, start, startIsRelative, 1);
        }
        _alignPlayhead(this, 0);
        this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
        return this.render(0);
      };
      _proto3.kill = function kill(targets, vars) {
        if (vars === void 0) {
          vars = "all";
        }
        if (!targets && (!vars || vars === "all")) {
          this._lazy = this._pt = 0;
          this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
          return this;
        }
        if (this.timeline) {
          var tDur = this.timeline.totalDuration();
          this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
          this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
          return this;
        }
        var parsedTargets = this._targets, killingTargets = targets ? toArray$1(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
        if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
          vars === "all" && (this._pt = 0);
          return _interrupt(this);
        }
        overwrittenProps = this._op = this._op || [];
        if (vars !== "all") {
          if (_isString$2(vars)) {
            p = {};
            _forEachName(vars, function (name) {
              return p[name] = 1;
            });
            vars = p;
          }
          vars = _addAliasesToVars(parsedTargets, vars);
        }
        i = parsedTargets.length;
        while (i--) {
          if (~killingTargets.indexOf(parsedTargets[i])) {
            curLookup = propTweenLookup[i];
            if (vars === "all") {
              overwrittenProps[i] = vars;
              props = curLookup;
              curOverwriteProps = {};
            } else {
              curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
              props = vars;
            }
            for (p in props) {
              pt = curLookup && curLookup[p];
              if (pt) {
                if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                  _removeLinkedListItem(this, pt, "_pt");
                }
                delete curLookup[p];
              }
              if (curOverwriteProps !== "all") {
                curOverwriteProps[p] = 1;
              }
            }
          }
        }
        this._initted && !this._pt && firstPT && _interrupt(this);
        return this;
      };
      Tween2.to = function to2(targets, vars) {
        return new Tween2(targets, vars, arguments[2]);
      };
      Tween2.from = function from2(targets, vars) {
        return _createTweenType(1, arguments);
      };
      Tween2.delayedCall = function delayedCall(delay2, callback, params, scope) {
        return new Tween2(callback, 0, {
          immediateRender: false,
          lazy: false,
          overwrite: false,
          delay: delay2,
          onComplete: callback,
          onReverseComplete: callback,
          onCompleteParams: params,
          onReverseCompleteParams: params,
          callbackScope: scope
        });
      };
      Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
        return _createTweenType(2, arguments);
      };
      Tween2.set = function set2(targets, vars) {
        vars.duration = 0;
        vars.repeatDelay || (vars.repeat = 0);
        return new Tween2(targets, vars);
      };
      Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
        return _globalTimeline.killTweensOf(targets, props, onlyActive);
      };
      return Tween2;
    }(Animation);
    _setDefaults$1(Tween.prototype, {
      _targets: [],
      _lazy: 0,
      _startAt: 0,
      _op: 0,
      _onInit: 0
    });
    _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
      Tween[name] = function () {
        var tl = new Timeline(), params = _slice.call(arguments, 0);
        params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
        return tl[name].apply(tl, params);
      };
    });
    var _setterPlain = function _setterPlain2(target, property, value) {
      return target[property] = value;
    }, _setterFunc = function _setterFunc2(target, property, value) {
      return target[property](value);
    }, _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
      return target[property](data.fp, value);
    }, _setterAttribute = function _setterAttribute2(target, property, value) {
      return target.setAttribute(property, value);
    }, _getSetter = function _getSetter2(target, property) {
      return _isFunction$2(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
    }, _renderPlain = function _renderPlain2(ratio, data) {
      return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
    }, _renderBoolean = function _renderBoolean2(ratio, data) {
      return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
    }, _renderComplexString = function _renderComplexString2(ratio, data) {
      var pt = data._pt, s = "";
      if (!ratio && data.b) {
        s = data.b;
      } else if (ratio === 1 && data.e) {
        s = data.e;
      } else {
        while (pt) {
          s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
          pt = pt._next;
        }
        s += data.c;
      }
      data.set(data.t, data.p, s, data);
    }, _renderPropTweens = function _renderPropTweens2(ratio, data) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    }, _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
      var pt = this._pt, next;
      while (pt) {
        next = pt._next;
        pt.p === property && pt.modifier(modifier, tween, target);
        pt = next;
      }
    }, _killPropTweensOf = function _killPropTweensOf2(property) {
      var pt = this._pt, hasNonDependentRemaining, next;
      while (pt) {
        next = pt._next;
        if (pt.p === property && !pt.op || pt.op === property) {
          _removeLinkedListItem(this, pt, "_pt");
        } else if (!pt.dep) {
          hasNonDependentRemaining = 1;
        }
        pt = next;
      }
      return !hasNonDependentRemaining;
    }, _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
      data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
    }, _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
      var pt = parent._pt, next, pt2, first, last;
      while (pt) {
        next = pt._next;
        pt2 = first;
        while (pt2 && pt2.pr > pt.pr) {
          pt2 = pt2._next;
        }
        if (pt._prev = pt2 ? pt2._prev : last) {
          pt._prev._next = pt;
        } else {
          first = pt;
        }
        if (pt._next = pt2) {
          pt2._prev = pt;
        } else {
          last = pt;
        }
        pt = next;
      }
      parent._pt = first;
    };
    var PropTween = /* @__PURE__ */ function () {
      function PropTween2(next, target, prop, start, change, renderer, data, setter, priority) {
        this.t = target;
        this.s = start;
        this.c = change;
        this.p = prop;
        this.r = renderer || _renderPlain;
        this.d = data || this;
        this.set = setter || _setterPlain;
        this.pr = priority || 0;
        this._next = next;
        if (next) {
          next._prev = this;
        }
      }
      var _proto4 = PropTween2.prototype;
      _proto4.modifier = function modifier(func, tween, target) {
        this.mSet = this.mSet || this.set;
        this.set = _setterWithModifier;
        this.m = func;
        this.mt = target;
        this.tween = tween;
      };
      return PropTween2;
    }();
    _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
      return _reservedProps[name] = 1;
    });
    _globals.TweenMax = _globals.TweenLite = Tween;
    _globals.TimelineLite = _globals.TimelineMax = Timeline;
    _globalTimeline = new Timeline({
      sortChildren: false,
      defaults: _defaults$1,
      autoRemoveChildren: true,
      id: "root",
      smoothChildTiming: true
    });
    _config$1.stringFilter = _colorStringFilter;
    var _media = [], _listeners$1 = {}, _emptyArray$1 = [], _lastMediaTime = 0, _contextID = 0, _dispatch$1 = function _dispatch2(type) {
      return (_listeners$1[type] || _emptyArray$1).map(function (f) {
        return f();
      });
    }, _onMediaChange = function _onMediaChange2() {
      var time = Date.now(), matches = [];
      if (time - _lastMediaTime > 2) {
        _dispatch$1("matchMediaInit");
        _media.forEach(function (c) {
          var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
          for (p in queries) {
            match = _win$4.matchMedia(queries[p]).matches;
            match && (anyMatch = 1);
            if (match !== conditions[p]) {
              conditions[p] = match;
              toggled = 1;
            }
          }
          if (toggled) {
            c.revert();
            anyMatch && matches.push(c);
          }
        });
        _dispatch$1("matchMediaRevert");
        matches.forEach(function (c) {
          return c.onMatch(c, function (func) {
            return c.add(null, func);
          });
        });
        _lastMediaTime = time;
        _dispatch$1("matchMedia");
      }
    };
    var Context = /* @__PURE__ */ function () {
      function Context2(func, scope) {
        this.selector = scope && selector(scope);
        this.data = [];
        this._r = [];
        this.isReverted = false;
        this.id = _contextID++;
        func && this.add(func);
      }
      var _proto5 = Context2.prototype;
      _proto5.add = function add2(name, func, scope) {
        if (_isFunction$2(name)) {
          scope = func;
          func = name;
          name = _isFunction$2;
        }
        var self = this, f = function f2() {
          var prev = _context$3, prevSelector = self.selector, result;
          prev && prev !== self && prev.data.push(self);
          scope && (self.selector = selector(scope));
          _context$3 = self;
          result = func.apply(self, arguments);
          _isFunction$2(result) && self._r.push(result);
          _context$3 = prev;
          self.selector = prevSelector;
          self.isReverted = false;
          return result;
        };
        self.last = f;
        return name === _isFunction$2 ? f(self, function (func2) {
          return self.add(null, func2);
        }) : name ? self[name] = f : f;
      };
      _proto5.ignore = function ignore(func) {
        var prev = _context$3;
        _context$3 = null;
        func(this);
        _context$3 = prev;
      };
      _proto5.getTweens = function getTweens() {
        var a = [];
        this.data.forEach(function (e) {
          return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
        });
        return a;
      };
      _proto5.clear = function clear() {
        this._r.length = this.data.length = 0;
      };
      _proto5.kill = function kill(revert, matchMedia) {
        var _this4 = this;
        if (revert) {
          (function () {
            var tweens = _this4.getTweens(), i2 = _this4.data.length, t;
            while (i2--) {
              t = _this4.data[i2];
              if (t.data === "isFlip") {
                t.revert();
                t.getChildren(true, true, false).forEach(function (tween) {
                  return tweens.splice(tweens.indexOf(tween), 1);
                });
              }
            }
            tweens.map(function (t2) {
              return {
                g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
                t: t2
              };
            }).sort(function (a, b2) {
              return b2.g - a.g || -Infinity;
            }).forEach(function (o) {
              return o.t.revert(revert);
            });
            i2 = _this4.data.length;
            while (i2--) {
              t = _this4.data[i2];
              if (t instanceof Timeline) {
                if (t.data !== "nested") {
                  t.scrollTrigger && t.scrollTrigger.revert();
                  t.kill();
                }
              } else {
                !(t instanceof Tween) && t.revert && t.revert(revert);
              }
            }
            _this4._r.forEach(function (f) {
              return f(revert, _this4);
            });
            _this4.isReverted = true;
          })();
        } else {
          this.data.forEach(function (e) {
            return e.kill && e.kill();
          });
        }
        this.clear();
        if (matchMedia) {
          var i = _media.length;
          while (i--) {
            _media[i].id === this.id && _media.splice(i, 1);
          }
        }
      };
      _proto5.revert = function revert(config) {
        this.kill(config || {});
      };
      return Context2;
    }();
    var MatchMedia = /* @__PURE__ */ function () {
      function MatchMedia2(scope) {
        this.contexts = [];
        this.scope = scope;
        _context$3 && _context$3.data.push(this);
      }
      var _proto6 = MatchMedia2.prototype;
      _proto6.add = function add2(conditions, func, scope) {
        _isObject$1(conditions) || (conditions = {
          matches: conditions
        });
        var context = new Context(0, scope || this.scope), cond = context.conditions = {}, mq, p, active;
        _context$3 && !context.selector && (context.selector = _context$3.selector);
        this.contexts.push(context);
        func = context.add("onMatch", func);
        context.queries = conditions;
        for (p in conditions) {
          if (p === "all") {
            active = 1;
          } else {
            mq = _win$4.matchMedia(conditions[p]);
            if (mq) {
              _media.indexOf(context) < 0 && _media.push(context);
              (cond[p] = mq.matches) && (active = 1);
              mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
            }
          }
        }
        active && func(context, function (f) {
          return context.add(null, f);
        });
        return this;
      };
      _proto6.revert = function revert(config) {
        this.kill(config || {});
      };
      _proto6.kill = function kill(revert) {
        this.contexts.forEach(function (c) {
          return c.kill(revert, true);
        });
      };
      return MatchMedia2;
    }();
    var _gsap = {
      registerPlugin: function registerPlugin() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        args.forEach(function (config) {
          return _createPlugin(config);
        });
      },
      timeline: function timeline(vars) {
        return new Timeline(vars);
      },
      getTweensOf: function getTweensOf(targets, onlyActive) {
        return _globalTimeline.getTweensOf(targets, onlyActive);
      },
      getProperty: function getProperty(target, property, unit, uncache) {
        _isString$2(target) && (target = toArray$1(target)[0]);
        var getter = _getCache(target || {}).get, format2 = unit ? _passThrough$1 : _numericIfPossible;
        unit === "native" && (unit = "");
        return !target ? target : !property ? function (property2, unit2, uncache2) {
          return format2((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
        } : format2((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
      },
      quickSetter: function quickSetter(target, property, unit) {
        target = toArray$1(target);
        if (target.length > 1) {
          var setters = target.map(function (t) {
            return gsap$4.quickSetter(t, property, unit);
          }), l = setters.length;
          return function (value) {
            var i = l;
            while (i--) {
              setters[i](value);
            }
          };
        }
        target = target[0] || {};
        var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function (value) {
          var p2 = new Plugin();
          _quickTween._pt = 0;
          p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
          p2.render(1, p2);
          _quickTween._pt && _renderPropTweens(1, _quickTween);
        } : cache.set(target, p);
        return Plugin ? setter : function (value) {
          return setter(target, p, unit ? value + unit : value, cache, 1);
        };
      },
      quickTo: function quickTo(target, property, vars) {
        var _setDefaults2;
        var tween = gsap$4.to(target, _setDefaults$1((_setDefaults2 = {}, _setDefaults2[property] = "+=0.1", _setDefaults2.paused = true, _setDefaults2.stagger = 0, _setDefaults2), vars || {})), func = function func2(value, start, startIsRelative) {
          return tween.resetTo(property, value, start, startIsRelative);
        };
        func.tween = tween;
        return func;
      },
      isTweening: function isTweening(targets) {
        return _globalTimeline.getTweensOf(targets, true).length > 0;
      },
      defaults: function defaults2(value) {
        value && value.ease && (value.ease = _parseEase(value.ease, _defaults$1.ease));
        return _mergeDeep(_defaults$1, value || {});
      },
      config: function config(value) {
        return _mergeDeep(_config$1, value || {});
      },
      registerEffect: function registerEffect(_ref3) {
        var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
        (plugins || "").split(",").forEach(function (pluginName) {
          return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
        });
        _effects[name] = function (targets, vars, tl) {
          return effect(toArray$1(targets), _setDefaults$1(vars || {}, defaults2), tl);
        };
        if (extendTimeline) {
          Timeline.prototype[name] = function (targets, vars, position) {
            return this.add(_effects[name](targets, _isObject$1(vars) ? vars : (position = vars) && {}, this), position);
          };
        }
      },
      registerEase: function registerEase(name, ease) {
        _easeMap[name] = _parseEase(ease);
      },
      parseEase: function parseEase(ease, defaultEase) {
        return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
      },
      getById: function getById(id) {
        return _globalTimeline.getById(id);
      },
      exportRoot: function exportRoot(vars, includeDelayedCalls) {
        if (vars === void 0) {
          vars = {};
        }
        var tl = new Timeline(vars), child, next;
        tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
        _globalTimeline.remove(tl);
        tl._dp = 0;
        tl._time = tl._tTime = _globalTimeline._time;
        child = _globalTimeline._first;
        while (child) {
          next = child._next;
          if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
            _addToTimeline(tl, child, child._start - child._delay);
          }
          child = next;
        }
        _addToTimeline(_globalTimeline, tl, 0);
        return tl;
      },
      context: function context(func, scope) {
        return func ? new Context(func, scope) : _context$3;
      },
      matchMedia: function matchMedia(scope) {
        return new MatchMedia(scope);
      },
      matchMediaRefresh: function matchMediaRefresh() {
        return _media.forEach(function (c) {
          var cond = c.conditions, found, p;
          for (p in cond) {
            if (cond[p]) {
              cond[p] = false;
              found = 1;
            }
          }
          found && c.revert();
        }) || _onMediaChange();
      },
      addEventListener: function addEventListener(type, callback) {
        var a = _listeners$1[type] || (_listeners$1[type] = []);
        ~a.indexOf(callback) || a.push(callback);
      },
      removeEventListener: function removeEventListener(type, callback) {
        var a = _listeners$1[type], i = a && a.indexOf(callback);
        i >= 0 && a.splice(i, 1);
      },
      utils: {
        wrap,
        wrapYoyo,
        distribute,
        random,
        snap,
        normalize,
        getUnit,
        clamp,
        splitColor,
        toArray: toArray$1,
        selector,
        mapRange,
        pipe,
        unitize,
        interpolate,
        shuffle
      },
      install: _install,
      effects: _effects,
      ticker: _ticker,
      updateRoot: Timeline.updateRoot,
      plugins: _plugins,
      globalTimeline: _globalTimeline,
      core: {
        PropTween,
        globals: _addGlobal,
        Tween,
        Timeline,
        Animation,
        getCache: _getCache,
        _removeLinkedListItem,
        reverting: function reverting() {
          return _reverting$1;
        },
        context: function context(toAdd) {
          if (toAdd && _context$3) {
            _context$3.data.push(toAdd);
            toAdd._ctx = _context$3;
          }
          return _context$3;
        },
        suppressOverwrites: function suppressOverwrites(value) {
          return _suppressOverwrites$1 = value;
        }
      }
    };
    _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
      return _gsap[name] = Tween[name];
    });
    _ticker.add(Timeline.updateRoot);
    _quickTween = _gsap.to({}, {
      duration: 0
    });
    var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
      var pt = plugin._pt;
      while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
        pt = pt._next;
      }
      return pt;
    }, _addModifiers = function _addModifiers2(tween, modifiers) {
      var targets = tween._targets, p, i, pt;
      for (p in modifiers) {
        i = targets.length;
        while (i--) {
          pt = tween._ptLookup[i][p];
          if (pt && (pt = pt.d)) {
            if (pt._pt) {
              pt = _getPluginPropTween(pt, p);
            }
            pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
          }
        }
      }
    }, _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
      return {
        name,
        rawVars: 1,
        //don't pre-process function-based values or "random()" strings.
        init: function init(target, vars, tween) {
          tween._onInit = function (tween2) {
            var temp, p;
            if (_isString$2(vars)) {
              temp = {};
              _forEachName(vars, function (name2) {
                return temp[name2] = 1;
              });
              vars = temp;
            }
            if (modifier) {
              temp = {};
              for (p in vars) {
                temp[p] = modifier(vars[p]);
              }
              vars = temp;
            }
            _addModifiers(tween2, vars);
          };
        }
      };
    };
    var gsap$4 = _gsap.registerPlugin({
      name: "attr",
      init: function init(target, vars, tween, index, targets) {
        var p, pt, v;
        this.tween = tween;
        for (p in vars) {
          v = target.getAttribute(p) || "";
          pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
          pt.op = p;
          pt.b = v;
          this._props.push(p);
        }
      },
      render: function render(ratio, data) {
        var pt = data._pt;
        while (pt) {
          _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
          pt = pt._next;
        }
      }
    }, {
      name: "endArray",
      init: function init(target, value) {
        var i = value.length;
        while (i--) {
          this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
        }
      }
    }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
    Tween.version = Timeline.version = gsap$4.version = "3.12.7";
    _coreReady = 1;
    _windowExists$4() && _wake();
    var Power0 = _easeMap.Power0;
    _easeMap.Power1;
    _easeMap.Power2;
    var Power3 = _easeMap.Power3;
    _easeMap.Power4;
    _easeMap.Linear;
    _easeMap.Quad;
    _easeMap.Cubic;
    _easeMap.Quart;
    _easeMap.Quint;
    _easeMap.Strong;
    _easeMap.Elastic;
    var Back = _easeMap.Back;
    _easeMap.SteppedEase;
    _easeMap.Bounce;
    _easeMap.Sine;
    _easeMap.Expo;
    _easeMap.Circ;
    /*!
     * CSSPlugin 3.12.7
     * https://gsap.com
     *
     * Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var _win$3, _doc$3, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, _reverting, _windowExists$3 = function _windowExists2() {
      return typeof window !== "undefined";
    }, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, _bigNum = 1e8, _capsExp$1 = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
      autoAlpha: "opacity,visibility",
      scale: "scaleX,scaleY",
      alpha: "opacity"
    }, _renderCSSProp = function _renderCSSProp2(ratio, data) {
      return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    }, _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
      return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
    }, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
      return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
    }, _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
      var value = data.s + data.c * ratio;
      data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
    }, _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
      return data.set(data.t, data.p, ratio ? data.e : data.b, data);
    }, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
      return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
    }, _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
      return target.style[property] = value;
    }, _setterCSSProp = function _setterCSSProp2(target, property, value) {
      return target.style.setProperty(property, value);
    }, _setterTransform = function _setterTransform2(target, property, value) {
      return target._gsap[property] = value;
    }, _setterScale = function _setterScale2(target, property, value) {
      return target._gsap.scaleX = target._gsap.scaleY = value;
    }, _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
      var cache = target._gsap;
      cache.scaleX = cache.scaleY = value;
      cache.renderTransform(ratio, cache);
    }, _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
      var cache = target._gsap;
      cache[property] = value;
      cache.renderTransform(ratio, cache);
    }, _transformProp$1 = "transform", _transformOriginProp = _transformProp$1 + "Origin", _saveStyle = function _saveStyle2(property, isNotCSS) {
      var _this = this;
      var target = this.target, style = target.style, cache = target._gsap;
      if (property in _transformProps && style) {
        this.tfm = this.tfm || {};
        if (property !== "transform") {
          property = _propertyAliases[property] || property;
          ~property.indexOf(",") ? property.split(",").forEach(function (a) {
            return _this.tfm[a] = _get(target, a);
          }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
          property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
        } else {
          return _propertyAliases.transform.split(",").forEach(function (p) {
            return _saveStyle2.call(_this, p, isNotCSS);
          });
        }
        if (this.props.indexOf(_transformProp$1) >= 0) {
          return;
        }
        if (cache.svg) {
          this.svgo = target.getAttribute("data-svg-origin");
          this.props.push(_transformOriginProp, isNotCSS, "");
        }
        property = _transformProp$1;
      }
      (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
    }, _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
      if (style.translate) {
        style.removeProperty("translate");
        style.removeProperty("scale");
        style.removeProperty("rotate");
      }
    }, _revertStyle = function _revertStyle2() {
      var props = this.props, target = this.target, style = target.style, cache = target._gsap, i, p;
      for (i = 0; i < props.length; i += 3) {
        if (!props[i + 1]) {
          props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp$1, "-$1").toLowerCase());
        } else if (props[i + 1] === 2) {
          target[props[i]](props[i + 2]);
        } else {
          target[props[i]] = props[i + 2];
        }
      }
      if (this.tfm) {
        for (p in this.tfm) {
          cache[p] = this.tfm[p];
        }
        if (cache.svg) {
          cache.renderTransform();
          target.setAttribute("data-svg-origin", this.svgo || "");
        }
        i = _reverting();
        if ((!i || !i.isStart) && !style[_transformProp$1]) {
          _removeIndependentTransforms(style);
          if (cache.zOrigin && style[_transformOriginProp]) {
            style[_transformOriginProp] += " " + cache.zOrigin + "px";
            cache.zOrigin = 0;
            cache.renderTransform();
          }
          cache.uncache = 1;
        }
      }
    }, _getStyleSaver = function _getStyleSaver2(target, properties) {
      var saver = {
        target,
        props: [],
        revert: _revertStyle,
        save: _saveStyle
      };
      target._gsap || gsap$4.core.getCache(target);
      properties && target.style && target.nodeType && properties.split(",").forEach(function (p) {
        return saver.save(p);
      });
      return saver;
    }, _supports3D, _createElement = function _createElement2(type, ns) {
      var e = _doc$3.createElementNS ? _doc$3.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$3.createElement(type);
      return e && e.style ? e : _doc$3.createElement(type);
    }, _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
      var cs = getComputedStyle(target);
      return cs[property] || cs.getPropertyValue(property.replace(_capsExp$1, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
    }, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
      var e = element || _tempDiv, s = e.style, i = 5;
      if (property in s && !preferPrefix) {
        return property;
      }
      property = property.charAt(0).toUpperCase() + property.substr(1);
      while (i-- && !(_prefixes[i] + property in s)) {
      }
      return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
    }, _initCore$2 = function _initCore2() {
      if (_windowExists$3() && window.document) {
        _win$3 = window;
        _doc$3 = _win$3.document;
        _docElement = _doc$3.documentElement;
        _tempDiv = _createElement("div") || {
          style: {}
        };
        _createElement("div");
        _transformProp$1 = _checkPropPrefix(_transformProp$1);
        _transformOriginProp = _transformProp$1 + "Origin";
        _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
        _supports3D = !!_checkPropPrefix("perspective");
        _reverting = gsap$4.core.reverting;
        _pluginInitted = 1;
      }
    }, _getReparentedCloneBBox = function _getReparentedCloneBBox2(target) {
      var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone2 = target.cloneNode(true), bbox;
      clone2.style.display = "block";
      svg.appendChild(clone2);
      _docElement.appendChild(svg);
      try {
        bbox = clone2.getBBox();
      } catch (e) {
      }
      svg.removeChild(clone2);
      _docElement.removeChild(svg);
      return bbox;
    }, _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
      var i = attributesArray.length;
      while (i--) {
        if (target.hasAttribute(attributesArray[i])) {
          return target.getAttribute(attributesArray[i]);
        }
      }
    }, _getBBox = function _getBBox2(target) {
      var bounds, cloned;
      try {
        bounds = target.getBBox();
      } catch (error) {
        bounds = _getReparentedCloneBBox(target);
        cloned = 1;
      }
      bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
      return bounds && !bounds.width && !bounds.x && !bounds.y ? {
        x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
        y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
        width: 0,
        height: 0
      } : bounds;
    }, _isSVG = function _isSVG2(e) {
      return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
    }, _removeProperty = function _removeProperty2(target, property) {
      if (property) {
        var style = target.style, first2Chars;
        if (property in _transformProps && property !== _transformOriginProp) {
          property = _transformProp$1;
        }
        if (style.removeProperty) {
          first2Chars = property.substr(0, 2);
          if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
            property = "-" + property;
          }
          style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp$1, "-$1").toLowerCase());
        } else {
          style.removeAttribute(property);
        }
      }
    }, _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
      var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
      plugin._pt = pt;
      pt.b = beginning;
      pt.e = end;
      plugin._props.push(property);
      return pt;
    }, _nonConvertibleUnits = {
      deg: 1,
      rad: 1,
      turn: 1
    }, _nonStandardLayouts = {
      grid: 1,
      flex: 1
    }, _convertToUnit = function _convertToUnit2(target, property, value, unit) {
      var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent, cache, isSVG;
      if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
        return curValue;
      }
      curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
      isSVG = target.getCTM && _isSVG(target);
      if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
        px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
        return _round$2(toPercent ? curValue / px * amount : curValue / 100 * px);
      }
      style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
      parent = unit !== "rem" && ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
      if (isSVG) {
        parent = (target.ownerSVGElement || {}).parentNode;
      }
      if (!parent || parent === _doc$3 || !parent.appendChild) {
        parent = _doc$3.body;
      }
      cache = parent._gsap;
      if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
        return _round$2(curValue / cache.width * amount);
      } else {
        if (toPercent && (property === "height" || property === "width")) {
          var v = target.style[property];
          target.style[property] = amount + unit;
          px = target[measureProperty];
          v ? target.style[property] = v : _removeProperty(target, property);
        } else {
          (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
          parent === target && (style.position = "static");
          parent.appendChild(_tempDiv);
          px = _tempDiv[measureProperty];
          parent.removeChild(_tempDiv);
          style.position = "absolute";
        }
        if (horizontal && toPercent) {
          cache = _getCache(parent);
          cache.time = _ticker.time;
          cache.width = parent[measureProperty];
        }
      }
      return _round$2(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
    }, _get = function _get2(target, property, unit, uncache) {
      var value;
      _pluginInitted || _initCore$2();
      if (property in _propertyAliases && property !== "transform") {
        property = _propertyAliases[property];
        if (~property.indexOf(",")) {
          property = property.split(",")[0];
        }
      }
      if (_transformProps[property] && property !== "transform") {
        value = _parseTransform(target, uncache);
        value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
      } else {
        value = target.style[property];
        if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
          value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
        }
      }
      return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
    }, _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
      if (!start || start === "none") {
        var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
        if (s && s !== start) {
          prop = p;
          start = s;
        } else if (prop === "borderColor") {
          start = _getComputedProperty(target, "borderTopColor");
        }
      }
      var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
      pt.b = start;
      pt.e = end;
      start += "";
      end += "";
      if (end === "auto") {
        startValue = target.style[prop];
        target.style[prop] = end;
        end = _getComputedProperty(target, prop) || end;
        startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
      }
      a = [start, end];
      _colorStringFilter(a);
      start = a[0];
      end = a[1];
      startValues = start.match(_numWithUnitExp) || [];
      endValues = end.match(_numWithUnitExp) || [];
      if (endValues.length) {
        while (result = _numWithUnitExp.exec(end)) {
          endValue = result[0];
          chunk = end.substring(index, result.index);
          if (color) {
            color = (color + 1) % 5;
          } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
            color = 1;
          }
          if (endValue !== (startValue = startValues[matchIndex++] || "")) {
            startNum = parseFloat(startValue) || 0;
            startUnit = startValue.substr((startNum + "").length);
            endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
            endNum = parseFloat(endValue);
            endUnit = endValue.substr((endNum + "").length);
            index = _numWithUnitExp.lastIndex - endUnit.length;
            if (!endUnit) {
              endUnit = endUnit || _config$1.units[prop] || startUnit;
              if (index === end.length) {
                end += endUnit;
                pt.e += endUnit;
              }
            }
            if (startUnit !== endUnit) {
              startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
            }
            pt._pt = {
              _next: pt._pt,
              p: chunk || matchIndex === 1 ? chunk : ",",
              //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
              s: startNum,
              c: endNum - startNum,
              m: color && color < 4 || prop === "zIndex" ? Math.round : 0
            };
          }
        }
        pt.c = index < end.length ? end.substring(index, end.length) : "";
      } else {
        pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
      }
      _relExp.test(end) && (pt.e = 0);
      this._pt = pt;
      return pt;
    }, _keywordToPercent = {
      top: "0%",
      bottom: "100%",
      left: "0%",
      right: "100%",
      center: "50%"
    }, _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
      var split = value.split(" "), x = split[0], y = split[1] || "50%";
      if (x === "top" || x === "bottom" || y === "left" || y === "right") {
        value = x;
        x = y;
        y = value;
      }
      split[0] = _keywordToPercent[x] || x;
      split[1] = _keywordToPercent[y] || y;
      return split.join(" ");
    }, _renderClearProps = function _renderClearProps2(ratio, data) {
      if (data.tween && data.tween._time === data.tween._dur) {
        var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop, clearTransforms, i;
        if (props === "all" || props === true) {
          style.cssText = "";
          clearTransforms = 1;
        } else {
          props = props.split(",");
          i = props.length;
          while (--i > -1) {
            prop = props[i];
            if (_transformProps[prop]) {
              clearTransforms = 1;
              prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp$1;
            }
            _removeProperty(target, prop);
          }
        }
        if (clearTransforms) {
          _removeProperty(target, _transformProp$1);
          if (cache) {
            cache.svg && target.removeAttribute("transform");
            style.scale = style.rotate = style.translate = "none";
            _parseTransform(target, 1);
            cache.uncache = 1;
            _removeIndependentTransforms(style);
          }
        }
      }
    }, _specialProps = {
      clearProps: function clearProps(plugin, target, property, endValue, tween) {
        if (tween.data !== "isFromStart") {
          var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
          pt.u = endValue;
          pt.pr = -10;
          pt.tween = tween;
          plugin._props.push(property);
          return 1;
        }
      }
      /* className feature (about 0.4kb gzipped).
      , className(plugin, target, property, endValue, tween) {
        let _renderClassName = (ratio, data) => {
            data.css.render(ratio, data.css);
            if (!ratio || ratio === 1) {
              let inline = data.rmv,
                target = data.t,
                p;
              target.setAttribute("class", ratio ? data.e : data.b);
              for (p in inline) {
                _removeProperty(target, p);
              }
            }
          },
          _getAllStyles = (target) => {
            let styles = {},
              computed = getComputedStyle(target),
              p;
            for (p in computed) {
              if (isNaN(p) && p !== "cssText" && p !== "length") {
                styles[p] = computed[p];
              }
            }
            _setDefaults(styles, _parseTransform(target, 1));
            return styles;
          },
          startClassList = target.getAttribute("class"),
          style = target.style,
          cssText = style.cssText,
          cache = target._gsap,
          classPT = cache.classPT,
          inlineToRemoveAtEnd = {},
          data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
          changingVars = {},
          startVars = _getAllStyles(target),
          transformRelated = /(transform|perspective)/i,
          endVars, p;
        if (classPT) {
          classPT.r(1, classPT.d);
          _removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
        }
        target.setAttribute("class", data.e);
        endVars = _getAllStyles(target, true);
        target.setAttribute("class", startClassList);
        for (p in endVars) {
          if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
            changingVars[p] = endVars[p];
            if (!style[p] && style[p] !== "0") {
              inlineToRemoveAtEnd[p] = 1;
            }
          }
        }
        cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
        if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
          style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
        }
        _parseTransform(target, true); //to clear the caching of transforms
        data.css = new gsap.plugins.css();
        data.css.init(target, changingVars, tween);
        plugin._props.push(...data.css._props);
        return 1;
      }
      */
    }, _identity2DMatrix = [1, 0, 0, 1, 0, 0], _rotationalProperties = {}, _isNullTransform = function _isNullTransform2(value) {
      return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
    }, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
      var matrixString = _getComputedProperty(target, _transformProp$1);
      return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round$2);
    }, _getMatrix = function _getMatrix2(target, force2D) {
      var cache = target._gsap || _getCache(target), style = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
      if (cache.svg && target.getAttribute("transform")) {
        temp = target.transform.baseVal.consolidate().matrix;
        matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
        return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
      } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
        temp = style.display;
        style.display = "block";
        parent = target.parentNode;
        if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
          addedToDOM = 1;
          nextSibling = target.nextElementSibling;
          _docElement.appendChild(target);
        }
        matrix = _getComputedTransformMatrixAsArray(target);
        temp ? style.display = temp : _removeProperty(target, "display");
        if (addedToDOM) {
          nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
        }
      }
      return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
    }, _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
      var cache = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix[0], b2 = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
      if (!originIsAbsolute) {
        bounds = _getBBox(target);
        xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
        yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
      } else if (matrix !== _identity2DMatrix && (determinant = a * d - b2 * c)) {
        x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
        y = xOrigin * (-b2 / determinant) + yOrigin * (a / determinant) - (a * ty - b2 * tx) / determinant;
        xOrigin = x;
        yOrigin = y;
      }
      if (smooth || smooth !== false && cache.smooth) {
        tx = xOrigin - xOriginOld;
        ty = yOrigin - yOriginOld;
        cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
        cache.yOffset = yOffsetOld + (tx * b2 + ty * d) - ty;
      } else {
        cache.xOffset = cache.yOffset = 0;
      }
      cache.xOrigin = xOrigin;
      cache.yOrigin = yOrigin;
      cache.smooth = !!smooth;
      cache.origin = origin;
      cache.originIsAbsolute = !!originIsAbsolute;
      target.style[_transformOriginProp] = "0px 0px";
      if (pluginToAddPropTweensTo) {
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
        _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
      }
      target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
    }, _parseTransform = function _parseTransform2(target, uncache) {
      var cache = target._gsap || new GSCache(target);
      if ("x" in cache && !uncache && !cache.uncache) {
        return cache;
      }
      var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b2, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
      x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
      scaleX = scaleY = 1;
      cache.svg = !!(target.getCTM && _isSVG(target));
      if (cs.translate) {
        if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
          style[_transformProp$1] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp$1] !== "none" ? cs[_transformProp$1] : "");
        }
        style.scale = style.rotate = style.translate = "none";
      }
      matrix = _getMatrix(target, cache.svg);
      if (cache.svg) {
        if (cache.uncache) {
          t2 = target.getBBox();
          origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
          t1 = "";
        } else {
          t1 = !uncache && target.getAttribute("data-svg-origin");
        }
        _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
      }
      xOrigin = cache.xOrigin || 0;
      yOrigin = cache.yOrigin || 0;
      if (matrix !== _identity2DMatrix) {
        a = matrix[0];
        b2 = matrix[1];
        c = matrix[2];
        d = matrix[3];
        x = a12 = matrix[4];
        y = a22 = matrix[5];
        if (matrix.length === 6) {
          scaleX = Math.sqrt(a * a + b2 * b2);
          scaleY = Math.sqrt(d * d + c * c);
          rotation = a || b2 ? _atan2(b2, a) * _RAD2DEG : 0;
          skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
          skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
          if (cache.svg) {
            x -= xOrigin - (xOrigin * a + yOrigin * c);
            y -= yOrigin - (xOrigin * b2 + yOrigin * d);
          }
        } else {
          a32 = matrix[6];
          a42 = matrix[7];
          a13 = matrix[8];
          a23 = matrix[9];
          a33 = matrix[10];
          a43 = matrix[11];
          x = matrix[12];
          y = matrix[13];
          z = matrix[14];
          angle = _atan2(a32, a33);
          rotationX = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a12 * cos + a13 * sin;
            t2 = a22 * cos + a23 * sin;
            t3 = a32 * cos + a33 * sin;
            a13 = a12 * -sin + a13 * cos;
            a23 = a22 * -sin + a23 * cos;
            a33 = a32 * -sin + a33 * cos;
            a43 = a42 * -sin + a43 * cos;
            a12 = t1;
            a22 = t2;
            a32 = t3;
          }
          angle = _atan2(-c, a33);
          rotationY = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(-angle);
            sin = Math.sin(-angle);
            t1 = a * cos - a13 * sin;
            t2 = b2 * cos - a23 * sin;
            t3 = c * cos - a33 * sin;
            a43 = d * sin + a43 * cos;
            a = t1;
            b2 = t2;
            c = t3;
          }
          angle = _atan2(b2, a);
          rotation = angle * _RAD2DEG;
          if (angle) {
            cos = Math.cos(angle);
            sin = Math.sin(angle);
            t1 = a * cos + b2 * sin;
            t2 = a12 * cos + a22 * sin;
            b2 = b2 * cos - a * sin;
            a22 = a22 * cos - a12 * sin;
            a = t1;
            a12 = t2;
          }
          if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
            rotationX = rotation = 0;
            rotationY = 180 - rotationY;
          }
          scaleX = _round$2(Math.sqrt(a * a + b2 * b2 + c * c));
          scaleY = _round$2(Math.sqrt(a22 * a22 + a32 * a32));
          angle = _atan2(a12, a22);
          skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
          perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
        }
        if (cache.svg) {
          t1 = target.getAttribute("transform");
          cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp$1));
          t1 && target.setAttribute("transform", t1);
        }
      }
      if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
        if (invertedScaleX) {
          scaleX *= -1;
          skewX += rotation <= 0 ? 180 : -180;
          rotation += rotation <= 0 ? 180 : -180;
        } else {
          scaleY *= -1;
          skewX += skewX <= 0 ? 180 : -180;
        }
      }
      uncache = uncache || cache.uncache;
      cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
      cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
      cache.z = z + px;
      cache.scaleX = _round$2(scaleX);
      cache.scaleY = _round$2(scaleY);
      cache.rotation = _round$2(rotation) + deg;
      cache.rotationX = _round$2(rotationX) + deg;
      cache.rotationY = _round$2(rotationY) + deg;
      cache.skewX = skewX + deg;
      cache.skewY = skewY + deg;
      cache.transformPerspective = perspective + px;
      if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
        style[_transformOriginProp] = _firstTwoOnly(origin);
      }
      cache.xOffset = cache.yOffset = 0;
      cache.force3D = _config$1.force3D;
      cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
      cache.uncache = 0;
      return cache;
    }, _firstTwoOnly = function _firstTwoOnly2(value) {
      return (value = value.split(" "))[0] + " " + value[1];
    }, _addPxTranslate = function _addPxTranslate2(target, start, value) {
      var unit = getUnit(start);
      return _round$2(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
    }, _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
      cache.z = "0px";
      cache.rotationY = cache.rotationX = "0deg";
      cache.force3D = 0;
      _renderCSSTransforms(ratio, cache);
    }, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
      var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
      if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
        var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
        angle = parseFloat(rotationX) * _DEG2RAD;
        cos = Math.cos(angle);
        x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
        y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
        z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
      }
      if (transformPerspective !== _zeroPx) {
        transforms += "perspective(" + transformPerspective + _endParenthesis;
      }
      if (xPercent || yPercent) {
        transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
      }
      if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
        transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
      }
      if (rotation !== _zeroDeg) {
        transforms += "rotate(" + rotation + _endParenthesis;
      }
      if (rotationY !== _zeroDeg) {
        transforms += "rotateY(" + rotationY + _endParenthesis;
      }
      if (rotationX !== _zeroDeg) {
        transforms += "rotateX(" + rotationX + _endParenthesis;
      }
      if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
        transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
      }
      if (scaleX !== 1 || scaleY !== 1) {
        transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
      }
      target.style[_transformProp$1] = transforms || "translate(0, 0)";
    }, _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
      var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
      rotation = parseFloat(rotation);
      skewX = parseFloat(skewX);
      skewY = parseFloat(skewY);
      if (skewY) {
        skewY = parseFloat(skewY);
        skewX += skewY;
        rotation += skewY;
      }
      if (rotation || skewX) {
        rotation *= _DEG2RAD;
        skewX *= _DEG2RAD;
        a11 = Math.cos(rotation) * scaleX;
        a21 = Math.sin(rotation) * scaleX;
        a12 = Math.sin(rotation - skewX) * -scaleY;
        a22 = Math.cos(rotation - skewX) * scaleY;
        if (skewX) {
          skewY *= _DEG2RAD;
          temp = Math.tan(skewX - skewY);
          temp = Math.sqrt(1 + temp * temp);
          a12 *= temp;
          a22 *= temp;
          if (skewY) {
            temp = Math.tan(skewY);
            temp = Math.sqrt(1 + temp * temp);
            a11 *= temp;
            a21 *= temp;
          }
        }
        a11 = _round$2(a11);
        a21 = _round$2(a21);
        a12 = _round$2(a12);
        a22 = _round$2(a22);
      } else {
        a11 = scaleX;
        a22 = scaleY;
        a21 = a12 = 0;
      }
      if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
        tx = _convertToUnit(target, "x", x, "px");
        ty = _convertToUnit(target, "y", y, "px");
      }
      if (xOrigin || yOrigin || xOffset || yOffset) {
        tx = _round$2(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
        ty = _round$2(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
      }
      if (xPercent || yPercent) {
        temp = target.getBBox();
        tx = _round$2(tx + xPercent / 100 * temp.width);
        ty = _round$2(ty + yPercent / 100 * temp.height);
      }
      temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
      target.setAttribute("transform", temp);
      forceCSS && (target.style[_transformProp$1] = temp);
    }, _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
      var cap = 360, isString2 = _isString$2(endValue), endNum = parseFloat(endValue) * (isString2 && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
      if (isString2) {
        direction = endValue.split("_")[1];
        if (direction === "short") {
          change %= cap;
          if (change !== change % (cap / 2)) {
            change += change < 0 ? cap : -360;
          }
        }
        if (direction === "cw" && change < 0) {
          change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
        } else if (direction === "ccw" && change > 0) {
          change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
        }
      }
      plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
      pt.e = finalValue;
      pt.u = "deg";
      plugin._props.push(property);
      return pt;
    }, _assign = function _assign2(target, source) {
      for (var p in source) {
        target[p] = source[p];
      }
      return target;
    }, _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
      var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
      if (startCache.svg) {
        startValue = target.getAttribute("transform");
        target.setAttribute("transform", "");
        style[_transformProp$1] = transforms;
        endCache = _parseTransform(target, 1);
        _removeProperty(target, _transformProp$1);
        target.setAttribute("transform", startValue);
      } else {
        startValue = getComputedStyle(target)[_transformProp$1];
        style[_transformProp$1] = transforms;
        endCache = _parseTransform(target, 1);
        style[_transformProp$1] = startValue;
      }
      for (p in _transformProps) {
        startValue = startCache[p];
        endValue = endCache[p];
        if (startValue !== endValue && exclude.indexOf(p) < 0) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
          startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
          endNum = parseFloat(endValue);
          plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
          plugin._pt.u = endUnit || 0;
          plugin._props.push(p);
        }
      }
      _assign(endCache, startCache);
    };
    _forEachName("padding,margin,Width,Radius", function (name, index) {
      var t = "Top", r = "Right", b2 = "Bottom", l = "Left", props = (index < 3 ? [t, r, b2, l] : [t + l, t + r, b2 + r, b2 + l]).map(function (side) {
        return index < 2 ? name + side : "border" + side + name;
      });
      _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
        var a, vars;
        if (arguments.length < 4) {
          a = props.map(function (prop) {
            return _get(plugin, prop, property);
          });
          vars = a.join(" ");
          return vars.split(a[0]).length === 5 ? a[0] : vars;
        }
        a = (endValue + "").split(" ");
        vars = {};
        props.forEach(function (prop, i) {
          return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
        });
        plugin.init(target, vars, tween);
      };
    });
    var CSSPlugin = {
      name: "css",
      register: _initCore$2,
      targetTest: function targetTest(target) {
        return target.style && target.nodeType;
      },
      init: function init(target, vars, tween, index, targets) {
        var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority, inlineProps;
        _pluginInitted || _initCore$2();
        this.styles = this.styles || _getStyleSaver(target);
        inlineProps = this.styles.props;
        this.tween = tween;
        for (p in vars) {
          if (p === "autoRound") {
            continue;
          }
          endValue = vars[p];
          if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
            continue;
          }
          type = typeof endValue;
          specialProp = _specialProps[p];
          if (type === "function") {
            endValue = endValue.call(tween, index, target, targets);
            type = typeof endValue;
          }
          if (type === "string" && ~endValue.indexOf("random(")) {
            endValue = _replaceRandom(endValue);
          }
          if (specialProp) {
            specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
          } else if (p.substr(0, 2) === "--") {
            startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
            endValue += "";
            _colorExp.lastIndex = 0;
            if (!_colorExp.test(startValue)) {
              startUnit = getUnit(startValue);
              endUnit = getUnit(endValue);
            }
            endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
            this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
            props.push(p);
            inlineProps.push(p, 0, style[p]);
          } else if (type !== "undefined") {
            if (startAt && p in startAt) {
              startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
              _isString$2(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
              getUnit(startValue + "") || startValue === "auto" || (startValue += _config$1.units[p] || getUnit(_get(target, p)) || "");
              (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
            } else {
              startValue = _get(target, p);
            }
            startNum = parseFloat(startValue);
            relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
            relative && (endValue = endValue.substr(2));
            endNum = parseFloat(endValue);
            if (p in _propertyAliases) {
              if (p === "autoAlpha") {
                if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                  startNum = 0;
                }
                inlineProps.push("visibility", 0, style.visibility);
                _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
              }
              if (p !== "scale" && p !== "transform") {
                p = _propertyAliases[p];
                ~p.indexOf(",") && (p = p.split(",")[0]);
              }
            }
            isTransformRelated = p in _transformProps;
            if (isTransformRelated) {
              this.styles.save(p);
              if (!transformPropTween) {
                cache = target._gsap;
                cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
                smooth = vars.smoothOrigin !== false && cache.smooth;
                transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp$1, 0, 1, cache.renderTransform, cache, 0, -1);
                transformPropTween.dep = 1;
              }
              if (p === "scale") {
                this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
                this._pt.u = 0;
                props.push("scaleY", p);
                p += "X";
              } else if (p === "transformOrigin") {
                inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
                endValue = _convertKeywordsToPercentages(endValue);
                if (cache.svg) {
                  _applySVGOrigin(target, endValue, 0, smooth, 0, this);
                } else {
                  endUnit = parseFloat(endValue.split(" ")[2]) || 0;
                  endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                  _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
                }
                continue;
              } else if (p === "svgOrigin") {
                _applySVGOrigin(target, endValue, 1, smooth, 0, this);
                continue;
              } else if (p in _rotationalProperties) {
                _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
                continue;
              } else if (p === "smoothOrigin") {
                _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
                continue;
              } else if (p === "force3D") {
                cache[p] = endValue;
                continue;
              } else if (p === "transform") {
                _addRawTransformPTs(this, endValue, target);
                continue;
              }
            } else if (!(p in style)) {
              p = _checkPropPrefix(p) || p;
            }
            if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
              startUnit = (startValue + "").substr((startNum + "").length);
              endNum || (endNum = 0);
              endUnit = getUnit(endValue) || (p in _config$1.units ? _config$1.units[p] : startUnit);
              startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
              this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
              this._pt.u = endUnit || 0;
              if (startUnit !== endUnit && endUnit !== "%") {
                this._pt.b = startValue;
                this._pt.r = _renderCSSPropWithBeginning;
              }
            } else if (!(p in style)) {
              if (p in target) {
                this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
              } else if (p !== "parseTransform") {
                _missingPlugin(p, endValue);
                continue;
              }
            } else {
              _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
            }
            isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
            props.push(p);
          }
        }
        hasPriority && _sortPropTweensByPriority(this);
      },
      render: function render(ratio, data) {
        if (data.tween._time || !_reverting()) {
          var pt = data._pt;
          while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
          }
        } else {
          data.styles.revert();
        }
      },
      get: _get,
      aliases: _propertyAliases,
      getSetter: function getSetter(target, property, plugin) {
        var p = _propertyAliases[property];
        p && p.indexOf(",") < 0 && (property = p);
        return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
      },
      core: {
        _removeProperty,
        _getMatrix
      }
    };
    gsap$4.utils.checkPrefix = _checkPropPrefix;
    gsap$4.core.getStyleSaver = _getStyleSaver;
    (function (positionAndScale, rotation, others, aliases2) {
      var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
        _transformProps[name] = 1;
      });
      _forEachName(rotation, function (name) {
        _config$1.units[name] = "deg";
        _rotationalProperties[name] = 1;
      });
      _propertyAliases[all[13]] = positionAndScale + "," + rotation;
      _forEachName(aliases2, function (name) {
        var split = name.split(":");
        _propertyAliases[split[1]] = all[split[0]];
      });
    })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
    _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
      _config$1.units[name] = "px";
    });
    gsap$4.registerPlugin(CSSPlugin);
    function _defineProperties$1(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      return Constructor;
    }
    /*!
     * Observer 3.12.7
     * https://gsap.com
     *
     * @license Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var gsap$3, _coreInitted$3, _win$2, _doc$2, _docEl$3, _body$3, _isTouch, _pointerType, ScrollTrigger$3, _root$1, _normalizer$1, _eventTypes, _context$2, _getGSAP$3 = function _getGSAP2() {
      return gsap$3 || typeof window !== "undefined" && (gsap$3 = window.gsap) && gsap$3.registerPlugin && gsap$3;
    }, _startup$1 = 1, _observers = [], _scrollers = [], _proxies = [], _getTime$1 = Date.now, _bridge = function _bridge2(name, value) {
      return value;
    }, _integrate = function _integrate2() {
      var core = ScrollTrigger$3.core, data = core.bridge || {}, scrollers = core._scrollers, proxies = core._proxies;
      scrollers.push.apply(scrollers, _scrollers);
      proxies.push.apply(proxies, _proxies);
      _scrollers = scrollers;
      _proxies = proxies;
      _bridge = function _bridge2(name, value) {
        return data[name](value);
      };
    }, _getProxyProp = function _getProxyProp2(element, property) {
      return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
    }, _isViewport$1 = function _isViewport2(el) {
      return !!~_root$1.indexOf(el);
    }, _addListener$1 = function _addListener2(element, type, func, passive, capture) {
      return element.addEventListener(type, func, {
        passive: passive !== false,
        capture: !!capture
      });
    }, _removeListener$1 = function _removeListener2(element, type, func, capture) {
      return element.removeEventListener(type, func, !!capture);
    }, _scrollLeft = "scrollLeft", _scrollTop = "scrollTop", _onScroll$1 = function _onScroll2() {
      return _normalizer$1 && _normalizer$1.isPressed || _scrollers.cache++;
    }, _scrollCacheFunc = function _scrollCacheFunc2(f, doNotCache) {
      var cachingFunc = function cachingFunc2(value) {
        if (value || value === 0) {
          _startup$1 && (_win$2.history.scrollRestoration = "manual");
          var isNormalizing = _normalizer$1 && _normalizer$1.isPressed;
          value = cachingFunc2.v = Math.round(value) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0);
          f(value);
          cachingFunc2.cacheID = _scrollers.cache;
          isNormalizing && _bridge("ss", value);
        } else if (doNotCache || _scrollers.cache !== cachingFunc2.cacheID || _bridge("ref")) {
          cachingFunc2.cacheID = _scrollers.cache;
          cachingFunc2.v = f();
        }
        return cachingFunc2.v + cachingFunc2.offset;
      };
      cachingFunc.offset = 0;
      return f && cachingFunc;
    }, _horizontal = {
      s: _scrollLeft,
      p: "left",
      p2: "Left",
      os: "right",
      os2: "Right",
      d: "width",
      d2: "Width",
      a: "x",
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win$2.scrollTo(value, _vertical.sc()) : _win$2.pageXOffset || _doc$2[_scrollLeft] || _docEl$3[_scrollLeft] || _body$3[_scrollLeft] || 0;
      })
    }, _vertical = {
      s: _scrollTop,
      p: "top",
      p2: "Top",
      os: "bottom",
      os2: "Bottom",
      d: "height",
      d2: "Height",
      a: "y",
      op: _horizontal,
      sc: _scrollCacheFunc(function (value) {
        return arguments.length ? _win$2.scrollTo(_horizontal.sc(), value) : _win$2.pageYOffset || _doc$2[_scrollTop] || _docEl$3[_scrollTop] || _body$3[_scrollTop] || 0;
      })
    }, _getTarget = function _getTarget2(t, self) {
      return (self && self._ctx && self._ctx.selector || gsap$3.utils.toArray)(t)[0] || (typeof t === "string" && gsap$3.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
    }, _getScrollFunc = function _getScrollFunc2(element, _ref) {
      var s = _ref.s, sc = _ref.sc;
      _isViewport$1(element) && (element = _doc$2.scrollingElement || _docEl$3);
      var i = _scrollers.indexOf(element), offset2 = sc === _vertical.sc ? 1 : 2;
      !~i && (i = _scrollers.push(element) - 1);
      _scrollers[i + offset2] || _addListener$1(element, "scroll", _onScroll$1);
      var prev = _scrollers[i + offset2], func = prev || (_scrollers[i + offset2] = _scrollCacheFunc(_getProxyProp(element, s), true) || (_isViewport$1(element) ? sc : _scrollCacheFunc(function (value) {
        return arguments.length ? element[s] = value : element[s];
      })));
      func.target = element;
      prev || (func.smooth = gsap$3.getProperty(element, "scrollBehavior") === "smooth");
      return func;
    }, _getVelocityProp$1 = function _getVelocityProp2(value, minTimeRefresh, useDelta) {
      var v1 = value, v2 = value, t1 = _getTime$1(), t2 = t1, min2 = minTimeRefresh || 50, dropToZeroTime = Math.max(500, min2 * 3), update = function update2(value2, force) {
        var t = _getTime$1();
        if (force || t - t1 > min2) {
          v2 = v1;
          v1 = value2;
          t2 = t1;
          t1 = t;
        } else if (useDelta) {
          v1 += value2;
        } else {
          v1 = v2 + (value2 - v2) / (t - t2) * (t1 - t2);
        }
      }, reset = function reset2() {
        v2 = v1 = useDelta ? 0 : v1;
        t2 = t1 = 0;
      }, getVelocity = function getVelocity2(latestValue) {
        var tOld = t2, vOld = v2, t = _getTime$1();
        (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
        return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1e3;
      };
      return {
        update,
        reset,
        getVelocity
      };
    }, _getEvent = function _getEvent2(e, preventDefault) {
      preventDefault && !e._gsapAllow && e.preventDefault();
      return e.changedTouches ? e.changedTouches[0] : e;
    }, _getAbsoluteMax = function _getAbsoluteMax2(a) {
      var max2 = Math.max.apply(Math, a), min2 = Math.min.apply(Math, a);
      return Math.abs(max2) >= Math.abs(min2) ? max2 : min2;
    }, _setScrollTrigger = function _setScrollTrigger2() {
      ScrollTrigger$3 = gsap$3.core.globals().ScrollTrigger;
      ScrollTrigger$3 && ScrollTrigger$3.core && _integrate();
    }, _initCore$1 = function _initCore2(core) {
      gsap$3 = core || _getGSAP$3();
      if (!_coreInitted$3 && gsap$3 && typeof document !== "undefined" && document.body) {
        _win$2 = window;
        _doc$2 = document;
        _docEl$3 = _doc$2.documentElement;
        _body$3 = _doc$2.body;
        _root$1 = [_win$2, _doc$2, _docEl$3, _body$3];
        gsap$3.utils.clamp;
        _context$2 = gsap$3.core.context || function () {
        };
        _pointerType = "onpointerenter" in _body$3 ? "pointer" : "mouse";
        _isTouch = Observer.isTouch = _win$2.matchMedia && _win$2.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$2 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
        _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl$3 ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl$3) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
        setTimeout(function () {
          return _startup$1 = 0;
        }, 500);
        _setScrollTrigger();
        _coreInitted$3 = 1;
      }
      return _coreInitted$3;
    };
    _horizontal.op = _vertical;
    _scrollers.cache = 0;
    var Observer = /* @__PURE__ */ function () {
      function Observer2(vars) {
        this.init(vars);
      }
      var _proto = Observer2.prototype;
      _proto.init = function init(vars) {
        _coreInitted$3 || _initCore$1(gsap$3) || console.warn("Please gsap.registerPlugin(Observer)");
        ScrollTrigger$3 || _setScrollTrigger();
        var tolerance = vars.tolerance, dragMinimum = vars.dragMinimum, type = vars.type, target = vars.target, lineHeight = vars.lineHeight, debounce = vars.debounce, preventDefault = vars.preventDefault, onStop = vars.onStop, onStopDelay = vars.onStopDelay, ignore = vars.ignore, wheelSpeed = vars.wheelSpeed, event = vars.event, onDragStart = vars.onDragStart, onDragEnd = vars.onDragEnd, onDrag = vars.onDrag, onPress = vars.onPress, onRelease = vars.onRelease, onRight = vars.onRight, onLeft = vars.onLeft, onUp = vars.onUp, onDown = vars.onDown, onChangeX = vars.onChangeX, onChangeY = vars.onChangeY, onChange = vars.onChange, onToggleX = vars.onToggleX, onToggleY = vars.onToggleY, onHover = vars.onHover, onHoverEnd = vars.onHoverEnd, onMove = vars.onMove, ignoreCheck = vars.ignoreCheck, isNormalizer = vars.isNormalizer, onGestureStart = vars.onGestureStart, onGestureEnd = vars.onGestureEnd, onWheel = vars.onWheel, onEnable = vars.onEnable, onDisable = vars.onDisable, onClick = vars.onClick, scrollSpeed = vars.scrollSpeed, capture = vars.capture, allowClicks = vars.allowClicks, lockAxis = vars.lockAxis, onLockAxis = vars.onLockAxis;
        this.target = target = _getTarget(target) || _docEl$3;
        this.vars = vars;
        ignore && (ignore = gsap$3.utils.toArray(ignore));
        tolerance = tolerance || 1e-9;
        dragMinimum = dragMinimum || 0;
        wheelSpeed = wheelSpeed || 1;
        scrollSpeed = scrollSpeed || 1;
        type = type || "wheel,touch,pointer";
        debounce = debounce !== false;
        lineHeight || (lineHeight = parseFloat(_win$2.getComputedStyle(_body$3).lineHeight) || 22);
        var id, onStopDelayedCall, dragged, moved, wheeled, locked, axis, self = this, prevDeltaX = 0, prevDeltaY = 0, passive = vars.passive || !preventDefault && vars.passive !== false, scrollFuncX = _getScrollFunc(target, _horizontal), scrollFuncY = _getScrollFunc(target, _vertical), scrollX = scrollFuncX(), scrollY = scrollFuncY(), limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown", isViewport = _isViewport$1(target), ownerDoc = target.ownerDocument || _doc$2, deltaX = [0, 0, 0], deltaY = [0, 0, 0], onClickTime = 0, clickCapture = function clickCapture2() {
          return onClickTime = _getTime$1();
        }, _ignoreCheck = function _ignoreCheck2(e, isPointerOrTouch) {
          return (self.event = e) && ignore && ~ignore.indexOf(e.target) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e, isPointerOrTouch);
        }, onStopFunc = function onStopFunc2() {
          self._vx.reset();
          self._vy.reset();
          onStopDelayedCall.pause();
          onStop && onStop(self);
        }, update = function update2() {
          var dx = self.deltaX = _getAbsoluteMax(deltaX), dy = self.deltaY = _getAbsoluteMax(deltaY), changedX = Math.abs(dx) >= tolerance, changedY = Math.abs(dy) >= tolerance;
          onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY);
          if (changedX) {
            onRight && self.deltaX > 0 && onRight(self);
            onLeft && self.deltaX < 0 && onLeft(self);
            onChangeX && onChangeX(self);
            onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
            prevDeltaX = self.deltaX;
            deltaX[0] = deltaX[1] = deltaX[2] = 0;
          }
          if (changedY) {
            onDown && self.deltaY > 0 && onDown(self);
            onUp && self.deltaY < 0 && onUp(self);
            onChangeY && onChangeY(self);
            onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
            prevDeltaY = self.deltaY;
            deltaY[0] = deltaY[1] = deltaY[2] = 0;
          }
          if (moved || dragged) {
            onMove && onMove(self);
            if (dragged) {
              onDragStart && dragged === 1 && onDragStart(self);
              onDrag && onDrag(self);
              dragged = 0;
            }
            moved = false;
          }
          locked && !(locked = false) && onLockAxis && onLockAxis(self);
          if (wheeled) {
            onWheel(self);
            wheeled = false;
          }
          id = 0;
        }, onDelta = function onDelta2(x, y, index) {
          deltaX[index] += x;
          deltaY[index] += y;
          self._vx.update(x);
          self._vy.update(y);
          debounce ? id || (id = requestAnimationFrame(update)) : update();
        }, onTouchOrPointerDelta = function onTouchOrPointerDelta2(x, y) {
          if (lockAxis && !axis) {
            self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
            locked = true;
          }
          if (axis !== "y") {
            deltaX[2] += x;
            self._vx.update(x, true);
          }
          if (axis !== "x") {
            deltaY[2] += y;
            self._vy.update(y, true);
          }
          debounce ? id || (id = requestAnimationFrame(update)) : update();
        }, _onDrag = function _onDrag2(e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
          e = _getEvent(e, preventDefault);
          var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y, isDragging = self.isDragging;
          self.x = x;
          self.y = y;
          if (isDragging || (dx || dy) && (Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum)) {
            dragged = isDragging ? 2 : 1;
            isDragging || (self.isDragging = true);
            onTouchOrPointerDelta(dx, dy);
          }
        }, _onPress = self.onPress = function (e) {
          if (_ignoreCheck(e, 1) || e && e.button) {
            return;
          }
          self.axis = axis = null;
          onStopDelayedCall.pause();
          self.isPressed = true;
          e = _getEvent(e);
          prevDeltaX = prevDeltaY = 0;
          self.startX = self.x = e.clientX;
          self.startY = self.y = e.clientY;
          self._vx.reset();
          self._vy.reset();
          _addListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, passive, true);
          self.deltaX = self.deltaY = 0;
          onPress && onPress(self);
        }, _onRelease = self.onRelease = function (e) {
          if (_ignoreCheck(e, 1)) {
            return;
          }
          _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
          var isTrackingDrag = !isNaN(self.y - self.startY), wasDragging = self.isDragging, isDragNotClick = wasDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3), eventData = _getEvent(e);
          if (!isDragNotClick && isTrackingDrag) {
            self._vx.reset();
            self._vy.reset();
            if (preventDefault && allowClicks) {
              gsap$3.delayedCall(0.08, function () {
                if (_getTime$1() - onClickTime > 300 && !e.defaultPrevented) {
                  if (e.target.click) {
                    e.target.click();
                  } else if (ownerDoc.createEvent) {
                    var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                    syntheticEvent.initMouseEvent("click", true, true, _win$2, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                    e.target.dispatchEvent(syntheticEvent);
                  }
                }
              });
            }
          }
          self.isDragging = self.isGesturing = self.isPressed = false;
          onStop && wasDragging && !isNormalizer && onStopDelayedCall.restart(true);
          dragged && update();
          onDragEnd && wasDragging && onDragEnd(self);
          onRelease && onRelease(self, isDragNotClick);
        }, _onGestureStart = function _onGestureStart2(e) {
          return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
        }, _onGestureEnd = function _onGestureEnd2() {
          return (self.isGesturing = false) || onGestureEnd(self);
        }, onScroll = function onScroll2(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          var x = scrollFuncX(), y = scrollFuncY();
          onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
          scrollX = x;
          scrollY = y;
          onStop && onStopDelayedCall.restart(true);
        }, _onWheel = function _onWheel2(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          e = _getEvent(e, preventDefault);
          onWheel && (wheeled = true);
          var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win$2.innerHeight : 1) * wheelSpeed;
          onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
          onStop && !isNormalizer && onStopDelayedCall.restart(true);
        }, _onMove = function _onMove2(e) {
          if (_ignoreCheck(e)) {
            return;
          }
          var x = e.clientX, y = e.clientY, dx = x - self.x, dy = y - self.y;
          self.x = x;
          self.y = y;
          moved = true;
          onStop && onStopDelayedCall.restart(true);
          (dx || dy) && onTouchOrPointerDelta(dx, dy);
        }, _onHover = function _onHover2(e) {
          self.event = e;
          onHover(self);
        }, _onHoverEnd = function _onHoverEnd2(e) {
          self.event = e;
          onHoverEnd(self);
        }, _onClick = function _onClick2(e) {
          return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
        };
        onStopDelayedCall = self._dc = gsap$3.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
        self.deltaX = self.deltaY = 0;
        self._vx = _getVelocityProp$1(0, 50, true);
        self._vy = _getVelocityProp$1(0, 50, true);
        self.scrollX = scrollFuncX;
        self.scrollY = scrollFuncY;
        self.isDragging = self.isGesturing = self.isPressed = false;
        _context$2(this);
        self.enable = function (e) {
          if (!self.isEnabled) {
            _addListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
            type.indexOf("scroll") >= 0 && _addListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, passive, capture);
            type.indexOf("wheel") >= 0 && _addListener$1(target, "wheel", _onWheel, passive, capture);
            if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
              _addListener$1(target, _eventTypes[0], _onPress, passive, capture);
              _addListener$1(ownerDoc, _eventTypes[2], _onRelease);
              _addListener$1(ownerDoc, _eventTypes[3], _onRelease);
              allowClicks && _addListener$1(target, "click", clickCapture, true, true);
              onClick && _addListener$1(target, "click", _onClick);
              onGestureStart && _addListener$1(ownerDoc, "gesturestart", _onGestureStart);
              onGestureEnd && _addListener$1(ownerDoc, "gestureend", _onGestureEnd);
              onHover && _addListener$1(target, _pointerType + "enter", _onHover);
              onHoverEnd && _addListener$1(target, _pointerType + "leave", _onHoverEnd);
              onMove && _addListener$1(target, _pointerType + "move", _onMove);
            }
            self.isEnabled = true;
            self.isDragging = self.isGesturing = self.isPressed = moved = dragged = false;
            self._vx.reset();
            self._vy.reset();
            scrollX = scrollFuncX();
            scrollY = scrollFuncY();
            e && e.type && _onPress(e);
            onEnable && onEnable(self);
          }
          return self;
        };
        self.disable = function () {
          if (self.isEnabled) {
            _observers.filter(function (o) {
              return o !== self && _isViewport$1(o.target);
            }).length || _removeListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);
            if (self.isPressed) {
              self._vx.reset();
              self._vy.reset();
              _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
            }
            _removeListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, capture);
            _removeListener$1(target, "wheel", _onWheel, capture);
            _removeListener$1(target, _eventTypes[0], _onPress, capture);
            _removeListener$1(ownerDoc, _eventTypes[2], _onRelease);
            _removeListener$1(ownerDoc, _eventTypes[3], _onRelease);
            _removeListener$1(target, "click", clickCapture, true);
            _removeListener$1(target, "click", _onClick);
            _removeListener$1(ownerDoc, "gesturestart", _onGestureStart);
            _removeListener$1(ownerDoc, "gestureend", _onGestureEnd);
            _removeListener$1(target, _pointerType + "enter", _onHover);
            _removeListener$1(target, _pointerType + "leave", _onHoverEnd);
            _removeListener$1(target, _pointerType + "move", _onMove);
            self.isEnabled = self.isPressed = self.isDragging = false;
            onDisable && onDisable(self);
          }
        };
        self.kill = self.revert = function () {
          self.disable();
          var i = _observers.indexOf(self);
          i >= 0 && _observers.splice(i, 1);
          _normalizer$1 === self && (_normalizer$1 = 0);
        };
        _observers.push(self);
        isNormalizer && _isViewport$1(target) && (_normalizer$1 = self);
        self.enable(event);
      };
      _createClass$1(Observer2, [{
        key: "velocityX",
        get: function get2() {
          return this._vx.getVelocity();
        }
      }, {
        key: "velocityY",
        get: function get2() {
          return this._vy.getVelocity();
        }
      }]);
      return Observer2;
    }();
    Observer.version = "3.12.7";
    Observer.create = function (vars) {
      return new Observer(vars);
    };
    Observer.register = _initCore$1;
    Observer.getAll = function () {
      return _observers.slice();
    };
    Observer.getById = function (id) {
      return _observers.filter(function (o) {
        return o.vars.id === id;
      })[0];
    };
    _getGSAP$3() && gsap$3.registerPlugin(Observer);
    /*!
     * ScrollToPlugin 3.12.7
     * https://gsap.com
     *
     * @license Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var gsap$2, _coreInitted$2, _window, _docEl$2, _body$2, _toArray$2, _config, ScrollTrigger$2, _windowExists$2 = function _windowExists2() {
      return typeof window !== "undefined";
    }, _getGSAP$2 = function _getGSAP2() {
      return gsap$2 || _windowExists$2() && (gsap$2 = window.gsap) && gsap$2.registerPlugin && gsap$2;
    }, _isString$1 = function _isString2(value) {
      return typeof value === "string";
    }, _isFunction$1 = function _isFunction2(value) {
      return typeof value === "function";
    }, _max = function _max2(element, axis) {
      var dim = axis === "x" ? "Width" : "Height", scroll = "scroll" + dim, client = "client" + dim;
      return element === _window || element === _docEl$2 || element === _body$2 ? Math.max(_docEl$2[scroll], _body$2[scroll]) - (_window["inner" + dim] || _docEl$2[client] || _body$2[client]) : element[scroll] - element["offset" + dim];
    }, _buildGetter = function _buildGetter2(e, axis) {
      var p = "scroll" + (axis === "x" ? "Left" : "Top");
      if (e === _window) {
        if (e.pageXOffset != null) {
          p = "page" + axis.toUpperCase() + "Offset";
        } else {
          e = _docEl$2[p] != null ? _docEl$2 : _body$2;
        }
      }
      return function () {
        return e[p];
      };
    }, _clean = function _clean2(value, index, target, targets) {
      _isFunction$1(value) && (value = value(index, target, targets));
      if (typeof value !== "object") {
        return _isString$1(value) && value !== "max" && value.charAt(1) !== "=" ? {
          x: value,
          y: value
        } : {
          y: value
        };
      } else if (value.nodeType) {
        return {
          y: value,
          x: value
        };
      } else {
        var result = {}, p;
        for (p in value) {
          result[p] = p !== "onAutoKill" && _isFunction$1(value[p]) ? value[p](index, target, targets) : value[p];
        }
        return result;
      }
    }, _getOffset = function _getOffset2(element, container) {
      element = _toArray$2(element)[0];
      if (!element || !element.getBoundingClientRect) {
        return console.warn("scrollTo target doesn't exist. Using 0") || {
          x: 0,
          y: 0
        };
      }
      var rect = element.getBoundingClientRect(), isRoot = !container || container === _window || container === _body$2, cRect = isRoot ? {
        top: _docEl$2.clientTop - (_window.pageYOffset || _docEl$2.scrollTop || _body$2.scrollTop || 0),
        left: _docEl$2.clientLeft - (_window.pageXOffset || _docEl$2.scrollLeft || _body$2.scrollLeft || 0)
      } : container.getBoundingClientRect(), offsets = {
        x: rect.left - cRect.left,
        y: rect.top - cRect.top
      };
      if (!isRoot && container) {
        offsets.x += _buildGetter(container, "x")();
        offsets.y += _buildGetter(container, "y")();
      }
      return offsets;
    }, _parseVal = function _parseVal2(value, target, axis, currentVal, offset2) {
      return !isNaN(value) && typeof value !== "object" ? parseFloat(value) - offset2 : _isString$1(value) && value.charAt(1) === "=" ? parseFloat(value.substr(2)) * (value.charAt(0) === "-" ? -1 : 1) + currentVal - offset2 : value === "max" ? _max(target, axis) - offset2 : Math.min(_max(target, axis), _getOffset(value, target)[axis] - offset2);
    }, _initCore = function _initCore2() {
      gsap$2 = _getGSAP$2();
      if (_windowExists$2() && gsap$2 && typeof document !== "undefined" && document.body) {
        _window = window;
        _body$2 = document.body;
        _docEl$2 = document.documentElement;
        _toArray$2 = gsap$2.utils.toArray;
        gsap$2.config({
          autoKillThreshold: 7
        });
        _config = gsap$2.config();
        _coreInitted$2 = 1;
      }
    };
    var ScrollToPlugin = {
      version: "3.12.7",
      name: "scrollTo",
      rawVars: 1,
      register: function register(core) {
        gsap$2 = core;
        _initCore();
      },
      init: function init(target, value, tween, index, targets) {
        _coreInitted$2 || _initCore();
        var data = this, snapType = gsap$2.getProperty(target, "scrollSnapType");
        data.isWin = target === _window;
        data.target = target;
        data.tween = tween;
        value = _clean(value, index, target, targets);
        data.vars = value;
        data.autoKill = !!("autoKill" in value ? value : _config).autoKill;
        data.getX = _buildGetter(target, "x");
        data.getY = _buildGetter(target, "y");
        data.x = data.xPrev = data.getX();
        data.y = data.yPrev = data.getY();
        ScrollTrigger$2 || (ScrollTrigger$2 = gsap$2.core.globals().ScrollTrigger);
        gsap$2.getProperty(target, "scrollBehavior") === "smooth" && gsap$2.set(target, {
          scrollBehavior: "auto"
        });
        if (snapType && snapType !== "none") {
          data.snap = 1;
          data.snapInline = target.style.scrollSnapType;
          target.style.scrollSnapType = "none";
        }
        if (value.x != null) {
          data.add(data, "x", data.x, _parseVal(value.x, target, "x", data.x, value.offsetX || 0), index, targets);
          data._props.push("scrollTo_x");
        } else {
          data.skipX = 1;
        }
        if (value.y != null) {
          data.add(data, "y", data.y, _parseVal(value.y, target, "y", data.y, value.offsetY || 0), index, targets);
          data._props.push("scrollTo_y");
        } else {
          data.skipY = 1;
        }
      },
      render: function render(ratio, data) {
        var pt = data._pt, target = data.target, tween = data.tween, autoKill = data.autoKill, xPrev = data.xPrev, yPrev = data.yPrev, isWin = data.isWin, snap2 = data.snap, snapInline = data.snapInline, x, y, yDif, xDif, threshold;
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
        x = isWin || !data.skipX ? data.getX() : xPrev;
        y = isWin || !data.skipY ? data.getY() : yPrev;
        yDif = y - yPrev;
        xDif = x - xPrev;
        threshold = _config.autoKillThreshold;
        if (data.x < 0) {
          data.x = 0;
        }
        if (data.y < 0) {
          data.y = 0;
        }
        if (autoKill) {
          if (!data.skipX && (xDif > threshold || xDif < -threshold) && x < _max(target, "x")) {
            data.skipX = 1;
          }
          if (!data.skipY && (yDif > threshold || yDif < -threshold) && y < _max(target, "y")) {
            data.skipY = 1;
          }
          if (data.skipX && data.skipY) {
            tween.kill();
            data.vars.onAutoKill && data.vars.onAutoKill.apply(tween, data.vars.onAutoKillParams || []);
          }
        }
        if (isWin) {
          _window.scrollTo(!data.skipX ? data.x : x, !data.skipY ? data.y : y);
        } else {
          data.skipY || (target.scrollTop = data.y);
          data.skipX || (target.scrollLeft = data.x);
        }
        if (snap2 && (ratio === 1 || ratio === 0)) {
          y = target.scrollTop;
          x = target.scrollLeft;
          snapInline ? target.style.scrollSnapType = snapInline : target.style.removeProperty("scroll-snap-type");
          target.scrollTop = y + 1;
          target.scrollLeft = x + 1;
          target.scrollTop = y;
          target.scrollLeft = x;
        }
        data.xPrev = data.x;
        data.yPrev = data.y;
        ScrollTrigger$2 && ScrollTrigger$2.update();
      },
      kill: function kill(property) {
        var both = property === "scrollTo", i = this._props.indexOf(property);
        if (both || property === "scrollTo_x") {
          this.skipX = 1;
        }
        if (both || property === "scrollTo_y") {
          this.skipY = 1;
        }
        i > -1 && this._props.splice(i, 1);
        return !this._props.length;
      }
    };
    ScrollToPlugin.max = _max;
    ScrollToPlugin.getOffset = _getOffset;
    ScrollToPlugin.buildGetter = _buildGetter;
    ScrollToPlugin.config = function (vars) {
      _config || _initCore() || (_config = gsap$2.config());
      for (var p in vars) {
        _config[p] = vars[p];
      }
    };
    _getGSAP$2() && gsap$2.registerPlugin(ScrollToPlugin);
    /*!
     * ScrollTrigger 3.12.7
     * https://gsap.com
     *
     * @license Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var gsap$1, _coreInitted$1, _win$1, _doc$1, _docEl$1, _body$1, _root, _resizeDelay, _toArray$1, _clamp$1, _time2, _syncInterval, _refreshing, _pointerIsDown, _transformProp, _i, _prevWidth, _prevHeight, _autoRefresh, _sort, _suppressOverwrites, _ignoreResize, _normalizer, _ignoreMobileResize, _baseScreenHeight, _baseScreenWidth, _fixIOSBug, _context$1, _scrollRestoration, _div100vh, _100vh, _isReverted, _clampingMax, _limitCallbacks, _startup = 1, _getTime = Date.now, _time1 = _getTime(), _lastScrollTime = 0, _enabled = 0, _parseClamp = function _parseClamp2(value, type, self) {
      var clamp2 = _isString(value) && (value.substr(0, 6) === "clamp(" || value.indexOf("max") > -1);
      self["_" + type + "Clamp"] = clamp2;
      return clamp2 ? value.substr(6, value.length - 7) : value;
    }, _keepClamp = function _keepClamp2(value, clamp2) {
      return clamp2 && (!_isString(value) || value.substr(0, 6) !== "clamp(") ? "clamp(" + value + ")" : value;
    }, _rafBugFix = function _rafBugFix2() {
      return _enabled && requestAnimationFrame(_rafBugFix2);
    }, _pointerDownHandler = function _pointerDownHandler2() {
      return _pointerIsDown = 1;
    }, _pointerUpHandler = function _pointerUpHandler2() {
      return _pointerIsDown = 0;
    }, _passThrough = function _passThrough2(v) {
      return v;
    }, _round$1 = function _round2(value) {
      return Math.round(value * 1e5) / 1e5 || 0;
    }, _windowExists$1 = function _windowExists2() {
      return typeof window !== "undefined";
    }, _getGSAP$1 = function _getGSAP2() {
      return gsap$1 || _windowExists$1() && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
    }, _isViewport = function _isViewport2(e) {
      return !!~_root.indexOf(e);
    }, _getViewportDimension = function _getViewportDimension2(dimensionProperty) {
      return (dimensionProperty === "Height" ? _100vh : _win$1["inner" + dimensionProperty]) || _docEl$1["client" + dimensionProperty] || _body$1["client" + dimensionProperty];
    }, _getBoundsFunc = function _getBoundsFunc2(element) {
      return _getProxyProp(element, "getBoundingClientRect") || (_isViewport(element) ? function () {
        _winOffsets.width = _win$1.innerWidth;
        _winOffsets.height = _100vh;
        return _winOffsets;
      } : function () {
        return _getBounds(element);
      });
    }, _getSizeFunc = function _getSizeFunc2(scroller, isViewport, _ref) {
      var d = _ref.d, d2 = _ref.d2, a = _ref.a;
      return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function () {
        return a()[d];
      } : function () {
        return (isViewport ? _getViewportDimension(d2) : scroller["client" + d2]) || 0;
      };
    }, _getOffsetsFunc = function _getOffsetsFunc2(element, isViewport) {
      return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function () {
        return _winOffsets;
      };
    }, _maxScroll$1 = function _maxScroll2(element, _ref2) {
      var s = _ref2.s, d2 = _ref2.d2, d = _ref2.d, a = _ref2.a;
      return Math.max(0, (s = "scroll" + d2) && (a = _getProxyProp(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl$1[s] || _body$1[s]) - _getViewportDimension(d2) : element[s] - element["offset" + d2]);
    }, _iterateAutoRefresh = function _iterateAutoRefresh2(func, events) {
      for (var i = 0; i < _autoRefresh.length; i += 3) {
        (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
      }
    }, _isString = function _isString2(value) {
      return typeof value === "string";
    }, _isFunction = function _isFunction2(value) {
      return typeof value === "function";
    }, _isNumber = function _isNumber2(value) {
      return typeof value === "number";
    }, _isObject = function _isObject2(value) {
      return typeof value === "object";
    }, _endAnimation = function _endAnimation2(animation, reversed, pause) {
      return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
    }, _callback = function _callback2(self, func) {
      if (self.enabled) {
        var result = self._ctx ? self._ctx.add(function () {
          return func(self);
        }) : func(self);
        result && result.totalTime && (self.callbackAnimation = result);
      }
    }, _abs = Math.abs, _left = "left", _top = "top", _right = "right", _bottom = "bottom", _width = "width", _height = "height", _Right = "Right", _Left = "Left", _Top = "Top", _Bottom = "Bottom", _padding = "padding", _margin = "margin", _Width = "Width", _Height = "Height", _px = "px", _getComputedStyle = function _getComputedStyle2(element) {
      return _win$1.getComputedStyle(element);
    }, _makePositionable = function _makePositionable2(element) {
      var position = _getComputedStyle(element).position;
      element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
    }, _setDefaults = function _setDefaults2(obj, defaults2) {
      for (var p in defaults2) {
        p in obj || (obj[p] = defaults2[p]);
      }
      return obj;
    }, _getBounds = function _getBounds2(element, withoutTransforms) {
      var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$1.to(element, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
      }).progress(1), bounds = element.getBoundingClientRect();
      tween && tween.progress(0).kill();
      return bounds;
    }, _getSize = function _getSize2(element, _ref3) {
      var d2 = _ref3.d2;
      return element["offset" + d2] || element["client" + d2] || 0;
    }, _getLabelRatioArray = function _getLabelRatioArray2(timeline) {
      var a = [], labels = timeline.labels, duration = timeline.duration(), p;
      for (p in labels) {
        a.push(labels[p] / duration);
      }
      return a;
    }, _getClosestLabel = function _getClosestLabel2(animation) {
      return function (value) {
        return gsap$1.utils.snap(_getLabelRatioArray(animation), value);
      };
    }, _snapDirectional = function _snapDirectional2(snapIncrementOrArray) {
      var snap2 = gsap$1.utils.snap(snapIncrementOrArray), a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function (a2, b2) {
        return a2 - b2;
      });
      return a ? function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
        var i;
        if (!direction) {
          return snap2(value);
        }
        if (direction > 0) {
          value -= threshold;
          for (i = 0; i < a.length; i++) {
            if (a[i] >= value) {
              return a[i];
            }
          }
          return a[i - 1];
        } else {
          i = a.length;
          value += threshold;
          while (i--) {
            if (a[i] <= value) {
              return a[i];
            }
          }
        }
        return a[0];
      } : function (value, direction, threshold) {
        if (threshold === void 0) {
          threshold = 1e-3;
        }
        var snapped = snap2(value);
        return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap2(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
      };
    }, _getLabelAtDirection = function _getLabelAtDirection2(timeline) {
      return function (value, st) {
        return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
      };
    }, _multiListener = function _multiListener2(func, element, types, callback) {
      return types.split(",").forEach(function (type) {
        return func(element, type, callback);
      });
    }, _addListener = function _addListener2(element, type, func, nonPassive, capture) {
      return element.addEventListener(type, func, {
        passive: !nonPassive,
        capture: !!capture
      });
    }, _removeListener = function _removeListener2(element, type, func, capture) {
      return element.removeEventListener(type, func, !!capture);
    }, _wheelListener = function _wheelListener2(func, el, scrollFunc) {
      scrollFunc = scrollFunc && scrollFunc.wheelHandler;
      if (scrollFunc) {
        func(el, "wheel", scrollFunc);
        func(el, "touchmove", scrollFunc);
      }
    }, _markerDefaults = {
      startColor: "green",
      endColor: "red",
      indent: 0,
      fontSize: "16px",
      fontWeight: "normal"
    }, _defaults = {
      toggleActions: "play",
      anticipatePin: 0
    }, _keywords = {
      top: 0,
      left: 0,
      center: 0.5,
      bottom: 1,
      right: 1
    }, _offsetToPx = function _offsetToPx2(value, size2) {
      if (_isString(value)) {
        var eqIndex = value.indexOf("="), relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;
        if (~eqIndex) {
          value.indexOf("%") > eqIndex && (relative *= size2 / 100);
          value = value.substr(0, eqIndex - 1);
        }
        value = relative + (value in _keywords ? _keywords[value] * size2 : ~value.indexOf("%") ? parseFloat(value) * size2 / 100 : parseFloat(value) || 0);
      }
      return value;
    }, _createMarker = function _createMarker2(type, name, container, direction, _ref4, offset2, matchWidthEl, containerAnimation) {
      var startColor = _ref4.startColor, endColor = _ref4.endColor, fontSize = _ref4.fontSize, indent = _ref4.indent, fontWeight = _ref4.fontWeight;
      var e = _doc$1.createElement("div"), useFixedPosition = _isViewport(container) || _getProxyProp(container, "pinType") === "fixed", isScroller = type.indexOf("scroller") !== -1, parent = useFixedPosition ? _body$1 : container, isStart = type.indexOf("start") !== -1, color = isStart ? startColor : endColor, css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
      css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
      (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset2 + parseFloat(indent)) + "px;");
      matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
      e._isStart = isStart;
      e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
      e.style.cssText = css;
      e.innerText = name || name === 0 ? type + "-" + name : type;
      parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
      e._offset = e["offset" + direction.op.d2];
      _positionMarker(e, 0, direction, isStart);
      return e;
    }, _positionMarker = function _positionMarker2(marker, start, direction, flipped) {
      var vars = {
        display: "block"
      }, side = direction[flipped ? "os2" : "p2"], oppositeSide = direction[flipped ? "p2" : "os2"];
      marker._isFlipped = flipped;
      vars[direction.a + "Percent"] = flipped ? -100 : 0;
      vars[direction.a] = flipped ? "1px" : 0;
      vars["border" + side + _Width] = 1;
      vars["border" + oppositeSide + _Width] = 0;
      vars[direction.p] = start + "px";
      gsap$1.set(marker, vars);
    }, _triggers = [], _ids = {}, _rafID, _sync = function _sync2() {
      return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
    }, _onScroll = function _onScroll2() {
      if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body$1.clientWidth) {
        _scrollers.cache++;
        if (_normalizer) {
          _rafID || (_rafID = requestAnimationFrame(_updateAll));
        } else {
          _updateAll();
        }
        _lastScrollTime || _dispatch("scrollStart");
        _lastScrollTime = _getTime();
      }
    }, _setBaseDimensions = function _setBaseDimensions2() {
      _baseScreenWidth = _win$1.innerWidth;
      _baseScreenHeight = _win$1.innerHeight;
    }, _onResize = function _onResize2(force) {
      _scrollers.cache++;
      (force === true || !_refreshing && !_ignoreResize && !_doc$1.fullscreenElement && !_doc$1.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win$1.innerWidth || Math.abs(_win$1.innerHeight - _baseScreenHeight) > _win$1.innerHeight * 0.25)) && _resizeDelay.restart(true);
    }, _listeners = {}, _emptyArray = [], _softRefresh = function _softRefresh2() {
      return _removeListener(ScrollTrigger$1, "scrollEnd", _softRefresh2) || _refreshAll(true);
    }, _dispatch = function _dispatch2(type) {
      return _listeners[type] && _listeners[type].map(function (f) {
        return f();
      }) || _emptyArray;
    }, _savedStyles = [], _revertRecorded = function _revertRecorded2(media) {
      for (var i = 0; i < _savedStyles.length; i += 5) {
        if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
          _savedStyles[i].style.cssText = _savedStyles[i + 1];
          _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
          _savedStyles[i + 3].uncache = 1;
        }
      }
    }, _revertAll = function _revertAll2(kill, media) {
      var trigger2;
      for (_i = 0; _i < _triggers.length; _i++) {
        trigger2 = _triggers[_i];
        if (trigger2 && (!media || trigger2._ctx === media)) {
          if (kill) {
            trigger2.kill(1);
          } else {
            trigger2.revert(true, true);
          }
        }
      }
      _isReverted = true;
      media && _revertRecorded(media);
      media || _dispatch("revert");
    }, _clearScrollMemory = function _clearScrollMemory2(scrollRestoration, force) {
      _scrollers.cache++;
      (force || !_refreshingAll) && _scrollers.forEach(function (obj) {
        return _isFunction(obj) && obj.cacheID++ && (obj.rec = 0);
      });
      _isString(scrollRestoration) && (_win$1.history.scrollRestoration = _scrollRestoration = scrollRestoration);
    }, _refreshingAll, _refreshID = 0, _queueRefreshID, _queueRefreshAll = function _queueRefreshAll2() {
      if (_queueRefreshID !== _refreshID) {
        var id = _queueRefreshID = _refreshID;
        requestAnimationFrame(function () {
          return id === _refreshID && _refreshAll(true);
        });
      }
    }, _refresh100vh = function _refresh100vh2() {
      _body$1.appendChild(_div100vh);
      _100vh = !_normalizer && _div100vh.offsetHeight || _win$1.innerHeight;
      _body$1.removeChild(_div100vh);
    }, _hideAllMarkers = function _hideAllMarkers2(hide) {
      return _toArray$1(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function (el) {
        return el.style.display = hide ? "none" : "block";
      });
    }, _refreshAll = function _refreshAll2(force, skipRevert) {
      _docEl$1 = _doc$1.documentElement;
      _body$1 = _doc$1.body;
      _root = [_win$1, _doc$1, _docEl$1, _body$1];
      if (_lastScrollTime && !force && !_isReverted) {
        _addListener(ScrollTrigger$1, "scrollEnd", _softRefresh);
        return;
      }
      _refresh100vh();
      _refreshingAll = ScrollTrigger$1.isRefreshing = true;
      _scrollers.forEach(function (obj) {
        return _isFunction(obj) && ++obj.cacheID && (obj.rec = obj());
      });
      var refreshInits = _dispatch("refreshInit");
      _sort && ScrollTrigger$1.sort();
      skipRevert || _revertAll();
      _scrollers.forEach(function (obj) {
        if (_isFunction(obj)) {
          obj.smooth && (obj.target.style.scrollBehavior = "auto");
          obj(0);
        }
      });
      _triggers.slice(0).forEach(function (t) {
        return t.refresh();
      });
      _isReverted = false;
      _triggers.forEach(function (t) {
        if (t._subPinOffset && t.pin) {
          var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight", original = t.pin[prop];
          t.revert(true, 1);
          t.adjustPinSpacing(t.pin[prop] - original);
          t.refresh();
        }
      });
      _clampingMax = 1;
      _hideAllMarkers(true);
      _triggers.forEach(function (t) {
        var max2 = _maxScroll$1(t.scroller, t._dir), endClamp = t.vars.end === "max" || t._endClamp && t.end > max2, startClamp = t._startClamp && t.start >= max2;
        (endClamp || startClamp) && t.setPositions(startClamp ? max2 - 1 : t.start, endClamp ? Math.max(startClamp ? max2 : t.start + 1, max2) : t.end, true);
      });
      _hideAllMarkers(false);
      _clampingMax = 0;
      refreshInits.forEach(function (result) {
        return result && result.render && result.render(-1);
      });
      _scrollers.forEach(function (obj) {
        if (_isFunction(obj)) {
          obj.smooth && requestAnimationFrame(function () {
            return obj.target.style.scrollBehavior = "smooth";
          });
          obj.rec && obj(obj.rec);
        }
      });
      _clearScrollMemory(_scrollRestoration, 1);
      _resizeDelay.pause();
      _refreshID++;
      _refreshingAll = 2;
      _updateAll(2);
      _triggers.forEach(function (t) {
        return _isFunction(t.vars.onRefresh) && t.vars.onRefresh(t);
      });
      _refreshingAll = ScrollTrigger$1.isRefreshing = false;
      _dispatch("refresh");
    }, _lastScroll = 0, _direction = 1, _primary, _updateAll = function _updateAll2(force) {
      if (force === 2 || !_refreshingAll && !_isReverted) {
        ScrollTrigger$1.isUpdating = true;
        _primary && _primary.update(0);
        var l = _triggers.length, time = _getTime(), recordVelocity = time - _time1 >= 50, scroll = l && _triggers[0].scroll();
        _direction = _lastScroll > scroll ? -1 : 1;
        _refreshingAll || (_lastScroll = scroll);
        if (recordVelocity) {
          if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
            _lastScrollTime = 0;
            _dispatch("scrollEnd");
          }
          _time2 = _time1;
          _time1 = time;
        }
        if (_direction < 0) {
          _i = l;
          while (_i-- > 0) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
          _direction = 1;
        } else {
          for (_i = 0; _i < l; _i++) {
            _triggers[_i] && _triggers[_i].update(0, recordVelocity);
          }
        }
        ScrollTrigger$1.isUpdating = false;
      }
      _rafID = 0;
    }, _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"], _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]), _swapPinOut = function _swapPinOut2(pin, spacer, state) {
      _setState(state);
      var cache = pin._gsap;
      if (cache.spacerIsNative) {
        _setState(cache.spacerState);
      } else if (pin._gsap.swappedIn) {
        var parent = spacer.parentNode;
        if (parent) {
          parent.insertBefore(pin, spacer);
          parent.removeChild(spacer);
        }
      }
      pin._gsap.swappedIn = false;
    }, _swapPinIn = function _swapPinIn2(pin, spacer, cs, spacerState) {
      if (!pin._gsap.swappedIn) {
        var i = _propNamesToCopy.length, spacerStyle = spacer.style, pinStyle = pin.style, p;
        while (i--) {
          p = _propNamesToCopy[i];
          spacerStyle[p] = cs[p];
        }
        spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
        cs.display === "inline" && (spacerStyle.display = "inline-block");
        pinStyle[_bottom] = pinStyle[_right] = "auto";
        spacerStyle.flexBasis = cs.flexBasis || "auto";
        spacerStyle.overflow = "visible";
        spacerStyle.boxSizing = "border-box";
        spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
        spacerStyle[_height] = _getSize(pin, _vertical) + _px;
        spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";
        _setState(spacerState);
        pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
        pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
        pinStyle[_padding] = cs[_padding];
        if (pin.parentNode !== spacer) {
          pin.parentNode.insertBefore(spacer, pin);
          spacer.appendChild(pin);
        }
        pin._gsap.swappedIn = true;
      }
    }, _capsExp = /([A-Z])/g, _setState = function _setState2(state) {
      if (state) {
        var style = state.t.style, l = state.length, i = 0, p, value;
        (state.t._gsap || gsap$1.core.getCache(state.t)).uncache = 1;
        for (; i < l; i += 2) {
          value = state[i + 1];
          p = state[i];
          if (value) {
            style[p] = value;
          } else if (style[p]) {
            style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
          }
        }
      }
    }, _getState = function _getState2(element) {
      var l = _stateProps.length, style = element.style, state = [], i = 0;
      for (; i < l; i++) {
        state.push(_stateProps[i], style[_stateProps[i]]);
      }
      state.t = element;
      return state;
    }, _copyState = function _copyState2(state, override, omitOffsets) {
      var result = [], l = state.length, i = omitOffsets ? 8 : 0, p;
      for (; i < l; i += 2) {
        p = state[i];
        result.push(p, p in override ? override[p] : state[i + 1]);
      }
      result.t = state.t;
      return result;
    }, _winOffsets = {
      left: 0,
      top: 0
    }, _parsePosition = function _parsePosition2(value, trigger2, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation, clampZeroProp) {
      _isFunction(value) && (value = value(self));
      if (_isString(value) && value.substr(0, 3) === "max") {
        value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
      }
      var time = containerAnimation ? containerAnimation.time() : 0, p1, p2, element;
      containerAnimation && containerAnimation.seek(0);
      isNaN(value) || (value = +value);
      if (!_isNumber(value)) {
        _isFunction(trigger2) && (trigger2 = trigger2(self));
        var offsets = (value || "0").split(" "), bounds, localOffset, globalOffset, display;
        element = _getTarget(trigger2, self) || _body$1;
        bounds = _getBounds(element) || {};
        if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
          display = element.style.display;
          element.style.display = "block";
          bounds = _getBounds(element);
          display ? element.style.display = display : element.style.removeProperty("display");
        }
        localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
        globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
        value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
        markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
        scrollerSize -= scrollerSize - globalOffset;
      } else {
        containerAnimation && (value = gsap$1.utils.mapRange(containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, 0, scrollerMax, value));
        markerScroller && _positionMarker(markerScroller, scrollerSize, direction, true);
      }
      if (clampZeroProp) {
        self[clampZeroProp] = value || -1e-3;
        value < 0 && (value = 0);
      }
      if (marker) {
        var position = value + scrollerSize, isStart = marker._isStart;
        p1 = "scroll" + direction.d2;
        _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body$1[p1], _docEl$1[p1]) : marker.parentNode[p1]) <= position + 1);
        if (useFixedPosition) {
          scrollerBounds = _getBounds(markerScroller);
          useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
        }
      }
      if (containerAnimation && element) {
        p1 = _getBounds(element);
        containerAnimation.seek(scrollerMax);
        p2 = _getBounds(element);
        containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
        value = value / containerAnimation._caScrollDist * scrollerMax;
      }
      containerAnimation && containerAnimation.seek(time);
      return containerAnimation ? value : Math.round(value);
    }, _prefixExp = /(webkit|moz|length|cssText|inset)/i, _reparent = function _reparent2(element, parent, top, left) {
      if (element.parentNode !== parent) {
        var style = element.style, p, cs;
        if (parent === _body$1) {
          element._stOrig = style.cssText;
          cs = _getComputedStyle(element);
          for (p in cs) {
            if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
              style[p] = cs[p];
            }
          }
          style.top = top;
          style.left = left;
        } else {
          style.cssText = element._stOrig;
        }
        gsap$1.core.getCache(element).uncache = 1;
        parent.appendChild(element);
      }
    }, _interruptionTracker = function _interruptionTracker2(getValueFunc, initialValue, onInterrupt) {
      var last1 = initialValue, last2 = last1;
      return function (value) {
        var current = Math.round(getValueFunc());
        if (current !== last1 && current !== last2 && Math.abs(current - last1) > 3 && Math.abs(current - last2) > 3) {
          value = current;
          onInterrupt && onInterrupt();
        }
        last2 = last1;
        last1 = Math.round(value);
        return last1;
      };
    }, _shiftMarker = function _shiftMarker2(marker, direction, value) {
      var vars = {};
      vars[direction.p] = "+=" + value;
      gsap$1.set(marker, vars);
    }, _getTweenCreator = function _getTweenCreator2(scroller, direction) {
      var getScroll = _getScrollFunc(scroller, direction), prop = "_scroll" + direction.p2, getTween = function getTween2(scrollTo2, vars, initialValue, change1, change2) {
        var tween = getTween2.tween, onComplete = vars.onComplete, modifiers = {};
        initialValue = initialValue || getScroll();
        var checkForInterruption = _interruptionTracker(getScroll, initialValue, function () {
          tween.kill();
          getTween2.tween = 0;
        });
        change2 = change1 && change2 || 0;
        change1 = change1 || scrollTo2 - initialValue;
        tween && tween.kill();
        vars[prop] = scrollTo2;
        vars.inherit = false;
        vars.modifiers = modifiers;
        modifiers[prop] = function () {
          return checkForInterruption(initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio);
        };
        vars.onUpdate = function () {
          _scrollers.cache++;
          getTween2.tween && _updateAll();
        };
        vars.onComplete = function () {
          getTween2.tween = 0;
          onComplete && onComplete.call(tween);
        };
        tween = getTween2.tween = gsap$1.to(scroller, vars);
        return tween;
      };
      scroller[prop] = getScroll;
      getScroll.wheelHandler = function () {
        return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
      };
      _addListener(scroller, "wheel", getScroll.wheelHandler);
      ScrollTrigger$1.isTouch && _addListener(scroller, "touchmove", getScroll.wheelHandler);
      return getTween;
    };
    var ScrollTrigger$1 = /* @__PURE__ */ function () {
      function ScrollTrigger2(vars, animation) {
        _coreInitted$1 || ScrollTrigger2.register(gsap$1) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
        _context$1(this);
        this.init(vars, animation);
      }
      var _proto = ScrollTrigger2.prototype;
      _proto.init = function init(vars, animation) {
        this.progress = this.start = 0;
        this.vars && this.kill(true, true);
        if (!_enabled) {
          this.update = this.refresh = this.kill = _passThrough;
          return;
        }
        vars = _setDefaults(_isString(vars) || _isNumber(vars) || vars.nodeType ? {
          trigger: vars
        } : vars, _defaults);
        var _vars = vars, onUpdate = _vars.onUpdate, toggleClass = _vars.toggleClass, id = _vars.id, onToggle = _vars.onToggle, onRefresh = _vars.onRefresh, scrub = _vars.scrub, trigger2 = _vars.trigger, pin = _vars.pin, pinSpacing = _vars.pinSpacing, invalidateOnRefresh = _vars.invalidateOnRefresh, anticipatePin = _vars.anticipatePin, onScrubComplete = _vars.onScrubComplete, onSnapComplete = _vars.onSnapComplete, once = _vars.once, snap2 = _vars.snap, pinReparent = _vars.pinReparent, pinSpacer = _vars.pinSpacer, containerAnimation = _vars.containerAnimation, fastScrollEnd = _vars.fastScrollEnd, preventOverlaps = _vars.preventOverlaps, direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical, isToggle = !scrub && scrub !== 0, scroller = _getTarget(vars.scroller || _win$1), scrollerCache = gsap$1.core.getCache(scroller), isViewport = _isViewport(scroller), useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed", callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack], toggleActions = isToggle && vars.toggleActions.split(" "), markers = "markers" in vars ? vars.markers : _defaults.markers, borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, self = this, onRefreshInit = vars.onRefreshInit && function () {
          return vars.onRefreshInit(self);
        }, getScrollerSize = _getSizeFunc(scroller, isViewport, direction), getScrollerOffsets = _getOffsetsFunc(scroller, isViewport), lastSnap = 0, lastRefresh = 0, prevProgress = 0, scrollFunc = _getScrollFunc(scroller, direction), tweenTo, pinCache, snapFunc, scroll1, scroll2, start, end, markerStart, markerEnd, markerStartTrigger, markerEndTrigger, markerVars, executingOnRefresh, change, pinOriginalState, pinActiveState, pinState, spacer, offset2, pinGetter, pinSetter, pinStart, pinChange, spacingStart, spacerState, markerStartSetter, pinMoves, markerEndSetter, cs, snap1, snap22, scrubTween, scrubSmooth, snapDurClamp, snapDelayedCall, prevScroll, prevAnimProgress, caMarkerSetter, customRevertReturn;
        self._startClamp = self._endClamp = false;
        self._dir = direction;
        anticipatePin *= 45;
        self.scroller = scroller;
        self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
        scroll1 = scrollFunc();
        self.vars = vars;
        animation = animation || vars.animation;
        if ("refreshPriority" in vars) {
          _sort = 1;
          vars.refreshPriority === -9999 && (_primary = self);
        }
        scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
          top: _getTweenCreator(scroller, _vertical),
          left: _getTweenCreator(scroller, _horizontal)
        };
        self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];
        self.scrubDuration = function (value) {
          scrubSmooth = _isNumber(value) && value;
          if (!scrubSmooth) {
            scrubTween && scrubTween.progress(1).kill();
            scrubTween = 0;
          } else {
            scrubTween ? scrubTween.duration(value) : scrubTween = gsap$1.to(animation, {
              ease: "expo",
              totalProgress: "+=0",
              inherit: false,
              duration: scrubSmooth,
              paused: true,
              onComplete: function onComplete() {
                return onScrubComplete && onScrubComplete(self);
              }
            });
          }
        };
        if (animation) {
          animation.vars.lazy = false;
          animation._initted && !self.isReverted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true);
          self.animation = animation.pause();
          animation.scrollTrigger = self;
          self.scrubDuration(scrub);
          snap1 = 0;
          id || (id = animation.vars.id);
        }
        if (snap2) {
          if (!_isObject(snap2) || snap2.push) {
            snap2 = {
              snapTo: snap2
            };
          }
          "scrollBehavior" in _body$1.style && gsap$1.set(isViewport ? [_body$1, _docEl$1] : scroller, {
            scrollBehavior: "auto"
          });
          _scrollers.forEach(function (o) {
            return _isFunction(o) && o.target === (isViewport ? _doc$1.scrollingElement || _docEl$1 : scroller) && (o.smooth = false);
          });
          snapFunc = _isFunction(snap2.snapTo) ? snap2.snapTo : snap2.snapTo === "labels" ? _getClosestLabel(animation) : snap2.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap2.directional !== false ? function (value, st) {
            return _snapDirectional(snap2.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
          } : gsap$1.utils.snap(snap2.snapTo);
          snapDurClamp = snap2.duration || {
            min: 0.1,
            max: 2
          };
          snapDurClamp = _isObject(snapDurClamp) ? _clamp$1(snapDurClamp.min, snapDurClamp.max) : _clamp$1(snapDurClamp, snapDurClamp);
          snapDelayedCall = gsap$1.delayedCall(snap2.delay || scrubSmooth / 2 || 0.1, function () {
            var scroll = scrollFunc(), refreshedRecently = _getTime() - lastRefresh < 500, tween = tweenTo.tween;
            if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
              var progress = (scroll - start) / change, totalProgress = animation && !isToggle ? animation.totalProgress() : progress, velocity = refreshedRecently ? 0 : (totalProgress - snap22) / (_getTime() - _time2) * 1e3 || 0, change1 = gsap$1.utils.clamp(-progress, 1 - progress, _abs(velocity / 2) * velocity / 0.185), naturalEnd = progress + (snap2.inertia === false ? 0 : change1), endValue, endScroll, _snap = snap2, onStart = _snap.onStart, _onInterrupt = _snap.onInterrupt, _onComplete = _snap.onComplete;
              endValue = snapFunc(naturalEnd, self);
              _isNumber(endValue) || (endValue = naturalEnd);
              endScroll = Math.max(0, Math.round(start + endValue * change));
              if (scroll <= end && scroll >= start && endScroll !== scroll) {
                if (tween && !tween._initted && tween.data <= _abs(endScroll - scroll)) {
                  return;
                }
                if (snap2.inertia === false) {
                  change1 = endValue - progress;
                }
                tweenTo(endScroll, {
                  duration: snapDurClamp(_abs(Math.max(_abs(naturalEnd - totalProgress), _abs(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
                  ease: snap2.ease || "power3",
                  data: _abs(endScroll - scroll),
                  // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
                  onInterrupt: function onInterrupt() {
                    return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
                  },
                  onComplete: function onComplete() {
                    self.update();
                    lastSnap = scrollFunc();
                    if (animation && !isToggle) {
                      scrubTween ? scrubTween.resetTo("totalProgress", endValue, animation._tTime / animation._tDur) : animation.progress(endValue);
                    }
                    snap1 = snap22 = animation && !isToggle ? animation.totalProgress() : self.progress;
                    onSnapComplete && onSnapComplete(self);
                    _onComplete && _onComplete(self);
                  }
                }, scroll, change1 * change, endScroll - scroll - change1 * change);
                onStart && onStart(self, tweenTo.tween);
              }
            } else if (self.isActive && lastSnap !== scroll) {
              snapDelayedCall.restart(true);
            }
          }).pause();
        }
        id && (_ids[id] = self);
        trigger2 = self.trigger = _getTarget(trigger2 || pin !== true && pin);
        customRevertReturn = trigger2 && trigger2._gsap && trigger2._gsap.stRevert;
        customRevertReturn && (customRevertReturn = customRevertReturn(self));
        pin = pin === true ? trigger2 : _getTarget(pin);
        _isString(toggleClass) && (toggleClass = {
          targets: trigger2,
          className: toggleClass
        });
        if (pin) {
          pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding);
          self.pin = pin;
          pinCache = gsap$1.core.getCache(pin);
          if (!pinCache.spacer) {
            if (pinSpacer) {
              pinSpacer = _getTarget(pinSpacer);
              pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement);
              pinCache.spacerIsNative = !!pinSpacer;
              pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
            }
            pinCache.spacer = spacer = pinSpacer || _doc$1.createElement("div");
            spacer.classList.add("pin-spacer");
            id && spacer.classList.add("pin-spacer-" + id);
            pinCache.pinState = pinOriginalState = _getState(pin);
          } else {
            pinOriginalState = pinCache.pinState;
          }
          vars.force3D !== false && gsap$1.set(pin, {
            force3D: true
          });
          self.spacer = spacer = pinCache.spacer;
          cs = _getComputedStyle(pin);
          spacingStart = cs[pinSpacing + direction.os2];
          pinGetter = gsap$1.getProperty(pin);
          pinSetter = gsap$1.quickSetter(pin, direction.a, _px);
          _swapPinIn(pin, spacer, cs);
          pinState = _getState(pin);
        }
        if (markers) {
          markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
          markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
          markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
          offset2 = markerStartTrigger["offset" + direction.op.d2];
          var content = _getTarget(_getProxyProp(scroller, "content") || scroller);
          markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset2, 0, containerAnimation);
          markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset2, 0, containerAnimation);
          containerAnimation && (caMarkerSetter = gsap$1.quickSetter([markerStart, markerEnd], direction.a, _px));
          if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
            _makePositionable(isViewport ? _body$1 : scroller);
            gsap$1.set([markerStartTrigger, markerEndTrigger], {
              force3D: true
            });
            markerStartSetter = gsap$1.quickSetter(markerStartTrigger, direction.a, _px);
            markerEndSetter = gsap$1.quickSetter(markerEndTrigger, direction.a, _px);
          }
        }
        if (containerAnimation) {
          var oldOnUpdate = containerAnimation.vars.onUpdate, oldParams = containerAnimation.vars.onUpdateParams;
          containerAnimation.eventCallback("onUpdate", function () {
            self.update(0, 0, 1);
            oldOnUpdate && oldOnUpdate.apply(containerAnimation, oldParams || []);
          });
        }
        self.previous = function () {
          return _triggers[_triggers.indexOf(self) - 1];
        };
        self.next = function () {
          return _triggers[_triggers.indexOf(self) + 1];
        };
        self.revert = function (revert, temp) {
          if (!temp) {
            return self.kill(true);
          }
          var r = revert !== false || !self.enabled, prevRefreshing = _refreshing;
          if (r !== self.isReverted) {
            if (r) {
              prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0);
              prevProgress = self.progress;
              prevAnimProgress = animation && animation.progress();
            }
            markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
              return m.style.display = r ? "none" : "block";
            });
            if (r) {
              _refreshing = self;
              self.update(r);
            }
            if (pin && (!pinReparent || !self.isActive)) {
              if (r) {
                _swapPinOut(pin, spacer, pinOriginalState);
              } else {
                _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
              }
            }
            r || self.update(r);
            _refreshing = prevRefreshing;
            self.isReverted = r;
          }
        };
        self.refresh = function (soft, force, position, pinOffset) {
          if ((_refreshing || !self.enabled) && !force) {
            return;
          }
          if (pin && soft && _lastScrollTime) {
            _addListener(ScrollTrigger2, "scrollEnd", _softRefresh);
            return;
          }
          !_refreshingAll && onRefreshInit && onRefreshInit(self);
          _refreshing = self;
          if (tweenTo.tween && !position) {
            tweenTo.tween.kill();
            tweenTo.tween = 0;
          }
          scrubTween && scrubTween.pause();
          invalidateOnRefresh && animation && animation.revert({
            kill: false
          }).invalidate();
          self.isReverted || self.revert(true, true);
          self._subPinOffset = false;
          var size2 = getScrollerSize(), scrollerBounds = getScrollerOffsets(), max2 = containerAnimation ? containerAnimation.duration() : _maxScroll$1(scroller, direction), isFirstRefresh = change <= 0.01, offset3 = 0, otherPinOffset = pinOffset || 0, parsedEnd = _isObject(position) ? position.end : vars.end, parsedEndTrigger = vars.endTrigger || trigger2, parsedStart = _isObject(position) ? position.start : vars.start || (vars.start === 0 || !trigger2 ? 0 : pin ? "0 0" : "0 100%"), pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer, self), triggerIndex = trigger2 && Math.max(0, _triggers.indexOf(self)) || 0, i = triggerIndex, cs2, bounds, scroll, isVertical, override, curTrigger, curPin, oppositeScroll, initted, revertedPins, forcedOverflow, markerStartOffset, markerEndOffset;
          if (markers && _isObject(position)) {
            markerStartOffset = gsap$1.getProperty(markerStartTrigger, direction.p);
            markerEndOffset = gsap$1.getProperty(markerEndTrigger, direction.p);
          }
          while (i-- > 0) {
            curTrigger = _triggers[i];
            curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = self);
            curPin = curTrigger.pin;
            if (curPin && (curPin === trigger2 || curPin === pin || curPin === pinnedContainer) && !curTrigger.isReverted) {
              revertedPins || (revertedPins = []);
              revertedPins.unshift(curTrigger);
              curTrigger.revert(true, true);
            }
            if (curTrigger !== _triggers[i]) {
              triggerIndex--;
              i--;
            }
          }
          _isFunction(parsedStart) && (parsedStart = parsedStart(self));
          parsedStart = _parseClamp(parsedStart, "start", self);
          start = _parsePosition(parsedStart, trigger2, size2, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max2, containerAnimation, self._startClamp && "_startClamp") || (pin ? -1e-3 : 0);
          _isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));
          if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
            if (~parsedEnd.indexOf(" ")) {
              parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
            } else {
              offset3 = _offsetToPx(parsedEnd.substr(2), size2);
              parsedEnd = _isString(parsedStart) ? parsedStart : (containerAnimation ? gsap$1.utils.mapRange(0, containerAnimation.duration(), containerAnimation.scrollTrigger.start, containerAnimation.scrollTrigger.end, start) : start) + offset3;
              parsedEndTrigger = trigger2;
            }
          }
          parsedEnd = _parseClamp(parsedEnd, "end", self);
          end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max2), parsedEndTrigger, size2, direction, scrollFunc() + offset3, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max2, containerAnimation, self._endClamp && "_endClamp")) || -1e-3;
          offset3 = 0;
          i = triggerIndex;
          while (i--) {
            curTrigger = _triggers[i];
            curPin = curTrigger.pin;
            if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
              cs2 = curTrigger.end - (self._startClamp ? Math.max(0, curTrigger.start) : curTrigger.start);
              if ((curPin === trigger2 && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && isNaN(parsedStart)) {
                offset3 += cs2 * (1 - curTrigger.progress);
              }
              curPin === pin && (otherPinOffset += cs2);
            }
          }
          start += offset3;
          end += offset3;
          self._startClamp && (self._startClamp += offset3);
          if (self._endClamp && !_refreshingAll) {
            self._endClamp = end || -1e-3;
            end = Math.min(end, _maxScroll$1(scroller, direction));
          }
          change = end - start || (start -= 0.01) && 1e-3;
          if (isFirstRefresh) {
            prevProgress = gsap$1.utils.clamp(0, 1, gsap$1.utils.normalize(start, end, prevScroll));
          }
          self._pinPush = otherPinOffset;
          if (markerStart && offset3) {
            cs2 = {};
            cs2[direction.a] = "+=" + offset3;
            pinnedContainer && (cs2[direction.p] = "-=" + scrollFunc());
            gsap$1.set([markerStart, markerEnd], cs2);
          }
          if (pin && !(_clampingMax && self.end >= _maxScroll$1(scroller, direction))) {
            cs2 = _getComputedStyle(pin);
            isVertical = direction === _vertical;
            scroll = scrollFunc();
            pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;
            if (!max2 && end > 1) {
              forcedOverflow = (isViewport ? _doc$1.scrollingElement || _docEl$1 : scroller).style;
              forcedOverflow = {
                style: forcedOverflow,
                value: forcedOverflow["overflow" + direction.a.toUpperCase()]
              };
              if (isViewport && _getComputedStyle(_body$1)["overflow" + direction.a.toUpperCase()] !== "scroll") {
                forcedOverflow.style["overflow" + direction.a.toUpperCase()] = "scroll";
              }
            }
            _swapPinIn(pin, spacer, cs2);
            pinState = _getState(pin);
            bounds = _getBounds(pin, true);
            oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();
            if (pinSpacing) {
              spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
              spacerState.t = spacer;
              i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
              if (i) {
                spacerState.push(direction.d, i + _px);
                spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
              }
              _setState(spacerState);
              if (pinnedContainer) {
                _triggers.forEach(function (t) {
                  if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) {
                    t._subPinOffset = true;
                  }
                });
              }
              useFixedPosition && scrollFunc(prevScroll);
            } else {
              i = _getSize(pin, direction);
              i && spacer.style.flexBasis !== "auto" && (spacer.style.flexBasis = i + _px);
            }
            if (useFixedPosition) {
              override = {
                top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
                left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
                boxSizing: "border-box",
                position: "fixed"
              };
              override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
              override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
              override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
              override[_padding] = cs2[_padding];
              override[_padding + _Top] = cs2[_padding + _Top];
              override[_padding + _Right] = cs2[_padding + _Right];
              override[_padding + _Bottom] = cs2[_padding + _Bottom];
              override[_padding + _Left] = cs2[_padding + _Left];
              pinActiveState = _copyState(pinOriginalState, override, pinReparent);
              _refreshingAll && scrollFunc(0);
            }
            if (animation) {
              initted = animation._initted;
              _suppressOverwrites(1);
              animation.render(animation.duration(), true, true);
              pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
              pinMoves = Math.abs(change - pinChange) > 1;
              useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2);
              animation.render(0, true, true);
              initted || animation.invalidate(true);
              animation.parent || animation.totalTime(animation.totalTime());
              _suppressOverwrites(0);
            } else {
              pinChange = change;
            }
            forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
          } else if (trigger2 && scrollFunc() && !containerAnimation) {
            bounds = trigger2.parentNode;
            while (bounds && bounds !== _body$1) {
              if (bounds._pinOffset) {
                start -= bounds._pinOffset;
                end -= bounds._pinOffset;
              }
              bounds = bounds.parentNode;
            }
          }
          revertedPins && revertedPins.forEach(function (t) {
            return t.revert(false, true);
          });
          self.start = start;
          self.end = end;
          scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc();
          if (!containerAnimation && !_refreshingAll) {
            scroll1 < prevScroll && scrollFunc(prevScroll);
            self.scroll.rec = 0;
          }
          self.revert(false, true);
          lastRefresh = _getTime();
          if (snapDelayedCall) {
            lastSnap = -1;
            snapDelayedCall.restart(true);
          }
          _refreshing = 0;
          animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress || 0, true).render(animation.time(), true, true);
          if (isFirstRefresh || prevProgress !== self.progress || containerAnimation || invalidateOnRefresh || animation && !animation._initted) {
            animation && !isToggle && animation.totalProgress(containerAnimation && start < -1e-3 && !prevProgress ? gsap$1.utils.normalize(start, end, 0) : prevProgress, true);
            self.progress = isFirstRefresh || (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
          }
          pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange));
          scrubTween && scrubTween.invalidate();
          if (!isNaN(markerStartOffset)) {
            markerStartOffset -= gsap$1.getProperty(markerStartTrigger, direction.p);
            markerEndOffset -= gsap$1.getProperty(markerEndTrigger, direction.p);
            _shiftMarker(markerStartTrigger, direction, markerStartOffset);
            _shiftMarker(markerStart, direction, markerStartOffset - (pinOffset || 0));
            _shiftMarker(markerEndTrigger, direction, markerEndOffset);
            _shiftMarker(markerEnd, direction, markerEndOffset - (pinOffset || 0));
          }
          isFirstRefresh && !_refreshingAll && self.update();
          if (onRefresh && !_refreshingAll && !executingOnRefresh) {
            executingOnRefresh = true;
            onRefresh(self);
            executingOnRefresh = false;
          }
        };
        self.getVelocity = function () {
          return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1e3 || 0;
        };
        self.endAnimation = function () {
          _endAnimation(self.callbackAnimation);
          if (animation) {
            scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
          }
        };
        self.labelToScroll = function (label) {
          return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
        };
        self.getTrailing = function (name) {
          var i = _triggers.indexOf(self), a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);
          return (_isString(name) ? a.filter(function (t) {
            return t.vars.preventOverlaps === name;
          }) : a).filter(function (t) {
            return self.direction > 0 ? t.end <= start : t.start >= end;
          });
        };
        self.update = function (reset, recordVelocity, forceFake) {
          if (containerAnimation && !forceFake && !reset) {
            return;
          }
          var scroll = _refreshingAll === true ? prevScroll : self.scroll(), p = reset ? 0 : (scroll - start) / change, clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0, prevProgress2 = self.progress, isActive, wasActive, toggleState, action, stateChanged, toggled, isAtMax, isTakingAction;
          if (recordVelocity) {
            scroll2 = scroll1;
            scroll1 = containerAnimation ? scrollFunc() : scroll;
            if (snap2) {
              snap22 = snap1;
              snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
            }
          }
          if (anticipatePin && pin && !_refreshing && !_startup && _lastScrollTime) {
            if (!clipped && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
              clipped = 1e-4;
            } else if (clipped === 1 && end > scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin) {
              clipped = 0.9999;
            }
          }
          if (clipped !== prevProgress2 && self.enabled) {
            isActive = self.isActive = !!clipped && clipped < 1;
            wasActive = !!prevProgress2 && prevProgress2 < 1;
            toggled = isActive !== wasActive;
            stateChanged = toggled || !!clipped !== !!prevProgress2;
            self.direction = clipped > prevProgress2 ? 1 : -1;
            self.progress = clipped;
            if (stateChanged && !_refreshing) {
              toggleState = clipped && !prevProgress2 ? 0 : clipped === 1 ? 1 : prevProgress2 === 1 ? 2 : 3;
              if (isToggle) {
                action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState];
                isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
              }
            }
            preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function (t) {
              return t.endAnimation();
            }));
            if (!isToggle) {
              if (scrubTween && !_refreshing && !_startup) {
                scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start);
                if (scrubTween.resetTo) {
                  scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
                } else {
                  scrubTween.vars.totalProgress = clipped;
                  scrubTween.invalidate().restart();
                }
              } else if (animation) {
                animation.totalProgress(clipped, !!(_refreshing && (lastRefresh || reset)));
              }
            }
            if (pin) {
              reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);
              if (!useFixedPosition) {
                pinSetter(_round$1(pinStart + pinChange * clipped));
              } else if (stateChanged) {
                isAtMax = !reset && clipped > prevProgress2 && end + 1 > scroll && scroll + 1 >= _maxScroll$1(scroller, direction);
                if (pinReparent) {
                  if (!reset && (isActive || isAtMax)) {
                    var bounds = _getBounds(pin, true), _offset = scroll - start;
                    _reparent(pin, _body$1, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
                  } else {
                    _reparent(pin, spacer);
                  }
                }
                _setState(isActive || isAtMax ? pinActiveState : pinState);
                pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
              }
            }
            snap2 && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
            toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray$1(toggleClass.targets).forEach(function (el) {
              return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
            });
            onUpdate && !isToggle && !reset && onUpdate(self);
            if (stateChanged && !_refreshing) {
              if (isToggle) {
                if (isTakingAction) {
                  if (action === "complete") {
                    animation.pause().totalProgress(1);
                  } else if (action === "reset") {
                    animation.restart(true).pause();
                  } else if (action === "restart") {
                    animation.restart(true);
                  } else {
                    animation[action]();
                  }
                }
                onUpdate && onUpdate(self);
              }
              if (toggled || !_limitCallbacks) {
                onToggle && toggled && _callback(self, onToggle);
                callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0);
                if (!toggled) {
                  toggleState = clipped === 1 ? 1 : 3;
                  callbacks[toggleState] && _callback(self, callbacks[toggleState]);
                }
              }
              if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber(fastScrollEnd) ? fastScrollEnd : 2500)) {
                _endAnimation(self.callbackAnimation);
                scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
              }
            } else if (isToggle && onUpdate && !_refreshing) {
              onUpdate(self);
            }
          }
          if (markerEndSetter) {
            var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
            markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
            markerEndSetter(n);
          }
          caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
        };
        self.enable = function (reset, refresh) {
          if (!self.enabled) {
            self.enabled = true;
            _addListener(scroller, "resize", _onResize);
            isViewport || _addListener(scroller, "scroll", _onScroll);
            onRefreshInit && _addListener(ScrollTrigger2, "refreshInit", onRefreshInit);
            if (reset !== false) {
              self.progress = prevProgress = 0;
              scroll1 = scroll2 = lastSnap = scrollFunc();
            }
            refresh !== false && self.refresh();
          }
        };
        self.getTween = function (snap3) {
          return snap3 && tweenTo ? tweenTo.tween : scrubTween;
        };
        self.setPositions = function (newStart, newEnd, keepClamp, pinOffset) {
          if (containerAnimation) {
            var st = containerAnimation.scrollTrigger, duration = containerAnimation.duration(), _change = st.end - st.start;
            newStart = st.start + _change * newStart / duration;
            newEnd = st.start + _change * newEnd / duration;
          }
          self.refresh(false, false, {
            start: _keepClamp(newStart, keepClamp && !!self._startClamp),
            end: _keepClamp(newEnd, keepClamp && !!self._endClamp)
          }, pinOffset);
          self.update();
        };
        self.adjustPinSpacing = function (amount) {
          if (spacerState && amount) {
            var i = spacerState.indexOf(direction.d) + 1;
            spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
            spacerState[1] = parseFloat(spacerState[1]) + amount + _px;
            _setState(spacerState);
          }
        };
        self.disable = function (reset, allowAnimation) {
          if (self.enabled) {
            reset !== false && self.revert(true, true);
            self.enabled = self.isActive = false;
            allowAnimation || scrubTween && scrubTween.pause();
            prevScroll = 0;
            pinCache && (pinCache.uncache = 1);
            onRefreshInit && _removeListener(ScrollTrigger2, "refreshInit", onRefreshInit);
            if (snapDelayedCall) {
              snapDelayedCall.pause();
              tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
            }
            if (!isViewport) {
              var i = _triggers.length;
              while (i--) {
                if (_triggers[i].scroller === scroller && _triggers[i] !== self) {
                  return;
                }
              }
              _removeListener(scroller, "resize", _onResize);
              isViewport || _removeListener(scroller, "scroll", _onScroll);
            }
          }
        };
        self.kill = function (revert, allowAnimation) {
          self.disable(revert, allowAnimation);
          scrubTween && !allowAnimation && scrubTween.kill();
          id && delete _ids[id];
          var i = _triggers.indexOf(self);
          i >= 0 && _triggers.splice(i, 1);
          i === _i && _direction > 0 && _i--;
          i = 0;
          _triggers.forEach(function (t) {
            return t.scroller === self.scroller && (i = 1);
          });
          i || _refreshingAll || (self.scroll.rec = 0);
          if (animation) {
            animation.scrollTrigger = null;
            revert && animation.revert({
              kill: false
            });
            allowAnimation || animation.kill();
          }
          markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
            return m.parentNode && m.parentNode.removeChild(m);
          });
          _primary === self && (_primary = 0);
          if (pin) {
            pinCache && (pinCache.uncache = 1);
            i = 0;
            _triggers.forEach(function (t) {
              return t.pin === pin && i++;
            });
            i || (pinCache.spacer = 0);
          }
          vars.onKill && vars.onKill(self);
        };
        _triggers.push(self);
        self.enable(false, false);
        customRevertReturn && customRevertReturn(self);
        if (animation && animation.add && !change) {
          var updateFunc = self.update;
          self.update = function () {
            self.update = updateFunc;
            _scrollers.cache++;
            start || end || self.refresh();
          };
          gsap$1.delayedCall(0.01, self.update);
          change = 0.01;
          start = end = 0;
        } else {
          self.refresh();
        }
        pin && _queueRefreshAll();
      };
      ScrollTrigger2.register = function register(core) {
        if (!_coreInitted$1) {
          gsap$1 = core || _getGSAP$1();
          _windowExists$1() && window.document && ScrollTrigger2.enable();
          _coreInitted$1 = _enabled;
        }
        return _coreInitted$1;
      };
      ScrollTrigger2.defaults = function defaults2(config) {
        if (config) {
          for (var p in config) {
            _defaults[p] = config[p];
          }
        }
        return _defaults;
      };
      ScrollTrigger2.disable = function disable(reset, kill) {
        _enabled = 0;
        _triggers.forEach(function (trigger2) {
          return trigger2[kill ? "kill" : "disable"](reset);
        });
        _removeListener(_win$1, "wheel", _onScroll);
        _removeListener(_doc$1, "scroll", _onScroll);
        clearInterval(_syncInterval);
        _removeListener(_doc$1, "touchcancel", _passThrough);
        _removeListener(_body$1, "touchstart", _passThrough);
        _multiListener(_removeListener, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
        _multiListener(_removeListener, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
        _resizeDelay.kill();
        _iterateAutoRefresh(_removeListener);
        for (var i = 0; i < _scrollers.length; i += 3) {
          _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
          _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
        }
      };
      ScrollTrigger2.enable = function enable() {
        _win$1 = window;
        _doc$1 = document;
        _docEl$1 = _doc$1.documentElement;
        _body$1 = _doc$1.body;
        if (gsap$1) {
          _toArray$1 = gsap$1.utils.toArray;
          _clamp$1 = gsap$1.utils.clamp;
          _context$1 = gsap$1.core.context || _passThrough;
          _suppressOverwrites = gsap$1.core.suppressOverwrites || _passThrough;
          _scrollRestoration = _win$1.history.scrollRestoration || "auto";
          _lastScroll = _win$1.pageYOffset || 0;
          gsap$1.core.globals("ScrollTrigger", ScrollTrigger2);
          if (_body$1) {
            _enabled = 1;
            _div100vh = document.createElement("div");
            _div100vh.style.height = "100vh";
            _div100vh.style.position = "absolute";
            _refresh100vh();
            _rafBugFix();
            Observer.register(gsap$1);
            ScrollTrigger2.isTouch = Observer.isTouch;
            _fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent);
            _ignoreMobileResize = Observer.isTouch === 1;
            _addListener(_win$1, "wheel", _onScroll);
            _root = [_win$1, _doc$1, _docEl$1, _body$1];
            if (gsap$1.matchMedia) {
              ScrollTrigger2.matchMedia = function (vars) {
                var mm = gsap$1.matchMedia(), p;
                for (p in vars) {
                  mm.add(p, vars[p]);
                }
                return mm;
              };
              gsap$1.addEventListener("matchMediaInit", function () {
                return _revertAll();
              });
              gsap$1.addEventListener("matchMediaRevert", function () {
                return _revertRecorded();
              });
              gsap$1.addEventListener("matchMedia", function () {
                _refreshAll(0, 1);
                _dispatch("matchMedia");
              });
              gsap$1.matchMedia().add("(orientation: portrait)", function () {
                _setBaseDimensions();
                return _setBaseDimensions;
              });
            } else {
              console.warn("Requires GSAP 3.11.0 or later");
            }
            _setBaseDimensions();
            _addListener(_doc$1, "scroll", _onScroll);
            var bodyHasStyle = _body$1.hasAttribute("style"), bodyStyle = _body$1.style, border = bodyStyle.borderTopStyle, AnimationProto = gsap$1.core.Animation.prototype, bounds, i;
            AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
              value: function value() {
                return this.time(-0.01, true);
              }
            });
            bodyStyle.borderTopStyle = "solid";
            bounds = _getBounds(_body$1);
            _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0;
            _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
            border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style");
            if (!bodyHasStyle) {
              _body$1.setAttribute("style", "");
              _body$1.removeAttribute("style");
            }
            _syncInterval = setInterval(_sync, 250);
            gsap$1.delayedCall(0.5, function () {
              return _startup = 0;
            });
            _addListener(_doc$1, "touchcancel", _passThrough);
            _addListener(_body$1, "touchstart", _passThrough);
            _multiListener(_addListener, _doc$1, "pointerdown,touchstart,mousedown", _pointerDownHandler);
            _multiListener(_addListener, _doc$1, "pointerup,touchend,mouseup", _pointerUpHandler);
            _transformProp = gsap$1.utils.checkPrefix("transform");
            _stateProps.push(_transformProp);
            _coreInitted$1 = _getTime();
            _resizeDelay = gsap$1.delayedCall(0.2, _refreshAll).pause();
            _autoRefresh = [_doc$1, "visibilitychange", function () {
              var w = _win$1.innerWidth, h = _win$1.innerHeight;
              if (_doc$1.hidden) {
                _prevWidth = w;
                _prevHeight = h;
              } else if (_prevWidth !== w || _prevHeight !== h) {
                _onResize();
              }
            }, _doc$1, "DOMContentLoaded", _refreshAll, _win$1, "load", _refreshAll, _win$1, "resize", _onResize];
            _iterateAutoRefresh(_addListener);
            _triggers.forEach(function (trigger2) {
              return trigger2.enable(0, 1);
            });
            for (i = 0; i < _scrollers.length; i += 3) {
              _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);
              _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
            }
          }
        }
      };
      ScrollTrigger2.config = function config(vars) {
        "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
        var ms = vars.syncInterval;
        ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
        "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger2.isTouch === 1 && vars.ignoreMobileResize);
        if ("autoRefreshEvents" in vars) {
          _iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
          _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
        }
      };
      ScrollTrigger2.scrollerProxy = function scrollerProxy(target, vars) {
        var t = _getTarget(target), i = _scrollers.indexOf(t), isViewport = _isViewport(t);
        if (~i) {
          _scrollers.splice(i, isViewport ? 6 : 2);
        }
        if (vars) {
          isViewport ? _proxies.unshift(_win$1, vars, _body$1, vars, _docEl$1, vars) : _proxies.unshift(t, vars);
        }
      };
      ScrollTrigger2.clearMatchMedia = function clearMatchMedia(query) {
        _triggers.forEach(function (t) {
          return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
        });
      };
      ScrollTrigger2.isInViewport = function isInViewport(element, ratio, horizontal) {
        var bounds = (_isString(element) ? _getTarget(element) : element).getBoundingClientRect(), offset2 = bounds[horizontal ? _width : _height] * ratio || 0;
        return horizontal ? bounds.right - offset2 > 0 && bounds.left + offset2 < _win$1.innerWidth : bounds.bottom - offset2 > 0 && bounds.top + offset2 < _win$1.innerHeight;
      };
      ScrollTrigger2.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
        _isString(element) && (element = _getTarget(element));
        var bounds = element.getBoundingClientRect(), size2 = bounds[horizontal ? _width : _height], offset2 = referencePoint == null ? size2 / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size2 : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size2 / 100 : parseFloat(referencePoint) || 0;
        return horizontal ? (bounds.left + offset2) / _win$1.innerWidth : (bounds.top + offset2) / _win$1.innerHeight;
      };
      ScrollTrigger2.killAll = function killAll(allowListeners) {
        _triggers.slice(0).forEach(function (t) {
          return t.vars.id !== "ScrollSmoother" && t.kill();
        });
        if (allowListeners !== true) {
          var listeners = _listeners.killAll || [];
          _listeners = {};
          listeners.forEach(function (f) {
            return f();
          });
        }
      };
      return ScrollTrigger2;
    }();
    ScrollTrigger$1.version = "3.12.7";
    ScrollTrigger$1.saveStyles = function (targets) {
      return targets ? _toArray$1(targets).forEach(function (target) {
        if (target && target.style) {
          var i = _savedStyles.indexOf(target);
          i >= 0 && _savedStyles.splice(i, 5);
          _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$1.core.getCache(target), _context$1());
        }
      }) : _savedStyles;
    };
    ScrollTrigger$1.revert = function (soft, media) {
      return _revertAll(!soft, media);
    };
    ScrollTrigger$1.create = function (vars, animation) {
      return new ScrollTrigger$1(vars, animation);
    };
    ScrollTrigger$1.refresh = function (safe) {
      return safe ? _onResize(true) : (_coreInitted$1 || ScrollTrigger$1.register()) && _refreshAll(true);
    };
    ScrollTrigger$1.update = function (force) {
      return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
    };
    ScrollTrigger$1.clearScrollMemory = _clearScrollMemory;
    ScrollTrigger$1.maxScroll = function (element, horizontal) {
      return _maxScroll$1(element, horizontal ? _horizontal : _vertical);
    };
    ScrollTrigger$1.getScrollFunc = function (element, horizontal) {
      return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
    };
    ScrollTrigger$1.getById = function (id) {
      return _ids[id];
    };
    ScrollTrigger$1.getAll = function () {
      return _triggers.filter(function (t) {
        return t.vars.id !== "ScrollSmoother";
      });
    };
    ScrollTrigger$1.isScrolling = function () {
      return !!_lastScrollTime;
    };
    ScrollTrigger$1.snapDirectional = _snapDirectional;
    ScrollTrigger$1.addEventListener = function (type, callback) {
      var a = _listeners[type] || (_listeners[type] = []);
      ~a.indexOf(callback) || a.push(callback);
    };
    ScrollTrigger$1.removeEventListener = function (type, callback) {
      var a = _listeners[type], i = a && a.indexOf(callback);
      i >= 0 && a.splice(i, 1);
    };
    ScrollTrigger$1.batch = function (targets, vars) {
      var result = [], varsCopy = {}, interval = vars.interval || 0.016, batchMax = vars.batchMax || 1e9, proxyCallback = function proxyCallback2(type, callback) {
        var elements = [], triggers = [], delay2 = gsap$1.delayedCall(interval, function () {
          callback(elements, triggers);
          elements = [];
          triggers = [];
        }).pause();
        return function (self) {
          elements.length || delay2.restart(true);
          elements.push(self.trigger);
          triggers.push(self);
          batchMax <= elements.length && delay2.progress(1);
        };
      }, p;
      for (p in vars) {
        varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
      }
      if (_isFunction(batchMax)) {
        batchMax = batchMax();
        _addListener(ScrollTrigger$1, "refresh", function () {
          return batchMax = vars.batchMax();
        });
      }
      _toArray$1(targets).forEach(function (target) {
        var config = {};
        for (p in varsCopy) {
          config[p] = varsCopy[p];
        }
        config.trigger = target;
        result.push(ScrollTrigger$1.create(config));
      });
      return result;
    };
    var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier2(scrollFunc, current, end, max2) {
      current > max2 ? scrollFunc(max2) : current < 0 && scrollFunc(0);
      return end > max2 ? (max2 - current) / (end - current) : end < 0 ? current / (current - end) : 1;
    }, _allowNativePanning = function _allowNativePanning2(target, direction) {
      if (direction === true) {
        target.style.removeProperty("touch-action");
      } else {
        target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none";
      }
      target === _docEl$1 && _allowNativePanning2(_body$1, direction);
    }, _overflow = {
      auto: 1,
      scroll: 1
    }, _nestedScroll = function _nestedScroll2(_ref5) {
      var event = _ref5.event, target = _ref5.target, axis = _ref5.axis;
      var node = (event.changedTouches ? event.changedTouches[0] : event).target, cache = node._gsap || gsap$1.core.getCache(node), time = _getTime(), cs;
      if (!cache._isScrollT || time - cache._isScrollT > 2e3) {
        while (node && node !== _body$1 && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) {
          node = node.parentNode;
        }
        cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
        cache._isScrollT = time;
      }
      if (cache._isScroll || axis === "x") {
        event.stopPropagation();
        event._gsapAllow = true;
      }
    }, _inputObserver$1 = function _inputObserver2(target, type, inputs, nested) {
      return Observer.create({
        target,
        capture: true,
        debounce: false,
        lockAxis: true,
        type,
        onWheel: nested = nested && _nestedScroll,
        onPress: nested,
        onDrag: nested,
        onScroll: nested,
        onEnable: function onEnable() {
          return inputs && _addListener(_doc$1, Observer.eventTypes[0], _captureInputs, false, true);
        },
        onDisable: function onDisable() {
          return _removeListener(_doc$1, Observer.eventTypes[0], _captureInputs, true);
        }
      });
    }, _inputExp = /(input|label|select|textarea)/i, _inputIsFocused, _captureInputs = function _captureInputs2(e) {
      var isInput = _inputExp.test(e.target.tagName);
      if (isInput || _inputIsFocused) {
        e._gsapAllow = true;
        _inputIsFocused = isInput;
      }
    }, _getScrollNormalizer = function _getScrollNormalizer2(vars) {
      _isObject(vars) || (vars = {});
      vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
      vars.type || (vars.type = "wheel,touch");
      vars.debounce = !!vars.debounce;
      vars.id = vars.id || "normalizer";
      var _vars2 = vars, normalizeScrollX = _vars2.normalizeScrollX, momentum = _vars2.momentum, allowNestedScroll = _vars2.allowNestedScroll, onRelease = _vars2.onRelease, self, maxY, target = _getTarget(vars.target) || _docEl$1, smoother = gsap$1.core.globals().ScrollSmoother, smootherInstance = smoother && smoother.get(), content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()), scrollFuncY = _getScrollFunc(target, _vertical), scrollFuncX = _getScrollFunc(target, _horizontal), scale = 1, initialScale = (Observer.isTouch && _win$1.visualViewport ? _win$1.visualViewport.scale * _win$1.visualViewport.width : _win$1.outerWidth) / _win$1.innerWidth, wheelRefresh = 0, resolveMomentumDuration = _isFunction(momentum) ? function () {
        return momentum(self);
      } : function () {
        return momentum || 2.8;
      }, lastRefreshID, skipTouchMove, inputObserver = _inputObserver$1(target, vars.type, true, allowNestedScroll), resumeTouchMove = function resumeTouchMove2() {
        return skipTouchMove = false;
      }, scrollClampX = _passThrough, scrollClampY = _passThrough, updateClamps = function updateClamps2() {
        maxY = _maxScroll$1(target, _vertical);
        scrollClampY = _clamp$1(_fixIOSBug ? 1 : 0, maxY);
        normalizeScrollX && (scrollClampX = _clamp$1(0, _maxScroll$1(target, _horizontal)));
        lastRefreshID = _refreshID;
      }, removeContentOffset = function removeContentOffset2() {
        content._gsap.y = _round$1(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
        content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
        scrollFuncY.offset = scrollFuncY.cacheID = 0;
      }, ignoreDrag = function ignoreDrag2() {
        if (skipTouchMove) {
          requestAnimationFrame(resumeTouchMove);
          var offset2 = _round$1(self.deltaY / 2), scroll = scrollClampY(scrollFuncY.v - offset2);
          if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
            scrollFuncY.offset = scroll - scrollFuncY.v;
            var y = _round$1((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);
            content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
            content._gsap.y = y + "px";
            scrollFuncY.cacheID = _scrollers.cache;
            _updateAll();
          }
          return true;
        }
        scrollFuncY.offset && removeContentOffset();
        skipTouchMove = true;
      }, tween, startScrollX, startScrollY, onStopDelayedCall, onResize = function onResize2() {
        updateClamps();
        if (tween.isActive() && tween.vars.scrollY > maxY) {
          scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
        }
      };
      content && gsap$1.set(content, {
        y: "+=0"
      });
      vars.ignoreCheck = function (e) {
        return _fixIOSBug && e.type === "touchmove" && ignoreDrag() || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
      };
      vars.onPress = function () {
        skipTouchMove = false;
        var prevScale = scale;
        scale = _round$1((_win$1.visualViewport && _win$1.visualViewport.scale || 1) / initialScale);
        tween.pause();
        prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
        startScrollX = scrollFuncX();
        startScrollY = scrollFuncY();
        updateClamps();
        lastRefreshID = _refreshID;
      };
      vars.onRelease = vars.onGestureStart = function (self2, wasDragging) {
        scrollFuncY.offset && removeContentOffset();
        if (!wasDragging) {
          onStopDelayedCall.restart(true);
        } else {
          _scrollers.cache++;
          var dur = resolveMomentumDuration(), currentScroll, endScroll;
          if (normalizeScrollX) {
            currentScroll = scrollFuncX();
            endScroll = currentScroll + dur * 0.05 * -self2.velocityX / 0.227;
            dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll$1(target, _horizontal));
            tween.vars.scrollX = scrollClampX(endScroll);
          }
          currentScroll = scrollFuncY();
          endScroll = currentScroll + dur * 0.05 * -self2.velocityY / 0.227;
          dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll$1(target, _vertical));
          tween.vars.scrollY = scrollClampY(endScroll);
          tween.invalidate().duration(dur).play(0.01);
          if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
            gsap$1.to({}, {
              onUpdate: onResize,
              duration: dur
            });
          }
        }
        onRelease && onRelease(self2);
      };
      vars.onWheel = function () {
        tween._ts && tween.pause();
        if (_getTime() - wheelRefresh > 1e3) {
          lastRefreshID = 0;
          wheelRefresh = _getTime();
        }
      };
      vars.onChange = function (self2, dx, dy, xArray, yArray) {
        _refreshID !== lastRefreshID && updateClamps();
        dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self2.startX - self2.x) : scrollFuncX() + dx - xArray[1]));
        if (dy) {
          scrollFuncY.offset && removeContentOffset();
          var isTouch = yArray[2] === dy, y = isTouch ? startScrollY + self2.startY - self2.y : scrollFuncY() + dy - yArray[1], yClamped = scrollClampY(y);
          isTouch && y !== yClamped && (startScrollY += yClamped - y);
          scrollFuncY(yClamped);
        }
        (dy || dx) && _updateAll();
      };
      vars.onEnable = function () {
        _allowNativePanning(target, normalizeScrollX ? false : "x");
        ScrollTrigger$1.addEventListener("refresh", onResize);
        _addListener(_win$1, "resize", onResize);
        if (scrollFuncY.smooth) {
          scrollFuncY.target.style.scrollBehavior = "auto";
          scrollFuncY.smooth = scrollFuncX.smooth = false;
        }
        inputObserver.enable();
      };
      vars.onDisable = function () {
        _allowNativePanning(target, true);
        _removeListener(_win$1, "resize", onResize);
        ScrollTrigger$1.removeEventListener("refresh", onResize);
        inputObserver.kill();
      };
      vars.lockAxis = vars.lockAxis !== false;
      self = new Observer(vars);
      self.iOS = _fixIOSBug;
      _fixIOSBug && !scrollFuncY() && scrollFuncY(1);
      _fixIOSBug && gsap$1.ticker.add(_passThrough);
      onStopDelayedCall = self._dc;
      tween = gsap$1.to(self, {
        ease: "power4",
        paused: true,
        inherit: false,
        scrollX: normalizeScrollX ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
          scrollY: _interruptionTracker(scrollFuncY, scrollFuncY(), function () {
            return tween.pause();
          })
        },
        onUpdate: _updateAll,
        onComplete: onStopDelayedCall.vars.onComplete
      });
      return self;
    };
    ScrollTrigger$1.sort = function (func) {
      if (_isFunction(func)) {
        return _triggers.sort(func);
      }
      var scroll = _win$1.pageYOffset || 0;
      ScrollTrigger$1.getAll().forEach(function (t) {
        return t._sortY = t.trigger ? scroll + t.trigger.getBoundingClientRect().top : t.start + _win$1.innerHeight;
      });
      return _triggers.sort(func || function (a, b2) {
        return (a.vars.refreshPriority || 0) * -1e6 + (a.vars.containerAnimation ? 1e6 : a._sortY) - ((b2.vars.containerAnimation ? 1e6 : b2._sortY) + (b2.vars.refreshPriority || 0) * -1e6);
      });
    };
    ScrollTrigger$1.observe = function (vars) {
      return new Observer(vars);
    };
    ScrollTrigger$1.normalizeScroll = function (vars) {
      if (typeof vars === "undefined") {
        return _normalizer;
      }
      if (vars === true && _normalizer) {
        return _normalizer.enable();
      }
      if (vars === false) {
        _normalizer && _normalizer.kill();
        _normalizer = vars;
        return;
      }
      var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
      _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
      _isViewport(normalizer.target) && (_normalizer = normalizer);
      return normalizer;
    };
    ScrollTrigger$1.core = {
      // smaller file size way to leverage in ScrollSmoother and Observer
      _getVelocityProp: _getVelocityProp$1,
      _inputObserver: _inputObserver$1,
      _scrollers,
      _proxies,
      bridge: {
        // when normalizeScroll sets the scroll position (ss = setScroll)
        ss: function ss() {
          _lastScrollTime || _dispatch("scrollStart");
          _lastScrollTime = _getTime();
        },
        // a way to get the _refreshing value in Observer
        ref: function ref() {
          return _refreshing;
        }
      }
    };
    _getGSAP$1() && gsap$1.registerPlugin(ScrollTrigger$1);
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      return Constructor;
    }
    /*!
     * ScrollSmoother 3.12.7
     * https://gsap.com
     *
     * @license Copyright 2008-2025, GreenSock. All rights reserved.
     * Subject to the terms at https://gsap.com/standard-license or for
     * Club GSAP members, the agreement issued with that membership.
     * @author: Jack Doyle, jack@greensock.com
    */
    var gsap, _coreInitted, _win, _doc, _docEl, _body, _toArray, _clamp, ScrollTrigger, _mainInstance, _expo, _getVelocityProp, _inputObserver, _context, _onResizeDelayedCall, _windowExists = function _windowExists2() {
      return typeof window !== "undefined";
    }, _getGSAP = function _getGSAP2() {
      return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
    }, _round = function _round2(value) {
      return Math.round(value * 1e5) / 1e5 || 0;
    }, _maxScroll = function _maxScroll2(scroller) {
      return ScrollTrigger.maxScroll(scroller || _win);
    }, _autoDistance = function _autoDistance2(el, progress) {
      var parent = el.parentNode || _docEl, b1 = el.getBoundingClientRect(), b2 = parent.getBoundingClientRect(), gapTop = b2.top - b1.top, gapBottom = b2.bottom - b1.bottom, change = (Math.abs(gapTop) > Math.abs(gapBottom) ? gapTop : gapBottom) / (1 - progress), offset2 = -change * progress, ratio, extraChange;
      if (change > 0) {
        ratio = b2.height / (_win.innerHeight + b2.height);
        extraChange = ratio === 0.5 ? b2.height * 2 : Math.min(b2.height, Math.abs(-change * ratio / (2 * ratio - 1))) * 2 * (progress || 1);
        offset2 += progress ? -extraChange * progress : -extraChange / 2;
        change += extraChange;
      }
      return {
        change,
        offset: offset2
      };
    }, _wrap = function _wrap2(el) {
      var wrapper = _doc.querySelector(".ScrollSmoother-wrapper");
      if (!wrapper) {
        wrapper = _doc.createElement("div");
        wrapper.classList.add("ScrollSmoother-wrapper");
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }
      return wrapper;
    };
    var ScrollSmoother = /* @__PURE__ */ function () {
      function ScrollSmoother2(vars) {
        var _this = this;
        _coreInitted || ScrollSmoother2.register(gsap) || console.warn("Please gsap.registerPlugin(ScrollSmoother)");
        vars = this.vars = vars || {};
        _mainInstance && _mainInstance.kill();
        _mainInstance = this;
        _context(this);
        var _vars = vars, smoothTouch = _vars.smoothTouch, _onUpdate = _vars.onUpdate, onStop = _vars.onStop, smooth = _vars.smooth, onFocusIn = _vars.onFocusIn, normalizeScroll = _vars.normalizeScroll, wholePixels = _vars.wholePixels, content, wrapper, height, mainST, effects, sections, intervalID, wrapperCSS, contentCSS, paused, pausedNormalizer, recordedRefreshScroll, recordedRefreshScrub, allowUpdates, self = this, effectsPrefix = vars.effectsPrefix || "", scrollFunc = ScrollTrigger.getScrollFunc(_win), smoothDuration = ScrollTrigger.isTouch === 1 ? smoothTouch === true ? 0.8 : parseFloat(smoothTouch) || 0 : smooth === 0 || smooth === false ? 0 : parseFloat(smooth) || 0.8, speed = smoothDuration && +vars.speed || 1, currentY = 0, delta = 0, startupPhase = 1, tracker = _getVelocityProp(0), updateVelocity = function updateVelocity2() {
          return tracker.update(-currentY);
        }, scroll = {
          y: 0
        }, removeScroll = function removeScroll2() {
          return content.style.overflow = "visible";
        }, isProxyScrolling, killScrub = function killScrub2(trigger2) {
          trigger2.update();
          var scrub = trigger2.getTween();
          if (scrub) {
            scrub.pause();
            scrub._time = scrub._dur;
            scrub._tTime = scrub._tDur;
          }
          isProxyScrolling = false;
          trigger2.animation.progress(trigger2.progress, true);
        }, render = function render2(y, force) {
          if (y !== currentY && !paused || force) {
            wholePixels && (y = Math.round(y));
            if (smoothDuration) {
              content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
              content._gsap.y = y + "px";
            }
            delta = y - currentY;
            currentY = y;
            ScrollTrigger.isUpdating || ScrollSmoother2.isRefreshing || ScrollTrigger.update();
          }
        }, scrollTop = function scrollTop2(value) {
          if (arguments.length) {
            value < 0 && (value = 0);
            scroll.y = -value;
            isProxyScrolling = true;
            paused ? currentY = -value : render(-value);
            ScrollTrigger.isRefreshing ? mainST.update() : scrollFunc(value / speed);
            return this;
          }
          return -currentY;
        }, resizeObserver = typeof ResizeObserver !== "undefined" && vars.autoResize !== false && new ResizeObserver(function () {
          if (!ScrollTrigger.isRefreshing) {
            var max2 = _maxScroll(wrapper) * speed;
            max2 < -currentY && scrollTop(max2);
            _onResizeDelayedCall.restart(true);
          }
        }), lastFocusElement, _onFocusIn = function _onFocusIn2(e) {
          wrapper.scrollTop = 0;
          if (e.target.contains && e.target.contains(wrapper) || onFocusIn && onFocusIn(_this, e) === false) {
            return;
          }
          ScrollTrigger.isInViewport(e.target) || e.target === lastFocusElement || _this.scrollTo(e.target, false, "center center");
          lastFocusElement = e.target;
        }, _transformPosition = function _transformPosition2(position, st) {
          if (position < st.start) {
            return position;
          }
          var ratio = isNaN(st.ratio) ? 1 : st.ratio, change = st.end - st.start, distance = position - st.start, offset2 = st.offset || 0, pins = st.pins || [], pinOffset = pins.offset || 0, progressOffset = st._startClamp && st.start <= 0 || st.pins && st.pins.offset ? 0 : st._endClamp && st.end === _maxScroll() ? 1 : 0.5;
          pins.forEach(function (p) {
            change -= p.distance;
            if (p.nativeStart <= position) {
              distance -= p.distance;
            }
          });
          if (pinOffset) {
            distance *= (change - pinOffset / ratio) / change;
          }
          return position + (distance - offset2 * progressOffset) / ratio - distance;
        }, adjustEffectRelatedTriggers = function adjustEffectRelatedTriggers2(st, triggers, partial) {
          partial || (st.pins.length = st.pins.offset = 0);
          var pins = st.pins, markers = st.markers, dif, isClamped, start, end, nativeStart, nativeEnd, i, trig;
          for (i = 0; i < triggers.length; i++) {
            trig = triggers[i];
            if (st.trigger && trig.trigger && st !== trig && (trig.trigger === st.trigger || trig.pinnedContainer === st.trigger || st.trigger.contains(trig.trigger))) {
              nativeStart = trig._startNative || trig._startClamp || trig.start;
              nativeEnd = trig._endNative || trig._endClamp || trig.end;
              start = _transformPosition(nativeStart, st);
              end = trig.pin && nativeEnd > 0 ? start + (nativeEnd - nativeStart) : _transformPosition(nativeEnd, st);
              trig.setPositions(start, end, true, (trig._startClamp ? Math.max(0, start) : start) - nativeStart);
              trig.markerStart && markers.push(gsap.quickSetter([trig.markerStart, trig.markerEnd], "y", "px"));
              if (trig.pin && trig.end > 0 && !partial) {
                dif = trig.end - trig.start;
                isClamped = st._startClamp && trig.start < 0;
                if (isClamped) {
                  if (st.start > 0) {
                    st.setPositions(0, st.end + (st._startNative - st.start), true);
                    adjustEffectRelatedTriggers2(st, triggers);
                    return;
                  }
                  dif += trig.start;
                  pins.offset = -trig.start;
                }
                pins.push({
                  start: trig.start,
                  nativeStart,
                  end: trig.end,
                  distance: dif,
                  trig
                });
                st.setPositions(st.start, st.end + (isClamped ? -trig.start : dif), true);
              }
            }
          }
        }, adjustParallaxPosition = function adjustParallaxPosition2(triggers, createdAfterEffectWasApplied) {
          effects.forEach(function (st) {
            return adjustEffectRelatedTriggers(st, triggers, createdAfterEffectWasApplied);
          });
        }, onRefresh = function onRefresh2() {
          _docEl = _doc.documentElement;
          _body = _doc.body;
          removeScroll();
          requestAnimationFrame(removeScroll);
          if (effects) {
            ScrollTrigger.getAll().forEach(function (st) {
              st._startNative = st.start;
              st._endNative = st.end;
            });
            effects.forEach(function (st) {
              var start = st._startClamp || st.start, end = st.autoSpeed ? Math.min(_maxScroll(), st.end) : start + Math.abs((st.end - start) / st.ratio), offset2 = end - st.end;
              start -= offset2 / 2;
              end -= offset2 / 2;
              if (start > end) {
                var s = start;
                start = end;
                end = s;
              }
              if (st._startClamp && start < 0) {
                end = st.ratio < 0 ? _maxScroll() : st.end / st.ratio;
                offset2 = end - st.end;
                start = 0;
              } else if (st.ratio < 0 || st._endClamp && end >= _maxScroll()) {
                end = _maxScroll();
                start = st.ratio < 0 ? 0 : st.ratio > 1 ? 0 : end - (end - st.start) / st.ratio;
                offset2 = (end - start) * st.ratio - (st.end - st.start);
              }
              st.offset = offset2 || 1e-4;
              st.pins.length = st.pins.offset = 0;
              st.setPositions(start, end, true);
            });
            adjustParallaxPosition(ScrollTrigger.sort());
          }
          tracker.reset();
        }, addOnRefresh = function addOnRefresh2() {
          return ScrollTrigger.addEventListener("refresh", onRefresh);
        }, restoreEffects = function restoreEffects2() {
          return effects && effects.forEach(function (st) {
            return st.vars.onRefresh(st);
          });
        }, revertEffects = function revertEffects2() {
          effects && effects.forEach(function (st) {
            return st.vars.onRefreshInit(st);
          });
          return restoreEffects;
        }, effectValueGetter = function effectValueGetter2(name, value, index, el) {
          return function () {
            var v = typeof value === "function" ? value(index, el) : value;
            v || v === 0 || (v = el.getAttribute("data-" + effectsPrefix + name) || (name === "speed" ? 1 : 0));
            el.setAttribute("data-" + effectsPrefix + name, v);
            var clamp2 = (v + "").substr(0, 6) === "clamp(";
            return {
              clamp: clamp2,
              value: clamp2 ? v.substr(6, v.length - 7) : v
            };
          };
        }, createEffect = function createEffect2(el, speed2, lag, index, effectsPadding) {
          effectsPadding = (typeof effectsPadding === "function" ? effectsPadding(index, el) : effectsPadding) || 0;
          var getSpeed = effectValueGetter("speed", speed2, index, el), getLag = effectValueGetter("lag", lag, index, el), startY = gsap.getProperty(el, "y"), cache = el._gsap, ratio, st, autoSpeed, scrub, progressOffset, yOffset, pins = [], initDynamicValues = function initDynamicValues2() {
            speed2 = getSpeed();
            lag = parseFloat(getLag().value);
            ratio = parseFloat(speed2.value) || 1;
            autoSpeed = speed2.value === "auto";
            progressOffset = autoSpeed || st && st._startClamp && st.start <= 0 || pins.offset ? 0 : st && st._endClamp && st.end === _maxScroll() ? 1 : 0.5;
            scrub && scrub.kill();
            scrub = lag && gsap.to(el, {
              ease: _expo,
              overwrite: false,
              y: "+=0",
              duration: lag
            });
            if (st) {
              st.ratio = ratio;
              st.autoSpeed = autoSpeed;
            }
          }, revert = function revert2() {
            cache.y = startY + "px";
            cache.renderTransform(1);
            initDynamicValues();
          }, markers = [], change = 0, updateChange = function updateChange2(self2) {
            if (autoSpeed) {
              revert();
              var auto = _autoDistance(el, _clamp(0, 1, -self2.start / (self2.end - self2.start)));
              change = auto.change;
              yOffset = auto.offset;
            } else {
              yOffset = pins.offset || 0;
              change = (self2.end - self2.start - yOffset) * (1 - ratio);
            }
            pins.forEach(function (p) {
              return change -= p.distance * (1 - ratio);
            });
            self2.offset = change || 1e-3;
            self2.vars.onUpdate(self2);
            scrub && scrub.progress(1);
          };
          initDynamicValues();
          if (ratio !== 1 || autoSpeed || scrub) {
            st = ScrollTrigger.create({
              trigger: autoSpeed ? el.parentNode : el,
              start: function start() {
                return speed2.clamp ? "clamp(top bottom+=" + effectsPadding + ")" : "top bottom+=" + effectsPadding;
              },
              end: function end() {
                return speed2.value < 0 ? "max" : speed2.clamp ? "clamp(bottom top-=" + effectsPadding + ")" : "bottom top-=" + effectsPadding;
              },
              scroller: wrapper,
              scrub: true,
              refreshPriority: -999,
              // must update AFTER any other ScrollTrigger pins
              onRefreshInit: revert,
              onRefresh: updateChange,
              onKill: function onKill(self2) {
                var i = effects.indexOf(self2);
                i >= 0 && effects.splice(i, 1);
                revert();
              },
              onUpdate: function onUpdate(self2) {
                var y = startY + change * (self2.progress - progressOffset), i = pins.length, extraY = 0, pin, scrollY, end;
                if (self2.offset) {
                  if (i) {
                    scrollY = -currentY;
                    end = self2.end;
                    while (i--) {
                      pin = pins[i];
                      if (pin.trig.isActive || scrollY >= pin.start && scrollY <= pin.end) {
                        if (scrub) {
                          pin.trig.progress += pin.trig.direction < 0 ? 1e-3 : -1e-3;
                          pin.trig.update(0, 0, 1);
                          scrub.resetTo("y", parseFloat(cache.y), -delta, true);
                          startupPhase && scrub.progress(1);
                        }
                        return;
                      }
                      scrollY > pin.end && (extraY += pin.distance);
                      end -= pin.distance;
                    }
                    y = startY + extraY + change * ((gsap.utils.clamp(self2.start, self2.end, scrollY) - self2.start - extraY) / (end - self2.start) - progressOffset);
                  }
                  markers.length && !autoSpeed && markers.forEach(function (setter) {
                    return setter(y - extraY);
                  });
                  y = _round(y + yOffset);
                  if (scrub) {
                    scrub.resetTo("y", y, -delta, true);
                    startupPhase && scrub.progress(1);
                  } else {
                    cache.y = y + "px";
                    cache.renderTransform(1);
                  }
                }
              }
            });
            updateChange(st);
            gsap.core.getCache(st.trigger).stRevert = revertEffects;
            st.startY = startY;
            st.pins = pins;
            st.markers = markers;
            st.ratio = ratio;
            st.autoSpeed = autoSpeed;
            el.style.willChange = "transform";
          }
          return st;
        };
        addOnRefresh();
        ScrollTrigger.addEventListener("killAll", addOnRefresh);
        gsap.delayedCall(0.5, function () {
          return startupPhase = 0;
        });
        this.scrollTop = scrollTop;
        this.scrollTo = function (target, smooth2, position) {
          var p = gsap.utils.clamp(0, _maxScroll(), isNaN(target) ? _this.offset(target, position, !!smooth2 && !paused) : +target);
          !smooth2 ? scrollTop(p) : paused ? gsap.to(_this, {
            duration: smoothDuration,
            scrollTop: p,
            overwrite: "auto",
            ease: _expo
          }) : scrollFunc(p);
        };
        this.offset = function (target, position, ignoreSpeed) {
          target = _toArray(target)[0];
          var cssText = target.style.cssText, st = ScrollTrigger.create({
            trigger: target,
            start: position || "top top"
          }), y;
          if (effects) {
            startupPhase ? ScrollTrigger.refresh() : adjustParallaxPosition([st], true);
          }
          y = st.start / (ignoreSpeed ? speed : 1);
          st.kill(false);
          target.style.cssText = cssText;
          gsap.core.getCache(target).uncache = 1;
          return y;
        };
        function refreshHeight() {
          height = content.clientHeight;
          content.style.overflow = "visible";
          _body.style.height = _win.innerHeight + (height - _win.innerHeight) / speed + "px";
          return height - _win.innerHeight;
        }
        this.content = function (element) {
          if (arguments.length) {
            var newContent = _toArray(element || "#smooth-content")[0] || console.warn("ScrollSmoother needs a valid content element.") || _body.children[0];
            if (newContent !== content) {
              content = newContent;
              contentCSS = content.getAttribute("style") || "";
              resizeObserver && resizeObserver.observe(content);
              gsap.set(content, {
                overflow: "visible",
                width: "100%",
                boxSizing: "border-box",
                y: "+=0"
              });
              smoothDuration || gsap.set(content, {
                clearProps: "transform"
              });
            }
            return this;
          }
          return content;
        };
        this.wrapper = function (element) {
          if (arguments.length) {
            wrapper = _toArray(element || "#smooth-wrapper")[0] || _wrap(content);
            wrapperCSS = wrapper.getAttribute("style") || "";
            refreshHeight();
            gsap.set(wrapper, smoothDuration ? {
              overflow: "hidden",
              position: "fixed",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            } : {
              overflow: "visible",
              position: "relative",
              width: "100%",
              height: "auto",
              top: "auto",
              bottom: "auto",
              left: "auto",
              right: "auto"
            });
            return this;
          }
          return wrapper;
        };
        this.effects = function (targets, config) {
          var _effects2;
          effects || (effects = []);
          if (!targets) {
            return effects.slice(0);
          }
          targets = _toArray(targets);
          targets.forEach(function (target) {
            var i2 = effects.length;
            while (i2--) {
              effects[i2].trigger === target && effects[i2].kill();
            }
          });
          config = config || {};
          var _config2 = config, speed2 = _config2.speed, lag = _config2.lag, effectsPadding = _config2.effectsPadding, effectsToAdd = [], i, st;
          for (i = 0; i < targets.length; i++) {
            st = createEffect(targets[i], speed2, lag, i, effectsPadding);
            st && effectsToAdd.push(st);
          }
          (_effects2 = effects).push.apply(_effects2, effectsToAdd);
          config.refresh !== false && ScrollTrigger.refresh();
          return effectsToAdd;
        };
        this.sections = function (targets, config) {
          var _sections;
          sections || (sections = []);
          if (!targets) {
            return sections.slice(0);
          }
          var newSections = _toArray(targets).map(function (el) {
            return ScrollTrigger.create({
              trigger: el,
              start: "top 120%",
              end: "bottom -20%",
              onToggle: function onToggle(self2) {
                el.style.opacity = self2.isActive ? "1" : "0";
                el.style.pointerEvents = self2.isActive ? "all" : "none";
              }
            });
          });
          config && config.add ? (_sections = sections).push.apply(_sections, newSections) : sections = newSections.slice(0);
          return newSections;
        };
        this.content(vars.content);
        this.wrapper(vars.wrapper);
        this.render = function (y) {
          return render(y || y === 0 ? y : currentY);
        };
        this.getVelocity = function () {
          return tracker.getVelocity(-currentY);
        };
        ScrollTrigger.scrollerProxy(wrapper, {
          scrollTop,
          scrollHeight: function scrollHeight() {
            return refreshHeight() && _body.scrollHeight;
          },
          fixedMarkers: vars.fixedMarkers !== false && !!smoothDuration,
          content,
          getBoundingClientRect: function getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: _win.innerWidth,
              height: _win.innerHeight
            };
          }
        });
        ScrollTrigger.defaults({
          scroller: wrapper
        });
        var existingScrollTriggers = ScrollTrigger.getAll().filter(function (st) {
          return st.scroller === _win || st.scroller === wrapper;
        });
        existingScrollTriggers.forEach(function (st) {
          return st.revert(true, true);
        });
        mainST = ScrollTrigger.create({
          animation: gsap.fromTo(scroll, {
            y: function y() {
              allowUpdates = 0;
              return 0;
            }
          }, {
            y: function y() {
              allowUpdates = 1;
              return -refreshHeight();
            },
            immediateRender: false,
            ease: "none",
            data: "ScrollSmoother",
            duration: 100,
            // for added precision
            onUpdate: function onUpdate() {
              if (allowUpdates) {
                var force = isProxyScrolling;
                if (force) {
                  killScrub(mainST);
                  scroll.y = currentY;
                }
                render(scroll.y, force);
                updateVelocity();
                _onUpdate && !paused && _onUpdate(self);
              }
            }
          }),
          onRefreshInit: function onRefreshInit(self2) {
            if (ScrollSmoother2.isRefreshing) {
              return;
            }
            ScrollSmoother2.isRefreshing = true;
            if (effects) {
              var _pins = ScrollTrigger.getAll().filter(function (st) {
                return !!st.pin;
              });
              effects.forEach(function (st) {
                if (!st.vars.pinnedContainer) {
                  _pins.forEach(function (pinST) {
                    if (pinST.pin.contains(st.trigger)) {
                      var v = st.vars;
                      v.pinnedContainer = pinST.pin;
                      st.vars = null;
                      st.init(v, st.animation);
                    }
                  });
                }
              });
            }
            var scrub = self2.getTween();
            recordedRefreshScrub = scrub && scrub._end > scrub._dp._time;
            recordedRefreshScroll = currentY;
            scroll.y = 0;
            if (smoothDuration) {
              ScrollTrigger.isTouch === 1 && (wrapper.style.position = "absolute");
              wrapper.scrollTop = 0;
              ScrollTrigger.isTouch === 1 && (wrapper.style.position = "fixed");
            }
          },
          onRefresh: function onRefresh2(self2) {
            self2.animation.invalidate();
            self2.setPositions(self2.start, refreshHeight() / speed);
            recordedRefreshScrub || killScrub(self2);
            scroll.y = -scrollFunc() * speed;
            render(scroll.y);
            if (!startupPhase) {
              recordedRefreshScrub && (isProxyScrolling = false);
              self2.animation.progress(gsap.utils.clamp(0, 1, recordedRefreshScroll / speed / -self2.end));
            }
            if (recordedRefreshScrub) {
              self2.progress -= 1e-3;
              self2.update();
            }
            ScrollSmoother2.isRefreshing = false;
          },
          id: "ScrollSmoother",
          scroller: _win,
          invalidateOnRefresh: true,
          start: 0,
          refreshPriority: -9999,
          // because all other pins, etc. should be calculated first before this figures out the height of the body. BUT this should also update FIRST so that the scroll position on the proxy is up-to-date when all the ScrollTriggers calculate their progress! -9999 is a special number that ScrollTrigger looks for to handle in this way.
          end: function end() {
            return refreshHeight() / speed;
          },
          onScrubComplete: function onScrubComplete() {
            tracker.reset();
            onStop && onStop(_this);
          },
          scrub: smoothDuration || true
        });
        this.smooth = function (value) {
          if (arguments.length) {
            smoothDuration = value || 0;
            speed = smoothDuration && +vars.speed || 1;
            mainST.scrubDuration(value);
          }
          return mainST.getTween() ? mainST.getTween().duration() : 0;
        };
        mainST.getTween() && (mainST.getTween().vars.ease = vars.ease || _expo);
        this.scrollTrigger = mainST;
        vars.effects && this.effects(vars.effects === true ? "[data-" + effectsPrefix + "speed], [data-" + effectsPrefix + "lag]" : vars.effects, {
          effectsPadding: vars.effectsPadding,
          refresh: false
        });
        vars.sections && this.sections(vars.sections === true ? "[data-section]" : vars.sections);
        existingScrollTriggers.forEach(function (st) {
          st.vars.scroller = wrapper;
          st.revert(false, true);
          st.init(st.vars, st.animation);
        });
        this.paused = function (value, allowNestedScroll) {
          if (arguments.length) {
            if (!!paused !== value) {
              if (value) {
                mainST.getTween() && mainST.getTween().pause();
                scrollFunc(-currentY / speed);
                tracker.reset();
                pausedNormalizer = ScrollTrigger.normalizeScroll();
                pausedNormalizer && pausedNormalizer.disable();
                paused = ScrollTrigger.observe({
                  preventDefault: true,
                  type: "wheel,touch,scroll",
                  debounce: false,
                  allowClicks: true,
                  onChangeY: function onChangeY() {
                    return scrollTop(-currentY);
                  }
                  // refuse to scroll
                });
                paused.nested = _inputObserver(_docEl, "wheel,touch,scroll", true, allowNestedScroll !== false);
              } else {
                paused.nested.kill();
                paused.kill();
                paused = 0;
                pausedNormalizer && pausedNormalizer.enable();
                mainST.progress = (-currentY / speed - mainST.start) / (mainST.end - mainST.start);
                killScrub(mainST);
              }
            }
            return this;
          }
          return !!paused;
        };
        this.kill = this.revert = function () {
          _this.paused(false);
          killScrub(mainST);
          mainST.kill();
          var triggers = (effects || []).concat(sections || []), i = triggers.length;
          while (i--) {
            triggers[i].kill();
          }
          ScrollTrigger.scrollerProxy(wrapper);
          ScrollTrigger.removeEventListener("killAll", addOnRefresh);
          ScrollTrigger.removeEventListener("refresh", onRefresh);
          wrapper.style.cssText = wrapperCSS;
          content.style.cssText = contentCSS;
          var defaults2 = ScrollTrigger.defaults({});
          defaults2 && defaults2.scroller === wrapper && ScrollTrigger.defaults({
            scroller: _win
          });
          _this.normalizer && ScrollTrigger.normalizeScroll(false);
          clearInterval(intervalID);
          _mainInstance = null;
          resizeObserver && resizeObserver.disconnect();
          _body.style.removeProperty("height");
          _win.removeEventListener("focusin", _onFocusIn);
        };
        this.refresh = function (soft, force) {
          return mainST.refresh(soft, force);
        };
        if (normalizeScroll) {
          this.normalizer = ScrollTrigger.normalizeScroll(normalizeScroll === true ? {
            debounce: true,
            content: !smoothDuration && content
          } : normalizeScroll);
        }
        ScrollTrigger.config(vars);
        "scrollBehavior" in _win.getComputedStyle(_body) && gsap.set([_body, _docEl], {
          scrollBehavior: "auto"
        });
        _win.addEventListener("focusin", _onFocusIn);
        intervalID = setInterval(updateVelocity, 250);
        _doc.readyState === "loading" || requestAnimationFrame(function () {
          return ScrollTrigger.refresh();
        });
      }
      ScrollSmoother2.register = function register(core) {
        if (!_coreInitted) {
          gsap = core || _getGSAP();
          if (_windowExists() && window.document) {
            _win = window;
            _doc = document;
            _docEl = _doc.documentElement;
            _body = _doc.body;
          }
          if (gsap) {
            _toArray = gsap.utils.toArray;
            _clamp = gsap.utils.clamp;
            _expo = gsap.parseEase("expo");
            _context = gsap.core.context || function () {
            };
            ScrollTrigger = gsap.core.globals().ScrollTrigger;
            gsap.core.globals("ScrollSmoother", ScrollSmoother2);
            if (_body && ScrollTrigger) {
              _onResizeDelayedCall = gsap.delayedCall(0.2, function () {
                return ScrollTrigger.isRefreshing || _mainInstance && _mainInstance.refresh();
              }).pause();
              _getVelocityProp = ScrollTrigger.core._getVelocityProp;
              _inputObserver = ScrollTrigger.core._inputObserver;
              ScrollSmoother2.refresh = ScrollTrigger.refresh;
              _coreInitted = 1;
            }
          }
        }
        return _coreInitted;
      };
      _createClass(ScrollSmoother2, [{
        key: "progress",
        get: function get2() {
          return this.scrollTrigger ? this.scrollTrigger.animation._time / 100 : 0;
        }
      }]);
      return ScrollSmoother2;
    }();
    ScrollSmoother.version = "3.12.7";
    ScrollSmoother.create = function (vars) {
      return _mainInstance && vars && _mainInstance.content() === _toArray(vars.content)[0] ? _mainInstance : new ScrollSmoother(vars);
    };
    ScrollSmoother.get = function () {
      return _mainInstance;
    };
    _getGSAP() && gsap.registerPlugin(ScrollSmoother);
    var gsapWithCSS$1 = gsap$4.registerPlugin(CSSPlugin) || gsap$4;
    gsapWithCSS$1.core.Tween;
    gsapWithCSS$1.registerPlugin(ScrollSmoother, ScrollTrigger$1);
    function smoothScrollGsap() {
      if (screen$1.isMobile) return;
      function initScroll() {
        let smooth = 1.8;
        if (screen$1.isSafariDesktop) smooth = 1;
        let wrapper = document.querySelector(".wrapper:not(.js-running)");
        ScrollSmoother.create({
          wrapper: "#main-transition",
          content: wrapper,
          smooth,
          normalizeScroll: true,
          // prevents address bar from showing/hiding on most devices, solves various other browser inconsistencies
          ignoreMobileResize: true,
          // skips ScrollTrigger.refresh() on mobile resizes from address bar showing/hiding
          effects: true,
          preventDefault: true,
          effectsPrefix: "scroll-"
        });
        wrapper.classList.add("js-running");
      }
      initScroll();
      document.addEventListener("pjax:complete", initScroll);
      document.addEventListener("pjax:switch", function () {
        let previouslyCreatedSmoother = ScrollSmoother.get();
        if (previouslyCreatedSmoother) previouslyCreatedSmoother.kill();
        gsapWithCSS$1.globalTimeline.getChildren().forEach((t) => t.kill());
        ScrollTrigger$1.getAll().forEach((trigger2) => {
          trigger2.kill();
        });
      });
      document.addEventListener("modal:open", function () {
        let smoother = ScrollSmoother.get();
        if (smoother) smoother.paused(true);
      });
      document.addEventListener("modal:close", function () {
        if (!document.body.classList.contains("search-active") && !document.body.classList.contains("menu-active")) {
          let smoother = ScrollSmoother.get();
          if (smoother) smoother.paused(false);
        }
      });
      let timeout;
      window.addEventListener("resize", function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          timeout = null;
          if (!screen$1.isDesktop) return;
          ScrollTrigger$1.refresh();
        }, 300);
      });
      let timeoutMobile;
      window.addEventListener("orientationchange", function () {
        if (timeoutMobile) clearTimeout(timeoutMobile);
        timeoutMobile = setTimeout(() => {
          timeoutMobile = null;
          if (screen$1.isDesktop) return;
          ScrollTrigger$1.refresh();
        }, 300);
      });
    }
    function CookiesConsent() {
      const cookieContainer = document.querySelector(".container-cookies");
      const acceptBtn = cookieContainer.querySelector(".btn-cookies.accept");
      acceptBtn.addEventListener("click", function () {
        cookieDismiss();
      });
      function setCookie(name, value, days2) {
        var expires = "";
        {
          var date = /* @__PURE__ */ new Date();
          date.setTime(date.getTime() + days2 * 24 * 60 * 60 * 1e3);
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
      }
      function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }
      function cookieConsent() {
        if (!getCookie("cookieDismiss")) {
          cookieContainer.classList.remove("d-none");
        }
      }
      function cookieDismiss() {
        setCookie("cookieDismiss", "1", 7);
        cookieContainer.dataset.aos = "fadeOut .4s";
        setTimeout(() => {
          cookieContainer.classList.add("d-none");
        }, 400);
      }
      window.onload = function () {
        cookieConsent();
      };
    }
    function getDefaultExportFromCjs(x) {
      return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
    }
    var pjax = { exports: {} };
    var foreachEls;
    var hasRequiredForeachEls;
    function requireForeachEls() {
      if (hasRequiredForeachEls) return foreachEls;
      hasRequiredForeachEls = 1;
      foreachEls = function (els, fn, context) {
        if (els instanceof HTMLCollection || els instanceof NodeList || els instanceof Array) {
          return Array.prototype.forEach.call(els, fn, context);
        }
        return fn.call(context, els);
      };
      return foreachEls;
    }
    var evalScript;
    var hasRequiredEvalScript;
    function requireEvalScript() {
      if (hasRequiredEvalScript) return evalScript;
      hasRequiredEvalScript = 1;
      evalScript = function (el) {
        var code = el.text || el.textContent || el.innerHTML || "";
        var src = el.src || "";
        var parent = el.parentNode || document.querySelector("head") || document.documentElement;
        var script = document.createElement("script");
        if (code.match("document.write")) {
          if (console && console.log) {
            console.log(
              "Script contains document.write. Can’t be executed correctly. Code skipped ",
              el
            );
          }
          return false;
        }
        script.type = "text/javascript";
        script.id = el.id;
        if (src !== "") {
          script.src = src;
          script.async = false;
        }
        if (code !== "") {
          try {
            script.appendChild(document.createTextNode(code));
          } catch (e) {
            script.text = code;
          }
        }
        parent.appendChild(script);
        if ((parent instanceof HTMLHeadElement || parent instanceof HTMLBodyElement) && parent.contains(script)) {
          parent.removeChild(script);
        }
        return true;
      };
      return evalScript;
    }
    var executeScripts;
    var hasRequiredExecuteScripts;
    function requireExecuteScripts() {
      if (hasRequiredExecuteScripts) return executeScripts;
      hasRequiredExecuteScripts = 1;
      var forEachEls = requireForeachEls();
      var evalScript2 = requireEvalScript();
      executeScripts = function (el) {
        if (el.tagName.toLowerCase() === "script") {
          evalScript2(el);
        }
        forEachEls(el.querySelectorAll("script"), function (script) {
          if (!script.type || script.type.toLowerCase() === "text/javascript") {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
            evalScript2(script);
          }
        });
      };
      return executeScripts;
    }
    var on;
    var hasRequiredOn;
    function requireOn() {
      if (hasRequiredOn) return on;
      hasRequiredOn = 1;
      var forEachEls = requireForeachEls();
      on = function (els, events, listener, useCapture) {
        events = typeof events === "string" ? events.split(" ") : events;
        events.forEach(function (e) {
          forEachEls(els, function (el) {
            el.addEventListener(e, listener, useCapture);
          });
        });
      };
      return on;
    }
    var switches;
    var hasRequiredSwitches;
    function requireSwitches() {
      if (hasRequiredSwitches) return switches;
      hasRequiredSwitches = 1;
      var on2 = requireOn();
      switches = {
        outerHTML: function (oldEl, newEl) {
          oldEl.outerHTML = newEl.outerHTML;
          this.onSwitch();
        },
        innerHTML: function (oldEl, newEl) {
          oldEl.innerHTML = newEl.innerHTML;
          if (newEl.className === "") {
            oldEl.removeAttribute("class");
          } else {
            oldEl.className = newEl.className;
          }
          this.onSwitch();
        },
        switchElementsAlt: function (oldEl, newEl) {
          oldEl.innerHTML = newEl.innerHTML;
          if (newEl.hasAttributes()) {
            var attrs = newEl.attributes;
            for (var i = 0; i < attrs.length; i++) {
              oldEl.attributes.setNamedItem(attrs[i].cloneNode());
            }
          }
          this.onSwitch();
        },
        // Equivalent to outerHTML(), but doesn't require switchElementsAlt() for <head> and <body>
        replaceNode: function (oldEl, newEl) {
          oldEl.parentNode.replaceChild(newEl, oldEl);
          this.onSwitch();
        },
        sideBySide: function (oldEl, newEl, options, switchOptions) {
          var forEach = Array.prototype.forEach;
          var elsToRemove = [];
          var elsToAdd = [];
          var fragToAppend = document.createDocumentFragment();
          var animationEventNames = "animationend webkitAnimationEnd MSAnimationEnd oanimationend";
          var animatedElsNumber = 0;
          var sexyAnimationEnd = (function (e) {
            if (e.target !== e.currentTarget) {
              return;
            }
            animatedElsNumber--;
            if (animatedElsNumber <= 0 && elsToRemove) {
              elsToRemove.forEach(function (el) {
                if (el.parentNode) {
                  el.parentNode.removeChild(el);
                }
              });
              elsToAdd.forEach(function (el) {
                el.className = el.className.replace(
                  el.getAttribute("data-pjax-classes"),
                  ""
                );
                el.removeAttribute("data-pjax-classes");
              });
              elsToAdd = null;
              elsToRemove = null;
              this.onSwitch();
            }
          }).bind(this);
          switchOptions = switchOptions || {};
          forEach.call(oldEl.childNodes, function (el) {
            elsToRemove.push(el);
            if (el.classList && !el.classList.contains("js-Pjax-remove")) {
              if (el.hasAttribute("data-pjax-classes")) {
                el.className = el.className.replace(
                  el.getAttribute("data-pjax-classes"),
                  ""
                );
                el.removeAttribute("data-pjax-classes");
              }
              el.classList.add("js-Pjax-remove");
              if (switchOptions.callbacks && switchOptions.callbacks.removeElement) {
                switchOptions.callbacks.removeElement(el);
              }
              if (switchOptions.classNames) {
                el.className += " " + switchOptions.classNames.remove + " " + (options.backward ? switchOptions.classNames.backward : switchOptions.classNames.forward);
              }
              animatedElsNumber++;
              on2(el, animationEventNames, sexyAnimationEnd, true);
            }
          });
          forEach.call(newEl.childNodes, function (el) {
            if (el.classList) {
              var addClasses = "";
              if (switchOptions.classNames) {
                addClasses = " js-Pjax-add " + switchOptions.classNames.add + " " + (options.backward ? switchOptions.classNames.forward : switchOptions.classNames.backward);
              }
              if (switchOptions.callbacks && switchOptions.callbacks.addElement) {
                switchOptions.callbacks.addElement(el);
              }
              el.className += addClasses;
              el.setAttribute("data-pjax-classes", addClasses);
              elsToAdd.push(el);
              fragToAppend.appendChild(el);
              animatedElsNumber++;
              on2(el, animationEventNames, sexyAnimationEnd, true);
            }
          });
          oldEl.className = newEl.className;
          oldEl.appendChild(fragToAppend);
        }
      };
      return switches;
    }
    var parseOptions;
    var hasRequiredParseOptions;
    function requireParseOptions() {
      if (hasRequiredParseOptions) return parseOptions;
      hasRequiredParseOptions = 1;
      var defaultSwitches = requireSwitches();
      parseOptions = function (options) {
        options = options || {};
        options.elements = options.elements || "a[href], form[action]";
        options.selectors = options.selectors || ["title", ".js-Pjax"];
        options.switches = options.switches || {};
        options.switchesOptions = options.switchesOptions || {};
        options.history = typeof options.history === "undefined" ? true : options.history;
        options.analytics = typeof options.analytics === "function" || options.analytics === false ? options.analytics : defaultAnalytics;
        options.scrollTo = typeof options.scrollTo === "undefined" ? 0 : options.scrollTo;
        options.scrollRestoration = typeof options.scrollRestoration !== "undefined" ? options.scrollRestoration : true;
        options.cacheBust = typeof options.cacheBust === "undefined" ? true : options.cacheBust;
        options.debug = options.debug || false;
        options.timeout = options.timeout || 0;
        options.currentUrlFullReload = typeof options.currentUrlFullReload === "undefined" ? false : options.currentUrlFullReload;
        if (!options.switches.head) {
          options.switches.head = defaultSwitches.switchElementsAlt;
        }
        if (!options.switches.body) {
          options.switches.body = defaultSwitches.switchElementsAlt;
        }
        return options;
      };
      function defaultAnalytics() {
        if (window._gaq) {
          _gaq.push(["_trackPageview"]);
        }
        if (window.ga) {
          ga("send", "pageview", { page: location.pathname, title: document.title });
        }
      }
      return parseOptions;
    }
    var uniqueid;
    var hasRequiredUniqueid;
    function requireUniqueid() {
      if (hasRequiredUniqueid) return uniqueid;
      hasRequiredUniqueid = 1;
      uniqueid = /* @__PURE__ */ function () {
        var counter = 0;
        return function () {
          var id = "pjax" + (/* @__PURE__ */ new Date()).getTime() + "_" + counter;
          counter++;
          return id;
        };
      }();
      return uniqueid;
    }
    var trigger;
    var hasRequiredTrigger;
    function requireTrigger() {
      if (hasRequiredTrigger) return trigger;
      hasRequiredTrigger = 1;
      var forEachEls = requireForeachEls();
      trigger = function (els, events, opts) {
        events = typeof events === "string" ? events.split(" ") : events;
        events.forEach(function (e) {
          var event;
          event = document.createEvent("HTMLEvents");
          event.initEvent(e, true, true);
          event.eventName = e;
          if (opts) {
            Object.keys(opts).forEach(function (key) {
              event[key] = opts[key];
            });
          }
          forEachEls(els, function (el) {
            var domFix = false;
            if (!el.parentNode && el !== document && el !== window) {
              domFix = true;
              document.body.appendChild(el);
            }
            el.dispatchEvent(event);
            if (domFix) {
              el.parentNode.removeChild(el);
            }
          });
        });
      };
      return trigger;
    }
    var clone$2;
    var hasRequiredClone;
    function requireClone() {
      if (hasRequiredClone) return clone$2;
      hasRequiredClone = 1;
      clone$2 = function (obj) {
        if (null === obj || "object" !== typeof obj) {
          return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
          }
        }
        return copy;
      };
      return clone$2;
    }
    var contains;
    var hasRequiredContains;
    function requireContains() {
      if (hasRequiredContains) return contains;
      hasRequiredContains = 1;
      contains = function contains2(doc, selectors, el) {
        for (var i = 0; i < selectors.length; i++) {
          var selectedEls = doc.querySelectorAll(selectors[i]);
          for (var j = 0; j < selectedEls.length; j++) {
            if (selectedEls[j].contains(el)) {
              return true;
            }
          }
        }
        return false;
      };
      return contains;
    }
    var extend$1;
    var hasRequiredExtend;
    function requireExtend() {
      if (hasRequiredExtend) return extend$1;
      hasRequiredExtend = 1;
      extend$1 = function (target) {
        if (target == null) {
          return null;
        }
        var to2 = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                to2[key] = source[key];
              }
            }
          }
        }
        return to2;
      };
      return extend$1;
    }
    var noop;
    var hasRequiredNoop;
    function requireNoop() {
      if (hasRequiredNoop) return noop;
      hasRequiredNoop = 1;
      noop = function () {
      };
      return noop;
    }
    var log;
    var hasRequiredLog;
    function requireLog() {
      if (hasRequiredLog) return log;
      hasRequiredLog = 1;
      log = function () {
        if (this.options.debug && console) {
          if (typeof console.log === "function") {
            console.log.apply(console, arguments);
          } else if (console.log) {
            console.log(arguments);
          }
        }
      };
      return log;
    }
    var parseElement;
    var hasRequiredParseElement;
    function requireParseElement() {
      if (hasRequiredParseElement) return parseElement;
      hasRequiredParseElement = 1;
      var attrState = "data-pjax-state";
      parseElement = function (el) {
        switch (el.tagName.toLowerCase()) {
          case "a":
            if (!el.hasAttribute(attrState)) {
              this.attachLink(el);
            }
            break;
          case "form":
            if (!el.hasAttribute(attrState)) {
              this.attachForm(el);
            }
            break;
          default:
            throw "Pjax can only be applied on <a> or <form> submit";
        }
      };
      return parseElement;
    }
    var attachLink;
    var hasRequiredAttachLink;
    function requireAttachLink() {
      if (hasRequiredAttachLink) return attachLink;
      hasRequiredAttachLink = 1;
      var on2 = requireOn();
      var clone2 = requireClone();
      var attrState = "data-pjax-state";
      var linkAction = function (el, event) {
        if (isDefaultPrevented(event)) {
          return;
        }
        var options = clone2(this.options);
        var attrValue = checkIfShouldAbort(el, event);
        if (attrValue) {
          el.setAttribute(attrState, attrValue);
          return;
        }
        event.preventDefault();
        if (this.options.currentUrlFullReload && el.href === window.location.href.split("#")[0]) {
          el.setAttribute(attrState, "reload");
          this.reload();
          return;
        }
        el.setAttribute(attrState, "load");
        options.triggerElement = el;
        this.loadUrl(el.href, options);
      };
      function checkIfShouldAbort(el, event) {
        if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return "modifier";
        }
        if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
          return "external";
        }
        if (el.hash && el.href.replace(el.hash, "") === window.location.href.replace(location.hash, "")) {
          return "anchor";
        }
        if (el.href === window.location.href.split("#")[0] + "#") {
          return "anchor-empty";
        }
      }
      var isDefaultPrevented = function (event) {
        return event.defaultPrevented || event.returnValue === false;
      };
      attachLink = function (el) {
        var that = this;
        el.setAttribute(attrState, "");
        on2(el, "click", function (event) {
          linkAction.call(that, el, event);
        });
        on2(
          el,
          "keyup",
          (function (event) {
            if (event.keyCode === 13) {
              linkAction.call(that, el, event);
            }
          }).bind(this)
        );
      };
      return attachLink;
    }
    var attachForm;
    var hasRequiredAttachForm;
    function requireAttachForm() {
      if (hasRequiredAttachForm) return attachForm;
      hasRequiredAttachForm = 1;
      var on2 = requireOn();
      var clone2 = requireClone();
      var attrState = "data-pjax-state";
      var formAction = function (el, event) {
        if (isDefaultPrevented(event)) {
          return;
        }
        var options = clone2(this.options);
        options.requestOptions = {
          requestUrl: el.getAttribute("action") || window.location.href,
          requestMethod: el.getAttribute("method") || "GET"
        };
        var virtLinkElement = document.createElement("a");
        virtLinkElement.setAttribute("href", options.requestOptions.requestUrl);
        var attrValue = checkIfShouldAbort(virtLinkElement, options);
        if (attrValue) {
          el.setAttribute(attrState, attrValue);
          return;
        }
        event.preventDefault();
        if (el.enctype === "multipart/form-data") {
          options.requestOptions.formData = new FormData(el);
        } else {
          options.requestOptions.requestParams = parseFormElements(el);
        }
        el.setAttribute(attrState, "submit");
        options.triggerElement = el;
        this.loadUrl(virtLinkElement.href, options);
      };
      function parseFormElements(el) {
        var requestParams = [];
        var formElements = el.elements;
        for (var i = 0; i < formElements.length; i++) {
          var element = formElements[i];
          var tagName = element.tagName.toLowerCase();
          if (!!element.name && element.attributes !== void 0 && tagName !== "button") {
            var type = element.attributes.type;
            if (!type || type.value !== "checkbox" && type.value !== "radio" || element.checked) {
              var values = [];
              if (tagName === "select") {
                var opt;
                for (var j = 0; j < element.options.length; j++) {
                  opt = element.options[j];
                  if (opt.selected && !opt.disabled) {
                    values.push(opt.hasAttribute("value") ? opt.value : opt.text);
                  }
                }
              } else {
                values.push(element.value);
              }
              for (var k = 0; k < values.length; k++) {
                requestParams.push({
                  name: encodeURIComponent(element.name),
                  value: encodeURIComponent(values[k])
                });
              }
            }
          }
        }
        return requestParams;
      }
      function checkIfShouldAbort(virtLinkElement, options) {
        if (virtLinkElement.protocol !== window.location.protocol || virtLinkElement.host !== window.location.host) {
          return "external";
        }
        if (virtLinkElement.hash && virtLinkElement.href.replace(virtLinkElement.hash, "") === window.location.href.replace(location.hash, "")) {
          return "anchor";
        }
        if (virtLinkElement.href === window.location.href.split("#")[0] + "#") {
          return "anchor-empty";
        }
        if (options.currentUrlFullReload && virtLinkElement.href === window.location.href.split("#")[0]) {
          return "reload";
        }
      }
      var isDefaultPrevented = function (event) {
        return event.defaultPrevented || event.returnValue === false;
      };
      attachForm = function (el) {
        var that = this;
        el.setAttribute(attrState, "");
        on2(el, "submit", function (event) {
          formAction.call(that, el, event);
        });
      };
      return attachForm;
    }
    var foreachSelectors;
    var hasRequiredForeachSelectors;
    function requireForeachSelectors() {
      if (hasRequiredForeachSelectors) return foreachSelectors;
      hasRequiredForeachSelectors = 1;
      var forEachEls = requireForeachEls();
      foreachSelectors = function (selectors, cb, context, DOMcontext) {
        DOMcontext = DOMcontext || document;
        selectors.forEach(function (selector2) {
          forEachEls(DOMcontext.querySelectorAll(selector2), cb, context);
        });
      };
      return foreachSelectors;
    }
    var switchesSelectors;
    var hasRequiredSwitchesSelectors;
    function requireSwitchesSelectors() {
      if (hasRequiredSwitchesSelectors) return switchesSelectors;
      hasRequiredSwitchesSelectors = 1;
      var forEachEls = requireForeachEls();
      var defaultSwitches = requireSwitches();
      switchesSelectors = function (switches2, switchesOptions, selectors, fromEl, toEl, options) {
        var switchesQueue = [];
        selectors.forEach(function (selector2) {
          var newEls = fromEl.querySelectorAll(selector2);
          var oldEls = toEl.querySelectorAll(selector2);
          if (this.log) {
            this.log("Pjax switch", selector2, newEls, oldEls);
          }
          if (newEls.length !== oldEls.length) {
            throw "DOM doesn’t look the same on new loaded page: ’" + selector2 + "’ - new " + newEls.length + ", old " + oldEls.length;
          }
          forEachEls(
            newEls,
            function (newEl, i) {
              var oldEl = oldEls[i];
              if (this.log) {
                this.log("newEl", newEl, "oldEl", oldEl);
              }
              var callback = switches2[selector2] ? switches2[selector2].bind(
                this,
                oldEl,
                newEl,
                options,
                switchesOptions[selector2]
              ) : defaultSwitches.outerHTML.bind(this, oldEl, newEl, options);
              switchesQueue.push(callback);
            },
            this
          );
        }, this);
        this.state.numPendingSwitches = switchesQueue.length;
        switchesQueue.forEach(function (queuedSwitch) {
          queuedSwitch();
        });
      };
      return switchesSelectors;
    }
    var abortRequest;
    var hasRequiredAbortRequest;
    function requireAbortRequest() {
      if (hasRequiredAbortRequest) return abortRequest;
      hasRequiredAbortRequest = 1;
      var noop2 = requireNoop();
      abortRequest = function (request) {
        if (request && request.readyState < 4) {
          request.onreadystatechange = noop2;
          request.abort();
        }
      };
      return abortRequest;
    }
    var updateQueryString;
    var hasRequiredUpdateQueryString;
    function requireUpdateQueryString() {
      if (hasRequiredUpdateQueryString) return updateQueryString;
      hasRequiredUpdateQueryString = 1;
      updateQueryString = function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf("?") !== -1 ? "&" : "?";
        if (uri.match(re)) {
          return uri.replace(re, "$1" + key + "=" + value + "$2");
        } else {
          return uri + separator + key + "=" + value;
        }
      };
      return updateQueryString;
    }
    var sendRequest;
    var hasRequiredSendRequest;
    function requireSendRequest() {
      if (hasRequiredSendRequest) return sendRequest;
      hasRequiredSendRequest = 1;
      var updateQueryString2 = requireUpdateQueryString();
      sendRequest = function (location2, options, callback) {
        options = options || {};
        var queryString;
        var requestOptions = options.requestOptions || {};
        var requestMethod = (requestOptions.requestMethod || "GET").toUpperCase();
        var requestParams = requestOptions.requestParams || null;
        var formData = requestOptions.formData || null;
        var requestPayload = null;
        var request = new XMLHttpRequest();
        var timeout = options.timeout || 0;
        request.onreadystatechange = function () {
          if (request.readyState === 4) {
            if (request.status === 200) {
              callback(request.responseText, request, location2, options);
            } else if (request.status !== 0) {
              callback(null, request, location2, options);
            }
          }
        };
        request.onerror = function (e) {
          console.log(e);
          callback(null, request, location2, options);
        };
        request.ontimeout = function () {
          callback(null, request, location2, options);
        };
        if (requestParams && requestParams.length) {
          queryString = requestParams.map(function (param) {
            return param.name + "=" + param.value;
          }).join("&");
          switch (requestMethod) {
            case "GET":
              location2 = location2.split("?")[0];
              location2 += "?" + queryString;
              break;
            case "POST":
              requestPayload = queryString;
              break;
          }
        } else if (formData) {
          requestPayload = formData;
        }
        if (options.cacheBust) {
          location2 = updateQueryString2(location2, "t", Date.now());
        }
        request.open(requestMethod, location2, true);
        request.timeout = timeout;
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.setRequestHeader("X-PJAX", "true");
        request.setRequestHeader(
          "X-PJAX-Selectors",
          JSON.stringify(options.selectors)
        );
        if (requestPayload && requestMethod === "POST" && !formData) {
          request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
        }
        request.send(requestPayload);
        return request;
      };
      return sendRequest;
    }
    var handleResponse;
    var hasRequiredHandleResponse;
    function requireHandleResponse() {
      if (hasRequiredHandleResponse) return handleResponse;
      hasRequiredHandleResponse = 1;
      var clone2 = requireClone();
      var newUid = requireUniqueid();
      var trigger2 = requireTrigger();
      handleResponse = function (responseText, request, href, options) {
        options = clone2(options || this.options);
        options.request = request;
        if (responseText === false) {
          trigger2(document, "pjax:complete pjax:error", options);
          return;
        }
        var currentState = window.history.state || {};
        window.history.replaceState(
          {
            url: currentState.url || window.location.href,
            title: currentState.title || document.title,
            uid: currentState.uid || newUid(),
            scrollPos: [
              document.documentElement.scrollLeft || document.body.scrollLeft,
              document.documentElement.scrollTop || document.body.scrollTop
            ]
          },
          document.title,
          window.location.href
        );
        var oldHref = href;
        if (request.responseURL) {
          if (href !== request.responseURL) {
            href = request.responseURL;
          }
        } else if (request.getResponseHeader("X-PJAX-URL")) {
          href = request.getResponseHeader("X-PJAX-URL");
        } else if (request.getResponseHeader("X-XHR-Redirected-To")) {
          href = request.getResponseHeader("X-XHR-Redirected-To");
        }
        var a = document.createElement("a");
        a.href = oldHref;
        var oldHash = a.hash;
        a.href = href;
        if (oldHash && !a.hash) {
          a.hash = oldHash;
          href = a.href;
        }
        this.state.href = href;
        this.state.options = options;
        try {
          this.loadContent(responseText, options);
        } catch (e) {
          trigger2(document, "pjax:error", options);
          if (!this.options.debug) {
            if (console && console.error) {
              console.error("Pjax switch fail: ", e);
            }
            return this.latestChance(href);
          } else {
            throw e;
          }
        }
      };
      return handleResponse;
    }
    var isSupported;
    var hasRequiredIsSupported;
    function requireIsSupported() {
      if (hasRequiredIsSupported) return isSupported;
      hasRequiredIsSupported = 1;
      isSupported = function () {
        return window.history && window.history.pushState && window.history.replaceState && // pushState isn’t reliable on iOS until 5.
          !navigator.userAgent.match(
            /((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/
          );
      };
      return isSupported;
    }
    var hasRequiredPjax;
    function requirePjax() {
      if (hasRequiredPjax) return pjax.exports;
      hasRequiredPjax = 1;
      var executeScripts2 = requireExecuteScripts();
      var forEachEls = requireForeachEls();
      var parseOptions2 = requireParseOptions();
      var switches2 = requireSwitches();
      var newUid = requireUniqueid();
      var on2 = requireOn();
      var trigger2 = requireTrigger();
      var clone2 = requireClone();
      var contains2 = requireContains();
      var extend2 = requireExtend();
      var noop2 = requireNoop();
      var Pjax2 = function (options) {
        this.state = {
          numPendingSwitches: 0,
          href: null,
          options: null
        };
        this.options = parseOptions2(options);
        this.log("Pjax options", this.options);
        if (this.options.scrollRestoration && "scrollRestoration" in history) {
          history.scrollRestoration = "manual";
        }
        this.maxUid = this.lastUid = newUid();
        this.parseDOM(document);
        on2(
          window,
          "popstate",
          (function (st) {
            if (st.state) {
              var opt = clone2(this.options);
              opt.url = st.state.url;
              opt.title = st.state.title;
              opt.history = false;
              opt.scrollPos = st.state.scrollPos;
              if (st.state.uid < this.lastUid) {
                opt.backward = true;
              } else {
                opt.forward = true;
              }
              this.lastUid = st.state.uid;
              this.loadUrl(st.state.url, opt);
            }
          }).bind(this)
        );
      };
      Pjax2.switches = switches2;
      Pjax2.prototype = {
        log: requireLog(),
        getElements: function (el) {
          return el.querySelectorAll(this.options.elements);
        },
        parseDOM: function (el) {
          var parseElement2 = requireParseElement();
          forEachEls(this.getElements(el), parseElement2, this);
        },
        refresh: function (el) {
          this.parseDOM(el || document);
        },
        reload: function () {
          window.location.reload();
        },
        attachLink: requireAttachLink(),
        attachForm: requireAttachForm(),
        forEachSelectors: function (cb, context, DOMcontext) {
          return requireForeachSelectors().bind(this)(
            this.options.selectors,
            cb,
            context,
            DOMcontext
          );
        },
        switchSelectors: function (selectors, fromEl, toEl, options) {
          return requireSwitchesSelectors().bind(this)(
            this.options.switches,
            this.options.switchesOptions,
            selectors,
            fromEl,
            toEl,
            options
          );
        },
        latestChance: function (href) {
          window.location = href;
        },
        onSwitch: function () {
          trigger2(window, "resize scroll");
          this.state.numPendingSwitches--;
          if (this.state.numPendingSwitches === 0) {
            this.afterAllSwitches();
          }
        },
        loadContent: function (html, options) {
          if (typeof html !== "string") {
            trigger2(document, "pjax:complete pjax:error", options);
            return;
          }
          var tmpEl = document.implementation.createHTMLDocument("pjax");
          var htmlRegex = /<html[^>]+>/gi;
          var htmlAttribsRegex = /\s?[a-z:]+(?:=['"][^'">]+['"])*/gi;
          var matches = html.match(htmlRegex);
          if (matches && matches.length) {
            matches = matches[0].match(htmlAttribsRegex);
            if (matches.length) {
              matches.shift();
              matches.forEach(function (htmlAttrib) {
                var attr = htmlAttrib.trim().split("=");
                if (attr.length === 1) {
                  tmpEl.documentElement.setAttribute(attr[0], true);
                } else {
                  tmpEl.documentElement.setAttribute(attr[0], attr[1].slice(1, -1));
                }
              });
            }
          }
          tmpEl.documentElement.innerHTML = html;
          this.log(
            "load content",
            tmpEl.documentElement.attributes,
            tmpEl.documentElement.innerHTML.length
          );
          if (document.activeElement && contains2(document, this.options.selectors, document.activeElement)) {
            try {
              document.activeElement.blur();
            } catch (e) {
            }
          }
          this.switchSelectors(this.options.selectors, tmpEl, document, options);
        },
        abortRequest: requireAbortRequest(),
        doRequest: requireSendRequest(),
        handleResponse: requireHandleResponse(),
        loadUrl: function (href, options) {
          options = typeof options === "object" ? extend2({}, this.options, options) : clone2(this.options);
          this.log("load href", href, options);
          this.abortRequest(this.request);
          trigger2(document, "pjax:send", options);
          this.request = this.doRequest(
            href,
            options,
            this.handleResponse.bind(this)
          );
        },
        afterAllSwitches: function () {
          var autofocusEl = Array.prototype.slice.call(document.querySelectorAll("[autofocus]")).pop();
          if (autofocusEl && document.activeElement !== autofocusEl) {
            autofocusEl.focus();
          }
          this.options.selectors.forEach(function (selector2) {
            forEachEls(document.querySelectorAll(selector2), function (el) {
              executeScripts2(el);
            });
          });
          var state = this.state;
          if (state.options.history) {
            if (!window.history.state) {
              this.lastUid = this.maxUid = newUid();
              window.history.replaceState(
                {
                  url: window.location.href,
                  title: document.title,
                  uid: this.maxUid,
                  scrollPos: [0, 0]
                },
                document.title
              );
            }
            this.lastUid = this.maxUid = newUid();
            window.history.pushState(
              {
                url: state.href,
                title: state.options.title,
                uid: this.maxUid,
                scrollPos: [0, 0]
              },
              state.options.title,
              state.href
            );
          }
          this.forEachSelectors(function (el) {
            this.parseDOM(el);
          }, this);
          trigger2(document, "pjax:complete pjax:success", state.options);
          if (typeof state.options.analytics === "function") {
            state.options.analytics();
          }
          if (state.options.history) {
            var a = document.createElement("a");
            a.href = this.state.href;
            if (a.hash) {
              var name = a.hash.slice(1);
              name = decodeURIComponent(name);
              var curtop = 0;
              var target = document.getElementById(name) || document.getElementsByName(name)[0];
              if (target) {
                if (target.offsetParent) {
                  do {
                    curtop += target.offsetTop;
                    target = target.offsetParent;
                  } while (target);
                }
              }
              window.scrollTo(0, curtop);
            } else if (state.options.scrollTo !== false) {
              if (state.options.scrollTo.length > 1) {
                window.scrollTo(state.options.scrollTo[0], state.options.scrollTo[1]);
              } else {
                window.scrollTo(0, state.options.scrollTo);
              }
            }
          } else if (state.options.scrollRestoration && state.options.scrollPos) {
            window.scrollTo(state.options.scrollPos[0], state.options.scrollPos[1]);
          }
          this.state = {
            numPendingSwitches: 0,
            href: null,
            options: null
          };
        }
      };
      Pjax2.isSupported = requireIsSupported();
      if (Pjax2.isSupported()) {
        pjax.exports = Pjax2;
      } else {
        var stupidPjax = noop2;
        for (var key in Pjax2.prototype) {
          if (Pjax2.prototype.hasOwnProperty(key) && typeof Pjax2.prototype[key] === "function") {
            stupidPjax[key] = noop2;
          }
        }
        pjax.exports = stupidPjax;
      }
      return pjax.exports;
    }
    var pjaxExports = requirePjax();
    const Pjax = /* @__PURE__ */ getDefaultExportFromCjs(pjaxExports);
    let _currentPageId = "";
    let _nextPageId = "";
    class geral {
      /* -------------------------------------------------------------------------- */
      /*                                 CONSTRUCTOR                                */
      /* -------------------------------------------------------------------------- */
      constructor() {
        this.currentPageId = document.querySelector(".wrapper").id;
      }
      /* -------------------------------------------------------------------------- */
      /*                               IDs das páginas                              */
      /* -------------------------------------------------------------------------- */
      get currentPageId() {
        return _currentPageId;
      }
      set currentPageId(newId) {
        _currentPageId = newId.substring(3);
        document.body.dataset.pg = newId;
        this.nextPageId = "";
      }
      get nextPageId() {
        return _nextPageId;
      }
      set nextPageId(newId) {
        _nextPageId = newId.substring(3);
        document.body.dataset.pgNext = newId.length > 0 ? "pg-" + _nextPageId : "";
      }
      /* -------------------------------------------------------------------------- */
      /*                                    TOKEN                                   */
      /* -------------------------------------------------------------------------- */
      get token() {
        return document.querySelector('meta[name="csrf-token"]').content;
      }
    }
    const geral$1 = new geral();
    function manualModalClose() {
      document.querySelectorAll("modal-group.active", "modal-item.active").forEach((element) => {
        document.dispatchEvent(new CustomEvent("modal:close"));
        document.removeEventListener("keydown", this);
        document.body.dataset.modalState = "leave";
        element.classList.remove("active");
        element.classList.add("leave");
        setTimeout(() => {
          element.classList.remove("leave");
          delete document.body.dataset.modalState;
          delete document.body.dataset.modal;
          delete document.body.dataset.modalItem;
        }, 800);
      });
    }
    Pjax.prototype.getElements = function () {
      let links = Array.from(document.querySelectorAll("a:not(.no-pjax):not([data-fancybox])"));
      links = links.filter((el) => el.href.includes(location.hostname));
      links.forEach((element) => {
        element.addEventListener("click", function () {
          manualModalClose();
          document.body.dataset.pgPrev = document.body.dataset.pg;
          if (element.dataset.pgActive) document.body.dataset.pgNext = element.dataset.pgActive;
        });
      });
      let dataUrl = Array.from(document.querySelectorAll("[data-url]"));
      dataUrl.forEach((el) => el.onclick = () => {
        singlePjaxInstance.loadUrl(el.dataset.url);
      });
      function serializeFormData(form) {
        const formData = new URLSearchParams(new FormData(form)).toString();
        return formData;
      }
      function clearQueryParams(url) {
        return url.split("?")[0];
      }
      function handleSelectChange(event) {
        const serializedData = serializeFormData(event.target.form);
        const baseActionUrl = clearQueryParams(event.target.form.action);
        const fullUrl = serializedData ? `${baseActionUrl}?${serializedData}` : baseActionUrl;
        document.body.dataset.pgPrev = document.body.dataset.pg;
        if (event.target.form.dataset.pgActive) document.body.dataset.pgNext = event.target.form.dataset.pgActive;
        singlePjaxInstance.loadUrl(fullUrl);
      }
      let forms = Array.from(document.querySelectorAll("form[data-pjax]"));
      forms.forEach((form) => {
        if (form.dataset.eventsAttached) {
          return;
        }
        let selects = form.querySelectorAll("select.submit-on-change");
        selects.forEach((select) => {
          select.addEventListener("change", handleSelectChange);
        });
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          document.body.dataset.pgPrev = document.body.dataset.pg;
          if (form.dataset.pgActive) document.body.dataset.pgNext = form.dataset.pgActive;
          if (form.method.toUpperCase() === "GET") {
            const serializedData = serializeFormData(form);
            const baseActionUrl = clearQueryParams(form.action);
            const fullUrl = serializedData ? `${baseActionUrl}?${serializedData}` : baseActionUrl;
            singlePjaxInstance.loadUrl(fullUrl);
          }
        });
        form.dataset.eventsAttached = "true";
      });
      return links;
    };
    const delay = window.innerWidth < 1025 ? 900 : 900;
    const singlePjaxInstance = new Pjax({
      elements: "a[href]",
      cacheBust: false,
      debug: false,
      selectors: [
        "head > title",
        "#scripts",
        "#main-transition > .wrapper"
        // ,".language--list"
      ],
      maxCacheLength: 20,
      timeout: 0,
      scrollTo: 0,
      switches: {
        "head > title": function (oldEl, newEl, options) {
          setTimeout(() => {
            document.title = newEl.textContent;
            this.onSwitch();
          }, delay);
        },
        "#scripts": function (oldEl, newEl, options) {
          setTimeout(() => {
            oldEl.innerHTML = newEl.innerHTML;
            this.onSwitch();
          }, delay);
        },
        "#main-transition > .wrapper": function (oldEl, newEl, options) {
          geral$1.nextPageId = newEl.id;
          setTimeout(() => {
            document.dispatchEvent(new CustomEvent("pjax:switch"));
          }, delay - 10);
          setTimeout(() => {
            oldEl.outerHTML = newEl.outerHTML;
            geral$1.currentPageId = newEl.id;
            this.onSwitch();
          }, delay);
        }
        /* se tiver em só um lugar */
        // ".language--list": function (oldEl, newEl, options) {
        //     setTimeout(() => {
        //         oldEl.innerHTML = newEl.innerHTML;
        //         this.onSwitch();
        //     }, delay);
        // },
        /* se tiver em dois lugares diferentes */
        // ".language--list-header": function (oldEl, newEl, options) {
        //     setTimeout(() => {
        //         oldEl.innerHTML = newEl.innerHTML;
        //         this.onSwitch();
        //     }, delay);
        // },
        // ".language--list-footer": function (oldEl, newEl, options) {
        //     setTimeout(() => {
        //         oldEl.innerHTML = newEl.innerHTML;
        //         this.onSwitch();
        //     }, delay);
        // },
        /* transição de wrapper com os 2 em telas simultaneamente */
        /*
                ".wrapper": function (oldEl, newEl, options) {
                    geral.nextPageId = newEl.id;
        
        
                    // Adiciona a nova página abaixo da atual
                    oldEl.parentNode.insertBefore(newEl, oldEl.nextSibling);
        
                    // Inicia a animação
                    oldEl.classList.add("page-out");
                    newEl.classList.add("page-in");
        
        
                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent('pjax:switch'))
                    }, delay - 10);
                    setTimeout(() => {
                        newEl.classList.remove("page-in");
                        oldEl.remove(); // Remove a página antiga
                        geral.currentPageId = newEl.id;
                        this.onSwitch();
                    }, delay);
                },
                */
      }
    });
    class Page {
      /**
       * Objeto definindo uma página
       * @param {object} params
       * @param {string} params.pageName Nome da página sem o "pg"
       * @param {function} params.init Primeira função a ser chamada, no primeiro carregamento é no "readyState interactive" no pjax, "success"
       * @param {function} params.main Principal função, chamada no primeiro carregamento no "readyState complete"
       * @param {function} params.destroy Chamada 
       */
      constructor({ pageName: pageName2, main: main2, init, destroy }) {
        this.pageName = pageName2;
        this.init = init ? init : empty;
        this.main = main2;
        this.destroy = destroy ? destroy : empty;
        this.transitionDelayDesktop = 600;
        this.transitionDelayMobile = 300;
        function empty() {
          return true;
        }
      }
    }
    class PageController {
      constructor() {
        this.pages = [];
        this.currentPage = {};
        this.lastPage = {};
        this.firstPage = true;
        document.addEventListener("pjax:send", this);
        document.addEventListener("pjax:complete", this);
        document.addEventListener("pjax:error", this);
      }
      /**
       * @param {Event} ev 
       */
      handleEvent(ev) {
        switch (ev.type) {
          case "pjax:send":
            if (this.currentPage) {
              this.currentPage.destroy();
            }
            break;
          case "pjax:complete":
            this.firstPage = false;
            if (this.updateCurrent()) {
              this.runCurrent();
            }
            break;
          //força o re-carregamento da página, assim o server consegue
          //direcionar para uma página 404 ou coisa do tipo.
          case "pjax:error":
            const problematicUrl = ev.triggerElement.href;
            location.assign(problematicUrl);
            break;
        }
      }
      updateCurrent() {
        const pg = this.pages.find((e) => e.pageName.includes(geral$1.currentPageId));
        if (!pg) {
          console.warn(`js da página ${geral$1.currentPageId} não encontrado`);
          this.currentPage = null;
          return false;
        }
        if (this.firstPage) {
          this.currentPage = pg;
          return true;
        } else {
          this.lastPage = this.currentPage;
          this.currentPage = pg;
          return true;
        }
      }
      runCurrent() {
        const pg = this.currentPage;
        try {
          pg.init();
        } catch (error) {
          console.error(`Erro no init da página ${pg.pageName}: ${error}`);
        }
        try {
          pg.main();
        } catch (error) {
          console.error(`Erro no main da página ${pg.pageName}: ${error}`);
        }
      }
      add(page) {
        this.pages.push(page);
      }
    }
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1, ScrollSmoother, Power3);
    function timelineHeader() {
      gsapWithCSS$1.timeline({
        scrollTrigger: {
          trigger: ".section-presentation .container-1",
          start: "-5% top",
          end: "bottom top",
          scrub: false,
          markers: false,
          anticipatePin: true,
          invalidateOnRefresh: true,
          toggleClass: { targets: header, className: "show-full-header" }
        }
      });
      gsapWithCSS$1.timeline({
        scrollTrigger: {
          trigger: ".section-presentation .container-2",
          start: "top top",
          end: "bottom top",
          scrub: false,
          markers: false,
          anticipatePin: true,
          invalidateOnRefresh: true,
          toggleClass: { targets: header, className: "show-compact-header" }
        }
      });
      gsapWithCSS$1.timeline({
        scrollTrigger: {
          trigger: ".section-features .container-fluid",
          start: "top top",
          end: "bottom-=100px top",
          scrub: false,
          markers: false,
          anticipatePin: true,
          invalidateOnRefresh: true,
          toggleClass: { targets: header, className: "show-full-header" }
        }
      });
      gsapWithCSS$1.timeline({
        scrollTrigger: {
          trigger: ".section-waitlist .container-fluid",
          start: "top top",
          end: "200% top",
          scrub: false,
          markers: false,
          anticipatePin: true,
          invalidateOnRefresh: true,
          toggleClass: { targets: header, className: "show-logo-header" }
        }
      });
    }
    const mediaSize = {
      desktop: "only screen and (min-width: 1025.1px)",
      mobile: "only screen and (max-width: 1025px)",
      tablet: "only screen and (min-width: 767.98px) and (max-width: 1025px)",
      tabletPortrait: "only screen and (min-width: 767.98px) and (orientation: portrait) and (max-width: 1025px)",
      tabletLandscape: "only screen and (min-width: 767.98px) and (orientation: landscape)  and (max-width: 1025px)",
      phone: "only screen and (max-width: 767.98px)",
      phonePortrait: "only screen and (max-width: 767.98px) and (orientation: portrait) ",
      landscape: "only screen and (max-width: 768px) and (max-height: 550px) and (orientation: landscape) and (min-width:420px)",
      landscapeX: "only screen and (min-width: 768px) and (max-width: 1025px) and (max-height: 550px) and (orientation: landscape)"
    };
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1, ScrollSmoother, Power3);
    function timelineLogoAnimationDesktop() {
      let mm = gsapWithCSS$1.matchMedia();
      let animationLogo = document.querySelector(".animation-spacer .animation-wrapper-logo");

      console.log("animationLogo", animationLogo);
      
      gsapWithCSS$1.set(animationLogo, { clearProps: "transform,opacity" });
      mm.add(`${mediaSize.desktop}`, () => {
        let tl2 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-1 .column-1 .wrapper-img",
            start: () => "200px bottom-=200px",
            end: "top top",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl2.fromTo(animationLogo, { scale: "1", autoAlpha: 0.4 }, { scale: "2.3", autoAlpha: 0.05, duration: 1, immediateRender: false }).fromTo(".section-presentation .container-1 .column-1 .wrapper-img .content-img", { translateY: "0" }, { translateY: "15rem", duration: 1 }, "<").fromTo(".section-presentation .bg-white .bg", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .container-img .media", { scale: "1" }, { scale: "1.5", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .blur-mask", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .chat-message", { autoAlpha: 0, translateY: "10vh" }, { autoAlpha: 1, translateY: "0", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .play", { scale: "0", autoAlpha: 0 }, { scale: "1", autoAlpha: 1, duration: 0.8 }, "-=0.8");
        let tl3 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2",
            start: "top 70%",
            end: "25% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl3.to(animationLogo, { scale: ".5", autoAlpha: 1, translateY: "-5vh", immediateRender: false });
        let tl4 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "top 70%",
            end: "25% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl4.to(animationLogo, { translateY: "5vh", immediateRender: false });
        let tlOpacity = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "10% 70%",
            end: "40% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlOpacity.to(animationLogo, { scale: ".3", opacity: 0.2, immediateRender: false }).to(animationLogo, { scale: ".5", opacity: 1, immediateRender: false });
        let tlLines = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: ".section-presentation .container-2 .wrapper-column-sticky",
            pinSpacing: false,
            pinType: "transform",
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlLines.fromTo(".section-presentation .container-line-1", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-2", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-3", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-4", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-5", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 });
        let tlFeatures = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-features .row",
            start: "top 70%",
            end: "bottom bottom",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlFeatures.fromTo(".section-features .list-item-1", { translateY: "5vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-features .list-item-2", { translateY: "5vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-features .list-item-3", { translateY: "5vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-features .list-item-4", { translateY: "5vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-features .list-item-5", { translateY: "5vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 });
        let tlWaitlistFooter = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-waitlist",
            start: "bottom bottom",
            end: "bottom 70%",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlWaitlistFooter.fromTo(".section-waitlist .container-btn", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }).fromTo(".section-waitlist .container-text", { translateY: "0" }, { translateY: "-5.5vh", duration: 0.3 }, "<");
        gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-waitlist",
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
            pin: true,
            pinSpacing: false,
            pinType: "transform",
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
      });
    }
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1, ScrollSmoother, Power3);
    function timelineLogoAnimationMobile() {
      let mm = gsapWithCSS$1.matchMedia();
      let animationLogo = document.querySelector(".animation-spacer .animation-wrapper-logo");
      let animationLogoPlaceholder = document.querySelector(".animation-spacer .animation-placeholder-center");
      gsapWithCSS$1.set(animationLogo, { clearProps: "transform, opacity" });
      gsapWithCSS$1.set(animationLogoPlaceholder, { clearProps: "transform, opacity" });
      let topFromTl2;
      let tl2start;
      let tl2end;
      let tl3start;
      let tl2Totl3scale;
      let tl3Totl4scale;
      mm.add(`${mediaSize.tablet}`, () => {
        tl2start = "-50% 70%";
        tl2end = "top 30%";
        tl3start = "5% 70%";
        tl3Totl4scale = "1.1";
      });
      mm.add(`${mediaSize.tabletPortrait}`, () => {
        topFromTl2 = "38rem";
        tl2Totl3scale = "2";
      });
      mm.add(`${mediaSize.tabletLandscape}`, () => {
        topFromTl2 = "23rem";
        tl2Totl3scale = "3";
      });
      mm.add(`${mediaSize.phone}`, () => {
        topFromTl2 = "38rem";
        tl2start = "-50% 200px";
        tl2end = "top top";
        tl3start = "top 70%";
        tl2Totl3scale = "3";
        tl3Totl4scale = "2";
      });
      mm.add(`${mediaSize.phone}`, () => {
        topFromTl2 = "20rem";
      });
      mm.add(`${mediaSize.phonePortrait}`, () => {
        tl3Totl4scale = "2";
      });
      mm.add(`${mediaSize.landscape}`, () => {
        tl3Totl4scale = "1.4";
      });
      mm.add(`${mediaSize.landscapeX}`, () => {
        tl3Totl4scale = "1.4";
        topFromTl2 = "18.5rem";
      });
      mm.add(`${mediaSize.landscape}`, () => {
        topFromTl2 = "16rem";
      });
      mm.add(`${mediaSize.mobile}`, () => {
        let tl2 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-1 .column-1 .wrapper-img",
            start: tl2start,
            end: tl2end,
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl2.fromTo(animationLogo, { scale: "1", autoAlpha: 1 }, { scale: tl2Totl3scale, autoAlpha: 0.05, duration: 1, immediateRender: false }).fromTo(".animation-placeholder-center", { top: topFromTl2 }, { top: "50%", duration: 1, immediateRender: false }, "<").fromTo(".section-presentation .container-1 .column-1 .wrapper-img .content-img", { translateY: "0" }, { translateY: "15rem", duration: 1 }, "<").fromTo(".section-presentation .bg-white .bg", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .container-img .media", { scale: "1" }, { scale: "1.5", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .blur-mask", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .chat-message", { autoAlpha: 0, translateY: "10vh" }, { autoAlpha: 1, translateY: "0", duration: 0.8 }, "-=0.8").fromTo(".section-presentation .wrapper-img .play", { scale: "0", autoAlpha: 0 }, { scale: "1", autoAlpha: 1, duration: 0.8 }, "-=0.8");
        let tl3 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2",
            start: tl3start,
            end: "25% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl3.fromTo(animationLogo, { scale: tl2Totl3scale, autoAlpha: 0.05, translateY: "0" }, { scale: tl3Totl4scale, autoAlpha: 1, translateY: "-5vh", immediateRender: false });
        let tl4 = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "top 70%",
            end: "25% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tl4.fromTo(animationLogo, { translateY: "-5vh" }, { translateY: "5vh", immediateRender: false });
        let tlOpacity = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "10% 70%",
            end: "40% center",
            scrub: true,
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlOpacity.fromTo(animationLogo, { scale: tl3Totl4scale, opacity: 1 }, { scale: "1", opacity: 0.2, immediateRender: false }).to(animationLogo, { scale: tl3Totl4scale, opacity: 1, immediateRender: false });
        let tlLines = gsapWithCSS$1.timeline({
          scrollTrigger: {
            trigger: ".section-presentation .container-2 .column-1",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: ".section-presentation .container-2 .wrapper-column-sticky",
            pinSpacing: false,
            pinType: "fixed",
            markers: false,
            anticipatePin: true,
            invalidateOnRefresh: true
          }
        });
        tlLines.fromTo(".section-presentation .container-line-1", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-2", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-3", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-4", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 }).fromTo(".section-presentation .container-line-5", { translateY: "10vh", autoAlpha: 0 }, { translateY: "0", autoAlpha: 1 });
      });
      window.addEventListener("orientationchange", function () {
        ScrollTrigger$1.refresh();
      });
    }
    function videoPlayer() {
      const video = document.querySelector(".video-player");
      const player = new Plyr(video, {
        controls: ["play-large", "play", "progress", "mute", "fullscreen"],
        settings: ["quality", "speed"],
        autoplay: false,
        fullscreen: { iosNative: true },
        clickToPlay: true,
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
        vimeo: {
          sidedock: 0,
          controls: 0
        }
      });
      const wrapperVideo = document.querySelector(".container-video-player");
      const btnCloseVideo = wrapperVideo.querySelector(".btn-close-video");
      const btnOpenVideo = wrapperVideo.querySelector(".btn-open-video");
      video.video = player;
      btnOpenVideo.addEventListener("click", () => {
        wrapperVideo.addActive();
        player.play();
      });
      btnCloseVideo.addEventListener("click", () => {
        if (wrapperVideo.classList.contains("active")) {
          wrapperVideo.removeActive();
          setTimeout(() => {
            player.pause();
          }, 600);
        }
      });
      btnCloseVideo.addEventListener("click", function () {
        player.pause();
      });
      player.on("ended", () => {
        wrapperVideo.removeActive();
      });
    }
    const pageName = "home";
    function main() {
      timelineLogoAnimationDesktop();
      timelineLogoAnimationMobile();
      timelineHeader();
      videoPlayer();
    }
    const pgHome = new Page({
      pageName,
      main
    });
    function pages() {
      const pages2 = new PageController();
      pages2.add(pgHome);
      if (pages2.updateCurrent()) {
        pages2.runCurrent();
      }
    }
    function inputMoney(input) {
      input.addEventListener("keydown", (ev) => {
        const v = input.value;
        let p = input.selectionStart;
        if (ev.key === "Delete") {
          const toDel = input.value.charAt(input.selectionStart);
          if (toDel === "," || toDel === ".") {
            ev.preventDefault();
            input.value = v.slice(0, p) + v.slice(p + 2);
            input.setSelectionRange(p, p);
            formatInput();
          }
        }
        if (ev.key === "Backspace") {
          const toDel = input.value.charAt(input.selectionStart - 1);
          if (toDel === "," || toDel === ".") {
            ev.preventDefault();
            input.value = v.slice(0, p - 2) + v.slice(p);
            input.setSelectionRange(p - 2, p - 2);
            formatInput();
          }
        }
      });
      input.addEventListener("input", formatInput);
      function formatInput() {
        const negative = input.value.includes("-");
        const n = input.value.replace(/[^\d]/g, "").replace(/^0+/g, "");
        const l = n.length;
        let c = input.selectionStart - input.value.replace(/[^,.]/g, "").length;
        let newValue = "";
        if (l > 2) {
          let milhar = n.substr(0, l - 2);
          let decimal = "," + n.substr(l - 2, l);
          c++;
          let formatted = "";
          for (let i = 0; i < milhar.length; i++) {
            if ((milhar.length - i) % 3 === 0 && i != 0) {
              formatted += ".";
              c++;
            }
            formatted += milhar[i];
          }
          newValue = formatted + decimal;
        } else if (l == 1) {
          newValue = "0,0" + n;
          c += 3;
        } else if (l == 2) {
          newValue = "0," + n;
          c += 2;
        }
        if (negative) newValue = "-" + newValue;
        input.value = newValue;
        if (c < 0) c = 0;
        input.setSelectionRange(c, c);
      }
    }
    //! moment.js
    //! version : 2.30.1
    //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
    //! license : MIT
    //! momentjs.com
    var hookCallback;
    function hooks() {
      return hookCallback.apply(null, arguments);
    }
    function setHookCallback(callback) {
      hookCallback = callback;
    }
    function isArray(input) {
      return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
    }
    function isObject(input) {
      return input != null && Object.prototype.toString.call(input) === "[object Object]";
    }
    function hasOwnProp(a, b2) {
      return Object.prototype.hasOwnProperty.call(a, b2);
    }
    function isObjectEmpty(obj) {
      if (Object.getOwnPropertyNames) {
        return Object.getOwnPropertyNames(obj).length === 0;
      } else {
        var k;
        for (k in obj) {
          if (hasOwnProp(obj, k)) {
            return false;
          }
        }
        return true;
      }
    }
    function isUndefined(input) {
      return input === void 0;
    }
    function isNumber(input) {
      return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
    }
    function isDate(input) {
      return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
    }
    function map(arr, fn) {
      var res = [], i, arrLen = arr.length;
      for (i = 0; i < arrLen; ++i) {
        res.push(fn(arr[i], i));
      }
      return res;
    }
    function extend(a, b2) {
      for (var i in b2) {
        if (hasOwnProp(b2, i)) {
          a[i] = b2[i];
        }
      }
      if (hasOwnProp(b2, "toString")) {
        a.toString = b2.toString;
      }
      if (hasOwnProp(b2, "valueOf")) {
        a.valueOf = b2.valueOf;
      }
      return a;
    }
    function createUTC(input, format2, locale2, strict) {
      return createLocalOrUTC(input, format2, locale2, strict, true).utc();
    }
    function defaultParsingFlags() {
      return {
        empty: false,
        unusedTokens: [],
        unusedInput: [],
        overflow: -2,
        charsLeftOver: 0,
        nullInput: false,
        invalidEra: null,
        invalidMonth: null,
        invalidFormat: false,
        userInvalidated: false,
        iso: false,
        parsedDateParts: [],
        era: null,
        meridiem: null,
        rfc2822: false,
        weekdayMismatch: false
      };
    }
    function getParsingFlags(m) {
      if (m._pf == null) {
        m._pf = defaultParsingFlags();
      }
      return m._pf;
    }
    var some;
    if (Array.prototype.some) {
      some = Array.prototype.some;
    } else {
      some = function (fun) {
        var t = Object(this), len = t.length >>> 0, i;
        for (i = 0; i < len; i++) {
          if (i in t && fun.call(this, t[i], i, t)) {
            return true;
          }
        }
        return false;
      };
    }
    function isValid(m) {
      var flags = null, parsedParts = false, isNowValid = m._d && !isNaN(m._d.getTime());
      if (isNowValid) {
        flags = getParsingFlags(m);
        parsedParts = some.call(flags.parsedDateParts, function (i) {
          return i != null;
        });
        isNowValid = flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
        if (m._strict) {
          isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
        }
      }
      if (Object.isFrozen == null || !Object.isFrozen(m)) {
        m._isValid = isNowValid;
      } else {
        return isNowValid;
      }
      return m._isValid;
    }
    function createInvalid(flags) {
      var m = createUTC(NaN);
      if (flags != null) {
        extend(getParsingFlags(m), flags);
      } else {
        getParsingFlags(m).userInvalidated = true;
      }
      return m;
    }
    var momentProperties = hooks.momentProperties = [], updateInProgress = false;
    function copyConfig(to2, from2) {
      var i, prop, val, momentPropertiesLen = momentProperties.length;
      if (!isUndefined(from2._isAMomentObject)) {
        to2._isAMomentObject = from2._isAMomentObject;
      }
      if (!isUndefined(from2._i)) {
        to2._i = from2._i;
      }
      if (!isUndefined(from2._f)) {
        to2._f = from2._f;
      }
      if (!isUndefined(from2._l)) {
        to2._l = from2._l;
      }
      if (!isUndefined(from2._strict)) {
        to2._strict = from2._strict;
      }
      if (!isUndefined(from2._tzm)) {
        to2._tzm = from2._tzm;
      }
      if (!isUndefined(from2._isUTC)) {
        to2._isUTC = from2._isUTC;
      }
      if (!isUndefined(from2._offset)) {
        to2._offset = from2._offset;
      }
      if (!isUndefined(from2._pf)) {
        to2._pf = getParsingFlags(from2);
      }
      if (!isUndefined(from2._locale)) {
        to2._locale = from2._locale;
      }
      if (momentPropertiesLen > 0) {
        for (i = 0; i < momentPropertiesLen; i++) {
          prop = momentProperties[i];
          val = from2[prop];
          if (!isUndefined(val)) {
            to2[prop] = val;
          }
        }
      }
      return to2;
    }
    function Moment(config) {
      copyConfig(this, config);
      this._d = new Date(config._d != null ? config._d.getTime() : NaN);
      if (!this.isValid()) {
        this._d = /* @__PURE__ */ new Date(NaN);
      }
      if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
      }
    }
    function isMoment(obj) {
      return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
    }
    function warn(msg) {
      if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
        console.warn("Deprecation warning: " + msg);
      }
    }
    function deprecate(msg, fn) {
      var firstTime = true;
      return extend(function () {
        if (hooks.deprecationHandler != null) {
          hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
          var args = [], arg, i, key, argLen = arguments.length;
          for (i = 0; i < argLen; i++) {
            arg = "";
            if (typeof arguments[i] === "object") {
              arg += "\n[" + i + "] ";
              for (key in arguments[0]) {
                if (hasOwnProp(arguments[0], key)) {
                  arg += key + ": " + arguments[0][key] + ", ";
                }
              }
              arg = arg.slice(0, -2);
            } else {
              arg = arguments[i];
            }
            args.push(arg);
          }
          warn(
            msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
          );
          firstTime = false;
        }
        return fn.apply(this, arguments);
      }, fn);
    }
    var deprecations = {};
    function deprecateSimple(name, msg) {
      if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
      }
      if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
      }
    }
    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;
    function isFunction(input) {
      return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
    }
    function set(config) {
      var prop, i;
      for (i in config) {
        if (hasOwnProp(config, i)) {
          prop = config[i];
          if (isFunction(prop)) {
            this[i] = prop;
          } else {
            this["_" + i] = prop;
          }
        }
      }
      this._config = config;
      this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
      );
    }
    function mergeConfigs(parentConfig, childConfig) {
      var res = extend({}, parentConfig), prop;
      for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
          if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
            res[prop] = {};
            extend(res[prop], parentConfig[prop]);
            extend(res[prop], childConfig[prop]);
          } else if (childConfig[prop] != null) {
            res[prop] = childConfig[prop];
          } else {
            delete res[prop];
          }
        }
      }
      for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
          res[prop] = extend({}, res[prop]);
        }
      }
      return res;
    }
    function Locale(config) {
      if (config != null) {
        this.set(config);
      }
    }
    var keys;
    if (Object.keys) {
      keys = Object.keys;
    } else {
      keys = function (obj) {
        var i, res = [];
        for (i in obj) {
          if (hasOwnProp(obj, i)) {
            res.push(i);
          }
        }
        return res;
      };
    }
    var defaultCalendar = {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    };
    function calendar(key, mom, now2) {
      var output = this._calendar[key] || this._calendar["sameElse"];
      return isFunction(output) ? output.call(mom, now2) : output;
    }
    function zeroFill(number, targetLength, forceSign) {
      var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
      return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }
    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
    function addFormatToken(token2, padded, ordinal2, callback) {
      var func = callback;
      if (typeof callback === "string") {
        func = function () {
          return this[callback]();
        };
      }
      if (token2) {
        formatTokenFunctions[token2] = func;
      }
      if (padded) {
        formatTokenFunctions[padded[0]] = function () {
          return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
      }
      if (ordinal2) {
        formatTokenFunctions[ordinal2] = function () {
          return this.localeData().ordinal(
            func.apply(this, arguments),
            token2
          );
        };
      }
    }
    function removeFormattingTokens(input) {
      if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, "");
      }
      return input.replace(/\\/g, "");
    }
    function makeFormatFunction(format2) {
      var array = format2.match(formattingTokens), i, length;
      for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
          array[i] = formatTokenFunctions[array[i]];
        } else {
          array[i] = removeFormattingTokens(array[i]);
        }
      }
      return function (mom) {
        var output = "", i2;
        for (i2 = 0; i2 < length; i2++) {
          output += isFunction(array[i2]) ? array[i2].call(mom, format2) : array[i2];
        }
        return output;
      };
    }
    function formatMoment(m, format2) {
      if (!m.isValid()) {
        return m.localeData().invalidDate();
      }
      format2 = expandFormat(format2, m.localeData());
      formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
      return formatFunctions[format2](m);
    }
    function expandFormat(format2, locale2) {
      var i = 5;
      function replaceLongDateFormatTokens(input) {
        return locale2.longDateFormat(input) || input;
      }
      localFormattingTokens.lastIndex = 0;
      while (i >= 0 && localFormattingTokens.test(format2)) {
        format2 = format2.replace(
          localFormattingTokens,
          replaceLongDateFormatTokens
        );
        localFormattingTokens.lastIndex = 0;
        i -= 1;
      }
      return format2;
    }
    var defaultLongDateFormat = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function longDateFormat(key) {
      var format2 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
      if (format2 || !formatUpper) {
        return format2;
      }
      this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function (tok) {
        if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
          return tok.slice(1);
        }
        return tok;
      }).join("");
      return this._longDateFormat[key];
    }
    var defaultInvalidDate = "Invalid date";
    function invalidDate() {
      return this._invalidDate;
    }
    var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
    function ordinal(number) {
      return this._ordinal.replace("%d", number);
    }
    var defaultRelativeTime = {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    };
    function relativeTime(number, withoutSuffix, string, isFuture) {
      var output = this._relativeTime[string];
      return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }
    function pastFuture(diff2, output) {
      var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
      return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
    }
    var aliases = {
      D: "date",
      dates: "date",
      date: "date",
      d: "day",
      days: "day",
      day: "day",
      e: "weekday",
      weekdays: "weekday",
      weekday: "weekday",
      E: "isoWeekday",
      isoweekdays: "isoWeekday",
      isoweekday: "isoWeekday",
      DDD: "dayOfYear",
      dayofyears: "dayOfYear",
      dayofyear: "dayOfYear",
      h: "hour",
      hours: "hour",
      hour: "hour",
      ms: "millisecond",
      milliseconds: "millisecond",
      millisecond: "millisecond",
      m: "minute",
      minutes: "minute",
      minute: "minute",
      M: "month",
      months: "month",
      month: "month",
      Q: "quarter",
      quarters: "quarter",
      quarter: "quarter",
      s: "second",
      seconds: "second",
      second: "second",
      gg: "weekYear",
      weekyears: "weekYear",
      weekyear: "weekYear",
      GG: "isoWeekYear",
      isoweekyears: "isoWeekYear",
      isoweekyear: "isoWeekYear",
      w: "week",
      weeks: "week",
      week: "week",
      W: "isoWeek",
      isoweeks: "isoWeek",
      isoweek: "isoWeek",
      y: "year",
      years: "year",
      year: "year"
    };
    function normalizeUnits(units) {
      return typeof units === "string" ? aliases[units] || aliases[units.toLowerCase()] : void 0;
    }
    function normalizeObjectUnits(inputObject) {
      var normalizedInput = {}, normalizedProp, prop;
      for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
          normalizedProp = normalizeUnits(prop);
          if (normalizedProp) {
            normalizedInput[normalizedProp] = inputObject[prop];
          }
        }
      }
      return normalizedInput;
    }
    var priorities = {
      date: 9,
      day: 11,
      weekday: 11,
      isoWeekday: 11,
      dayOfYear: 4,
      hour: 13,
      millisecond: 16,
      minute: 14,
      month: 8,
      quarter: 7,
      second: 15,
      weekYear: 1,
      isoWeekYear: 1,
      week: 5,
      isoWeek: 5,
      year: 1
    };
    function getPrioritizedUnits(unitsObj) {
      var units = [], u;
      for (u in unitsObj) {
        if (hasOwnProp(unitsObj, u)) {
          units.push({ unit: u, priority: priorities[u] });
        }
      }
      units.sort(function (a, b2) {
        return a.priority - b2.priority;
      });
      return units;
    }
    var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, match1to2NoLeadingZero = /^[1-9]\d?/, match1to2HasZero = /^([1-9]\d|\d)/, regexes;
    regexes = {};
    function addRegexToken(token2, regex, strictRegex) {
      regexes[token2] = isFunction(regex) ? regex : function (isStrict, localeData2) {
        return isStrict && strictRegex ? strictRegex : regex;
      };
    }
    function getParseRegexForToken(token2, config) {
      if (!hasOwnProp(regexes, token2)) {
        return new RegExp(unescapeFormat(token2));
      }
      return regexes[token2](config._strict, config._locale);
    }
    function unescapeFormat(s) {
      return regexEscape(
        s.replace("\\", "").replace(
          /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
          function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
          }
        )
      );
    }
    function regexEscape(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function absFloor(number) {
      if (number < 0) {
        return Math.ceil(number) || 0;
      } else {
        return Math.floor(number);
      }
    }
    function toInt(argumentForCoercion) {
      var coercedNumber = +argumentForCoercion, value = 0;
      if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
      }
      return value;
    }
    var tokens = {};
    function addParseToken(token2, callback) {
      var i, func = callback, tokenLen;
      if (typeof token2 === "string") {
        token2 = [token2];
      }
      if (isNumber(callback)) {
        func = function (input, array) {
          array[callback] = toInt(input);
        };
      }
      tokenLen = token2.length;
      for (i = 0; i < tokenLen; i++) {
        tokens[token2[i]] = func;
      }
    }
    function addWeekParseToken(token2, callback) {
      addParseToken(token2, function (input, array, config, token3) {
        config._w = config._w || {};
        callback(input, config._w, config, token3);
      });
    }
    function addTimeToArrayFromToken(token2, input, config) {
      if (input != null && hasOwnProp(tokens, token2)) {
        tokens[token2](input, config._a, config, token2);
      }
    }
    function isLeapYear(year) {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }
    var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
    addFormatToken("Y", 0, 0, function () {
      var y = this.year();
      return y <= 9999 ? zeroFill(y, 4) : "+" + y;
    });
    addFormatToken(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    });
    addFormatToken(0, ["YYYY", 4], 0, "year");
    addFormatToken(0, ["YYYYY", 5], 0, "year");
    addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
    addRegexToken("Y", matchSigned);
    addRegexToken("YY", match1to2, match2);
    addRegexToken("YYYY", match1to4, match4);
    addRegexToken("YYYYY", match1to6, match6);
    addRegexToken("YYYYYY", match1to6, match6);
    addParseToken(["YYYYY", "YYYYYY"], YEAR);
    addParseToken("YYYY", function (input, array) {
      array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken("YY", function (input, array) {
      array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken("Y", function (input, array) {
      array[YEAR] = parseInt(input, 10);
    });
    function daysInYear(year) {
      return isLeapYear(year) ? 366 : 365;
    }
    hooks.parseTwoDigitYear = function (input) {
      return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
    };
    var getSetYear = makeGetSet("FullYear", true);
    function getIsLeapYear() {
      return isLeapYear(this.year());
    }
    function makeGetSet(unit, keepTime) {
      return function (value) {
        if (value != null) {
          set$1(this, unit, value);
          hooks.updateOffset(this, keepTime);
          return this;
        } else {
          return get(this, unit);
        }
      };
    }
    function get(mom, unit) {
      if (!mom.isValid()) {
        return NaN;
      }
      var d = mom._d, isUTC = mom._isUTC;
      switch (unit) {
        case "Milliseconds":
          return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
        case "Seconds":
          return isUTC ? d.getUTCSeconds() : d.getSeconds();
        case "Minutes":
          return isUTC ? d.getUTCMinutes() : d.getMinutes();
        case "Hours":
          return isUTC ? d.getUTCHours() : d.getHours();
        case "Date":
          return isUTC ? d.getUTCDate() : d.getDate();
        case "Day":
          return isUTC ? d.getUTCDay() : d.getDay();
        case "Month":
          return isUTC ? d.getUTCMonth() : d.getMonth();
        case "FullYear":
          return isUTC ? d.getUTCFullYear() : d.getFullYear();
        default:
          return NaN;
      }
    }
    function set$1(mom, unit, value) {
      var d, isUTC, year, month, date;
      if (!mom.isValid() || isNaN(value)) {
        return;
      }
      d = mom._d;
      isUTC = mom._isUTC;
      switch (unit) {
        case "Milliseconds":
          return void (isUTC ? d.setUTCMilliseconds(value) : d.setMilliseconds(value));
        case "Seconds":
          return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
        case "Minutes":
          return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
        case "Hours":
          return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
        case "Date":
          return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
        // case 'Day': // Not real
        //    return void (isUTC ? d.setUTCDay(value) : d.setDay(value));
        // case 'Month': // Not used because we need to pass two variables
        //     return void (isUTC ? d.setUTCMonth(value) : d.setMonth(value));
        case "FullYear":
          break;
        // See below ...
        default:
          return;
      }
      year = value;
      month = mom.month();
      date = mom.date();
      date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;
      void (isUTC ? d.setUTCFullYear(year, month, date) : d.setFullYear(year, month, date));
    }
    function stringGet(units) {
      units = normalizeUnits(units);
      if (isFunction(this[units])) {
        return this[units]();
      }
      return this;
    }
    function stringSet(units, value) {
      if (typeof units === "object") {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units), i, prioritizedLen = prioritized.length;
        for (i = 0; i < prioritizedLen; i++) {
          this[prioritized[i].unit](units[prioritized[i].unit]);
        }
      } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
          return this[units](value);
        }
      }
      return this;
    }
    function mod(n, x) {
      return (n % x + x) % x;
    }
    var indexOf;
    if (Array.prototype.indexOf) {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function (o) {
        var i;
        for (i = 0; i < this.length; ++i) {
          if (this[i] === o) {
            return i;
          }
        }
        return -1;
      };
    }
    function daysInMonth(year, month) {
      if (isNaN(year) || isNaN(month)) {
        return NaN;
      }
      var modMonth = mod(month, 12);
      year += (month - modMonth) / 12;
      return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
    }
    addFormatToken("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    });
    addFormatToken("MMM", 0, 0, function (format2) {
      return this.localeData().monthsShort(this, format2);
    });
    addFormatToken("MMMM", 0, 0, function (format2) {
      return this.localeData().months(this, format2);
    });
    addRegexToken("M", match1to2, match1to2NoLeadingZero);
    addRegexToken("MM", match1to2, match2);
    addRegexToken("MMM", function (isStrict, locale2) {
      return locale2.monthsShortRegex(isStrict);
    });
    addRegexToken("MMMM", function (isStrict, locale2) {
      return locale2.monthsRegex(isStrict);
    });
    addParseToken(["M", "MM"], function (input, array) {
      array[MONTH] = toInt(input) - 1;
    });
    addParseToken(["MMM", "MMMM"], function (input, array, config, token2) {
      var month = config._locale.monthsParse(input, token2, config._strict);
      if (month != null) {
        array[MONTH] = month;
      } else {
        getParsingFlags(config).invalidMonth = input;
      }
    });
    var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
      "_"
    ), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
    function localeMonths(m, format2) {
      if (!m) {
        return isArray(this._months) ? this._months : this._months["standalone"];
      }
      return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m.month()];
    }
    function localeMonthsShort(m, format2) {
      if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
      }
      return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m.month()];
    }
    function handleStrictParse(monthName, format2, strict) {
      var i, ii, mom, llc = monthName.toLocaleLowerCase();
      if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
          mom = createUTC([2e3, i]);
          this._shortMonthsParse[i] = this.monthsShort(
            mom,
            ""
          ).toLocaleLowerCase();
          this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
        }
      }
      if (strict) {
        if (format2 === "MMM") {
          ii = indexOf.call(this._shortMonthsParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._longMonthsParse, llc);
          return ii !== -1 ? ii : null;
        }
      } else {
        if (format2 === "MMM") {
          ii = indexOf.call(this._shortMonthsParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._longMonthsParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._longMonthsParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortMonthsParse, llc);
          return ii !== -1 ? ii : null;
        }
      }
    }
    function localeMonthsParse(monthName, format2, strict) {
      var i, mom, regex;
      if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format2, strict);
      }
      if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
      }
      for (i = 0; i < 12; i++) {
        mom = createUTC([2e3, i]);
        if (strict && !this._longMonthsParse[i]) {
          this._longMonthsParse[i] = new RegExp(
            "^" + this.months(mom, "").replace(".", "") + "$",
            "i"
          );
          this._shortMonthsParse[i] = new RegExp(
            "^" + this.monthsShort(mom, "").replace(".", "") + "$",
            "i"
          );
        }
        if (!strict && !this._monthsParse[i]) {
          regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
          this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
        }
        if (strict && format2 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
          return i;
        } else if (strict && format2 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
          return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
          return i;
        }
      }
    }
    function setMonth(mom, value) {
      if (!mom.isValid()) {
        return mom;
      }
      if (typeof value === "string") {
        if (/^\d+$/.test(value)) {
          value = toInt(value);
        } else {
          value = mom.localeData().monthsParse(value);
          if (!isNumber(value)) {
            return mom;
          }
        }
      }
      var month = value, date = mom.date();
      date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
      void (mom._isUTC ? mom._d.setUTCMonth(month, date) : mom._d.setMonth(month, date));
      return mom;
    }
    function getSetMonth(value) {
      if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
      } else {
        return get(this, "Month");
      }
    }
    function getDaysInMonth() {
      return daysInMonth(this.year(), this.month());
    }
    function monthsShortRegex(isStrict) {
      if (this._monthsParseExact) {
        if (!hasOwnProp(this, "_monthsRegex")) {
          computeMonthsParse.call(this);
        }
        if (isStrict) {
          return this._monthsShortStrictRegex;
        } else {
          return this._monthsShortRegex;
        }
      } else {
        if (!hasOwnProp(this, "_monthsShortRegex")) {
          this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
      }
    }
    function monthsRegex(isStrict) {
      if (this._monthsParseExact) {
        if (!hasOwnProp(this, "_monthsRegex")) {
          computeMonthsParse.call(this);
        }
        if (isStrict) {
          return this._monthsStrictRegex;
        } else {
          return this._monthsRegex;
        }
      } else {
        if (!hasOwnProp(this, "_monthsRegex")) {
          this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
      }
    }
    function computeMonthsParse() {
      function cmpLenRev(a, b2) {
        return b2.length - a.length;
      }
      var shortPieces = [], longPieces = [], mixedPieces = [], i, mom, shortP, longP;
      for (i = 0; i < 12; i++) {
        mom = createUTC([2e3, i]);
        shortP = regexEscape(this.monthsShort(mom, ""));
        longP = regexEscape(this.months(mom, ""));
        shortPieces.push(shortP);
        longPieces.push(longP);
        mixedPieces.push(longP);
        mixedPieces.push(shortP);
      }
      shortPieces.sort(cmpLenRev);
      longPieces.sort(cmpLenRev);
      mixedPieces.sort(cmpLenRev);
      this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._monthsShortRegex = this._monthsRegex;
      this._monthsStrictRegex = new RegExp(
        "^(" + longPieces.join("|") + ")",
        "i"
      );
      this._monthsShortStrictRegex = new RegExp(
        "^(" + shortPieces.join("|") + ")",
        "i"
      );
    }
    function createDate(y, m, d, h, M, s, ms) {
      var date;
      if (y < 100 && y >= 0) {
        date = new Date(y + 400, m, d, h, M, s, ms);
        if (isFinite(date.getFullYear())) {
          date.setFullYear(y);
        }
      } else {
        date = new Date(y, m, d, h, M, s, ms);
      }
      return date;
    }
    function createUTCDate(y) {
      var date, args;
      if (y < 100 && y >= 0) {
        args = Array.prototype.slice.call(arguments);
        args[0] = y + 400;
        date = new Date(Date.UTC.apply(null, args));
        if (isFinite(date.getUTCFullYear())) {
          date.setUTCFullYear(y);
        }
      } else {
        date = new Date(Date.UTC.apply(null, arguments));
      }
      return date;
    }
    function firstWeekOffset(year, dow, doy) {
      var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
      return -fwdlw + fwd - 1;
    }
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
      var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
      if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
      } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
      } else {
        resYear = year;
        resDayOfYear = dayOfYear;
      }
      return {
        year: resYear,
        dayOfYear: resDayOfYear
      };
    }
    function weekOfYear(mom, dow, doy) {
      var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
      if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
      } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
      } else {
        resYear = mom.year();
        resWeek = week;
      }
      return {
        week: resWeek,
        year: resYear
      };
    }
    function weeksInYear(year, dow, doy) {
      var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
      return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }
    addFormatToken("w", ["ww", 2], "wo", "week");
    addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
    addRegexToken("w", match1to2, match1to2NoLeadingZero);
    addRegexToken("ww", match1to2, match2);
    addRegexToken("W", match1to2, match1to2NoLeadingZero);
    addRegexToken("WW", match1to2, match2);
    addWeekParseToken(
      ["w", "ww", "W", "WW"],
      function (input, week, config, token2) {
        week[token2.substr(0, 1)] = toInt(input);
      }
    );
    function localeWeek(mom) {
      return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }
    var defaultLocaleWeek = {
      dow: 0,
      // Sunday is the first day of the week.
      doy: 6
      // The week that contains Jan 6th is the first week of the year.
    };
    function localeFirstDayOfWeek() {
      return this._week.dow;
    }
    function localeFirstDayOfYear() {
      return this._week.doy;
    }
    function getSetWeek(input) {
      var week = this.localeData().week(this);
      return input == null ? week : this.add((input - week) * 7, "d");
    }
    function getSetISOWeek(input) {
      var week = weekOfYear(this, 1, 4).week;
      return input == null ? week : this.add((input - week) * 7, "d");
    }
    addFormatToken("d", 0, "do", "day");
    addFormatToken("dd", 0, 0, function (format2) {
      return this.localeData().weekdaysMin(this, format2);
    });
    addFormatToken("ddd", 0, 0, function (format2) {
      return this.localeData().weekdaysShort(this, format2);
    });
    addFormatToken("dddd", 0, 0, function (format2) {
      return this.localeData().weekdays(this, format2);
    });
    addFormatToken("e", 0, 0, "weekday");
    addFormatToken("E", 0, 0, "isoWeekday");
    addRegexToken("d", match1to2);
    addRegexToken("e", match1to2);
    addRegexToken("E", match1to2);
    addRegexToken("dd", function (isStrict, locale2) {
      return locale2.weekdaysMinRegex(isStrict);
    });
    addRegexToken("ddd", function (isStrict, locale2) {
      return locale2.weekdaysShortRegex(isStrict);
    });
    addRegexToken("dddd", function (isStrict, locale2) {
      return locale2.weekdaysRegex(isStrict);
    });
    addWeekParseToken(["dd", "ddd", "dddd"], function (input, week, config, token2) {
      var weekday = config._locale.weekdaysParse(input, token2, config._strict);
      if (weekday != null) {
        week.d = weekday;
      } else {
        getParsingFlags(config).invalidWeekday = input;
      }
    });
    addWeekParseToken(["d", "e", "E"], function (input, week, config, token2) {
      week[token2] = toInt(input);
    });
    function parseWeekday(input, locale2) {
      if (typeof input !== "string") {
        return input;
      }
      if (!isNaN(input)) {
        return parseInt(input, 10);
      }
      input = locale2.weekdaysParse(input);
      if (typeof input === "number") {
        return input;
      }
      return null;
    }
    function parseIsoWeekday(input, locale2) {
      if (typeof input === "string") {
        return locale2.weekdaysParse(input) % 7 || 7;
      }
      return isNaN(input) ? null : input;
    }
    function shiftWeekdays(ws, n) {
      return ws.slice(n, 7).concat(ws.slice(0, n));
    }
    var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
    function localeWeekdays(m, format2) {
      var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
      return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
    }
    function localeWeekdaysShort(m) {
      return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }
    function localeWeekdaysMin(m) {
      return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }
    function handleStrictParse$1(weekdayName, format2, strict) {
      var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
      if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];
        for (i = 0; i < 7; ++i) {
          mom = createUTC([2e3, 1]).day(i);
          this._minWeekdaysParse[i] = this.weekdaysMin(
            mom,
            ""
          ).toLocaleLowerCase();
          this._shortWeekdaysParse[i] = this.weekdaysShort(
            mom,
            ""
          ).toLocaleLowerCase();
          this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
        }
      }
      if (strict) {
        if (format2 === "dddd") {
          ii = indexOf.call(this._weekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else if (format2 === "ddd") {
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        }
      } else {
        if (format2 === "dddd") {
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else if (format2 === "ddd") {
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        } else {
          ii = indexOf.call(this._minWeekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._weekdaysParse, llc);
          if (ii !== -1) {
            return ii;
          }
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          return ii !== -1 ? ii : null;
        }
      }
    }
    function localeWeekdaysParse(weekdayName, format2, strict) {
      var i, mom, regex;
      if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format2, strict);
      }
      if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
      }
      for (i = 0; i < 7; i++) {
        mom = createUTC([2e3, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
          this._fullWeekdaysParse[i] = new RegExp(
            "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
          this._shortWeekdaysParse[i] = new RegExp(
            "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
          this._minWeekdaysParse[i] = new RegExp(
            "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
            "i"
          );
        }
        if (!this._weekdaysParse[i]) {
          regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
          this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
        }
        if (strict && format2 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (strict && format2 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
          return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
          return i;
        }
      }
    }
    function getSetDayOfWeek(input) {
      if (!this.isValid()) {
        return input != null ? this : NaN;
      }
      var day = get(this, "Day");
      if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, "d");
      } else {
        return day;
      }
    }
    function getSetLocaleDayOfWeek(input) {
      if (!this.isValid()) {
        return input != null ? this : NaN;
      }
      var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return input == null ? weekday : this.add(input - weekday, "d");
    }
    function getSetISODayOfWeek(input) {
      if (!this.isValid()) {
        return input != null ? this : NaN;
      }
      if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
      } else {
        return this.day() || 7;
      }
    }
    function weekdaysRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysStrictRegex;
        } else {
          return this._weekdaysRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
      }
    }
    function weekdaysShortRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysShortStrictRegex;
        } else {
          return this._weekdaysShortRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysShortRegex")) {
          this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
      }
    }
    function weekdaysMinRegex(isStrict) {
      if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, "_weekdaysRegex")) {
          computeWeekdaysParse.call(this);
        }
        if (isStrict) {
          return this._weekdaysMinStrictRegex;
        } else {
          return this._weekdaysMinRegex;
        }
      } else {
        if (!hasOwnProp(this, "_weekdaysMinRegex")) {
          this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
      }
    }
    function computeWeekdaysParse() {
      function cmpLenRev(a, b2) {
        return b2.length - a.length;
      }
      var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
      for (i = 0; i < 7; i++) {
        mom = createUTC([2e3, 1]).day(i);
        minp = regexEscape(this.weekdaysMin(mom, ""));
        shortp = regexEscape(this.weekdaysShort(mom, ""));
        longp = regexEscape(this.weekdays(mom, ""));
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
      }
      minPieces.sort(cmpLenRev);
      shortPieces.sort(cmpLenRev);
      longPieces.sort(cmpLenRev);
      mixedPieces.sort(cmpLenRev);
      this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._weekdaysShortRegex = this._weekdaysRegex;
      this._weekdaysMinRegex = this._weekdaysRegex;
      this._weekdaysStrictRegex = new RegExp(
        "^(" + longPieces.join("|") + ")",
        "i"
      );
      this._weekdaysShortStrictRegex = new RegExp(
        "^(" + shortPieces.join("|") + ")",
        "i"
      );
      this._weekdaysMinStrictRegex = new RegExp(
        "^(" + minPieces.join("|") + ")",
        "i"
      );
    }
    function hFormat() {
      return this.hours() % 12 || 12;
    }
    function kFormat() {
      return this.hours() || 24;
    }
    addFormatToken("H", ["HH", 2], 0, "hour");
    addFormatToken("h", ["hh", 2], 0, hFormat);
    addFormatToken("k", ["kk", 2], 0, kFormat);
    addFormatToken("hmm", 0, 0, function () {
      return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });
    addFormatToken("hmmss", 0, 0, function () {
      return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });
    addFormatToken("Hmm", 0, 0, function () {
      return "" + this.hours() + zeroFill(this.minutes(), 2);
    });
    addFormatToken("Hmmss", 0, 0, function () {
      return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    });
    function meridiem(token2, lowercase) {
      addFormatToken(token2, 0, 0, function () {
        return this.localeData().meridiem(
          this.hours(),
          this.minutes(),
          lowercase
        );
      });
    }
    meridiem("a", true);
    meridiem("A", false);
    function matchMeridiem(isStrict, locale2) {
      return locale2._meridiemParse;
    }
    addRegexToken("a", matchMeridiem);
    addRegexToken("A", matchMeridiem);
    addRegexToken("H", match1to2, match1to2HasZero);
    addRegexToken("h", match1to2, match1to2NoLeadingZero);
    addRegexToken("k", match1to2, match1to2NoLeadingZero);
    addRegexToken("HH", match1to2, match2);
    addRegexToken("hh", match1to2, match2);
    addRegexToken("kk", match1to2, match2);
    addRegexToken("hmm", match3to4);
    addRegexToken("hmmss", match5to6);
    addRegexToken("Hmm", match3to4);
    addRegexToken("Hmmss", match5to6);
    addParseToken(["H", "HH"], HOUR);
    addParseToken(["k", "kk"], function (input, array, config) {
      var kInput = toInt(input);
      array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(["a", "A"], function (input, array, config) {
      config._isPm = config._locale.isPM(input);
      config._meridiem = input;
    });
    addParseToken(["h", "hh"], function (input, array, config) {
      array[HOUR] = toInt(input);
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("hmm", function (input, array, config) {
      var pos = input.length - 2;
      array[HOUR] = toInt(input.substr(0, pos));
      array[MINUTE] = toInt(input.substr(pos));
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("hmmss", function (input, array, config) {
      var pos1 = input.length - 4, pos2 = input.length - 2;
      array[HOUR] = toInt(input.substr(0, pos1));
      array[MINUTE] = toInt(input.substr(pos1, 2));
      array[SECOND] = toInt(input.substr(pos2));
      getParsingFlags(config).bigHour = true;
    });
    addParseToken("Hmm", function (input, array, config) {
      var pos = input.length - 2;
      array[HOUR] = toInt(input.substr(0, pos));
      array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken("Hmmss", function (input, array, config) {
      var pos1 = input.length - 4, pos2 = input.length - 2;
      array[HOUR] = toInt(input.substr(0, pos1));
      array[MINUTE] = toInt(input.substr(pos1, 2));
      array[SECOND] = toInt(input.substr(pos2));
    });
    function localeIsPM(input) {
      return (input + "").toLowerCase().charAt(0) === "p";
    }
    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
    function localeMeridiem(hours2, minutes2, isLower) {
      if (hours2 > 11) {
        return isLower ? "pm" : "PM";
      } else {
        return isLower ? "am" : "AM";
      }
    }
    var baseConfig = {
      calendar: defaultCalendar,
      longDateFormat: defaultLongDateFormat,
      invalidDate: defaultInvalidDate,
      ordinal: defaultOrdinal,
      dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
      relativeTime: defaultRelativeTime,
      months: defaultLocaleMonths,
      monthsShort: defaultLocaleMonthsShort,
      week: defaultLocaleWeek,
      weekdays: defaultLocaleWeekdays,
      weekdaysMin: defaultLocaleWeekdaysMin,
      weekdaysShort: defaultLocaleWeekdaysShort,
      meridiemParse: defaultLocaleMeridiemParse
    };
    var locales = {}, localeFamilies = {}, globalLocale;
    function commonPrefix(arr1, arr2) {
      var i, minl = Math.min(arr1.length, arr2.length);
      for (i = 0; i < minl; i += 1) {
        if (arr1[i] !== arr2[i]) {
          return i;
        }
      }
      return minl;
    }
    function normalizeLocale(key) {
      return key ? key.toLowerCase().replace("_", "-") : key;
    }
    function chooseLocale(names) {
      var i = 0, j, next, locale2, split;
      while (i < names.length) {
        split = normalizeLocale(names[i]).split("-");
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split("-") : null;
        while (j > 0) {
          locale2 = loadLocale(split.slice(0, j).join("-"));
          if (locale2) {
            return locale2;
          }
          if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
            break;
          }
          j--;
        }
        i++;
      }
      return globalLocale;
    }
    function isLocaleNameSane(name) {
      return !!(name && name.match("^[^/\\\\]*$"));
    }
    function loadLocale(name) {
      var oldLocale = null, aliasedRequire;
      if (locales[name] === void 0 && typeof module !== "undefined" && module && module.exports && isLocaleNameSane(name)) {
        try {
          oldLocale = globalLocale._abbr;
          aliasedRequire = require;
          aliasedRequire("./locale/" + name);
          getSetGlobalLocale(oldLocale);
        } catch (e) {
          locales[name] = null;
        }
      }
      return locales[name];
    }
    function getSetGlobalLocale(key, values) {
      var data;
      if (key) {
        if (isUndefined(values)) {
          data = getLocale(key);
        } else {
          data = defineLocale(key, values);
        }
        if (data) {
          globalLocale = data;
        } else {
          if (typeof console !== "undefined" && console.warn) {
            console.warn(
              "Locale " + key + " not found. Did you forget to load it?"
            );
          }
        }
      }
      return globalLocale._abbr;
    }
    function defineLocale(name, config) {
      if (config !== null) {
        var locale2, parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
          deprecateSimple(
            "defineLocaleOverride",
            "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
          );
          parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
          if (locales[config.parentLocale] != null) {
            parentConfig = locales[config.parentLocale]._config;
          } else {
            locale2 = loadLocale(config.parentLocale);
            if (locale2 != null) {
              parentConfig = locale2._config;
            } else {
              if (!localeFamilies[config.parentLocale]) {
                localeFamilies[config.parentLocale] = [];
              }
              localeFamilies[config.parentLocale].push({
                name,
                config
              });
              return null;
            }
          }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));
        if (localeFamilies[name]) {
          localeFamilies[name].forEach(function (x) {
            defineLocale(x.name, x.config);
          });
        }
        getSetGlobalLocale(name);
        return locales[name];
      } else {
        delete locales[name];
        return null;
      }
    }
    function updateLocale(name, config) {
      if (config != null) {
        var locale2, tmpLocale, parentConfig = baseConfig;
        if (locales[name] != null && locales[name].parentLocale != null) {
          locales[name].set(mergeConfigs(locales[name]._config, config));
        } else {
          tmpLocale = loadLocale(name);
          if (tmpLocale != null) {
            parentConfig = tmpLocale._config;
          }
          config = mergeConfigs(parentConfig, config);
          if (tmpLocale == null) {
            config.abbr = name;
          }
          locale2 = new Locale(config);
          locale2.parentLocale = locales[name];
          locales[name] = locale2;
        }
        getSetGlobalLocale(name);
      } else {
        if (locales[name] != null) {
          if (locales[name].parentLocale != null) {
            locales[name] = locales[name].parentLocale;
            if (name === getSetGlobalLocale()) {
              getSetGlobalLocale(name);
            }
          } else if (locales[name] != null) {
            delete locales[name];
          }
        }
      }
      return locales[name];
    }
    function getLocale(key) {
      var locale2;
      if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
      }
      if (!key) {
        return globalLocale;
      }
      if (!isArray(key)) {
        locale2 = loadLocale(key);
        if (locale2) {
          return locale2;
        }
        key = [key];
      }
      return chooseLocale(key);
    }
    function listLocales() {
      return keys(locales);
    }
    function checkOverflow(m) {
      var overflow, a = m._a;
      if (a && getParsingFlags(m).overflow === -2) {
        overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
          overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
          overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
          overflow = WEEKDAY;
        }
        getParsingFlags(m).overflow = overflow;
      }
      return m;
    }
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
      ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
      ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
      ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
      ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
      ["YYYY-DDD", /\d{4}-\d{3}/],
      ["YYYY-MM", /\d{4}-\d\d/, false],
      ["YYYYYYMMDD", /[+-]\d{10}/],
      ["YYYYMMDD", /\d{8}/],
      ["GGGG[W]WWE", /\d{4}W\d{3}/],
      ["GGGG[W]WW", /\d{4}W\d{2}/, false],
      ["YYYYDDD", /\d{7}/],
      ["YYYYMM", /\d{6}/, false],
      ["YYYY", /\d{4}/, false]
    ], isoTimes = [
      ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
      ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
      ["HH:mm:ss", /\d\d:\d\d:\d\d/],
      ["HH:mm", /\d\d:\d\d/],
      ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
      ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
      ["HHmmss", /\d\d\d\d\d\d/],
      ["HHmm", /\d\d\d\d/],
      ["HH", /\d\d/]
    ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
      UT: 0,
      GMT: 0,
      EDT: -4 * 60,
      EST: -5 * 60,
      CDT: -5 * 60,
      CST: -6 * 60,
      MDT: -6 * 60,
      MST: -7 * 60,
      PDT: -7 * 60,
      PST: -8 * 60
    };
    function configFromISO(config) {
      var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
      if (match) {
        getParsingFlags(config).iso = true;
        for (i = 0, l = isoDatesLen; i < l; i++) {
          if (isoDates[i][1].exec(match[1])) {
            dateFormat = isoDates[i][0];
            allowTime = isoDates[i][2] !== false;
            break;
          }
        }
        if (dateFormat == null) {
          config._isValid = false;
          return;
        }
        if (match[3]) {
          for (i = 0, l = isoTimesLen; i < l; i++) {
            if (isoTimes[i][1].exec(match[3])) {
              timeFormat = (match[2] || " ") + isoTimes[i][0];
              break;
            }
          }
          if (timeFormat == null) {
            config._isValid = false;
            return;
          }
        }
        if (!allowTime && timeFormat != null) {
          config._isValid = false;
          return;
        }
        if (match[4]) {
          if (tzRegex.exec(match[4])) {
            tzFormat = "Z";
          } else {
            config._isValid = false;
            return;
          }
        }
        config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
        configFromStringAndFormat(config);
      } else {
        config._isValid = false;
      }
    }
    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
      var result = [
        untruncateYear(yearStr),
        defaultLocaleMonthsShort.indexOf(monthStr),
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
      ];
      if (secondStr) {
        result.push(parseInt(secondStr, 10));
      }
      return result;
    }
    function untruncateYear(yearStr) {
      var year = parseInt(yearStr, 10);
      if (year <= 49) {
        return 2e3 + year;
      } else if (year <= 999) {
        return 1900 + year;
      }
      return year;
    }
    function preprocessRFC2822(s) {
      return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function checkWeekday(weekdayStr, parsedInput, config) {
      if (weekdayStr) {
        var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
          parsedInput[0],
          parsedInput[1],
          parsedInput[2]
        ).getDay();
        if (weekdayProvided !== weekdayActual) {
          getParsingFlags(config).weekdayMismatch = true;
          config._isValid = false;
          return false;
        }
      }
      return true;
    }
    function calculateOffset$1(obsOffset, militaryOffset, numOffset) {
      if (obsOffset) {
        return obsOffsets[obsOffset];
      } else if (militaryOffset) {
        return 0;
      } else {
        var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
        return h * 60 + m;
      }
    }
    function configFromRFC2822(config) {
      var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
      if (match) {
        parsedArray = extractFromRFC2822Strings(
          match[4],
          match[3],
          match[2],
          match[5],
          match[6],
          match[7]
        );
        if (!checkWeekday(match[1], parsedArray, config)) {
          return;
        }
        config._a = parsedArray;
        config._tzm = calculateOffset$1(match[8], match[9], match[10]);
        config._d = createUTCDate.apply(null, config._a);
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        getParsingFlags(config).rfc2822 = true;
      } else {
        config._isValid = false;
      }
    }
    function configFromString(config) {
      var matched = aspNetJsonRegex.exec(config._i);
      if (matched !== null) {
        config._d = /* @__PURE__ */ new Date(+matched[1]);
        return;
      }
      configFromISO(config);
      if (config._isValid === false) {
        delete config._isValid;
      } else {
        return;
      }
      configFromRFC2822(config);
      if (config._isValid === false) {
        delete config._isValid;
      } else {
        return;
      }
      if (config._strict) {
        config._isValid = false;
      } else {
        hooks.createFromInputFallback(config);
      }
    }
    hooks.createFromInputFallback = deprecate(
      "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
      function (config) {
        config._d = /* @__PURE__ */ new Date(config._i + (config._useUTC ? " UTC" : ""));
      }
    );
    function defaults(a, b2, c) {
      if (a != null) {
        return a;
      }
      if (b2 != null) {
        return b2;
      }
      return c;
    }
    function currentDateArray(config) {
      var nowValue = new Date(hooks.now());
      if (config._useUTC) {
        return [
          nowValue.getUTCFullYear(),
          nowValue.getUTCMonth(),
          nowValue.getUTCDate()
        ];
      }
      return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }
    function configFromArray(config) {
      var i, date, input = [], currentDate, expectedWeekday, yearToUse;
      if (config._d) {
        return;
      }
      currentDate = currentDateArray(config);
      if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
      }
      if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
          getParsingFlags(config)._overflowDayOfYear = true;
        }
        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
      }
      for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
      }
      for (; i < 7; i++) {
        config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
      }
      if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
      }
      config._d = (config._useUTC ? createUTCDate : createDate).apply(
        null,
        input
      );
      expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
      if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
      }
      if (config._nextDay) {
        config._a[HOUR] = 24;
      }
      if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
        getParsingFlags(config).weekdayMismatch = true;
      }
    }
    function dayOfYearFromWeekInfo(config) {
      var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
      w = config._w;
      if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;
        weekYear = defaults(
          w.GG,
          config._a[YEAR],
          weekOfYear(createLocal(), 1, 4).year
        );
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
          weekdayOverflow = true;
        }
      } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;
        curWeek = weekOfYear(createLocal(), dow, doy);
        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
        week = defaults(w.w, curWeek.week);
        if (w.d != null) {
          weekday = w.d;
          if (weekday < 0 || weekday > 6) {
            weekdayOverflow = true;
          }
        } else if (w.e != null) {
          weekday = w.e + dow;
          if (w.e < 0 || w.e > 6) {
            weekdayOverflow = true;
          }
        } else {
          weekday = dow;
        }
      }
      if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
      } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
      } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
      }
    }
    hooks.ISO_8601 = function () {
    };
    hooks.RFC_2822 = function () {
    };
    function configFromStringAndFormat(config) {
      if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
      }
      if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
      }
      config._a = [];
      getParsingFlags(config).empty = true;
      var string = "" + config._i, i, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
      tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
      tokenLen = tokens2.length;
      for (i = 0; i < tokenLen; i++) {
        token2 = tokens2[i];
        parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
        if (parsedInput) {
          skipped = string.substr(0, string.indexOf(parsedInput));
          if (skipped.length > 0) {
            getParsingFlags(config).unusedInput.push(skipped);
          }
          string = string.slice(
            string.indexOf(parsedInput) + parsedInput.length
          );
          totalParsedInputLength += parsedInput.length;
        }
        if (formatTokenFunctions[token2]) {
          if (parsedInput) {
            getParsingFlags(config).empty = false;
          } else {
            getParsingFlags(config).unusedTokens.push(token2);
          }
          addTimeToArrayFromToken(token2, parsedInput, config);
        } else if (config._strict && !parsedInput) {
          getParsingFlags(config).unusedTokens.push(token2);
        }
      }
      getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
      if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
      }
      if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = void 0;
      }
      getParsingFlags(config).parsedDateParts = config._a.slice(0);
      getParsingFlags(config).meridiem = config._meridiem;
      config._a[HOUR] = meridiemFixWrap(
        config._locale,
        config._a[HOUR],
        config._meridiem
      );
      era = getParsingFlags(config).era;
      if (era !== null) {
        config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
      }
      configFromArray(config);
      checkOverflow(config);
    }
    function meridiemFixWrap(locale2, hour, meridiem2) {
      var isPm;
      if (meridiem2 == null) {
        return hour;
      }
      if (locale2.meridiemHour != null) {
        return locale2.meridiemHour(hour, meridiem2);
      } else if (locale2.isPM != null) {
        isPm = locale2.isPM(meridiem2);
        if (isPm && hour < 12) {
          hour += 12;
        }
        if (!isPm && hour === 12) {
          hour = 0;
        }
        return hour;
      } else {
        return hour;
      }
    }
    function configFromStringAndArray(config) {
      var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
      if (configfLen === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = /* @__PURE__ */ new Date(NaN);
        return;
      }
      for (i = 0; i < configfLen; i++) {
        currentScore = 0;
        validFormatFound = false;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
          tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);
        if (isValid(tempConfig)) {
          validFormatFound = true;
        }
        currentScore += getParsingFlags(tempConfig).charsLeftOver;
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
        getParsingFlags(tempConfig).score = currentScore;
        if (!bestFormatIsValid) {
          if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
            if (validFormatFound) {
              bestFormatIsValid = true;
            }
          }
        } else {
          if (currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
          }
        }
      }
      extend(config, bestMoment || tempConfig);
    }
    function configFromObject(config) {
      if (config._d) {
        return;
      }
      var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
      config._a = map(
        [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
        function (obj) {
          return obj && parseInt(obj, 10);
        }
      );
      configFromArray(config);
    }
    function createFromConfig(config) {
      var res = new Moment(checkOverflow(prepareConfig(config)));
      if (res._nextDay) {
        res.add(1, "d");
        res._nextDay = void 0;
      }
      return res;
    }
    function prepareConfig(config) {
      var input = config._i, format2 = config._f;
      config._locale = config._locale || getLocale(config._l);
      if (input === null || format2 === void 0 && input === "") {
        return createInvalid({ nullInput: true });
      }
      if (typeof input === "string") {
        config._i = input = config._locale.preparse(input);
      }
      if (isMoment(input)) {
        return new Moment(checkOverflow(input));
      } else if (isDate(input)) {
        config._d = input;
      } else if (isArray(format2)) {
        configFromStringAndArray(config);
      } else if (format2) {
        configFromStringAndFormat(config);
      } else {
        configFromInput(config);
      }
      if (!isValid(config)) {
        config._d = null;
      }
      return config;
    }
    function configFromInput(config) {
      var input = config._i;
      if (isUndefined(input)) {
        config._d = new Date(hooks.now());
      } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
      } else if (typeof input === "string") {
        configFromString(config);
      } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
          return parseInt(obj, 10);
        });
        configFromArray(config);
      } else if (isObject(input)) {
        configFromObject(config);
      } else if (isNumber(input)) {
        config._d = new Date(input);
      } else {
        hooks.createFromInputFallback(config);
      }
    }
    function createLocalOrUTC(input, format2, locale2, strict, isUTC) {
      var c = {};
      if (format2 === true || format2 === false) {
        strict = format2;
        format2 = void 0;
      }
      if (locale2 === true || locale2 === false) {
        strict = locale2;
        locale2 = void 0;
      }
      if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
        input = void 0;
      }
      c._isAMomentObject = true;
      c._useUTC = c._isUTC = isUTC;
      c._l = locale2;
      c._i = input;
      c._f = format2;
      c._strict = strict;
      return createFromConfig(c);
    }
    function createLocal(input, format2, locale2, strict) {
      return createLocalOrUTC(input, format2, locale2, strict, false);
    }
    var prototypeMin = deprecate(
      "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
      function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other < this ? this : other;
        } else {
          return createInvalid();
        }
      }
    ), prototypeMax = deprecate(
      "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
      function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
          return other > this ? this : other;
        } else {
          return createInvalid();
        }
      }
    );
    function pickBy(fn, moments) {
      var res, i;
      if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
      }
      if (!moments.length) {
        return createLocal();
      }
      res = moments[0];
      for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
          res = moments[i];
        }
      }
      return res;
    }
    function min() {
      var args = [].slice.call(arguments, 0);
      return pickBy("isBefore", args);
    }
    function max() {
      var args = [].slice.call(arguments, 0);
      return pickBy("isAfter", args);
    }
    var now = function () {
      return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
    };
    var ordering = [
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second",
      "millisecond"
    ];
    function isDurationValid(m) {
      var key, unitHasDecimal = false, i, orderLen = ordering.length;
      for (key in m) {
        if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
          return false;
        }
      }
      for (i = 0; i < orderLen; ++i) {
        if (m[ordering[i]]) {
          if (unitHasDecimal) {
            return false;
          }
          if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
            unitHasDecimal = true;
          }
        }
      }
      return true;
    }
    function isValid$1() {
      return this._isValid;
    }
    function createInvalid$1() {
      return createDuration(NaN);
    }
    function Duration(duration) {
      var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
      this._isValid = isDurationValid(normalizedInput);
      this._milliseconds = +milliseconds2 + seconds2 * 1e3 + // 1000
        minutes2 * 6e4 + // 1000 * 60
        hours2 * 1e3 * 60 * 60;
      this._days = +days2 + weeks2 * 7;
      this._months = +months2 + quarters * 3 + years2 * 12;
      this._data = {};
      this._locale = getLocale();
      this._bubble();
    }
    function isDuration(obj) {
      return obj instanceof Duration;
    }
    function absRound(number) {
      if (number < 0) {
        return Math.round(-1 * number) * -1;
      } else {
        return Math.round(number);
      }
    }
    function compareArrays(array1, array2, dontConvert) {
      var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
      for (i = 0; i < len; i++) {
        if (toInt(array1[i]) !== toInt(array2[i])) {
          diffs++;
        }
      }
      return diffs + lengthDiff;
    }
    function offset(token2, separator) {
      addFormatToken(token2, 0, 0, function () {
        var offset2 = this.utcOffset(), sign2 = "+";
        if (offset2 < 0) {
          offset2 = -offset2;
          sign2 = "-";
        }
        return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
      });
    }
    offset("Z", ":");
    offset("ZZ", "");
    addRegexToken("Z", matchShortOffset);
    addRegexToken("ZZ", matchShortOffset);
    addParseToken(["Z", "ZZ"], function (input, array, config) {
      config._useUTC = true;
      config._tzm = offsetFromString(matchShortOffset, input);
    });
    var chunkOffset = /([\+\-]|\d\d)/gi;
    function offsetFromString(matcher, string) {
      var matches = (string || "").match(matcher), chunk, parts, minutes2;
      if (matches === null) {
        return null;
      }
      chunk = matches[matches.length - 1] || [];
      parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
      minutes2 = +(parts[1] * 60) + toInt(parts[2]);
      return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
    }
    function cloneWithOffset(input, model) {
      var res, diff2;
      if (model._isUTC) {
        res = model.clone();
        diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        res._d.setTime(res._d.valueOf() + diff2);
        hooks.updateOffset(res, false);
        return res;
      } else {
        return createLocal(input).local();
      }
    }
    function getDateOffset(m) {
      return -Math.round(m._d.getTimezoneOffset());
    }
    hooks.updateOffset = function () {
    };
    function getSetOffset(input, keepLocalTime, keepMinutes) {
      var offset2 = this._offset || 0, localAdjust;
      if (!this.isValid()) {
        return input != null ? this : NaN;
      }
      if (input != null) {
        if (typeof input === "string") {
          input = offsetFromString(matchShortOffset, input);
          if (input === null) {
            return this;
          }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
          input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
          localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
          this.add(localAdjust, "m");
        }
        if (offset2 !== input) {
          if (!keepLocalTime || this._changeInProgress) {
            addSubtract(
              this,
              createDuration(input - offset2, "m"),
              1,
              false
            );
          } else if (!this._changeInProgress) {
            this._changeInProgress = true;
            hooks.updateOffset(this, true);
            this._changeInProgress = null;
          }
        }
        return this;
      } else {
        return this._isUTC ? offset2 : getDateOffset(this);
      }
    }
    function getSetZone(input, keepLocalTime) {
      if (input != null) {
        if (typeof input !== "string") {
          input = -input;
        }
        this.utcOffset(input, keepLocalTime);
        return this;
      } else {
        return -this.utcOffset();
      }
    }
    function setOffsetToUTC(keepLocalTime) {
      return this.utcOffset(0, keepLocalTime);
    }
    function setOffsetToLocal(keepLocalTime) {
      if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;
        if (keepLocalTime) {
          this.subtract(getDateOffset(this), "m");
        }
      }
      return this;
    }
    function setOffsetToParsedOffset() {
      if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
      } else if (typeof this._i === "string") {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
          this.utcOffset(tZone);
        } else {
          this.utcOffset(0, true);
        }
      }
      return this;
    }
    function hasAlignedHourOffset(input) {
      if (!this.isValid()) {
        return false;
      }
      input = input ? createLocal(input).utcOffset() : 0;
      return (this.utcOffset() - input) % 60 === 0;
    }
    function isDaylightSavingTime() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function isDaylightSavingTimeShifted() {
      if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
      }
      var c = {}, other;
      copyConfig(c, this);
      c = prepareConfig(c);
      if (c._a) {
        other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
      } else {
        this._isDSTShifted = false;
      }
      return this._isDSTShifted;
    }
    function isLocal() {
      return this.isValid() ? !this._isUTC : false;
    }
    function isUtcOffset() {
      return this.isValid() ? this._isUTC : false;
    }
    function isUtc() {
      return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function createDuration(input, key) {
      var duration = input, match = null, sign2, ret, diffRes;
      if (isDuration(input)) {
        duration = {
          ms: input._milliseconds,
          d: input._days,
          M: input._months
        };
      } else if (isNumber(input) || !isNaN(+input)) {
        duration = {};
        if (key) {
          duration[key] = +input;
        } else {
          duration.milliseconds = +input;
        }
      } else if (match = aspNetRegex.exec(input)) {
        sign2 = match[1] === "-" ? -1 : 1;
        duration = {
          y: 0,
          d: toInt(match[DATE]) * sign2,
          h: toInt(match[HOUR]) * sign2,
          m: toInt(match[MINUTE]) * sign2,
          s: toInt(match[SECOND]) * sign2,
          ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
          // the millisecond decimal point is included in the match
        };
      } else if (match = isoRegex.exec(input)) {
        sign2 = match[1] === "-" ? -1 : 1;
        duration = {
          y: parseIso(match[2], sign2),
          M: parseIso(match[3], sign2),
          w: parseIso(match[4], sign2),
          d: parseIso(match[5], sign2),
          h: parseIso(match[6], sign2),
          m: parseIso(match[7], sign2),
          s: parseIso(match[8], sign2)
        };
      } else if (duration == null) {
        duration = {};
      } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
        diffRes = momentsDifference(
          createLocal(duration.from),
          createLocal(duration.to)
        );
        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
      }
      ret = new Duration(duration);
      if (isDuration(input) && hasOwnProp(input, "_locale")) {
        ret._locale = input._locale;
      }
      if (isDuration(input) && hasOwnProp(input, "_isValid")) {
        ret._isValid = input._isValid;
      }
      return ret;
    }
    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;
    function parseIso(inp, sign2) {
      var res = inp && parseFloat(inp.replace(",", "."));
      return (isNaN(res) ? 0 : res) * sign2;
    }
    function positiveMomentsDifference(base, other) {
      var res = {};
      res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
      if (base.clone().add(res.months, "M").isAfter(other)) {
        --res.months;
      }
      res.milliseconds = +other - +base.clone().add(res.months, "M");
      return res;
    }
    function momentsDifference(base, other) {
      var res;
      if (!(base.isValid() && other.isValid())) {
        return { milliseconds: 0, months: 0 };
      }
      other = cloneWithOffset(other, base);
      if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
      } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
      }
      return res;
    }
    function createAdder(direction, name) {
      return function (val, period) {
        var dur, tmp;
        if (period !== null && !isNaN(+period)) {
          deprecateSimple(
            name,
            "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
          );
          tmp = val;
          val = period;
          period = tmp;
        }
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
      };
    }
    function addSubtract(mom, duration, isAdding, updateOffset) {
      var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
      if (!mom.isValid()) {
        return;
      }
      updateOffset = updateOffset == null ? true : updateOffset;
      if (months2) {
        setMonth(mom, get(mom, "Month") + months2 * isAdding);
      }
      if (days2) {
        set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
      }
      if (milliseconds2) {
        mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
      }
      if (updateOffset) {
        hooks.updateOffset(mom, days2 || months2);
      }
    }
    var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
    function isString(input) {
      return typeof input === "string" || input instanceof String;
    }
    function isMomentInput(input) {
      return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
    }
    function isMomentInputObject(input) {
      var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
        "years",
        "year",
        "y",
        "months",
        "month",
        "M",
        "days",
        "day",
        "d",
        "dates",
        "date",
        "D",
        "hours",
        "hour",
        "h",
        "minutes",
        "minute",
        "m",
        "seconds",
        "second",
        "s",
        "milliseconds",
        "millisecond",
        "ms"
      ], i, property, propertyLen = properties.length;
      for (i = 0; i < propertyLen; i += 1) {
        property = properties[i];
        propertyTest = propertyTest || hasOwnProp(input, property);
      }
      return objectTest && propertyTest;
    }
    function isNumberOrStringArray(input) {
      var arrayTest = isArray(input), dataTypeTest = false;
      if (arrayTest) {
        dataTypeTest = input.filter(function (item) {
          return !isNumber(item) && isString(input);
        }).length === 0;
      }
      return arrayTest && dataTypeTest;
    }
    function isCalendarSpec(input) {
      var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
        "sameDay",
        "nextDay",
        "lastDay",
        "nextWeek",
        "lastWeek",
        "sameElse"
      ], i, property;
      for (i = 0; i < properties.length; i += 1) {
        property = properties[i];
        propertyTest = propertyTest || hasOwnProp(input, property);
      }
      return objectTest && propertyTest;
    }
    function getCalendarFormat(myMoment, now2) {
      var diff2 = myMoment.diff(now2, "days", true);
      return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
    }
    function calendar$1(time, formats) {
      if (arguments.length === 1) {
        if (!arguments[0]) {
          time = void 0;
          formats = void 0;
        } else if (isMomentInput(arguments[0])) {
          time = arguments[0];
          formats = void 0;
        } else if (isCalendarSpec(arguments[0])) {
          formats = arguments[0];
          time = void 0;
        }
      }
      var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
      return this.format(
        output || this.localeData().calendar(format2, this, createLocal(now2))
      );
    }
    function clone() {
      return new Moment(this);
    }
    function isAfter(input, units) {
      var localInput = isMoment(input) ? input : createLocal(input);
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() > localInput.valueOf();
      } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
      }
    }
    function isBefore(input, units) {
      var localInput = isMoment(input) ? input : createLocal(input);
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() < localInput.valueOf();
      } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
      }
    }
    function isBetween(from2, to2, units, inclusivity) {
      var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
      if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
        return false;
      }
      inclusivity = inclusivity || "()";
      return (inclusivity[0] === "(" ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }
    function isSame(input, units) {
      var localInput = isMoment(input) ? input : createLocal(input), inputMs;
      if (!(this.isValid() && localInput.isValid())) {
        return false;
      }
      units = normalizeUnits(units) || "millisecond";
      if (units === "millisecond") {
        return this.valueOf() === localInput.valueOf();
      } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
      }
    }
    function isSameOrAfter(input, units) {
      return this.isSame(input, units) || this.isAfter(input, units);
    }
    function isSameOrBefore(input, units) {
      return this.isSame(input, units) || this.isBefore(input, units);
    }
    function diff(input, units, asFloat) {
      var that, zoneDelta, output;
      if (!this.isValid()) {
        return NaN;
      }
      that = cloneWithOffset(input, this);
      if (!that.isValid()) {
        return NaN;
      }
      zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
      units = normalizeUnits(units);
      switch (units) {
        case "year":
          output = monthDiff(this, that) / 12;
          break;
        case "month":
          output = monthDiff(this, that);
          break;
        case "quarter":
          output = monthDiff(this, that) / 3;
          break;
        case "second":
          output = (this - that) / 1e3;
          break;
        // 1000
        case "minute":
          output = (this - that) / 6e4;
          break;
        // 1000 * 60
        case "hour":
          output = (this - that) / 36e5;
          break;
        // 1000 * 60 * 60
        case "day":
          output = (this - that - zoneDelta) / 864e5;
          break;
        // 1000 * 60 * 60 * 24, negate dst
        case "week":
          output = (this - that - zoneDelta) / 6048e5;
          break;
        // 1000 * 60 * 60 * 24 * 7, negate dst
        default:
          output = this - that;
      }
      return asFloat ? output : absFloor(output);
    }
    function monthDiff(a, b2) {
      if (a.date() < b2.date()) {
        return -monthDiff(b2, a);
      }
      var wholeMonthDiff = (b2.year() - a.year()) * 12 + (b2.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
      if (b2 - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
        adjust = (b2 - anchor) / (anchor - anchor2);
      } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
        adjust = (b2 - anchor) / (anchor2 - anchor);
      }
      return -(wholeMonthDiff + adjust) || 0;
    }
    hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function toString() {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function toISOString(keepOffset) {
      if (!this.isValid()) {
        return null;
      }
      var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
      if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(
          m,
          utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
        );
      }
      if (isFunction(Date.prototype.toISOString)) {
        if (utc) {
          return this.toDate().toISOString();
        } else {
          return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
        }
      }
      return formatMoment(
        m,
        utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
      );
    }
    function inspect() {
      if (!this.isValid()) {
        return "moment.invalid(/* " + this._i + " */)";
      }
      var func = "moment", zone = "", prefix, year, datetime, suffix;
      if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
        zone = "Z";
      }
      prefix = "[" + func + '("]';
      year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
      datetime = "-MM-DD[T]HH:mm:ss.SSS";
      suffix = zone + '[")]';
      return this.format(prefix + year + datetime + suffix);
    }
    function format(inputString) {
      if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
      }
      var output = formatMoment(this, inputString);
      return this.localeData().postformat(output);
    }
    function from(time, withoutSuffix) {
      if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
        return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
      } else {
        return this.localeData().invalidDate();
      }
    }
    function fromNow(withoutSuffix) {
      return this.from(createLocal(), withoutSuffix);
    }
    function to(time, withoutSuffix) {
      if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
        return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
      } else {
        return this.localeData().invalidDate();
      }
    }
    function toNow(withoutSuffix) {
      return this.to(createLocal(), withoutSuffix);
    }
    function locale(key) {
      var newLocaleData;
      if (key === void 0) {
        return this._locale._abbr;
      } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
          this._locale = newLocaleData;
        }
        return this;
      }
    }
    var lang = deprecate(
      "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
      function (key) {
        if (key === void 0) {
          return this.localeData();
        } else {
          return this.locale(key);
        }
      }
    );
    function localeData() {
      return this._locale;
    }
    var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
    function mod$1(dividend, divisor) {
      return (dividend % divisor + divisor) % divisor;
    }
    function localStartOfDate(y, m, d) {
      if (y < 100 && y >= 0) {
        return new Date(y + 400, m, d) - MS_PER_400_YEARS;
      } else {
        return new Date(y, m, d).valueOf();
      }
    }
    function utcStartOfDate(y, m, d) {
      if (y < 100 && y >= 0) {
        return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
      } else {
        return Date.UTC(y, m, d);
      }
    }
    function startOf(units) {
      var time, startOfDate;
      units = normalizeUnits(units);
      if (units === void 0 || units === "millisecond" || !this.isValid()) {
        return this;
      }
      startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
      switch (units) {
        case "year":
          time = startOfDate(this.year(), 0, 1);
          break;
        case "quarter":
          time = startOfDate(
            this.year(),
            this.month() - this.month() % 3,
            1
          );
          break;
        case "month":
          time = startOfDate(this.year(), this.month(), 1);
          break;
        case "week":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - this.weekday()
          );
          break;
        case "isoWeek":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - (this.isoWeekday() - 1)
          );
          break;
        case "day":
        case "date":
          time = startOfDate(this.year(), this.month(), this.date());
          break;
        case "hour":
          time = this._d.valueOf();
          time -= mod$1(
            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
            MS_PER_HOUR
          );
          break;
        case "minute":
          time = this._d.valueOf();
          time -= mod$1(time, MS_PER_MINUTE);
          break;
        case "second":
          time = this._d.valueOf();
          time -= mod$1(time, MS_PER_SECOND);
          break;
      }
      this._d.setTime(time);
      hooks.updateOffset(this, true);
      return this;
    }
    function endOf(units) {
      var time, startOfDate;
      units = normalizeUnits(units);
      if (units === void 0 || units === "millisecond" || !this.isValid()) {
        return this;
      }
      startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
      switch (units) {
        case "year":
          time = startOfDate(this.year() + 1, 0, 1) - 1;
          break;
        case "quarter":
          time = startOfDate(
            this.year(),
            this.month() - this.month() % 3 + 3,
            1
          ) - 1;
          break;
        case "month":
          time = startOfDate(this.year(), this.month() + 1, 1) - 1;
          break;
        case "week":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - this.weekday() + 7
          ) - 1;
          break;
        case "isoWeek":
          time = startOfDate(
            this.year(),
            this.month(),
            this.date() - (this.isoWeekday() - 1) + 7
          ) - 1;
          break;
        case "day":
        case "date":
          time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
          break;
        case "hour":
          time = this._d.valueOf();
          time += MS_PER_HOUR - mod$1(
            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
            MS_PER_HOUR
          ) - 1;
          break;
        case "minute":
          time = this._d.valueOf();
          time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
          break;
        case "second":
          time = this._d.valueOf();
          time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
          break;
      }
      this._d.setTime(time);
      hooks.updateOffset(this, true);
      return this;
    }
    function valueOf() {
      return this._d.valueOf() - (this._offset || 0) * 6e4;
    }
    function unix() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function toDate() {
      return new Date(this.valueOf());
    }
    function toArray() {
      var m = this;
      return [
        m.year(),
        m.month(),
        m.date(),
        m.hour(),
        m.minute(),
        m.second(),
        m.millisecond()
      ];
    }
    function toObject() {
      var m = this;
      return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
      };
    }
    function toJSON() {
      return this.isValid() ? this.toISOString() : null;
    }
    function isValid$2() {
      return isValid(this);
    }
    function parsingFlags() {
      return extend({}, getParsingFlags(this));
    }
    function invalidAt() {
      return getParsingFlags(this).overflow;
    }
    function creationData() {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
      };
    }
    addFormatToken("N", 0, 0, "eraAbbr");
    addFormatToken("NN", 0, 0, "eraAbbr");
    addFormatToken("NNN", 0, 0, "eraAbbr");
    addFormatToken("NNNN", 0, 0, "eraName");
    addFormatToken("NNNNN", 0, 0, "eraNarrow");
    addFormatToken("y", ["y", 1], "yo", "eraYear");
    addFormatToken("y", ["yy", 2], 0, "eraYear");
    addFormatToken("y", ["yyy", 3], 0, "eraYear");
    addFormatToken("y", ["yyyy", 4], 0, "eraYear");
    addRegexToken("N", matchEraAbbr);
    addRegexToken("NN", matchEraAbbr);
    addRegexToken("NNN", matchEraAbbr);
    addRegexToken("NNNN", matchEraName);
    addRegexToken("NNNNN", matchEraNarrow);
    addParseToken(
      ["N", "NN", "NNN", "NNNN", "NNNNN"],
      function (input, array, config, token2) {
        var era = config._locale.erasParse(input, token2, config._strict);
        if (era) {
          getParsingFlags(config).era = era;
        } else {
          getParsingFlags(config).invalidEra = input;
        }
      }
    );
    addRegexToken("y", matchUnsigned);
    addRegexToken("yy", matchUnsigned);
    addRegexToken("yyy", matchUnsigned);
    addRegexToken("yyyy", matchUnsigned);
    addRegexToken("yo", matchEraYearOrdinal);
    addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
    addParseToken(["yo"], function (input, array, config, token2) {
      var match;
      if (config._locale._eraYearOrdinalRegex) {
        match = input.match(config._locale._eraYearOrdinalRegex);
      }
      if (config._locale.eraYearOrdinalParse) {
        array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
      } else {
        array[YEAR] = parseInt(input, 10);
      }
    });
    function localeEras(m, format2) {
      var i, l, date, eras = this._eras || getLocale("en")._eras;
      for (i = 0, l = eras.length; i < l; ++i) {
        switch (typeof eras[i].since) {
          case "string":
            date = hooks(eras[i].since).startOf("day");
            eras[i].since = date.valueOf();
            break;
        }
        switch (typeof eras[i].until) {
          case "undefined":
            eras[i].until = Infinity;
            break;
          case "string":
            date = hooks(eras[i].until).startOf("day").valueOf();
            eras[i].until = date.valueOf();
            break;
        }
      }
      return eras;
    }
    function localeErasParse(eraName, format2, strict) {
      var i, l, eras = this.eras(), name, abbr, narrow;
      eraName = eraName.toUpperCase();
      for (i = 0, l = eras.length; i < l; ++i) {
        name = eras[i].name.toUpperCase();
        abbr = eras[i].abbr.toUpperCase();
        narrow = eras[i].narrow.toUpperCase();
        if (strict) {
          switch (format2) {
            case "N":
            case "NN":
            case "NNN":
              if (abbr === eraName) {
                return eras[i];
              }
              break;
            case "NNNN":
              if (name === eraName) {
                return eras[i];
              }
              break;
            case "NNNNN":
              if (narrow === eraName) {
                return eras[i];
              }
              break;
          }
        } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
          return eras[i];
        }
      }
    }
    function localeErasConvertYear(era, year) {
      var dir = era.since <= era.until ? 1 : -1;
      if (year === void 0) {
        return hooks(era.since).year();
      } else {
        return hooks(era.since).year() + (year - era.offset) * dir;
      }
    }
    function getEraName() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].name;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].name;
        }
      }
      return "";
    }
    function getEraNarrow() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].narrow;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].narrow;
        }
      }
      return "";
    }
    function getEraAbbr() {
      var i, l, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until) {
          return eras[i].abbr;
        }
        if (eras[i].until <= val && val <= eras[i].since) {
          return eras[i].abbr;
        }
      }
      return "";
    }
    function getEraYear() {
      var i, l, dir, val, eras = this.localeData().eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        dir = eras[i].since <= eras[i].until ? 1 : -1;
        val = this.clone().startOf("day").valueOf();
        if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
          return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
        }
      }
      return this.year();
    }
    function erasNameRegex(isStrict) {
      if (!hasOwnProp(this, "_erasNameRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasNameRegex : this._erasRegex;
    }
    function erasAbbrRegex(isStrict) {
      if (!hasOwnProp(this, "_erasAbbrRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }
    function erasNarrowRegex(isStrict) {
      if (!hasOwnProp(this, "_erasNarrowRegex")) {
        computeErasParse.call(this);
      }
      return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }
    function matchEraAbbr(isStrict, locale2) {
      return locale2.erasAbbrRegex(isStrict);
    }
    function matchEraName(isStrict, locale2) {
      return locale2.erasNameRegex(isStrict);
    }
    function matchEraNarrow(isStrict, locale2) {
      return locale2.erasNarrowRegex(isStrict);
    }
    function matchEraYearOrdinal(isStrict, locale2) {
      return locale2._eraYearOrdinalRegex || matchUnsigned;
    }
    function computeErasParse() {
      var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, erasName, erasAbbr, erasNarrow, eras = this.eras();
      for (i = 0, l = eras.length; i < l; ++i) {
        erasName = regexEscape(eras[i].name);
        erasAbbr = regexEscape(eras[i].abbr);
        erasNarrow = regexEscape(eras[i].narrow);
        namePieces.push(erasName);
        abbrPieces.push(erasAbbr);
        narrowPieces.push(erasNarrow);
        mixedPieces.push(erasName);
        mixedPieces.push(erasAbbr);
        mixedPieces.push(erasNarrow);
      }
      this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
      this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
      this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
      this._erasNarrowRegex = new RegExp(
        "^(" + narrowPieces.join("|") + ")",
        "i"
      );
    }
    addFormatToken(0, ["gg", 2], 0, function () {
      return this.weekYear() % 100;
    });
    addFormatToken(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    });
    function addWeekYearFormatToken(token2, getter) {
      addFormatToken(0, [token2, token2.length], 0, getter);
    }
    addWeekYearFormatToken("gggg", "weekYear");
    addWeekYearFormatToken("ggggg", "weekYear");
    addWeekYearFormatToken("GGGG", "isoWeekYear");
    addWeekYearFormatToken("GGGGG", "isoWeekYear");
    addRegexToken("G", matchSigned);
    addRegexToken("g", matchSigned);
    addRegexToken("GG", match1to2, match2);
    addRegexToken("gg", match1to2, match2);
    addRegexToken("GGGG", match1to4, match4);
    addRegexToken("gggg", match1to4, match4);
    addRegexToken("GGGGG", match1to6, match6);
    addRegexToken("ggggg", match1to6, match6);
    addWeekParseToken(
      ["gggg", "ggggg", "GGGG", "GGGGG"],
      function (input, week, config, token2) {
        week[token2.substr(0, 2)] = toInt(input);
      }
    );
    addWeekParseToken(["gg", "GG"], function (input, week, config, token2) {
      week[token2] = hooks.parseTwoDigitYear(input);
    });
    function getSetWeekYear(input) {
      return getSetWeekYearHelper.call(
        this,
        input,
        this.week(),
        this.weekday() + this.localeData()._week.dow,
        this.localeData()._week.dow,
        this.localeData()._week.doy
      );
    }
    function getSetISOWeekYear(input) {
      return getSetWeekYearHelper.call(
        this,
        input,
        this.isoWeek(),
        this.isoWeekday(),
        1,
        4
      );
    }
    function getISOWeeksInYear() {
      return weeksInYear(this.year(), 1, 4);
    }
    function getISOWeeksInISOWeekYear() {
      return weeksInYear(this.isoWeekYear(), 1, 4);
    }
    function getWeeksInYear() {
      var weekInfo = this.localeData()._week;
      return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }
    function getWeeksInWeekYear() {
      var weekInfo = this.localeData()._week;
      return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }
    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
      var weeksTarget;
      if (input == null) {
        return weekOfYear(this, dow, doy).year;
      } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
          week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
      }
    }
    function setWeekAll(weekYear, week, weekday, dow, doy) {
      var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
      this.year(date.getUTCFullYear());
      this.month(date.getUTCMonth());
      this.date(date.getUTCDate());
      return this;
    }
    addFormatToken("Q", 0, "Qo", "quarter");
    addRegexToken("Q", match1);
    addParseToken("Q", function (input, array) {
      array[MONTH] = (toInt(input) - 1) * 3;
    });
    function getSetQuarter(input) {
      return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }
    addFormatToken("D", ["DD", 2], "Do", "date");
    addRegexToken("D", match1to2, match1to2NoLeadingZero);
    addRegexToken("DD", match1to2, match2);
    addRegexToken("Do", function (isStrict, locale2) {
      return isStrict ? locale2._dayOfMonthOrdinalParse || locale2._ordinalParse : locale2._dayOfMonthOrdinalParseLenient;
    });
    addParseToken(["D", "DD"], DATE);
    addParseToken("Do", function (input, array) {
      array[DATE] = toInt(input.match(match1to2)[0]);
    });
    var getSetDayOfMonth = makeGetSet("Date", true);
    addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
    addRegexToken("DDD", match1to3);
    addRegexToken("DDDD", match3);
    addParseToken(["DDD", "DDDD"], function (input, array, config) {
      config._dayOfYear = toInt(input);
    });
    function getSetDayOfYear(input) {
      var dayOfYear = Math.round(
        (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
      ) + 1;
      return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
    }
    addFormatToken("m", ["mm", 2], 0, "minute");
    addRegexToken("m", match1to2, match1to2HasZero);
    addRegexToken("mm", match1to2, match2);
    addParseToken(["m", "mm"], MINUTE);
    var getSetMinute = makeGetSet("Minutes", false);
    addFormatToken("s", ["ss", 2], 0, "second");
    addRegexToken("s", match1to2, match1to2HasZero);
    addRegexToken("ss", match1to2, match2);
    addParseToken(["s", "ss"], SECOND);
    var getSetSecond = makeGetSet("Seconds", false);
    addFormatToken("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    });
    addFormatToken(0, ["SS", 2], 0, function () {
      return ~~(this.millisecond() / 10);
    });
    addFormatToken(0, ["SSS", 3], 0, "millisecond");
    addFormatToken(0, ["SSSS", 4], 0, function () {
      return this.millisecond() * 10;
    });
    addFormatToken(0, ["SSSSS", 5], 0, function () {
      return this.millisecond() * 100;
    });
    addFormatToken(0, ["SSSSSS", 6], 0, function () {
      return this.millisecond() * 1e3;
    });
    addFormatToken(0, ["SSSSSSS", 7], 0, function () {
      return this.millisecond() * 1e4;
    });
    addFormatToken(0, ["SSSSSSSS", 8], 0, function () {
      return this.millisecond() * 1e5;
    });
    addFormatToken(0, ["SSSSSSSSS", 9], 0, function () {
      return this.millisecond() * 1e6;
    });
    addRegexToken("S", match1to3, match1);
    addRegexToken("SS", match1to3, match2);
    addRegexToken("SSS", match1to3, match3);
    var token, getSetMillisecond;
    for (token = "SSSS"; token.length <= 9; token += "S") {
      addRegexToken(token, matchUnsigned);
    }
    function parseMs(input, array) {
      array[MILLISECOND] = toInt(("0." + input) * 1e3);
    }
    for (token = "S"; token.length <= 9; token += "S") {
      addParseToken(token, parseMs);
    }
    getSetMillisecond = makeGetSet("Milliseconds", false);
    addFormatToken("z", 0, 0, "zoneAbbr");
    addFormatToken("zz", 0, 0, "zoneName");
    function getZoneAbbr() {
      return this._isUTC ? "UTC" : "";
    }
    function getZoneName() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var proto = Moment.prototype;
    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
      proto[Symbol.for("nodejs.util.inspect.custom")] = function () {
        return "Moment<" + this.format() + ">";
      };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
      "dates accessor is deprecated. Use date instead.",
      getSetDayOfMonth
    );
    proto.months = deprecate(
      "months accessor is deprecated. Use month instead",
      getSetMonth
    );
    proto.years = deprecate(
      "years accessor is deprecated. Use year instead",
      getSetYear
    );
    proto.zone = deprecate(
      "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
      getSetZone
    );
    proto.isDSTShifted = deprecate(
      "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
      isDaylightSavingTimeShifted
    );
    function createUnix(input) {
      return createLocal(input * 1e3);
    }
    function createInZone() {
      return createLocal.apply(null, arguments).parseZone();
    }
    function preParsePostFormat(string) {
      return string;
    }
    var proto$1 = Locale.prototype;
    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;
    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;
    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;
    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;
    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;
    function get$1(format2, index, field, setter) {
      var locale2 = getLocale(), utc = createUTC().set(setter, index);
      return locale2[field](utc, format2);
    }
    function listMonthsImpl(format2, index, field) {
      if (isNumber(format2)) {
        index = format2;
        format2 = void 0;
      }
      format2 = format2 || "";
      if (index != null) {
        return get$1(format2, index, field, "month");
      }
      var i, out = [];
      for (i = 0; i < 12; i++) {
        out[i] = get$1(format2, i, field, "month");
      }
      return out;
    }
    function listWeekdaysImpl(localeSorted, format2, index, field) {
      if (typeof localeSorted === "boolean") {
        if (isNumber(format2)) {
          index = format2;
          format2 = void 0;
        }
        format2 = format2 || "";
      } else {
        format2 = localeSorted;
        index = format2;
        localeSorted = false;
        if (isNumber(format2)) {
          index = format2;
          format2 = void 0;
        }
        format2 = format2 || "";
      }
      var locale2 = getLocale(), shift = localeSorted ? locale2._week.dow : 0, i, out = [];
      if (index != null) {
        return get$1(format2, (index + shift) % 7, field, "day");
      }
      for (i = 0; i < 7; i++) {
        out[i] = get$1(format2, (i + shift) % 7, field, "day");
      }
      return out;
    }
    function listMonths(format2, index) {
      return listMonthsImpl(format2, index, "months");
    }
    function listMonthsShort(format2, index) {
      return listMonthsImpl(format2, index, "monthsShort");
    }
    function listWeekdays(localeSorted, format2, index) {
      return listWeekdaysImpl(localeSorted, format2, index, "weekdays");
    }
    function listWeekdaysShort(localeSorted, format2, index) {
      return listWeekdaysImpl(localeSorted, format2, index, "weekdaysShort");
    }
    function listWeekdaysMin(localeSorted, format2, index) {
      return listWeekdaysImpl(localeSorted, format2, index, "weekdaysMin");
    }
    getSetGlobalLocale("en", {
      eras: [
        {
          since: "0001-01-01",
          until: Infinity,
          offset: 1,
          name: "Anno Domini",
          narrow: "AD",
          abbr: "AD"
        },
        {
          since: "0000-12-31",
          until: -Infinity,
          offset: 1,
          name: "Before Christ",
          narrow: "BC",
          abbr: "BC"
        }
      ],
      dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
      ordinal: function (number) {
        var b2 = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b2 === 1 ? "st" : b2 === 2 ? "nd" : b2 === 3 ? "rd" : "th";
        return number + output;
      }
    });
    hooks.lang = deprecate(
      "moment.lang is deprecated. Use moment.locale instead.",
      getSetGlobalLocale
    );
    hooks.langData = deprecate(
      "moment.langData is deprecated. Use moment.localeData instead.",
      getLocale
    );
    var mathAbs = Math.abs;
    function abs() {
      var data = this._data;
      this._milliseconds = mathAbs(this._milliseconds);
      this._days = mathAbs(this._days);
      this._months = mathAbs(this._months);
      data.milliseconds = mathAbs(data.milliseconds);
      data.seconds = mathAbs(data.seconds);
      data.minutes = mathAbs(data.minutes);
      data.hours = mathAbs(data.hours);
      data.months = mathAbs(data.months);
      data.years = mathAbs(data.years);
      return this;
    }
    function addSubtract$1(duration, input, value, direction) {
      var other = createDuration(input, value);
      duration._milliseconds += direction * other._milliseconds;
      duration._days += direction * other._days;
      duration._months += direction * other._months;
      return duration._bubble();
    }
    function add$1(input, value) {
      return addSubtract$1(this, input, value, 1);
    }
    function subtract$1(input, value) {
      return addSubtract$1(this, input, value, -1);
    }
    function absCeil(number) {
      if (number < 0) {
        return Math.floor(number);
      } else {
        return Math.ceil(number);
      }
    }
    function bubble() {
      var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
      if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
        milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
        days2 = 0;
        months2 = 0;
      }
      data.milliseconds = milliseconds2 % 1e3;
      seconds2 = absFloor(milliseconds2 / 1e3);
      data.seconds = seconds2 % 60;
      minutes2 = absFloor(seconds2 / 60);
      data.minutes = minutes2 % 60;
      hours2 = absFloor(minutes2 / 60);
      data.hours = hours2 % 24;
      days2 += absFloor(hours2 / 24);
      monthsFromDays = absFloor(daysToMonths(days2));
      months2 += monthsFromDays;
      days2 -= absCeil(monthsToDays(monthsFromDays));
      years2 = absFloor(months2 / 12);
      months2 %= 12;
      data.days = days2;
      data.months = months2;
      data.years = years2;
      return this;
    }
    function daysToMonths(days2) {
      return days2 * 4800 / 146097;
    }
    function monthsToDays(months2) {
      return months2 * 146097 / 4800;
    }
    function as(units) {
      if (!this.isValid()) {
        return NaN;
      }
      var days2, months2, milliseconds2 = this._milliseconds;
      units = normalizeUnits(units);
      if (units === "month" || units === "quarter" || units === "year") {
        days2 = this._days + milliseconds2 / 864e5;
        months2 = this._months + daysToMonths(days2);
        switch (units) {
          case "month":
            return months2;
          case "quarter":
            return months2 / 3;
          case "year":
            return months2 / 12;
        }
      } else {
        days2 = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
          case "week":
            return days2 / 7 + milliseconds2 / 6048e5;
          case "day":
            return days2 + milliseconds2 / 864e5;
          case "hour":
            return days2 * 24 + milliseconds2 / 36e5;
          case "minute":
            return days2 * 1440 + milliseconds2 / 6e4;
          case "second":
            return days2 * 86400 + milliseconds2 / 1e3;
          // Math.floor prevents floating point math errors here
          case "millisecond":
            return Math.floor(days2 * 864e5) + milliseconds2;
          default:
            throw new Error("Unknown unit " + units);
        }
      }
    }
    function makeAs(alias) {
      return function () {
        return this.as(alias);
      };
    }
    var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y"), valueOf$1 = asMilliseconds;
    function clone$1() {
      return createDuration(this);
    }
    function get$2(units) {
      units = normalizeUnits(units);
      return this.isValid() ? this[units + "s"]() : NaN;
    }
    function makeGetter(name) {
      return function () {
        return this.isValid() ? this._data[name] : NaN;
      };
    }
    var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
    function weeks() {
      return absFloor(this.days() / 7);
    }
    var round = Math.round, thresholds = {
      ss: 44,
      // a few seconds to seconds
      s: 45,
      // seconds to minute
      m: 45,
      // minutes to hour
      h: 22,
      // hours to day
      d: 26,
      // days to month/week
      w: null,
      // weeks to month
      M: 11
      // months to year
    };
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale2) {
      return locale2.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale2) {
      var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
      if (thresholds2.w != null) {
        a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
      }
      a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
      a[2] = withoutSuffix;
      a[3] = +posNegDuration > 0;
      a[4] = locale2;
      return substituteTimeAgo.apply(null, a);
    }
    function getSetRelativeTimeRounding(roundingFunction) {
      if (roundingFunction === void 0) {
        return round;
      }
      if (typeof roundingFunction === "function") {
        round = roundingFunction;
        return true;
      }
      return false;
    }
    function getSetRelativeTimeThreshold(threshold, limit) {
      if (thresholds[threshold] === void 0) {
        return false;
      }
      if (limit === void 0) {
        return thresholds[threshold];
      }
      thresholds[threshold] = limit;
      if (threshold === "s") {
        thresholds.ss = limit - 1;
      }
      return true;
    }
    function humanize(argWithSuffix, argThresholds) {
      if (!this.isValid()) {
        return this.localeData().invalidDate();
      }
      var withSuffix = false, th = thresholds, locale2, output;
      if (typeof argWithSuffix === "object") {
        argThresholds = argWithSuffix;
        argWithSuffix = false;
      }
      if (typeof argWithSuffix === "boolean") {
        withSuffix = argWithSuffix;
      }
      if (typeof argThresholds === "object") {
        th = Object.assign({}, thresholds, argThresholds);
        if (argThresholds.s != null && argThresholds.ss == null) {
          th.ss = argThresholds.s - 1;
        }
      }
      locale2 = this.localeData();
      output = relativeTime$1(this, !withSuffix, th, locale2);
      if (withSuffix) {
        output = locale2.pastFuture(+this, output);
      }
      return locale2.postformat(output);
    }
    var abs$1 = Math.abs;
    function sign(x) {
      return (x > 0) - (x < 0) || +x;
    }
    function toISOString$1() {
      if (!this.isValid()) {
        return this.localeData().invalidDate();
      }
      var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
      if (!total) {
        return "P0D";
      }
      minutes2 = absFloor(seconds2 / 60);
      hours2 = absFloor(minutes2 / 60);
      seconds2 %= 60;
      minutes2 %= 60;
      years2 = absFloor(months2 / 12);
      months2 %= 12;
      s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
      totalSign = total < 0 ? "-" : "";
      ymSign = sign(this._months) !== sign(total) ? "-" : "";
      daysSign = sign(this._days) !== sign(total) ? "-" : "";
      hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
      return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
    }
    var proto$2 = Duration.prototype;
    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;
    proto$2.toIsoString = deprecate(
      "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
      toISOString$1
    );
    proto$2.lang = lang;
    addFormatToken("X", 0, 0, "unix");
    addFormatToken("x", 0, 0, "valueOf");
    addRegexToken("x", matchSigned);
    addRegexToken("X", matchTimestamp);
    addParseToken("X", function (input, array, config) {
      config._d = new Date(parseFloat(input) * 1e3);
    });
    addParseToken("x", function (input, array, config) {
      config._d = new Date(toInt(input));
    });
    //! moment.js
    hooks.version = "2.30.1";
    setHookCallback(createLocal);
    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;
    hooks.HTML5_FMT = {
      DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
      // <input type="datetime-local" />
      DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
      // <input type="datetime-local" step="1" />
      DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
      // <input type="datetime-local" step="0.001" />
      DATE: "YYYY-MM-DD",
      // <input type="date" />
      TIME: "HH:mm",
      // <input type="time" />
      TIME_SECONDS: "HH:mm:ss",
      // <input type="time" step="1" />
      TIME_MS: "HH:mm:ss.SSS",
      // <input type="time" step="0.001" />
      WEEK: "GGGG-[W]WW",
      // <input type="week" />
      MONTH: "YYYY-MM"
      // <input type="month" />
    };
    function validaCep(cep) {
      cep.addEventListener("input", (ev) => {
        let digits = ev.target.value.match(/\d/g);
        if (digits === null) {
          ev.target.value = "";
          return;
        }
        let newVal = "";
        for (let i = 0; i < (digits.length > 8 ? 8 : digits.length); i++) {
          if (i == 5) {
            newVal += "-";
          }
          newVal += digits[i];
        }
        ev.target.value = newVal;
        if (newVal.length === 9) {
          cep.setCustomValidity("");
        } else {
          cep.setCustomValidity("Campo inválido");
        }
      });
    }
    function maskCPF(cpf) {
      cpf = cpf.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return cpf;
    }
    function validaTelefone(e) {
      var digits = e.value.match(/\d/g);
      if (!digits) {
        e.value = "";
        return null;
      }
      if (digits[0] == 0 || digits[1] == 0) {
        e.value = "";
        return null;
      }
      let phone = digits[2] == 9 ? true : false;
      if (digits.length > phone ? 11 : 10) {
        digits = digits.slice(0, phone ? 11 : 10);
      }
      let newVal = "";
      for (let i = 0; i < digits.length; i++) {
        switch (i) {
          case 0:
            newVal += "(";
            break;
          case 2:
            newVal += ") ";
            break;
          case 3:
            if (phone) {
              newVal += " ";
            }
            break;
          case 6:
            if (!phone) {
              newVal += "-";
            }
            break;
          case 7:
            if (phone) {
              newVal += "-";
            }
            break;
        }
        newVal += digits[i];
      }
      e.value = newVal;
      switch (digits.length) {
        case 10:
          return "fixo";
        case 11:
          return "celular";
        default:
          return null;
      }
    }
    function formatDateInput(input) {
      input.addEventListener("input", (e) => {
        let v = input.value.replaceAll(/\D/g, "");
        if (v.length > 8) v = v.substring(0, 8);
        let date = "";
        for (let i = 0; i < v.length; i++) {
          const c = v[i];
          if (i == 2 || i == 4) {
            date += "/";
            date += c;
          } else {
            date += c;
          }
        }
        input.value = date;
        var newDate = hooks(date, "DD/MM/YYYY");
        if (newDate.isValid() && v.length == 8) {
          this.setDate();
          this.clearTBody();
          this.renderCalendar();
        }
      });
      input.addEventListener("focusout", (e) => {
        const d = input.value;
        const n = d.replaceAll(/\D/g, "");
        if (n.length === 6) {
          const year = parseInt(n.substring(4, 6));
          let century;
          if (year > 50) {
            century = "19";
          } else {
            century = "20";
          }
          input.value = d.substring(0, 6) + century + d.substring(6, 8);
        }
      });
    }
    function marcarFormPreenchido() {
      document.querySelectorAll("input.cep:not(.js-running)").forEach((el) => {
        validaCep(el);
      });
      document.querySelectorAll("input.cpf:not(.js-running)").forEach((el) => {
        el.addEventListener("input", function () {
          el.value = maskCPF(el.value);
        });
      });
      document.querySelectorAll("input.money").forEach((el) => {
        inputMoney(el);
      });
      document.querySelectorAll("input[type=tel]:not(.js-running)").forEach((el) => {
        el.addEventListener("input", function () {
          validaTelefone(el);
        });
        el.addEventListener("focusout", function () {
          validaTelefone(el);
          let type = validaTelefone(el);
          if (type === "fixo" && el.value.length !== 14 || type === "celular" && el.value.length !== 16 || !type) {
            el.value = "";
          }
        });
      });
      document.querySelectorAll("input.date:not(.js-running)").forEach((el) => {
        el.classList.add("js-running");
        formatDateInput(el);
      });
      document.querySelectorAll("input,textarea").forEach((element) => {
        element.addEventListener("focus", function () {
          this.closest("div").classList.add("preenchido");
        });
        element.addEventListener("input", function () {
          this.closest("div").classList.remove("error");
          if (this.dataset.error) this.setCustomValidity("");
        });
        element.addEventListener("focusout", function () {
          if (this.value.length === 0) {
            this.closest("div").classList.remove("preenchido");
          }
        });
        element.addEventListener("invalid", function oninvalid() {
          setFieldError(this);
        });
      });
      document.querySelectorAll("select").forEach((el) => {
        el.addEventListener("input", function preenchido() {
          if (this.selectedIndex >= 0) {
            this.closest("div.container-select").classList.add("preenchido");
          }
        });
        el.addEventListener("invalid", function oninvalid() {
          if (this.selectedIndex >= 0) {
            setFieldError(this, "div.container-select");
          }
        });
      });
      setTimeout(() => {
        document.querySelectorAll("input:-webkit-autofill,textarea:-webkit-autofill").forEach((element) => {
          element.closest("div").classList.add("preenchido");
        });
      }, 1e3);
    }
    function setFieldError(field, closest = "div") {
      field.closest(closest).classList.add("error");
      field.focus();
      if (field.dataset.error) field.setCustomValidity(field.dataset.error);
    }
    function initVideo() {
      document.querySelectorAll("video[data-autoplay]:not(.js-video-running)").forEach((el) => {
        if (el.hasAttribute("data-lazy-video")) return;
        el.classList.add("js-video-running");
        autoPause(el, (intersecting, el2) => {
          if (intersecting) {
            let promise = el2.play();
            if (promise !== void 0) {
              promise.then((_) => {
              }).catch((error) => {
                if (screen$1.isIphone) {
                  document.body.addEventListener("touchstart", function () {
                    const videosOnScreen = document.querySelectorAll("video[data-autoplay],video[data-autopause],video[autoplay]");
                    videosOnScreen.forEach((element) => {
                      if (element.playing);
                      else {
                        element.play();
                        let promise2 = element.play();
                        if (promise2 !== void 0) {
                          promise2.then((_) => {
                          }).catch((error2) => {
                            element.play();
                          });
                        }
                      }
                    });
                  }, {
                    once: true
                  });
                }
              });
            }
          } else {
            el2.pause();
          }
        });
      });
      document.querySelectorAll("video[data-autopause]:not(.js-video-running)").forEach((el) => {
        el.classList.add("js-video-running");
        autoPause(el);
      });
    }
    var gsapWithCSS = gsap$4.registerPlugin(CSSPlugin) || gsap$4;
    gsapWithCSS.core.Tween;
    gsap$4.registerPlugin(ScrollToPlugin, ScrollTrigger$1, ScrollSmoother);
    window.scrollingTo = false;
    window.ScrollToGsap = ScrollToGsap$1;
    function ScrollToGsap$1(target, offset2 = 0, duration = 0.4, easeNum = 1, timeout = 0, container = window, href) {
      let offsetY = calculateOffset(offset2);
      function ease(easing) {
        switch (easing) {
          case 1:
            return "Power3.easeInOut";
          case 2:
            return "Power3.easeOut";
          case 3:
            return "Power1.easeInOut";
          case 4:
            return "Power1.easeOut";
          case 5:
            return "Power2.easeOut";
          case 6:
            return "Power0.easeInOut";
          // Linear
          case 7:
            return "Power2.easeInOut";
          case 8:
            return 'CustomEase.create("custom", "M0,0 C0.212,0 0.267,-0.076 0.346,0 0.422,0.074 0.46,0.356 0.502,0.504 0.551,0.68 0.617,0.862 0.684,0.922 0.748,0.98 0.734,1.094 1,1 ");';
          case 9:
            return "Sine.easeInOut";
          default:
            return easing;
        }
      }
      let targetY = calculateScrollTop(target);
      if (typeof targetY !== "number" && href) {
        singlePjaxInstance.loadUrl(href);
        document.addEventListener("pjax:complete", function () {
          ScrollToGsap$1(target, offset2, duration, easeNum, 0);
        }, { once: true });
        return;
      }
      targetY = parseFloat(targetY) - parseFloat(offsetY);
      let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.min(targetY, maxScroll);
      let smoother = ScrollSmoother.get();
      scrollingTo = true;
      document.body.classList.add("autoscrolling");
      if (duration == -1) smoother.scrollTop(targetY);
      setTimeout(() => {
        if (smoother && container == window) {
          gsap$4.to(smoother, {
            // don't let it go beyond the maximum scrollable area
            scrollTop: targetY,
            duration,
            onComplete: () => {
              scrollingTo = false;
              document.body.classList.remove("autoscrolling");
            }
          });
        } else {
          gsap$4.to(container, {
            duration,
            scrollTo: { y: targetY, autoKill: false },
            ease: ease(easeNum),
            onComplete: () => {
              scrollingTo = false;
              document.body.classList.remove("autoscrolling");
            }
          });
        }
      }, timeout);
    }
    function calculateOffset(offset2) {
      if (typeof offset2 === "string") {
        if (offset2.endsWith("rem")) {
          return parseFloat(offset2) * parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else if (offset2.endsWith("vh")) {
          return parseFloat(offset2) / 100 * window.innerHeight;
        } else if (offset2.match(/^\d+$/)) {
          return parseFloat(offset2);
        } else {
          return toElement(offset2).offsetHeight;
        }
      }
      return offset2;
    }
    function calculateScrollTop(offset2) {
      if (typeof offset2 === "string") {
        if (offset2.endsWith("rem")) {
          return parseFloat(offset2) * parseFloat(getComputedStyle(document.documentElement).fontSize);
        } else if (offset2.endsWith("vh")) {
          return parseFloat(offset2) / 100 * window.innerHeight;
        } else if (offset2.match(/^\d+$/)) {
          return parseFloat(offset2);
        } else {
          return getOffsetTop(toElement(offset2));
        }
      } else if (offset2 instanceof HTMLElement) {
        return getOffsetTop(offset2);
      }
      return offset2;
    }
    function getOffsetTop(element) {
      if (element instanceof HTMLElement) {
        let offsetTop = 0;
        while (element) {
          offsetTop += element.offsetTop;
          element = element.offsetParent;
        }
        return offsetTop;
      } else {
        return false;
      }
    }
    gsapWithCSS.registerPlugin(ScrollToPlugin);
    function scrollTo() {
      let scrollToArray = Array.from(document.querySelectorAll("[data-scrollto]:not(.js-running):not(btn-modal-open)"));
      let mm = gsapWithCSS.matchMedia();
      scrollToArray.forEach((element) => {
        element.classList.add("js-running");
        element.addEventListener("click", function (ev) {
          ev.preventDefault();
          let targetId = element.dataset.scrollto;
          let offset2 = element.dataset.offset ? element.dataset.offset : 0;
          let duration = element.dataset.duration ? element.dataset.duration : 1;
          let timeout = element.dataset.timeout ? element.dataset.timeout : 0;
          let href = element.dataset.href;
          let container = element.dataset.container ? element.dataset.container : window;
          mm.add(`${mediaSize.mobile}`, () => {
            if (element.dataset.mobileOffset) offset2 = element.dataset.mobileOffset;
          });
          ScrollToGsap$1(targetId, offset2, duration, 1, timeout, container, href);
        });
      });
    }
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1, Power3, Power0, ScrollToPlugin, Back);
    function Parallax() {
      let parallaxes = document.querySelectorAll('[data-parallax=""], [data-parallax-top=""]');
      let mm = gsapWithCSS$1.matchMedia();
      window.addEventListener("orientationchange", function () {
        ScrollTrigger$1.refresh();
      });
      window.ScrollTrigger = ScrollTrigger$1;
      parallaxes.forEach((element) => {
        let yFrom = element.dataset.translateYFrom ? element.dataset.translateYFrom : "0";
        let yTo = element.dataset.translateY ? element.dataset.translateY : "0";
        let xFrom = element.dataset.translateXFrom ? element.dataset.translateXFrom : "0";
        let xTo = element.dataset.translateX ? element.dataset.translateX : "0";
        let rotateFrom = element.dataset.rotateFrom ? element.dataset.rotateFrom : "0deg";
        let rotateTo = element.dataset.rotateTo ? element.dataset.rotateTo : "0deg";
        let scaleFrom = element.dataset.scaleFrom ? element.dataset.scaleFrom : "1";
        let scaleTo = element.dataset.scale ? element.dataset.scale : "1";
        let duration = element.dataset.duration ? element.dataset.duration : 1;
        let repeat = element.dataset.repeat ? element.dataset.repeat : 0;
        let yoyo = element.dataset.yoyo ? element.dataset.yoyo : false;
        let markers = element.dataset.markers ? element.dataset.markers : false;
        let ease = element.dataset.ease ? element.dataset.ease : "Power0.easeInOut";
        let delay2 = element.dataset.delay ? element.dataset.delay : 0;
        let repeatDelay = element.dataset.repeatDelay ? element.dataset.repeatDelay : 0;
        let opacity = element.dataset.opacity ? element.dataset.opacity : 1;
        let opacityFrom = element.dataset.opacityFrom ? element.dataset.opacityFrom : 1;
        let trigger2, endTrigger, start, end;
        if (element.dataset.parallaxTop !== void 0) {
          trigger2 = element.dataset.trigger ? document.querySelector(element.dataset.trigger) : document.querySelector(".wrapper");
          endTrigger = element.dataset.endTrigger ? document.querySelector(element.dataset.endTrigger) : trigger2;
          start = element.dataset.start ? element.dataset.start : "top top";
          end = element.dataset.end ? element.dataset.end : window.innerHeight + " top";
        } else {
          trigger2 = element.dataset.trigger ? document.querySelector(element.dataset.trigger) : element;
          endTrigger = element.dataset.endTrigger ? document.querySelector(element.dataset.endTrigger) : trigger2;
          start = element.dataset.start || "top bottom";
          end = element.dataset.end || "bottom top";
        }
        if (element.dataset.trigger && element.dataset.trigger == "parent") trigger2 = element.parentElement;
        let scrub = element.dataset.repeat && element.dataset.repeat == "-1" ? false : true;
        mm.add(`${mediaSize.phone}`, () => {
          if (element.dataset.parallaxNoPhone !== void 0 || element.dataset.parallaxNoMobile !== void 0) return;
          if (element.dataset.phoneTranslateYFrom) yFrom = element.dataset.phoneTranslateYFrom;
          if (element.dataset.phoneTranslateY) yTo = element.dataset.phoneTranslateY;
          if (element.dataset.phoneTranslateXFrom) xFrom = element.dataset.phoneTranslateXFrom;
          if (element.dataset.phoneTranslateX) xTo = element.dataset.phoneTranslateX;
          if (element.dataset.phoneRotateFrom) rotateFrom = element.dataset.phoneRotateFrom;
          if (element.dataset.phoneRotateTo) rotateTo = element.dataset.phoneRotateTo;
          if (element.dataset.phoneScaleFrom) scaleFrom = element.dataset.phoneScaleFrom;
          if (element.dataset.phoneScale) scaleTo = element.dataset.phoneScale;
          if (element.dataset.phoneDuration) duration = element.dataset.phoneDuration;
          if (element.dataset.phoneRepeat) repeat = element.dataset.phoneRepeat;
          if (element.dataset.phoneYoyo) yoyo = element.dataset.phoneYoyo;
          if (element.dataset.phoneTrigger) trigger2 = element.dataset.phoneTrigger;
          if (element.dataset.phoneEndTrigger) endTrigger = element.dataset.phoneEndTrigger;
          if (element.dataset.phoneEase) ease = element.dataset.phoneEase;
          if (element.dataset.phoneDelay) delay2 = element.dataset.phoneDelay;
          if (element.dataset.phoneRepeatDelay) repeatDelay = element.dataset.phoneRepeatDelay;
          if (element.dataset.phoneOpacity) opacity = element.dataset.phoneOpacity;
          if (element.dataset.phoneOpacityFrom) opacityFrom = element.dataset.phoneOpacityFrom;
          if (element.dataset.phoneStart) start = element.dataset.phoneStart;
          if (element.dataset.phoneEnd) end = element.dataset.phoneEnd;
          if (element.dataset.phoneTrigger && element.dataset.phoneTrigger == "parent") trigger2 = element.parentElement;
          const animation = gsapWithCSS$1.timeline({
            repeat,
            // scroller:scroller,
            delay: delay2,
            repeatDelay,
            yoyo,
            scrollTrigger: {
              trigger: trigger2,
              endTrigger,
              start,
              end,
              markers,
              scrub,
              anticipatePin: true,
              invalidateOnRefresh: true,
              toggleActions: "play pause play pause",
              onUpdate: function (ev) {
              },
              onEnter: function () {
                element.dataset.parallaxState = "active";
              },
              onEnterBack: function () {
                element.dataset.parallaxState = "active";
              },
              onLeave: function () {
                element.dataset.parallaxState = "done";
              },
              onLeaveBack: function () {
                element.dataset.parallaxState = "";
              }
            }
          });
          animation.fromTo(element, { y: yFrom, x: xFrom, rotate: rotateFrom, opacity: opacityFrom, scale: scaleFrom, force3D: true }, { y: yTo, x: xTo, rotate: rotateTo, scale: scaleTo, duration, delay: 0, opacity, ease });
        });
        mm.add(`${mediaSize.tablet}`, () => {
          if (element.dataset.parallaxNoTablet !== void 0 || element.dataset.parallaxNoMobile !== void 0) return;
          if (element.dataset.tabletTranslateYFrom) yFrom = element.dataset.tabletTranslateYFrom;
          if (element.dataset.tabletTranslateY) yTo = element.dataset.tabletTranslateY;
          if (element.dataset.tabletTranslateXFrom) xFrom = element.dataset.tabletTranslateXFrom;
          if (element.dataset.tabletTranslateX) xTo = element.dataset.tabletTranslateX;
          if (element.dataset.tabletRotateFrom) rotateFrom = element.dataset.tabletRotateFrom;
          if (element.dataset.tabletRotateTo) rotateTo = element.dataset.tabletRotateTo;
          if (element.dataset.tabletScaleFrom) scaleFrom = element.dataset.tabletScaleFrom;
          if (element.dataset.tabletScale) scaleTo = element.dataset.tabletScale;
          if (element.dataset.tabletDuration) duration = element.dataset.tabletDuration;
          if (element.dataset.tabletRepeat) repeat = element.dataset.tabletRepeat;
          if (element.dataset.tabletYoyo) yoyo = element.dataset.tabletYoyo;
          if (element.dataset.tabletTrigger) trigger2 = element.dataset.tabletTrigger;
          if (element.dataset.tabletEndTrigger) endTrigger = element.dataset.tabletEndTrigger;
          if (element.dataset.tabletEase) ease = element.dataset.tabletEase;
          if (element.dataset.tabletDelay) delay2 = element.dataset.tabletDelay;
          if (element.dataset.tabletRepeatDelay) repeatDelay = element.dataset.tabletRepeatDelay;
          if (element.dataset.tabletOpacity) opacity = element.dataset.tabletOpacity;
          if (element.dataset.tabletOpacityFrom) opacityFrom = element.dataset.tabletOpacityFrom;
          if (element.dataset.tabletStart) start = element.dataset.tabletStart;
          if (element.dataset.tabletEnd) end = element.dataset.tabletEnd;
          if (element.dataset.tabletTrigger && element.dataset.tabletTrigger == "parent") trigger2 = element.parentElement;
          const animation = gsapWithCSS$1.timeline({
            repeat,
            // scroller:scroller,
            delay: delay2,
            repeatDelay,
            yoyo,
            scrollTrigger: {
              trigger: trigger2,
              endTrigger,
              start,
              end,
              pinSpacing: false,
              //   pinReparent:true,
              markers,
              scrub,
              anticipatePin: true,
              invalidateOnRefresh: true,
              toggleActions: "play pause play pause",
              onUpdate: function (ev) {
              },
              onUpdate: function (ev) {
              },
              onEnter: function () {
                element.dataset.parallaxState = "active";
              },
              onEnterBack: function () {
                element.dataset.parallaxState = "active";
              },
              onLeave: function () {
                element.dataset.parallaxState = "done";
              },
              onLeaveBack: function () {
                element.dataset.parallaxState = "";
              }
            }
          });
          animation.fromTo(element, { y: yFrom, x: xFrom, rotate: rotateFrom, opacity: opacityFrom, scale: scaleFrom, force3D: true }, { y: yTo, x: xTo, rotate: rotateTo, scale: scaleTo, duration, delay: 0, opacity, ease });
        });
        mm.add(`${mediaSize.desktop}`, () => {
          if (element.dataset.parallaxNoDesktop !== void 0) return;
          const animation = gsapWithCSS$1.timeline({
            repeat,
            // scroller:scroller,
            delay: delay2,
            repeatDelay,
            yoyo,
            scrollTrigger: {
              trigger: trigger2,
              endTrigger,
              start,
              end,
              pinSpacing: false,
              //   pinReparent:true,
              markers,
              scrub,
              anticipatePin: true,
              invalidateOnRefresh: true,
              toggleActions: "play pause play pause",
              onUpdate: function (ev) {
              },
              onUpdate: function (ev) {
              },
              onEnter: function () {
                element.dataset.parallaxState = "active";
              },
              onEnterBack: function () {
                element.dataset.parallaxState = "active";
              },
              onLeave: function () {
                element.dataset.parallaxState = "done";
              },
              onLeaveBack: function () {
                element.dataset.parallaxState = "";
              }
            }
          });
          animation.fromTo(element, { y: yFrom, x: xFrom, rotate: rotateFrom, opacity: opacityFrom, scale: scaleFrom, force3D: true }, { y: yTo, x: xTo, rotate: rotateTo, scale: scaleTo, duration, delay: 0, opacity, ease });
        });
      });
    }
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1);
    function sticky() {
      let stickies = document.querySelectorAll("[data-sticky='']:not(.js-running)");
      let mm = gsapWithCSS$1.matchMedia();
      stickies.forEach((element) => {
        element.classList.add("js-running");
        let start = element.dataset.start ? element.dataset.start : "top top";
        let end = element.dataset.end ? element.dataset.end : "bottom top";
        let trigger2 = element.dataset.trigger ? document.querySelector(element.dataset.trigger) : element;
        if (element.dataset.trigger && element.dataset.trigger == "parent") trigger2 = element.parentElement;
        if (element.dataset.spacer == "parent" && element.dataset.trigger == "parent") {
          trigger2 = element.parentElement.parentElement;
        }
        let endTrigger = element.dataset.endTrigger ? document.querySelector(element.dataset.endTrigger) : trigger2;
        let offsetEl = element.dataset.offset ? element.dataset.offset : 0;
        let offset2 = 0;
        let pinSpacer = element.dataset.spacer ? element.dataset.spacer == "parent" ? element.parentElement : document.querySelector(element.dataset.spacer) : false;
        if (offsetEl != 0 && document.querySelector(offsetEl)) {
          offset2 = document.querySelector(offsetEl).clientHeight;
        }
        if (element.dataset.trigger && element.dataset.trigger == "parent") {
          start = () => {
            return `top-=${offset2} top`;
          };
          end = () => {
            const offsetSum = element.offsetHeight + offset2;
            return `bottom-=${offsetSum} top`;
          };
        }
        mm.add(`${mediaSize.phone}`, () => {
          if (element.dataset.stickyNoPhone !== void 0 || element.dataset.stickyNoMobile !== void 0) return;
          if (element.dataset.phoneTrigger) trigger2 = element.dataset.phoneTrigger;
          if (element.dataset.phoneEndTrigger) endTrigger = element.dataset.phoneEndTrigger;
          if (element.dataset.phoneStart) start = element.dataset.phoneStart;
          if (element.dataset.phoneEnd) end = element.dataset.phoneEnd;
          if (element.dataset.phoneTrigger && element.dataset.phoneTrigger == "parent") trigger2 = element.parentElement;
          if (element.dataset.spacer == "parent" && element.dataset.phoneTrigger == "parent") {
            trigger2 = element.parentElement.parentElement;
          }
          if (element.dataset.phoneOffset) offsetEl = element.dataset.phoneOffset;
          if (offsetEl != 0 && document.querySelector(offsetEl)) {
            offset2 = document.querySelector(offsetEl).clientHeight;
          }
          if (element.dataset.phoneTrigger && element.dataset.phoneTrigger == "parent") {
            start = () => {
              return `top-=${offset2} top`;
            };
            end = () => {
              const offsetSum = element.offsetHeight + offset2;
              return `bottom-=${offsetSum} top`;
            };
          }
          ScrollTrigger$1.create({
            trigger: trigger2,
            endTrigger,
            start,
            end,
            pin: element,
            pinSpacing: false,
            pinSpacer,
            markers: false,
            scrub: true,
            anticipatePin: true,
            invalidateOnRefresh: true
          });
        });
        mm.add(`${mediaSize.tablet}`, () => {
          if (element.dataset.stickyNoTablet !== void 0 || element.dataset.stickyNoMobile !== void 0) return;
          if (element.dataset.tabletTrigger) trigger2 = element.dataset.tabletTrigger;
          if (element.dataset.tabletEndTrigger) endTrigger = element.dataset.tabletEndTrigger;
          if (element.dataset.tabletStart) start = element.dataset.tabletStart;
          if (element.dataset.tabletEnd) end = element.dataset.tabletEnd;
          if (element.dataset.tabletTrigger && element.dataset.tabletTrigger == "parent") trigger2 = element.parentElement;
          if (element.dataset.tabletOffset) offsetEl = element.dataset.tabletOffset;
          if (offsetEl != 0 && document.querySelector(offsetEl)) {
            offset2 = document.querySelector(offsetEl).clientHeight;
          }
          if (element.dataset.spacer == "parent" && element.dataset.tabletTrigger == "parent") {
            trigger2 = element.parentElement.parentElement;
          }
          if (element.dataset.tabletTrigger && element.dataset.tabletTrigger == "parent") {
            start = () => {
              return `top-=${offset2} top`;
            };
            end = () => {
              const offsetSum = element.offsetHeight + offset2;
              return `bottom-=${offsetSum} top`;
            };
          }
          ScrollTrigger$1.create({
            trigger: trigger2,
            endTrigger,
            start,
            end,
            pin: element,
            pinSpacing: false,
            pinSpacer,
            markers: false,
            scrub: true,
            anticipatePin: true,
            invalidateOnRefresh: true
          });
        });
        mm.add(`${mediaSize.desktop}`, () => {
          if (element.dataset.stickyNoDesktop !== void 0) return;
          ScrollTrigger$1.create({
            trigger: trigger2,
            endTrigger,
            start,
            end,
            pin: element,
            pinSpacing: false,
            pinSpacer,
            markers: false,
            scrub: true,
            anticipatePin: true,
            invalidateOnRefresh: true
          });
        });
      });
    }
    gsapWithCSS$1.registerPlugin(ScrollSmoother);
    function whenContainerReady() {
      pages();


      if (firstLoad) {
        firstLoad = false;
        if (typeof loader === "undefined") {
          updateWatched();
        }
      } else {
        document.body.classList.add("page-enter-active");
        document.body.classList.remove("page-leave-active");
        document.body.classList.remove("overflow-hidden");
        document.body.classList.remove("loader-logo-transition");
        updateWatched();
        setTimeout(() => {
          document.body.classList.remove("page-enter-active");
        }, 5e3);
        let smoother = ScrollSmoother.get();
        if (smoother) smoother.paused(false);
      }
      document.body.classList.remove("page-leave-active");
      observers();
      marcarFormPreenchido();
      initVideo();
      scrollTo();
      Parallax();
      sticky();


      ScrollToGsap(0, 0, 0);
      let loaderExists = document.querySelector("#loader");
      let loaderTimeout = 1e3;
      let leaveTimeout = 600;
      if (!loaderExists) {
        loaderTimeout = 0;
        leaveTimeout = 0;
      }
      if (typeof loader !== "undefined") {
        let smoother = ScrollSmoother.get();
        if (smoother) smoother.paused(true);
        loader.onFirstLeaving = () => {
          observers();
          ScrollToGsap(0, 0, 0);
          setTimeout(() => {
            updateWatched();
          }, leaveTimeout);
          document.dispatchEvent(new CustomEvent("loaded"));
          ScrollTrigger$1.refresh();
        };
        loader.onFirstDone = () => {
          setTimeout(() => {
            document.body.classList.remove("overflow-hidden");
            document.body.classList.remove("loader-logo-transition");
            let smoother2 = ScrollSmoother.get();
            if (smoother2) smoother2.paused(false);
            ScrollTrigger$1.refresh();
          }, 3100);
        };
        setTimeout(() => {
          loader.state.scriptReady = true;
        }, loaderTimeout);
      }


      setTimeout(() => {
        updateWatched();
      }, 5000);
    }
    function whenContainerLeave() {
      document.body.classList.add("page-leave-active");
    }
    window.firstLoad = true;
    gsapWithCSS$1.registerPlugin(ScrollTrigger$1, ScrollSmoother);
    document.addEventListener("pjax:switch", () => {
      ScrollToGsap(0, 0, 0);
    });
    viewportHeight();
    smoothScrollGsap();
    CookiesConsent();
    // whenContainerReady();

    const customEventHandler = document.getElementById("customEventHandler");

    customEventHandler.addEventListener("customUpdateWatch", () => {
      updateWatched();
    });

    customEventHandler.addEventListener("loadContainer", () => {
      whenContainerReady();
    });

    // document.addEventListener("pjax:complete", whenContainerReady);
    // document.addEventListener("pjax:send", whenContainerLeave);

  }
});
export default require_app2();
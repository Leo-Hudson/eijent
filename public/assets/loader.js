const loaderDefault = {
  timeout: 1e4,
  onlyFirstLoad: true
};
class counter {
  constructor() {
    this.total = 0;
    this.remaining = 0;
  }
  get any() {
    if (this.remaining > 0) {
      return true;
    } else {
      return false;
    }
  }
  get percent() {
    if (this.total === 0) return 1;
    return 1 - this.remaining / this.total;
  }
  reset() {
    this.total = 0;
    this.remaining = 0;
  }
  add(number) {
    const x = number ? number : 1;
    this.total += x;
    this.remaining += x;
  }
  remove(number) {
    const x = number ? number : 1;
    this.remaining -= x;
  }
}
let htmlParsed = false;
const loader = {
  ...loaderDefault,
  state: {
    startedAt: 0,
    leavingAt: 0,
    isAnimating: false,
    scriptReady: false,
    isFirstLoad: true,
    img: new counter(),
    module: new counter(),
    progress: 0
  },
  el: null,
  elProg: null,
  cssVariable: "--percentage",
  cssVariable2: "--percentage2",
  /**@type {'loading'|'leaving'|'done'} */
  _dataLoad: "loading",
  set dataLoad(val) {
    this._dataLoad = val;
    document.body.dataset.load = this.state.isFirstLoad ? "first-" + val : val;
  },
  get dataLoad() {
    return this._dataLoad;
  },
  leavingDuration: 2100,
  fakeProgressMaxDuration: 1e4,
  fakeProgressMinDuration: 0,
  init(elStr, elProgStr) {
    this.el = document.querySelector(elStr);
    this.elProg = document.querySelector(elProgStr);
    this.state.startedAt = performance.now();
    this.showLoader();
  },
  /** @param {Event} ev */
  handleEvent(ev) {
    switch (ev.type) {
      case "readystatechange":
        if (document.readyState != "loading" && !htmlParsed) {
          this.init("body", "[data-load-progress]");
        }
        htmlParsed = true;
        break;
      case "pjax:complete":
        this.state.isFirstLoad = false;
        this.showLoader();
        break;
    }
  },
  registerEvents() {
    document.addEventListener("readystatechange", this);
    document.addEventListener("pjax:complete", this);
  },
  cleanState() {
    const state = this.state;
    state.isAnimating = false;
    state.progress = 0;
    state.startedAt = null;
    state.leavingAt = null;
    state.img.reset();
    state.module.reset();
  },
  isLoadComplete(now) {
    const state = this.state;
    if (state.scriptReady && !state.img.any && !state.module.any) {
      return true;
    } else if (now > state.startedAt + loaderDefault.timeout) {
      return true;
    } else {
      return false;
    }
  },
  findPreloads() {
    const state = this.state;
    const imgs = Array.from(document.querySelectorAll("img[data-preload]")).filter((el) => el instanceof HTMLImageElement && !el.complete);
    state.img.total = imgs.length;
    state.img.remaining = imgs.length;
    imgs.forEach((el) => {
      let evFired = false;
      el.addEventListener("load", () => {
        el.dataset.loaded = true;
        if (!evFired) state.img.remaining--;
        evFired = true;
      }, { once: true });
      el.addEventListener("error", () => {
        el.dataset.loaded = true;
        if (!evFired) state.img.remaining--;
        evFired = true;
      }, { once: true });
    });
  },
  findVideoPreloads() {
    this.state;
    const videoElement = document.querySelectorAll("video[data-preload]");
    videoElement.forEach((element) => {
      videoLoad(element);
    });
  },
  showLoader() {
    const now = performance.now();
    if (!this.state.isFirstLoad) {
      this.cleanState();
      if (this.onlyFirstLoad) return;
    }
    this.findPreloads();
    this.findVideoPreloads();
    const complete = this.isLoadComplete(now);
    if (this.state.isFirstLoad) {
      if (complete) {
        if (this.onFirstLeaving()) return;
        if (this.onFirstDone()) return;
        this.dataLoad = "done";
        return;
      }
    } else {
      if (this.onLoading()) return;
    }
    if (complete) {
      if (this.dataLoad != "done") this.dataLoad = "done";
      return;
    }
    this.dataLoad = "loading";
    this.state.startedAt = now;
    this.animate(now);
  },
  animate(now) {
    const step = this.dataLoad;
    const done = this.isLoadComplete(performance.now());
    const state = this.state;
    const frame = requestAnimationFrame((now2) => this.animate(now2));
    if (!done) {
      let fake = (now - state.startedAt) / (state.startedAt + this.fakeProgressMaxDuration);
      if (fake > 1) fake = 1;
      let real = state.img.percent * 0.6 + (state.scriptReady ? state.module.percent * 0.4 : 0);
      this.changeProgress(Math.ceil(100 * (fake * 0.65 + real * 0.35)));
      return;
    }
    if (state.progress < 100) {
      if (state.progress < 80) state.progress += 5;
      this.changeProgress(++state.progress);
      return;
    }
    if (step == "loading") {
      this.dataLoad = "leaving";
      this.state.leavingAt = now;
      if (state.isFirstLoad && this.onFirstLeaving() || !state.isFirstLoad && this.onLeaving()) {
        cancelAnimationFrame(frame);
        return;
      }
    }
    if (now < state.leavingAt + this.leavingDuration) return;
    cancelAnimationFrame(frame);
    this.dataLoad = "done";
    state.isFirstLoad ? this.onFirstDone() : this.onDone();
  },
  changeProgress(percent) {
    this.state.progress = percent;
    this.el.style.setProperty(this.cssVariable, percent / 100);
    this.el.style.setProperty(this.cssVariable2, percent + "%");
    if (this.elProg) this.elProg.dataset.loadProgress = percent;
  },
  //se quiser de alguma forma um controle maior, ex: tempo de saída/entrada,
  //true assim o loader não irá seguir a lógica normal após invocar essas funções;
  onFirstLeaving() {
    return false;
  },
  onFirstDone() {
    return false;
  },
  onLoading() {
    return false;
  },
  onLeaving() {
    return false;
  },
  onDone() {
    return false;
  }
};
function videoLoad(vidEl) {
  var req = new XMLHttpRequest();
  req.open("GET", vidEl.dataset.src, true);
  req.responseType = "blob";
  req.onload = function() {
    if (this.status === 200) {
      var videoBlob = this.response;
      var vid = URL.createObjectURL(videoBlob);
      vidEl.src = vid;
      vidEl.dataset.loaded = true;
      if ("autoplay" in vidEl.dataset) {
        setTimeout(() => {
          vidEl.play();
        }, 100);
      }
    }
  };
  req.onerror = function() {
  };
  req.send();
}
window.loader = loader;
loader.registerEvents();
if (document.readyState != "loading") {
  htmlParsed = true;
  loader.init("body", "[data-load-progress]");
}

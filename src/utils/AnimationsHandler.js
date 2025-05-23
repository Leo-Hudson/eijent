
const triggerEvent = (event, timeout = 200) => {
  if (typeof window !== "undefined") {
    setTimeout(() => {
      const elem = document.getElementById("customEventHandler");
      const customEvent = new Event(event);
      if (elem) elem.dispatchEvent(customEvent);
    }, timeout);
  }
}

export const updatedWatched = () => {
  triggerEvent("customUpdateWatch");
};

export const loadContainer = () => {
  triggerEvent("loadContainer");
};

// export const markPageLoaded = (watched = true) => {
//   if (typeof window !== 'undefined') {
//     closeModals();
//     setTimeout(() => window.scrollTo({ top: 0 }), 200);
//     initAnimations();
//     if (watched) updatedWatched();
//     setTimeout(loadPinterest, 1000);
//     const isFirstLoadDone = document.body.classList.contains("first-load-done");
//     if (isFirstLoadDone) {
//       pageLoadEnd();
//     } else {
//       firstLoadAnimation();
//     }
//   }
// }
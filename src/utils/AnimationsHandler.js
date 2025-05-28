
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

export const resetFormAnimations = () => {
  Array.from(document.querySelectorAll(".preenchido")).forEach((elem) =>
    elem.classList.remove("preenchido")
  );
};
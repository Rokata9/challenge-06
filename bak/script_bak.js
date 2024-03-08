const MAX_SECONDS = 60;
const MAX_MINUTES = 60;
const MAX_HOURS = 24;

const timerCallback = (function () {
  //const currSec = document.querySelector(".seconds-wrapper .current");
  //const currentSecValue = currSec.querySelector(".count");
  const nextSec = document.querySelector(".seconds-wrapper .next");
  const nextSecValue = nextSec.querySelector(".count");

  function getSeconds(html) {
    const seconds = html[0] === "0" ? +html[1] : +html;
    const newValue = seconds === 0 ? MAX_SECONDS - 1 : seconds - 1;
    return newValue;
  }

  function toValueString(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  function getMinutes(seconds) {}

  return () => {
    //const nextSecs = getSeconds(currentSecValue.innerHTML);
    //const nextSecsHtml = toValueString(nextSecs);
    //const afterNextSecs = getSeconds(nextSecsHtml);
    // const afterNextSecsHtml = toValueString(afterNextSecs);

    //requestAnimationFrame(() => {
    //currSec.classList.add("animating");

    //nextSec.classList.remove("transparent");
    nextSec.classList.add("animating");
    //});

    // currSec.addEventListener(
    //   "animationend",
    //   () => {
    //     currSec.classList.remove("animating");
    //     nextSec.classList.add("transparent");
    //     currentSecValue.innerHTML = nextSecsHtml;
    //     nextSecValue.innerHTML = afterNextSecsHtml;
    //   },
    //   { once: true }
    // );

    nextSec.addEventListener(
      "animationend",
      () => {
        nextSec.classList.remove("animating");
        nextSec.classList.remove("transparent");
      },
      { once: true }
    );
  };
})();

setInterval(() => {
  timerCallback();
}, 1000);

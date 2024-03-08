const MAX_SECONDS = 60;
const MAX_MINUTES = 60;
const MAX_HOURS = 24;

const timerCallback = (function () {
  // const currDay = document.querySelector(".day-wrapper .current");
  // const currDayVal = currDay.querySelector(".count");
  // const nextDay = document.querySelector(".seconds-wrapper .next");
  // const nextDayVal = nextSec.querySelector(".count");

  const currMin = document.querySelector(".minutes-wrapper .current");
  const currMinVal = currMin.querySelector(".count");
  const nextMin = document.querySelector(".minutes-wrapper .next");
  const nextMinVal = nextMin.querySelector(".count");

  const currSec = document.querySelector(".seconds-wrapper .current");
  const currSecVal = currSec.querySelector(".count");
  const nextSec = document.querySelector(".seconds-wrapper .next");
  const nextSecVal = nextSec.querySelector(".count");

  function toValueString(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  function trimLeadingZero(html) {
    return html[0] === "0" ? +html[1] : +html;
  }

  function getSeconds(html) {
    const seconds = html[0] === "0" ? +html[1] : +html;
    const newValue = seconds === 0 ? MAX_SECONDS - 1 : seconds - 1;
    return newValue;
  }

  function getMinutes(html, seconds) {
    if (typeof seconds !== 'undefined' && seconds !== 0) { return { update: false }; }

    const minutes = trimLeadingZero(html);
    const newValue = minutes === 0 ? MAX_MINUTES - 1 : minutes - 1;
    return newValue;
  }
  
  function handleMinutes(seconds) {
    const nextMins = getMinutes(currMinVal.innerHTML, seconds);

    if (nextMins?.update === false) { return nextMins; }

    const nextMinsHtml = toValueString(nextMins);
    const afterNextMins = getMinutes(nextMinsHtml);
    const afterNextMinsHtml = toValueString(afterNextMins);

    handleAnimation(currMin, nextMin, currMinVal, nextMinVal, nextMinsHtml, afterNextMinsHtml);
    
    return { minutes: nextMins, update: true };
  }

  function handleSeconds() {
    const nextSecs = getSeconds(currSecVal.innerHTML);
    const nextSecsHtml = toValueString(nextSecs);
    const afterNextSecs = getSeconds(nextSecsHtml);
    const afterNextSecsHtml = toValueString(afterNextSecs);

    handleAnimation(currSec, nextSec, currSecVal, nextSecVal, nextSecsHtml, afterNextSecsHtml);

    return { seconds: nextSecs };
  }

  function handleAnimation(currEl, nextEl, currValEl, nextValEl, nextHtml, afterNextHtml) {
    currEl.classList.add("animating");
    nextEl.classList.add("animating");

    currSec.addEventListener(
      "animationend",
      () => {
        currEl.classList.remove("animating");
        nextEl.classList.add("transparent");
        currValEl.innerHTML = nextHtml;
        nextValEl.innerHTML = afterNextHtml;
      },
      { once: true }
    );

    nextSec.addEventListener(
      "animationend",
      () => {
        nextEl.classList.remove("animating");
        nextEl.classList.remove("transparent");
      },
      { once: true }
    );
  }

  return () => {
    const { seconds } = handleSeconds();
    const { minutes, update: minutesUpdated } = handleMinutes(seconds);

    if (minutesUpdated) {
      // const { hours, updateHours: update } = handleHours(minutes);
    }
  };
})();

setInterval(() => {
  timerCallback();
}, 1000);

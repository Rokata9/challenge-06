const MAX_SECONDS = 60;
const MAX_MINUTES = 60;
const MAX_HOURS = 24;
const ZERO_STR = "00";

const timerCallback = (function () {
  const currDaysEl = document.querySelector(".day-wrapper .current");
  const currDaysValEl = currDaysEl.querySelector(".count");
  const nextDaysEl = document.querySelector(".day-wrapper .next");
  const nextDaysValEl = nextDaysEl.querySelector(".count");

  const currHoursEl = document.querySelector(".hours-wrapper .current");
  const currHoursValEl = currHoursEl.querySelector(".count");
  const nextHoursEl = document.querySelector(".hours-wrapper .next");
  const nextHoursValEl = nextHoursEl.querySelector(".count");

  const currMinsEl = document.querySelector(".minutes-wrapper .current");
  const currMinsValEl = currMinsEl.querySelector(".count");
  const nextMinsEl = document.querySelector(".minutes-wrapper .next");
  const nextMinsValEl = nextMinsEl.querySelector(".count");

  const currSecEl = document.querySelector(".seconds-wrapper .current");
  const currSecValEl = currSecEl.querySelector(".count");
  const nextSecEl = document.querySelector(".seconds-wrapper .next");
  const nextSecValEl = nextSecEl.querySelector(".count");

  function toValueString(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  function trimLeadingZero(html) {
    return html[0] === "0" ? +html[1] : +html;
  }

  function getNewValue(current, max) {
    const currentNum = trimLeadingZero(current);
    const newValue = currentNum === 0 ? max - 1 : currentNum - 1;
    return newValue;
  }

  function getDays(html, minutes) {
    if (typeof minutes !== "undefined" && minutes !== MAX_HOURS - 1) {
      return { update: false };
    }
    const currentNum = trimLeadingZero(html);
    return currentNum - 1;
  }

  function getHours(html, minutes) {
    if (typeof minutes !== "undefined" && minutes !== MAX_MINUTES - 1) {
      return { update: false };
    }
    return getNewValue(html, MAX_HOURS);
  }

  function getMinutes(html, seconds) {
    if (typeof seconds !== "undefined" && seconds !== MAX_SECONDS - 1) {
      return { update: false };
    }
    return getNewValue(html, MAX_MINUTES);
  }

  function getSeconds(html) {
    return getNewValue(html, MAX_SECONDS);
  }

  function handleDays(hours) {
    const nextDays = getDays(currDaysValEl.innerHTML, hours);

    if (nextDays?.update === false) {
      return;
    }

    const nextDaysHtml = toValueString(nextDays);
    const afterNextDays = getMinutes(nextDaysHtml);
    const afterNextDaysHtml = toValueString(afterNextDays);

    animate(
      currDaysEl,
      nextDaysEl,
      currDaysValEl,
      nextDaysValEl,
      nextDaysHtml,
      afterNextDaysHtml
    );
  }

  function handleHours(minutes) {
    const nextHours = getHours(currHoursValEl.innerHTML, minutes);

    if (nextHours?.update === false) {
      return nextHours;
    }

    const nextHoursHtml = toValueString(nextHours);
    const afterNextHours = getMinutes(nextHoursHtml);
    const afterNextHoursHtml = toValueString(afterNextHours);

    animate(
      currHoursEl,
      nextHoursEl,
      currHoursValEl,
      nextHoursValEl,
      nextHoursHtml,
      afterNextHoursHtml
    );

    return { hours: nextHours, update: true };
  }

  function handleMinutes(seconds) {
    const nextMins = getMinutes(currMinsValEl.innerHTML, seconds);

    if (nextMins?.update === false) {
      return nextMins;
    }

    const nextMinsHtml = toValueString(nextMins);
    const afterNextMins = getMinutes(nextMinsHtml);
    const afterNextMinsHtml = toValueString(afterNextMins);

    animate(
      currMinsEl,
      nextMinsEl,
      currMinsValEl,
      nextMinsValEl,
      nextMinsHtml,
      afterNextMinsHtml
    );

    return { minutes: nextMins, update: true };
  }

  function handleSeconds() {
    if (
      currSecValEl.innerHTML === ZERO_STR &&
      currMinsValEl.innerHTML === ZERO_STR &&
      currHoursValEl.innerHTML === ZERO_STR &&
      currDaysEl.innerHTML === ZERO_STR
    ) {
      clearInterval(intervalId);
      return {};
    }

    const nextSecs = getSeconds(currSecValEl.innerHTML);
    const nextSecsHtml = toValueString(nextSecs);
    const afterNextSecs = getSeconds(nextSecsHtml);
    const afterNextSecsHtml = toValueString(afterNextSecs);

    animate(
      currSecEl,
      nextSecEl,
      currSecValEl,
      nextSecValEl,
      nextSecsHtml,
      afterNextSecsHtml
    );

    return { seconds: nextSecs };
  }

  function animate(
    currEl,
    nextEl,
    currValEl,
    nextValEl,
    nextHtml,
    afterNextHtml
  ) {
    currEl.classList.add("animating");
    nextEl.classList.add("animating");

    currEl.addEventListener(
      "animationend",
      () => {
        currEl.classList.remove("animating");
        nextEl.classList.add("transparent");
        currValEl.innerHTML = nextHtml;
        nextValEl.innerHTML = afterNextHtml;
      },
      { once: true }
    );

    nextEl.addEventListener(
      "animationend",
      () => {
        nextEl.classList.remove("animating");

        // needed because fade-in animation is not forwards (will be reset to opacity: 0 in the end and we want it to stay opaque until
        // rotation animation ends)
        nextEl.classList.remove("transparent");
      },
      { once: true }
    );

    /* Uncomment below for situatution when fade-in animation finishes AFTER rotation animation */
    // currEl.addEventListener(
    //   "animationend",
    //   () => {
    //     // no need to toggle transparent class on nextEl as animation is not set to forwards (resets to opacity = 0 in the end)
    //     currEl.classList.remove("animating");
    //     currEl.classList.add("transparent"); // small interval in which it should be transparent as it has finished before fade-in animation
    //   },
    //   { once: true }
    // );

    // nextEl.addEventListener(
    //   "animationend",
    //   () => {
    //     currValEl.innerHTML = nextHtml;
    //     nextValEl.innerHTML = afterNextHtml;
    //     currEl.classList.remove("transparent");
    //     nextEl.classList.remove("animating");
    //   },
    //   { once: true }
    // );
  }

  return () => {
    const { seconds } = handleSeconds();
    if (!seconds) {
      return;
    }

    const { minutes, update: minutesUpdated } = handleMinutes(seconds);

    if (minutesUpdated) {
      const { hours, update: hoursUpdated } = handleHours(minutes);

      if (hoursUpdated) {
        handleDays(hours);
      }
    }
  };
})();

const intervalId = setInterval(() => {
  timerCallback();
}, 1000);

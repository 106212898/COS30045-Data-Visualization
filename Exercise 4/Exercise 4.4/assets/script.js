// ==========================================================================
// Appliance Energy Consumption Website — shared behaviour
// Handles: FAQ accordion (Home page) + dynamic footer year (all pages)
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  initFaqAccordion();
  setFooterYear();
});

/**
 * FAQ accordion — hidden by default, toggled open/closed on click.
 * Each question toggles independently (standard accordion UX).
 */
function initFaqAccordion() {
  var questions = document.querySelectorAll(".faq-question");

  questions.forEach(function (button) {
    button.addEventListener("click", function () {
      var expanded = button.getAttribute("aria-expanded") === "true";
      var answerId = button.getAttribute("aria-controls");
      var answer = document.getElementById(answerId);

      button.setAttribute("aria-expanded", String(!expanded));

      if (!expanded) {
        // Opening: set max-height to the answer's real height so the
        // CSS transition can animate it.
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        // Closing
        answer.style.maxHeight = "0px";
      }
    });
  });
}

/** Writes the current year into every element flagged for it. */
function setFooterYear() {
  var yearEls = document.querySelectorAll("[data-current-year]");
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
}
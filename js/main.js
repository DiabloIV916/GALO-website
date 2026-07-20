// Groundwork — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
  }

  // Mark active nav link based on current page
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Generic form success handling for forms marked data-static-form
  // These forms are configured to post to a form backend (see README).
  // This just gives visual confirmation in a local preview/demo context.
  document.querySelectorAll("form[data-static-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ENDPOINT") !== -1) {
        // Backend not configured yet — prevent submit, show a reminder instead.
        e.preventDefault();
        var note = form.querySelector(".form-note");
        if (note) {
          note.textContent = "Heads up: this form isn't connected to anything yet. See the README for how to wire it up to Formspree, Netlify Forms, or Google Sheets.";
          note.style.color = "#C1441E";
        }
      }
      // If a real endpoint is configured, let the form submit normally.
    });
  });

  // Scoreboard count-up animation, triggered once when scrolled into view
  var statBlocks = document.querySelectorAll("[data-animate-stats]");
  if (statBlocks.length && "IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var nums = entry.target.querySelectorAll("[data-count]");
        nums.forEach(function (el) {
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          var duration = 1200;
          var start = null;
          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    statBlocks.forEach(function (block) { statObserver.observe(block); });
  } else {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  // Scroll-reveal for cards/steps marked data-reveal
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // "Find your program" interactive selector
  var finder = document.querySelector("[data-finder]");
  if (finder) {
    var finderBtns = finder.querySelectorAll("[data-finder-target]");
    var result = finder.querySelector("[data-finder-result]");
    var panels = finder.querySelectorAll("[data-finder-panel]");
    finderBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetKey = btn.getAttribute("data-finder-target");

        finderBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        panels.forEach(function (panel) {
          panel.hidden = panel.getAttribute("data-finder-panel") !== targetKey;
        });

        result.hidden = false;
        requestAnimationFrame(function () { result.classList.add("open"); });
        result.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }
});

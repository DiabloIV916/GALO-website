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

  // Expandable sections (accordion) — every section except the first on a page
  document.querySelectorAll(".accordion-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var section = btn.closest(".accordion-section");
      var panel = section.querySelector(".accordion-panel");
      if (!section || !panel) return;
      var isOpen = section.classList.contains("open");

      if (isOpen) {
        panel.style.maxHeight = panel.scrollHeight + "px";
        requestAnimationFrame(function () {
          section.classList.remove("open");
          panel.style.maxHeight = "0px";
        });
        btn.setAttribute("aria-expanded", "false");
      } else {
        section.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
        panel.addEventListener("transitionend", function handler(e) {
          if (e.propertyName !== "max-height") return;
          if (section.classList.contains("open")) panel.style.maxHeight = "none";
          panel.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  // Keep open accordion panels correctly sized if the window resizes
  window.addEventListener("resize", function () {
    document.querySelectorAll(".accordion-section.open .accordion-panel").forEach(function (panel) {
      panel.style.maxHeight = "none";
    });
  });

  // Gallery slideshow
  var stage = document.querySelector("[data-gallery-stage]");
  if (stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll(".gallery-stage img"));
    var caption = document.querySelector("[data-gallery-caption]");
    var counter = document.querySelector("[data-gallery-counter]");
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".gallery-thumb"));
    var playBtn = document.querySelector("[data-gallery-play]");
    var prevBtn = document.querySelector("[data-gallery-prev]");
    var nextBtn = document.querySelector("[data-gallery-next]");
    var index = 0;
    var playing = true;
    var timer = null;
    var DURATION = 4200;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle("active", si === index); });
      thumbs.forEach(function (t, ti) { t.classList.toggle("active", ti === index); });
      if (caption) caption.textContent = slides[index].getAttribute("data-caption") || slides[index].alt || "";
      if (counter) counter.textContent = (index + 1) + " / " + slides.length;
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, DURATION);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); if (playing) startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); if (playing) startAutoplay(); });
    thumbs.forEach(function (t, ti) {
      t.addEventListener("click", function () { show(ti); if (playing) startAutoplay(); });
    });
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        playing = !playing;
        playBtn.textContent = playing ? "Pause" : "Play";
        if (playing) startAutoplay(); else stopAutoplay();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (!stage.closest("body")) return;
      if (e.key === "ArrowRight") { next(); if (playing) startAutoplay(); }
      if (e.key === "ArrowLeft") { prev(); if (playing) startAutoplay(); }
    });

    show(0);
    if (playing) startAutoplay();
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

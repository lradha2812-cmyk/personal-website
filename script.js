/* Radha Langoju — Portfolio interactions */
(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("rl-theme", next); } catch (e) {}
  });

  // Follow system changes only if the user hasn't chosen explicitly
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("rl-theme"); } catch (err) {}
    if (!saved) root.setAttribute("data-theme", e.matches ? "dark" : "light");
  });

  /* ---------- Sticky nav condense ---------- */
  var nav = document.querySelector(".nav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  function revealInViewport() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains("visible")) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < vh - 20 && rect.bottom > 0) el.classList.add("visible");
    });
    counts.forEach(function (el) {
      if (el.dataset.done) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.dataset.done = "1";
        animateCount(el);
      }
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Geometry fallback runs alongside IO — cheap and idempotent (already-visible
    // elements are skipped). Guarantees reveals in contexts where IO delivery
    // is unreliable (some embedded previews).
    window.addEventListener("scroll", revealInViewport, { passive: true });
    window.addEventListener("resize", revealInViewport);
    setTimeout(revealInViewport, 400);
  }

  /* ---------- Stat count-up ---------- */
  function animateCount(el) {
    if (el.dataset.done === "2") return;
    el.dataset.done = "2";
    var target = parseInt(el.getAttribute("data-target"), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counts = document.querySelectorAll(".count");
  // HTML ships the real values (no-JS fallback); zero them so the count-up starts from 0.
  if (!reduceMotion) {
    counts.forEach(function (el) { el.textContent = "0"; });
  }
  if (!("IntersectionObserver" in window)) {
    counts.forEach(function (el) { el.textContent = el.getAttribute("data-target"); });
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counts.forEach(function (el) { countObserver.observe(el); });
  }
})();

/* Kutvio website — progressive enhancement only.
   The site is fully usable without this file. */
(function () {
  "use strict";
  var root = document.documentElement;

  // Mobile menu -------------------------------------------------------------
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    root.classList.toggle("menu-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  // Language choice: remembered so the first-visit redirect never runs again.
  document.querySelectorAll("[data-lang]").forEach(function (link) {
    link.addEventListener("click", function () {
      try {
        localStorage.setItem("kutvio_lang", link.getAttribute("data-lang"));
      } catch (err) {
        /* storage unavailable (private mode) — ignore */
      }
    });
  });

  // Footer year ---------------------------------------------------------------
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    if (Number(year) > Number(el.textContent)) el.textContent = year;
  });

  // Fade-up on scroll -----------------------------------------------------------
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }
  root.classList.add("reveal-on");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach(function (el) {
    io.observe(el);
  });
})();

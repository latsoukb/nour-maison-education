(function () {
  "use strict";

  const RENTREE_DATE = new Date("2026-09-01T08:00:00+00:00");
  const WHATSAPP_NUMBER = "221778828787";

  /* ─── Header scroll ─── */
  const header = document.getElementById("header");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ─── Mobile nav ─── */
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    navLinks.classList.toggle("open", !open);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    });
  });

  /* ─── Countdown ─── */
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = Math.max(0, RENTREE_DATE - Date.now());
    units.days.textContent = pad(Math.floor(diff / 86400000));
    units.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    units.minutes.textContent = pad(Math.floor((diff % 3600000) / 60000));
    units.seconds.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);

  /* ─── Scroll reveal ─── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* ─── Contact form → WhatsApp ─── */
  const form = document.getElementById("notify-form");
  const success = document.getElementById("form-success");
  const error = document.getElementById("form-error");

  function buildWhatsAppMessage(name, email, phone, message) {
    const lines = [
      "Bonjour, je souhaite être informé(e) de l'ouverture de Nour Maison d'Éducation.",
      "",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
    ];

    if (email) {
      lines.push(`E-mail : ${email}`);
    }

    lines.push("", "Message :", message || "Demande d'inscription à la liste d'attente.");

    return lines.join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector(".btn-text");
    const btnLoading = btn.querySelector(".btn-loading");

    success.hidden = true;
    error.hidden = true;

    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = (data.get("email") || "").trim();
    const phone = data.get("phone").trim();
    const message = (data.get("message") || "").trim();

    if (!name || !phone) {
      error.textContent = "Veuillez renseigner votre nom et votre numéro WhatsApp.";
      error.hidden = false;
      return;
    }

    btnText.hidden = true;
    btnLoading.hidden = false;
    btn.disabled = true;

    const text = buildWhatsAppMessage(name, email, phone, message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");

    success.hidden = false;
    form.reset();

    btnText.hidden = false;
    btnLoading.hidden = true;
    btn.disabled = false;
  });
})();

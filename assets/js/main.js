(function () {
  "use strict";

  var cfg = window.LP_CONFIG || {};
  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function setAll(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  // Preços
  var total = (cfg.priceProtocol || 0) + (cfg.priceKit || 0) + (cfg.priceBonus || 0);
  setAll("[data-price-protocol]", brl.format(cfg.priceProtocol || 0));
  setAll("[data-price-kit]", brl.format(cfg.priceKit || 0));
  setAll("[data-price-bonus]", brl.format(cfg.priceBonus || 0));
  setAll("[data-price-total]", brl.format(total));
  setAll("[data-price-cash]", brl.format(cfg.priceCash || 0));
  setAll("[data-installments]", (cfg.installments || 1) + "x");
  setAll("[data-installment-value]", brl.format(cfg.installmentValue || 0));
  setAll("[data-guarantee-days]", cfg.guaranteeDays || 7);
  setAll("[data-year]", new Date().getFullYear());

  if (total > 0 && cfg.priceCash) {
    var off = Math.round((1 - cfg.priceCash / total) * 100);
    setAll("[data-discount]", "-" + off + "%");
  }

  // Checkout
  document.querySelectorAll("[data-checkout]").forEach(function (a) {
    if (cfg.checkoutUrl && cfg.checkoutUrl !== "#") {
      a.href = cfg.checkoutUrl;
      a.target = "_blank";
      a.rel = "noopener";
    }
  });

  // Countdown
  var deadline = new Date(cfg.deadline).getTime();
  var timers = document.querySelectorAll("[data-countdown]");
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var diff = Math.max(0, deadline - Date.now());
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    timers.forEach(function (t) {
      t.querySelector("[data-days]").textContent = pad(d);
      t.querySelector("[data-hours]").textContent = pad(h);
      t.querySelector("[data-minutes]").textContent = pad(m);
      t.querySelector("[data-seconds]").textContent = pad(sec);
    });
    if (diff === 0) clearInterval(interval);
  }
  var interval = isNaN(deadline) ? null : setInterval(tick, 1000);
  if (interval) tick();

  // CTA fixo no mobile: aparece depois do hero e some na seção de oferta
  var sticky = document.querySelector("[data-sticky-cta]");
  var hero = document.querySelector(".hero");
  var offer = document.getElementById("oferta");
  if (sticky && hero && offer && "IntersectionObserver" in window) {
    var heroVisible = true, offerVisible = false;
    var update = function () {
      sticky.classList.toggle("is-visible", !heroVisible && !offerVisible);
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { offerVisible = e[0].isIntersecting; update(); }).observe(offer);
  }
})();

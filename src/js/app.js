(function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");
  const floatingTooltip = document.getElementById("floatingTooltip");
  const floatingCartTooltip = document.getElementById("floatingCartTooltip");
  const floatingWhatsapp = document.getElementById("floatingWhatsapp");
  const floatingCart = document.getElementById("floatingCart");
  const darkToggle = document.getElementById("darkToggle");

  // ========== DARK MODE ==========
  function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    if (darkToggle) {
      darkToggle.innerHTML = tema === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM4.93 4.93a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414L4.93 6.343a1 1 0 0 1 0-1.414zm12.728 12.728a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zM4.93 19.07a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 0 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zm12.728-12.728a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 .865.494 9.077 9.077 0 0 0 8.637 13.475 1.078 1.078 0 0 1 1.145.367 1.042 1.042 0 0 1 .072 1.165A10.002 10.002 0 1 1 11.14 2.04a1 1 0 0 1 .86-.04zM10.11 4.18a8 8 0 1 0 9.634 12.628A11.079 11.079 0 0 1 10.11 4.18z"/></svg>';
      darkToggle.setAttribute("aria-label", tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
    localStorage.setItem("tema", tema);
  }

  const temaGuardado = localStorage.getItem("tema");
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const temaInicial = temaGuardado || (prefiereOscuro ? "dark" : "light");
  aplicarTema(temaInicial);

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const actual = document.documentElement.getAttribute("data-theme");
      aplicarTema(actual === "dark" ? "light" : "dark");
    });
  }
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("tema")) {
      aplicarTema(e.matches ? "dark" : "light");
    }
  });

  // ========== NAVBAR ==========
  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  function openMenu() {
    navLinks.classList.add("active");
    navOverlay.classList.add("active");
    hamburger.classList.add("active");
    document.body.style.overflow = "hidden";
    const firstLink = navLinks.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
    hamburger.focus();
  }

  hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener("click", closeMenu);

  const navLinkItems = navLinks.querySelectorAll("a");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        closeMenu();
      }
    });
  });

  function trapFocus(event) {
    const focusable = navLinks.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMenu();
    }
    if (e.key === "Tab" && navLinks.classList.contains("active")) {
      trapFocus(e);
    }
  });

  let tooltipTimeout;
  const showTooltip = () => {
    floatingTooltip.classList.add("visible");
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      floatingTooltip.classList.remove("visible");
    }, 4000);
  };

  setTimeout(showTooltip, 1500);

  floatingWhatsapp.addEventListener("mouseenter", () => {
    floatingTooltip.classList.add("visible");
    clearTimeout(tooltipTimeout);
  });
  floatingWhatsapp.addEventListener("mouseleave", () => {
    tooltipTimeout = setTimeout(() => {
      floatingTooltip.classList.remove("visible");
    }, 600);
  });

  if (floatingCart && floatingCartTooltip) {
    floatingCart.addEventListener("mouseenter", () => {
      floatingCartTooltip.classList.add("visible");
    });
    floatingCart.addEventListener("mouseleave", () => {
      floatingCartTooltip.classList.remove("visible");
    });
  }

  function hideAllTooltips() {
    floatingTooltip.classList.remove("visible");
    if (floatingCartTooltip) floatingCartTooltip.classList.remove("visible");
    clearTimeout(tooltipTimeout);
  }

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 200) hideAllTooltips();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true },
  );

  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(animateOnScroll, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px",
  });

  const cardsToAnimate = document.querySelectorAll(
    ".service-card, .service-card--extra, .product-card, .featured-banner, .productos-toolbar, .services-toggle",
  );
  cardsToAnimate.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(card);
  });

  const servicesToggle = document.getElementById("servicesToggle");
  const servicesGrid = document.getElementById("servicesGrid");
  if (servicesToggle && servicesGrid) {
    servicesToggle.addEventListener("click", () => {
      const expanded = servicesGrid.classList.toggle("show-all");
      servicesToggle.textContent = expanded
        ? "Mostrar menos servicios ↑"
        : "Ver más servicios ↓";
      servicesToggle.setAttribute("aria-expanded", expanded);

      const extras = servicesGrid.querySelectorAll(".service-card--extra");

      if (expanded) {
        extras.forEach((card, i) => {
          card.style.display = "block";
          card.style.opacity = "0";
          card.style.paddingTop = "0";
          card.style.paddingBottom = "0";
          card.style.borderWidth = "0";
          card.offsetHeight;
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.paddingTop = "32px";
            card.style.paddingBottom = "32px";
            card.style.borderWidth = "1px";
          }, i * 80);
        });
        setTimeout(() => {
          const allCards = servicesGrid.querySelectorAll(".service-card");
          let maxHeight = 0;
          allCards.forEach((card) => {
            card.style.height = "auto";
            const h = card.offsetHeight;
            if (h > maxHeight) maxHeight = h;
          });
          allCards.forEach((card) => {
            card.style.height = maxHeight + "px";
          });
        }, extras.length * 80 + 500);
        if (typeof showToast === "function") {
          showToast("🔧 Mostrando todos los servicios");
        }
      } else {
        extras.forEach((card) => {
          card.style.opacity = "0";
          card.style.paddingTop = "0";
          card.style.paddingBottom = "0";
          card.style.borderWidth = "0";
          setTimeout(() => {
            card.style.display = "none";
          }, 400);
        });
        const allCards = servicesGrid.querySelectorAll(".service-card");
        allCards.forEach((card) => {
          card.style.height = "auto";
        });
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });

  // ========== CONFIRMACIÓN WHATSAPP ==========
  const confirmOverlay = document.getElementById("confirmOverlay");
  const confirmCancel = document.getElementById("confirmCancel");
  const confirmOk = document.getElementById("confirmOk");
  let pendingWhatsAppUrl = "";

  function abrirConfirmacion(url) {
    pendingWhatsAppUrl = url;
    confirmOverlay.classList.add("active");
  }

  function cerrarConfirmacion() {
    confirmOverlay.classList.remove("active");
    pendingWhatsAppUrl = "";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("a[href*='wa.me'], a[href*='whatsapp.com']");
    if (!btn) return;
    if (btn.classList.contains("confirm-btn")) return;
    e.preventDefault();
    abrirConfirmacion(btn.href);
  });

  confirmCancel.addEventListener("click", cerrarConfirmacion);

  confirmOk.addEventListener("click", () => {
    if (pendingWhatsAppUrl) {
      window.open(pendingWhatsAppUrl, "_blank", "noopener");
    }
    cerrarConfirmacion();
  });

  confirmOverlay.addEventListener("click", (e) => {
    if (e.target === confirmOverlay) cerrarConfirmacion();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && confirmOverlay.classList.contains("active")) {
      cerrarConfirmacion();
    }
  });
  window.addEventListener("load", () => {
    const el = document.getElementById("loaderOverlay");
    if (el) el.classList.add("hidden");
  });
})();

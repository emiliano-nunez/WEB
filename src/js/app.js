(function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");
  const floatingTooltip = document.getElementById("floatingTooltip");
  const floatingCartTooltip = document.getElementById("floatingCartTooltip");
  const floatingWhatsapp = document.getElementById("floatingWhatsapp");
  const floatingCart = document.getElementById("floatingCart");

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
    ".service-card, .service-card--extra, .product-card, .featured-banner",
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
      if (expanded) {
        const extras = servicesGrid.querySelectorAll(".service-card--extra");
        extras.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, i * 80);
        });
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });
})();

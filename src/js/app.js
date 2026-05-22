(function () {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");
  const floatingTooltip = document.getElementById("floatingTooltip");
  const floatingWhatsapp = document.getElementById("floatingWhatsapp");

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
  }

  function closeMenu() {
    navLinks.classList.remove("active");
    navOverlay.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMenu();
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

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (
            window.scrollY > 200 &&
            floatingTooltip.classList.contains("visible")
          ) {
            floatingTooltip.classList.remove("visible");
            clearTimeout(tooltipTimeout);
          }
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
    ".service-card, .product-card, .featured-banner",
  );
  cardsToAnimate.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(card);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });
})();

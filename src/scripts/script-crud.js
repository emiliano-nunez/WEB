(function () {
  // ========== LISTA DE PRODUCTOS ==========
  // Cada producto puede tener:
  // - imagen: ruta al archivo PNG (ej: "img/productos/funda.jpg")
  // - icono: emoji (se usa si no hay imagen)
  // Si no hay imagen ni icono, se muestra 📦 por defecto.
  const productos = [
    {
      id: 1,
      imagen: "src/img/productos/2.jpg", // <--- ruta de tu imagen PNG
      nombre: "Parlante Table Pro T21",
      descripcion:
        "Parlante bluetooth compacto con correa. ",
      precio: "9.500",
    },
    {
      id: 2,
      imagen: "src/img/productos/32.jpg", // <--- ruta de tu imagen PNG
      nombre: "Parlante Dinax Sound",
      descripcion:
        "Parlante bluetooth de 8 Pulgadas. Luz LED",
      precio: "12.900",
    },
    {
      id: 3,
      imagen: "src/img/productos/33.jpg", // <--- ruta de tu imagen PNG
      nombre: "Parlante GTS Flame Ligth",
      descripcion:
        "Parlante bluetooth de 3 Pulgadas. Luz LED con diseño degradado",
      precio: "13.700",
    },
    {
      id: 4,
      imagen: "src/img/productos/34.jpg", // <--- ruta de tu imagen PNG
      nombre: "Parlante Uni-Retro",
      descripcion:
        "Parlante bluetooth de 3 Pulgadas. Diseño vertical con show de luz LED multicolor",
      precio: "13.200",
    },
    {
      id: 5,
      imagen: "src/img/productos/36.jpg",
      nombre: "Auriculares Inalámbricos Ultrapods Max",
      descripcion:
        "Auriculares bluetooth con diseño ergonómico. Tactiles, con estuche de carga y micrófono integrado que muestra el porcentaje de batería.",
      precio: "8.800",
    },
    {
      id: 6,
      imagen: "src/img/productos/37.jpg",
      nombre: "Auriculares Inalámbricos A6S",
      descripcion:
        "Auriculares bluetooth. Con botones de control, estuche de carga y micrófono integrado. LED muestra el porcentaje de batería.",
      precio: "8.400",
    }
  ];

  function renderizarProductos() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return;
    grid.innerHTML = "";

    for (const p of productos) {
      const card = document.createElement("div");
      card.className = "product-card";

      // Determinar el contenido del placeholder: imagen o emoji
      let contenidoPlaceholder = "";
      if (p.imagen) {
        contenidoPlaceholder = `<img src="${escapeHtml(p.imagen)}" alt="${escapeHtml(p.nombre)}" style="width: 100%; height: 100%; object-fit: cover;">`;
      } else {
        const icono = p.icono || "📦";
        contenidoPlaceholder = escapeHtml(icono);
      }

      // Estructura interna de la card
      card.innerHTML = `
          <div class="product-img-placeholder" style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${contenidoPlaceholder}
          </div>
          <div class="product-body">
            <h3>${escapeHtml(p.nombre)}</h3>
            <p class="desc">${escapeHtml(p.descripcion)}</p>
            <div class="product-footer">
              <span class="price"><small>$</small>${escapeHtml(p.precio)}</span>
              <a href="https://wa.me/542317401056?text=Hola!%20Quiero%20consultar%20por%20${encodeURIComponent(p.nombre)}" target="_blank" rel="noopener" class="btn-sm">Consultar</a>
            </div>
          </div>
        `;
      grid.appendChild(card);
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderizarProductos);
  } else {
    renderizarProductos();
  }
})();

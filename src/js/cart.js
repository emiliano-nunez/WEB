// js/cart.js
// ========== CARRITO DE COMPRAS ==========

/**
 * Obtiene el carrito actual desde localStorage.
 * @returns {Array} Array de objetos { id, cantidad }
 */
function obtenerCarrito() {
  const carritoJSON = localStorage.getItem('carrito');
  if (carritoJSON) {
    try {
      return JSON.parse(carritoJSON);
    } catch (e) {
      console.error('Error al leer el carrito:', e);
      return [];
    }
  }
  return [];
}

/**
 * Guarda el carrito en localStorage.
 * @param {Array} carrito
 */
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Agrega un producto al carrito por su id.
 * Si ya existe, incrementa la cantidad.
 * @param {number} id - ID del producto
 * @param {number} cantidad - Cantidad a agregar (por defecto 1)
 */
function agregarAlCarrito(id, cantidad = 1) {
  const carrito = obtenerCarrito();
  const productoExistente = carrito.find(item => item.id === id);
  
  cantidad = Math.max(1, parseInt(cantidad, 10) || 1);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carrito.push({ id: id, cantidad: cantidad });
  }

  guardarCarrito(carrito);
  pintarCarrito(); // Actualiza la vista inmediatamente
}

/**
 * Aumenta la cantidad de un producto en el carrito.
 * @param {number} id - ID del producto
 */
function aumentarCantidad(id) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad += 1;
    guardarCarrito(carrito);
    pintarCarrito();
  }
}

/**
 * Disminuye la cantidad de un producto en el carrito.
 * Si llega a 0, lo elimina completamente.
 * @param {number} id - ID del producto
 */
function disminuirCantidad(id) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === id);
  if (item) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      carrito = carrito.filter(i => i.id !== id);
    }
    guardarCarrito(carrito);
    pintarCarrito();
  }
}

/**
 * Elimina completamente un producto del carrito por su id.
 * @param {number} id - ID del producto
 */
function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito(carrito);
  pintarCarrito();
}

/**
 * Obtiene los detalles de un producto desde el array global productos.
 * @param {number} id
 * @returns {object|undefined} Producto encontrado
 */
function obtenerProductoPorId(id) {
  // Se asume que 'productos' es un array accesible globalmente
  // (definido en otro script, por ejemplo productos.js)
  return window.productos ? window.productos.find(p => p.id === id) : undefined;
}

/**
 * Renderiza el carrito en el HTML.
 * Busca un contenedor con id="carrito-contenido" y lo rellena.
 * También actualiza el total y crea el botón de WhatsApp.
 */
function pintarCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  if (!contenedor) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    contenedor.innerHTML = `<p class="carrito-vacio">🛒 Tu carrito está vacío.</p>`;
    return;
  }

  // Construir filas de productos
  let itemsHTML = '';
  let total = 0;

  for (const item of carrito) {
    const producto = obtenerProductoPorId(item.id);
    if (!producto) continue; // Si se eliminó el producto de la lista, lo omitimos

    const precioNumerico = parseFloat(producto.precio.replace(/[^0-9.-]+/g, ''));
    const subtotal = precioNumerico * item.cantidad;
    total += subtotal;

    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-nombre">${escapeHtml(producto.nombre)}</span>
          <span class="cart-item-unit-price">$${formatearPrecio(precioNumerico)}</span>
        </div>
        <div class="cart-item-controles">
          <button class="cart-item-btn" type="button" data-id="${item.id}" data-accion="disminuir">−</button>
          <span class="cart-item-cantidad">${item.cantidad}</span>
          <button class="cart-item-btn" type="button" data-id="${item.id}" data-accion="aumentar">+</button>
        </div>
        <div class="cart-item-subtotal">
          <span class="cart-item-precio">$${formatearPrecio(subtotal)}</span>
          <button class="cart-item-eliminar" type="button" data-id="${item.id}" title="Eliminar">🗑️</button>
        </div>
      </div>
    `;
  }

  // Mensaje para WhatsApp (preparado para codificar)
  let mensaje = 'Hola! Quiero pedir:%0A';
  for (const item of carrito) {
    const producto = obtenerProductoPorId(item.id);
    if (!producto) continue;
    mensaje += `- ${producto.nombre} (x${item.cantidad})%0A`;
  }
  mensaje += `%0ATotal: $${formatearPrecio(total)}`;

  const telefono = '542317401056'; // Ajusta al número real de la tienda
  const enlaceWhatsApp = `https://wa.me/${telefono}?text=${mensaje}`;

  contenedor.innerHTML = `
    <div class="cart-wrapper">
      <div class="cart-items-list">
        ${itemsHTML}
      </div>
      <div class="cart-resumen">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount">$${formatearPrecio(total)}</span>
        </div>
        <a href="${enlaceWhatsApp}" target="_blank" rel="noopener" class="btn-enviar-pedido">
          📱 Enviar pedido por WhatsApp
        </a>
      </div>
    </div>
  `;
}

function inicializarEventosCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  if (!contenedor) return;

  contenedor.addEventListener('click', function (event) {
    const id = parseInt(event.target.dataset.id, 10);
    if (Number.isNaN(id)) return;

    if (event.target.classList.contains('cart-item-eliminar')) {
      eliminarDelCarrito(id);
    } else if (event.target.classList.contains('cart-item-btn')) {
      const accion = event.target.dataset.accion;
      if (accion === 'aumentar') {
        aumentarCantidad(id);
      } else if (accion === 'disminuir') {
        disminuirCantidad(id);
      }
    }
  });
}

/**
 * Formatea un número con puntos como separador de miles.
 * @param {number} num
 * @returns {string} Número formateado
 */
function formatearPrecio(num) {
  if (typeof num !== 'number') {
    num = parseFloat(num);
  }
  if (isNaN(num)) return '0';
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Escapa caracteres HTML para evitar XSS.
 * (Se puede reutilizar la misma función del script de productos)
 */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Inicialización: al cargar la página, renderizamos el carrito y activamos la delegación de eventos
document.addEventListener('DOMContentLoaded', function () {
  pintarCarrito();
  inicializarEventosCarrito();
});
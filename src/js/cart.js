// js/cart.js
// ========== CARRITO DE COMPRAS ==========

const CART_KEY = 'carrito';

function obtenerCarrito() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .map((item) => ({
        id: Number(item?.id) || 0,
        cantidad: Math.max(1, Number(item?.cantidad) || 1),
      }))
      .filter((item) => item.id > 0);
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
}

function productosDisponibles() {
  const raw = window.productos;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.value)) return raw.value;
  return [];
}

function obtenerProductoPorId(id) {
  const productoId = Number(id);
  return productosDisponibles().find((producto) => Number(producto?.id) === productoId);
}

function actualizarCarrito(carrito) {
  guardarCarrito(carrito);
  pintarCarrito();
  actualizarBadge();
}

function ajustarCantidad(id, delta) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    if (delta > 0) {
      carrito.push({ id: Number(id), cantidad: 1 });
      actualizarCarrito(carrito);
      showToast('✅ Producto agregado al carrito');
    }
    return;
  }

  carrito[index].cantidad = Math.max(0, carrito[index].cantidad + delta);

  if (carrito[index].cantidad === 0) {
    carrito.splice(index, 1);
    showToast('🗑️ Producto eliminado del carrito');
    actualizarCarrito(carrito);
    return;
  }

  if (delta > 0) {
    showToast('➕ Cantidad aumentada');
  } else {
    showToast('➖ Cantidad disminuida');
  }

  actualizarCarrito(carrito);
}

function agregarAlCarrito(id, cantidad = 1) {
  const carrito = obtenerCarrito();
  const item = carrito.find((entry) => entry.id === Number(id));
  const cantidadValida = Math.max(1, Number(cantidad) || 1);

  if (item) {
    item.cantidad += cantidadValida;
    showToast(`➕ ${cantidadValida} más agregado${cantidadValida > 1 ? 's' : ''}`);
  } else {
    carrito.push({ id: Number(id), cantidad: cantidadValida });
    showToast(`✅ Producto agregado${cantidadValida > 1 ? ' (x' + cantidadValida + ')' : ''}`);
  }

  actualizarCarrito(carrito);
}

function aumentarCantidad(id) {
  ajustarCantidad(id, 1);
}

function disminuirCantidad(id) {
  ajustarCantidad(id, -1);
}

function eliminarDelCarrito(id) {
  actualizarCarrito(obtenerCarrito().filter((item) => item.id !== Number(id)));
  showToast('🗑️ Producto eliminado del carrito');
}

function actualizarBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  if (!badges.length) return;
  const carrito = obtenerCarrito();
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const display = total > 0 ? 'flex' : 'none';
  const text = total > 99 ? '99+' : total;
  badges.forEach((badge) => {
    badge.textContent = text;
    badge.style.display = display;
  });
}

function showToast(mensaje) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  container.appendChild(toast);
  toast.offsetHeight;
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

function formatearPrecio(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return '0';
  return numero.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, (char) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char];
  });
}

function pintarCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  if (!contenedor) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">🛒 Tu carrito está vacío.</p>';
    return;
  }

  if (productosDisponibles().length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">Cargando productos...</p>';
    return;
  }

  let total = 0;
  const lineasPedido = [];
  const itemsHTML = carrito
    .map((item) => {
      const producto = obtenerProductoPorId(item.id);
      if (!producto) return '';

      const precio = parseFloat(String(producto.precio || '').replace(/[^0-9.-]/g, '')) || 0;
      const subtotal = precio * item.cantidad;
      total += subtotal;
      lineasPedido.push(`- ${producto.nombre} (x${item.cantidad})`);

      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-nombre">${escapeHtml(producto.nombre)}</span>
            <span class="cart-item-unit-price">$${formatearPrecio(precio)}</span>
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
    })
    .filter(Boolean)
    .join('');

  if (!itemsHTML) {
    contenedor.innerHTML = '<p class="carrito-vacio">🛒 Tu carrito está vacío.</p>';
    return;
  }

  const mensaje = encodeURIComponent(`Hola! Quiero pedir:\n${lineasPedido.join('\n')}\n\nTotal: $${formatearPrecio(total)}`);

  contenedor.innerHTML = `
    <div class="cart-wrapper">
      <div class="cart-items-list">${itemsHTML}</div>
      <div class="cart-resumen">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount">$${formatearPrecio(total)}</span>
        </div>
        <a href="https://wa.me/542317401056?text=${mensaje}" target="_blank" rel="noopener" class="btn-enviar-pedido">
          📱 Enviar pedido por WhatsApp
        </a>
      </div>
    </div>
  `;
}

function inicializarEventosCarrito() {
  const contenedor = document.getElementById('carrito-contenido');
  if (!contenedor) return;

  contenedor.addEventListener('click', (event) => {
    const boton = event.target.closest('button[data-id]');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    if (Number.isNaN(id)) return;

    if (boton.classList.contains('cart-item-eliminar')) {
      eliminarDelCarrito(id);
      return;
    }

    if (!boton.classList.contains('cart-item-btn')) return;

    if (boton.dataset.accion === 'aumentar') {
      aumentarCantidad(id);
    } else if (boton.dataset.accion === 'disminuir') {
      disminuirCantidad(id);
    }
  });
}

inicializarEventosCarrito();
actualizarBadge();
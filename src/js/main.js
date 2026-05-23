// js/main.js

const SUPABASE_URL = 'https://qjimwhvypjmyfjvttmct.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dVzjdeMjix23pq_UW1fxHQ_HsiQmrLi';

let supabaseClient = null;

// Intentar inicializar Supabase si está disponible y configurado
if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('YOUR_')) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('No se pudo inicializar Supabase:', e);
  }
}

async function cargarProductos() {
  const contenedor = document.getElementById('productos-grid');
  if (!contenedor) return;

  let productos = null;

  // Si Supabase está configurado, intentar cargar desde ahí
  if (supabaseClient) {
    contenedor.innerHTML = '<p>Cargando productos...</p>';
    
    const { data, error } = await supabaseClient
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error cargando productos desde Supabase:', error);
    } else if (Array.isArray(data)) {
      productos = data;
    } else if (data && Array.isArray(data.value)) {
      productos = data.value;
    } else {
      console.warn('Respuesta inesperada de Supabase:', data);
    }
  }

  // Fallback a productos locales si Supabase no está disponible o no hay datos
  if (!productos || productos.length === 0) {
    if (window.productos && Array.isArray(window.productos) && window.productos.length > 0) {
      productos = window.productos;
    } else if (window.productos && Array.isArray(window.productos?.value) && window.productos.value.length > 0) {
      productos = window.productos.value;
    } else {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }
  }

  window.productos = productos;
  renderizarProductos(productos);
  if (typeof pintarCarrito === 'function') {
    pintarCarrito();
  }
  asignarEventosAgregar();
}

function crearTarjetaProducto(producto) {
  const imageUrl = producto.image_url || producto.imagen || producto.image;
  const imagenHTML = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(producto.nombre)}" loading="lazy" onerror="this.parentNode.innerHTML='📦'" />`
    : '📦';

  return `
    <div class="product-card">
      <div class="product-img-placeholder">
        ${imagenHTML}
      </div>
      <div class="product-body">
        <h3>${escapeHtml(producto.nombre)}</h3>
        <p class="desc">${escapeHtml(producto.descripcion || '')}</p>
        <div class="product-footer">
          <span class="price"><small>$</small>${escapeHtml(producto.precio || '')}</span>
          <div class="product-cantidad-selector">
            <button type="button" class="cantidad-btn" data-id="${producto.id}" data-accion="restar">−</button>
            <input type="number" class="cantidad-input" data-id="${producto.id}" value="1" min="1" max="99">
            <button type="button" class="cantidad-btn" data-id="${producto.id}" data-accion="sumar">+</button>
          </div>
          <div class="product-actions">
            <a href="https://wa.me/542317401056?text=${encodeURIComponent(`Hola! Quiero consultar por ${producto.nombre}`)}" target="_blank" rel="noopener" class="btn-sm">
              Consultar
            </a>
            <button type="button" class="btn-sm btn-add-cart" data-id="${producto.id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById('productos-grid');
  if (!contenedor) return;

  if (!Array.isArray(productos)) {
    productos = [];
  }

  contenedor.innerHTML = productos.map(crearTarjetaProducto).join('');
}

function asignarEventosAgregar() {
  const contenedor = document.getElementById('productos-grid');
  if (!contenedor) return;

  contenedor.addEventListener('click', function (event) {
    const boton = event.target.closest('.cantidad-btn, .btn-add-cart');
    if (!boton) return;

    const id = parseInt(boton.dataset.id, 10);
    if (Number.isNaN(id)) return;

    if (boton.classList.contains('cantidad-btn')) {
      const accion = boton.dataset.accion;
      const input = document.querySelector(`#productos-grid .cantidad-input[data-id="${id}"]`);
      if (!input) return;

      let valor = parseInt(input.value, 10);
      if (isNaN(valor) || valor < 1) valor = 1;

      if (accion === 'sumar') {
        valor = Math.min(valor + 1, 99);
      } else if (accion === 'restar') {
        valor = Math.max(valor - 1, 1);
      }

      input.value = valor;
      return;
    }

    if (boton.classList.contains('btn-add-cart')) {
      const input = document.querySelector(`#productos-grid .cantidad-input[data-id="${id}"]`);
      const cantidad = input ? parseInt(input.value, 10) : 1;
      if (!Number.isNaN(id) && typeof agregarAlCarrito === 'function') {
        agregarAlCarrito(id, cantidad);
        if (input) input.value = 1;
      }
    }
  });

  contenedor.addEventListener('change', function (event) {
    const input = event.target.closest('.cantidad-input');
    if (!input) return;
    let valor = parseInt(input.value, 10);
    if (isNaN(valor) || valor < 1) {
      input.value = 1;
    } else if (valor > 99) {
      input.value = 99;
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

cargarProductos();

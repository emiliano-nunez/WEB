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
    } else {
      productos = data;
    }
  }

  // Fallback a productos locales si Supabase no está disponible o no hay datos
  if (!productos || productos.length === 0) {
    if (window.productos && window.productos.length > 0) {
      productos = window.productos;
    } else {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }
  }

  renderizarProductos(productos);
  asignarEventosAgregar();
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById('productos-grid');
  if (!contenedor) return;

  const tarjetas = [];
  productos.forEach((producto) => {
    const imagenHTML = producto.imagen
      ? `<img src="${escapeHtml(producto.imagen)}" alt="${escapeHtml(producto.nombre)}" />`
      : '📦';

    tarjetas.push(`
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
    `);
  });

  contenedor.innerHTML = tarjetas.join('');
}

function asignarEventosAgregar() {
  const botones = document.querySelectorAll('#productos-grid .btn-add-cart');
  const botonesControl = document.querySelectorAll('#productos-grid .cantidad-btn');
  const inputs = document.querySelectorAll('#productos-grid .cantidad-input');

  // Manejar botones de cantidad
  botonesControl.forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = parseInt(this.dataset.id, 10);
      const accion = this.dataset.accion;
      const input = document.querySelector(`#productos-grid .cantidad-input[data-id="${id}"]`);
      
      if (input) {
        let valor = parseInt(input.value, 10);
        if (accion === 'sumar') {
          valor = Math.min(valor + 1, 99);
        } else if (accion === 'restar') {
          valor = Math.max(valor - 1, 1);
        }
        input.value = valor;
      }
    });
  });

  // Validar input de cantidad
  inputs.forEach((input) => {
    input.addEventListener('change', function () {
      let valor = parseInt(this.value, 10);
      if (isNaN(valor) || valor < 1) {
        this.value = 1;
      } else if (valor > 99) {
        this.value = 99;
      }
    });
  });

  // Agregar al carrito con cantidad seleccionada
  botones.forEach((boton) => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.dataset.id, 10);
      const input = document.querySelector(`#productos-grid .cantidad-input[data-id="${id}"]`);
      const cantidad = input ? parseInt(input.value, 10) : 1;
      
      if (!Number.isNaN(id) && typeof agregarAlCarrito === 'function') {
        agregarAlCarrito(id, cantidad);
        // Resetear cantidad a 1 después de agregar
        if (input) input.value = 1;
      }
    });
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

document.addEventListener('DOMContentLoaded', cargarProductos);

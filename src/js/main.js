async function cargarProductos() {
  const contenedor = document.getElementById('productos-grid');
  if (!contenedor) return;

  if (!window.supabaseClient) {
    contenedor.innerHTML = '<p>No se pudo conectar con la base de datos.</p>';
    if (typeof pintarCarrito === 'function') pintarCarrito();
    return;
  }

  contenedor.innerHTML = '<p>Cargando productos...</p>';

  const { data, error } = await window.supabaseClient
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error cargando productos desde Supabase:', error);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
    if (typeof pintarCarrito === 'function') pintarCarrito();
    return;
  }

  const productos = Array.isArray(data) ? data : [];

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
    return;
  }

  window.productos = productos;
  renderizarProductos(productos);
  if (typeof pintarCarrito === 'function') {
    pintarCarrito();
  }
  asignarEventosAgregar();
  inicializarBusquedaYOrden();
}

function obtenerPrecioNumerico(producto) {
  return parseFloat(String(producto.precio || '0').replace(/[^0-9.-]/g, '')) || 0;
}

function filtrarYOrdenar() {
  const termino = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const orden = document.querySelector('.sort-btn.active')?.dataset?.sort || 'default';
  let lista = window.productos || [];
  if (termino) {
    lista = lista.filter((p) =>
      (p.nombre || '').toLowerCase().includes(termino) ||
      (p.descripcion || '').toLowerCase().includes(termino)
    );
  }
  if (orden === 'asc') {
    lista = [...lista].sort((a, b) => obtenerPrecioNumerico(a) - obtenerPrecioNumerico(b));
  } else if (orden === 'desc') {
    lista = [...lista].sort((a, b) => obtenerPrecioNumerico(b) - obtenerPrecioNumerico(a));
  }
  renderizarProductos(lista);
  asignarEventosAgregar();
}

function inicializarBusquedaYOrden() {
  const input = document.getElementById('searchInput');
  const toolbar = document.querySelector('.sort-buttons');
  if (input) {
    input.addEventListener('input', () => filtrarYOrdenar());
  }
  if (toolbar) {
    toolbar.addEventListener('click', (e) => {
      const btn = e.target.closest('.sort-btn');
      if (!btn) return;
      toolbar.querySelectorAll('.sort-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filtrarYOrdenar();
    });
  }
}

function crearTarjetaProducto(producto) {
  const imageUrl = producto.image_url || producto.imagen || producto.image;
  const imagenHTML = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(producto.nombre)}" loading="lazy" onerror="this.parentNode.innerHTML='📦'" />`
    : '📦';

  const precioFormateado = typeof formatearPrecio === 'function'
    ? formatearPrecio(producto.precio)
    : escapeHtml(producto.precio || '');

  return `
    <div class="product-card">
      <div class="product-img-placeholder">
        ${imagenHTML}
      </div>
      <div class="product-body">
        <h3>${escapeHtml(producto.nombre)}</h3>
        <p class="desc">${escapeHtml(producto.descripcion || '')}</p>
        <div class="product-footer">
          <span class="price"><small>$</small>${precioFormateado}</span>
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

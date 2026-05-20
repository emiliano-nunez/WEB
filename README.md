# 🔧 Reflex — Reparación de Celulares & Accesorios

Sitio web moderno y responsivo para **Reflex**, especializado en reparación de celulares, tablets, computadoras y venta de accesorios de calidad.

## ✨ Características

- 📱 **Diseño Responsivo** — Optimizado para dispositivos móviles, tablets y escritorio
- 🎨 **Interfaz Moderna** — Navbar con efecto scroll, animaciones fluidas y gradientes
- 🛍️ **Catálogo Dinámico** — Sistema de productos generado con JavaScript (CRUD)
- 🎯 **Scroll Suave** — Navegación fluida con animaciones al desplazarse
- 💬 **Integración WhatsApp** — Botón flotante y enlaces de contacto directo
- ⚡ **Optimizado** — Carga rápida, estilos CSS eficientes y animaciones performantes
- 🌍 **SEO Friendly** — Estructura HTML semántica y meta etiquetas

## 🏗️ Estructura del Proyecto

```
WEB/
├── index.html                 # Página principal (HTML)
├── README.md                  # Este archivo
└── src/
    ├── styles/
    │   └── style.css         # Estilos CSS (variables, componentes, responsive)
    ├── scripts/
    │   ├── script.js         # Funcionalidades principales (navbar, scroll, etc.)
    │   └── script-crud.js    # Sistema de productos dinámico
    ├── img/
    │   ├── LOGO.ico          # Logo de la marca
    │   ├── FONDO.png         # Imagen de fondo del hero
    │   ├── fondo promo.png   # Imagen de fondo adicional
    │   └── productos/        # Imágenes de productos (1.jpg, 2.jpg, etc.)
    └── other/                # Otros recursos
```

## 🎨 Secciones del Sitio

### 1. **Navbar**
- Logo interactivo con icono
- Menú de navegación (Servicios, Productos, Contacto)
- Botón WhatsApp en el navbar
- Efecto de fondo blanco al hacer scroll
- Menú hamburguesa responsivo para móviles

### 2. **Hero/Banner Principal**
- Imagen de fondo con overlay
- Título y descripción atractiva
- Badges informativos (Tecnología, Celulares, Tablets, etc.)
- Botones de llamada a la acción (CTA)

### 3. **Servicios**
- 4 servicios principales con iconos emoji
- Reparación de pantalla
- Cambio de batería
- Limpieza y mantenimiento
- Desbloqueo & Software

### 4. **Catálogo de Productos**
- Grid de productos dinámico
- Imágenes de productos con preview
- Descripción y precio
- Botón "Consultar" que abre WhatsApp

### 5. **Footer**
- Información de la empresa
- Enlaces rápidos
- Datos de contacto
- Horario de atención
- Copyright

### 6. **Botón Flotante WhatsApp**
- Disponible en todas las páginas
- Tooltip informativo
- Se oculta al hacer scroll hacia abajo

## 🚀 Cómo Empezar

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias

### Abrir el Proyecto
1. Descargar o clonar el repositorio
2. Abrir `index.html` en el navegador
3. ¡Listo! El sitio está completamente funcional

### Con Servidor Local (Recomendado)
Para evitar problemas de CORS con imágenes:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con Live Server (VS Code)
Instalar extensión "Live Server" y hacer clic derecho en index.html > "Open with Live Server"
```

Luego acceder a `http://localhost:8000` (o el puerto que se indique)

## 💻 Tecnologías Utilizadas

- **HTML5** — Estructura semántica
- **CSS3** — Estilos modernos con variables CSS, Flexbox, Grid
- **JavaScript Vanilla** — Sin dependencias externas
- **Google Fonts** — Tipografía Inter (14px-32px, pesos 400-800)

## 🔧 Personalización

### Cambiar Productos
Editar `src/scripts/script-crud.js`:
```javascript
const productos = [
  {
    id: 1,
    imagen: "src/img/productos/1.jpg",
    nombre: "Tu Producto",
    descripcion: "Descripción del producto",
    precio: "10.000"
  },
  // ... más productos
];
```

### Colores y Temas
Modificar variables CSS en `src/styles/style.css`:
```css
:root {
  --accent: #f5a800;           /* Color principal */
  --bg-dark: #0b0f19;          /* Fondo oscuro */
  --whatsapp: #25d366;         /* Verde WhatsApp */
  /* más variables... */
}
```

### Información de Contacto
Actualizar enlaces WhatsApp en:
- Navbar: modificar `href="https://wa.me/542317401056"`
- Footer: actualizar número de teléfono
- Botón flotante: cambiar número en `id="floatingWhatsapp"`

## 📱 Responsividad

El sitio está optimizado para:
- **Móviles** — 320px - 768px
- **Tablets** — 768px - 1024px
- **Escritorio** — 1024px+

Media queries personalizados en `style.css` para cada breakpoint.

## ⚙️ Funcionalidades JavaScript

### `script.js`
- Efecto navbar con scroll
- Menú hamburguesa responsivo
- Tooltip flotante de WhatsApp
- Animaciones al hacer scroll (Intersection Observer)

### `script-crud.js`
- Sistema dinámico de productos
- Renderizado desde array de datos
- Sanitización de HTML (XSS prevention)
- Generación de enlaces WhatsApp personalizados

## 📄 Notas Importantes

- Todos los estilos están centralizados en `style.css`
- El proyecto usa **CSS Variables** para facilitar cambios globales
- Las imágenes de productos deben estar en `src/img/productos/`
- El sitio es **completamente estático** — no requiere backend
- Compatible con cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.)

## 🤝 Contacto

- 📱 **WhatsApp**: +54 2317 401056
- ✉️ **Email**: reflex.reparaciones@gmail.com
- 📍 **Ubicación**: Av. Saralegui 1071, Buenos Aires
- ⏰ **Horario**: Lunes a Sábado 9:00 - 13:00

## 📝 Licencia

Este proyecto es propiedad de Reflex. Todos los derechos reservados © 2025-2026.

---

**Versión**: 1.0  
**Última actualización**: Mayo 2026  
**Mantenedor**: Reflex Reparaciones

const encabezado = document.getElementById("encabezado");
const contenedor = document.createElement("div");

// nav: menú principal
const nav = document.createElement("nav");
nav.className = "top-menu";
nav.setAttribute("aria-label", "Menú principal");

// grupo 1: permite ir a los datos de contacto
const grupoContacto = document.createElement("div");
grupoContacto.className = "top-menu-group";

const linkContacto = document.createElement("a");
linkContacto.className = "menu-link";
linkContacto.href = "#contacto";
linkContacto.setAttribute("aria-label", "Ir directamente a la información de contacto");
linkContacto.textContent = "📍 Contacto";
grupoContacto.appendChild(linkContacto);

// grupo 2: buscador y carrito
const grupoAcciones = document.createElement("div");
grupoAcciones.className = "top-menu-group";

//Busqueda
const linkBuscar = document.createElement("a");
linkBuscar.className = "menu-link";
linkBuscar.href = "#buscar";
linkBuscar.setAttribute("aria-label", "Ir al buscador de productos");
linkBuscar.textContent = "🔎 Buscar";
grupoAcciones.appendChild(linkBuscar);

//Carrito
const linkCarrito = document.createElement("a");
linkCarrito.className = "menu-link";
linkCarrito.href = "#";
linkCarrito.setAttribute("aria-label", "Ver carrito de compras");
linkCarrito.textContent = "🛒 Carrito ";

const contadorCarrito = document.createElement("span");
contadorCarrito.setAttribute("aria-label", "0 productos en el carrito");
contadorCarrito.textContent = "(0)";
linkCarrito.appendChild(contadorCarrito);
grupoAcciones.appendChild(linkCarrito);

nav.appendChild(grupoContacto);
nav.appendChild(grupoAcciones);

// brand: título y subtítulo de la página
const brand = document.createElement("div");
brand.className = "brand";

const categorias = document.createElement("p");
categorias.textContent = "Vinos · Aperitivos · Bebidas Blancas · Selección";

const titulo = document.createElement("h1");
titulo.textContent = "Vinoteca";

const subtitulo = document.createElement("p");
subtitulo.className = "subtitle";
subtitulo.textContent =
  "Un espacio para descubrir vinos, licores y bebidas seleccionadas, con información de precios y stock disponible.";

brand.appendChild(categorias);
brand.appendChild(titulo);
brand.appendChild(subtitulo);

// armado final
contenedor.appendChild(nav);
contenedor.appendChild(brand);
encabezado.appendChild(contenedor);

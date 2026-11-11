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
linkContacto.setAttribute("aria-label", "Ir a la información de contacto");
linkContacto.textContent = "👤";
grupoContacto.appendChild(linkContacto);

// grupo 2: buscador y carrito
const grupoAcciones = document.createElement("div");
grupoAcciones.className = "top-menu-group";

//Busqueda
const linkBuscar = document.createElement("a");
linkBuscar.className = "menu-link";
linkBuscar.href = "buscar.html";//buscar.html?
linkBuscar.setAttribute("aria-label", "buscar productos");
linkBuscar.setAttribute("title", "Buscar");
linkBuscar.textContent = "🔍";
grupoAcciones.appendChild(linkBuscar);

//Carrito
const linkCarrito = document.createElement("a");
linkCarrito.className = "menu-link";
linkCarrito.href = "carrito.html";
linkCarrito.setAttribute("aria-label", "Ver carrito de compras");
linkCarrito.setAttribute("title", "Carrito de compras");
linkCarrito.textContent = "🛒";

const contadorCarrito = document.createElement("span");
contadorCarrito.setAttribute("aria-hidden", "true");
//contadorCarrito.textContent = "(0)";

linkCarrito.appendChild(contadorCarrito);
grupoAcciones.appendChild(linkCarrito);

nav.appendChild(grupoContacto);
nav.appendChild(grupoAcciones);

// brand: título y subtítulo de la página
const brand = document.createElement("div");
brand.className = "brand";
brand.id = "brand";

const categorias = document.createElement("p");
categorias.textContent = "Vinos · Aperitivos · Bebidas Blancas · Selección";

const titulo = document.createElement("h1");
titulo.textContent = encabezado.dataset.titulo || "Vinoteca";

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
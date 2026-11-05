
//modificado post servidor
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#lista-productos");

    if (!contenedor) {
        console.error("No se encontró #lista-productos.");
        return;
    }

    const CANTIDAD_POR_PAGINA = 10;

    let desde = 0;
    let totalProductos = null;
    let cargando = false;

    const botonCargarMas = document.createElement("button");
    botonCargarMas.type = "button";
    botonCargarMas.textContent = "Cargar más productos";
    botonCargarMas.className = "boton-cargar-mas";

    contenedor.after(botonCargarMas);





    async function cargarProductos() {
        if (cargando) {
            return;
        }

        if (
            totalProductos !== null &&
            desde >= totalProductos
        ) {
            botonCargarMas.hidden = true;
            return;
        }

        cargando = true;
        botonCargarMas.disabled = true;
        botonCargarMas.textContent = "Cargando...";

        try {
            //realizo solicitud al servidor
            const respuesta = await fetch(
                `/api/productos?cantidad=${CANTIDAD_POR_PAGINA}&from=${desde}`
            );

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener los productos.");
            }
            //convierto los datos obtenidos a js
            const datos = await respuesta.json();

            totalProductos = datos.total;

            datos.productos.forEach(producto => {
                crearTarjeta(producto);
            });

            desde += datos.productos.length;

            const quedanProductos = desde < totalProductos;

            botonCargarMas.hidden = !quedanProductos;
            botonCargarMas.textContent = "Cargar más productos";
        } catch (error) {
            console.error(error);
            botonCargarMas.textContent = "Reintentar";
        } finally {
            cargando = false;
            botonCargarMas.disabled = false;
        }
    }

    function crearTarjeta(producto) {
        const article = document.createElement("article");
        article.className = "product-card";

        article.dataset.productId = producto.id;
        article.dataset.productName = producto.nombre;
        article.dataset.productPrice = producto.precio;
        article.dataset.productType = producto.tipo;
        article.dataset.productVolume = producto.volumen;

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "contenedor-imagen";

        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        contenedorImagen.appendChild(imagen);

        const nombre = document.createElement("h3");
        nombre.className = "product-name";
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "price";
        precio.textContent = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(producto.precio);

        const enlace = document.createElement("a");
        enlace.href =
            `/archivos_html/paginaProducto.html?id=${encodeURIComponent(producto.id)}`;
        enlace.className = "detail-link";
        enlace.textContent = "Ver detalle";

        const formulario = document.createElement("form");
        formulario.className = "js-cart-form";

        const etiqueta = document.createElement("label");
        etiqueta.textContent = "Cantidad: ";

        const cantidad = document.createElement("input");
        cantidad.type = "number";
        cantidad.name = "cantidad";
        cantidad.min = "1";
        cantidad.max = String(producto.stock);
        cantidad.value = "1";

        etiqueta.appendChild(cantidad);

        const boton = document.createElement("button");
        boton.type = "submit";
        boton.dataset.addToCart = "true";
        boton.textContent = "Agregar al carrito";

        formulario.append(etiqueta, boton);

        article.append(
            contenedorImagen,
            nombre,
            precio,
            enlace,
            formulario
        );

        // Crear o recuperar la sección de su categoría.
        const categoria = producto.tipo || "Otros";

        let seccion = contenedor.querySelector(
            `[data-categoria="${CSS.escape(categoria)}"]`
        );

        if (!seccion) {
            seccion = document.createElement("section");
            seccion.className = "categoria-productos";
            seccion.dataset.categoria = categoria;

            const titulo = document.createElement("h2");
            titulo.className = "categoria-titulo";
            titulo.textContent = categoria;

            const grilla = document.createElement("div");
            grilla.className = "productos-grilla";

            seccion.append(titulo, grilla);
            contenedor.appendChild(seccion);
        }

        seccion.querySelector(".productos-grilla").appendChild(article);
    }

    botonCargarMas.addEventListener("click", cargarProductos);

    cargarProductos();
});

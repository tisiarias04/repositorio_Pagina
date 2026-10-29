
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#lista-productos");

    if (!contenedor) {
        console.error("No se encontró #lista-productos en el HTML.");
        return;
    }

    contenedor.replaceChildren();

    // Agrupar los productos por tipo de bebida.
    const categorias = [
        "Aperitivo",
        "Vino",
        "Vodka",
        "Whisky"
    ];

    categorias.forEach(categoria => {
        const productosCategoria = PRODUCTOS.filter(
            producto =>
                producto.tipo.toLowerCase() === categoria.toLowerCase() ||
                producto.tipo.toLowerCase() ===
                    (categoria === "Vino" ? "Vino tinto" : categoria).toLowerCase()
        );

        // No mostrar categorías que no tengan productos.
        if (productosCategoria.length === 0) {
            return;
        }

        const seccion = document.createElement("section");
        seccion.className = "categoria-productos";

        const titulo = document.createElement("h2");
        titulo.className = "categoria-titulo";
        titulo.textContent = categoria;

        const grilla = document.createElement("div");
        grilla.className = "productos-grilla";

        productosCategoria.forEach(producto => {
            const article = document.createElement("article");
            article.className = "product-card";

            article.dataset.productId = producto.id;
            article.dataset.productName = producto.nombre;
            article.dataset.productPrice = producto.precio;
            article.dataset.productType = producto.tipo;
            article.dataset.productVolume = producto.volumen;

            // Contenedor de imagen: evita que se desborde.
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
                `paginaProducto.html?id=${encodeURIComponent(producto.id)}`;
            enlace.textContent = "Ver detalle";
            enlace.className = "detail-link";

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
            cantidad.required = true;

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

            grilla.appendChild(article);
        });

        seccion.append(titulo, grilla);
        contenedor.appendChild(seccion);
    });
});


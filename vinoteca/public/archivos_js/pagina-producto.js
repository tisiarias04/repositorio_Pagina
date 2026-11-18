
//Para cada producto, y utilizando el html de paginaProducto, 
//muestra los datos del producto seleccionado (imagen, nombre, descripción, precio y 
// lista de información adicional (tipo, variedad, presentación y stock disponible)) 
document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.querySelector("#detalle-producto");

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    //busca el producto en el array PRODUCTOS (de productos.js) que tenga el id que se pasó como parámetro en la URL.

    //para buscar el producto usar el server el endpoint de GET /api/productos/:idProducto
    if (!id) {
            contenedor.textContent = "No se indicó qué producto mostrar.";
            return;
    }

    try {
        // encodeURIComponent evita problemas si el id tiene caracteres especiales.
        const respuesta = await fetch(`/api/productos/${encodeURIComponent(id)}`);

        // 404: el servidor nos dice que ese producto no existe.
        if (respuesta.status === 404) {
            contenedor.textContent = "No se encontró el producto solicitado.";
            return;
        }

        // Cualquier otro error (400, 500, etc.).
        if (!respuesta.ok) {
            throw new Error(`Error del servidor: ${respuesta.status}`);
        }

        const producto = await respuesta.json();
        mostrarProducto(producto);
    } catch (error) {
        // Entra acá si el servidor está caído o respondió con error.
        console.error(error);
        contenedor.textContent = "No se pudo cargar el producto. Intentá de nuevo más tarde.";
    }

    function mostrarProducto(producto){
        //Crea el contenedor para el producto, con su imagen, nombre, descripción, precio y
        // lista de información adicional (tipo, variedad, presentación y stock disponible).
        const layout = document.createElement("div");
        layout.className = "detail-layout";

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "contenedor-imagen";

        //Obtiene la imagen del producto y la agrega al contenedor de imagen.
        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.className = "detail-image";

        contenedorImagen.appendChild(imagen);

        const contenido = document.createElement("article");
        contenido.className = "detail-content";

        const titulo = document.createElement("h2");
        titulo.id = "producto-titulo";
        titulo.textContent = producto.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement("p");
        precio.className = "price";
        precio.textContent = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(producto.precio);

        const informacionTitulo = document.createElement("h3");
        informacionTitulo.textContent = "Información del producto";

        const informacion = document.createElement("ul");
        informacion.className = "info-list";

        //Pone cada uno de los datos del producto
        // (tipo, variedad, presentación y stock disponible) en un elemento de lista y
        // los agrega a la lista de información.
        [
            `Tipo: ${producto.tipo}`,
            `Variedad: ${producto.variedad}`,
            `Presentación: ${producto.volumen}`,
            `Stock disponible: ${producto.stock}`
        ].forEach(texto => {
            const elemento = document.createElement("li");
            elemento.textContent = texto;
            informacion.appendChild(elemento);
        });

        contenido.append(
            titulo,
            descripcion,
            precio,
            informacionTitulo,
            informacion
        );

        layout.append(contenedorImagen, contenido);
        contenedor.replaceChildren(layout);

    }
});

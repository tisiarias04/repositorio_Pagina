
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#detalle-producto");

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    const producto = PRODUCTOS.find(p => p.id === id);

    if (!producto) {
        contenedor.textContent = "No se encontró el producto solicitado.";
    } else {
        
        const layout = document.createElement("div");
        layout.className = "detail-layout";

        const contenedorImagen = document.createElement("div");
        contenedorImagen.className = "contenedor-imagen";

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

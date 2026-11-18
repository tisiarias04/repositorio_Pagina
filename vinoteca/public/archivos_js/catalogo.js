
//modificado post servidor
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#lista-productos");

    if (!contenedor) {
        console.error("No se encontró #lista-productos.");
        return;
    }

    const cantPag = 10;

    let desde = 0;
    let totalProductos = null;
    let cargando = false;

    const botonCargarMas = document.createElement("button");
    botonCargarMas.type = "button";
    botonCargarMas.textContent = "Cargar más productos";
    botonCargarMas.className = "boton-cargar-mas";

    contenedor.after(botonCargarMas);


    // Pasa los filtros que vengan en la URL de esta página como tipo, rango, etc
    const filtros = ["keyWord", "tipo", "min", "max", "vmin", "vmax"];
    const parametrosPagina = new URLSearchParams(window.location.search);

    function armarUrl() {
        const parametros = new URLSearchParams({
            cantidad: cantPag,
            from: desde
        });

        filtros.forEach(filtro => {
            const valor = parametrosPagina.get(filtro);
            if (valor) {
                parametros.set(filtro, valor);
            }
        });

        return `/api/productos?${parametros}`;
    }


    /*
    //version original de cargar productos, que carga los productos de a 10 y requiere click en el botón
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
            const respuesta = await fetch(armarUrl());

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener los productos.");
            }
            //convierto los datos obtenidos a js
            const datos = await respuesta.json();

            totalProductos = datos.total;

            if(totalProductos==0){
                const mensaje = document.createElement("p");
                mensaje.className = "sin-resultados";
                mensaje.textContent = "No se encontraron productos para lo filtrado";
                contenedor.appendChild(mensaje);
            }

            datos.productos.forEach(producto => {
                crearTarjeta(producto);
            });

            // Avisa que hay tarjetas nuevas en la página (lo escucha vinoteca.js).
            document.dispatchEvent(new Event("productos-cargados"));

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
    */ 
//version 2.0 de cargar productos, que carga automáticamente todos los productos sin necesidad de hacer click en el botón
    async function cargarProductos() {
        if (cargando) return;
        cargando = true;

        try {
            // Un bucle que se repite automáticamente mientras queden productos por cargar
            while (totalProductos === null || desde < totalProductos) {
                const respuesta = await fetch(armarUrl());

                if (!respuesta.ok) {
                    throw new Error("No se pudieron obtener los productos.");
                }

                const datos = await respuesta.json();
                totalProductos = datos.total;

                if (totalProductos === 0 && desde === 0) {
                    const mensaje = document.createElement("p");
                    mensaje.className = "sin-resultados";
                    mensaje.textContent = "No se encontraron productos para lo filtrado";
                    contenedor.appendChild(mensaje);
                    break;
                }

                datos.productos.forEach(producto => {
                    crearTarjeta(producto);
                });

                desde += datos.productos.length;
            }

            // Avisa que ya se cargaron todos los productos
            document.dispatchEvent(new Event("productos-cargados"));
            
            // Ocultamos el botón por completo ya que se cargó todo automático
            botonCargarMas.hidden = true;

        } catch (error) {
            console.error(error);
        } finally {
            cargando = false;
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
    //En caso de utilizar la version 1 de cargar producto, esta linea se tiene que descomentar para que el boton funcione
    //botonCargarMas.addEventListener("click", cargarProductos);

    cargarProductos();
});

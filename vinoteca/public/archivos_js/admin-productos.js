
(() => {
    'use strict';

    // CONSTANTES Y VARIABLES
    const API_URL = '/api/productos';

    const CANTIDAD_POR_PAGINA = 10;

    let desde = 0;
    let totalProductos = 0;

    // Si tiene un ID, estamos editando. Si es null, estamos creando un producto.
    let idProductoEditando = null;


    // ELEMENTOS DEL HTML
    const formulario = document.querySelector('#form-producto');

    const tituloFormulario = document.querySelector(
        '#titulo-formulario'
    );

    const botonGuardar = document.querySelector('#btn-guardar');

    const botonCancelar = document.querySelector('#btn-cancelar');

    const contenedorProductos = document.querySelector(
        '#lista-productos-admin'
    );

    const estadoListado = document.querySelector('#estado-listado');

    const mensajeFormulario = document.querySelector(
        '#mensaje-formulario'
    );

    const botonAnterior = document.querySelector('#btn-anterior');

    const botonSiguiente = document.querySelector('#btn-siguiente');

    const infoPaginacion = document.querySelector('#info-paginacion');


    // CARGAR PRODUCTOS DESDE LA API
    async function cargarProductos() {

        estadoListado.textContent = 'Cargando productos...';

        contenedorProductos.replaceChildren();

        try {

            // Solicitamos solamente una página de productos.
            const respuesta = await fetch(
                `${API_URL}?cantidad=${CANTIDAD_POR_PAGINA}&from=${desde}`
            );

            if (!respuesta.ok) {
                throw new Error('No se pudieron cargar los productos.');
            }

            const datos = await respuesta.json();

            totalProductos = datos.total;

            // Mostramos los productos recibidos.
            datos.productos.forEach(producto => {
                mostrarProducto(producto);
            });

            actualizarPaginacion();

            if (datos.productos.length === 0) {
                estadoListado.textContent =
                    'No hay productos registrados.';
            } else {
                estadoListado.textContent = '';
            }

        } catch (error) {

            console.error(error);

            estadoListado.textContent =
                'Ocurrió un error al cargar los productos.';
        }
    }


    // MOSTRAR UN PRODUCTO 
function mostrarProducto(producto) {

    // Creamos la tarjeta del producto.
    const articulo = document.createElement('article');
    articulo.className = 'producto-admin';

    // CONTENEDOR DE LA IMAGEN
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'contenedor-imagen';

    const imagen = document.createElement('img');

    // La ruta se obtiene del campo imagen del JSON.
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    imagen.loading = 'lazy';

    // Si la imagen no existe, mostramos un texto alternativo.
    imagen.addEventListener('error', () => {
        contenedorImagen.textContent = 'Imagen no disponible';
    }, { once: true });

    contenedorImagen.appendChild(imagen);

    // INFORMACIÓN DEL PRODUCTO
    const nombre = document.createElement('h3');
    nombre.textContent = producto.nombre;

    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = `Precio: $${producto.precio}`;

    const stock = document.createElement('p');
    stock.className = 'stock';
    stock.textContent = `Stock: ${producto.stock}`;

    const tipo = document.createElement('p');
    tipo.textContent = `Tipo: ${producto.tipo}`;

    const variedad = document.createElement('p');
    variedad.textContent = `Variedad: ${producto.variedad}`;

    const volumen = document.createElement('p');
    volumen.textContent = `Volumen: ${producto.volumen}`;

    // BOTÓN PARA EDITAR
    const botonEditar = document.createElement('button');

    botonEditar.type = 'button';
    botonEditar.className = 'btn-admin btn-editar';
    botonEditar.textContent = 'Editar producto';

    botonEditar.addEventListener('click', () => {
        cargarDatosFormulario(producto);
    });

    // Agrupamos el botón en un contenedor.
    const acciones = document.createElement('div');
    acciones.className = 'acciones';
    acciones.appendChild(botonEditar);

    // AGREGAMOS TODOS LOS ELEMENTOS A LA TARJETA
    articulo.append(
        contenedorImagen,
        nombre,
        precio,
        stock,
        tipo,
        variedad,
        volumen,
        acciones
    );

    contenedorProductos.appendChild(articulo);
}


// ACTUALIZAR PAGINACIÓN
function actualizarPaginacion() {

    const paginaActual = Math.floor(
        desde / CANTIDAD_POR_PAGINA
    ) + 1;

    const cantidadPaginas = Math.ceil(
        totalProductos / CANTIDAD_POR_PAGINA
    );

    infoPaginacion.textContent =
        `Página ${paginaActual} de ${cantidadPaginas}`;

    botonAnterior.disabled = desde === 0;

    botonSiguiente.disabled =
        desde + CANTIDAD_POR_PAGINA >= totalProductos;
}


// CARGAR DATOS EN EL FORMULARIO PARA EDITAR
function cargarDatosFormulario(producto) {

    // Guardamos el ID del producto seleccionado.
    idProductoEditando = producto.id;

    // Completamos los campos con sus valores actuales.
    formulario.elements.nombre.value = producto.nombre;

    formulario.elements.descripcion.value =
        producto.descripcion;

    formulario.elements.precio.value = producto.precio;

    formulario.elements.stock.value = producto.stock;

    formulario.elements.tipo.value = producto.tipo;

    formulario.elements.variedad.value = producto.variedad;

    formulario.elements.volumen.value = producto.volumen;

    formulario.elements.imagen.value = producto.imagen;

    tituloFormulario.textContent = 'Actualizar producto';

    botonGuardar.textContent = 'Guardar cambios';

    botonCancelar.hidden = false;

    mensajeFormulario.textContent =
        `Editando: ${producto.nombre}`;

    formulario.scrollIntoView({
        behavior: 'smooth'
    });
}

// OBTENER DATOS DEL FORMULARIO
function obtenerDatosFormulario() {

    return {
        nombre: formulario.elements.nombre.value.trim(),

        descripcion: formulario.elements.descripcion.value.trim(),

        precio: Number(formulario.elements.precio.value),

        stock: Number(formulario.elements.stock.value),

        tipo: formulario.elements.tipo.value.trim(),

        variedad: formulario.elements.variedad.value.trim(),

        volumen: formulario.elements.volumen.value.trim(),

        imagen: formulario.elements.imagen.value.trim()
    };
}

// VALIDAR DATOS
function validarProducto(producto) {

    let mensaje = '';

    if (
        !producto.nombre ||
        !producto.descripcion ||
        !producto.tipo ||
        !producto.variedad ||
        !producto.volumen ||
        !producto.imagen
    ) {

        mensaje = 'Todos los campos son obligatorios.';

    } else if (
        !Number.isFinite(producto.precio) ||
        producto.precio <= 0
    ) {

        mensaje = 'El precio debe ser mayor que cero.';

    } else if (
        !Number.isInteger(producto.stock) ||
        producto.stock < 0
    ) {

        mensaje = 'El stock debe ser un entero igual o mayor que cero.';
    }

    return mensaje;
}


// CREAR O ACTUALIZAR PRODUCTOS

async function guardarProducto(evento) {

    evento.preventDefault();

    const producto = obtenerDatosFormulario();

    const errorValidacion = validarProducto(producto);

    if (errorValidacion) {

        mensajeFormulario.textContent = errorValidacion;

        return;
    }

    try {

        let respuesta;

        if (idProductoEditando === null) {//si no hay un producto seleccionado, estamos creando uno nuevo

            // CREAR PRODUCTO: POST /api/productos

            respuesta = await fetch(API_URL, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(producto)
            });

        } else {

            // ACTUALIZAR PRODUCTO: PUT /api/productos/:id

            respuesta = await fetch(
                `${API_URL}/${encodeURIComponent(idProductoEditando)}`,
                {

                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(producto)
                }
            );
        }

        const datos = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {

            throw new Error(
                datos.error || 'No se pudo guardar el producto.'
            );
        }

        if (idProductoEditando === null) {

            mensajeFormulario.textContent =
                'Producto creado correctamente.';

        } else {

            mensajeFormulario.textContent =
                'Producto actualizado correctamente.';
        }

        // Limpiamos el formulario.
        formulario.reset();

        idProductoEditando = null;

        tituloFormulario.textContent = 'Cargar un producto';

        botonGuardar.textContent = 'Guardar producto';

        botonCancelar.hidden = true;

        // Volvemos a la primera página y recargamos.
        desde = 0;

        await cargarProductos();

    } catch (error) {

        console.error(error);

        mensajeFormulario.textContent = error.message;
    }
}


// CANCELAR EDICIÓN
function cancelarEdicion() {
// Limpiamos el formulario y volvemos al estado de creación.
    formulario.reset();

    idProductoEditando = null;

    tituloFormulario.textContent = 'Cargar un producto';

    botonGuardar.textContent = 'Guardar producto';

    botonCancelar.hidden = true;

    mensajeFormulario.textContent =
        'Se canceló la edición.';
}


// BOTONES DE PAGINACIÓN
botonAnterior.addEventListener('click', () => {

    if (desde >= CANTIDAD_POR_PAGINA) {

        desde -= CANTIDAD_POR_PAGINA;

        cargarProductos();
    }
});


botonSiguiente.addEventListener('click', () => {

    if (desde + CANTIDAD_POR_PAGINA < totalProductos) {

        desde += CANTIDAD_POR_PAGINA;

        cargarProductos();
    }
});



    // INICIALIZACIÓN
    formulario.addEventListener('submit', guardarProducto);

    botonCancelar.addEventListener('click', cancelarEdicion);

    cargarProductos();

})();

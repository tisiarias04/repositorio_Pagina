const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const { ARCHIVO_PRODUCTOS } = require("./config");

// Lee los productos del archivo JSON.
async function leerProductos() {
    const contenido = await fs.readFile(ARCHIVO_PRODUCTOS, "utf8");
    return JSON.parse(contenido);
}

// Guarda los productos en el archivo JSON.
async function guardarProductos(productos) {
    await fs.writeFile(
        ARCHIVO_PRODUCTOS,
        JSON.stringify(productos, null, 2),
        "utf8"
    );
}

// Arma un producto solo con los campos permitidos.
// Lo usan crear y actualizar, así no se repite el código.
function armarProducto(id, datos) {
    return {
        id,
        nombre: datos.nombre.trim(),
        precio: datos.precio,
        tipo: datos.tipo.trim(),
        variedad: datos.variedad.trim(),
        volumen: datos.volumen.trim(),
        stock: datos.stock,
        imagen: datos.imagen.trim(),
        descripcion: datos.descripcion.trim()
    };
}


// Normaliza el texto para comparar sin distinguir
// mayúsculas, minúsculas ni tildes.
function normalizar(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}


function cumpleFiltros(producto, filtros){
    const { keyWord, tipo, min, max, vmin, vmax } = filtros;

    if (keyWord) {
        const texto = normalizar(`${producto.nombre} ${producto.tipo} ${producto.variedad}`);
        if (!texto.includes(normalizar(keyWord))) {
            return false;
        }
    }

    if (tipo && normalizar(producto.tipo) !== normalizar(tipo)) {
        return false;
    }

    if (min !== undefined && producto.precio < min) {
        return false;
    }

    if (max !== undefined && producto.precio > max) {
        return false;
    }

    // "750 ml" -> 750
    const volumen = parseInt(producto.volumen, 10);

    if (vmin !== undefined && volumen < vmin) {
        return false;
    }

    if (vmax !== undefined && volumen > vmax) {
        return false;
    }

    return true;
}



// Devuelve una "página" de productos.
async function obtenerPagina(cantidad, from, filtros) {
    const productos = await leerProductos();
    const filtrados= productos.filter(producto => cumpleFiltros(producto, filtros));
    const resultado = filtrados.slice(from, from + cantidad);

    return {
        cantidad: resultado.length,
        from,
        total: filtrados.length,
        productos: resultado
    };
}


// Devuelve el producto o null si no existe.
async function obtenerPorId(id) {
    const productos = await leerProductos();
    return productos.find(p => String(p.id) === id) ?? null;
}


// Crea un producto nuevo y lo devuelve.
async function crear(datos) {
    const productos = await leerProductos();
    const producto = armarProducto(crypto.randomUUID(), datos);

    productos.push(producto);
    await guardarProductos(productos);

    return producto;
}


// Reemplaza un producto. Devuelve null si no existe.
async function actualizar(id, datos) {
    const productos = await leerProductos();
    const indice = productos.findIndex(p => String(p.id) === id);

    if (indice === -1) {
        return null;
    }

    const productoActualizado = armarProducto(id, datos);
    productos[indice] = productoActualizado;
    await guardarProductos(productos);

    return productoActualizado;
}

module.exports = { obtenerPagina, obtenerPorId, crear, actualizar };
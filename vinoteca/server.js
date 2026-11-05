
const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const app = express();
const PORT = 3000;
console.log("El archivo server.js se está ejecutando");
// Archivo donde se almacenan los productos.
const ARCHIVO_PRODUCTOS = path.join(
    __dirname,
    "datos",
    "productos.json"
);

// Permite recibir JSON en el cuerpo de las solicitudes.
app.use(express.json());

// Sirve los archivos HTML, CSS, JavaScript e imágenes.
app.use(express.static(path.join(__dirname, "public")));



// Lee los productos del archivo JSON.
async function leerProductos() {
    const contenido = await fs.readFile(
        ARCHIVO_PRODUCTOS,
        "utf8"
    );

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



// Valida los datos recibidos para crear o actualizar un producto.
function validarProducto(datos) {
    const errores = [];

    if (
        typeof datos.nombre !== "string" ||
        datos.nombre.trim() === ""
    ) {
        errores.push(
            "El campo 'nombre' es obligatorio y debe ser un string no vacío."
        );
    }

    if (
        typeof datos.precio !== "number" ||
        !Number.isFinite(datos.precio) ||
        datos.precio <= 0
    ) {
        errores.push(
            "El campo 'precio' debe ser un número mayor que cero."
        );
    }

    if (
        typeof datos.tipo !== "string" ||
        datos.tipo.trim() === ""
    ) {
        errores.push(
            "El campo 'tipo' es obligatorio y debe ser un string."
        );
    }

    if (
        typeof datos.stock !== "number" ||
        !Number.isInteger(datos.stock) ||
        datos.stock < 0
    ) {
        errores.push(
            "El campo 'stock' debe ser un entero mayor o igual a cero."
        );
    }

    if (
        typeof datos.variedad !== "string" ||
        datos.variedad.trim() === ""
    ) {
        errores.push(
            "El campo 'variedad' es obligatorio y debe ser un string."
        );
    }

    if (
        typeof datos.volumen !== "string" ||
        datos.volumen.trim() === ""
    ) {
        errores.push(
            "El campo 'volumen' es obligatorio y debe ser un string."
        );
    }

    if (
        typeof datos.imagen !== "string" ||
        datos.imagen.trim() === ""
    ) {
        errores.push(
            "El campo 'imagen' es obligatorio y debe ser un string."
        );
    }

    if (
        typeof datos.descripcion !== "string" ||
        datos.descripcion.trim() === ""
    ) {
        errores.push(
            "El campo 'descripcion' es obligatorio y debe ser un string."
        );
    }

    return errores;
}



// GET /api/productos?cantidad=10&from=0
// Obtiene una cantidad de productos a partir de una posición.
app.get("/api/productos", async (req, res, next) => {
    try {
        const cantidad = req.query.cantidad === undefined
            ? 10
            : Number(req.query.cantidad);

        const from = req.query.from === undefined
            ? 0
            : Number(req.query.from);

        if (
            !Number.isInteger(cantidad) ||
            cantidad < 1 ||
            cantidad > 100
        ) {
            return res.status(400).json({
                error: "El parámetro 'cantidad' debe ser un entero entre 1 y 100."
            });
        }


        if (!Number.isInteger(from) || from < 0) {
            return res.status(400).json({
                error: "El parámetro 'from' debe ser un entero mayor o igual a cero."
            });
        }


        const productos = await leerProductos();

        const resultado = productos.slice(
            from,
            from + cantidad
        );

        res.json({
            cantidad: resultado.length,
            from,
            total: productos.length,
            productos: resultado
        });
    } catch (error) {
        next(error);
    }
});



// GET /api/productos/:idProducto
// Obtiene un producto por su identificador.
app.get("/api/productos/:idProducto", async (req, res, next) => {
    try {
        const { idProducto } = req.params;
        const productos = await leerProductos();

        const producto = productos.find(
            p => String(p.id) === idProducto
        );

        if (!producto) {
            return res.status(404).json({
                error: `No se encontró el producto con ID '${idProducto}'.`
            });
        }

        res.json(producto);
    } catch (error) {
        next(error);
    }
});



// POST /api/productos
// Crea un producto nuevo.
app.post("/api/productos", async (req, res, next) => {
    try {
        const datos = req.body;

        if (
            datos === null ||
            typeof datos !== "object" ||
            Array.isArray(datos)
        ) {
            return res.status(400).json({
                error: "El cuerpo de la solicitud debe ser un objeto JSON."
            });
        }

        const errores = validarProducto(datos);

        if (errores.length > 0) {
            return res.status(400).json({
                error: "Los datos del producto no son válidos.",
                detalles: errores
            });
        }

        const productos = await leerProductos();

        const producto = {
            id: crypto.randomUUID(),
            nombre: datos.nombre.trim(),
            precio: datos.precio,
            tipo: datos.tipo.trim(),
            variedad: datos.variedad.trim(),
            volumen: datos.volumen.trim(),
            stock: datos.stock,
            imagen: datos.imagen.trim(),
            descripcion: datos.descripcion.trim()
        };

        productos.push(producto);

        await guardarProductos(productos);

        res.status(201).json(producto);
    } catch (error) {
        next(error);
    }
});



// PUT /api/productos/:idProducto
// Actualiza todos los datos de un producto existente.
app.put("/api/productos/:idProducto", async (req, res, next) => {
    try {
        const { idProducto } = req.params;
        const datos = req.body;

        if (
            datos === null ||
            typeof datos !== "object" ||
            Array.isArray(datos)
        ) {
            return res.status(400).json({
                error: "El cuerpo de la solicitud debe ser un objeto JSON."
            });
        }

        const errores = validarProducto(datos);

        if (errores.length > 0) {
            return res.status(400).json({
                error: "Los datos del producto no son válidos.",
                detalles: errores
            });
        }

        const productos = await leerProductos();

        const indice = productos.findIndex(
            p => p.id === idProducto
        );

        if (indice === -1) {
            return res.status(404).json({
                error: `No se encontró el producto con ID '${idProducto}'.`
            });
        }

        const productoActualizado = {
            id: idProducto,
            nombre: datos.nombre.trim(),
            precio: datos.precio,
            tipo: datos.tipo.trim(),
            variedad: datos.variedad.trim(),
            volumen: datos.volumen.trim(),
            stock: datos.stock,
            imagen: datos.imagen.trim(),
            descripcion: datos.descripcion.trim()
        };

        productos[indice] = productoActualizado;

        await guardarProductos(productos);

        res.json(productoActualizado);
    } catch (error) {
        next(error);
    }
});



// Manejo de errores de JSON inválido.
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            error: "El JSON enviado no tiene un formato válido."
        });
    }

    console.error(error);

    res.status(500).json({
        error: "Ocurrió un error interno en el servidor."
    });
});
console.log("Intentando iniciar el servidor...");
// Inicia el servidor.
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

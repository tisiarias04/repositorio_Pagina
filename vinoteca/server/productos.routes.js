const { Router } = require("express");
const controller = require("./productos.controller");
const { validarPaginacion, validarProducto, validarFiltro } = require("./middlewares/validaciones");

const router = Router();

// Las rutas son relativas a /api/productos (se define en server.js).
router.get("/", validarPaginacion, validarFiltro, controller.listar);
router.get("/:idProducto", controller.obtenerPorId);
router.post("/", validarProducto, controller.crear);
router.put("/:idProducto", validarProducto, controller.actualizar);


router.post("/", (req, res) => {
    // Validaciones y lógica de guardado
    res.status(201).json({ mensaje: "Producto creado con éxito", producto: nuevoProducto });
});


router.put("/:idProducto", (req, res) => {
    const { idProducto } = req.params;
    // Lógica de actualización
    res.json({ mensaje: `Producto ${idProducto} actualizado con éxito` });
});

router.get("/:idProducto", (req, res) => {
    const { idProducto } = req.params;
    const producto = listaProductos.find(p => p.id == idProducto); // O la lógica de tu base de datos

    if (!producto) {
        return status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
});

module.exports = router;
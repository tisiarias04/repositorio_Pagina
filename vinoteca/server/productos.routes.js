
const { Router } = require("express");
const controller = require("./productos.controller");

const {
    validarPaginacion,
    validarProducto,
    validarFiltro
} = require("./middlewares/validaciones");

const router = Router();

// ---------------------------------------------
// OBTENER VARIOS PRODUCTOS CON PAGINACIÓN
// GET /api/productos?cantidad=10&from=0
// ---------------------------------------------

router.get(
    "/",
    validarPaginacion,
    validarFiltro,
    controller.listar
);


// ---------------------------------------------
// OBTENER UN PRODUCTO POR SU ID
// GET /api/productos/:idProducto
// ---------------------------------------------

router.get(
    "/:idProducto",
    controller.obtenerPorId
);


// ---------------------------------------------
// CREAR UN PRODUCTO
// POST /api/productos
// ---------------------------------------------

router.post(
    "/",
    validarProducto,
    controller.crear
);


// ---------------------------------------------
// ACTUALIZAR UN PRODUCTO
// PUT /api/productos/:idProducto
// ---------------------------------------------

router.put(
    "/:idProducto",
    validarProducto,
    controller.actualizar
);


module.exports = router;

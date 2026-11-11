const { Router } = require("express");
const controller = require("./productos.controller");
const { validarPaginacion, validarProducto } = require("./middlewares/validaciones");

const router = Router();

// Las rutas son relativas a /api/productos (se define en server.js).
router.get("/", validarPaginacion, controller.listar);
router.get("/:idProducto", controller.obtenerPorId);
router.post("/", validarProducto, controller.crear);
router.put("/:idProducto", validarProducto, controller.actualizar);

module.exports = router;
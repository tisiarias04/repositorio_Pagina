const productosService = require("./productos.service");

// GET /api/productos?cantidad=10&from=0
async function listar(req, res) {
    const { cantidad, from } = req.paginacion;
    const resultado = await productosService.obtenerPagina(cantidad, from);
    res.json(resultado);
}

// GET /api/productos/:idProducto
async function obtenerPorId(req, res) {
    const { idProducto } = req.params;
    const producto = await productosService.obtenerPorId(idProducto);

    if (!producto) {
        return res.status(404).json({
            error: `No se encontró el producto con ID '${idProducto}'.`
        });
    }

    res.json(producto);
}

// POST /api/productos
async function crear(req, res) {
    const producto = await productosService.crear(req.body);
    res.status(201).json(producto);
}

// PUT /api/productos/:idProducto
async function actualizar(req, res) {
    const { idProducto } = req.params;
    const producto = await productosService.actualizar(idProducto, req.body);

    if (!producto) {
        return res.status(404).json({
            error: `No se encontró el producto con ID '${idProducto}'.`
        });
    }

    res.json(producto);
}

module.exports = { listar, obtenerPorId, crear, actualizar };
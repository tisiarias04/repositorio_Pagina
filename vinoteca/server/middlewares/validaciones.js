// Valida ?cantidad= y ?from= del GET paginado.
function validarPaginacion(req, res, next) {
    const cantidad = req.query.cantidad === undefined
        ? 10
        : Number(req.query.cantidad);

    const from = req.query.from === undefined
        ? 0
        : Number(req.query.from);

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
        return res.status(400).json({
            error: "El parámetro 'cantidad' debe ser un entero entre 1 y 100."
        });
    }

    if (!Number.isInteger(from) || from < 0) {
        return res.status(400).json({
            error: "El parámetro 'from' debe ser un entero mayor o igual a cero."
        });
    }

    // Deja los valores ya convertidos para el controller.
    req.paginacion = { cantidad, from };
    next();
}


// Valida los datos recibidos para crear o actualizar un producto.
function validarProducto(req, res, next) {
    const datos = req.body;

    if (datos === null || typeof datos !== "object" || Array.isArray(datos)) {
        return res.status(400).json({
            error: "El cuerpo de la solicitud debe ser un objeto JSON."
        });
    }


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

    if (errores.length > 0) {
            return res.status(400).json({
                error: "Los datos del producto no son válidos.",
                detalles: errores
            });
    }

    next();
}
module.exports ={validarProducto, validarPaginacion};
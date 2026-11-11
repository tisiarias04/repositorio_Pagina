// Manejo de errores de JSON inválido.
// Express lo reconoce como manejador de errores porque tiene 4 parámetros.
function manejoErrores(error, req, res, next) {
    if (error instanceof SyntaxError && error.status === 400) {
            return res.status(400).json({
                error: "El JSON enviado no tiene un formato válido."
            });
        }

        console.error(error);

        res.status(500).json({
            error: "Ocurrió un error interno en el servidor."
        });
}
module.exports = manejoErrores;
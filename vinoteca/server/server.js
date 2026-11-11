const express = require("express");
const { PORT, CARPETA_PUBLICA } = require("./config");
const productosRoutes = require("./productos.routes");
const manejoErrores = require("./middlewares/manejoErrores");

const app = express();

// Convierte el body JSON de los pedidos en req.body.
app.use(express.json());

// Sirve los archivos HTML, CSS, JS e imágenes.
app.use(express.static(CARPETA_PUBLICA));

// Todas las rutas de productos cuelgan de /api/productos.
app.use("/api/productos", productosRoutes);

//manejo errores
app.use(manejoErrores);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
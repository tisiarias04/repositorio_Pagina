const path = require("node:path");

// __dirname es la carpeta config/, por eso ".." sube a vinoteca/
module.exports = {
    PORT: 3000,
    ARCHIVO_PRODUCTOS: path.join(__dirname, "..", "datos", "productos.json"),
    CARPETA_PUBLICA: path.join(__dirname, "..", "public")
};
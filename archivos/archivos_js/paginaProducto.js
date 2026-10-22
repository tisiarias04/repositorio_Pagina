const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == id) {
        const p = productos[i];
        document.getElementsByClassName ("detail-image")[0].src = p.imagen;
        document.getElementsByClassName ("detail-image")[0].alt = p.nombre;
        document.getElementsByClassName("product-type")[0].textContent = p.tipo;
        document.getElementById("producto-titulo").textContent = p.nombre;
        document.getElementById("precio").textContent = "$" + p.precio;
        document.getElementById("descripcion").textContent=p.descripcion;
        document.getElementById("presentacion").textContent = p.presentacion;
        document.getElementById("tipo-lista").textContent = p.tipo;
        document.getElementById("variedad").textContent = p.variedad;
        document.getElementById("stock").textContent = p.stock;
        document.getElementById("estado").textContent = p.estado;
    }
}
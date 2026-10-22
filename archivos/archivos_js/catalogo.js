for(const p of productos){
    let fila=document.getElementById(p.tipo);
    let tr=fila.querySelector("tr");
    tr.appendChild(crearProducto(p));
}


function crearProducto(p) {
    const td = document.createElement("td");
    const article = document.createElement("article");

    // imagen
    const div = document.createElement("div");
    div.className = "contenedor-imagen";
    const img = document.createElement("img");
    img.src = p.imagen;
    div.appendChild(img);

    //p
    const nombre = document.createElement("p");
    nombre.textContent = `${p.tipo} ${p.nombre}`;
    const precio=document.createElement("p");
    precio.textContent=`$${p.precio}`;
    nombre.appendChild(precio);

    //a
    const enlace = document.createElement("a");
    enlace.href = "paginaProducto.html?id=" + p.id;
    enlace.target = "_blank";
    const titulo = document.createElement("h2");
    titulo.textContent = "Más Información";
    enlace.appendChild(titulo);

    //form
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "cant";
    input.placeholder = "Cantidad";
    input.type = "number";
    input.min = 0;
    input.max = 99;
    const boton = document.createElement("button");
    boton.type = "submit";
    boton.textContent = "Agregar";
    form.appendChild(input);
    form.appendChild(boton);

    //armado article
    article.appendChild(div);
    article.appendChild(nombre);
    article.appendChild(enlace);
    article.appendChild(form);
    td.appendChild(article);

    return td;
}

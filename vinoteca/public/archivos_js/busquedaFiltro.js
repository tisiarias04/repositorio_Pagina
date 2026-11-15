document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-busqueda");

    if (!formulario) {
        console.error("No se encontró formulario de busqueda");
        return;
    }

    const botones=formulario.querySelectorAll("button[data-min]");

    //carga los min y max de los botones al input
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const input=(boton.closest('ul')).querySelectorAll('input[type="number"]');
            input[0].value=boton.dataset.min ?? "";
            input[1].value=boton.dataset.max ?? "";
        });

    });

    //Arma la URL solo con los campos que tienen algo escrito
    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        const datos = new FormData(formulario);

        const parametros = new URLSearchParams();
        for (const [campo, valor] of datos) {
            const limpio = valor.trim();

            if (limpio !== "") {
                parametros.set(campo, limpio);
            }
        }

        window.location.href = `estructura.html?${parametros}`;
    });
})
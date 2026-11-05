const contacto = document.getElementById("contacto");

// footer
const footer = document.createElement("footer");
footer.className = "site-footer";

const volverArriba = document.createElement("a");
volverArriba.href = "#brand";
volverArriba.setAttribute("aria-label", "Volver al inicio de la página");
volverArriba.textContent = "Volver al inicio";
footer.appendChild(volverArriba);

const grid = document.createElement("div");
grid.className = "footer-grid";

// sección contacto
const seccionContacto = document.createElement("section");
seccionContacto.setAttribute("aria-labelledby", "contacto-titulo");

const tituloContacto = document.createElement("h2");
tituloContacto.id = "contacto-titulo";
tituloContacto.textContent = "Contacto";

const address = document.createElement("address");
address.appendChild(document.createTextNode("Av. Argentina 233"));
address.appendChild(document.createElement("br"));
address.appendChild(document.createTextNode("Neuquén Capital, Argentina"));
address.appendChild(document.createElement("br"));

address.appendChild(document.createTextNode("Tel.: "));
const linkTel = document.createElement("a");
linkTel.href = "tel:+540000000000";
linkTel.textContent = "+54 000 000 0000";
address.appendChild(linkTel);
address.appendChild(document.createElement("br"));

address.appendChild(document.createTextNode("Email: "));
const linkMail = document.createElement("a");
linkMail.href = "mailto:contacto@vinoteca.com";
linkMail.textContent = "contacto@vinoteca.com";
address.appendChild(linkMail);

seccionContacto.appendChild(tituloContacto);
seccionContacto.appendChild(address);

// sección horarios
const seccionHorarios = document.createElement("section");
seccionHorarios.setAttribute("aria-labelledby", "horarios-titulo");

const tituloHorarios = document.createElement("h2");
tituloHorarios.id = "horarios-titulo";
tituloHorarios.textContent = "Horarios";

const horarios = document.createElement("p");
horarios.appendChild(document.createTextNode("Lunes a sábado"));
horarios.appendChild(document.createElement("br"));
horarios.appendChild(document.createTextNode("10:00 a 21:00"));

seccionHorarios.appendChild(tituloHorarios);
seccionHorarios.appendChild(horarios);

// sección redes sociales
const seccionRedes = document.createElement("section");
seccionRedes.setAttribute("aria-labelledby", "redes-titulo");

const tituloRedes = document.createElement("h2");
tituloRedes.id = "redes-titulo";
tituloRedes.textContent = "Redes sociales";

const listaRedes = document.createElement("ul");
listaRedes.className = "social-list";

const redes = [
  { nombre: "Instagram", url: "https://www.instagram.com/" },
  { nombre: "Facebook", url: "https://www.facebook.com/" },
  { nombre: "TikTok", url: "https://www.tiktok.com/" },
];

redes.forEach((r) => {
  const li = document.createElement("li");
  const enlace = document.createElement("a");
  enlace.href = r.url;
  enlace.target = "_blank";
  enlace.rel = "noopener";
  enlace.textContent = r.nombre;
  li.appendChild(enlace);
  listaRedes.appendChild(li);
});

seccionRedes.appendChild(tituloRedes);
seccionRedes.appendChild(listaRedes);

grid.appendChild(seccionContacto);
grid.appendChild(seccionHorarios);
grid.appendChild(seccionRedes);

// copyright
const copyright = document.createElement("p");
copyright.className = "copyright";
copyright.textContent = "© 2026 Grupo Vinoteca. Laboratorio Programación";

// armado final
footer.appendChild(grid);
footer.appendChild(copyright);
contacto.appendChild(footer);
class Producto {
  constructor(id, nombre, tipo, precio, imagen, descripcion, presentacion, variedad, stock, estado) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.precio = precio;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.presentacion = presentacion;
    this.variedad = variedad;
    this.stock = stock;
    this.estado = estado;
  }
}

const productos=[
    new Producto(1, "Viñas de Balbo Reserva", "Vino", 21000, "../img/vino.jpg",
        "El Gran Tinto presenta un desarrollo enológico más cuidado, con selección especial de uvas y un perfil más intenso, elaborado por nuestro equipo enológico para elevar la experiencia tradicional del tinto de mesa argentino.",
        "botella de 750 ml", "Magnum", 18, "Disponible para compra"),
    new Producto(2, "Echeverria", "Vino", 40000, "../img/vino-tinto.jpg",
        "Vino tinto de cuerpo medio, con notas a frutos rojos y un final suave. Ideal para acompañar carnes y pastas.",
        "botella de 750 ml", "Malbec", 12, "Disponible para compra"),
    new Producto(3, "Humberto Canale", "Vino", 30000, "../img/vino-blanco.jpg",
        "Vino blanco fresco y aromático, de acidez equilibrada. Se sirve bien frío y acompaña pescados, ensaladas y quesos suaves.",
        "botella de 750 ml", "Chardonnay", 9, "Disponible para compra"),

    new Producto(4, "Fernet Branca", "Aperitivo", 15000, "../img/fernet.jpg",
        "Aperitivo amargo a base de hierbas, un clásico para servir con cola y mucho hielo.",
        "botella de 750 ml", "Fernet", 25, "Disponible para compra"),
    new Producto(5, "Aperol", "Aperitivo", 12000, "../img/aperol.jpg",
        "Aperitivo de sabor cítrico y ligeramente amargo, base del clásico Aperol Spritz.",
        "botella de 750 ml", "Aperitivo de naranja", 20, "Disponible para compra"),
    new Producto(6, "Gancia", "Aperitivo", 10000, "../img/gancia.jpg",
        "Aperitivo a base de vino y hierbas, de sabor suave. Se toma con hielo y una rodaja de naranja.",
        "botella de 750 ml", "Americano", 0, "Sin stock"),

    new Producto(7, "Blue Label - Johnnie Walker", "Whisky", 400000, "../img/whisky2.jpg",
        "Whisky escocés blended de edición premium, de sabor complejo y suave. Se recomienda tomarlo solo o con un poco de hielo.",
        "botella de 750 ml", "Blended Scotch", 3, "Disponible para compra"),
    new Producto(8, "Red Label - Johnnie Walker", "Whisky", 50000, "../img/whisky3.jpg",
        "Whisky escocés blended de carácter intenso y especiado, muy usado en tragos largos.",
        "botella de 750 ml", "Blended Scotch", 15, "Disponible para compra"),
    new Producto(9, "Jack Daniels", "Whisky", 55000, "../img/whisky1.jpg",
        "Whisky de Tennessee madurado en barricas de roble, de sabor suave con notas dulces y ahumadas.",
        "botella de 750 ml", "Tennessee Whiskey", 14, "Disponible para compra"),

    new Producto(10, "Absolut Original", "Vodka", 20000, "../img/vodka2.jpg",
        "Vodka de sabor limpio y neutro, para tomar solo o como base de tragos.",
        "botella de 750 ml", "Vodka clásico", 22, "Disponible para compra"),
    new Producto(11, "Smirnoff Original", "Vodka", 16000, "../img/vodka3.jpg",
        "Vodka de sabor suave y limpio, versátil para coctelería.",
        "botella de 750 ml", "Vodka clásico", 30, "Disponible para compra"),
    new Producto(12, "Sernova Original", "Vodka", 15500, "../img/vodka4.jpg",
        "Vodka de sabor neutro y precio accesible, pensado para tragos y combinados.",
        "botella de 750 ml", "Vodka clásico", 17, "Disponible para compra")
];
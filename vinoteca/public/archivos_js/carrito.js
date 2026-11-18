
(() => {
    'use strict';

    const STORAGE_KEY = 'vinoteca_carrito_v1';

    const SELECTORS = {
        cards: '[data-product-id], .product-card, .producto-card, #catalogo article',
        cartCount: '[data-cart-count], #cart-count, .cart-count',
        cartContainer: '#carrito-contenido, [data-cart-items]'
    };

    const { readCard, parsePrice, formatPrice, makeElement } =
        window.Vinoteca;

    let cart = loadCart();

    // Recupera el carrito guardado.
    function loadCart() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || '[]'
            );

            if (!Array.isArray(saved)) {
                return [];
            }

            return saved
                .filter(item =>
                    item &&
                    typeof item.id === 'string' &&
                    Number(item.quantity) > 0
                )
                .map(item => ({
                    id: item.id,
                    name: String(item.name || 'Producto'),
                    price: parsePrice(item.price),
                    image: String(item.image || ''),
                    detailUrl: String(item.detailUrl || ''),
                    quantity: Math.max(
                        1,
                        Math.floor(Number(item.quantity) || 1)
                    )
                }));
        } catch (error) {
            console.warn('No se pudo leer el carrito.', error);
            return [];
        }
    }

    // Cuenta las unidades totales.
    function totalUnits() {
        return cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
    }

    // Actualiza el contador del menú.
    function updateCartCounters() {
        document.querySelectorAll(SELECTORS.cartCount)
            .forEach(element => {
                element.textContent = String(totalUnits());
            });

        document.querySelectorAll('a[href*="carrito.html"]')
            .forEach(link => {
                link.setAttribute(
                    'aria-label',
                    `Carrito de compras, ${totalUnits()} artículos`
                );
            });
    }

    // Guarda los cambios del carrito.
    function saveCart() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );
        } catch (error) {
            console.warn('No se pudo guardar el carrito.', error);
        }

        updateCartCounters();
        renderCart();
    }

    // Agrega un producto o incrementa su cantidad.
    function addToCart(product, quantity) {
        if (!product.id || !product.name || product.price <= 0) {
            alert('No se pudo identificar el producto o su precio.');
            return;
        }

        const amount = Math.floor(Number(quantity));

        if (!Number.isFinite(amount) || amount < 1) {
            alert('Ingresá una cantidad igual o mayor que 1.');
            return;
        }

        const existing = cart.find(
            item => item.id === product.id
        );

        if (existing) {
            existing.quantity += amount;
        } else {
            cart.push({
                ...product,
                quantity: amount
            });
        }

        saveCart();
        alert(`${product.name} se agregó al carrito.`);
    }

    // Busca el campo de cantidad de una tarjeta.
    function getQuantityInput(card) {
        return card.querySelector(
            'input[name="cantidad"], input[type="number"], [data-product-quantity]'
        );
    }

    // Configura los botones de compra de las tarjetas.
    function setupProductCards() {
        const cards = [
            ...document.querySelectorAll(SELECTORS.cards)
        ];

        cards.forEach(card => {
            const product = readCard(card);

            if (!product.name || product.price <= 0) {
                return;
            }

            const form = card.querySelector('form');

            const existingButton = card.querySelector(
                '[data-add-to-cart], button[type="submit"], input[type="submit"]'
            );

            // Conecta el formulario existente.
            if (form && existingButton && !form.dataset.cartReady) {
                form.dataset.cartReady = 'true';

                form.addEventListener('submit', event => {
                    event.preventDefault();

                    const quantityInput = getQuantityInput(card);

                    addToCart(
                        product,
                        quantityInput ? quantityInput.value : 1
                    );
                });
            }
            // Si no existe botón, lo crea.
            else if (
                !existingButton &&
                !card.querySelector('[data-add-to-cart]')
            ) {
                const controls = makeElement('div', 'js-cart-controls');

                const label = makeElement('label', '', 'Cantidad: ');

                const quantity = document.createElement('input');
                quantity.type = 'number';
                quantity.name = 'cantidad';
                quantity.min = '1';
                quantity.step = '1';
                quantity.value = '1';

                const button = makeElement(
                    'button',
                    '',
                    'Agregar al carrito'
                );

                button.type = 'button';
                button.dataset.addToCart = 'true';

                button.addEventListener('click', () => {
                    addToCart(product, quantity.value);
                });

                label.appendChild(quantity);
                controls.append(label, button);
                card.appendChild(controls);
            }
        });
    }

    // Muestra el contenido del carrito.
    function renderCart() {
        const container = document.querySelector(
            SELECTORS.cartContainer
        );

        if (!container) {
            return;
        }

        container.replaceChildren();

        if (!cart.length) {
            container.appendChild(
                makeElement(
                    'p',
                    'cart-empty',
                    'Tu carrito está vacío. Agregá productos desde el catálogo.'
                )
            );
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const lineTotal = item.price * item.quantity;
            total += lineTotal;

            const row = makeElement('article', 'cart-item');

            if (item.image) {
                const image = document.createElement('img');
                image.src = item.image;
                image.alt = item.name;
                image.width = 80;
                image.loading = 'lazy';

                row.appendChild(image);
            }

            const details = makeElement('div', 'cart-item-details');

            details.appendChild(
                makeElement('h3', '', item.name)
            );

            details.appendChild(
                makeElement(
                    'p',
                    '',
                    `Precio unitario: ${formatPrice(item.price)}`
                )
            );

            details.appendChild(
                makeElement(
                    'p',
                    '',
                    `Subtotal: ${formatPrice(lineTotal)}`
                )
            );

            const quantityLabel = makeElement(
                'label',
                '',
                'Cantidad: '
            );

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.step = '1';
            quantityInput.value = String(item.quantity);

            quantityInput.addEventListener('change', () => {
                const nextQuantity = Math.floor(
                    Number(quantityInput.value)
                );

                if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
                    quantityInput.value = String(item.quantity);
                    alert('La cantidad debe ser igual o mayor que 1.');
                    return;
                }

                item.quantity = nextQuantity;
                saveCart();
            });

            quantityLabel.appendChild(quantityInput);
            details.appendChild(quantityLabel);

            const removeButton = makeElement(
                'button',
                'cart-remove',
                'Quitar'
            );

            removeButton.type = 'button';

            removeButton.addEventListener('click', () => {
                cart = cart.filter(
                    cartItem => cartItem.id !== item.id
                );

                saveCart();
            });

            details.appendChild(removeButton);
            row.appendChild(details);
            container.appendChild(row);
        });

        container.appendChild(
            makeElement(
                'p',
                'cart-total',
                `Total: ${formatPrice(total)}`
            )
        );

        const clearButton = makeElement(
            'button',
            'cart-clear',
            'Vaciar carrito'
        );

        clearButton.type = 'button';

        clearButton.addEventListener('click', () => {
            if (window.confirm('¿Querés quitar todos los productos del carrito?')) {
                cart = [];
                saveCart();
            }
        });

        container.appendChild(clearButton);

        container.appendChild(
            makeElement(
                'p',
                'cart-note',
                'Este carrito es una demostración: todavía no realiza pedidos ni pagos reales.'
            )
        );
    }

    // Inicialización.
    document.addEventListener('DOMContentLoaded', () => {
        setupProductCards();
        renderCart();
        updateCartCounters();

        // Permite conectar las tarjetas que crea catalogo.js.
        document.addEventListener('productos-cargados', () => {
            setupProductCards();
        });
    });

})();

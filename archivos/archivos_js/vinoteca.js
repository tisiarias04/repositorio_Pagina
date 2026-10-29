
/*
 * vinoteca.js
 *
 * Funcionalidades:
 * - Búsqueda y filtros de productos.
 * - Agregar productos al carrito.
 * - Modificar cantidades y eliminar productos.
 * - Guardar el carrito en localStorage.
 * - Mostrar el total de la compra.
 *
 * Importante: esta versión no procesa pagos ni valida
 * el stock en un servidor.
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'vinoteca_carrito_v1';

    const SELECTORS = {
        cards: '[data-product-id], .product-card, .producto-card, #catalogo article',
        searchForm: '[data-search-form], #form-busqueda, .barra-busqueda',
        searchInput: '[name="q"], [name="buscar"], #buscar-producto, #busqueda',
        cartCount: '[data-cart-count], #cart-count, .cart-count',
        cartContainer: '#carrito-contenido, [data-cart-items]',
        typeFilter: '[data-filter="type"]',
        minPriceFilter: '[data-filter="min-price"]',
        maxPriceFilter: '[data-filter="max-price"]',
        volumeFilter: '[data-filter="volume"]'
    };

    let cart = loadCart();

    // Normaliza el texto para comparar sin distinguir
    // mayúsculas, minúsculas ni tildes.
    function normalize(value) {
        return String(value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    // Convierte precios como "$21.000" en 21000.
    function parsePrice(value) {
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }

        const digits = String(value ?? '')
            .replace(/[^\d,.-]/g, '')
            .replace(/\./g, '')
            .replace(',', '.');

        const result = Number(digits);

        return Number.isFinite(result) ? result : 0;
    }

    // Muestra los precios en formato monetario argentino.
    function formatPrice(value) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(value);
    }

    // Lee los datos de una tarjeta de producto del HTML.
    function readCard(card) {
        const nameElement = card.querySelector(
            '[data-product-name], .product-name, h2, h3, h4'
        );

        const priceElement = card.querySelector(
            '[data-product-price], .price, .precio'
        );

        const image = card.querySelector('img');
        const detailLink = card.querySelector('a[href]');

        const name =
            card.dataset.productName ||
            nameElement?.textContent?.trim() ||
            'Producto sin nombre';

        const rawPrice =
            card.dataset.productPrice ||
            priceElement?.dataset.productPrice ||
            priceElement?.textContent ||
            '';

        const id =
            card.dataset.productId ||
            normalize(name)
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

        return {
            id,
            name,
            price: parsePrice(rawPrice),
            image: image?.getAttribute('src') || '',
            detailUrl: detailLink?.getAttribute('href') || '',
            type: card.dataset.productType || card.dataset.type || '',
            volume: card.dataset.productVolume || card.dataset.volume || '',
            searchableText: normalize(card.textContent)
        };
    }

    // Recupera el carrito guardado en el navegador.
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
            console.warn(
                'No se pudo leer el carrito guardado.',
                error
            );

            return [];
        }
    }

    // Guarda el carrito y actualiza la página.
    function saveCart() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );
        } catch (error) {
            console.warn(
                'No se pudo guardar el carrito.',
                error
            );
        }

        updateCartCounters();
        renderCart();
    }

    // Cuenta las unidades totales del carrito.
    function totalUnits() {
        return cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
    }

    // Actualiza los contadores del menú.
    function updateCartCounters() {
        document.querySelectorAll(
            SELECTORS.cartCount
        ).forEach(element => {
            element.textContent = String(totalUnits());
        });

        document.querySelectorAll(
            'a[href*="carrito.html"]'
        ).forEach(link => {
            link.setAttribute(
                'aria-label',
                `Carrito de compras, ${totalUnits()} artículos`
            );
        });
    }

    // Agrega un producto o incrementa su cantidad.
    function addToCart(product, quantity) {
        if (
            !product.id ||
            !product.name ||
            product.price <= 0
        ) {
            alert(
                'No se pudo identificar el producto o su precio. ' +
                'Revisá los datos del artículo en el HTML.'
            );

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
            'input[name="cantidad"], ' +
            'input[type="number"], ' +
            '[data-product-quantity]'
        );
    }

    // Conecta los botones de compra de las tarjetas.
    function setupProductCards() {
        const cards = [
            ...document.querySelectorAll(SELECTORS.cards)
        ];

        cards.forEach(card => {
            const product = readCard(card);

            if (
                !product.name ||
                product.name === 'Producto sin nombre' ||
                product.price <= 0
            ) {
                return;
            }

            const form = card.querySelector('form');

            const existingButton = card.querySelector(
                '[data-add-to-cart], ' +
                'button[type="submit"], ' +
                'input[type="submit"]'
            );

            // Si ya hay un formulario de compra,
            // conecta su evento de envío.
            if (
                form &&
                existingButton &&
                !form.dataset.cartReady
            ) {
                form.dataset.cartReady = 'true';

                form.addEventListener('submit', event => {
                    event.preventDefault();

                    const quantityInput =
                        getQuantityInput(card);

                    addToCart(
                        product,
                        quantityInput ? quantityInput.value : 1
                    );
                });
            } else if (
                !existingButton &&
                !card.querySelector('[data-add-to-cart]')
            ) {
                // Si no hay botón, lo crea automáticamente.
                const controls = document.createElement('div');
                controls.className = 'js-cart-controls';

                const label = document.createElement('label');
                label.textContent = 'Cantidad: ';

                const quantity = document.createElement('input');
                quantity.type = 'number';
                quantity.name = 'cantidad';
                quantity.min = '1';
                quantity.step = '1';
                quantity.value = '1';

                quantity.setAttribute(
                    'aria-label',
                    `Cantidad de ${product.name}`
                );

                const button = document.createElement('button');
                button.type = 'button';
                button.dataset.addToCart = 'true';
                button.textContent = 'Agregar al carrito';

                button.addEventListener('click', () => {
                    addToCart(product, quantity.value);
                });

                label.appendChild(quantity);
                controls.append(label, button);
                card.appendChild(controls);
            }
        });
    }

    // Obtiene el valor de un filtro.
    function getFilterValue(selector) {
        return document.querySelector(selector)?.value?.trim() || '';
    }

    // Aplica búsqueda y filtros a las tarjetas.
    function filterProducts(searchTerm = '') {
        const cards = [
            ...document.querySelectorAll(SELECTORS.cards)
        ];

        if (!cards.length) {
            return;
        }

        const query = normalize(searchTerm);
        const type = normalize(
            getFilterValue(SELECTORS.typeFilter)
        );

        const volume = normalize(
            getFilterValue(SELECTORS.volumeFilter)
        );

        const minValue = getFilterValue(
            SELECTORS.minPriceFilter
        );

        const maxValue = getFilterValue(
            SELECTORS.maxPriceFilter
        );

        const min = minValue === ''
            ? null
            : parsePrice(minValue);

        const max = maxValue === ''
            ? null
            : parsePrice(maxValue);

        let visibleCount = 0;

        cards.forEach(card => {
            const product = readCard(card);

            const textMatches =
                !query ||
                product.searchableText.includes(query) ||
                normalize(
                    `${product.name} ${product.type} ${product.volume}`
                ).includes(query);

            const typeMatches =
                !type ||
                type === 'todos' ||
                normalize(product.type).includes(type) ||
                product.searchableText.includes(type);

            const volumeMatches =
                !volume ||
                normalize(product.volume).includes(volume) ||
                product.searchableText.includes(volume);

            const minMatches =
                min === null || product.price >= min;

            const maxMatches =
                max === null || product.price <= max;

            const visible =
                textMatches &&
                typeMatches &&
                volumeMatches &&
                minMatches &&
                maxMatches;

            card.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        // Muestra un mensaje cuando no hay resultados.
        let message = document.querySelector(
            '[data-search-empty]'
        );

        if (!message) {
            message = document.createElement('p');
            message.dataset.searchEmpty = 'true';
            message.setAttribute('role', 'status');

            const catalog =
                document.querySelector('#catalogo') ||
                cards[0].parentElement;

            catalog?.appendChild(message);
        }

        message.textContent = visibleCount === 0
            ? 'No se encontraron productos que coincidan con la búsqueda.'
            : '';

        message.hidden = visibleCount !== 0;
    }

    // Configura el buscador y los filtros.
    function setupSearch() {
        const form = document.querySelector(
            SELECTORS.searchForm
        );

        const input = document.querySelector(
            SELECTORS.searchInput
        );

        const hasCards =
            document.querySelectorAll(SELECTORS.cards).length > 0;

        if (input && hasCards) {
            const params = new URLSearchParams(
                window.location.search
            );

            const initialQuery =
                params.get('q') ||
                params.get('buscar') ||
                '';

            if (initialQuery) {
                input.value = initialQuery;
            }

            input.addEventListener('input', () => {
                filterProducts(input.value);
            });

            filterProducts(input.value);
        }

        // Si buscar.html no contiene productos,
        // envía la búsqueda al catálogo.
        if (form && !hasCards) {
            form.addEventListener('submit', event => {
                const destination =
                    form.getAttribute('action') ||
                    'estructura.html';

                if (!input) {
                    return;
                }

                event.preventDefault();

                const url = new URL(
                    destination,
                    window.location.href
                );

                url.searchParams.set(
                    'q',
                    input.value.trim()
                );

                window.location.href = url.toString();
            });
        }

        const filters = [
            SELECTORS.typeFilter,
            SELECTORS.minPriceFilter,
            SELECTORS.maxPriceFilter,
            SELECTORS.volumeFilter
        ];

        filters.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const applyFilters = () => {
                    const query =
                        input?.value ||
                        new URLSearchParams(
                            window.location.search
                        ).get('q') ||
                        '';

                    filterProducts(query);
                };

                element.addEventListener('input', applyFilters);
                element.addEventListener('change', applyFilters);
            });
        });
    }

    // Crea elementos HTML de forma segura.
    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    // Muestra los productos, cantidades y totales del carrito.
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

            const details = makeElement(
                'div',
                'cart-item-details'
            );

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

            quantityInput.setAttribute(
                'aria-label',
                `Cantidad de ${item.name}`
            );

            quantityInput.addEventListener('change', () => {
                const nextQuantity = Math.floor(
                    Number(quantityInput.value)
                );

                if (
                    !Number.isFinite(nextQuantity) ||
                    nextQuantity < 1
                ) {
                    quantityInput.value = String(item.quantity);

                    alert(
                        'La cantidad debe ser igual o mayor que 1.'
                    );

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

        // Total general de la compra.
        container.appendChild(
            makeElement(
                'p',
                'cart-total',
                `Total: ${formatPrice(total)}`
            )
        );

        // Botón para vaciar el carrito.
        const clearButton = makeElement(
            'button',
            'cart-clear',
            'Vaciar carrito'
        );

        clearButton.type = 'button';

        clearButton.addEventListener('click', () => {
            if (
                window.confirm(
                    '¿Querés quitar todos los productos del carrito?'
                )
            ) {
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

    // Inicializa la página del carrito.
    function setupCartPage() {
        renderCart();
    }

    // Ejecuta las funciones cuando el HTML está cargado.
    document.addEventListener('DOMContentLoaded', () => {
        setupProductCards();
        setupSearch();
        setupCartPage();
        updateCartCounters();
    });

})();


(() => {
    'use strict';

    const SELECTORS = {
        cards: '[data-product-id], .product-card, .producto-card, #catalogo article',
        searchForm: '[data-search-form], #form-busqueda, .barra-busqueda',
        searchInput: '[name="q"], [name="buscar"], #buscar-producto, #busqueda',
        typeFilter: '[data-filter="type"]',
        minPriceFilter: '[data-filter="min-price"]',
        maxPriceFilter: '[data-filter="max-price"]',
        volumeFilter: '[data-filter="volume"]'
    };

    const { normalize, parsePrice, readCard } = window.Vinoteca;

    // Obtiene el valor de un filtro.
    function getFilterValue(selector) {
        return document.querySelector(selector)?.value?.trim() || '';
    }

    // Aplica la búsqueda y los filtros.
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

        const minValue = getFilterValue(SELECTORS.minPriceFilter);
        const maxValue = getFilterValue(SELECTORS.maxPriceFilter);

        const min = minValue === '' ? null : parsePrice(minValue);
        const max = maxValue === '' ? null : parsePrice(maxValue);

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

        // Mensaje cuando no hay resultados.
        let message = document.querySelector('[data-search-empty]');

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
        const form = document.querySelector(SELECTORS.searchForm);
        const input = document.querySelector(SELECTORS.searchInput);

        const hasCards =
            document.querySelectorAll(SELECTORS.cards).length > 0;

        if (input && hasCards) {
            const params = new URLSearchParams(window.location.search);

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

        // Envía la búsqueda al catálogo.
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

                url.searchParams.set('q', input.value.trim());

                window.location.href = url.toString();
            });
        }

        // Configura los filtros.
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
                        new URLSearchParams(window.location.search).get('q') ||
                        '';

                    filterProducts(query);
                };

                element.addEventListener('input', applyFilters);
                element.addEventListener('change', applyFilters);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupSearch();

        // Cuando se cargan más productos desde la API,
        // vuelve a aplicar la búsqueda y los filtros.
        document.addEventListener('productos-cargados', () => {
            const input = document.querySelector(SELECTORS.searchInput);

            const query =
                input?.value ||
                new URLSearchParams(window.location.search).get('q') ||
                '';

            filterProducts(query);
        });
    });

})();


(() => {
    'use strict';

    // Normaliza textos para comparar sin distinguir
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

    // Muestra precios en pesos argentinos.
    function formatPrice(value) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(value);
    }

    // Lee los datos de una tarjeta de producto.
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

        const id = String(
            card.dataset.productId ||
            normalize(name)
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
        );

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

    // Funciones compartidas por los demás archivos.
    window.Vinoteca = {
        normalize,
        parsePrice,
        formatPrice,
        readCard,
        makeElement
    };
})();

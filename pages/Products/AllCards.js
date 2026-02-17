import { showLoader, hideLoader } from '/assets/js/loader.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    const products = cardsDatabase.idCards; // multiple products
    const container = document.createElement('div');
    container.className = "container py-3 d-flex flex-wrap justify-content-center gap-3";

    products.forEach(product => {

        const variant = product.variants[0];

        // ===== Price Helper =====
        function getActivePrice(product, variant) {
            const now = new Date();
            const offerEnd = new Date(product.offerEndsAt);
            const isOfferActive = now < offerEnd;

            if (isOfferActive) {
                return {
                    price: variant.pricing.discountPrice,
                    originalPrice: variant.pricing.originalPrice,
                    isDiscount: true
                };
            }

            return {
                price: variant.pricing.originalPrice,
                originalPrice: null,
                isDiscount: false
            };
        }

        const priceData = getActivePrice(product, variant);

        // ===== Card Wrapper =====
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "position-relative";
        cardWrapper.style.maxWidth = "320px";
        cardWrapper.style.width = "100%";

        // ===== Card =====
        const card = document.createElement('div');
        card.className = "card shadow-sm mt-0";
        card.style.cursor = "pointer";
        card.onclick = () => {
            window.location.hash = `/card-details/:${product.id}`;
        };

        // ===== Image =====
        const img = document.createElement('img');
        img.src = product.image;
        img.className = "card-img-top";
        img.alt = product.name;

        // ===== Card Body =====
        const cardBody = document.createElement('div');
        cardBody.className = "card-body p-2";

        // ===== Discount Badge =====
        if (priceData.isDiscount) {
            const discountPercent = Math.round(
                ((priceData.originalPrice - priceData.price) / priceData.originalPrice) * 100
            );
            const badge = document.createElement('span');
            badge.className = "badge bg-danger position-absolute m-2";
            badge.innerText = discountPercent + "% OFF";
            card.appendChild(badge);
        }

        // ===== Title =====
        const title = document.createElement('h6');
        title.className = "card-title mb-1";
        title.innerText = product.name;

        // ===== Rating =====
        const rating = document.createElement('div');
        rating.className = "text-warning small mb-1";
        rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

        // ===== Price =====
        const priceBox = document.createElement('div');
        if (priceData.isDiscount) {
            priceBox.innerHTML = `<span class="fw-bold">₹${priceData.price}</span> 
                                  <span class="text-decoration-line-through text-danger ms-2">₹${priceData.originalPrice}</span>`;
        } else {
            priceBox.innerHTML = `<span class="fw-bold">₹${priceData.price}</span>`;
        }

        // ===== Append =====
        cardBody.appendChild(title);
        cardBody.appendChild(rating);
        cardBody.appendChild(priceBox);

        card.appendChild(img);
        card.appendChild(cardBody);

        cardWrapper.appendChild(card);
        container.appendChild(cardWrapper);
    });

    app.appendChild(container);
    hideLoader(); // hide loader immediately
}

// ===================== ProductGridTemplate.js =====================
import { showLoader, hideLoader } from '../assets/js/loader.js'; // path apne project ke hisaab se fix karo

export default function ProductGridTemplate(products, routePrefix) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    showLoader();

    const container = document.createElement('div');
    container.className = "container-fluid px-2 py-3";

    const row = document.createElement('div');
    row.className = "row g-3";

    products.forEach(product => {
        const variant = product.variants?.[0] || product;

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

        // ===== RESPONSIVE COLUMN FOR 2-3-4-5 CARDS =====
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "col-6 col-sm-4 col-md-3 col-lg-2";

        const card = document.createElement('div');
        card.className = "card h-100";
        card.style.cursor = "pointer";
        card.style.position = "relative";

        card.onclick = () => {
            window.location.hash = `${routePrefix}/:${product.id}`;
        };

        // IMAGE
        const imgWrapper = document.createElement('div');
        imgWrapper.style.width = "100%";
        imgWrapper.style.aspectRatio = "1 / 1";
        imgWrapper.style.overflow = "hidden";

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";

        imgWrapper.appendChild(img);

        // DISCOUNT BADGE
        if (priceData.isDiscount) {
            const discountPercent = Math.round(
                ((priceData.originalPrice - priceData.price) / priceData.originalPrice) * 100
            );
            const badge = document.createElement('span');
            badge.className = "badge bg-danger position-absolute m-2";
            badge.innerText = discountPercent + "% OFF";
            card.appendChild(badge);
        }

        // CARD BODY
        const cardBody = document.createElement('div');
        cardBody.className = "card-body p-2";

        const title = document.createElement('h6');
        title.className = "card-title mb-1 small text-truncate"; // truncate long text
        title.innerText = product.name;

        const rating = document.createElement('div');
        rating.className = "text-warning small mb-1";
        rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

        const priceBox = document.createElement('div');
        priceBox.className = "small";
        if (priceData.isDiscount) {
            priceBox.innerHTML = `
                <span class="fw-bold">₹${priceData.price}</span>
                <span class="text-decoration-line-through text-danger ms-1">₹${priceData.originalPrice}</span>
            `;
        } else {
            priceBox.innerHTML = `<span class="fw-bold">₹${priceData.price}</span>`;
        }

        cardBody.append(title, rating, priceBox);
        card.append(imgWrapper, cardBody);
        cardWrapper.appendChild(card);
        row.appendChild(cardWrapper);
    });

    container.appendChild(row);
    app.appendChild(container);

    hideLoader();
}
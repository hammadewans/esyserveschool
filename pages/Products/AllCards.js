import { showLoader, hideLoader } from '/assets/js/loader.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();
    const products = cardsDatabase.idCards;

    // ✅ container-fluid for proper mobile full width
    const container = document.createElement('div');
    container.className = "container-fluid px-2 py-3";

    const row = document.createElement('div');
    row.className = "row g-3"; // responsive gap

    products.forEach(product => {

        const variant = product.variants[0];

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

        // ✅ Responsive Column
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "col-12 col-sm-6 col-lg-4";

        const card = document.createElement('div');
        card.className = "card shadow-sm h-100 w-100";
        card.style.cursor = "pointer";
        card.onclick = () => {
            window.location.hash = `/card-details/:${product.id}`;
        };

        // ✅ Responsive Image
        const img = document.createElement('img');
        img.src = product.image;
        img.className = "card-img-top img-fluid";
        img.alt = product.name;
        img.style.objectFit = "cover";
        img.style.width = "100%";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body p-2";

        if (priceData.isDiscount) {
            const discountPercent = Math.round(
                ((priceData.originalPrice - priceData.price) / priceData.originalPrice) * 100
            );
            const badge = document.createElement('span');
            badge.className = "badge bg-danger position-absolute m-2";
            badge.innerText = discountPercent + "% OFF";
            card.appendChild(badge);
        }

        const title = document.createElement('h6');
        title.className = "card-title mb-1";
        title.innerText = product.name;

        const rating = document.createElement('div');
        rating.className = "text-warning small mb-1";
        rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

        const priceBox = document.createElement('div');
        if (priceData.isDiscount) {
            priceBox.innerHTML = `<span class="fw-bold">₹${priceData.price}</span> 
                                  <span class="text-decoration-line-through text-danger ms-2">₹${priceData.originalPrice}</span>`;
        } else {
            priceBox.innerHTML = `<span class="fw-bold">₹${priceData.price}</span>`;
        }

        cardBody.appendChild(title);
        cardBody.appendChild(rating);
        cardBody.appendChild(priceBox);

        card.appendChild(img);
        card.appendChild(cardBody);

        cardWrapper.appendChild(card);
        row.appendChild(cardWrapper);
    });

    container.appendChild(row);
    app.appendChild(container);

    // ===== Friendly Shipping Guideline Box =====
    const shippingBox = document.createElement('div');
    shippingBox.style.background = '#fff7e6'; // soft orange/yellow
    shippingBox.style.border = '1px solid #ffe5b4';
    shippingBox.style.padding = '15px 20px';
    shippingBox.style.borderRadius = '8px';
    shippingBox.style.color = '#663c00';
    shippingBox.style.fontFamily = 'Arial, sans-serif';
    shippingBox.style.fontSize = '14px';
    shippingBox.style.marginTop = '20px';

    // Heading
    const heading = document.createElement('strong');
    heading.innerText = 'Shipping Guidelines / शिपिंग दिशानिर्देश:';
    shippingBox.appendChild(heading);
    shippingBox.appendChild(document.createElement('br'));

    // Hindi sentence
    const hindiText = document.createElement('span');
    hindiText.innerText = '100 कार्ड से कम ऑर्डर करने पर, ';
    shippingBox.appendChild(hindiText);

    const hindiHighlight = document.createElement('strong');
    hindiHighlight.innerText = 'शिपिंग में ₹200 अतिरिक्त लागू हो सकता है';
    shippingBox.appendChild(hindiHighlight);
    shippingBox.appendChild(document.createTextNode('।'));
    shippingBox.appendChild(document.createElement('br'));

    // English sentence
    const englishText = document.createElement('span');
    englishText.innerText = 'For orders under 100 cards, ';
    shippingBox.appendChild(englishText);

    const englishHighlight = document.createElement('strong');
    englishHighlight.innerText = 'an extra ₹200 may apply for shipping';
    shippingBox.appendChild(englishHighlight);
    shippingBox.appendChild(document.createTextNode('.'));
    shippingBox.appendChild(document.createElement('br'));

    // Recommendation
    const recommendation = document.createElement('span');
    recommendation.innerText = '(We recommend ordering 100 or more for faster and smoother shipping!)';
    shippingBox.appendChild(recommendation);

    // Append box at the end of page
    app.appendChild(shippingBox);


    hideLoader();
}

import { showLoader, hideLoader } from '/assets/js/loader.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard(productId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    const id = productId?.replace(/^:/, "") || "";
    const product = cardsDatabase.idCards.find(p => p.id === id);

    if (!product) {
        const notFound = document.createElement('div');
        notFound.className = "text-center mt-5";
        notFound.innerText = "Product not found";
        app.appendChild(notFound);
        hideLoader();
        return;
    }

    const container = document.createElement('div');
    container.className = "container py-4";

    const row = document.createElement('div');
    row.className = "row";

    // ===== Left: Image (no zoom modal) =====
    const colImg = document.createElement('div');
    colImg.className = "col-md-6 mb-3";

    const imgCard = document.createElement('div');
    imgCard.className = "card shadow-sm";

    const img = document.createElement('img');
    img.src = product.image;
    img.className = "card-img-top";
    img.alt = product.name;
    // Remove cursor zoom
    img.style.cursor = "default";

    imgCard.appendChild(img);
    colImg.appendChild(imgCard);

    // ===== Right: Details =====
    const colDetails = document.createElement('div');
    colDetails.className = "col-md-6";

    const title = document.createElement('h2');
    title.className = "fw-bold mb-2";
    title.innerText = product.name;

    const rating = document.createElement('div');
    rating.className = "text-warning mb-3";
    rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

    // ===== Variant Buttons =====
    const variantWrapper = document.createElement('div');
    variantWrapper.className = "mb-3 d-flex gap-2";
    variantWrapper.style.flexWrap = "nowrap";

    let activeVariant = product.variants[0];

    const priceBox = document.createElement('div');
    priceBox.className = "mb-1 text-start";

    // ===== Stock Label =====
    const stockLabel = document.createElement('div');
    stockLabel.className = "mb-3 fw-bold";
    stockLabel.style.fontSize = "0.9rem";
    stockLabel.style.color = activeVariant.inStock ? "green" : "red";
    stockLabel.innerText = activeVariant.inStock ? "In Stock" : "Out of Stock";

    // ===== Update Price & Stock =====
    function updatePrice(variant) {
        const activePrice = variant.pricing.discountPrice || variant.pricing.originalPrice;
        const originalPrice = variant.pricing.originalPrice;

        priceBox.innerHTML = ""; // Clear before updating

        const priceEl = document.createElement('span');
        priceEl.className = "h3 fw-bold text-success";
        priceEl.innerText = `₹${activePrice}`;
        priceBox.appendChild(priceEl);

        if (originalPrice && originalPrice > activePrice) {
            const originalEl = document.createElement('span');
            originalEl.className = "text-decoration-line-through text-danger ms-2";
            originalEl.innerText = `₹${originalPrice}`;
            priceBox.appendChild(originalEl);

            const discountEl = document.createElement('span');
            discountEl.className = "ms-2 text-danger fw-bold";
            const discountPercent = Math.round(((originalPrice - activePrice) / originalPrice) * 100);
            discountEl.innerText = `(${discountPercent}% OFF)`;
            priceBox.appendChild(discountEl);
        }

        // Update stock
        stockLabel.style.color = variant.inStock ? "green" : "red";
        stockLabel.innerText = variant.inStock ? "In Stock" : "Out of Stock";
    }

    // ===== Create Variant Buttons =====
    product.variants.forEach((v, index) => {
        const label = document.createElement('label');
        label.className = "btn btn-light border d-flex flex-column align-items-start p-2";
        label.style.borderRadius = "0";
        label.style.minWidth = "80px";
        if (index === 0) label.classList.add('active');

        const radio = document.createElement('input');
        radio.type = "radio";
        radio.name = "variant";
        radio.value = v.variantId;
        radio.className = "d-none";
        if (index === 0) radio.checked = true;

        label.appendChild(radio);

        const spanVariant = document.createElement('span');
        spanVariant.className = "text-muted fw-bold";
        spanVariant.style.fontSize = "0.65rem";
        spanVariant.style.textTransform = "uppercase";
        spanVariant.style.marginBottom = "1px";
        spanVariant.innerText = "Variant";

        const spanSize = document.createElement('span');
        spanSize.className = "fw-bold";
        spanSize.style.fontSize = "0.95rem";
        spanSize.style.marginBottom = "1px";
        spanSize.innerText = v.lanyardType.toUpperCase();

        const spanExtra = document.createElement('span');
        spanExtra.className = "text-muted";
        spanExtra.style.fontSize = "0.65rem";
        spanExtra.innerText = "Customizable Lanyard";

        label.appendChild(spanVariant);
        label.appendChild(spanSize);
        label.appendChild(spanExtra);

        label.onclick = () => {
            activeVariant = v;
            updatePrice(v);
            Array.from(variantWrapper.children).forEach(b => b.classList.remove('active'));
            label.classList.add('active');
            radio.checked = true;
        };

        variantWrapper.appendChild(label);
    });

    const desc = document.createElement('p');
    desc.className = "mb-3";
    desc.innerText = product.description;

    const specWrapper = document.createElement('div');
    specWrapper.className = "border p-3 rounded mb-3 bg-light";

    const specTitle = document.createElement('h5');
    specTitle.className = "fw-bold mb-2";
    specTitle.innerText = "Specifications";

    const specList = document.createElement('ul');
    specList.className = "list-unstyled mb-0";

    for (const [key, value] of Object.entries(product.specifications)) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key.replace(/([A-Z_])/g, ' $1')}:</strong> ${value}`;
        specList.appendChild(li);
    }

    specWrapper.appendChild(specTitle);
    specWrapper.appendChild(specList);

    // ===== Append all right column elements =====
    colDetails.appendChild(title);
    colDetails.appendChild(rating);
    colDetails.appendChild(variantWrapper);
    colDetails.appendChild(priceBox);
    colDetails.appendChild(stockLabel);
    colDetails.appendChild(desc);
    colDetails.appendChild(specWrapper);

    row.appendChild(colImg);
    row.appendChild(colDetails);
    container.appendChild(row);
    app.appendChild(container);

    updatePrice(activeVariant);
    hideLoader();
}

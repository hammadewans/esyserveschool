import { showLoader, hideLoader } from '/assets/js/loader.js';
import { polybagDatabase } from '/assets/js/data/polybag-database.js';

export default function ProductsPolybag(productId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let countdownInterval = null;

    const id = productId?.replace(/^:/, "") || "";
    const product = polybagDatabase.polybags.find(p => p.id === id);

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

    // ===== OFFER COUNTDOWN =====
    const countdownBox = document.createElement('div');
    countdownBox.className = "w-100 mb-3";
    countdownBox.style.background = "linear-gradient(135deg,#fff5f5,#ffeaea)";
    countdownBox.style.border = "1px solid #ffd6d6";
    countdownBox.style.borderRadius = "12px";
    countdownBox.style.padding = "14px 16px";
    countdownBox.style.display = "flex";
    countdownBox.style.flexDirection = "column";
    countdownBox.style.alignItems = "center";
    countdownBox.style.justifyContent = "center";
    countdownBox.style.gap = "12px";
    countdownBox.style.textAlign = "center";
    countdownBox.style.boxShadow = "0 6px 18px rgba(220,53,69,0.08)";

    const leftText = document.createElement('div');
    leftText.style.background = "linear-gradient(45deg,#ff4d4d,#dc3545)";
    leftText.style.color = "#fff";
    leftText.style.fontSize = "0.8rem";
    leftText.style.fontWeight = "700";
    leftText.style.padding = "6px 16px";
    leftText.style.borderRadius = "50px";
    leftText.style.letterSpacing = "0.5px";
    leftText.style.boxShadow = "0 4px 10px rgba(220,53,69,0.25)";
    leftText.innerHTML = "🔥 LIMITED TIME OFFER 🔥";

    const timerWrapper = document.createElement('div');
    timerWrapper.style.display = "flex";
    timerWrapper.style.alignItems = "center";
    timerWrapper.style.justifyContent = "center";
    timerWrapper.style.gap = "10px";
    timerWrapper.style.flexWrap = "wrap";

    function createBox(labelText) {
        const box = document.createElement('div');
        box.style.background = "#ffffff";
        box.style.border = "1px solid #ffc9c9";
        box.style.borderRadius = "10px";
        box.style.padding = "8px 10px";
        box.style.minWidth = "58px";
        box.style.display = "flex";
        box.style.flexDirection = "column";
        box.style.alignItems = "center";
        box.style.justifyContent = "center";
        box.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";

        const value = document.createElement('div');
        value.style.fontSize = "1rem";
        value.style.fontWeight = "800";
        value.style.color = "#dc3545";
        value.style.lineHeight = "1";

        const label = document.createElement('div');
        label.style.fontSize = "0.6rem";
        label.style.fontWeight = "600";
        label.style.color = "#6c757d";
        label.style.marginTop = "4px";
        label.style.letterSpacing = "1px";
        label.innerText = labelText;

        box.appendChild(value);
        box.appendChild(label);

        return { box, value };
    }

    const daysObj = createBox("DAYS");
    const hoursObj = createBox("HRS");
    const minsObj = createBox("MIN");
    const secsObj = createBox("SEC");

    timerWrapper.appendChild(daysObj.box);
    timerWrapper.appendChild(hoursObj.box);
    timerWrapper.appendChild(minsObj.box);
    timerWrapper.appendChild(secsObj.box);

    countdownBox.appendChild(leftText);
    countdownBox.appendChild(timerWrapper);

    // ===== LEFT IMAGE =====
    const colImg = document.createElement('div');
    colImg.className = "col-md-6 mb-3";

    const imgCard = document.createElement('div');
    imgCard.className = "card shadow-sm";

    const img = document.createElement('img');
    img.src = product.image;
    img.className = "card-img-top";
    img.alt = product.name;
    img.style.objectFit = "cover";

    imgCard.appendChild(img);
    colImg.appendChild(imgCard);

    // ===== RIGHT DETAILS =====
    const colDetails = document.createElement('div');
    colDetails.className = "col-md-6";

    const title = document.createElement('h2');
    title.className = "fw-bold mb-2";
    title.innerText = product.name;

    const rating = document.createElement('div');
    rating.className = "text-warning mb-3";
    rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

    const priceBox = document.createElement('div');
    priceBox.className = "mb-1 text-start";

    const stockLabel = document.createElement('div');
    stockLabel.className = "mb-3 fw-bold";
    stockLabel.style.fontSize = "0.9rem";
    stockLabel.style.color = product.inStock ? "green" : "red";
    stockLabel.innerText = product.inStock ? "In Stock" : "Out of Stock";

    function updatePriceAndCountdown() {
        const now = new Date();
        const offerEnd = new Date(product.offerEndsAt);
        const isOfferActive = now < offerEnd;

        if (isOfferActive) {
            if (!countdownBox.parentElement) container.insertBefore(countdownBox, row);
            updateCountdown();
            if (!countdownInterval) {
                countdownInterval = setInterval(updateCountdown, 1000);
            }
        } else {
            if (countdownBox.parentElement) countdownBox.parentElement.remove();
            if (countdownInterval) clearInterval(countdownInterval);
        }

        const activePrice = isOfferActive ? product.pricing.discountPrice : product.pricing.originalPrice;
        const originalPrice = isOfferActive ? product.pricing.originalPrice : null;

        priceBox.innerHTML = "";

        const priceEl = document.createElement('span');
        priceEl.className = "h3 fw-bold text-success";
        priceEl.innerText = `₹${activePrice}`;
        priceBox.appendChild(priceEl);

        if (isOfferActive && originalPrice > activePrice) {
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
    }

    function updateCountdown() {
        const now = new Date();
        const offerEnd = new Date(product.offerEndsAt);
        const diff = offerEnd - now;

        if (diff <= 0) {
            if (countdownBox.parentElement) countdownBox.parentElement.remove();
            if (countdownInterval) clearInterval(countdownInterval);
            updatePriceAndCountdown();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysObj.value.innerText = days.toString().padStart(2,'0');
        hoursObj.value.innerText = hours.toString().padStart(2,'0');
        minsObj.value.innerText = minutes.toString().padStart(2,'0');
        secsObj.value.innerText = seconds.toString().padStart(2,'0');
    }

    const desc = document.createElement('p');
    desc.className = "mb-3";
    desc.innerText = product.description;

    const specWrapper = document.createElement('div');
    specWrapper.className = "mb-4";

    const specTitle = document.createElement('h5');
    specTitle.className = "fw-bold mb-3";
    specTitle.style.fontSize = "1.1rem";
    specTitle.innerText = "Product Specifications";

    const specCard = document.createElement('div');
    specCard.style.background = "#ffffff";
    specCard.style.borderRadius = "14px";
    specCard.style.overflow = "hidden";
    specCard.style.border = "1px solid #f1f1f1";

    const specBody = document.createElement('div');
    specBody.style.display = "flex";
    specBody.style.flexDirection = "column";

    Object.entries(product.specifications).forEach(([key, value], index) => {
        const item = document.createElement('div');
        item.style.padding = "14px 16px";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.gap = "4px";

        if (index !== Object.keys(product.specifications).length - 1) {
            item.style.borderBottom = "1px solid #f5f5f5";
        }

        const keySpan = document.createElement('div');
        keySpan.style.fontSize = "0.8rem";
        keySpan.style.fontWeight = "600";
        keySpan.style.color = "#6c757d";
        keySpan.innerText = key.replace(/([A-Z_])/g, ' $1');

        const valueSpan = document.createElement('div');
        valueSpan.style.fontSize = "0.95rem";
        valueSpan.style.fontWeight = "700";
        valueSpan.style.color = "#212529";
        valueSpan.innerText = value;

        if (window.innerWidth >= 768) {
            item.style.flexDirection = "row";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";
            valueSpan.style.textAlign = "right";
        }

        item.appendChild(keySpan);
        item.appendChild(valueSpan);
        specBody.appendChild(item);
    });

    specCard.appendChild(specBody);
    specWrapper.appendChild(specTitle);
    specWrapper.appendChild(specCard);

    colDetails.appendChild(title);
    colDetails.appendChild(rating);
    colDetails.appendChild(priceBox);
    colDetails.appendChild(stockLabel);
    colDetails.appendChild(desc);
    colDetails.appendChild(specWrapper);

    row.appendChild(colImg);
    row.appendChild(colDetails);
    container.appendChild(row);
    app.appendChild(container);

    updatePriceAndCountdown();
    hideLoader();
}
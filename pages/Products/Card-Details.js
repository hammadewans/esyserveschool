import { showLoader, hideLoader } from '/assets/js/loader.js';
import { cardsDatabase } from '/assets/js/data/cards-database.js';

export default function ProductsIdCard(productId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    const id = productId?.replace(/^:/, "") || "";
    const product = cardsDatabase.idCards.find(p => p.id === id);

    if (!product) {
        app.innerHTML = '<div class="text-center mt-5">Product not found</div>';
        hideLoader();
        return;
    }

    const container = document.createElement('div');
    container.className = "container py-4";

    const row = document.createElement('div');
    row.className = "row";

    // ===== Left: Image =====
    const colImg = document.createElement('div');
    colImg.className = "col-md-6 mb-3";

    const imgCard = document.createElement('div');
    imgCard.className = "card shadow-sm";

    const img = document.createElement('img');
    img.src = product.image;
    img.className = "card-img-top";
    img.alt = product.name;
    img.style.cursor = "zoom-in";

    // ===== Modal for Zoom =====
    const modalHtml = `
    <div class="modal fade" id="productImageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body text-center p-0">
            <img src="${product.image}" class="img-fluid" alt="${product.name}" id="modalImage">
          </div>
        </div>
      </div>
    </div>
    `;
    container.insertAdjacentHTML('beforeend', modalHtml);

    img.onclick = () => {
        const modalEl = document.getElementById('productImageModal');
        const bsModal = new bootstrap.Modal(modalEl, { backdrop: true });
        const modalImage = modalEl.querySelector('#modalImage');
        modalImage.src = product.image;
        bsModal.show();
    };

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

    // ===== Countdown Timer Box =====
    const countdownBox = document.createElement('div');
    countdownBox.className = "d-flex justify-content-between align-items-center border rounded p-2 mb-3 bg-light";
    countdownBox.style.fontFamily = "monospace";
    countdownBox.style.fontWeight = "bold";
    countdownBox.style.fontSize = "0.9rem";
    countdownBox.style.color = "#dc3545"; // Bootstrap danger color

    const daysBox = document.createElement('div');
    const hoursBox = document.createElement('div');
    const minsBox = document.createElement('div');
    const secsBox = document.createElement('div');

    [daysBox, hoursBox, minsBox, secsBox].forEach(box => {
        box.className = "text-center flex-fill";
        countdownBox.appendChild(box);
    });

    // ===== Variant Buttons =====
    const variantWrapper = document.createElement('div');
    variantWrapper.className = "mb-3 d-flex gap-2";
    variantWrapper.style.flexWrap = "nowrap";

    let activeVariant = product.variants[0];

    const priceBox = document.createElement('div');
    priceBox.className = "mb-3 text-start";

    // ===== Update Price and Countdown =====
    function updatePrice(variant) {
        const now = new Date();
        const offerEnd = new Date(product.offerEndsAt);
        const isOfferActive = now < offerEnd;

        if (isOfferActive) {
            // Add countdown back if not in DOM
            if (!countdownBox.parentElement) {
                colDetails.insertBefore(countdownBox, variantWrapper);
            }
            updateCountdown();
            if (!window.countdownInterval) {
                window.countdownInterval = setInterval(updateCountdown, 1000);
            }
        } else {
            // Remove countdown from DOM completely
            if (countdownBox.parentElement) {
                countdownBox.parentElement.removeChild(countdownBox);
            }
            if (window.countdownInterval) {
                clearInterval(window.countdownInterval);
                window.countdownInterval = null;
            }
        }

        const activePrice = isOfferActive ? variant.pricing.discountPrice : variant.pricing.originalPrice;
        const originalPrice = isOfferActive ? variant.pricing.originalPrice : null;

        if (isOfferActive) {
            const discountPercent = Math.round(((originalPrice - activePrice) / originalPrice) * 100);
            priceBox.innerHTML = `
                <span class="h3 fw-bold text-success">₹${activePrice}</span>
                <span class="text-decoration-line-through text-danger ms-2">₹${originalPrice}</span>
                <span class="ms-2 text-danger fw-bold">(${discountPercent}% OFF)</span>
            `;
        } else {
            priceBox.innerHTML = `<span class="h3 fw-bold">₹${activePrice}</span>`;
        }
    }

    function updateCountdown() {
        const now = new Date();
        const offerEnd = new Date(product.offerEndsAt);
        const diff = offerEnd - now;

        if (diff <= 0) {
            // Remove countdown completely
            if (countdownBox.parentElement) {
                countdownBox.parentElement.removeChild(countdownBox);
            }
            clearInterval(window.countdownInterval);
            window.countdownInterval = null;
            updatePrice(activeVariant); // revert price
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysBox.innerHTML = `${days.toString().padStart(2,'0')}<br><small>Days</small>`;
        hoursBox.innerHTML = `${hours.toString().padStart(2,'0')}<br><small>Hours</small>`;
        minsBox.innerHTML = `${minutes.toString().padStart(2,'0')}<br><small>Minutes</small>`;
        secsBox.innerHTML = `${seconds.toString().padStart(2,'0')}<br><small>Seconds</small>`;
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
            Array.from(variantWrapper.querySelectorAll('input[name="variant"]')).forEach(r => r.checked = false);
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
    colDetails.appendChild(desc);
    colDetails.appendChild(specWrapper);

    row.appendChild(colImg);
    row.appendChild(colDetails);
    container.appendChild(row);
    app.appendChild(container);

    updatePrice(activeVariant);
    hideLoader();
}

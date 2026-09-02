// assets/js/components/ProductDetailTemplate.js
import { showLoader, hideLoader } from '/assets/js/loader.js';
import { getOfferBlueprint } from '/assets/js/utils/offerBlueprint.js';

export default function ProductDetailTemplate(product, options = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    showLoader();

    let countdownInterval = null;

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
    row.className = "row g-4";

    // ================= OFFER BOX (LIGHT THEME) =================
    const countdownBox = document.createElement('div');
    countdownBox.className = "w-100 mb-3";
    countdownBox.style.background = "#f9f9f9"; // light background
    countdownBox.style.border = "2px solid #343a40"; // dark border
    countdownBox.style.borderRadius = "20px";
    countdownBox.style.padding = "20px";
    countdownBox.style.color = "#343a40"; // dark text
    countdownBox.style.display = "flex";
    countdownBox.style.flexDirection = "column";
    countdownBox.style.alignItems = "center";
    countdownBox.style.gap = "12px";
    countdownBox.style.boxShadow = "inset 0 2px 8px rgba(0,0,0,0.05)"; // soft inner shade
    countdownBox.style.transition = "all 0.3s";
    countdownBox.onmouseenter = () => countdownBox.style.transform = "scale(1.02)";
    countdownBox.onmouseleave = () => countdownBox.style.transform = "scale(1)";

    const offerText = document.createElement('div');
    offerText.innerText = "🔥 LIMITED TIME OFFER 🔥";
    offerText.style.fontWeight = "800";
    offerText.style.fontSize = "1.1rem";
    offerText.style.letterSpacing = "1px";
    offerText.style.background = "rgba(52,58,64,0.1)"; // subtle shade
    offerText.style.padding = "8px 18px";
    offerText.style.borderRadius = "50px";
    offerText.style.textAlign = "center";
    offerText.style.color = "#343a40";

    const subText = document.createElement('div');
    subText.innerText = "Grab it before it's gone!";
    subText.style.fontWeight = "600";
    subText.style.fontSize = "0.85rem";
    subText.style.opacity = "0.8";
    subText.style.color = "#495057";

    const timerWrapper = document.createElement('div');
    timerWrapper.style.display = "flex";
    timerWrapper.style.gap = "12px";

    function createBox(label) {
        const box = document.createElement('div');
        box.style.background = "#ffffff"; // inner white
        box.style.color = "#343a40"; // dark text
        box.style.borderRadius = "12px";
        box.style.padding = "12px 16px";
        box.style.minWidth = "60px";
        box.style.textAlign = "center";
        box.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)"; // subtle shadow

        const val = document.createElement('div');
        val.style.fontWeight = "800";
        val.style.fontSize = "1rem";

        const lbl = document.createElement('div');
        lbl.style.fontSize = "10px";
        lbl.style.opacity = "0.6";
        lbl.innerText = label;

        box.append(val, lbl);
        return { box, val };
    }

    const d = createBox("DAYS");
    const h = createBox("HRS");
    const m = createBox("MIN");
    const s = createBox("SEC");

    timerWrapper.append(d.box, h.box, m.box, s.box);
    countdownBox.append(offerText, subText, timerWrapper);

    // ================= IMAGE =================
    const colImg = document.createElement('div');
    colImg.className = "col-md-6";

    const img = document.createElement('img');
    img.src = product.image;
    img.className = "img-fluid w-100";
    img.style.borderRadius = "16px";
    img.style.objectFit = "cover";

    colImg.appendChild(img);

    // ================= DETAILS =================
    const colDetails = document.createElement('div');
    colDetails.className = "col-md-6";

    const title = document.createElement('h2');
    title.className = "fw-bold mb-2";
    title.innerText = product.name;

    const rating = document.createElement('div');
    rating.className = "text-warning mb-2";
    rating.innerHTML = "★★★★★ <span class='text-muted'>(5.0)</span>";

    const priceBox = document.createElement('div');
    priceBox.className = "mb-2";

    const stockLabel = document.createElement('div');
    stockLabel.className = "mb-3 fw-bold";
    stockLabel.style.fontSize = "0.9rem";

    const desc = document.createElement('p');
    desc.className = "mb-3 text-muted";
    desc.innerText = product.description;

    // ================= VARIANTS =================
    let activeVariant = null;

    if (product.variants && product.variants.length > 0) {
        const variantHeading = document.createElement('div');
        variantHeading.innerText = "VARIANTS";
        variantHeading.style.fontWeight = "700";
        variantHeading.style.fontSize = "0.9rem";
        variantHeading.style.marginBottom = "8px";
        colDetails.appendChild(variantHeading);

        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = "d-flex gap-3 mb-3";
        scrollWrapper.style.overflowX = "auto";
        scrollWrapper.style.whiteSpace = "nowrap";
        scrollWrapper.style.paddingBottom = "4px";

        product.variants.forEach((v, idx) => {
            const box = document.createElement('div');
            box.style.display = "inline-block";
            box.style.minWidth = "140px";
            box.style.border = "2px solid #ccc";
            box.style.borderRadius = "12px";
            box.style.padding = "12px";
            box.style.cursor = "pointer";
            box.style.textAlign = "center";
            box.style.transition = "all 0.2s";
            box.style.background = "#fff";
            box.style.flexShrink = "0";

            const titleEl = document.createElement('div');
            titleEl.innerText = v.title || v.id || "Variant";
            titleEl.style.fontWeight = "700";
            titleEl.style.fontSize = "1rem";

            const subEl = document.createElement('div');
            subEl.innerText = v.subtitle || "";
            subEl.style.fontSize = "0.75rem";
            subEl.style.color = "#6c757d";

            box.append(titleEl, subEl);

            box.onclick = () => {
                activeVariant = v;
                updatePrice();
                Array.from(scrollWrapper.children).forEach(b => b.style.borderColor = "#ccc");
                box.style.borderColor = "#0d6efd";
            };

            scrollWrapper.appendChild(box);

            if (idx === 0) {
                activeVariant = v;
                box.style.borderColor = "#0d6efd";
            }
        });

        colDetails.appendChild(scrollWrapper);
    }

    // ================= PRICE & STOCK =================
    function updatePrice() {
        const offerInfo = getOfferBlueprint(product, activeVariant);

        // Show/Hide offer box
        if (offerInfo.offerActive && !countdownBox.parentElement) container.prepend(countdownBox);
        else if (!offerInfo.offerActive && countdownBox.parentElement) countdownBox.remove();

        // Start countdown
        if (offerInfo.offerActive && !countdownInterval) countdownInterval = setInterval(updateTimer, 1000);
        else if (!offerInfo.offerActive && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // Price display
        priceBox.innerHTML = "";

        const wrapper = document.createElement('div');
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "10px";
        wrapper.style.flexWrap = "wrap";

        const priceEl = document.createElement('span');
        priceEl.style.fontSize = "1.6rem";
        priceEl.style.fontWeight = "800";
        priceEl.style.color = "#198754";
        priceEl.innerText = `₹${offerInfo.price}`;

        wrapper.appendChild(priceEl);

        if (offerInfo.offerActive && offerInfo.originalPrice) {
            const originalEl = document.createElement('span');
            originalEl.style.textDecoration = "line-through";
            originalEl.style.color = "#dc3545";
            originalEl.style.fontWeight = "600";
            originalEl.innerText = `₹${offerInfo.originalPrice}`;

            const discountEl = document.createElement('span');
            discountEl.innerText = `${offerInfo.discountPercent}% OFF`;
            discountEl.style.fontSize = "0.75rem";
            discountEl.style.fontWeight = "700";
            discountEl.style.padding = "4px 8px";
            discountEl.style.borderRadius = "6px";
            discountEl.style.background = "#dc3545";
            discountEl.style.color = "#fff";

            wrapper.append(originalEl, discountEl);
        }

        priceBox.appendChild(wrapper);

        // Stock
        const stock = activeVariant ? activeVariant.inStock : product.inStock;
        stockLabel.style.color = stock ? "#198754" : "#dc3545";
        stockLabel.innerText = stock ? "In Stock" : "Out of Stock";

        // Update timer immediately
        updateTimer();
    }

    function updateTimer() {
        const offerInfo = getOfferBlueprint(product, activeVariant);
        const t = offerInfo.timeLeft;
        d.val.innerText = t.days;
        h.val.innerText = t.hours;
        m.val.innerText = t.minutes;
        s.val.innerText = t.seconds;

        // Stop interval if offer expired
        if (!offerInfo.offerActive && countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            countdownBox.remove();
        }
    }

    // ================= SPECIFICATIONS =================
    const specWrapper = document.createElement('div');
    specWrapper.className = "mt-4";

    const specTitle = document.createElement('h5');
    specTitle.className = "fw-bold mb-3";
    specTitle.innerText = "Product Specifications";

    const specList = document.createElement('div');
    specList.style.display = "flex";
    specList.style.flexDirection = "column";
    specList.style.gap = "10px";

    Object.entries(product.specifications || {}).forEach(([k, v]) => {
        const item = document.createElement('div');
        item.style.padding = "10px";
        item.style.border = "1px solid #eee";
        item.style.borderRadius = "10px";
        item.style.display = "flex";
        item.style.flexDirection = "column";
        item.style.gap = "4px";

        const keyEl = document.createElement('div');
        keyEl.style.fontWeight = "700";
        keyEl.innerText = k;

        const valueEl = document.createElement('div');
        valueEl.style.color = "#6c757d";
        valueEl.innerText = v;

        item.append(keyEl, valueEl);
        specList.appendChild(item);
    });

    specWrapper.append(specTitle, specList);

    // ================= FINAL =================
    colDetails.append(title, rating, priceBox, stockLabel, desc, specWrapper);
    row.append(colImg, colDetails);
    container.appendChild(row);
    app.appendChild(container);

    if (activeVariant || product.pricing) updatePrice();
    hideLoader();
}
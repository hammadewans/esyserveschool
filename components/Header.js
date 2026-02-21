export default function Header() {
    const header = document.getElementById('header');
    header.innerHTML = '';

    // ===== Navbar =====
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-white border-bottom shadow-sm fixed-top py-3';

    const container = document.createElement('div');
    container.className = 'container d-flex align-items-center justify-content-between';

    // ===== Brand Section =====
    const brand = document.createElement('div');
    brand.className = 'd-flex align-items-center gap-2';

    const logo = document.createElement('img');
    logo.src = '/assets/images/logo.png';
    logo.alt = 'Esyserve Logo';
    logo.width = 36;
    logo.height = 36;

    const brandName = document.createElement('span');
    brandName.textContent = 'Esyserve';
    brandName.className = 'fw-bold fs-4 text-primary';

    brand.append(logo, brandName);

    // ===== Icon Buttons Wrapper =====
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'd-flex align-items-center gap-3';

    // ===== Call Icon Button =====
    const callBtn = document.createElement('a');
    callBtn.href = 'tel:8860110882';
    callBtn.className = 'd-flex align-items-center justify-content-center';
    callBtn.style.width = '40px';
    callBtn.style.height = '40px';
    callBtn.style.border = '1px solid #000';
    callBtn.style.borderRadius = '50%';
    callBtn.style.backgroundColor = '#f2f2f2';
    callBtn.style.color = '#000';
    callBtn.style.textDecoration = 'none';
    callBtn.innerHTML = `<i class="bi bi-telephone-fill fs-5"></i>`;

    // ===== WhatsApp Icon Button =====
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/918860110882';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'd-flex align-items-center justify-content-center';
    whatsappBtn.style.width = '40px';
    whatsappBtn.style.height = '40px';
    whatsappBtn.style.borderRadius = '50%';
    whatsappBtn.style.backgroundColor = '#25D366';
    whatsappBtn.style.color = '#fff';
    whatsappBtn.style.textDecoration = 'none';
    whatsappBtn.innerHTML = `<i class="bi bi-whatsapp fs-5"></i>`;

    // ===== Info "i" Icon Button (Rectangle, same size, gray) =====
    const infoBtn = document.createElement('a');
    infoBtn.href = '/#/policy'; // yahan info page link
    infoBtn.className = 'd-flex align-items-center justify-content-center';
    infoBtn.style.width = '40px';
    infoBtn.style.height = '40px';
    infoBtn.style.backgroundColor = 'transparent';
    infoBtn.style.color = '#6c757d'; // gray
    infoBtn.style.textDecoration = 'none';
    infoBtn.style.fontSize = '18px';
    infoBtn.style.borderRadius = '0'; // no circle
    infoBtn.style.padding = '0'; // padding inside for alignment

    infoBtn.innerHTML = `<i class="bi bi-info-circle"></i>`; // Bootstrap icon

    // Append all buttons
    btnWrapper.append(callBtn, whatsappBtn, infoBtn);

    container.append(brand, btnWrapper);
    nav.appendChild(container);
    header.appendChild(nav);

    // ===== Adjust page padding for fixed header =====
    adjustContentForHeader(nav);
    window.addEventListener('resize', () => adjustContentForHeader(nav));
}

// Prevent content hiding behind fixed header
function adjustContentForHeader(nav) {
    const app = document.getElementById('app');
    if (nav && app) {
        app.style.paddingTop = nav.offsetHeight + 'px';
    }
}

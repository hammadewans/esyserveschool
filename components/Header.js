export default function Header() {
    const header = document.getElementById('header');
    header.innerHTML = ''; // clear previous content

    // Navbar (fixed top)
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-white border-bottom shadow-sm py-3 fixed-top';

    // Container with justify-content-between
    const container = document.createElement('div');
    container.className = 'container mx-auto d-flex align-items-center justify-content-between';

    // Brand (logo + name)
    const brand = document.createElement('div');
    brand.className = 'd-flex align-items-center gap-2';

    const logo = document.createElement('img');
    logo.src = '/assets/images/logo.png';
    logo.alt = 'Esyserve Logo';
    logo.width = 32;
    logo.height = 32;
    logo.className = 'd-inline-block align-text-top';

    const brandName = document.createElement('span');
    brandName.textContent = 'Esyserve';
    brandName.className = 'fw-semibold text-primary fs-5';

    brand.append(logo, brandName);

    // Optional: empty div for right side (to keep space)
    const rightSpace = document.createElement('div');

    container.append(brand, rightSpace);
    nav.appendChild(container);
    header.appendChild(nav);

    // ===== Adjust page content so it's not hidden under header =====
    adjustContentForHeader(nav);
    window.addEventListener('resize', () => adjustContentForHeader(nav));
}

// Dynamically add padding-top to #app so content scrolls under fixed header
function adjustContentForHeader(nav) {
    const app = document.getElementById('app');
    if (nav && app) {
        app.style.paddingTop = nav.offsetHeight + 'px';
    }
}

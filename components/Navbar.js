export default function Navbar() {
    const footer = document.getElementById('footer');

    // Navbar
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-white border-top fixed-bottom shadow-sm';

    // Container with max-width and spacing
    const container = document.createElement('div');
    container.className = 'container-xxl d-flex justify-content-between';

    const links = [
        { name: 'Home', route: '/', icon: 'bi-house-door-fill' },
        { name: 'Students', route: '/students', icon: 'bi-people-fill' },
        { name: 'Teachers', route: '/teachers', icon: 'bi-mortarboard' },
        { name: 'School', route: '/school', icon: 'bi-buildings' }
    ];

    links.forEach(item => {
        const link = document.createElement('a');
        link.href = `#${item.route}`;
        link.dataset.route = item.route;
        link.className = 'nav-link d-flex flex-column align-items-center text-secondary small';

        // Icon
        const icon = document.createElement('i');
        icon.className = `bi ${item.icon} fs-5`;

        // Label
        const label = document.createElement('span');
        label.textContent = item.name;
        label.className = 'small';

        link.append(icon, label);
        container.appendChild(link);
    });

    nav.appendChild(container);
    footer.appendChild(nav);

    setActiveNav();
    window.addEventListener('hashchange', setActiveNav);

    // ===== Add padding to content so it's not hidden behind navbar =====
    adjustContentForNavbar(nav);
    window.addEventListener('resize', () => adjustContentForNavbar(nav));
}

// Active link highlighting
function setActiveNav() {
    const current = location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-link').forEach(link => {
        const isActive = link.dataset.route === current;
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('fw-semibold', isActive);
        link.classList.toggle('text-secondary', !isActive);
    });
}

// Dynamically add padding to the app content based on navbar height
function adjustContentForNavbar(nav) {
    const app = document.getElementById('app');
    if (nav && app) {
        app.style.paddingBottom = nav.offsetHeight + 10 + 'px';
    }
}

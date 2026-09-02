let loader = null;

export function initLoader() {
    if (loader || document.getElementById('app-loader')) return;

    loader = document.createElement('div');
    loader.id = 'app-loader';
    loader.className =
        'position-fixed top-0 start-0 w-100 h-100 d-flex ' +
        'align-items-center justify-content-center bg-dark bg-opacity-25 d-none';
    loader.style.zIndex = '1055';

    const spinnerCard = document.createElement('div');
    spinnerCard.className =
        'd-flex flex-column align-items-center justify-content-center ' +
        'p-3 bg-white rounded shadow';
    spinnerCard.style.minWidth = '120px';
    spinnerCard.style.minHeight = '120px';

    // ✅ SINGLE spinner (spinner-border)
    const spinnerIcon = document.createElement('div');
    spinnerIcon.className = 'spinner-border text-primary';
    spinnerIcon.style.width = '3rem';
    spinnerIcon.style.height = '3rem';
    spinnerIcon.setAttribute('role', 'status');

    const spinnerText = document.createElement('div');
    spinnerText.textContent = 'Loading...';
    spinnerText.className = 'mt-2 text-center text-secondary fw-semibold';
    spinnerText.style.fontSize = '0.9rem';

    spinnerCard.appendChild(spinnerIcon);
    spinnerCard.appendChild(spinnerText);
    loader.appendChild(spinnerCard);

    document.body.appendChild(loader);
}

export function showLoader() {
    loader = loader || document.getElementById('app-loader');
    loader?.classList.remove('d-none');
}

export function hideLoader() {
    loader = loader || document.getElementById('app-loader');
    loader?.classList.add('d-none');
}

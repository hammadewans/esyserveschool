import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function AutoLogin(token) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    /* ===== UI ===== */
    const container = document.createElement('div');
    container.className =
        'd-flex flex-column justify-content-center align-items-center mt-5 px-3 text-center';

    const box = document.createElement('div');
    box.className = 'w-100';
    box.style.maxWidth = '420px';

    const title = document.createElement('h4');
    title.textContent = 'Signing you in...';
    title.className = 'fw-bold mb-2';

    const message = document.createElement('p');
    message.className = 'text-muted mb-3';
    message.textContent = 'Please wait while we verify your session';

    box.append(title, message);
    container.appendChild(box);
    app.appendChild(container);

    /* ===== TOKEN CHECK ===== */
    if (!token || typeof token !== 'string') {
        title.textContent = 'Invalid Login Link';
        message.textContent = 'Token not provided.';
        return;
    }

    showLoader();

    /* ===== DECODE TOKEN ===== */
    let payload = {};

    try {
        const decoded = atob(token);
        const parsed = JSON.parse(decoded);
        payload = parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) {
        console.error(err);
        hideLoader();
        title.textContent = 'Invalid Token';
        message.textContent = 'Unable to decode login token.';
        return;
    }

    /* ===== AUDIT CHECK ===== */
    if (payload.aud !== 'esyserve-autologin') {
        hideLoader();
        title.textContent = 'Unauthorized Token';
        message.textContent = 'Token audience mismatch.';
        return;
    }

    /* ===== EXPIRY CHECK ===== */
    const now = Date.now();
    if (!payload.exp || now > payload.exp) {
        hideLoader();
        title.textContent = 'Link Expired';
        message.textContent = 'This login link has expired.';
        Toast.error('Auto-login link expired');
        return;
    }

    /* ===== CREDENTIAL CHECK ===== */
    const email = payload.email?.trim();
    const password = payload.password?.trim();

    if (!email || !password) {
        hideLoader();
        title.textContent = 'Invalid Credentials';
        message.textContent = 'Email or password missing in token.';
        return;
    }

    /* ===== LOGIN REQUEST ===== */
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('https://esyserve.top/auth/login', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            hideLoader();
            title.textContent = 'Login Failed';
            message.textContent = data || 'Unable to login with provided token';
            Toast.error(message.textContent);
            return;
        }

        Toast.success(data);
        window.location.hash = '#/';

    } catch (err) {
        console.error(err);
        hideLoader();
        title.textContent = 'Network Error';
        message.textContent = 'Please try again later.';
        Toast.error('Network error');
    }
    finally {
        hideLoader();
    }
}   
import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default function Reset() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    /* ===== Container ===== */
    const container = document.createElement('div');
    container.className =
        'd-flex flex-column justify-content-center align-items-center mt-5 px-3';

    /* ===== Form ===== */
    const form = document.createElement('form');
    form.className = 'w-100';
    form.style.maxWidth = '400px';
    form.setAttribute('novalidate', '');
    container.appendChild(form);

    /* ===== Heading ===== */
    const heading = document.createElement('h1');
    heading.textContent = 'Reset Password';
    heading.className = 'mb-1 fw-bold text-dark';
    form.appendChild(heading);

    const subHeading = document.createElement('p');
    subHeading.textContent = 'Set your new password and ePIN';
    subHeading.className = 'mb-4 text-muted';
    form.appendChild(subHeading);

    /* ===== Email ===== */
    const emailDiv = document.createElement('div');
    emailDiv.className = 'form-floating mb-3';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'resetEmail';
    emailInput.placeholder = 'Email';

    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'resetEmail');
    emailLabel.textContent = 'Email';

    emailDiv.append(emailInput, emailLabel);
    form.appendChild(emailDiv);

    /* ===== Helper: Password / ePIN Field with Eye Toggle ===== */
    const secureField = (id, labelText) => {
        const group = document.createElement('div');
        group.className = 'form-floating mb-3 position-relative';

        const input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control pe-5';
        input.id = id;
        input.placeholder = labelText;

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = labelText;

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className =
            'btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted';

        const icon = document.createElement('i');
        icon.className = 'bi bi-eye';
        toggleBtn.appendChild(icon);

        toggleBtn.addEventListener('click', () => {
            const hidden = input.type === 'password';
            input.type = hidden ? 'text' : 'password';
            icon.className = hidden ? 'bi bi-eye-slash' : 'bi bi-eye';
        });

        group.append(input, label, toggleBtn);
        return { group, input };
    };

    /* ===== Fields ===== */
    const passwordField = secureField('newPassword', 'New Password');
    const epinField = secureField('newEpin', 'New ePIN');

    form.append(passwordField.group, epinField.group);

    /* ===== Submit Button ===== */
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn btn-primary w-100 py-2 fw-semibold mb-2';
    submitBtn.textContent = 'Reset';
    form.appendChild(submitBtn);

    /* ===== Back to Login ===== */
    const backDiv = document.createElement('div');
    backDiv.className = 'text-center small';

    const backLink = document.createElement('a');
    backLink.href = '#/login';
    backLink.textContent = 'Back to Login';
    backLink.className = 'text-primary text-decoration-none fw-semibold';

    backDiv.appendChild(backLink);
    form.appendChild(backDiv);

    app.appendChild(container);

    /* ===== EVENTS ===== */
    submitBtn.addEventListener('click', async () => {
        if (!validateEmail(emailInput)) return;
        if (!validatePassword(passwordField.input)) return;
        if (!validateEpin(epinField.input)) return;

        submitBtn.disabled = true;
        showLoader();

        await resetPassword(
            emailInput.value.trim(),
            passwordField.input.value.trim(),
            epinField.input.value.trim(),
            submitBtn
        );
    });
}

/* =========================
   API CALL
   ========================= */
async function resetPassword(email, password, epin, button) {
    try {
        const fd = new FormData();
        fd.append('email', email);
        fd.append('password', password);
        fd.append('pin', epin);

        const res = await fetch('https://esyserve.top/user/reset', {
            method: 'POST',
            credentials: 'include',
            body: fd
        });

        const data = await res.json();

        if (!res.ok) {
            Toast.error(data || 'Reset failed');
            return;
        }

        Toast.success(data || 'Password reset successful');
        window.location.hash = '#/login';

    } catch (err) {
        console.error(err);
        Toast.error('Network error. Try again.');
    } finally {
        button.disabled = false;
        hideLoader();
    }
}

/* =========================
   VALIDATIONS
   ========================= */
function validateEmail(input) {
    const email = input.value.trim();
    if (!email) {
        Toast.error('Email is required.');
        input.focus();
        return false;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(email)) {
        Toast.error('Invalid email address.');
        input.focus();
        return false;
    }
    return true;
}

function validatePassword(input) {
    const p = input.value.trim();
    if (!p) {
        Toast.error('Password is required.');
        input.focus();
        return false;
    }
    if (p.length < 8) {
        Toast.error('Password must be at least 8 characters.');
        input.focus();
        return false;
    }
    if (!/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/\d/.test(p) || !/[\W_]/.test(p)) {
        Toast.error('Password must include upper, lower, number & special char.');
        input.focus();
        return false;
    }
    return true;
}

function validateEpin(input) {
    const e = input.value.trim();
    if (!e) {
        Toast.error('ePIN is required.');
        input.focus();
        return false;
    }
    if (e.length < 4) {
        Toast.error('ePIN must be at least 4 characters.');
        input.focus();
        return false;
    }
    return true;
}

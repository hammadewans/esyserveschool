import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default function Signup() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    // ===== Container =====
    const container = document.createElement('div');
    container.className =
        'd-flex flex-column justify-content-center align-items-center mt-5 px-3';

    // ===== Form =====
    const form = document.createElement('form');
    form.className = 'w-100';
    form.style.maxWidth = '400px';
    form.setAttribute('novalidate', '');
    container.appendChild(form);

    // ----- Heading -----
    const heading = document.createElement('h1');
    heading.textContent = 'Create Account';
    heading.className = 'mb-1 fw-bold text-dark';
    form.appendChild(heading);

    const subHeading = document.createElement('p');
    subHeading.textContent = 'Sign up to get started';
    subHeading.className = 'mb-4 text-muted';
    form.appendChild(subHeading);

    // ===== Helper to create password with eye toggle =====
    const createPasswordField = (id, labelText) => {
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
        toggleBtn.setAttribute('aria-label', `Toggle ${labelText} visibility`);

        const toggleIcon = document.createElement('i');
        toggleIcon.className = 'bi bi-eye';
        toggleBtn.appendChild(toggleIcon);

        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        });

        group.append(input, label, toggleBtn);
        return { group, input };
    };

    // ----- Email -----
    const emailDiv = document.createElement('div');
    emailDiv.className = 'form-floating mb-3';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'signupEmail';
    emailInput.placeholder = 'Email';

    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'signupEmail');
    emailLabel.textContent = 'Email';

    emailDiv.appendChild(emailInput);
    emailDiv.appendChild(emailLabel);
    form.appendChild(emailDiv);

    // ----- Password Fields -----
    const passwordField = createPasswordField('signupPassword', 'Password');
    const confirmPasswordField = createPasswordField('confirmPassword', 'Confirm Password');
    const epinField = createPasswordField('signupEpin', 'ePIN');
    const confirmEpinField = createPasswordField('confirmEpin', 'Confirm ePIN');

    form.append(
        passwordField.group,
        confirmPasswordField.group,
        epinField.group,
        confirmEpinField.group
    );

    // ----- Signup Button -----
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'btn btn-primary w-100 mb-2 py-2 fw-semibold';
    submitBtn.textContent = 'Sign Up';
    form.appendChild(submitBtn);

    // ----- Already have account -----
    const loginDiv = document.createElement('div');
    loginDiv.className = 'text-center small';

    const loginText = document.createElement('span');
    loginText.textContent = "Already have an account? ";

    const loginLink = document.createElement('a');
    loginLink.href = '#/login';
    loginLink.textContent = 'Login';
    loginLink.className = 'text-primary text-decoration-none fw-semibold';

    loginDiv.appendChild(loginText);
    loginDiv.appendChild(loginLink);
    form.appendChild(loginDiv);

    app.appendChild(container);

    // ===== EVENTS =====
    submitBtn.addEventListener('click', async () => {
        if (!validateEmail(emailInput)) return;
        if (!validatePassword(passwordField.input)) return;
        if (!validateConfirmPassword(passwordField.input, confirmPasswordField.input)) return;
        if (!validateEpin(epinField.input)) return;
        if (!validateConfirmEpin(epinField.input, confirmEpinField.input)) return;

        submitBtn.disabled = true;
        showLoader();

        await signupUser(
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
async function signupUser(email, password, epin, button) {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('pin', epin);

        const response = await fetch('https://esyserve.top/user/signup', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            Toast.error(data || 'Signup failed');
            return;
        }

        Toast.success(data || 'Signup successful');
        window.location.hash = '#/login';

    } catch (err) {
        Toast.error('Network error. Please try again.');
        console.error(err);
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
        Toast.error('Please enter a valid email address.');
        input.focus();
        return false;
    }
    return true;
}

function validatePassword(input) {
    const password = input.value.trim();
    if (!password) {
        Toast.error('Password is required.');
        input.focus();
        return false;
    }
    if (password.length < 8) {
        Toast.error('Password must be at least 8 characters long.');
        input.focus();
        return false;
    }
    if (!/[a-z]/.test(password)) {
        Toast.error('Password must contain at least one lowercase letter.');
        input.focus();
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        Toast.error('Password must contain at least one uppercase letter.');
        input.focus();
        return false;
    }
    if (!/\d/.test(password)) {
        Toast.error('Password must contain at least one number.');
        input.focus();
        return false;
    }
    if (!/[\W_]/.test(password)) {
        Toast.error('Password must contain at least one special character.');
        input.focus();
        return false;
    }
    return true;
}

function validateConfirmPassword(passwordInput, confirmInput) {
    if (passwordInput.value.trim() !== confirmInput.value.trim()) {
        Toast.error('Passwords do not match.');
        confirmInput.focus();
        return false;
    }
    return true;
}

function validateEpin(input) {
    const epin = input.value.trim();
    if (!epin) {
        Toast.error('ePIN is required.');
        input.focus();
        return false;
    }
    if (epin.length < 4) {
        Toast.error('ePIN must be at least 4 characters.');
        input.focus();
        return false;
    }
    return true;
}

function validateConfirmEpin(epinInput, confirmInput) {
    if (epinInput.value.trim() !== confirmInput.value.trim()) {
        Toast.error('ePINs do not match.');
        confirmInput.focus();
        return false;
    }
    return true;
}

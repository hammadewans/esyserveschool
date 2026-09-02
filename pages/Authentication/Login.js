import { showLoader, hideLoader } from '/assets/js/loader.js';

export default function Login() {
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
    heading.textContent = 'Welcome Back';
    heading.className = 'mb-1 fw-bold text-dark';
    form.appendChild(heading);

    const subHeading = document.createElement('p');
    subHeading.textContent = 'Login to your account';
    subHeading.className = 'mb-4 text-muted';
    form.appendChild(subHeading);

    // ----- Email -----
    const emailDiv = document.createElement('div');
    emailDiv.className = 'form-floating mb-3';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control';
    emailInput.id = 'loginEmail';
    emailInput.placeholder = 'Email';

    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'loginEmail');
    emailLabel.textContent = 'Email';

    emailDiv.appendChild(emailInput);
    emailDiv.appendChild(emailLabel);
    form.appendChild(emailDiv);

    // ----- Password with Toggle -----
    const passGroup = document.createElement('div');
    passGroup.className = 'form-floating mb-3 position-relative';

    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.className = 'form-control pe-5';
    passInput.id = 'loginPassword';
    passInput.placeholder = 'Password';

    const passLabel = document.createElement('label');
    passLabel.setAttribute('for', 'loginPassword');
    passLabel.textContent = 'Password';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className =
        'btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-muted';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');

    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'bi bi-eye';

    toggleBtn.appendChild(toggleIcon);

    passGroup.appendChild(passInput);
    passGroup.appendChild(passLabel);
    passGroup.appendChild(toggleBtn);
    form.appendChild(passGroup);

    toggleBtn.addEventListener('click', () => {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        toggleIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    });

    // ----- Reset Password -----
    const resetDiv = document.createElement('div');
    resetDiv.className = 'mb-3 text-end';

    const resetLink = document.createElement('a');
    resetLink.href = '#/reset';
    resetLink.textContent = 'Reset Password or ePin?';
    resetLink.className = 'small text-decoration-none';

    resetDiv.appendChild(resetLink);
    form.appendChild(resetDiv);

    // ----- Login Button -----
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className =
        'btn btn-primary w-100 mb-2 py-2 fw-semibold';
    submitBtn.textContent = 'Login';
    form.appendChild(submitBtn);

    // ----- Signup -----
    const signupDiv = document.createElement('div');
    signupDiv.className = 'text-center small';

    const signupText = document.createElement('span');
    signupText.textContent = "Don't have an account? ";

    const signupLink = document.createElement('a');
    signupLink.href = '#/signup';
    signupLink.textContent = 'Sign Up';
    signupLink.className =
        'text-primary text-decoration-none fw-semibold';

    signupDiv.appendChild(signupText);
    signupDiv.appendChild(signupLink);
    form.appendChild(signupDiv);

    app.appendChild(container);

    // ===== EVENTS =====
    submitBtn.addEventListener('click', async () => {
        if (!validateEmail(emailInput)) return;
        if (!validatePassword(passInput)) return;

        submitBtn.disabled = true;
        showLoader();

        await loginUser(
            emailInput.value.trim(),
            passInput.value.trim(),
            submitBtn
        );
    });
}

/* =========================
   API CALL (FormData)
   ========================= */
async function loginUser(email, password, button) {
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
            Toast.error(data);
            return;
        }

        Toast.success(data);
        window.location.hash = '#/';

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

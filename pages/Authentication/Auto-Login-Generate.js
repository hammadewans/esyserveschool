import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default function AutoLoginGenerate() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const el = (tag, cls) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    };

    // ===== Container =====
    const container = el('div', 'container py-4');
    const card = el('div', 'card shadow-sm mx-auto');
    card.style.maxWidth = '420px';
    const body = el('div', 'card-body');

    const title = el('h5', 'fw-bold text-center mb-4');
    title.textContent = 'Generate Auto‑Login Link';

    // ===== Floating Inputs =====
    const emailWrapper = el('div', 'form-floating mb-3');
    const emailInput = el('input', 'form-control');
    emailInput.type = 'email';
    emailInput.id = 'emailInput';
    emailInput.placeholder = 'Email';
    const emailLabel = el('label');
    emailLabel.setAttribute('for', 'emailInput');
    emailLabel.textContent = 'Email';
    emailWrapper.append(emailInput, emailLabel);

    const passwordWrapper = el('div', 'form-floating mb-3 position-relative');
    const passInput = el('input', 'form-control');
    passInput.type = 'password';
    passInput.id = 'passInput';
    passInput.placeholder = 'Password';
    const passLabel = el('label');
    passLabel.setAttribute('for', 'passInput');
    passLabel.textContent = 'Password';
    passwordWrapper.append(passInput, passLabel);

    // Password eye button
    const eyeBtn = el('button', 'btn btn-outline-secondary position-absolute');
    eyeBtn.type = 'button';
    eyeBtn.style.top = '0.25rem';
    eyeBtn.style.right = '0.5rem';
    eyeBtn.style.height = 'calc(100% - 0.5rem)';
    eyeBtn.innerHTML = '<i class="bi bi-eye"></i>';
    eyeBtn.onclick = () => {
        const hidden = passInput.type === 'password';
        passInput.type = hidden ? 'text' : 'password';
        eyeBtn.innerHTML = `<i class="bi ${hidden ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
    };
    passwordWrapper.appendChild(eyeBtn);

    // ===== Expiry Buttons =====
    const expWrapper = el('div', 'mb-3');
    const expLabel = el('div', 'fw-semibold mb-2'); 
    expLabel.textContent = 'Link Expiry';
    const expGroup = el('div', 'd-flex flex-wrap gap-2');

    const expiryDays = [1,2,3,4,5,6,7];
    let selectedDays = 1; // default 1 day

    expiryDays.forEach(day => {
        const btn = el('button', 'btn btn-outline-primary');
        btn.type = 'button';
        btn.textContent = `${day} day${day>1?'s':''}`;
        if(day===selectedDays) btn.classList.add('active');
        btn.onclick = () => {
            selectedDays = day;
            Array.from(expGroup.children).forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
        };
        expGroup.appendChild(btn);
    });

    expWrapper.append(expLabel, expGroup);

    // ===== Generate Button =====
    const generateBtn = el('button', 'btn btn-primary w-100 mb-3');
    generateBtn.innerHTML = '<i class="bi bi-link-45deg me-1"></i> Generate Link';

    // ===== Result =====
    const resultBox = el('div', 'd-none');
    const linkInput = el('input', 'form-control mb-2');
    linkInput.readOnly = true;
    const whatsappBtn = el('button', 'btn btn-success w-100');
    whatsappBtn.innerHTML = '<i class="bi bi-whatsapp me-1"></i> Share on WhatsApp';
    resultBox.append(linkInput, whatsappBtn);

    // ===== Generate Logic =====
    generateBtn.onclick = async () => {
        const email = emailInput.value.trim();
        const password = passInput.value.trim();

        if (!email || !password || !selectedDays) {
            Toast.warning('All fields are required');
            return;
        }

        const exp = Date.now() + selectedDays*24*60*60*1000;

        showLoader();
        try {
            const fd = new FormData();
            fd.append('email', email);
            fd.append('password', password);

            const res = await fetch('https://esyserve.top/auth/login', {
                method: 'POST',
                credentials: 'include',
                body: fd
            });

            if (!res.ok) {
                Toast.error('Invalid email or password');
                return;
            }

            const payload = { email, password, exp, aud: 'esyserve-autologin' };
            const base64 = btoa(JSON.stringify(payload));
            const link = `https://esyserveschool.onrender.com/#/auto-generate/${base64}`;

            linkInput.value = link;
            resultBox.classList.remove('d-none');

            whatsappBtn.onclick = () => {
                const msg = encodeURIComponent(
                    `Auto‑Login Link (valid till ${new Date(exp).toLocaleString()}):\n${link}`
                );
                window.open(`https://wa.me/?text=${msg}`, '_blank');
            };

            Toast.success('Auto‑login link generated');
        } catch (err) {
            console.error(err);
            Toast.error('Something went wrong');
        } finally {
            hideLoader();
        }
    };

    // ===== Append all elements =====
    body.append(
        title,
        emailWrapper,
        passwordWrapper,
        expWrapper,
        generateBtn,
        resultBox
    );
    card.appendChild(body);
    container.appendChild(card);
    app.appendChild(container);
}

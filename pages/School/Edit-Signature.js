import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function EditImageSignature() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let profile = null;
    let compressedImage = null;

    // ================= FETCH PROFILE =================
    try {
        const res = await fetch('https://esyserve.top/user/profile', {
            method: 'GET',
            credentials: 'include'
        });

        if (res.status === 401) {
            hideLoader();
            Toast.warning('Please login first');
            window.location.hash = '#/login';
            return;
        }

        profile = await res.json();
    } catch (err) {
        console.error(err);
        hideLoader();
        Toast.error('Failed to fetch profile');
        return;
    }

    hideLoader();

    // ================= PROFILE CHECK =================
    if (!profile) {
        Toast.warning('Please create school details first');
        window.location.hash = '#/create-school-details';
        return;
    }

    // ================= HELPER =================
    const el = (tag, cls) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    };

    // ================= CONTAINER =================
    const container = el('div', 'container py-4 text-center');

    const title = el('h4', 'fw-bold mb-1');
    title.textContent = profile.school || 'School';

    const subtitle = el('p', 'text-muted mb-4');
    subtitle.textContent = 'Edit Authorized Signature Image';

    // ================= IMAGE BOX (16:9) =================
    const imageBox = el(
        'div',
        'ratio ratio-16x9 border border-2 border-secondary rounded bg-light mx-auto mb-4 position-relative'
    );
    imageBox.style.maxWidth = '600px';

    const imageInner = el(
        'div',
        'd-flex align-items-center justify-content-center w-100 h-100'
    );

    const img = document.createElement('img');
    img.className = 'w-100 h-100 object-fit-contain rounded';

    const placeholder = el('div', 'text-secondary text-center');
    placeholder.innerHTML = `
        <i class="bi bi-pencil-square fs-1"></i>
        <div class="small">Click to select signature</div>
    `;

    if (profile.imgsignature) {
        img.src = profile.imgsignature;
        imageInner.appendChild(img);
    } else {
        imageInner.appendChild(placeholder);
    }

    imageBox.appendChild(imageInner);

    // ================= HINT OVERLAY =================
    const hint = el(
        'div',
        'small position-absolute bottom-0 w-100 text-center py-1 fw-semibold'
    );
    hint.textContent = 'Click to change photo';
    hint.style.color = '#212529';
    hint.style.background = 'rgba(255, 255, 255, 0.7)';
    hint.style.pointerEvents = 'none';
    hint.style.borderTop = '1px solid rgba(0,0,0,0.1)';

    imageBox.appendChild(hint);

    // ================= FILE INPUT =================
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;

    imageBox.onclick = () => fileInput.click();

    // ================= PIN INPUT WITH EYE =================
    const pinGroup = el('div', 'input-group mb-3 mx-auto');
    pinGroup.style.maxWidth = '320px';

    const pinInput = el('input', 'form-control');
    pinInput.type = 'password';
    pinInput.placeholder = '6 digit PIN';
    pinInput.inputMode = 'numeric';
    pinInput.maxLength = 6;

    const eyeBtn = el('button', 'btn btn-outline-secondary');
    eyeBtn.type = 'button';
    eyeBtn.innerHTML = `<i class="bi bi-eye"></i>`;

    eyeBtn.onclick = () => {
        const hidden = pinInput.type === 'password';
        pinInput.type = hidden ? 'text' : 'password';
        eyeBtn.innerHTML = `<i class="bi ${hidden ? 'bi-eye-slash' : 'bi-eye'}"></i>`;
    };

    pinGroup.append(pinInput, eyeBtn);

    // ================= SUBMIT BUTTON =================
    const submitBtn = el('button', 'btn btn-primary px-4');
    submitBtn.type = 'button';
    submitBtn.innerHTML = `<i class="bi bi-upload me-1"></i> Update Signature`;

    // ================= IMAGE COMPRESS (16:9) =================
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const image = new Image();

            reader.onload = e => image.src = e.target.result;
            reader.readAsDataURL(file);

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const targetRatio = 16 / 9;
                let sw = image.width;
                let sh = image.height;
                let sx = 0;
                let sy = 0;

                if (sw / sh > targetRatio) {
                    sw = sh * targetRatio;
                    sx = (image.width - sw) / 2;
                } else {
                    sh = sw / targetRatio;
                    sy = (image.height - sh) / 2;
                }

                canvas.width = 1280;
                canvas.height = 720;
                ctx.drawImage(image, sx, sy, sw, sh, 0, 0, 1280, 720);

                let quality = 0.85;

                const reduce = () => {
                    canvas.toBlob(blob => {
                        if (!blob) return reject();

                        if (blob.size <= 150 * 1024 || quality < 0.4) {
                            resolve(
                                new File([blob], 'imgsignature.jpg', { type: 'image/jpeg' })
                            );
                        } else {
                            quality -= 0.1;
                            reduce();
                        }
                    }, 'image/jpeg', quality);
                };

                reduce();
            };

            image.onerror = reject;
        });
    };

    // ================= FILE CHANGE =================
    fileInput.onchange = async () => {
        if (!fileInput.files.length) return;

        showLoader();

        try {
            compressedImage = await compressImage(fileInput.files[0]);
            img.src = URL.createObjectURL(compressedImage);
            imageInner.innerHTML = '';
            imageInner.appendChild(img);
        } catch (err) {
            console.error(err);
            Toast.error('Image processing failed');
        } finally {
            hideLoader();
        }
    };

    // ================= SUBMIT =================
    submitBtn.onclick = async () => {
        if (!compressedImage) {
            Toast.warning('Please select a signature image');
            return;
        }

        const pinVal = pinInput.value.trim();
        if (!/^\d{6}$/.test(pinVal)) {
            Toast.error('PIN must be exactly 6 digits');
            return;
        }

        showLoader();

        try {
            const formData = new FormData();
            formData.append('imgsignature', compressedImage);
            formData.append('pin', pinVal);

            const res = await fetch('https://esyserve.top/imgsignature/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                Toast.success('Signature image updated');
                window.location.hash = '#/school';
            } else {
                Toast.error(data || 'Upload failed');
            }
        } catch (err) {
            console.error(err);
            Toast.error('Upload failed');
        } finally {
            hideLoader();
        }
    };

    // ================= APPEND =================
    container.append(
        title,
        subtitle,
        imageBox,
        fileInput,
        pinGroup,
        submitBtn
    );

    app.appendChild(container);
}

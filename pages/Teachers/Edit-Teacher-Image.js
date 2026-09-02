import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function Teachers(teacherId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    let compressedBlob = null;

    const el = (tag, className = '') => {
        const e = document.createElement(tag);
        if (className) e.className = className;
        return e;
    };

    /* ================= FETCH TEACHER ================= */
    showLoader();
    let teacher = {};

    try {
        const res = await fetch(`https://esyserve.top/search/teacher/${teacherId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.status === 401) {
            Toast.warning('Session expired. Please login again.');
            window.location.hash = '#/login';
            return;
        }

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        teacher = data && typeof data === 'object' ? data : {};

    } catch (err) {
        console.error(err);
        Toast.danger('Unable to load teacher data');
        hideLoader();
        return;
    }
    hideLoader();

    /* ================= SAFE VALUES ================= */
    const teacherName = teacher?.teacher ?? '—';
    const teacherRole = teacher?.role ?? '—';

    /* ================= LAYOUT ================= */
    const wrapper = el('div', 'container py-4');
    const row = el('div', 'row justify-content-center');
    const col = el('div', 'col-12 col-md-6 col-lg-4');
    const card = el('div', 'card border border-light');

    /* ===== HEADER ===== */
    const header = el('div', 'card-header bg-white border-bottom text-center py-3');
    header.innerHTML = `
        <div class="fw-semibold">${teacherName}</div>
        <div class="small text-muted">Role: ${teacherRole}</div>
    `;

    /* ===== BODY ===== */
    const body = el('div', 'card-body p-3 text-center');

    /* ===== IMAGE BOX (3:4 RATIO) ===== */
    const imgBox = el('div', 'border border-1 rounded w-100 d-flex align-items-center justify-content-center position-relative');
    imgBox.style.aspectRatio = '3 / 4';
    imgBox.style.background = '#f8f9fa';
    imgBox.style.overflow = 'hidden';

    const cameraIcon = el('i', 'bi bi-camera fs-4 text-muted position-absolute');
    cameraIcon.style.pointerEvents = 'none';

    const preview = el('img', 'img-fluid rounded');
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.objectFit = 'cover';
    preview.style.display = teacher?.imgteacher ? 'block' : 'none';
    if (teacher?.imgteacher) preview.src = teacher.imgteacher;

    imgBox.append(cameraIcon, preview);

    /* ===== FILE INPUTS (HIDDEN) ===== */
    const cameraInput = el('input', 'd-none');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment';

    const galleryInput = el('input', 'd-none');
    galleryInput.type = 'file';
    galleryInput.accept = 'image/*';

    body.append(imgBox, cameraInput, galleryInput);

    /* ===== CAMERA & GALLERY BUTTONS ===== */
    const btnWrapper = el('div', 'd-flex w-100 mt-3');
    btnWrapper.style.gap = '10px';

    const cameraBtn = el('button', 'btn btn-primary flex-fill shadow-sm');
    cameraBtn.type = 'button';
    cameraBtn.textContent = 'Camera';
    cameraBtn.style.borderRadius = '8px';
    cameraBtn.style.padding = '8px 0';
    cameraBtn.style.fontWeight = '500';
    cameraBtn.style.transition = '0.2s';

    const galleryBtn = el('button', 'btn btn-secondary flex-fill shadow-sm');
    galleryBtn.type = 'button';
    galleryBtn.textContent = 'Gallery';
    galleryBtn.style.borderRadius = '8px';
    galleryBtn.style.padding = '8px 0';
    galleryBtn.style.fontWeight = '500';
    galleryBtn.style.transition = '0.2s';

    [cameraBtn, galleryBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
    });

    cameraBtn.addEventListener('click', () => cameraInput.click());
    galleryBtn.addEventListener('click', () => galleryInput.click());

    btnWrapper.append(cameraBtn, galleryBtn);

    /* ===== UPLOAD BUTTON ===== */
    const uploadBtn = el('button', 'btn btn-success w-100 mt-3 shadow-sm');
    uploadBtn.type = 'button';
    uploadBtn.textContent = 'Upload Photo';
    uploadBtn.style.borderRadius = '8px';
    uploadBtn.style.padding = '8px 0';
    uploadBtn.style.fontWeight = '500';
    uploadBtn.style.transition = '0.2s';

    uploadBtn.addEventListener('mouseenter', () => uploadBtn.style.transform = 'translateY(-2px)');
    uploadBtn.addEventListener('mouseleave', () => uploadBtn.style.transform = 'translateY(0)');

    body.append(btnWrapper, uploadBtn);

    card.append(header, body);
    col.append(card);
    row.append(col);
    wrapper.append(row);
    app.append(wrapper);

    /* ================= IMAGE LOGIC ================= */
    function compressToTarget(canvas, file) {
        return new Promise(resolve => {
            let quality = 0.9;
            (function loop() {
                canvas.toBlob(blob => {
                    if (!blob) return;
                    if (blob.size <= 200 * 1024 || quality < 0.3) {
                        compressedBlob = new File([blob], file.name, { type: 'image/jpeg' });
                        resolve(compressedBlob);
                        return;
                    }
                    quality -= 0.1;
                    loop();
                }, 'image/jpeg', quality);
            })();
        });
    }

    async function handleFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 1600; // 3:4 ratio
                const ctx = canvas.getContext('2d');

                const srcRatio = img.width / img.height;
                const targetRatio = 3 / 4;
                let sx, sy, sw, sh;

                if (srcRatio > targetRatio) {
                    sh = img.height;
                    sw = sh * targetRatio;
                    sx = (img.width - sw) / 2;
                    sy = 0;
                } else {
                    sw = img.width;
                    sh = sw / targetRatio;
                    sx = 0;
                    sy = (img.height - sh) / 2;
                }

                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

                preview.src = canvas.toDataURL('image/jpeg', 0.9);
                preview.classList.remove('d-none');

                await compressToTarget(canvas, file);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    cameraInput.addEventListener('change', () => handleFile(cameraInput.files?.[0]));
    galleryInput.addEventListener('change', () => handleFile(galleryInput.files?.[0]));

    /* ================= UPLOAD LOGIC ================= */
    uploadBtn.addEventListener('click', async () => {
        if (!compressedBlob) {
            Toast.error('Please select a photo');
            return;
        }

        const fd = new FormData();
        fd.append('imgteacher', compressedBlob);

        showLoader();
        try {
            const res = await fetch(`https://esyserve.top/imgteacher/upload/${teacherId}`, {
                method: 'POST',
                credentials: 'include',
                body: fd
            });

            if (res.status === 401) {
                Toast.warning('Session expired');
                window.location.hash = '#/login';
                return;
            }

            const data = await res.json();
            if (res.status === 200) {
                Toast.success('Photo updated successfully');
                window.location.hash = '#/teachers';
            } else {
                Toast.error(data || 'Upload failed');
            }
        } catch (e) {
            console.error(e);
            Toast.error('Upload failed');
        } finally {
            hideLoader();
        }
    });
}

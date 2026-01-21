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
    let teacher = {}; // ✅ ALWAYS OBJECT

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
        teacher = data && typeof data === 'object' ? data : {}; // ✅ NULL SAFE

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

    // ⬇️ NO SHADOW, LIGHT OUTLINE ONLY
    const card = el('div', 'card border border-light');

    /* ===== HEADER ===== */
    const header = el('div', 'card-header bg-white border-bottom text-center py-3');
    header.innerHTML = `
        <div class="fw-semibold">${teacherName}</div>
        <div class="small text-muted">Role: ${teacherRole}</div>
    `;

    /* ===== BODY ===== */
    const body = el('div', 'card-body p-3 text-center');

    /* ===== IMAGE BOX ===== */
    const imgBox = el(
        'label',
        'border border-1 rounded w-100 d-flex align-items-center justify-content-center position-relative'
    );
    imgBox.setAttribute('for', 'imgInput');
    imgBox.style.cursor = 'pointer';
    imgBox.style.aspectRatio = '3 / 4';
    imgBox.style.background = '#f8f9fa';

    const cameraIcon = el('i', 'bi bi-camera fs-4 text-muted');

    const hint = el('div', 'small position-absolute bottom-0 w-100 text-center py-1 fw-semibold');
    hint.textContent = 'Click to change photo';
    hint.style.color = '#212529'; // dark, visible
    hint.style.background = 'rgba(255, 255, 255, 0.7)'; // semi-transparent overlay
    hint.style.pointerEvents = 'none'; // click passes through
    hint.style.borderTop = '1px solid rgba(0,0,0,0.1)'; // optional subtle separator

    const preview = el('img', 'img-fluid rounded');
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.objectFit = 'cover';

    // ✅ Show existing photo if available, else hide preview
    if (teacher?.imgteacher) {
        preview.src = teacher.imgteacher;
        cameraIcon.classList.add('d-none');
    } else {
        preview.classList.add('d-none');
    }

    imgBox.append(cameraIcon, preview, hint);

    const imgInput = el('input', 'd-none');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.id = 'imgInput';
    ImgInput.capture = 'environment';

    /* ===== BUTTON ===== */
    const btn = el('button', 'btn btn-primary w-100 mt-3');
    btn.innerHTML = `<i class="bi bi-cloud-upload me-1"></i> Update Photo`;
    btn.type = 'button';

    body.append(imgBox, imgInput, btn);
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

    imgInput.addEventListener('change', () => {
        const file = imgInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 1600;
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
                cameraIcon.classList.add('d-none');

                await compressToTarget(canvas, file);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    /* ================= UPLOAD ================= */
    btn.addEventListener('click', async () => {
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

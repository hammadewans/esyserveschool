import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

import { openStudentImageCropper } from '/assets/js/utils/studentImageCropper.js';
export default async function Students(studentId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    let compressedBlob = null;

    const el = (tag, className = '') => {
        const e = document.createElement(tag);
        if (className) e.className = className;
        return e;
    };

    /* ================= FETCH STUDENT ================= */
    showLoader();
    let student = {};

    try {
        const res = await fetch(`https://esyserve.top/search/student/${studentId}`, {
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
        student = data && typeof data === 'object' ? data : {};

    } catch (err) {
        console.error(err);
        Toast.danger('Unable to load student data');
        hideLoader();
        return;
    }
    hideLoader();

    /* ================= SAFE VALUES ================= */
    const studentName = student?.student ?? '—';
    const studentClass = student?.class ?? '—';

    /* ================= LAYOUT ================= */
    const wrapper = el('div', 'container py-4');
    const row = el('div', 'row justify-content-center');
    const col = el('div', 'col-12 col-md-6 col-lg-4');

    const card = el('div', 'card border border-light');

    /* ===== HEADER ===== */
    const header = el('div', 'card-header bg-white border-bottom text-center py-3');
    header.innerHTML = `
        <div class="fw-semibold">${studentName}</div>
        <div class="small text-muted">Class ${studentClass}</div>
    `;

    /* ===== BODY ===== */
    const body = el('div', 'card-body p-3 text-center');

    /* ===== IMAGE BOX ===== */
    const imgBox = el(
        'div',
        'border border-1 rounded w-100 d-flex align-items-center justify-content-center position-relative'
    );
    imgBox.style.cursor = 'default';
    imgBox.style.aspectRatio = '3 / 4';
    imgBox.style.background = '#f8f9fa';

    const cameraIcon = el('i', 'bi bi-camera fs-4 text-muted');

    const editExistingBtn = el('button', 'btn btn-warning btn-sm position-absolute');
    editExistingBtn.type = 'button';
    editExistingBtn.innerHTML = '<i class="bi bi-pencil-square me-1"></i>Edit Photo';
    editExistingBtn.style.cssText = 'right:8px;bottom:8px;z-index:3;border-radius:7px;font-weight:500;';
    editExistingBtn.title = 'Edit the currently uploaded photo';

    const preview = el('img', 'img-fluid rounded');
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.objectFit = 'cover';

    if (student?.imgstudent) {
        preview.src = student.imgstudent;
        cameraIcon.classList.add('d-none');
        imgBox.append(cameraIcon, preview, editExistingBtn);
    } else {
        preview.classList.add('d-none');
        editExistingBtn.classList.add('d-none');
        imgBox.append(cameraIcon, preview, editExistingBtn);
    }

    const imgInput = el('input', 'd-none');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';

    /* ================= CAMERA & GALLERY BUTTONS ================= */
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

    // Camera opens with capture
    cameraBtn.addEventListener('click', () => {
        imgInput.setAttribute('capture', 'environment');
        imgInput.click();
    });

    // Gallery opens file picker
    galleryBtn.addEventListener('click', () => {
        imgInput.removeAttribute('capture');
        imgInput.click();
    });

    btnWrapper.append(cameraBtn, galleryBtn);

    /* ================= SUBMIT BUTTON ================= */
    const submitBtn = el('button', 'btn btn-success w-100 mt-3 shadow-sm');
    submitBtn.type = 'button';
    submitBtn.textContent = 'Upload Photo';
    submitBtn.style.borderRadius = '8px';
    submitBtn.style.fontWeight = '500';
    submitBtn.style.padding = '8px 0';

    submitBtn.addEventListener('mouseenter', () => submitBtn.style.transform = 'translateY(-2px)');
    submitBtn.addEventListener('mouseleave', () => submitBtn.style.transform = 'translateY(0)');

    body.append(imgBox, imgInput, btnWrapper, submitBtn);

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

    async function fileFromExistingImage(url) {
        if (!url) throw new Error('Existing photo URL is missing');

        // The uploaded photo is already visible in the browser. Fetch that exact
        // image and turn it into a File so the same 3:4 cropper can edit it.
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store'
        });

        if (!res.ok) throw new Error(`Unable to fetch existing photo (${res.status})`);

        const blob = await res.blob();
        if (!blob.type.startsWith('image/')) {
            throw new Error('Existing photo response is not an image');
        }

        const ext = blob.type.includes('png') ? 'png' :
                    blob.type.includes('webp') ? 'webp' :
                    blob.type.includes('gif') ? 'gif' : 'jpg';

        return new File([blob], `student-${studentId}.${ext}`, {
            type: blob.type || 'image/jpeg',
            lastModified: Date.now()
        });
    }

    async function applyCroppedFile(croppedFile) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onerror = () => reject(new Error('Unable to read cropped image'));
            reader.onload = e => {
                const img = new Image();
                img.onload = async () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = 1200;
                        canvas.height = 1600;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error('Canvas is not available');

                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        preview.src = canvas.toDataURL('image/jpeg', 0.9);
                        preview.classList.remove('d-none');
                        cameraIcon.classList.add('d-none');
                        editExistingBtn.classList.remove('d-none');

                        await compressToTarget(canvas, croppedFile);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error('Unable to load cropped image'));
                img.src = e.target.result;
            };
            reader.readAsDataURL(croppedFile);
        });
    }

    async function editFile(file) {
        const croppedFile = await openStudentImageCropper(file);
        if (!croppedFile) return false;
        await applyCroppedFile(croppedFile);
        return true;
    }

    // NEW: edit the image that is ALREADY uploaded and currently shown in preview.
    editExistingBtn.addEventListener('click', async () => {
        if (!student?.imgstudent) return;

        editExistingBtn.disabled = true;
        try {
            const existingFile = await fileFromExistingImage(student.imgstudent);
            await editFile(existingFile);
        } catch (err) {
            console.error(err);
            Toast.error('Unable to open the uploaded photo for editing');
        } finally {
            editExistingBtn.disabled = false;
        }
    });

    imgInput.addEventListener('change', async () => {
        const file = imgInput.files?.[0];
        if (!file) return;

        try {
            await editFile(file);
        } catch (err) {
            console.error(err);
            Toast.error('Unable to edit photo');
        } finally {
            imgInput.value = '';
        }
    });

    /* ================= UPLOAD ================= */
    submitBtn.addEventListener('click', async () => {
        if (!compressedBlob) {
            Toast.error('Please select a photo first');
            return;
        }

        const fd = new FormData();
        fd.append('imgstudent', compressedBlob);

        showLoader();
        try {
            const res = await fetch(`https://esyserve.top/imgstudent/upload/${studentId}`, {
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
                window.location.hash = '#/students';
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

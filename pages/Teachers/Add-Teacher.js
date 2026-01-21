export default function Teachers() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    let compressedBlob = null;

    /* ================= HELPERS ================= */
    const el = (tag, className) => {
        const e = document.createElement(tag);
        if (className) e.className = className;
        return e;
    };

    const floating = (input, labelText) => {
        const wrap = el('div', 'form-floating mb-3');
        const label = el('label');
        label.textContent = labelText;
        wrap.append(input, label);
        return wrap;
    };

    /* ================= CONTAINER ================= */
    const container = el('div', 'container-fluid px-3 px-md-5 mt-4');
    const title = el('h4', 'mb-4 fw-bold text-center');
    title.textContent = 'Add Teacher';

    const form = el('form', 'row g-4');

    /* ================= IMAGE COLUMN ================= */
    const imgCol = el('div', 'col-12 col-lg-4 d-flex flex-column align-items-center');

    const imgLabel = el(
        'label',
        'border border-2 rounded d-flex flex-column align-items-center justify-content-center w-100'
    );
    Object.assign(imgLabel.style, {
        cursor: 'pointer',
        aspectRatio: '3/4',
        maxWidth: '350px',
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '10px'
    });
    imgLabel.setAttribute('for', 'imgInput');

    const cameraIcon = el('i', 'bi bi-camera fs-1 text-muted');
    const imgText = el('div', 'small text-muted text-center mt-1');
    imgText.textContent = 'Click teacher image (Optional)';

    const preview = el('img', 'img-fluid rounded d-none');
    Object.assign(preview.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    });

    imgLabel.append(cameraIcon, preview, imgText);

    const imgInput = el('input', 'd-none');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.setAttribute('capture', 'environment');
    imgInput.id = 'imgInput';

    imgCol.append(imgLabel, imgInput);

    /* ================= INPUT COLUMN ================= */
    const inputCol = el('div', 'col-12 col-lg-8');

    const teacherName = el('input', 'form-control');
    teacherName.placeholder = 'Teacher Name';

    const fatherName = el('input', 'form-control');
    fatherName.placeholder = 'Father Name';

    const motherName = el('input', 'form-control');
    motherName.placeholder = 'Mother Name';

    const dob = el('input', 'form-control');
    dob.placeholder = 'DD/MM/YYYY';
    dob.maxLength = 10;
    dob.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length >= 5) v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
        else if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`;
        e.target.value = v;
    });

    const contact = el('input', 'form-control');
    contact.type = 'tel';
    contact.placeholder = 'Contact Number';

    const address = el('textarea', 'form-control');
    address.placeholder = 'Address';
    address.style.height = '70px';

    const role = el('input', 'form-control');
    role.placeholder = 'Role (e.g. Teacher, Head, Principal)';

    /* ================= SAVE ================= */
    const btnDiv = el('div', 'text-end mt-3');
    const saveBtn = el('button', 'btn btn-primary px-4');
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save Teacher';
    btnDiv.append(saveBtn);

    inputCol.append(
        floating(teacherName, 'Teacher Name'),
        floating(fatherName, 'Father Name'),
        floating(motherName, 'Mother Name'),
        floating(dob, 'Date of Birth'),
        floating(contact, 'Contact Number'),
        floating(address, 'Address'),
        floating(role, 'Role'),
        btnDiv
    );

    form.append(imgCol, inputCol);
    container.append(title, form);
    app.appendChild(container);

    /* ================= IMAGE COMPRESS ================= */
    function compressToTarget(canvas, file) {
        return new Promise(resolve => {
            let quality = 0.9;
            (function loop() {
                canvas.toBlob(blob => {
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
                imgText.classList.add('d-none');

                await compressToTarget(canvas, file);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    /* ================= SAVE CLICK ================= */
    saveBtn.addEventListener('click', async () => {
        const teacherVal = teacherName.value.trim();
        const fatherVal = fatherName.value.trim();
        const motherVal = motherName.value.trim();
        const dobVal = dob.value.trim();
        const contactVal = contact.value.trim();
        const addressVal = address.value.trim();
        const roleVal = role.value.trim();

        if (!teacherVal) return Toast.error('Teacher Name is required');
        if (!fatherVal) return Toast.error('Father Name is required');
        if (!motherVal) return Toast.error('Mother Name is required');
        if (!dobVal) return Toast.error('Date of Birth is required');

        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dobVal)) {
            return Toast.error('DOB must be DD/MM/YYYY');
        }

        const [d, m, y] = dobVal.split('/').map(Number);
        const dateObj = new Date(y, m - 1, d);
        if (dateObj.getDate() !== d || dateObj.getMonth() !== m - 1 || dateObj.getFullYear() !== y) {
            return Toast.error('Invalid Date of Birth');
        }

        if (!/^\d{10}$/.test(contactVal)) {
            return Toast.error('Contact must be 10 digits');
        }

        if (!addressVal) return Toast.error('Address is required');
        if (!roleVal) return Toast.error('Role is required');

        const dobFormatted = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

        const formData = new FormData();
        formData.append('teacher', teacherVal);
        formData.append('father', fatherVal);
        formData.append('mother', motherVal);
        formData.append('dob', dobFormatted);
        formData.append('contact', contactVal);
        formData.append('address', addressVal);
        formData.append('role', roleVal);
        if (compressedBlob) formData.append('imgteacher', compressedBlob);

        try {
            const res = await fetch('https://esyserve.top/add/teacher', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (res.status === 200) {
                Toast.success(data || 'Teacher added successfully');

                [teacherName, fatherName, motherName, dob, contact, address, role]
                    .forEach(i => i.value = '');

                preview.classList.add('d-none');
                cameraIcon.classList.remove('d-none');
                imgText.classList.remove('d-none');
                compressedBlob = null;
            } else {
                Toast.error(data || 'Failed');
            }
        } catch (err) {
            console.error(err);
            Toast.error('Network error');
        }
    });
}

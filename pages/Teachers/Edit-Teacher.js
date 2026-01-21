import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function Teachers(teacherId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let teacherData = {};

    try {
        const response = await fetch(`https://esyserve.top/search/teacher/${teacherId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            Toast.warning('Session expired. Please login again.');
            window.location.hash = '#/login';
            return;
        }

        const data = await response.json();

        // ✅ NULL-SAFE: always ensure an object
        teacherData = data && typeof data === 'object' ? data : {};

    } catch (err) {
        console.error(err);
        Toast.error('Failed to load teacher data');
        teacherData = {};
    } finally {
        hideLoader();
    }

    // ---------------- HELPERS ----------------
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

    // ---------------- CONTAINER ----------------
    const container = el('div', 'container-fluid px-3 px-md-5 mt-4');
    const title = el('h4', 'mb-4 fw-bold text-center');
    title.textContent = 'Edit Teacher';
    const form = el('form', 'row g-4');

    const inputCol = el('div', 'col-12 col-lg-8 mx-auto');

    // ---------------- INPUTS ----------------
    const teacherName = el('input', 'form-control');
    teacherName.value = teacherData.teacher ?? '';

    const fatherName = el('input', 'form-control');
    fatherName.value = teacherData.father ?? '';

    const motherName = el('input', 'form-control');
    motherName.value = teacherData.mother ?? '';

    const dob = el('input', 'form-control');
    dob.placeholder = 'DD/MM/YYYY';
    dob.value = teacherData.dob
        ? new Date(teacherData.dob).toLocaleDateString('en-GB')
        : '';

    dob.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length >= 5) v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
        else if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`;
        e.target.value = v;
    });

    const contact = el('input', 'form-control');
    contact.type = 'tel';
    contact.value = teacherData.contact ?? '';

    const address = el('textarea', 'form-control');
    address.style.height = '70px';
    address.value = teacherData.address ?? '';

    const role = el('input', 'form-control');
    role.value = teacherData.role ?? '';

    // ---------------- SAVE BUTTON ----------------
    const btnDiv = el('div', 'text-end mt-3');
    const saveBtn = el('button', 'btn btn-primary px-4');
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save Teacher';
    btnDiv.appendChild(saveBtn);

    // ---------------- APPEND ----------------
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

    form.appendChild(inputCol);
    container.append(title, form);
    app.appendChild(container);

    // ---------------- SAVE ----------------
    saveBtn.addEventListener('click', async () => {
        if (!teacherName.value.trim()) {
            Toast.error('Teacher Name is required');
            return;
        }

        const formData = new FormData();
        formData.append('teacher', teacherName.value.trim());
        formData.append('father', fatherName.value.trim() || '');
        formData.append('mother', motherName.value.trim() || '');
        formData.append(
            'dob',
            dob.value ? dob.value.split('/').reverse().join('-') : ''
        );
        formData.append('contact', contact.value.trim() || '');
        formData.append('address', address.value.trim() || '');
        formData.append('role', role.value.trim() || '');

        try {
            const res = await fetch(`https://esyserve.top/edit/teacher/${teacherId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (res.status === 200) {
                Toast.success(data.message ?? 'Teacher updated successfully');
                window.location.hash = '#/teachers';
            } else {
                Toast.error(data.message ?? 'Failed to update teacher');
            }

        } catch (err) {
            console.error(err);
            Toast.error('Network or server error');
        }
    });
}

import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function Students(studentId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let studentData = {}; // ✅ always object

    try {
        const response = await fetch(`https://esyserve.top/search/student/${studentId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
            Toast.warning('Session expired. Please login again.');
            window.location.hash = '#/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        studentData = data && typeof data === 'object' ? data : {}; // ✅ NULL SAFE

    } catch (err) {
        console.error(err);
        Toast.danger('Failed to load student data.');
    } finally {
        hideLoader();
    }

    /* =====================================================
       HELPERS
    ===================================================== */
    const el = (tag, className = '') => {
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

    /* =====================================================
       CONTAINER
    ===================================================== */
    const container = el('div', 'container-fluid px-3 px-md-5 mt-4');
    const title = el('h4', 'mb-4 fw-bold text-center');
    title.textContent = 'Edit Student';

    const form = el('form', 'row g-4');
    const inputCol = el('div', 'col-12 col-lg-8');

    /* =====================================================
       INPUTS (NULL SAFE)
    ===================================================== */
    const studentName = el('input', 'form-control');
    studentName.value = studentData?.student ?? '';

    const fatherName = el('input', 'form-control');
    fatherName.value = studentData?.father ?? '';

    const motherName = el('input', 'form-control');
    motherName.value = studentData?.mother ?? '';

    const rollNo = el('input', 'form-control');
    rollNo.type = 'number';
    rollNo.value = studentData?.rollno ?? '';

    const dob = el('input', 'form-control');
    dob.value = studentData?.dob
        ? new Date(studentData.dob).toLocaleDateString('en-GB')
        : '';

    dob.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (v.length >= 5) v = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
        else if (v.length >= 3) v = `${v.slice(0,2)}/${v.slice(2)}`;
        e.target.value = v;
    });

    const contact = el('input', 'form-control');
    contact.type = 'tel';
    contact.value = studentData?.contact ?? '';

    const address = el('textarea', 'form-control');
    address.style.height = '70px';
    address.value = studentData?.address ?? '';

    /* =====================================================
       CLASS
    ===================================================== */
    const classDiv = el('div', 'mb-3');
    const classLabel = el('div', 'fw-semibold mb-1');
    classLabel.textContent = 'Class';

    const classGroup = el('div', 'd-flex overflow-auto');
    classGroup.style.gap = '0.25rem';
    classGroup.style.whiteSpace = 'nowrap';
    classGroup.style.scrollbarWidth = 'none';

    const classList = ['Play','Nursery','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'];
    classList.forEach((cls, i) => {
        const input = el('input', 'btn-check');
        input.type = 'radio';
        input.name = 'class';
        input.id = `class${i}`;
        input.value = cls.toLowerCase();

        if ((studentData?.class ?? '').toLowerCase() === cls.toLowerCase()) {
            input.checked = true;
        }

        const label = el('label', 'btn btn-outline-primary flex-shrink-0');
        label.textContent = cls;
        label.setAttribute('for', input.id);
        label.style.minWidth = '60px';

        classGroup.append(input, label);
    });

    classDiv.append(classLabel, classGroup);

    /* =====================================================
       SECTION
    ===================================================== */
    const sectionDiv = el('div', 'mb-3');
    const sectionLabel = el('div', 'fw-semibold mb-1');
    sectionLabel.textContent = 'Section';

    const sectionGroup = el('div', 'd-flex overflow-auto');
    sectionGroup.style.gap = '0.25rem';
    sectionGroup.style.whiteSpace = 'nowrap';
    sectionGroup.style.scrollbarWidth = 'none';

    ['A','B','C','D','E','F'].forEach((sec, i) => {
        const input = el('input', 'btn-check');
        input.type = 'radio';
        input.name = 'section';
        input.id = `section${i}`;
        input.value = sec.toLowerCase();

        if ((studentData?.sectionclass ?? '').toLowerCase() === sec.toLowerCase()) {
            input.checked = true;
        }

        const label = el('label', 'btn btn-outline-primary flex-shrink-0');
        label.textContent = sec;
        label.setAttribute('for', input.id);
        label.style.minWidth = '50px';

        sectionGroup.append(input, label);
    });

    sectionDiv.append(sectionLabel, sectionGroup);

    /* =====================================================
       ROLE
    ===================================================== */
    const roleDiv = el('div', 'mb-3');
    const roleLabel = el('div', 'fw-semibold mb-1');
    roleLabel.textContent = 'Student Role';

    const roleGroup = el('div', 'btn-group w-100');
    ['Student','Monitor','Head'].forEach((r, i) => {
        const input = el('input', 'btn-check');
        input.type = 'radio';
        input.name = 'role';
        input.id = `role${i}`;
        input.value = r.toLowerCase();

        if ((studentData?.role ?? '').toLowerCase() === r.toLowerCase()) {
            input.checked = true;
        }

        const label = el('label', 'btn btn-outline-primary');
        label.textContent = r;
        label.setAttribute('for', input.id);

        roleGroup.append(input, label);
    });

    roleDiv.append(roleLabel, roleGroup);

    /* =====================================================
       SAVE BUTTON
    ===================================================== */
    const btnDiv = el('div', 'text-end mt-3');
    const saveBtn = el('button', 'btn btn-primary px-4');
    saveBtn.type = 'button';
    saveBtn.textContent = 'Save Student';
    btnDiv.append(saveBtn);

    /* =====================================================
       APPEND
    ===================================================== */
    inputCol.append(
        floating(studentName,'Student Name'),
        floating(fatherName,'Father Name'),
        floating(motherName,'Mother Name'),
        floating(rollNo,'Roll No'),
        floating(dob,'Date of Birth'),
        floating(contact,'Contact Number'),
        floating(address,'Address'),
        classDiv,
        sectionDiv,
        roleDiv,
        btnDiv
    );

    form.append(inputCol);
    container.append(title, form);
    app.appendChild(container);

    /* =====================================================
       SAVE
    ===================================================== */
    saveBtn.addEventListener('click', async () => {
        const selectedClass = form.querySelector('input[name="class"]:checked')?.value ?? '';
        const selectedSection = form.querySelector('input[name="section"]:checked')?.value ?? '';
        const selectedRole = form.querySelector('input[name="role"]:checked')?.value ?? '';

        if (!studentName.value.trim()) return Toast.error('Student Name is required');
        if (!fatherName.value.trim()) return Toast.error('Father Name is required');
        if (!motherName.value.trim()) return Toast.error('Mother Name is required');
        if (!rollNo.value.trim()) return Toast.error('Roll No is required');
        if (!contact.value.trim()) return Toast.error('Contact Number is required');
        if (!address.value.trim()) return Toast.error('Address is required');

        const [d,m,y] = dob.value.split('/');
        const dobFormatted = `${y}-${m}-${d}`;

        const formData = new FormData();
        formData.append('student', studentName.value.trim());
        formData.append('father', fatherName.value.trim());
        formData.append('mother', motherName.value.trim());
        formData.append('rollno', rollNo.value.trim());
        formData.append('dob', dobFormatted);
        formData.append('contact', contact.value.trim());
        formData.append('address', address.value.trim());
        formData.append('class', selectedClass);
        formData.append('sectionclass', selectedSection);
        formData.append('role', selectedRole);

        try {
            const res = await fetch(`https://esyserve.top/edit/student/${studentId}`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (res.status === 200) {
                Toast.success(data.message || 'Student updated successfully!');
                window.location.hash = '#/students';
            } else {
                Toast.error(data.message || 'Update failed');
            }
        } catch (e) {
            console.error(e);
            Toast.error('Server error');
        }
    });
}

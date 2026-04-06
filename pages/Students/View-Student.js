import { showLoader, hideLoader } from '/assets/js/loader.js';
import Confirm from '/assets/js/confirm.js';
import Toast from '/components/Toast.js';

export default async function Students(studentId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    try {
        const res = await fetch(`https://esyserve.top/search/student/${studentId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) throw new Error(res.status);

        const data = await res.json();
        renderStudent(app, data ?? {}); // ✅ nullable-safe

    } catch (e) {
        console.error(e);
        Toast.error('Failed to load student data');
    } finally {
        hideLoader();
    }
}

/* =====================================================
   HELPERS
===================================================== */
const el = (tag, cls = '', txt = '') => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
};

const formatDOB = dob => {
    if (!dob) return '-';
    const [y, m, d] = dob.split('-') ?? [];
    if (!y || !m || !d) return '-';
    return `${d}-${m}-${y}`;
};

/* =====================================================
   RENDER STUDENT (LIGHT CARD, RECTANGLE IMAGE, EQUAL STATS)
===================================================== */
function renderStudent(app, d) {
    const card = el('div', 'mx-auto my-4');
    card.style.maxWidth = '400px';

    const cardBody = el('div', 'card-body');

    // IMAGE (3:4 rectangle)
    const imgWrap = el('div', 'd-flex justify-content-center mb-3');
    const avatar = el('div', 'bg-secondary d-flex align-items-center justify-content-center rounded');
    avatar.style.width = '160px';
    avatar.style.aspectRatio = '3 / 4';
    avatar.style.fontSize = '36px';
    avatar.style.fontWeight = '600';
    avatar.style.color = '#fff';
    avatar.style.overflow = 'hidden';

    if (d.imgstudent) {
        const img = el('img', 'img-fluid rounded');
        img.src = d.imgstudent;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        avatar.appendChild(img);
    } else {
        avatar.textContent = (d.student?.charAt(0) ?? '?').toUpperCase();
    }
    imgWrap.appendChild(avatar);

    // NAME
    const name = el('h5', 'card-title text-center mt-2', d.student ?? '-');
    const subtitle = el('p', 'text-center text-muted mb-3', 'Student Profile');

    // STATS (white boxes, equal width)
    const stats = el('div', 'd-flex gap-2 mb-3');
    stats.append(
        statBox('Class', d.class ?? '-'),
        statBox('Section', d.sectionclass ?? '-'),
        statBox('Roll', d.rollno ?? '-')
    );

    // DETAILS
    const details = el('ul', 'list-group list-group-flush mb-3 rounded');
    details.append(
        listRow('Father Name', d.father ?? '-'),
        listRow('Mother Name', d.mother ?? '-'),
        listRow('Date of Birth', formatDOB(d.dob)),
        listRow('Contact', d.contact ?? '-'),
        listRow('Address', d.address ?? '-')
    );

    // ACTIONS
    const actions = el('div', 'd-grid gap-2');
    actions.append(
        actionBtn('Edit Details', 'bi-pencil', () => editDetails(d), 'primary'),
        actionBtn('Edit Image', 'bi-image', () => editImage(d), 'info'),
        actionBtn('Delete Student', 'bi-trash', () => deleteStudent(d), 'danger')
    );

    cardBody.append(imgWrap, name, subtitle, stats, details, actions);
    card.appendChild(cardBody);
    app.appendChild(card);
}

/* =====================================================
   UI PARTS
===================================================== */
function statBox(label, value) {
    const box = el('div', 'flex-fill text-center bg-white border rounded py-2');
    box.append(
        el('div', 'text-muted small', label),
        el('div', 'fw-bold', value ?? '-')
    );
    return box;
}

function listRow(label, value) {
    const li = el('li', 'list-group-item d-flex justify-content-between align-items-center mb-1 rounded-2');
    li.append(
        el('span', '', label),
        el('span', '', value ?? '-')
    );
    return li;
}

function actionBtn(text, icon, fn, type = 'primary') {
    const btn = el('button', `btn btn-${type} btn-lg`);
    btn.type = 'button';
    btn.onclick = fn;
    btn.append(el('i', `bi ${icon} me-2`));
    btn.append(document.createTextNode(text));
    return btn;
}

/* =====================================================
   ACTIONS
===================================================== */
function editDetails(s) { window.location.hash = `#/edit-student/${s.studentid ?? ''}`; }
function editImage(s) { window.location.hash = `#/edit-student-image/${s.studentid ?? ''}`; }

/* =====================================================
   DELETE STUDENT (ASYNC WITH CONFIRM)
===================================================== */
async function deleteStudent(s) {
    try {
        const confirmed = await Confirm.show(`Are you sure you want to delete ${s.student ?? 'this student'}?`);
        if (!confirmed) return;

        const res = await fetch(`https://esyserve.top/student/delete/${s.studentid ?? ''}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (res.status === 401) {
            Toast.warning('Please login first.');
            window.location.hash = '#/login';
            return;
        }

        const data = await res.json();

        if (res.status === 200) {
            Toast.success(data.message ?? 'Student deleted successfully!');
            window.location.replace('/#/students');
        } else if (res.status === 400) {
            Toast.error(data.message ?? 'Invalid request');
        } else {
            Toast.error(data.message ?? 'Failed to delete student');
        }

    } catch (err) {
        console.error(err);
        Toast.error('Network or server error');
    }
}

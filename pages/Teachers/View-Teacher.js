import { showLoader, hideLoader } from '/assets/js/loader.js';
import Confirm from '/assets/js/confirm.js';
import Toast from '/components/Toast.js';

export default async function Teachers(teacherId) {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    try {
        const res = await fetch(`https://esyserve.top/search/teacher/${teacherId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) throw new Error(res.status);

        const data = await res.json();
        renderTeacher(app, data ?? {}); // ✅ nullable-safe

    } catch (e) {
        console.error(e);
        Toast.error('Failed to load teacher data');
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
   RENDER TEACHER (LIGHT CARD, RECTANGLE IMAGE, EQUAL STATS)
===================================================== */
function renderTeacher(app, d) {
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

    if (d.imgteacher) {
        const img = el('img', 'img-fluid rounded');
        img.src = d.imgteacher;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        avatar.appendChild(img);
    } else {
        avatar.textContent = (d.teacher?.charAt(0) ?? '?').toUpperCase();
    }
    imgWrap.appendChild(avatar);

    // NAME
    const name = el('h5', 'card-title text-center mt-2', d.teacher ?? '-');
    const subtitle = el('p', 'text-center text-muted mb-3', 'Teacher Profile');

    // STATS (white boxes, equal width)
    const stats = el('div', 'd-flex gap-2 mb-3');
    stats.append(
        statBox('Role', d.role ?? '-'),
        statBox('Contact', d.contact ?? '-')
    );

    // DETAILS
    const details = el('ul', 'list-group list-group-flush mb-3 rounded');
    details.append(
        listRow('Father Name', d.father ?? '-'),
        listRow('Mother Name', d.mother ?? '-'),
        listRow('Date of Birth', formatDOB(d.dob)),
        listRow('Address', d.address ?? '-')
    );

    // ACTIONS
    const actions = el('div', 'd-grid gap-2');
    actions.append(
        actionBtn('Edit Details', 'bi-pencil', () => editDetails(d), 'primary'),
        actionBtn('Edit Image', 'bi-image', () => editImage(d), 'info'),
        actionBtn('Delete Teacher', 'bi-trash', () => deleteTeacher(d), 'danger')
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
function editDetails(t) { window.location.hash = `#/edit-teacher/${t.teacherid ?? ''}`; }
function editImage(t) { window.location.hash = `#/edit-teacher-image/${t.teacherid ?? ''}`; }

/* =====================================================
   DELETE TEACHER (ASYNC WITH CONFIRM)
===================================================== */
async function deleteTeacher(t) {
    try {
        const confirmed = await Confirm.show(`Are you sure you want to delete ${t.teacher ?? 'this teacher'}?`);
        if (!confirmed) return;

        const res = await fetch(`https://esyserve.top/teacher/delete/${t.teacherid ?? ''}`, {
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
            Toast.success(data.message ?? 'Teacher deleted successfully!');
            window.location.replace('/#/teachers');
        } else if (res.status === 400) {
            Toast.error(data.message ?? 'Invalid request');
        } else {
            Toast.error(data.message ?? 'Failed to delete teacher');
        }

    } catch (err) {
        console.error(err);
        Toast.error('Network or server error');
    }
}

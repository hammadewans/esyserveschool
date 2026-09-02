import { showLoader, hideLoader } from '/assets/js/loader.js';
import Confirm from '/assets/js/confirm.js';
import Toast from '/components/Toast.js';

export default async function Teachers() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let teachers = [];

    try {
        const response = await fetch('https://esyserve.top/fetch/teacher', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            hideLoader();
            Toast.warning('User need to login first.');
            window.location.hash = '#/login';
            return;
        }

        const data = await response.json();
        teachers = Array.isArray(data) ? data : [];
        hideLoader();
    } catch (err) {
        hideLoader();
        console.error('Fetch error:', err);
        return;
    }

    let selectedImage = 'all';
    let searchText = '';

    // ========================= SEARCH BAR =========================
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'w-100 px-0 my-2';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by teacher name...';
    searchInput.className = 'form-control';
    searchInput.addEventListener('input', () => {
        searchText = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    searchWrapper.appendChild(searchInput);
    app.appendChild(searchWrapper);

    // ========================= IMAGE FILTER =========================
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'w-100 px-0 mb-2';

    const imageBar = document.createElement('div');
    imageBar.className = 'd-flex flex-nowrap overflow-auto py-1 gap-2';
    imageBar.style.scrollbarWidth = 'none';
    imageBar.style.msOverflowStyle = 'none';

    const imageLabels = ['All', 'Has Image', 'No Image'];
    const imageValues = ['all', 'has', 'no'];

    imageLabels.forEach((label, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.className = 'btn btn-sm text-center flex-shrink-0';
        btn.style.width = '120px';

        if (index === 0) btn.classList.add('btn-secondary', 'active');
        else btn.classList.add('btn-outline-secondary');

        btn.onclick = () => {
            selectedImage = imageValues[index];
            imageBar.querySelectorAll('button').forEach(b => {
                b.classList.remove('btn-secondary', 'active');
                b.classList.add('btn-outline-secondary');
            });
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-secondary', 'active');
            applyFilters();
        };

        imageBar.appendChild(btn);
    });

    imageWrapper.appendChild(imageBar);
    app.appendChild(imageWrapper);

    // ========================= ADD BUTTON =========================
    const addButtonWrapper = document.createElement('div');
    addButtonWrapper.className = 'w-100 px-0 mb-2';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-success w-100 d-flex align-items-center justify-content-center gap-2';
    addButton.innerHTML = `<i class="bi bi-plus-lg"></i> Add Teacher`;
    addButton.onclick = () => window.location.hash = '#/add-teacher';

    addButtonWrapper.appendChild(addButton);
    app.appendChild(addButtonWrapper);

    // ========================= COUNT =========================
    const teacherCountWrapper = document.createElement('div');
    teacherCountWrapper.className = 'w-100 px-0 mb-3';

    const teacherCountText = document.createElement('span');
    teacherCountText.className = 'text-muted fw-medium';
    teacherCountWrapper.appendChild(teacherCountText);
    app.appendChild(teacherCountWrapper);

    // ========================= LIST =========================
    const teacherListWrapper = document.createElement('div');
    teacherListWrapper.className = 'row g-3';
    app.appendChild(teacherListWrapper);

    // ========================= RENDER =========================
    function renderTeacherList(list) {
        teacherListWrapper.innerHTML = '';

        list.forEach(teacher => {
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

            const card = document.createElement('div');
            card.className = 'rounded p-3 position-relative';

            if (teacher.imgteacher) {
                card.style.border = '2px solid #28a745';
                card.style.backgroundImage = 'url("/assets/images/yes-bg.avif")';
            } else {
                card.style.border = '2px solid #dc3545';
                card.style.backgroundImage = 'url("/assets/images/no-bg.jpg")';
            }

            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';

            const content = document.createElement('div');
            content.style.background = 'rgba(255,255,255,0.85)';
            content.style.borderRadius = '4px';
            content.style.padding = '8px';

            // NAME + DELETE
            const top = document.createElement('div');
            top.className = 'd-flex justify-content-between align-items-start';

            const name = document.createElement('div');
            name.className = 'fw-bold fs-5';
            name.textContent = teacher.teacher ?? 'No Name';

            const del = document.createElement('button');
            del.className = teacher.imgteacher ? 'btn btn-sm btn-success' : 'btn btn-sm btn-danger';
            del.innerHTML = `<i class="bi bi-trash"></i>`;
            del.onclick = () => handleDeleteTeacher(teacher.teacherid ?? '');

            top.append(name, del);
            content.appendChild(top);

            // FATHER NAME (NULL SAFE)
            const fatherDiv = document.createElement('div');
            fatherDiv.textContent = 'Father: ' + (teacher.father ?? 'N/A');
            content.appendChild(fatherDiv);

            // ROLE (NULL SAFE)
            const roleDiv = document.createElement('div');
            roleDiv.textContent = 'Role: ' + (teacher.role ?? 'N/A');
            roleDiv.className = 'mb-2';
            content.appendChild(roleDiv);

            // BUTTONS
            const btnBox = document.createElement('div');
            btnBox.className = 'd-flex flex-column gap-2';

            const editRow = document.createElement('div');
            editRow.className = 'd-flex gap-2';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-secondary flex-fill';
            editBtn.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`;
            editBtn.onclick = () => window.location.hash = `#/edit-teacher/${teacher.teacherid ?? ''}`;

            const imgBtn = document.createElement('button');
            imgBtn.className = 'btn btn-sm btn-outline-secondary flex-fill';
            imgBtn.innerHTML = `<i class="bi bi-image"></i> Image`;
            imgBtn.onclick = () => window.location.hash = `#/edit-teacher-image/${teacher.teacherid ?? ''}`;

            editRow.append(editBtn, imgBtn);
            btnBox.appendChild(editRow);

            const viewBtn = document.createElement('button');
            viewBtn.className = teacher.imgteacher ? 'btn btn-sm btn-success' : 'btn btn-sm btn-danger';
            viewBtn.innerHTML = `<i class="bi bi-eye"></i> View`;
            viewBtn.onclick = () => window.location.hash = `#/view-teacher/${teacher.teacherid ?? ''}`;

            btnBox.appendChild(viewBtn);
            content.appendChild(btnBox);

            card.appendChild(content);
            col.appendChild(card);
            teacherListWrapper.appendChild(col);
        });

        teacherCountText.textContent = `Show Teachers: ${list.length}`;
    }

    // ========================= FILTER =========================
    function applyFilters() {
        let filtered = teachers;

        if (selectedImage === 'has') filtered = filtered.filter(t => t.imgteacher);
        if (selectedImage === 'no') filtered = filtered.filter(t => !t.imgteacher);

        if (searchText) {
            filtered = filtered.filter(t =>
                (t.teacher ?? '').toLowerCase().includes(searchText)
            );
        }

        renderTeacherList(filtered);
    }

    // ========================= DELETE =========================
    async function handleDeleteTeacher(id) {
        const ok = await Confirm.show('Are you sure you want to delete this teacher?');
        if (!ok) return;

        const res = await fetch(`https://esyserve.top/teacher/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await res.json();

        if (res.status === 200) {
            Toast.success(data ?? 'Teacher deleted');
            teachers = teachers.filter(t => (t.teacherid ?? '') !== id);
            applyFilters();
        } else {
            Toast.error(data ?? 'Delete failed');
        }
    }

    renderTeacherList(teachers);
}

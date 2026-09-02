import { showLoader, hideLoader } from '/assets/js/loader.js';
import Confirm from '/assets/js/confirm.js';
import Toast from '/components/Toast.js';

export default async function Students() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader(); // 🔄 START loader

    let students = [];

    try {
        const response = await fetch('https://esyserve.top/fetch/student', {
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
        students = Array.isArray(data) ? data : [];
        hideLoader();
    } catch (err) {
        hideLoader();
        console.error('Fetch error:', err);
        Toast.error('Failed to load students');
        return;
    }

    let selectedClass = 'all';
    let selectedImage = 'all';
    let searchText = '';

    // =========================
    // SEARCH BAR
    // =========================
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'w-100 px-0 my-2';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by student name...';
    searchInput.className = 'form-control';
    searchInput.addEventListener('input', () => {
        searchText = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    searchWrapper.appendChild(searchInput);
    app.appendChild(searchWrapper);

    // =========================
    // CLASS FILTER BAR
    // =========================
    const classWrapper = document.createElement('div');
    classWrapper.className = 'w-100 px-0 mb-2';

    const classBar = document.createElement('div');
    classBar.className = 'd-flex flex-nowrap overflow-auto py-1 gap-2';
    classBar.style.scrollbarWidth = 'none';
    classBar.style.msOverflowStyle = 'none';

    const classLabels = ['All', 'Play', 'Nursery', 'LKG', 'UKG', '1','2','3','4','5','6','7','8','9','10','11','12'];
    const classValues = ['all', 'play', 'nursery', 'lkg', 'ukg','1','2','3','4','5','6','7','8','9','10','11','12'];

    classLabels.forEach((label, index) => {
        const value = classValues[index];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.className = 'btn btn-sm flex-shrink-0 text-center';
        btn.style.width = '72px';

        if (index === 0) btn.classList.add('btn-primary', 'active');
        else btn.classList.add('btn-outline-primary');

        btn.addEventListener('click', () => {
            selectedClass = value;
            classBar.querySelectorAll('button').forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline-primary');
            });
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-primary', 'active');
            applyFilters();
        });

        classBar.appendChild(btn);
    });

    classWrapper.appendChild(classBar);
    app.appendChild(classWrapper);

    // =========================
    // IMAGE FILTER BAR
    // =========================
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'w-100 px-0 mb-2';

    const imageBar = document.createElement('div');
    imageBar.className = 'd-flex flex-nowrap overflow-auto py-1 gap-2';
    imageBar.style.scrollbarWidth = 'none';
    imageBar.style.msOverflowStyle = 'none';

    const imageLabels = ['All', 'Has Image', 'No Image'];
    const imageValues = ['all', 'has', 'no'];

    imageLabels.forEach((label, index) => {
        const value = imageValues[index];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.className = 'btn btn-sm text-center flex-shrink-0 text-truncate';
        btn.style.width = '120px';
        btn.style.whiteSpace = 'nowrap';

        if (index === 0) btn.classList.add('btn-secondary', 'active');
        else btn.classList.add('btn-outline-secondary');

        btn.addEventListener('click', () => {
            selectedImage = value;
            imageBar.querySelectorAll('button').forEach(b => {
                b.classList.remove('btn-secondary', 'active');
                b.classList.add('btn-outline-secondary');
            });
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-secondary', 'active');
            applyFilters();
        });

        imageBar.appendChild(btn);
    });

    imageWrapper.appendChild(imageBar);
    app.appendChild(imageWrapper);

    // =========================
    // ADD STUDENT BUTTON
    // =========================
    const addButtonWrapper = document.createElement('div');
    addButtonWrapper.className = 'w-100 px-0 mb-2';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-success w-100 d-flex align-items-center justify-content-center gap-2';
    addButton.innerHTML = `<i class="bi bi-plus-lg"></i> <span>Add Student</span>`;
    addButton.addEventListener('click', () => handleAddStudent());
    addButtonWrapper.appendChild(addButton);
    app.appendChild(addButtonWrapper);

    // =========================
    // STUDENT COUNT
    // =========================
    const studentCountWrapper = document.createElement('div');
    studentCountWrapper.className = 'w-100 px-0 mb-3';
    const studentCountText = document.createElement('span');
    studentCountText.className = 'text-muted fw-medium';
    studentCountWrapper.appendChild(studentCountText);
    app.appendChild(studentCountWrapper);

    // =========================
    // STUDENT LIST WRAPPER
    // =========================
    const studentListWrapper = document.createElement('div');
    studentListWrapper.className = 'row g-3';
    app.appendChild(studentListWrapper);

    // =========================
    // RENDER STUDENTS FUNCTION (NULL-SAFE)
    // =========================
    function renderStudentList(filteredStudents) {
        studentListWrapper.innerHTML = '';

        filteredStudents.forEach(student => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-3';

            const studentCard = document.createElement('div');
            studentCard.className = 'position-relative rounded p-3';
            studentCard.style.backgroundSize = 'cover';
            studentCard.style.backgroundPosition = 'center';
            studentCard.style.border = student.imgstudent ? '2px solid #28a745' : '2px solid #dc3545';
            studentCard.style.backgroundImage = student.imgstudent 
                ? 'url("/assets/images/yes-bg.avif")'
                : 'url("/assets/images/no-bg.jpg")';

            const contentDiv = document.createElement('div');
            contentDiv.style.position = 'relative';
            contentDiv.style.zIndex = 1;
            contentDiv.style.backgroundColor = 'rgba(255,255,255,0.85)';
            contentDiv.style.padding = '0.5rem';
            contentDiv.style.borderRadius = '0.25rem';

            // Top Row: Name + Delete
            const topRow = document.createElement('div');
            topRow.className = 'd-flex justify-content-between align-items-start mb-1';
            const nameDiv = document.createElement('div');
            nameDiv.textContent = student.student ?? 'No Name';
            nameDiv.className = 'fw-bold fs-5';
            topRow.appendChild(nameDiv);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = student.imgstudent ? 'btn btn-sm btn-success' : 'btn btn-sm btn-danger';
            deleteBtn.title = 'Delete';
            deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
            deleteBtn.addEventListener('click', () => handleDeleteStudent(student.studentid));
            topRow.appendChild(deleteBtn);

            contentDiv.appendChild(topRow);

            // Student Info
            const fatherDiv = document.createElement('div');
            fatherDiv.textContent = 'Father: ' + (student.father ?? 'N/A');
            fatherDiv.className = 'mb-1';
            contentDiv.appendChild(fatherDiv);

            const classDiv = document.createElement('div');
            classDiv.textContent = 'Class: ' + (student.class ?? 'N/A') + ' | Section: ' + (student.sectionclass ?? 'N/A');
            classDiv.className = 'mb-2';
            contentDiv.appendChild(classDiv);

            // Buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex flex-column gap-2';

            const editRow = document.createElement('div');
            editRow.className = 'd-flex gap-2 mb-1';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn btn-sm btn-outline-secondary flex-fill';
            editBtn.title = 'Edit Details';
            editBtn.innerHTML = `<i class="bi bi-pencil-square"></i> Edit`;
            editBtn.addEventListener('click', () => handleEditStudent(student.studentid));
            editRow.appendChild(editBtn);

            const imageBtn = document.createElement('button');
            imageBtn.type = 'button';
            imageBtn.className = 'btn btn-sm btn-outline-secondary flex-fill';
            imageBtn.title = 'Edit Image';
            imageBtn.innerHTML = `<i class="bi bi-image"></i> Image`;
            imageBtn.addEventListener('click', () => handleEditImage(student.studentid));
            editRow.appendChild(imageBtn);

            buttonContainer.appendChild(editRow);

            const viewBtn = document.createElement('button');
            viewBtn.type = 'button';
            viewBtn.className = student.imgstudent ? 'btn btn-sm btn-success w-100' : 'btn btn-sm btn-danger w-100';
            viewBtn.title = 'View';
            viewBtn.innerHTML = `<i class="bi bi-eye"></i> View`;
            viewBtn.addEventListener('click', () => handleViewStudent(student.studentid));
            buttonContainer.appendChild(viewBtn);

            contentDiv.appendChild(buttonContainer);
            studentCard.appendChild(contentDiv);
            colDiv.appendChild(studentCard);
            studentListWrapper.appendChild(colDiv);
        });

        studentCountText.textContent = `Show Students: ${filteredStudents.length}`;
    }

    // =========================
    // APPLY FILTERS FUNCTION
    // =========================
    function applyFilters() {
        let filtered = students;

        if (selectedClass !== 'all') filtered = filtered.filter(s => (s.class ?? '').toLowerCase() === selectedClass);
        if (selectedImage === 'has') filtered = filtered.filter(s => s.imgstudent);
        else if (selectedImage === 'no') filtered = filtered.filter(s => !s.imgstudent);

        if (searchText) {
            filtered = filtered.filter(s => 
                (s.student ?? '').toLowerCase().includes(searchText) ||
                (s.rollno ?? '').toLowerCase().includes(searchText)
            );
        }

        renderStudentList(filtered);
    }

    // =========================
    // BUTTON HANDLERS
    // =========================
    function handleAddStudent() { window.location.hash = '#/add-student'; }
    function handleEditStudent(id) { window.location.hash = `#/edit-student/${id}`; }
    function handleEditImage(id) { window.location.hash = `#/edit-student-image/${id}`; }
    function handleViewStudent(id) { window.location.hash = `#/view-student/${id}`; }

    async function handleDeleteStudent(id) {
        const confirmed = await Confirm.show('Are you sure you want to delete this student?');
        if (!confirmed) return;

        try {
            const res = await fetch(`https://esyserve.top/student/delete/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.status === 401) {
                Toast.warning('Please login first.');
                window.location.hash = '#/login';
                return;
            }

            const data = await res.json();
            if (res.status === 200) {
                Toast.success(data.message ?? 'Student deleted successfully!');
                students = students.filter(s => s.studentid !== id);
                applyFilters();
            } else {
                Toast.error(data.message ?? 'Failed to delete student');
            }
        } catch (err) {
            console.error(err);
            Toast.error('Network or server error');
        }
    }

    // =========================
    // INITIAL RENDER
    // =========================
    renderStudentList(students);
}

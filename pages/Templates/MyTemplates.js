import { showLoader, hideLoader } from '/assets/js/loader.js';

export default async function Home() {

    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    try {

        const response = await fetch('https://esyserve.top/fetch/template', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            hideLoader();
            Toast.warning('User needs to login first.');
            window.location.hash = '#/login';
            return;
        }

        const templates = await response.json();
        hideLoader();

        const container = document.createElement('div');
        container.className = 'container my-5';

        const title = document.createElement('h3');
        title.textContent = 'ID Card Templates';
        title.className = 'text-center fw-bold mb-3';
        container.appendChild(title);

        // 🔥 FILTER
        const filterDiv = document.createElement('div');
        filterDiv.className = 'text-center mb-4';

        filterDiv.innerHTML = `
            <button class="btn btn-sm btn-primary mx-1" data-filter="all">All</button>
            <button class="btn btn-sm btn-outline-primary mx-1" data-filter="student">Student</button>
            <button class="btn btn-sm btn-outline-primary mx-1" data-filter="teacher">Teacher</button>
        `;

        container.appendChild(filterDiv);

        const row = document.createElement('div');
        row.className = 'row g-4 justify-content-center';
        container.appendChild(row);

        app.appendChild(container);

        let currentFilter = 'all';

        // ================= COMMON SCHOOL DATA =================
        const schoolData = {
            school: "Sunrise Public School",
            location: "Harsoli",
            area: "Near Bus Stand",
            city: "Muzaffarnagar",
            district: "Muzaffarnagar",
            state: "Uttar Pradesh",
            pincode: "251001",
            school_contact: "8923128781",

            imglogo: window.location.origin + "/assets/images/logo.avif",
            imgsignature: window.location.origin + "/assets/images/signature.avif"
        };

        schoolData.school_address = [
            schoolData.location,
            schoolData.area,
            schoolData.city,
            schoolData.district,
            schoolData.state
        ].filter(Boolean).join(', ') + ' - ' + schoolData.pincode;

        // ================= RENDER =================
        function renderTemplates() {

            row.innerHTML = '';

            templates.forEach(template => {

                let html = template.html || '';

                const isTeacher =
                    html.toLowerCase().includes('{{teacher}}') ||
                    html.toLowerCase().includes('teacher');

                // 🔥 FILTER LOGIC
                if (
                    currentFilter === 'teacher' && !isTeacher ||
                    currentFilter === 'student' && isTeacher
                ) return;

                let userData = {};

                if (isTeacher) {
                    userData = {
                        teacher: "Rahul Sharma",
                        role: "Assistant Teacher",
                        father: "Mahesh Sharma",
                        mother: "Sunita Sharma",
                        dob: "21-4-2001",
                        contact: "8923128781",
                        address: "Jaipur",
                        imgteacher: window.location.origin + "/assets/images/student.avif"
                    };
                } else {
                    userData = {
                        student: "Rahul Sharma",
                        role: "Student",
                        father: "Mahesh Sharma",
                        mother: "Sunita Sharma",
                        class: "10",
                        sectionclass: "A",
                        dob: "12-05-2009",
                        contact: "9876543210",
                        address: "Jaipur",
                        imgstudent: window.location.origin + "/assets/images/student.avif"
                    };
                }

                const previewData = {
                    ...schoolData,
                    ...userData
                };

                // 🔥 REPLACE
                Object.keys(previewData).forEach(key => {
                    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
                    html = html.replace(regex, previewData[key] || '');
                });

                html = html.replace(/{{\s*teacher\s*}}/gi, previewData.name || '');
                html = html.replace(/{{\s*student\s*}}/gi, previewData.name || '');

                // ================= UI =================
                const col = document.createElement('div');
                col.className = 'col-12 col-md-6 col-lg-4 col-xl-3';

                const card = document.createElement('div');
                card.className = 'template-card';

                const name = document.createElement('div');
                name.textContent = `Template ${template.templateid}`;
                name.className = 'template-title';

                const frame = document.createElement('div');
                frame.className = 'template-frame';

                const preview = document.createElement('div');
                preview.className = 'template-preview';
                preview.innerHTML = html;

                // 🔥 SVG FIX (NO CROP)
                preview.querySelectorAll('svg').forEach(svg => {
                    svg.removeAttribute('width');
                    svg.removeAttribute('height');
                });

                frame.appendChild(preview);
                card.appendChild(name);
                card.appendChild(frame);
                col.appendChild(card);
                row.appendChild(col);

            });
        }

        // 🔥 FILTER CLICK
        filterDiv.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {

                currentFilter = btn.dataset.filter;

                filterDiv.querySelectorAll('button').forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline-primary');
                });

                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary');

                renderTemplates();
            });
        });

        renderTemplates();

        // ================= CSS =================
        const style = document.createElement('style');
        style.textContent = `
        .template-card{
            background:white;
            border-radius:12px;
            padding:12px;
            border:1px solid #e5e5e5;
        }

        .template-title{
            text-align:center;
            font-weight:600;
            margin-bottom:10px;
            font-size:14px;
        }

        .template-frame{
            width:100%;
            height:320px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f8f9fa;
            overflow:hidden;
        }

        .template-preview{
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        /* 🔥 NO CROP FIX */
        .template-preview svg{
            max-width:100%;
            max-height:100%;
            width:auto;
            height:auto;
        }
        `;
        document.head.appendChild(style);

    } catch (err) {
        hideLoader();
        console.error(err);
        app.innerHTML = '<div class="text-danger text-center mt-5">Failed to load templates</div>';
    }

}

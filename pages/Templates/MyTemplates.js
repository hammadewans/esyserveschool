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
        title.className = 'text-center fw-bold mb-4';
        container.appendChild(title);

        // FILTER BUTTONS
        const filterBox = document.createElement('div');
        filterBox.className = 'text-center mb-4';

        filterBox.innerHTML = `
            <button class="btn btn-outline-primary me-2 filter-btn active" data-type="all">All</button>
            <button class="btn btn-outline-primary me-2 filter-btn" data-type="students">Students</button>
            <button class="btn btn-outline-primary filter-btn" data-type="teacher">Teacher</button>
        `;
        container.appendChild(filterBox);

        const row = document.createElement('div');
        row.className = 'row g-4 justify-content-center';
        container.appendChild(row);

        app.appendChild(container);

        // FUNCTION TO RENDER TEMPLATES
        function renderTemplates(type = "all") {

            row.innerHTML = '';

            const filtered = type === "all"
                ? templates
                : templates.filter(t => t.type === type);

            filtered.forEach(template => {

                const previewData = {

                    school: "Sunrise Public School",

                    location: "Near Bus Stand",
                    area: "Shyam Nagar",
                    city: "Jaipur",
                    district: "Jaipur",
                    state: "Rajasthan",
                    pincode: "302012",

                    student: "Rahul Sharma",
                    father: "Mahesh Sharma",
                    mother: "Suman Sharma",

                    class: "10",
                    sectionclass: "A",

                    dob: "12-05-2009",
                    contact: "9876543210",

                    address: "Shyam Nagar, Jaipur",

                    role: template.type === "teacher" ? "Teacher" : "Student",

                    school_contact: "0141-2223344",

                    imgstudent: "/assets/images/student.avif",
                    imgsignature: "/assets/images/signature.avif",
                    imglogo: "/assets/images/logo.avif"

                };

                let html = template.html;

                Object.keys(previewData).forEach(key => {
                    const value = previewData[key];
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    html = html.replace(regex, value);
                });

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

                // FIXED SCALE: full width & height
                preview.style.width = '100%';
                preview.style.height = '100%';
                preview.style.transform = 'none'; // remove any scaling
                preview.style.display = 'flex';
                preview.style.alignItems = 'center';
                preview.style.justifyContent = 'center';

                frame.appendChild(preview);
                card.appendChild(name);
                card.appendChild(frame);
                col.appendChild(card);
                row.appendChild(col);

            });

        }

        // INITIAL LOAD
        renderTemplates("all");

        // FILTER CLICK
        document.querySelectorAll('.filter-btn').forEach(btn => {

            btn.addEventListener('click', () => {

                document.querySelectorAll('.filter-btn')
                    .forEach(b => b.classList.remove('active'));

                btn.classList.add('active');

                const type = btn.dataset.type;
                renderTemplates(type);

            });

        });

        // CSS
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
            color:#444;
        }

        .template-frame{
            width:100%;
            aspect-ratio:1/1;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            border-radius:8px;
        }

        .template-preview svg{
            width:100%;
            height:100%;
            object-fit:contain;
        }

        .filter-btn.active{
            background:#0d6efd;
            color:white;
        }

        `;
        document.head.appendChild(style);

    } catch (err) {

        hideLoader();
        console.error(err);
        app.innerHTML = '<div class="text-danger text-center mt-5">Failed to load templates</div>';

    }

}

import { showLoader, hideLoader } from '/assets/js/loader.js';

export default async function Home() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    try {
        // ===== API CALLS =====
        const responses = await Promise.all([
            fetch('https://esyserve.top/count/school', { method: 'GET' }),
            fetch('https://esyserve.top/count/teacher', { method: 'GET' }),
            fetch('https://esyserve.top/count/student', { method: 'GET' })
        ]);

        if (responses.some(r => r.status === 401)) {
            hideLoader();
            Toast.warning('User need to login first.');
            window.location.hash = '#/login';
            return;
        }

        const [s, t, st] = await Promise.all(responses.map(r => r.json()));

        hideLoader();

        // ================= VIDEO =================
        const videoWrapper = document.createElement('div');
        videoWrapper.style.width = '100%';
        videoWrapper.style.maxWidth = '600px';
        videoWrapper.style.aspectRatio = '4 / 3';
        videoWrapper.style.margin = '0 auto 20px';
        videoWrapper.style.overflow = 'hidden';

        const video = document.createElement('video');
        video.src = '/assets/videos/card-video.mp4';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';

        videoWrapper.appendChild(video);
        app.appendChild(videoWrapper);


        // ================= PRODUCT CATEGORIES =================
        const categorySection = document.createElement('div');
        categorySection.className = 'container my-5';

        const title = document.createElement('h4');
        title.className = 'text-center mb-4 fw-bold';
        title.textContent = 'Our Products';

        categorySection.appendChild(title);

        const catRow = document.createElement('div');
        catRow.className = 'row justify-content-center g-4';

        function createCategoryCard(title, subtitle, img, route) {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4';

            const card = document.createElement('div');
            card.style.position = 'relative';
            card.style.height = '260px';
            card.style.borderRadius = '16px';
            card.style.overflow = 'hidden';
            card.style.cursor = 'pointer';
            card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            card.style.transition = '0.4s ease';

            card.onclick = () => {
                window.location.hash = route;
            };

            const image = document.createElement('img');
            image.src = img;
            image.style.width = '100%';
            image.style.height = '100%';
            image.style.objectFit = 'cover';
            image.style.transition = '0.6s ease';

            // Overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background =
                'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.25))';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.justifyContent = 'flex-end';
            overlay.style.padding = '20px';
            overlay.style.transition = '0.4s ease';

            const heading = document.createElement('h5');
            heading.textContent = title;
            heading.style.color = 'white';
            heading.style.fontWeight = '700';
            heading.style.margin = '0';

            const sub = document.createElement('p');
            sub.textContent = subtitle;
            sub.style.color = 'rgba(255,255,255,0.85)';
            sub.style.fontSize = '13px';
            sub.style.margin = '4px 0 0 0';

            overlay.appendChild(heading);
            overlay.appendChild(sub);

            // Hover Animation
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
                overlay.style.background =
                    'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4))';
            });

            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                overlay.style.background =
                    'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.25))';
            });

            card.appendChild(image);
            card.appendChild(overlay);
            col.appendChild(card);

            return col;
        }

        catRow.append(
            createCategoryCard(
                'ID Card',
                'Professional & Durable Identity Solutions',
                '/assets/images/id-card.jpg',
                '#/products/allcards'
            ),
            createCategoryCard(
                'Branding Polybag',
                'Custom Printed Packaging for Your Brand',
                '/assets/images/polybag.webp',
                '#/products/allpolybags'
            ),
            createCategoryCard(
                'Branding Notebook',
                'Premium Quality Customized Notebooks',
                '/assets/images/notebook.jpg',
                '#/products/allnotebooks'
            )
        );

        categorySection.appendChild(catRow);
        app.appendChild(categorySection);


        // ================= STATS (LAST) =================
        const wrapper = document.createElement('div');
        wrapper.className = 'container my-5';

        const row = document.createElement('div');
        row.className = 'row justify-content-center g-3';

        function createBox(icon, label, color, valueText = '0') {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4';

            const card = document.createElement('div');
            card.className = 'd-flex flex-column align-items-center py-4 rounded shadow-sm';
            card.style.backgroundColor = '#f8f9fa';
            card.style.color = color;

            const i = document.createElement('i');
            i.className = icon + ' mb-2';
            i.style.fontSize = '28px';

            const value = document.createElement('div');
            value.textContent = valueText;
            value.className = 'fw-bold fs-4 mb-1';

            const text = document.createElement('div');
            text.textContent = label;
            text.className = 'text-muted small text-center';

            card.append(i, value, text);
            col.appendChild(card);
            return col;
        }

        row.append(
            createBox('bi bi-people', 'Happy Students', '#9333ea', st + 7500),
            createBox('bi bi-mortarboard', 'Happy Teachers', '#16a34a', t + 90),
            createBox('bi bi-buildings', 'Happy Schools', '#2563eb', s + 15)
        );

        wrapper.appendChild(row);
        app.appendChild(wrapper);

    } catch (err) {
        hideLoader();
        console.error(err);
    }
}

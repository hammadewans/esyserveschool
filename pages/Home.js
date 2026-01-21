import { showLoader, hideLoader } from '/assets/js/loader.js';

export default async function Home() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader(); // 🔄 START loader

    try {
        // ===== SEND REQUESTS =====
        const responses = await Promise.all([
            fetch('https://esyserve.top/count/school', { method: 'GET', credentials: 'include' }),
            fetch('https://esyserve.top/count/teacher', { method: 'GET', credentials: 'include' }),
            fetch('https://esyserve.top/count/student', { method: 'GET', credentials: 'include' })
        ]);

        if (responses.some(r => r.status === 401)) {
            hideLoader();
            Toast.warning('User need to login first.');
            window.location.hash = '#/login';
            return;
        }

        const [s, t, st] = await Promise.all(responses.map(r => r.json()));

        hideLoader(); // 🔚 HIDE LOADER

        // ===== VIDEO =====
        const videoWrapper = document.createElement('div');
        videoWrapper.style.width = '100%';
        videoWrapper.style.maxWidth = '600px'; // landscape max width
        videoWrapper.style.aspectRatio = '4 / 3'; // keep landscape
        videoWrapper.style.margin = '0 auto 16px'; // center + spacing
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

        // ===== DATA BOXES =====
        const wrapper = document.createElement('div');
        wrapper.className = 'container my-4'; // Bootstrap container with margin

        const row = document.createElement('div');
        row.className = 'row justify-content-center g-3'; // g-3 adds spacing between columns

        function createBox(icon, label, color, valueText = '0') {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4'; // full width on mobile, 3 per row on desktop

            const card = document.createElement('div');
            card.className = 'd-flex flex-column align-items-center py-3 rounded';
            card.style.backgroundColor = '#f8f9fa'; // light grey background
            card.style.color = color;

            const i = document.createElement('i');
            i.className = icon + ' mb-2'; // Bootstrap icon + margin-bottom
            i.style.fontSize = '24px';
            i.style.color = color;

            const value = document.createElement('div');
            value.textContent = valueText;
            value.className = 'fw-bold fs-5 mb-1';
            value.style.color = color;

            const text = document.createElement('div');
            text.textContent = label;
            text.className = 'text-muted small text-center';

            card.append(i, value, text);
            col.appendChild(card);
            return col;
        }

        row.append(
            createBox('bi bi-people', 'Happy Students', '#9333ea', st+7500),
            createBox('bi bi-mortarboard', 'Happy Teachers', '#16a34a', t+90),
            createBox('bi bi-buildings', 'Happy Schools', '#2563eb', s+15)
        );

        wrapper.appendChild(row);
        app.appendChild(wrapper);


    } catch (err) {
        hideLoader();
        console.error(err);
    }
}

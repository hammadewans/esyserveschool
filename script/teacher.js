document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeTeacherDB";
  const DB_VERSION = 1;
  const STORE_NAME = "teachers";
  let db;

  const PAGE_SIZE = 18;
  let teachersCache = [];
  let currentIndex = 0;
  let observer;
  let isoInstance;

  console.log("Initializing IndexedDB for teachers...");

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "teacherid" });
      console.log(`Object store "${STORE_NAME}" created.`);
    }
  };

  request.onsuccess = e => {
    db = e.target.result;
    console.log(`IndexedDB "${DB_NAME}" opened successfully.`);
    loadFromIndexedDB().then(teachers => {
      if (teachers.length > 0) {
        console.log(`Loaded ${teachers.length} teachers from IndexedDB.`);
        teachersCache = teachers;
        initRender();
      } else {
        console.log("No teachers in IndexedDB, fetching from server...");
        fetchFromBackend();
      }
    }).catch(err => {
      console.error("Error loading from IndexedDB:", err);
      fetchFromBackend();
    });
  };

  request.onerror = e => {
    console.error("Failed to open IndexedDB:", e.target.error);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    console.log("Fetching teachers from backend server...");
    fetch('https://esyserve.top/fetch/teacher', { method: 'GET', credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data) return console.warn("No data returned from server.");
        console.log(`Fetched ${data.length} teachers from server.`);
        teachersCache = data;
        saveToIndexedDB(data).then(() => console.log("Teachers saved to IndexedDB."));
        initRender();
      })
      .catch(err => console.error("Fetch error:", err));
  }

  function saveToIndexedDB(teachers) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not initialized.");
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      teachers.forEach(t => store.put(t));
      tx.oncomplete = () => resolve();
      tx.onerror = e => reject(e.target.error);
    });
  }

  function loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!db || !db.objectStoreNames.contains(STORE_NAME)) return resolve([]);
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = e => reject(e.target.error);
    });
  }

  function initRender() {
    console.log("Initializing render...");
    container.innerHTML = "";
    currentIndex = 0;

    // Sentinel for lazy loading
    let sentinel = document.getElementById("sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.id = "sentinel";
      sentinel.style.height = "50px";
      container.after(sentinel);
    }

    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log("Loading next batch of teachers...");
        renderNextBatch();
      }
    }, { threshold: 1.0 });
    observer.observe(sentinel);

    // Initialize Isotope once
    const isoParent = container.closest('.isotope-layout');
    if (isoParent && !isoInstance) {
      isoInstance = new Isotope(container, {
        itemSelector: '.isotope-item',
        layoutMode: isoParent.getAttribute('data-layout') ?? 'masonry',
        filter: isoParent.getAttribute('data-default-filter') ?? '*',
        sortBy: isoParent.getAttribute('data-sort') ?? 'original-order'
      });
      imagesLoaded(container, () => isoInstance.layout());
      isoParent.querySelectorAll('.isotope-filters li').forEach(btn => {
        btn.addEventListener('click', function () {
          isoParent.querySelector('.filter-active')?.classList.remove('filter-active');
          this.classList.add('filter-active');
          isoInstance.arrange({ filter: this.getAttribute('data-filter') });
        });
      });
    }

    console.log("Rendering first batch of teachers...");
    renderNextBatch();
  }

  function renderNextBatch() {
    const nextBatch = teachersCache.slice(currentIndex, currentIndex + PAGE_SIZE);
    if (nextBatch.length === 0) return;

    nextBatch.forEach(teacher => {
      const teacherName = window.DataHandler.capitalize(teacher.teacher);
      const teacherRole = window.DataHandler.capitalize(teacher.role);

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${teacherRole.toLowerCase()}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${teacher.imgteacher}" class="img-fluid" alt="${teacherName}">
          <div class="portfolio-info">
            <h4>${teacherName}</h4>
            <p>Role: ${teacherRole}</p>
            <div>
              <a href="${teacher.imgteacher}" title="${teacherName}" data-gallery="portfolio-gallery-${teacherRole}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
              <a href="teacher-details.html?teacherid=${teacher.teacherid}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);

      if (isoInstance) isoInstance.appended(div);
    });

    GLightbox({ selector: '.glightbox' });

    currentIndex += PAGE_SIZE;
    console.log(`Rendered ${currentIndex} of ${teachersCache.length} teachers.`);

    if (currentIndex >= teachersCache.length && observer) {
      observer.disconnect();
      console.log("All teachers loaded, observer disconnected.");
    }
  }
});

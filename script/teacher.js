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

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "teacherid" });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    loadFromIndexedDB().then(teachers => {
      if (teachers.length > 0) {
        teachersCache = teachers;
        initRender();
      } else {
        fetchFromBackend();
      }
    }).catch(fetchFromBackend);
  };

  request.onerror = fetchFromBackend;

  function fetchFromBackend() {
    fetch('https://esyserve.top/fetch/teacher', { method: 'GET', credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        teachersCache = data;
        saveToIndexedDB(data);
        initRender();
      })
      .catch(console.error);
  }

  function saveToIndexedDB(teachers) {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    teachers.forEach(t => store.put(t));
  }

  function loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject();
    });
  }

  function initRender() {
    container.innerHTML = "";
    currentIndex = 0;
    renderNextBatch();

    const sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    sentinel.style.height = "50px";
    container.after(sentinel);

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) renderNextBatch();
    }, { threshold: 1.0 });

    observer.observe(sentinel);
  }

  function renderNextBatch() {
    const nextBatch = teachersCache.slice(currentIndex, currentIndex + PAGE_SIZE);

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
    });

    currentIndex += PAGE_SIZE;
    if (currentIndex >= teachersCache.length && observer) observer.disconnect();

    const isoParent = container.closest('.isotope-layout');
    if (isoParent) {
      const isoInstance = new Isotope(container, {
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
    GLightbox({ selector: '.glightbox' });
  }
});
        fetchFromBackend();
      }
    }).catch(err => {
      console.error("Error loading from IndexedDB:", err);
      fetchFromBackend();
    });
  };

  request.onerror = (e) => {
    console.error("IndexedDB error:", e.target.error);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    fetch('https://esyserve.top/fetch/teacher', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response.status === 204) return null;
        if (response.status === 401) { window.location.href = "login.html"; return null; }
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        if (!data) return;

        teachersCache = data;
        saveToIndexedDB(data).then(() => console.log("Teachers saved to IndexedDB"));
        initRender();
      })
      .catch(error => console.error('Fetch error:', error));
  }

  function saveToIndexedDB(teachers) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      teachers.forEach(t => store.put(t));
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  function loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains(STORE_NAME)) return resolve([]);
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function initRender() {
    container.innerHTML = "";
    currentIndex = 0;
    renderNextBatch();

    let sentinel = document.getElementById("sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.id = "sentinel";
      sentinel.style.height = "50px";
      container.after(sentinel);
    }

    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) renderNextBatch(); }, { threshold: 1.0 });
    observer.observe(sentinel);
  }

  function renderNextBatch() {
    const nextBatch = teachersCache.slice(currentIndex, currentIndex + PAGE_SIZE);

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
    });

    initIsotopeLayout();
    GLightbox({ selector: '.glightbox' });

    currentIndex += PAGE_SIZE;
    if (currentIndex >= teachersCache.length && observer) observer.disconnect();
  }

  function initIsotopeLayout() {
    const isoParent = container.closest('.isotope-layout');
    const isoInstance = new Isotope(container, {
      itemSelector: '.isotope-item',
      layoutMode: isoParent.getAttribute('data-layout') ?? 'masonry',
      filter: isoParent.getAttribute('data-default-filter') ?? '*',
      sortBy: isoParent.getAttribute('data-sort') ?? 'original-order'
    });

    imagesLoaded(container, () => isoInstance.layout());

    isoParent.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
      filterBtn.addEventListener('click', function () {
        isoParent.querySelector('.filter-active')?.classList.remove('filter-active');
        this.classList.add('filter-active');
        isoInstance.arrange({ filter: this.getAttribute('data-filter') });
      });
    });
  }
});


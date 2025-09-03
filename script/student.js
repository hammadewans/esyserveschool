document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeDB";
  const DB_VERSION = 2; // Use latest DB version
  const STORE_NAME = "students";
  let db;

  // --- Pagination state ---
  const PAGE_SIZE = 18;
  let studentsCache = [];
  let currentIndex = 0;
  let observer;

  // --- Open IndexedDB ---
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    db = e.target.result;

    // Create students store if it doesn't exist
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
    }

    // Keep teachers store intact if exists
    if (!db.objectStoreNames.contains("teachers")) {
      db.createObjectStore("teachers", { keyPath: "teacherid" });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;

    loadFromIndexedDB().then(students => {
      if (students.length > 0) {
        console.log("Loaded students from IndexedDB:", students.length);
        studentsCache = students;
        initRender();
      } else {
        console.log("No cached student data, fetching from backend...");
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

  // --- Fetch from backend ---
  function fetchFromBackend() {
    fetch('https://esyserve.top/fetch/student', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response.status === 204) {
          console.warn('No student data added yet');
          return null;
        }
        if (response.status === 401) {
          window.location.href = "login.html";
          return null;
        }
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        if (!data) return;

        studentsCache = data;

        saveToIndexedDB(data).then(() => {
          console.log("Students saved to IndexedDB");
        });

        initRender();
      })
      .catch(error => console.error('Fetch error:', error));
  }

  // --- Save to IndexedDB ---
  function saveToIndexedDB(students) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      students.forEach(student => store.put(student));
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  // --- Load from IndexedDB ---
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

  // --- Initialize lazy rendering ---
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
    observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) renderNextBatch();
    }, { threshold: 1.0 });
    observer.observe(sentinel);
  }

  // --- Render next batch of students ---
  function renderNextBatch() {
    const nextBatch = studentsCache.slice(currentIndex, currentIndex + PAGE_SIZE);

    nextBatch.forEach(student => {
      const studentName = window.DataHandler.capitalize(student.student);
      const studentClass = window.DataHandler.capitalize(student.class);
      const studentSection = window.DataHandler.capitalize(student.sectionclass);

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${student.class}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${student.imgstudent}" class="img-fluid" alt="${studentName}">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${studentClass}, Section: ${studentSection}</p>
            <div>
              <a href="${student.imgstudent}" title="${studentName}" data-gallery="portfolio-gallery-${studentClass}" class="glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
              <a href="student-details.html?studentid=${student.studentid}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    initIsotopeLayout();
    GLightbox({ selector: '.glightbox' });

    currentIndex += PAGE_SIZE;

    if (currentIndex >= studentsCache.length && observer) observer.disconnect();
  }

  // --- Isotope layout ---
  function initIsotopeLayout() {
    const isoParent = container.closest('.isotope-layout');
    const isoInstance = new Isotope(container, {
      itemSelector: '.isotope-item',
      layoutMode: isoParent.getAttribute('data-layout') ?? 'masonry',
      filter: isoParent.getAttribute('data-default-filter') ?? '*',
      sortBy: isoParent.getAttribute('data-sort') ?? 'original-order'
    });

    imagesLoaded(container, function () { isoInstance.layout(); });

    isoParent.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
      filterBtn.addEventListener('click', function () {
        isoParent.querySelector('.filter-active')?.classList.remove('filter-active');
        this.classList.add('filter-active');
        isoInstance.arrange({ filter: this.getAttribute('data-filter') });
      });
    });
  }
});

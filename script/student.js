document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeStudentDB";
  const DB_VERSION = 1;
  const STORE_NAME = "students";
  let db;

  const PAGE_SIZE = 18;
  let studentsCache = [];
  let currentIndex = 0;
  let isoInstance;

  console.log("Initializing IndexedDB...");

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
      console.log(`Object store "${STORE_NAME}" created.`);
    }
  };

  request.onsuccess = e => {
    db = e.target.result;
    console.log(`IndexedDB "${DB_NAME}" opened successfully.`);

    loadFromIndexedDB().then(students => {
      if (students.length > 0) {
        console.log(`Loaded ${students.length} students from IndexedDB.`);
        studentsCache = students;
        initRender();
      } else {
        console.log("No students in IndexedDB, fetching from server...");
        fetchFromBackend();
      }
    }).catch(err => {
      console.error("Error loading from IndexedDB:", err);
      fetchFromBackend();
    });
  };

  request.onerror = e => {
    console.error("Failed to open IndexedDB, fetching from server...", e);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    console.log("Fetching students from backend server...");
    fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error(`Server responded with ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log("Raw server response:", data);

        if (!Array.isArray(data)) {
          console.warn("Expected an array of students but got:", data);
          return;
        }

        console.log(`Fetched ${data.length} students from server.`);
        studentsCache = data;
        saveToIndexedDB(data);
        initRender();
      })
      .catch(error => console.error('Fetch error:', error));
  }

  function saveToIndexedDB(students) {
    if (!db) {
      console.warn("Database not initialized. Cannot save to IndexedDB.");
      return;
    }
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    students.forEach(s => store.put(s));
    tx.oncomplete = () => console.log(`Saved ${students.length} students to IndexedDB.`);
    tx.onerror = e => console.error("Error saving to IndexedDB:", e.target.error);
  }

  function loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!db || !db.objectStoreNames.contains(STORE_NAME)) {
        console.log("No object store found in IndexedDB.");
        return resolve([]);
      }
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = e => reject(e.target.error);
    });
  }

  function initRender() {
    container.innerHTML = "";
    currentIndex = 0;

    const isoParent = container.closest('.isotope-layout');
    if (isoParent) {
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

    console.log("Rendering all students...");
    renderAllStudents();
  }

  function renderAllStudents() {
    studentsCache.forEach(student => {
      const studentName = window.DataHandler?.capitalize(student.student) ?? student.student;
      const studentClass = window.DataHandler?.capitalize(student.class) ?? student.class;
      const studentSection = window.DataHandler?.capitalize(student.sectionclass) ?? student.sectionclass;

      const safeClass = (student.class || "unknown").replace(/\s+/g, '-').toLowerCase();

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${safeClass}`;
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

      if (isoInstance) {
        isoInstance.appended(div);
      }
    });

    GLightbox({ selector: '.glightbox' });

    console.log(`Rendered ${studentsCache.length} students.`);
  }
});

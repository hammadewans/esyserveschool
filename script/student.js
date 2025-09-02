document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeDB";
  const STORE_NAME = "students";
  let db;

  // --- Open IndexedDB ---
  const request = indexedDB.open(DB_NAME, 1);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;

    // Try loading from DB first
    loadFromIndexedDB().then(students => {
      if (students.length > 0) {
        console.log("Loaded from IndexedDB:", students.length);
        renderStudents(students);
      } else {
        console.log("No cached data, fetching from backend...");
        fetchFromBackend();
      }
    });
  };

  request.onerror = (e) => {
    console.error("IndexedDB error:", e.target.error);
    // fallback → fetch from backend
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
          console.warn('Data not Added Yet');
          return;
        }
        if (response.status === 401) {
          window.location.href = "login.html";
          return;
        }
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        if (!data) return;

        // Save to DB
        saveToIndexedDB(data).then(() => {
          console.log("Students saved to IndexedDB");
        });

        // Render
        renderStudents(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  // --- Save students to IndexedDB ---
  function saveToIndexedDB(students) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      students.forEach(student => store.put(student));
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  // --- Load students from IndexedDB ---
  function loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // --- Render students in UI ---
  function renderStudents(data) {
    container.innerHTML = ""; // clear old

    data.forEach(student => {
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

    imagesLoaded(container, function () {
      isoInstance.layout();
    });

    isoParent.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
      filterBtn.addEventListener('click', function () {
        isoParent.querySelector('.filter-active')?.classList.remove('filter-active');
        this.classList.add('filter-active');
        isoInstance.arrange({ filter: this.getAttribute('data-filter') });
      });
    });
  }
});

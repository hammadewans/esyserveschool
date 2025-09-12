document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeStudentDB";
  const DB_VERSION = 1;
  const STORE_NAME = "students";
  let db;
  let studentsCache = [];
  let isoInstance;

  console.log("Initializing IndexedDB for students...");

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
        renderAll();
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
    console.error("Failed to open IndexedDB:", e.target.error);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    console.log("Fetching students from backend server...");
    fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data) return console.warn("No data returned from server.");
        console.log(`Fetched ${data.length} students from server.`);
        studentsCache = data;
        saveToIndexedDB(data).then(() => console.log("Students saved to IndexedDB."));
        renderAll();
      })
      .catch(err => console.error("Fetch error:", err));
  }

  function saveToIndexedDB(students) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not initialized.");
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      students.forEach(s => store.put(s));
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

  function renderAll() {
    console.log("Rendering all students...");
    container.innerHTML = "";
    studentsCache.forEach(student => {
      const studentName = window.DataHandler.capitalize(student.student ?? "Unknown");
      const studentClass = (student.class ?? "Unknown").toLowerCase().replace(/\s+/g, "");
      const studentSection = (student.sectionclass ?? "").toLowerCase().replace(/\s+/g, "");

      let imgSrc = student.imgstudent && student.imgstudent.trim()
        ? student.imgstudent
        : "img/test.jpg";

      // 🔑 Match class names with filter buttons (e.g. "ukg", "1", "2")
      // Add section if available (like "1-a")
      const filterClass = studentSection ? `${studentClass}-${studentSection}` : studentClass;

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${filterClass}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${imgSrc}" class="img-fluid" alt="${studentName}" onerror="this.src='img/test.jpg'">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class ?? "Unknown"} - Section ${student.sectionclass ?? "A"}</p>
            <div>
              <a href="${imgSrc}" 
                 title="${studentName}" 
                 data-gallery="portfolio-gallery-${filterClass}" 
                 class="glightbox preview-link">
                 <i class="bi bi-zoom-in"></i>
              </a>
              <a href="student-details.html?studentid=${student.studentid}" 
                 title="More Details" 
                 class="details-link">
                 <i class="bi bi-link-45deg"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

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
          const filterValue = this.getAttribute('data-filter');
          console.log("Filtering with:", filterValue);
          isoInstance.arrange({ filter: filterValue });
        });
      });
    }

    GLightbox({ selector: '.glightbox' });
    console.log("All students rendered.");
  }
});      fetchFromBackend();
    });
  };

  request.onerror = e => {
    console.error("Failed to open IndexedDB:", e.target.error);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    console.log("Fetching students from backend server...");
    fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data) return console.warn("No data returned from server.");
        console.log(`Fetched ${data.length} students from server.`);
        studentsCache = data;
        saveToIndexedDB(data).then(() => console.log("Students saved to IndexedDB."));
        renderAll();
      })
      .catch(err => console.error("Fetch error:", err));
  }

  function saveToIndexedDB(students) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not initialized.");
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      students.forEach(s => store.put(s));
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

  function renderAll() {
    console.log("Rendering all students...");
    container.innerHTML = "";
    studentsCache.forEach(student => {
      const studentName = window.DataHandler.capitalize(student.student ?? "Unknown");
      const studentClass = window.DataHandler.capitalize(student.class ?? "Unknown");
      const studentSection = window.DataHandler.capitalize(student.sectionclass ?? "A");

      let imgSrc = student.imgstudent && student.imgstudent.trim()
        ? student.imgstudent
        : "img/test.jpg";

      // 🔑 cleaned filter class (no "filter-" prefix)
      const filterClass = `${studentClass}-${studentSection}`.toLowerCase().replace(/\s+/g, "-");

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${filterClass}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${imgSrc}" class="img-fluid" alt="${studentName}" onerror="this.src='img/test.jpg'">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${studentClass} - Section ${studentSection}</p>
            <div>
              <a href="${imgSrc}" 
                 title="${studentName}" 
                 data-gallery="portfolio-gallery-${filterClass}" 
                 class="glightbox preview-link">
                 <i class="bi bi-zoom-in"></i>
              </a>
              <a href="student-details.html?studentid=${student.studentid}" 
                 title="More Details" 
                 class="details-link">
                 <i class="bi bi-link-45deg"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

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
          const filterValue = this.getAttribute('data-filter');
          console.log("Filtering with:", filterValue);
          isoInstance.arrange({ filter: filterValue });
        });
      });
    }

    GLightbox({ selector: '.glightbox' });
    console.log("All students rendered.");
  }
});
</script>    });
  };

  request.onerror = e => {
    console.error("Failed to open IndexedDB:", e.target.error);
    fetchFromBackend();
  };

  function fetchFromBackend() {
    console.log("Fetching students from backend server...");
    fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data) return console.warn("No data returned from server.");
        console.log(`Fetched ${data.length} students from server.`);
        studentsCache = data;
        saveToIndexedDB(data).then(() => console.log("Students saved to IndexedDB."));
        renderAll();
      })
      .catch(err => console.error("Fetch error:", err));
  }

  function saveToIndexedDB(students) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not initialized.");
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      students.forEach(s => store.put(s));
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

  function renderAll() {
    console.log("Rendering all students...");
    container.innerHTML = "";
    studentsCache.forEach(student => {
      const studentName = window.DataHandler.capitalize(student.student ?? "Unknown");
      const studentClass = window.DataHandler.capitalize(student.class ?? "Unknown");
      const studentSection = window.DataHandler.capitalize(student.sectionclass ?? "A");

      let imgSrc = student.imgstudent && student.imgstudent.trim()
        ? student.imgstudent
        : "img/test.jpg";

      const filterClass = `${studentClass}-${studentSection}`.toLowerCase().replace(/\s+/g, "-");

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${filterClass}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${imgSrc}" class="img-fluid" alt="${studentName}" onerror="this.src='img/test.jpg'">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${studentClass} - Section ${studentSection}</p>
            <div>
              <a href="${imgSrc}" 
                 title="${studentName}" 
                 data-gallery="portfolio-gallery-${filterClass}" 
                 class="glightbox preview-link">
                 <i class="bi bi-zoom-in"></i>
              </a>
              <a href="student-details.html?studentid=${student.studentid}" 
                 title="More Details" 
                 class="details-link">
                 <i class="bi bi-link-45deg"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

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

    GLightbox({ selector: '.glightbox' });
    console.log("All students rendered.");
  }
});



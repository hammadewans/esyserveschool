document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  const DB_NAME = "EsyServeStudentDB"; // separate DB
  const DB_VERSION = 1;
  const STORE_NAME = "students";
  let db;

  const PAGE_SIZE = 18;
  let studentsCache = [];
  let currentIndex = 0;
  let observer;

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    loadFromIndexedDB().then(students => {
      if (students.length > 0) {
        studentsCache = students;
        initRender();
      } else {
        fetchFromBackend();
      }
    }).catch(fetchFromBackend);
  };

  request.onerror = fetchFromBackend;

  function fetchFromBackend() {
    fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        studentsCache = data;
        saveToIndexedDB(data);
        initRender();
      })
      .catch(console.error);
  }

  function saveToIndexedDB(students) {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    students.forEach(s => store.put(s));
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

    currentIndex += PAGE_SIZE;
    if (currentIndex >= studentsCache.length && observer) observer.disconnect();

    // Isotope & GLightbox
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
      if (entries[0].isIntersecting) renderNextBatch();
    }, { threshold: 1.0 });

    observer.observe(sentinel);
  }

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

    currentIndex += PAGE_SIZE;
    if (currentIndex >= studentsCache.length && observer) observer.disconnect();

    // Isotope & GLightbox
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


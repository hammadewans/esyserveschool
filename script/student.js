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

  // ------------------------------
  // IndexedDB Initialization
  // ------------------------------
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
      console.log("Object store created:", STORE_NAME);
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully:", DB_NAME);
    fetchFromBackend();
  };

  request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
  };

  // ------------------------------
  // Fetch Students from Backend
  // ------------------------------
  function fetchFromBackend() {
    console.log("Fetching students from backend server...");

    fetch("https://esyserve.top/fetch/student", {
      method: "GET",
      credentials: "include" // ✅ FIXED: allow cookies/session
    })
      .then(res => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn("Expected an array of students but got:", data);
          return;
        }
        console.log(`Fetched ${data.length} students from server.`);
        studentsCache = data;
        saveToIndexedDB(data);
        initRender();
      })
      .catch(err => console.error("Error fetching students:", err));
  }

  // ------------------------------
  // Save to IndexedDB
  // ------------------------------
  function saveToIndexedDB(students) {
    if (!db) {
      console.warn("Database not initialized yet.");
      return;
    }

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    students.forEach(student => {
      store.put(student);
    });

    tx.oncomplete = () => {
      console.log("All students saved to IndexedDB.");
    };
    tx.onerror = (event) => {
      console.error("Error saving students:", event.target.error);
    };
  }

  // ------------------------------
  // Render Students
  // ------------------------------
  function initRender() {
    container.innerHTML = "";
    currentIndex = 0;
    isoInstance = new Isotope(container, {
      itemSelector: ".portfolio-item",
      layoutMode: "fitRows"
    });
    renderNextBatch();
  }

  function renderNextBatch() {
    if (currentIndex >= studentsCache.length) return;

    const batch = studentsCache.slice(currentIndex, currentIndex + PAGE_SIZE);
    currentIndex += PAGE_SIZE;

    const elements = batch.map(student => {
      const safeClass = (student.class || "unknown").replace(/\s+/g, "-").toLowerCase();
      const studentName = window.DataHandler?.capitalize(student.student) ?? student.student;

      const el = document.createElement("div");
      el.className = `col-lg-4 col-md-6 portfolio-item filter-${safeClass}`;
      el.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="images/${student.imgstudent}" class="img-fluid" alt="">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class}, Roll No: ${student.rollno}</p>
            <a href="images/${student.imgstudent}" title="${studentName}" data-gallery="portfolio-gallery-student" class="glightbox preview-link">
              <i class="bi bi-zoom-in"></i>
            </a>
          </div>
        </div>
      `;
      return el;
    });

    container.append(...elements);
    isoInstance.appended(elements);
    isoInstance.layout();

    // Re-init GLightbox after adding new elements
    GLightbox({ selector: ".glightbox" });
  }

  // ------------------------------
  // Infinite Scroll (Lazy Loading)
  // ------------------------------
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      renderNextBatch();
    }
  }, { threshold: 0.1 });

  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  container.after(sentinel);
  observer.observe(sentinel);
});

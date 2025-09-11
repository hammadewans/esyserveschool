document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("portfolio-container");
  if (!container) {
    console.error("❌ #portfolio-container not found");
    return;
  }

  const DB_NAME = "EsyServeStudentDB";
  const DB_VERSION = 1;
  const STORE_NAME = "students";

  const PAGE_SIZE = 18;
  let db;
  let studentsCache = [];
  let currentIndex = 0;
  let isoInstance;

  console.log("Initializing IndexedDB...");

  // ------------------------------
  // IndexedDB Helpers
  // ------------------------------
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
          console.log(`✅ Object store created: ${STORE_NAME}`);
        }
      };

      request.onsuccess = e => {
        db = e.target.result;
        console.log(`✅ IndexedDB opened: ${DB_NAME}`);
        resolve(db);
      };

      request.onerror = e => {
        console.error("❌ IndexedDB error:", e.target.errorCode);
        reject(e.target.error);
      };
    });
  }

  function saveStudents(students) {
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    students.forEach(s => store.put(s));
    tx.oncomplete = () => console.log("✅ Students saved to IndexedDB");
    tx.onerror = e => console.error("❌ Save error:", e.target.error);
  }

  // ------------------------------
  // Fetch Students
  // ------------------------------
  async function fetchStudents() {
    try {
      console.log("🌐 Fetching students from server...");
      const res = await fetch("https://esyserve.top/fetch/student", {
        method: "GET",
        credentials: "include"
      });
      if (!res.ok) throw new Error(`Network error: ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn("⚠️ Expected array, got:", data);
        return [];
      }

      console.log(`✅ Fetched ${data.length} students`);
      return data;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      return [];
    }
  }

  // ------------------------------
  // Rendering
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
      const safeClass = (student.class || "unknown")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const studentName =
        window.DataHandler?.capitalize(student.student) ?? student.student;

      const el = document.createElement("div");
      el.className = `col-lg-4 col-md-6 portfolio-item filter-${safeClass}`;
      el.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="images/${student.imgstudent}" class="img-fluid" alt="">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class}, Roll No: ${student.rollno}</p>
            <a href="images/${student.imgstudent}" title="${studentName}" 
               data-gallery="portfolio-gallery-student" 
               class="glightbox preview-link">
              <i class="bi bi-zoom-in"></i>
            </a>
          </div>
        </div>`;
      return el;
    });

    container.append(...elements);
    isoInstance.appended(elements);
    isoInstance.layout();

    // Refresh GLightbox
    if (window._glightboxInstance) window._glightboxInstance.destroy();
    window._glightboxInstance = GLightbox({ selector: ".glightbox" });
  }

  // ------------------------------
  // Infinite Scroll
  // ------------------------------
  function setupInfiniteScroll() {
    const sentinel = document.createElement("div");
    sentinel.className = "sentinel";
    container.after(sentinel);

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) renderNextBatch();
    }, { threshold: 0.1 });

    observer.observe(sentinel);
  }

  // ------------------------------
  // Init
  // ------------------------------
  (async function init() {
    await openDB();
    studentsCache = await fetchStudents();
    if (studentsCache.length) {
      saveStudents(studentsCache);
      initRender();
      setupInfiniteScroll();
    }
  })();
});

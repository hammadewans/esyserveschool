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

  function getAllStudentsFromDB() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`📦 Loaded ${request.result.length} students from IndexedDB`);
        resolve(request.result);
      };

      request.onerror = e => {
        console.error("❌ Read error:", e.target.error);
        reject(e.target.error);
      };
    });
  }

  // ------------------------------
  // Fetch Students from Server
  // ------------------------------
  async function fetchStudentsFromServer() {
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

      const imgSrc = student.imgstudent
        ? `images/${student.imgstudent}`
        : "images/default-avatar.png"; // Fallback image

      const el = document.createElement("div");
      el.className = `col-lg-4 col-md-6 portfolio-item filter-${safeClass}`;
      el.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${imgSrc}" class="img-fluid student-img" alt="${studentName}">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class ?? "N/A"}, Roll No: ${student.rollno ?? "N/A"}</p>
            ${
              student.imgstudent
                ? `<a href="${imgSrc}" title="${studentName}" 
                    data-gallery="portfolio-gallery-student" 
                    class="glightbox preview-link">
                  <i class="bi bi-zoom-in"></i>
                </a>`
                : `<span class="text-muted">No image available</span>`
            }
          </div>
        </div>`;

      // Add error fallback to image
      el.querySelector("img").addEventListener("error", () => {
        el.querySelector("img").src = "images/default-avatar.png";
      });

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

    studentsCache = await getAllStudentsFromDB();

    if (studentsCache.length === 0) {
      // No local data, fetch from server
      const freshStudents = await fetchStudentsFromServer();
      if (freshStudents.length) {
        studentsCache = freshStudents;
        saveStudents(freshStudents);
      }
    }

    if (studentsCache.length) {
      initRender();
      setupInfiniteScroll();
    } else {
      container.innerHTML = `<p class="text-danger">⚠️ No student data available.</p>`;
    }
  })();
});

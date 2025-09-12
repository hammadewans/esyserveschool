// script/student.js
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  if (!container) {
    console.error("❌ #portfolio-container not found");
    return;
  }

  const DB_NAME = "EsyServeStudentDB";
  const DB_VERSION = 1;
  const STORE_NAME = "students";
  let db;
  let studentsCache = [];
  let isoInstance = null;
  let filterListenersAdded = false;

  // safe capitalize (uses DataHandler if present)
  function capitalizeSafe(str) {
    try {
      if (window.DataHandler && typeof window.DataHandler.capitalize === "function") {
        return window.DataHandler.capitalize(str ?? "Unknown");
      }
    } catch (e) { /* ignore */ }
    return String(str ?? "Unknown").replace(/\b\w/g, c => c.toUpperCase());
  }

  // sanitize token for CSS class use, and prefix if it starts with digit
  function sanitizeToken(val) {
    let s = String(val ?? "").toLowerCase().trim();
    s = s.replace(/\s+/g, "-");
    s = s.replace(/[^a-z0-9\-]/g, ""); // allow letters, numbers, hyphen
    if (!s) s = "unknown";
    if (/^[0-9]/.test(s)) s = "n" + s; // prefix to avoid class-start-digit issues
    return s;
  }

  // open indexedDB
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
        }
      };
      req.onsuccess = e => {
        db = e.target.result;
        resolve(db);
      };
      req.onerror = e => reject(e.target.error);
    });
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

  // fetch from backend
  async function fetchFromBackend() {
    console.log("Fetching students from backend server...");
    try {
      const res = await fetch('https://esyserve.top/fetch/student', { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn("No data returned from server.");
        studentsCache = [];
        renderAll();
        return;
      }
      studentsCache = data;
      try { await saveToIndexedDB(data); console.log("Students saved to IndexedDB."); } catch (err) { console.warn("Save to IndexedDB failed:", err); }
      renderAll();
    } catch (err) {
      console.error("Fetch error:", err);
      // still render whatever we have (maybe empty)
      renderAll();
    }
  }

  // render students into DOM
  function renderAll() {
    container.innerHTML = "";

    if (!studentsCache || studentsCache.length === 0) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-info">No students found.</div></div>`;
      // if isotope exists, reload items
      if (isoInstance) {
        isoInstance.reloadItems();
        isoInstance.layout();
      }
      return;
    }

    studentsCache.forEach(student => {
      const studentName = capitalizeSafe(student.student ?? "Unknown");
      const studentClassRaw = student.class ?? "unknown";
      const studentSectionRaw = student.sectionclass ?? "";
      const studentClass = sanitizeToken(studentClassRaw);
      const studentSection = sanitizeToken(studentSectionRaw);
      const filterClass = studentSection ? `${studentClass}-${studentSection}` : studentClass;

      const imgSrc = (student.imgstudent && student.imgstudent.trim()) ? student.imgstudent : "img/test.jpg";

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${studentClass} ${filterClass}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="${imgSrc}" class="img-fluid" alt="${studentName}" onerror="this.src='img/test.jpg'">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class ?? "Unknown"} - Section ${student.sectionclass ?? "A"}</p>
            <div>
              <a href="${imgSrc}" title="${studentName}" data-gallery="portfolio-gallery-${filterClass}" class="glightbox preview-link">
                <i class="bi bi-zoom-in"></i>
              </a>
              <a href="student-details.html?studentid=${student.studentid}" title="More Details" class="details-link">
                <i class="bi bi-link-45deg"></i>
              </a>
            </div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

    const isoParent = container.closest('.isotope-layout');
    if (isoParent) {
      // create Isotope once
      if (!isoInstance) {
        isoInstance = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: isoParent.getAttribute('data-layout') || 'masonry',
          filter: isoParent.getAttribute('data-default-filter') || '*',
          sortBy: isoParent.getAttribute('data-sort') || 'original-order'
        });
      } else {
        // reload items and relayout if already created
        isoInstance.reloadItems();
        isoInstance.arrange(); // use existing filter
      }

      // ensure images are loaded before layout
      imagesLoaded(container, () => isoInstance.layout());

      // add filter listeners once
      if (!filterListenersAdded) {
        isoParent.querySelectorAll('.isotope-filters li').forEach(btn => {
          btn.addEventListener('click', function () {
            isoParent.querySelector('.filter-active')?.classList.remove('filter-active');
            this.classList.add('filter-active');
            const fv = this.getAttribute('data-filter') || '*';
            console.log("Filtering with:", fv);
            isoInstance.arrange({ filter: fv });
          });
        });
        filterListenersAdded = true;
      }
    }

    // init glightbox (safe)
    try {
      if (typeof GLightbox === "function") GLightbox({ selector: '.glightbox' });
    } catch (e) { console.warn("GLightbox init failed:", e); }

    console.log("All students rendered.");
  }

  // sync button
  const syncBtn = document.getElementById("sync-students");
  if (syncBtn) {
    syncBtn.addEventListener("click", () => {
      if (!confirm("⚠️ This may take some time. Sync after many changes for best performance.")) return;
      const delRequest = indexedDB.deleteDatabase(DB_NAME);
      delRequest.onsuccess = () => {
        alert("✅ Student data synced.");
        window.location.reload();
      };
      delRequest.onerror = () => alert("❌ Could not sync student data");
      delRequest.onblocked = () => alert("⚠️ Sync blocked. Close other tabs.");
    });
  }

  // boot sequence
  (async function boot() {
    try {
      await openDB();
      const cached = await loadFromIndexedDB();
      if (cached && cached.length > 0) {
        console.log(`Loaded ${cached.length} students from IndexedDB.`);
        studentsCache = cached;
        renderAll();
        // also try refresh in background but don't block UI
        fetchFromBackend();
      } else {
        console.log("No students in IndexedDB, fetching from server...");
        await fetchFromBackend();
      }
    } catch (err) {
      console.error("IndexedDB open/load error:", err);
      // fallback to fetch
      await fetchFromBackend();
    }
  })();
});

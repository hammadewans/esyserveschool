// script/student.js
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");
  if (!container) {
    console.error("❌ #portfolio-container not found");
    return;
  }

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

  function sanitizeToken(val) {
    let s = String(val ?? "").toLowerCase().trim();
    s = s.replace(/\s+/g, "-");
    s = s.replace(/[^a-z0-9\-]/g, "");
    if (!s) s = "unknown";
    if (/^[0-9]/.test(s)) s = "n" + s;
    return s;
  }

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
      renderAll();
    } catch (err) {
      console.error("Fetch error:", err);
      renderAll();
    }
  }

  function renderAll() {
    container.innerHTML = "";

    if (!studentsCache || studentsCache.length === 0) {
      container.innerHTML = `<div class="col-12"><div class="alert alert-info">No students found.</div></div>`;
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

      const imgSrc = student.imgstudent ? student.imgstudent : "";

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${studentClass} ${filterClass}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="img/${imgSrc}" class="img-fluid" alt="${studentName}">
          <div class="portfolio-info">
            <h4>${studentName}</h4>
            <p>Class: ${student.class ?? "Unknown"} - Section ${student.sectionclass ?? "A"}</p>
            <div>
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
      if (!isoInstance) {
        isoInstance = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: isoParent.getAttribute('data-layout') || 'masonry',
          filter: isoParent.getAttribute('data-default-filter') || '*',
          sortBy: isoParent.getAttribute('data-sort') || 'original-order'
        });
      } else {
        isoInstance.reloadItems();
        isoInstance.arrange();
      }
      imagesLoaded(container, () => isoInstance.layout());
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

    try {
      if (typeof GLightbox === "function") GLightbox({ selector: '.glightbox' });
    } catch (e) { console.warn("GLightbox init failed:", e); }

    console.log("All students rendered.");
  }

  (async function boot() {
    await fetchFromBackend();
  })();
});

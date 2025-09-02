document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");

  // 🔹 Assume you already have current user ID or email from login/session
  // Replace this with your actual user identifier
  const currentUserId = localStorage.getItem("currentUserId");  

  // Storage key for this user
  const storageKey = `students_${currentUserId}`;

  // Check if cached data exists
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    const data = JSON.parse(cached);
    renderStudents(data);
  } else {
    // Fetch from backend if not cached
    fetch('https://esyserve.top/fetch/student', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
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
      if (!data) return; // Already redirected, no need to proceed

      // Save to user-specific storage
      localStorage.setItem(storageKey, JSON.stringify(data));

      renderStudents(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  }

  // 🔹 Same rendering logic
  function renderStudents(data) {
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
    GLightbox({
      selector: '.glightbox'
    });
  }

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
        isoInstance.arrange({
          filter: this.getAttribute('data-filter')
        });
      });
    });
  }
});

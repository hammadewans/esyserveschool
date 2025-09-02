document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");

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
  .then(users => {
    if (!users) return; // No data or redirected

    users.forEach(user => {
      // Create a heading for each user
      const userHeader = document.createElement("h3");
      userHeader.textContent = `User: ${window.DataHandler.capitalize(user.username)}`;
      container.appendChild(userHeader);

      // A row to hold this user’s students
      const row = document.createElement("div");
      row.className = "row g-4";
      container.appendChild(row);

      // Render each student
      user.students.forEach(student => {
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
        row.appendChild(div);
      });
    });

    initIsotopeLayout();
    GLightbox({ selector: '.glightbox' });
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

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

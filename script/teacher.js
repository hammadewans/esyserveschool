document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");

  fetch('http://localhost/fetch/teacher', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(async response => {
    if (response.status === 204) {
      console.warn('No teacher data added yet');
      return null;
    }
    if (response.status === 401) {
      window.location.href = "login.html";
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData);
    }

    return response.json();
  })
  .then(data => {
    if (!data) return;

   data.forEach(teacher => {
    const teacherName = window.DataHandler.capitalize(teacher.teacher);
    const teacherRole = window.DataHandler.capitalize(teacher.role);

    const div = document.createElement("div");
    div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${teacherRole.toLowerCase()}`;
    div.innerHTML = `
      <div class="portfolio-content h-100">
        <img src="${teacher.imgteacher}" class="img-fluid" alt="${teacherName}">
        <div class="portfolio-info">
          <h4>${teacherName}</h4>
          <p>Role: ${teacherRole}</p>
          <div>
            <a href="${teacher.imgteacher}" title="${teacherName}" data-gallery="portfolio-gallery-${teacherRole}" class="glightbox preview-link">
              <i class="bi bi-zoom-in"></i>
            </a>
            <a href="teacher-details.html?teacherid=${teacher.teacherid}" title="More Details" class="details-link">
              <i class="bi bi-link-45deg"></i>
            </a>
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

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("portfolio-container");

  fetch('https://esyserve.top/fetch/teacher', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.status === 204) {
      console.warn('Teacher data not added yet');
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
    if (!data) return;

    data.forEach(teacher => {
      const teacherName = window.DataHandler.capitalize(teacher.teacher);
      const teacherRole = window.DataHandler.capitalize(teacher.role);

      const div = document.createElement("div");
      div.className = `col-lg-4 col-md-6 portfolio-item isotope-item filter-${teacher.role}`;
      div.innerHTML = `
        <div class="portfolio-content h-100">
          <img src="img/${teacher.imgteacher}" 
               class="img-fluid" 
               alt="${teacherName}"
               onerror="this.src='img/no.jpg'">
          <div class="portfolio-info">
            <h4>${teacherName}</h4>
            <p>Role: ${teacherRole}</p>
            <div>
              <a href="teacher-details.html?teacherid=${teacher.teacherid}"
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

    initIsotopeLayout();
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

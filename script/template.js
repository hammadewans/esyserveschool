document.addEventListener('DOMContentLoaded', () => {
  fetchTemplates();

  // Filter dropdown change handler
  document.getElementById('filterType').addEventListener('change', fetchTemplates);
});

async function fetchTemplates() {
  const filter = document.getElementById('filterType').value;

  try {
    const response = await fetch('https://esyserve.top/fetch/template', {
      credentials: 'include',
      method: 'GET',    
    });
    const templates = await response.json(); // Assuming: [{type: 'school', html: '<div>...</div>'}, ...]
    console.log(templates);
    if (!response.ok) {
      throw new Error(templates);
    }
    const container = document.getElementById('template-list');
    container.innerHTML = ''; // Clear existing

templates
  .filter(t => filter === 'all' || t.type === filter)
  .forEach(t => {
    const wrapper = document.createElement('div');
    wrapper.className = 'col-md-6 template-card';
    wrapper.dataset.type = t.type;

    // Wrap the template HTML and append the delete button
    wrapper.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="template-preview mb-3" style="border: 1px solid #ccc; padding: 10px; border-radius: 8px;">
            ${t.html}
          </div>
          <div class="mt-auto text-end">
            <span class="badge bg-secondary">${t.type}</span>
            <span class="badge bg-info">#${t.templateid}</span>
            <button class="btn btn-sm btn-outline-danger" deleteTemplate="${t.templateid}">Delete</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(wrapper);
  });

  } catch (error) {
    console.log(error);
  }
}
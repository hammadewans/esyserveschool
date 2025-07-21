window.ButtonController = {
  disable: function (button) {
    if (!button) return;

    // Store original text if not already stored
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.innerHTML.trim();
    }

    // Disable the button
    button.disabled = true;

    // Replace button content with Bootstrap spinner
    button.innerHTML = `
      <div class="spinner-border spinner-border-sm text-light" role="status" style="width: 1.5rem; height: 1.5rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
  },

  enable: function (button) {
    if (!button) return;

    // Enable the button
    button.disabled = false;

    // Restore original text if stored
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
};

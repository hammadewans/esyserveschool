const form = document.getElementById('resetForm');
const resetButton = document.getElementById('resetButton');
const validator = new FormValidator(form);

resetButton.addEventListener('click', function () {
  window.ButtonController.disable(resetButton);
  const error = validator.validate();

  if (error) {
    window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
    window.ButtonController.enable(resetButton);
    return;
  }

  // Trim all form values before sending
  window.DataHandler.trimForm(form);

  const formData = new FormData(form);

  (async function () {
    try {
      const response = await fetch('http://localhost/user/reset', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.json();
        if (response.status < 500) {
          throw new Error(errorText || 'An error occurred while processing your request.');
        }
        throw new Error('Something went wrong. Please try again later.');
      }

      const data = await response.json();
      window.AlertHandler.show(data, 'success');
      form.reset(); // Reset the form after submission

    } catch (error) {
      window.AlertHandler.show(error.message, 'error');
    } finally {
      window.ButtonController.enable(resetButton);
    }
  })();

});

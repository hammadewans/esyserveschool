const form = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const validator = new FormValidator(form);

loginButton.addEventListener('click', function () {
	window.ButtonController.disable(loginButton);
  const error = validator.validate();
  if (error) {
    window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
    window.ButtonController.enable(loginButton);
    return;
  }

  // Trim all form values before sending
  window.DataHandler.trimForm(form);

  const formData = new FormData(form);

  (async function () {
    try {
      const response = await fetch('https://esyserve.top/auth/login', {
        method: 'POST',
        credentials: 'include',
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
          form.reset(); // Reset the form after submission
          window.location.href = '/index.html';
    } catch (error) {
      window.AlertHandler.show(error.message, 'error');
    } finally {
      window.ButtonController.enable(loginButton);
    }
  })();

});

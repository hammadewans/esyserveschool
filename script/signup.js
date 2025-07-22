const form = document.getElementById('signupForm');
const signupButton = document.getElementById('signupButton');
const validator = new FormValidator(form);

signupButton.addEventListener('click', function () {
	window.ButtonController.disable(signupButton);
  const error = validator.validate();

  if (error) {
    window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
    window.ButtonController.enable(signupButton);
    return;
  }

  // Trim all form values before sending
  window.DataHandler.trimForm(form);

  const formData = new FormData(form);

  (async function () {
    try {
      const response = await fetch('https://esyserve.top/user/signup', {
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
      window.ButtonController.enable(signupButton);
    }
  })();

});

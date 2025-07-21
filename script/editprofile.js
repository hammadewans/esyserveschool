const form = document.getElementById('editprofileForm');
const editprofileButton = document.getElementById('editprofileButton');
const validator = new FormValidator(form);

editprofileButton.addEventListener('click', function () {
    window.ButtonController.disable(editprofileButton);

    const error = validator.validate();
    if (error) {
        window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
        window.ButtonController.enable(editprofileButton);
        return;
    }

    // Trim all form values before sending
    window.DataHandler.trimForm(form);

    const formData = new FormData(form);

    (async function () {
        try {
            const response = await fetch('http://localhost/edit/profile', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const responseData = await response.json();

            if (response.status === 400) {
                // Client error — show API message
                throw new Error(responseData || 'Invalid input provided.');
            }

            if (!response.ok) {
                // Server error
                console.error('Server error:', response.status, responseData);
                throw new Error('Something went wrong. Please try again later.');
            }

            // Success
            window.AlertHandler.show(responseData, 'success');
            form.reset();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);


        } catch (error) {
            window.AlertHandler.show(error.message, 'error');
        } finally {
            window.ButtonController.enable(editprofileButton);
        }
    })();
});

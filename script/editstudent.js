const form = document.getElementById('editstudentForm');
const editprofileButton = document.getElementById('editstudentButton');
const validator = new FormValidator(form);


editprofileButton.addEventListener('click', function () {

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("studentid");

    if (!studentId) {
    console.error("No studentid provided in URL");
    return;
    }
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
            const response = await fetch(`https://esyserve.top/edit/student/${studentId}`, {
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
                window.location.href = `student-details.html?studentid=${studentId}`;
            }, 2000);


        } catch (error) {
            window.AlertHandler.show(error.message, 'error');
        } finally {
            window.ButtonController.enable(editprofileButton);
        }
    })();
});

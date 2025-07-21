document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("studentid");

    if (!studentId) {
        console.warn('No studentid found in URL');
        return;
    }

    // Set hrefs for edit and photo links
    document.getElementById("editlink").href = `edit-student.html?studentid=${encodeURIComponent(studentId)}`;
    document.getElementById("changephoto").href = `img-student.html?studentid=${encodeURIComponent(studentId)}`;

    const url = `http://localhost/search/student/${encodeURIComponent(studentId)}`;

    // Fetch student data
    fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async response => {
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        } else if (response.status === 204) {
            console.warn('No data found for this student ID');
            return;
        } else if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error ${response.status}: ${response.statusText} - ${errorText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            document.getElementById("student").textContent = window.DataHandler.capitalize(data.student);
            document.getElementById("father").textContent = window.DataHandler.capitalize(data.father);
            document.getElementById("mother").textContent = window.DataHandler.capitalize(data.mother);
            document.getElementById("class").textContent = window.DataHandler.capitalize(data.class);
            document.getElementById("sectionclass").textContent = window.DataHandler.capitalize(data.sectionclass);
            document.getElementById("rollno").textContent = data.rollno;
            document.getElementById("dob").textContent = data.dob;
            document.getElementById("address").textContent = window.DataHandler.capitalize(data.address);
            document.getElementById("contact").textContent = data.contact;
            document.getElementById("role").textContent = data.role;
            document.getElementById("imgstudent").src = data.imgstudent;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error.message);
    });

    // Delete button logic
    const button = document.getElementById("delbtn");
    if (!button) {
        console.error('Delete button not found!');
        return;
    }

    button.addEventListener('click', function () {
        if (!confirm("Are you sure you want to delete this student?")) {
            return;
        }

        window.ButtonController?.disable?.(button);

        (async function () {
            try {
                const response = await fetch(`http://localhost/student/delete/${encodeURIComponent(studentId)}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status < 500) {
                        throw new Error( result);
                    }
                    console.error(result);
                    throw new Error('Something went wrong. Please try again later.');
                }
                // Success
                window.AlertHandler.show(
                    result,
                    'success'
                );
                setTimeout(() => {
                    window.location.href = 'student.html';
                }, 2000);

            } catch (error) {
                window.AlertHandler.show(error, 'error');
            }
        })();
    });
});

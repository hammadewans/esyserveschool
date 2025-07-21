document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const teacherId = params.get("teacherid");

    if (!teacherId) {
        console.warn('No teacherid found in URL');
        return;
    }

    // Set hrefs for edit and photo links
    document.getElementById("editlink").href = `edit-teacher.html?teacherid=${encodeURIComponent(teacherId)}`;
    document.getElementById("changephoto").href = `img-teacher.html?teacherid=${encodeURIComponent(teacherId)}`;

    const url = `http://localhost/search/teacher/${encodeURIComponent(teacherId)}`;

    // Fetch teacher data
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
            console.warn('No data found for this teacher ID');
            return;
        } else if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error ${response.status}: ${response.statusText} - ${errorText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            document.getElementById("teacher").textContent = window.DataHandler.capitalize(data.teacher);
            document.getElementById("father").textContent = window.DataHandler.capitalize(data.father);
            document.getElementById("mother").textContent = window.DataHandler.capitalize(data.mother);
            document.getElementById("dob").textContent = data.dob;
            document.getElementById("address").textContent = window.DataHandler.capitalize(data.address);
            document.getElementById("contact").textContent = data.contact;
            document.getElementById("role").textContent = data.role;
            document.getElementById("imgteacher").src = data.imgteacher;
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
        if (!confirm("Are you sure you want to delete this teacher?")) {
            return;
        }

        window.ButtonController?.disable?.(button);

        (async function () {
            try {
                const response = await fetch(`http://localhost/teacher/delete/${encodeURIComponent(teacherId)}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status < 500) {
                        throw new Error(result);
                    }
                    console.error(result);
                    throw new Error('Something went wrong. Please try again later.');
                }

                window.AlertHandler.show(
                    result,
                    'success'
                );
                setTimeout(() => {
                    window.location.href = 'teacher.html';
                }, 2000);

            } catch (error) {
                window.AlertHandler.show(error, 'error');
            }
        })();
    });
});

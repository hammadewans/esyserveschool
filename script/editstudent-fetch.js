// 1. Fetch and load user profile by studentid
(function () {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentid");

  if (!studentId) {
    console.error("No studentid provided in URL");
    return;
  }

  fetch(`https://esyserve.top/search/student/${encodeURIComponent(studentId)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      if (response.status === 401) {
        window.location.href = '/login.html';
        return;
      }

      if (response.status === 204) {
        throw new Error('Invalid Student Id');
      }

      if (!response.ok) {
        throw new Error('Unexpected status: ' + response.status);
      }

      return response.json();
    })
    .then(function (data) {
      if (!data) return;

      // Set globally and notify listeners
      window.userProfile = data;
      document.dispatchEvent(new CustomEvent('profileDataReady'));
    })
    .catch(function (error) {
      console.error(error);
    });
})();

// 2. Fill allowed input fields only
document.addEventListener('profileDataReady', function () {
  const data = window.userProfile;
  if (!data) return;

  const allowedInputIds = [
    'student', 'father', 'mother', 'class', 'sectionclass',
    'rollno', 'dob', 'address', 'contact', 'role'
  ];

  Object.entries(data).forEach(function ([key, value]) {
    if (!allowedInputIds.includes(key)) return;

    const el = document.getElementById(key);
    if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;

    el.value = value;
  });
});




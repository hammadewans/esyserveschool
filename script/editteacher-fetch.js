// 1️⃣ Fetch and load teacher profile by teacherid
(function () {
  const params = new URLSearchParams(window.location.search);
  const teacherId = params.get("teacherid");

  if (!teacherId) {
    console.error("No teacherid provided in URL");
    return;
  }

  fetch(`https://esyserve.top/search/teacher/${encodeURIComponent(teacherId)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(async function (response) {
    if (response.status === 401) {
      window.location.href = '/login.html';
      return;
    }

    if (response.status === 204) {
      throw new Error('Invalid Teacher Id');
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Unexpected status: ${response.status} ${errText}`);
    }

    return response.json();
  })
  .then(function (data) {
    if (!data) return;

    // Set globally and notify listeners
    window.teacherProfile = data;
    document.dispatchEvent(new CustomEvent('profileDataReady'));
  })
  .catch(function (error) {
    console.error('Fetch error:', error.message || error);
  });
})();

// 2️⃣ Fill allowed input fields only
document.addEventListener('profileDataReady', function () {
  const data = window.teacherProfile;
  if (!data) return;

  const allowedInputIds = [
    'teacher', 'father', 'mother', 'dob', 'address', 'contact', 'role'
  ];

  allowedInputIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;

    const value = data[id];
    if (value !== undefined) {
      el.value = value;
    }
  });
});

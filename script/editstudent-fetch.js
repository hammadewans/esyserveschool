// 1️⃣ Fetch and load student profile by studentid
(function () {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentid");

  if (!studentId) {
    console.error("❌ No studentid provided in URL");
    return;
  }

  fetch(`https://esyserve.top/search/student/${encodeURIComponent(studentId)}`, {
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
        throw new Error('Invalid Student Id');
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
      window.studentProfile = data;
      document.dispatchEvent(new CustomEvent('studentProfileReady'));
    })
    .catch(function (error) {
      console.error('❌ Fetch error:', error.message || error);
    });
})(); // 👈 IIFE closed properly

// 2️⃣ Fill allowed input fields only
document.addEventListener('studentProfileReady', function () {
  const data = window.studentProfile;
  if (!data) return;

  const allowedInputIds = [
    'student',
    'father',
    'mother',
    'dob',
    'address',
    'contact',
    'class',
    'sectionclass',
    'rollno'
  ];

  allowedInputIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return; // skip if field not found

    const value = data[id];
    if (value !== undefined) {
      el.value = value;
    }
  });
});

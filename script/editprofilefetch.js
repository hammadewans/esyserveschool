// 1. Fetch and load user profile
(function () {
  fetch('http://localhost/user/profile', {
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
        window.location.href = '/createprofile.html';
        return;
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
      console.error('Error fetching profile data:', error);
    });
})();

// 2. Fill allowed input fields only
document.addEventListener('profileDataReady', function () {
  const data = window.userProfile;
  if (!data) return;

  const allowedInputIds = [
    'udise', 'school', 'board', 'principal', 'contact',
    'location', 'area', 'city', 'district', 'state', 'pincode'
  ];

  Object.entries(data).forEach(function ([key, value]) {
    if (!allowedInputIds.includes(key)) return;

    const el = document.getElementById(key);
    if (!el || !['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;

    el.value = value;
  });
});

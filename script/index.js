(async function () {
  try {
    const response = await fetch('http://localhost/user/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

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

    const data = await response.json();

    if (!data) return;

    // ✅ Set global data
    window.userProfile = data;

    // ✅ Populate DOM elements directly
    Object.entries(data).forEach(function ([key, value]) {
      const el = document.getElementById(key);
      if (!el) return;

      if (typeof value === 'string' && value.startsWith('data:image')) {
        el.src = value;
      } else {
        if (typeof value === 'string') {
          value = DataHandler.capitalize(value);
        } else if (Array.isArray(value)) {
          value = value.map(item => DataHandler.capitalize(item)).join(', ');
        } else if (typeof value === 'object') {
          value = JSON.stringify(value, null, 2);
        }
        el.textContent = value;
      }
    });

    // Optionally: dispatch event if you have other listeners
    document.dispatchEvent(new CustomEvent('profileDataReady'));

  } catch (error) {
    console.error('Error fetching profile data:', error);
  }
})();

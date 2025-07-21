document.addEventListener('DOMContentLoaded', function () {
  const toggleButtons = document.querySelectorAll('[data-target]');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);

      if (input) {
        // Toggle password visibility
        input.type = input.type === 'password' ? 'text' : 'password';

        // Toggle the icon class
        const icon = this.querySelector('i');
        if (icon) {
          icon.classList.toggle('bi-eye');
          icon.classList.toggle('bi-eye-slash');
        }
      }
    });
  });
});

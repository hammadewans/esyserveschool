document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('teacherForm');
  const button = document.getElementById('teacherButton');
  const preview = document.getElementById('imgteacherPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgteacher"]');

  // === Set default preview image ===
  preview.src = 'assets/img/3x4.png'; // Optional: use 3:4 placeholder

  // === Image file input preview (3:4 crop) ===
  imgInput.addEventListener('change', function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 600; // 3:4 ratio (600x800)
        const targetHeight = 800;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sx, sy, sw, sh;
        if (srcAspect > targetAspect) {
          // source is wider than target
          sw = img.height * targetAspect;
          sh = img.height;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          // source is taller than target
          sw = img.width;
          sh = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        preview.src = canvas.toDataURL('image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // === Form submission ===
  button.addEventListener('click', function () {
    window.ButtonController.disable(button);

    const error = validator.validate();
    if (error) {
      window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
      window.ButtonController.enable(button);
      return;
    }

    window.DataHandler.trimForm(form);

    const formData = new FormData(form);

    (async function () {
      try {
        const response = await fetch('https://esyserve.top/add/teacher', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status < 500) {
            throw new Error(result || 'Invalid input provided.');
          }
          console.error(result);
          throw new Error('Something went wrong. Please try again later.');
        }

        // Success
        window.AlertHandler.show(result, 'success');
        form.reset();
        preview.src = 'assets/img/3x4.png'; // Reset preview
      } catch (error) {
        window.AlertHandler.show(error.message, 'error');
      } finally {
        window.ButtonController.enable(button);
      }
    })();
  });
});

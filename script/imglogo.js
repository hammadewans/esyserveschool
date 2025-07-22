document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('imglogoForm');
  const button = document.getElementById('imglogoButton');
  const preview = document.getElementById('imglogoPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imglogo"]');

  // === Set default preview image ===
  preview.src = 'assets/img/1x1.png';

  // === Image file input preview (1:1 crop) ===
  imgInput.addEventListener('change', function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetSize = 720; // Square crop
        canvas.width = targetSize;
        canvas.height = targetSize;

        const srcAspect = img.width / img.height;

        let sx, sy, sw, sh;
        if (srcAspect > 1) {
          // Image is wider than tall
          sh = img.height;
          sw = img.height;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          // Image is taller than wide or square
          sw = img.width;
          sh = img.width;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetSize, targetSize);
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
        const response = await fetch('https://esyserve.top/imglogo/upload', {
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
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
      } catch (error) {
        window.AlertHandler.show(error.message, 'error');
      } finally {
        window.ButtonController.enable(button);
      }
    })();
  });
});

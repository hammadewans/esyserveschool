document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('studentForm');
  const button = document.getElementById('studentButton');
  const preview = document.getElementById('imgstudentPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgstudent"]');

  preview.src = 'assets/img/3x4.png';

  let compressedBlob = null;

  // === Compress image until < 200 KB ===
  function compressToTarget(canvas, file, callback) {
    let quality = 0.9;

    function attempt() {
      canvas.toBlob(
        function (blob) {
          if (blob.size <= 200 * 1024 || quality < 0.3) {
            // success or too low quality
            compressedBlob = new File([blob], file.name, { type: 'image/jpeg' });
            callback(compressedBlob);
            return;
          }
          quality -= 0.1; // lower quality step
          canvas.toBlob(
            function (retryBlob) {
              blob = retryBlob;
              if (blob.size <= 200 * 1024 || quality < 0.3) {
                compressedBlob = new File([blob], file.name, { type: 'image/jpeg' });
                callback(compressedBlob);
              } else {
                attempt();
              }
            },
            'image/jpeg',
            quality
          );
        },
        'image/jpeg',
        quality
      );
    }

    attempt();
  }

  // === Image input preview & compression ===
  imgInput.addEventListener('change', function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 1200;
        const targetHeight = 1600;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sx, sy, sw, sh;
        if (srcAspect > targetAspect) {
          sw = img.height * targetAspect;
          sh = img.height;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

        // Update preview (initial high quality)
        preview.src = canvas.toDataURL('image/jpeg', 0.9);

        // Compress until <200 KB
        compressToTarget(canvas, file, function (blob) {
          console.log("✅ Final compressed size:", (blob.size / 1024).toFixed(1), "KB");
        });
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

    if (compressedBlob) {
      formData.set('imgstudent', compressedBlob);
    }

    (async function () {
      try {
        const response = await fetch('https://esyserve.top/add/student', {
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

        window.AlertHandler.show(result, 'success');
        form.reset();
        preview.src = 'assets/img/3x4.png';
        compressedBlob = null;

      } catch (error) {
        window.AlertHandler.show(error.message, 'error');
      } finally {
        window.ButtonController.enable(button);
      }
    })();
  });
});

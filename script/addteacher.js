document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('teacherForm');
  const button = document.getElementById('teacherButton');
  const preview = document.getElementById('imgteacherPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgteacher"]');

  preview.src = 'assets/img/3x4.png';

  let compressedBlob = null;

  // === Compress image until < 200 KB ===
  function compressToTarget(canvas, file) {
    return new Promise((resolve) => {
      let quality = 0.9;

      function attempt() {
        canvas.toBlob(
          function (blob) {
            if (blob.size <= 200 * 1024 || quality < 0.3) {
              compressedBlob = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(compressedBlob);
              return;
            }
            quality -= 0.1;
            attempt();
          },
          'image/jpeg',
          quality
        );
      }
      attempt();
    });
  }

  // === Image input preview & compression ===
  imgInput.addEventListener('change', async function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
      const img = new Image();
      img.onload = async function () {
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

        preview.src = canvas.toDataURL('image/jpeg', 0.9);

        compressedBlob = await compressToTarget(canvas, file);
        console.log("✅ Final compressed size:", (compressedBlob.size / 1024).toFixed(1), "KB");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // === Form submission ===
  button.addEventListener('click', async function () {
    window.ButtonController.disable(button);

    const error = validator.validate();
    if (error) {
      window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
      window.ButtonController.enable(button);
      return;
    }

    window.DataHandler.trimForm(form);

    const formData = new FormData(form);

    // Compress again if image selected but not yet processed
    if (imgInput.files[0] && !compressedBlob) {
      const file = imgInput.files[0];
      const img = new Image();
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onload = async function (e) {
          img.onload = async function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const targetWidth = 600;
            const targetHeight = 800;

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
            compressedBlob = await compressToTarget(canvas, file);
            resolve();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (compressedBlob) {
      formData.set('imgteacher', compressedBlob);
    }

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
  });
});

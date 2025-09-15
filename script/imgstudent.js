document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('imgstudentForm');
  const button = document.getElementById('imgstudentButton');
  const preview = document.getElementById('imgstudentPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgstudent"]');

  preview.src = 'assets/img/3x4.png';

  let compressedBlob = null;
  let lastFile = null;

  // === Compress image until <= 200 KB ===
  function compressToTarget(canvas, file, callback) {
    let quality = 0.9;

    function attempt() {
      canvas.toBlob(
        function (blob) {
          if (blob.size <= 200 * 1024 || quality < 0.3) {
            compressedBlob = new File([blob], file.name, { type: 'image/jpeg' });
            callback(compressedBlob);
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
  }

  // === Process and compress image ===
  function processImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 600;  // 3:4 ratio
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

        // Preview
        preview.src = canvas.toDataURL('image/jpeg', 0.9);

        // Compress
        compressToTarget(canvas, file, function (blob) {
          console.log("✅ Final compressed size:", (blob.size / 1024).toFixed(1), "KB");
          callback(blob);
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // === On image select ===
  imgInput.addEventListener('change', function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    lastFile = file;
    processImage(file, function (blob) {
      compressedBlob = blob;
    });
  });

  // === Form submission ===
  button.addEventListener('click', function () {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("studentid");

    if (!studentId) {
      console.error("No studentid provided in URL");
      return;
    }

    window.ButtonController.disable(button);

    const error = validator.validate();
    if (error) {
      window.AlertHandler.show(window.DataHandler.capitalize(error), 'error');
      window.ButtonController.enable(button);
      return;
    }

    window.DataHandler.trimForm(form);

    const formData = new FormData(form);

    // Ensure compression before upload
    if (lastFile) {
      processImage(lastFile, function (blob) {
        formData.set('imgstudent', blob);

        uploadForm(formData, studentId);
      });
    } else {
      uploadForm(formData, studentId); // no file
    }
  });

  // === Upload function ===
  async function uploadForm(formData, studentId) {
    try {
      const response = await fetch(`https://esyserve.top/imgstudent/upload/${studentId}`, {
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
      setTimeout(() => {
        window.location.href = `student-details.html?studentid=${studentId}`;
      }, 2000);
    } catch (error) {
      window.AlertHandler.show(error.message, 'error');
    } finally {
      window.ButtonController.enable(button);
    }
  }
});


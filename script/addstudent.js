document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('studentForm');
  const button = document.getElementById('studentButton');
  const preview = document.getElementById('imgstudentPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgstudent"]');

  // === IndexedDB Setup ===
  let db;
  const request = indexedDB.open("StudentDB", 1);

  request.onupgradeneeded = function (e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("students")) {
      db.createObjectStore("students", { keyPath: "studentid" });
    }
  };

  request.onsuccess = function (e) {
    db = e.target.result;
  };

  request.onerror = function (e) {
    console.error("IndexedDB error:", e);
  };

  function saveStudentToIndexedDB(student) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction("students", "readwrite");
      const store = tx.objectStore("students");
      const request = store.put(student);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e);
    });
  }

  // === Set default preview image ===
  preview.src = 'assets/img/3x4.png'; // Optional: placeholder

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

        // === Success ===
        window.AlertHandler.show(result, 'success');
        form.reset();
        preview.src = 'assets/img/3x4.png'; // Reset preview

        // === Add to IndexedDB ===
        // Assume backend returns `studentid` and other student fields
        const newStudent = {
          studentid: result.studentid, // backend must return this
          student: formData.get("student"),
          class: formData.get("class"),
          sectionclass: formData.get("sectionclass"),
          imgstudent: preview.src // saved cropped preview
        };

        await saveStudentToIndexedDB(newStudent);
        console.log("Student saved locally:", newStudent);

      } catch (error) {
        window.AlertHandler.show(error.message, 'error');
      } finally {
        window.ButtonController.enable(button);
      }
    })();
  });
});

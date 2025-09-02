document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('imgstudentForm');
  const button = document.getElementById('imgstudentButton');
  const preview = document.getElementById('imgstudentPreview');
  const validator = new FormValidator(form);
  const imgInput = form.querySelector('input[name="imgstudent"]');

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentid");

  if (!studentId) {
    console.error("No studentid provided in URL");
    return;
  }

  // =============================
  // IndexedDB Setup
  // =============================
  const DB_NAME = "EsyServeDB";
  const STORE_NAME = "studentImages";

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "studentId" });
        }
      };
      request.onsuccess = e => resolve(e.target.result);
      request.onerror = e => reject(e.target.error);
    });
  }

  async function saveToIndexedDB(studentId, base64Image) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({ studentId, base64Image });
      tx.oncomplete = () => resolve();
      tx.onerror = e => reject(e.target.error);
    });
  }

  async function loadFromIndexedDB(studentId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(studentId);
      request.onsuccess = () => resolve(request.result?.base64Image || null);
      request.onerror = e => reject(e.target.error);
    });
  }

  // =============================
  // Load Cached Image
  // =============================
  (async function () {
    try {
      const cachedImg = await loadFromIndexedDB(studentId);
      preview.src = cachedImg || "assets/img/3x4.png";
    } catch (err) {
      console.error("Failed to load cached image", err);
      preview.src = "assets/img/3x4.png";
    }
  })();

  // =============================
  // File Input + Crop Preview
  // =============================
  imgInput.addEventListener('change', function () {
    const file = imgInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      window.AlertHandler.show("Image too large. Max 2MB allowed.", "error");
      imgInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = async function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 600;
        const targetHeight = 800; // 3:4 ratio
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
        const base64 = canvas.toDataURL('image/png');
        preview.src = base64;

        // Save cropped preview in IndexedDB
        await saveToIndexedDB(studentId, base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // =============================
  // Form Submission
  // =============================
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
        const response = await fetch(`https://esyserve.top/imgstudent/upload/${studentId}`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        let result = "";
        try {
          result = await response.json();
        } catch (_) {
          result = await response.text();
        }

        if (!response.ok) {
          throw new Error(result || "Something went wrong. Please try again.");
        }

        // Success → keep cached image updated
        window.AlertHandler.show(result, 'success');
        await saveToIndexedDB(studentId, preview.src);

        form.reset();
        preview.src = "assets/img/3x4.png";

        setTimeout(() => {
          window.location.href = `student-details.html?studentid=${studentId}`;
        }, 2000);
      } catch (error) {
        window.AlertHandler.show(error.message, 'error');
      } finally {
        window.ButtonController.enable(button);
      }
    })();
  });
});

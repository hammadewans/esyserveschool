// === IndexedDB helper ===
const DB_NAME = "EsyServeDB";
const DB_VERSION = 1;
const STORE_NAME = "students";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "studentid" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getStudentFromDB(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveStudentToDB(student) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(student);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// === 1. Fetch and load user profile by studentid ===
(async function () {
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentid");

  if (!studentId) {
    console.error("No studentid provided in URL");
    return;
  }

  // First: load from IndexedDB for offline/fast preview
  try {
    const localData = await getStudentFromDB(studentId);
    if (localData) {
      window.userProfile = localData;
      document.dispatchEvent(new CustomEvent("profileDataReady", { detail: { source: "indexeddb" } }));
    }
  } catch (err) {
    console.warn("IndexedDB error:", err);
  }

  // Then: fetch fresh data from backend
  fetch(`https://esyserve.top/search/student/${encodeURIComponent(studentId)}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "/login.html";
        return;
      }
      if (response.status === 204) throw new Error("Invalid Student Id");
      if (!response.ok) throw new Error("Unexpected status: " + response.status);
      return response.json();
    })
    .then(async (data) => {
      if (!data) return;

      window.userProfile = data;
      document.dispatchEvent(new CustomEvent("profileDataReady", { detail: { source: "backend" } }));

      // Save latest to IndexedDB
      try {
        await saveStudentToDB(data);
      } catch (err) {
        console.error("Failed to save to IndexedDB:", err);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
})();

// === 2. Fill allowed input fields only ===
document.addEventListener("profileDataReady", function () {
  const data = window.userProfile;
  if (!data) return;

  const allowedInputIds = [
    "student", "father", "mother", "class", "sectionclass",
    "rollno", "dob", "address", "contact", "role"
  ];

  Object.entries(data).forEach(function ([key, value]) {
    if (!allowedInputIds.includes(key)) return;

    const el = document.getElementById(key);
    if (!el || !["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;

    el.value = value;
  });
});

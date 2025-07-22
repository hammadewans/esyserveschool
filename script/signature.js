document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("signatureWrapper");
  const canvas = document.getElementById("signatureCanvas");
  let signaturePad;

  function calculate16x9Fit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 100; // reserve space for buttons

    let width = vw;
    let height = vw * 9 / 16;

    if (height > vh) {
      height = vh;
      width = vh * 16 / 9;
    }

    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    if (signaturePad) signaturePad.clear();
  }

  function initPad() {
    signaturePad = new SignaturePad(canvas, {
      backgroundColor: "rgba(255,255,255,0)",
      penColor: "black"
    });
  }

  calculate16x9Fit();
  initPad();

  window.addEventListener("resize", calculate16x9Fit);

  document.getElementById("resetBtn").addEventListener("click", () => {
    signaturePad.clear();
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    if (signaturePad.isEmpty()) {
      alert("Please draw a signature first.");
      return;
    }

    const link = document.createElement("a");
    link.href = signaturePad.toDataURL("image/png");
    link.download = "signature.png";
    link.click();
    signaturePad.clear();
  });

  canvas.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
});

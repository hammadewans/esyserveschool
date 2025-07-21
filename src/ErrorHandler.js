window.AlertHandler = {
  show: function (message, type = 'error') {
    // Remove existing alert if any
    const existing = document.getElementById('alert-popup');
    if (existing) existing.remove();

    // Add styles for animation only once
    if (!document.getElementById('alert-handler-style')) {
      const style = document.createElement('style');
      style.id = 'alert-handler-style';
      style.textContent = `
        @keyframes slideDownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUpFadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Style and icon based on type
    const isError = type === 'error';
    const icon = isError 
      ? '<i class="bi bi-x-circle fs-4 text-danger me-2"></i>' 
      : '<i class="bi bi-check-circle fs-4 text-success me-2"></i>';
    const textColor = isError ? 'red' : 'green';
    const borderColor = isError ? 'red' : 'green';
    const bgColor = isError ? 'rgba(255, 255, 255, 0.75)' : 'rgba(240, 255, 240, 0.8)';

    const alert = document.createElement('div');
    alert.id = 'alert-popup';
    alert.className = `d-flex align-items-center px-4 py-3 shadow-sm`;
    alert.style.cssText = `
      position: fixed;
      top: 15px;
      left: 15px;
      right: 15px;
      backdrop-filter: blur(2px);
      background-color: ${bgColor};
      color: ${textColor};
      border: 2px solid ${borderColor};
      border-radius: 8px;
      z-index: 9999;
      animation: slideDownFadeIn 0.4s ease-out forwards;
    `;

    const iconDiv = document.createElement('div');
    iconDiv.innerHTML = icon;

    const messageSpan = document.createElement('div');
    messageSpan.className = 'fw-semibold small';
    messageSpan.textContent = message;

    alert.appendChild(iconDiv);
    alert.appendChild(messageSpan);

    const main = document.querySelector('.main') || document.body;
    main.appendChild(alert);

    setTimeout(() => {
      alert.style.animation = 'slideUpFadeOut 0.4s ease-in forwards';
      alert.addEventListener('animationend', () => {
        alert.remove();
      }, { once: true });
    }, 3000);
  }
};

export default class Toast {
    static container = document.getElementById('toast-container');

    static types = {
        success: { color: '#28a745', icon: 'bi-check-circle-fill' },
        danger:  { color: '#dc3545', icon: 'bi-x-circle-fill' },
        warning: { color: '#fd7e14', icon: 'bi-exclamation-triangle-fill' },
        info:    { color: '#0d6efd', icon: 'bi-info-circle-fill' }
    };

    static show(message, type = 'info', duration = 4000) {
        if (!this.container) return;

        const config = this.types[type] || this.types.info;

        // Toast wrapper
        const toastEl = document.createElement('div');
        toastEl.classList.add('toast', 'align-items-center', 'bg-white', 'shadow', 'fade', 'show');
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        // Inline styles
        toastEl.style.border = `2px solid ${config.color}`;
        toastEl.style.borderRadius = '0.75rem';
        toastEl.style.minWidth = '280px';
        toastEl.style.maxWidth = '100%';
        toastEl.style.display = 'flex';
        toastEl.style.alignItems = 'center';
        toastEl.style.padding = '0.5rem 0.75rem';
        toastEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        toastEl.style.transform = 'translateX(120%)'; // start offscreen
        toastEl.style.opacity = '0';

        // Icon
        const icon = document.createElement('i');
        icon.classList.add('bi', config.icon);
        icon.style.color = config.color;
        icon.style.fontSize = '1.3rem';
        icon.style.marginRight = '0.6rem';

        // Message
        const bodyDiv = document.createElement('div');
        bodyDiv.textContent = message;
        bodyDiv.style.color = '#000';
        bodyDiv.style.fontWeight = '500';
        bodyDiv.style.fontSize = '1rem';
        bodyDiv.style.flex = '1';

        // Close button using bootstrap icon
        const btnClose = document.createElement('i');
        btnClose.classList.add('bi', 'bi-x-lg');
        btnClose.style.color = config.color;
        btnClose.style.cursor = 'pointer';
        btnClose.style.fontSize = '1.1rem';
        btnClose.style.marginLeft = '0.5rem';
        btnClose.addEventListener('click', () => this.hideToast(toastEl));

        // Append
        toastEl.appendChild(icon);
        toastEl.appendChild(bodyDiv);
        toastEl.appendChild(btnClose);
        this.container.appendChild(toastEl);

        // Animate in (Bootstrap fade + transform)
        requestAnimationFrame(() => {
            toastEl.style.transform = 'translateX(0)';
            toastEl.style.opacity = '1';
        });

        // Auto-hide after duration
        const bsToast = new bootstrap.Toast(toastEl, { delay: duration });
        bsToast.show();

        // Out animation before removal
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.style.transform = 'translateX(120%)';
            toastEl.style.opacity = '0';
            toastEl.addEventListener('transitionend', () => toastEl.remove(), { once: true });
        });
    }

    static hideToast(toastEl) {
        const bsToast = bootstrap.Toast.getInstance(toastEl);
        if (bsToast) bsToast.hide();
    }

    // Shortcut methods
    static success(msg, duration = 4000) { this.show(msg, 'success', duration); }
    static error(msg, duration = 4000) { this.show(msg, 'danger', duration); }
    static warning(msg, duration = 4000) { this.show(msg, 'warning', duration); }
    static info(msg, duration = 4000) { this.show(msg, 'info', duration); }
}

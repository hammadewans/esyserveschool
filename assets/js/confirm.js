// Confirm.js
export default class Confirm {
    static init() {
        if (document.getElementById('customConfirm')) return;

        // ===== MODAL ROOT =====
        const modal = document.createElement('div');
        modal.id = 'customConfirm';
        modal.className = 'modal fade show';
        modal.style.display = 'none';
        modal.tabIndex = -1;

        // ===== DIALOG =====
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog modal-dialog-centered modal-sm';

        // ===== CONTENT =====
        const content = document.createElement('div');
        content.className = 'modal-content shadow-sm';
        content.style.borderRadius = '0';
        content.style.border = 'none';

        // ===== BODY =====
        const body = document.createElement('div');
        body.className = 'modal-body px-3 pt-3 pb-2 text-start';

        // ---- ICON (TOP CENTER) ----
        const iconWrap = document.createElement('div');
        iconWrap.className = 'text-center mb-2';

        const icon = document.createElement('i');
        icon.className = 'bi bi-exclamation-triangle-fill text-warning';
        icon.style.fontSize = '32px';

        iconWrap.appendChild(icon);

        // ---- TITLE ----
        const title = document.createElement('div');
        title.className = 'fw-semibold small mb-1';
        title.textContent = 'Confirmation Required';

        // ---- MAIN MESSAGE ----
        const message = document.createElement('div');
        message.id = 'confirmMessage';
        message.className = 'small text-dark';
        message.textContent = 'Are you sure you want to continue?';

        body.appendChild(iconWrap);
        body.appendChild(title);
        body.appendChild(message);

        // ===== FOOTER =====
        const footer = document.createElement('div');
        footer.className = 'modal-footer px-3 py-2 border-0';

        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'confirmCancel';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-sm btn-light';
        cancelBtn.innerHTML = `<i class="bi bi-x me-1"></i>Cancel`;

        const okBtn = document.createElement('button');
        okBtn.id = 'confirmOk';
        okBtn.type = 'button';
        okBtn.className = 'btn btn-sm btn-danger text-light';
        okBtn.innerHTML = `<i class="bi bi-check me-1"></i>Proceed`;

        footer.appendChild(cancelBtn);
        footer.appendChild(okBtn);

        // ===== BUILD =====
        content.appendChild(body);
        content.appendChild(footer);
        dialog.appendChild(content);
        modal.appendChild(dialog);
        document.body.appendChild(modal);

        // ===== STORE =====
        this.modal = modal;
        this.okBtn = okBtn;
        this.cancelBtn = cancelBtn;
        this.msgEl = message;
    }

    /**
     * Show confirm dialog
     * @param {string} message
     * @returns {Promise<boolean>}
     */
    static show(message) {
        this.init();

        return new Promise(resolve => {
            this.msgEl.textContent = message;

            this.modal.style.display = 'block';
            this.modal.classList.add('show');
            document.body.classList.add('modal-open');

            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);

            const cleanup = (result) => {
                this.modal.style.display = 'none';
                this.modal.classList.remove('show');
                document.body.classList.remove('modal-open');
                backdrop.remove();

                this.okBtn.removeEventListener('click', onOk);
                this.cancelBtn.removeEventListener('click', onCancel);

                resolve(result);
            };

            const onOk = () => cleanup(true);
            const onCancel = () => cleanup(false);

            this.okBtn.addEventListener('click', onOk);
            this.cancelBtn.addEventListener('click', onCancel);
        });
    }
}

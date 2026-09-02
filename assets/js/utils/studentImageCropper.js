/* Fixed 3:4 student photo cropper. Drag + zoom, then Crop & Set. */
export function openStudentImageCropper(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Unable to read image'));

        reader.onload = () => {
            const image = new Image();
            image.onerror = () => reject(new Error('Unable to load image'));

            image.onload = () => {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);
                    display:flex;align-items:center;justify-content:center;padding:16px;
                    box-sizing:border-box;font-family:inherit;
                `;

                const panel = document.createElement('div');
                panel.style.cssText = `
                    width:min(96vw,520px);max-height:94vh;overflow:auto;background:#fff;
                    border-radius:16px;padding:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);
                `;

                const title = document.createElement('div');
                title.textContent = 'Adjust Student Photo';
                title.style.cssText = 'font-size:18px;font-weight:600;margin-bottom:4px';

                const help = document.createElement('div');
                help.textContent = 'Fixed 3:4 ratio • Drag photo to position • Use zoom to adjust';
                help.style.cssText = 'font-size:13px;color:#6c757d;margin-bottom:12px';

                const frame = document.createElement('div');
                frame.style.cssText = `
                    position:relative;width:min(100%,360px);aspect-ratio:3/4;
                    margin:0 auto 14px;overflow:hidden;background:#111;border-radius:10px;
                    touch-action:none;cursor:grab;user-select:none;
                `;

                const canvas = document.createElement('canvas');
                canvas.width = 900;
                canvas.height = 1200;
                canvas.style.cssText = 'display:block;width:100%;height:100%';

                const ratioBadge = document.createElement('div');
                ratioBadge.textContent = '3 : 4';
                ratioBadge.style.cssText = `
                    position:absolute;right:8px;bottom:8px;padding:3px 7px;border-radius:6px;
                    background:rgba(0,0,0,.55);color:#fff;font-size:12px;pointer-events:none;
                `;

                const controls = document.createElement('div');
                controls.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:14px';

                const zoomLabel = document.createElement('span');
                zoomLabel.textContent = 'Zoom';
                zoomLabel.style.cssText = 'font-size:14px;font-weight:500;min-width:44px';

                const zoom = document.createElement('input');
                zoom.type = 'range';
                zoom.min = '1';
                zoom.max = '3';
                zoom.step = '0.01';
                zoom.value = '1';
                zoom.style.cssText = 'flex:1';

                const zoomValue = document.createElement('span');
                zoomValue.textContent = '1.00×';
                zoomValue.style.cssText = 'font-size:13px;color:#6c757d;min-width:42px;text-align:right';

                controls.append(zoomLabel, zoom, zoomValue);

                const actions = document.createElement('div');
                actions.style.cssText = 'display:flex;gap:10px;justify-content:flex-end';

                const cancel = document.createElement('button');
                cancel.type = 'button';
                cancel.textContent = 'Cancel';
                cancel.className = 'btn btn-outline-secondary';
                cancel.style.cssText = 'min-width:90px';

                const setBtn = document.createElement('button');
                setBtn.type = 'button';
                setBtn.textContent = 'Crop & Set';
                setBtn.className = 'btn btn-primary';
                setBtn.style.cssText = 'min-width:110px';

                actions.append(cancel, setBtn);
                frame.append(canvas, ratioBadge);
                panel.append(title, help, frame, controls, actions);
                overlay.append(panel);
                document.body.appendChild(overlay);

                const ctx = canvas.getContext('2d', { alpha:false });
                const targetRatio = 3 / 4;

                let baseCropW, baseCropH;
                if (image.width / image.height > targetRatio) {
                    baseCropH = image.height;
                    baseCropW = image.height * targetRatio;
                } else {
                    baseCropW = image.width;
                    baseCropH = image.width / targetRatio;
                }

                let scale = 1;
                let centerX = image.width / 2;
                let centerY = image.height / 2;
                let dragging = false;
                let lastX = 0;
                let lastY = 0;

                const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

                function bounds() {
                    const cropW = baseCropW / scale;
                    const cropH = baseCropH / scale;
                    return {
                        cropW, cropH,
                        minX: cropW / 2,
                        maxX: image.width - cropW / 2,
                        minY: cropH / 2,
                        maxY: image.height - cropH / 2
                    };
                }

                function draw() {
                    const b = bounds();
                    centerX = clamp(centerX, b.minX, b.maxX);
                    centerY = clamp(centerY, b.minY, b.maxY);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        image,
                        centerX - b.cropW / 2,
                        centerY - b.cropH / 2,
                        b.cropW, b.cropH,
                        0, 0, canvas.width, canvas.height
                    );
                }

                function updateZoom(value) {
                    scale = Number(value);
                    const b = bounds();
                    centerX = clamp(centerX, b.minX, b.maxX);
                    centerY = clamp(centerY, b.minY, b.maxY);
                    zoomValue.textContent = `${scale.toFixed(2)}×`;
                    draw();
                }

                function move(dx, dy) {
                    const rect = canvas.getBoundingClientRect();
                    const b = bounds();
                    centerX -= dx * (b.cropW / rect.width);
                    centerY -= dy * (b.cropH / rect.height);
                    draw();
                }

                zoom.addEventListener('input', e => updateZoom(e.target.value));

                frame.addEventListener('pointerdown', e => {
                    dragging = true;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    frame.style.cursor = 'grabbing';
                    try { frame.setPointerCapture(e.pointerId); } catch (_) {}
                });

                frame.addEventListener('pointermove', e => {
                    if (!dragging) return;
                    move(e.clientX - lastX, e.clientY - lastY);
                    lastX = e.clientX;
                    lastY = e.clientY;
                });

                const stopDrag = e => {
                    dragging = false;
                    frame.style.cursor = 'grab';
                    try { frame.releasePointerCapture(e.pointerId); } catch (_) {}
                };
                frame.addEventListener('pointerup', stopDrag);
                frame.addEventListener('pointercancel', stopDrag);

                frame.addEventListener('wheel', e => {
                    e.preventDefault();
                    const next = clamp(scale + (e.deltaY < 0 ? 0.08 : -0.08), 1, 3);
                    zoom.value = String(next);
                    updateZoom(next);
                }, { passive:false });

                function close(result, error) {
                    overlay.remove();
                    error ? reject(error) : resolve(result);
                }

                cancel.addEventListener('click', () => close(null));
                overlay.addEventListener('click', e => {
                    if (e.target === overlay) close(null);
                });

                setBtn.addEventListener('click', () => {
                    canvas.toBlob(blob => {
                        if (!blob) {
                            close(null, new Error('Unable to create cropped image'));
                            return;
                        }
                        const baseName = (file.name || 'student-photo').replace(/\.[^.]+$/, '') || 'student-photo';
                        close(new File(
                            [blob],
                            `${baseName}-3x4.jpg`,
                            { type:'image/jpeg', lastModified:Date.now() }
                        ));
                    }, 'image/jpeg', 0.92);
                });

                draw();
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    });
}

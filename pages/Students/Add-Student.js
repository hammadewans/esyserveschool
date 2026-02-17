export default function Students() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    let compressedBlob = null;
    const el = (tag, className) => {
        const e = document.createElement(tag);
        if (className) e.className = className;
        return e;
    };

    const floating = (input, labelText) => {
        const wrap = el('div', 'form-floating mb-3');
        const label = el('label');
        label.textContent = labelText;
        wrap.append(input, label);
        return wrap;
    };

    // ---------------- CONTAINER ----------------
    const container = el('div', 'container-fluid px-3 px-md-5 mt-4');
    const title = el('h4', 'mb-4 fw-bold text-center');
    title.textContent = 'Add Student';
    const form = el('form', 'row g-4');

    // ---------------- IMAGE COLUMN ----------------
    const imgCol = el('div', 'col-12 col-lg-4 d-flex flex-column align-items-center');

    const imgLabel = el('label', 'border border-2 rounded d-flex flex-column align-items-center justify-content-center w-100');
    imgLabel.style.cursor = 'pointer';
    imgLabel.style.aspectRatio = '3/4';
    imgLabel.style.maxWidth = '350px';
    imgLabel.style.backgroundColor = '#f8f9fa';
    imgLabel.style.position = 'relative';
    imgLabel.style.overflow = 'hidden';
    imgLabel.style.display = 'flex';
    imgLabel.style.alignItems = 'center';
    imgLabel.style.justifyContent = 'center';
    imgLabel.style.marginBottom = '10px';
    imgLabel.setAttribute('for', 'imgInput');

    const cameraIcon = el('i', 'bi bi-camera fs-1 text-muted'); 
    const imgText = el('div', 'small text-muted text-center mt-1');
    imgText.textContent = 'Click student image (Optional)';

    const preview = el('img', 'img-fluid rounded d-none');
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.objectFit = 'cover';

    imgLabel.append(cameraIcon, preview, imgText);

    const imgInput = el('input', 'd-none');
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.setAttribute('capture', 'environment');
    imgInput.id = 'imgInput';

    imgCol.append(imgLabel, imgInput);

    // ---------------- INPUTS COLUMN ----------------
    const inputCol = el('div', 'col-12 col-lg-8');

    const studentName = el('input', 'form-control'); studentName.placeholder='Student Name';
    const fatherName = el('input', 'form-control'); fatherName.placeholder='Father Name';
    const motherName = el('input', 'form-control'); motherName.placeholder='Mother Name';
    const rollNo = el('input', 'form-control'); rollNo.type='number'; rollNo.placeholder='Roll No';
    const dob = el('input', 'form-control'); dob.placeholder='DD/MM/YYYY'; dob.inputMode = 'numeric'; dob.maxLength=10;
    dob.addEventListener('input', e=>{
        let v=e.target.value.replace(/\D/g,'').slice(0,8);
        if(v.length>=5) v=`${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
        else if(v.length>=3) v=`${v.slice(0,2)}/${v.slice(2)}`;
        e.target.value=v;
    });
    const contact = el('input', 'form-control'); contact.type='tel'; contact.placeholder='Contact Number';
    const address = el('textarea', 'form-control'); address.placeholder='Address'; address.style.height='70px';

    // ---------------- CLASS RADIO BUTTONS ----------------
    const classDiv = el('div', 'mb-3');
    const classLabel = el('div', 'fw-semibold mb-1'); classLabel.textContent='Class';
    const classGroup = el('div', 'd-flex overflow-auto'); 
    classGroup.style.gap='0.25rem';
    classGroup.style.scrollbarWidth='none';
    classGroup.style.msOverflowStyle='none';
    classGroup.style.whiteSpace='nowrap';
    classGroup.style.paddingBottom='4px';

    const classList = ['Play','Nursery','LKG','UKG','1','2','3','4','5','6','7','8','9','10','11','12'];
    classList.forEach((cls,i)=>{
        const input = el('input','btn-check');
        input.type='radio';
        input.name='class';
        input.id=`class${i}`;
        input.value=cls.toLowerCase();
        if(i===0) input.checked=true;
        const label = el('label','btn btn-outline-primary text-center flex-shrink-0');
        label.setAttribute('for',`class${i}`);
        label.textContent=cls;
        label.style.minWidth='60px';
        label.style.flex='0 0 auto';
        classGroup.append(input,label);
    });
    classDiv.append(classLabel,classGroup);

    // ---------------- SECTION RADIO BUTTONS ----------------
    const sectionDiv = el('div', 'mb-3');
    const sectionLabel = el('div', 'fw-semibold mb-1'); sectionLabel.textContent='Section';
    const sectionGroup = el('div', 'd-flex overflow-auto'); 
    sectionGroup.style.gap='0.25rem';
    sectionGroup.style.scrollbarWidth='none';
    sectionGroup.style.msOverflowStyle='none';
    sectionGroup.style.whiteSpace='nowrap';
    sectionGroup.style.paddingBottom='4px';

    ['A','B','C','D','E','F'].forEach((sec,i)=>{
        const input = el('input','btn-check');
        input.type='radio';
        input.name='section';
        input.id=`section${i}`;
        input.value=sec.toLowerCase();
        if(i===0) input.checked=true;
        const label = el('label','btn btn-outline-primary text-center flex-shrink-0');
        label.setAttribute('for',`section${i}`);
        label.textContent=sec;
        label.style.minWidth='50px';
        label.style.flex='0 0 auto';
        sectionGroup.append(input,label);
    });
    sectionDiv.append(sectionLabel,sectionGroup);

    // ---------------- ROLE BUTTONS ----------------
    const roleDiv = el('div', 'mb-3');
    const roleLabel = el('div', 'fw-semibold mb-1'); roleLabel.textContent='Student Role';
    const roleGroup = el('div', 'btn-group w-100 flex-wrap');
    ['Student','Monitor','Head'].forEach((r,i)=>{
        const input = el('input','btn-check');
        input.type='radio'; input.name='role'; input.id='role'+i; input.value=r.toLowerCase();
        if(i===0) input.checked=true;
        const label = el('label','btn btn-outline-primary flex-fill');
        label.setAttribute('for','role'+i);
        label.textContent=r;
        roleGroup.append(input,label);
    });
    roleDiv.append(roleLabel,roleGroup);

    // ---------------- SAVE BUTTON ----------------
    const btnDiv = el('div','text-end mt-3');
    const saveBtn = el('button','btn btn-primary px-4');
    saveBtn.type='button'; saveBtn.textContent='Save Student';
    btnDiv.append(saveBtn);

    // ---------------- APPEND INPUTS ----------------
    inputCol.append(
        floating(studentName,'Student Name'),
        floating(fatherName,'Father Name'),
        floating(motherName,'Mother Name'),
        floating(rollNo,'Roll No'),
        floating(dob,'Date of Birth'),
        floating(contact,'Contact Number'),
        floating(address,'Address'),
        classDiv,
        sectionDiv,
        roleDiv,
        btnDiv
    );

    // ---------------- APPEND TO FORM ----------------
    form.append(imgCol, inputCol);
    container.append(title,form);
    app.appendChild(container);

    // ---------------- IMAGE PREVIEW + COMPRESSION ----------------
    function compressToTarget(canvas,file){
        return new Promise(resolve=>{
            let quality=0.9;
            (function loop(){
                canvas.toBlob(blob=>{
                    if(blob.size<=200*1024 || quality<0.3){
                        compressedBlob=new File([blob],file.name,{type:'image/jpeg'});
                        resolve(compressedBlob);
                        return;
                    }
                    quality-=0.1;
                    loop();
                },'image/jpeg',quality);
            })();
        });
    }

    imgInput.addEventListener('change', ()=>{
        const file = imgInput.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = e=>{
            const img = new Image();
            img.onload = async ()=>{
                const canvas = document.createElement('canvas');
                canvas.width = 1200; canvas.height=1600;
                const ctx=canvas.getContext('2d');
                const srcRatio=img.width/img.height;
                const targetRatio=3/4;
                let sx,sy,sw,sh;
                if(srcRatio>targetRatio){
                    sh=img.height; sw=sh*targetRatio; sx=(img.width-sw)/2; sy=0;
                } else{
                    sw=img.width; sh=sw/targetRatio; sx=0; sy=(img.height-sh)/2;
                }
                ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
                preview.src=canvas.toDataURL('image/jpeg',0.9);
                preview.classList.remove('d-none');
                cameraIcon.classList.add('d-none');
                imgText.classList.add('d-none');
                await compressToTarget(canvas,file);
            };
            img.src=e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // ---------------- SAVE BUTTON CLICK ----------------
    saveBtn.addEventListener('click', async () => {
        // --- TRIMMED VALUES ---
        const studentVal = studentName.value.trim();
        const fatherVal = fatherName.value.trim();
        const motherVal = motherName.value.trim();
        const rollVal = rollNo.value.trim();
        const dobVal = dob.value.trim();
        const contactVal = contact.value.trim();
        const addressVal = address.value.trim();

        // --- VALIDATION ---
        if (!studentVal) { Toast.error('Student Name is required'); return; }
        if (!fatherVal) { Toast.error('Father Name is required'); return; }
        if (!motherVal) { Toast.error('Mother Name is required'); return; }
        if (!rollVal) { Toast.error('Roll No is required'); return; }
        if (!/^\d{1,2}$/.test(rollVal)) { Toast.error('Roll No must be 1 or 2 digits'); return; }
        if (!dobVal) { Toast.error('Date of Birth is required'); return; }
        if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dobVal)) {
            Toast.error('Date of Birth must be in DD/MM/YYYY format'); return;
        }
        const [d, m, y] = dobVal.split('/').map(Number);
        const dateObj = new Date(y, m - 1, d);
        if (dateObj.getDate() !== d || dateObj.getMonth() !== m - 1 || dateObj.getFullYear() !== y) {
            Toast.error('Invalid Date of Birth'); return;
        }

        if (!contactVal) { Toast.error('Contact Number is required'); return; }
        if (!/^\d{10}$/.test(contactVal)) { Toast.error('Contact Number must be exactly 10 digits'); return; }
        if (!addressVal) { Toast.error('Address is required'); return; }

        // Get selected class, section, role
        const selectedClass = form.querySelector('input[name="class"]:checked')?.value;
        const selectedSection = form.querySelector('input[name="section"]:checked')?.value;
        const selectedRole = form.querySelector('input[name="role"]:checked')?.value;

        // --- CONVERT DOB TO YYYY-MM-DD ---
        const dobFormatted = `${y.toString().padStart(4,'0')}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;

        // --- FORM DATA ---
        const formData = new FormData();
        formData.append('student', studentVal);
        formData.append('father', fatherVal);
        formData.append('mother', motherVal);
        formData.append('rollno', rollVal);
        formData.append('dob', dobFormatted);
        formData.append('contact', contactVal);
        formData.append('address', addressVal);
        formData.append('class', selectedClass);
        formData.append('sectionclass', selectedSection);
        formData.append('role', selectedRole);
        if (compressedBlob) formData.append('imgstudent', compressedBlob);

        // --- SEND REQUEST ---
        try {
            const res = await fetch('https://esyserve.top/add/student', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (res.status === 401) {
                Toast.warning('Session expired. Please login again.');
                window.location.hash = '#/login';
                return;
            }

            const data = await res.json();

            if (res.status === 200) {
                Toast.success(data.message || 'Student added successfully!');

                // Reset only text inputs and textarea
                [studentName, fatherName, motherName, rollNo, dob, contact, address].forEach(input => input.value = '');

                // Reset image preview
                preview.src = '';
                preview.classList.add('d-none');
                cameraIcon.classList.remove('d-none');
                imgText.classList.remove('d-none');
                compressedBlob = null;

                // --- Keep last selected radio buttons --- no changes needed
            } else if (res.status === 400) {
                Toast.error(data);
            } else {
                Toast.error(data);
            }
        } catch (err) {
            console.error(err);
            Toast.error('Network or server error');
        }
    });
}

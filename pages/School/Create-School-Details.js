import Toast from '/components/Toast.js';

export default function Schools() {
    const app = document.getElementById('app');
    app.innerHTML = '';

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
    title.textContent = 'Add School';
    const form = el('form', 'row g-4');

    // ---------------- INPUTS COLUMN ----------------
    const inputCol = el('div', 'col-12');

    const udise = el('input','form-control'); udise.placeholder='UDISE Code';
    const schoolName = el('input','form-control'); schoolName.placeholder='School Name';
    const schoolBoard = el('input','form-control'); schoolBoard.placeholder='School Board';
    const principalName = el('input','form-control'); principalName.placeholder='Principal Name';
    const principalContact = el('input','form-control'); principalContact.type='tel'; principalContact.placeholder='Principal Contact';
    const location = el('input','form-control'); location.placeholder='Location / Street';
    const area = el('input','form-control'); area.placeholder='Area / Locality';
    const city = el('input','form-control'); city.placeholder='City';
    const district = el('input','form-control'); district.placeholder='District';
    const state = el('input','form-control'); state.placeholder='State';
    const pincode = el('input','form-control'); pincode.type='number'; pincode.placeholder='Pincode';
    const pin = el('input','form-control'); pin.type='password'; pin.placeholder='ePIN';

    // ---------------- SAVE BUTTON ----------------
    const btnDiv = el('div','text-end mt-3');
    const saveBtn = el('button','btn btn-primary px-4');
    saveBtn.type='button'; saveBtn.textContent='Save School';
    btnDiv.append(saveBtn);

    // ---------------- APPEND INPUTS ----------------
    inputCol.append(
        floating(udise,'UDISE Code'),
        floating(schoolName,'School Name'),
        floating(schoolBoard,'School Board'),
        floating(principalName,'Principal Name'),
        floating(principalContact,'Principal Contact'),
        floating(location,'Location / Street'),
        floating(area,'Area / Locality'),
        floating(city,'City'),
        floating(district,'District'),
        floating(state,'State'),
        floating(pincode,'Pincode'),
        floating(pin,'ePIN'),
        btnDiv
    );

    // ---------------- APPEND TO FORM ----------------
    form.append(inputCol);
    container.append(title,form);
    app.appendChild(container);

    // ---------------- SAVE BUTTON CLICK ----------------
    saveBtn.addEventListener('click', async () => {
        const udiseVal = udise.value.trim();
        const schoolNameVal = schoolName.value.trim();
        const schoolBoardVal = schoolBoard.value.trim();
        const principalNameVal = principalName.value.trim();
        const principalContactVal = principalContact.value.trim();
        const locationVal = location.value.trim();
        const areaVal = area.value.trim();
        const cityVal = city.value.trim();
        const districtVal = district.value.trim();
        const stateVal = state.value.trim();
        const pincodeVal = pincode.value.trim();
        const pinVal = pin.value.trim();

        // ---------------- VALIDATION ----------------
        if(!udiseVal || !/^\d{11}$/.test(udiseVal)){ Toast.error('UDISE Code must be 11 digits'); return; }
        if(!schoolNameVal){ Toast.error('School Name is required'); return; }
        if(!schoolBoardVal){ Toast.error('School Board is required'); return; }
        if(!principalNameVal){ Toast.error('Principal Name is required'); return; }
        if(!principalContactVal || !/^\d{10}$/.test(principalContactVal)){ Toast.error('Principal Contact must be 10 digits'); return; }
        if(!locationVal){ Toast.error('Location / Street is required'); return; }
        if(!areaVal){ Toast.error('Area / Locality is required'); return; }
        if(!cityVal){ Toast.error('City is required'); return; }
        if(!districtVal){ Toast.error('District is required'); return; }
        if(!stateVal){ Toast.error('State is required'); return; }
        if(!pincodeVal || !/^\d{6}$/.test(pincodeVal)){ Toast.error('Pincode must be 6 digits'); return; }
        if(!pinVal){ Toast.error('PIN is required'); return; }

        // ---------------- FORM DATA ----------------
        const formData = new FormData();
        formData.append('udise', udiseVal);
        formData.append('school', schoolNameVal);
        formData.append('board', schoolBoardVal);
        formData.append('principal', principalNameVal);
        formData.append('contact', principalContactVal);
        formData.append('location', locationVal);
        formData.append('area', areaVal);
        formData.append('city', cityVal);
        formData.append('district', districtVal);
        formData.append('state', stateVal);
        formData.append('pincode', pincodeVal);
        formData.append('pin', pinVal);

        // ---------------- SEND REQUEST ----------------
        try {
            const res = await fetch('https://esyserve.top/create/profile', {
                method:'POST',
                credentials:'include',
                body: formData
            });

            const data = await res.json();
            if(res.status===200){ 
                Toast.success(data || 'School added successfully!');
                window.location.hash = '#/School';
            } else {
                Toast.error(data || 'Error saving school');
            }
        } catch(err){
            console.error(err);
            Toast.error('Network or server error');
        }
    });
}

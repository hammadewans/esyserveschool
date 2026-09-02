import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function EditSchool() {
    const app = document.getElementById('app');
    app.innerHTML = '';

    showLoader();

    let profile = null;

    // ---------------- FETCH PROFILE ----------------
    try {
        const res = await fetch('https://esyserve.top/user/profile', {
            method: 'GET',
            credentials: 'include'
        });

        if(res.status === 401){
            hideLoader();
            Toast.warning('Please login first');
            window.location.hash = '#/login';
            return;
        }

        profile = await res.json();
    } catch(err){
        console.error(err);
        hideLoader();
        Toast.error('Failed to fetch profile');
        return;
    }

    hideLoader();

    if(!profile){
        Toast.warning('Profile not found. Please create school details.');
        window.location.hash = '#/create-school-details';
        return;
    }

    // ---------------- CREATE INPUTS ----------------
    const el = (tag, className) => {
        const e = document.createElement(tag);
        if(className) e.className = className;
        return e;
    };

    const floating = (input, labelText) => {
        const wrap = el('div', 'form-floating mb-3');
        const label = el('label');
        label.textContent = labelText;
        wrap.append(input, label);
        return wrap;
    };

    const container = el('div','container-fluid px-3 px-md-5 mt-4');
    const title = el('h4','mb-4 fw-bold text-center');
    title.textContent = 'Edit School';
    const form = el('form','row g-4');

    const inputCol = el('div','col-12');

    const udise = el('input','form-control'); 
    udise.value = profile.udise ?? '';
    udise.disabled = true;

    const schoolName = el('input','form-control'); schoolName.value = profile.school ?? '';
    const schoolBoard = el('input','form-control'); schoolBoard.value = profile.board ?? '';
    const principalName = el('input','form-control'); principalName.value = profile.principal ?? '';
    const principalContact = el('input','form-control'); principalContact.type='tel'; principalContact.value = profile.contact ?? '';
    const location = el('input','form-control'); location.value = profile.location ?? '';
    const area = el('input','form-control'); area.value = profile.area ?? '';
    const city = el('input','form-control'); city.value = profile.city ?? '';
    const district = el('input','form-control'); district.value = profile.district ?? '';
    const state = el('input','form-control'); state.value = profile.state ?? '';
    const pincode = el('input','form-control'); pincode.type='number'; pincode.value = profile.pincode ?? '';
    const pin = el('input','form-control'); pin.type='password'; pin.value = ''; // don't prefill ePIN

    const btnDiv = el('div','text-end mt-3');
    const saveBtn = el('button','btn btn-primary px-4');
    saveBtn.type='button'; saveBtn.textContent='Save Changes';
    btnDiv.append(saveBtn);

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

    form.append(inputCol);
    container.append(title,form);
    app.appendChild(container);

    // ---------------- SAVE BUTTON ----------------
    saveBtn.addEventListener('click', async () => {
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
        if(!pinVal){ Toast.error('ePIN is required'); return; }

        // ---------------- FORM DATA ----------------
        const formData = new FormData();
        formData.append('udise', udise.value);
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
            const res = await fetch('https://esyserve.top/edit/profile', {
                method:'POST',
                credentials:'include',
                body: formData
            });

            const data = await res.json();
            if(res.status===200){ 
                Toast.success(data || 'Profile updated successfully!');
                window.location.hash = '#/School';
            } else {
                Toast.error(data || 'Error updating profile');
            }
        } catch(err){
            console.error(err);
            Toast.error('Network or server error');
        }
    });
}

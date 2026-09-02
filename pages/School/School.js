import { showLoader, hideLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';

export default async function School() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  showLoader();

  let profile = null;

  try {
    const res = await fetch('https://esyserve.top/user/profile', {
      method: 'GET',
      credentials: 'include'
    });

    if (res.status === 401) {
      hideLoader();
      Toast.warning('User needs to login first.');
      window.location.hash = '#/login';
      return;
    }

    profile = await res.json();
  } catch (e) {
    console.error(e);
    Toast.error('Failed to fetch profile.');
    hideLoader();
    return;
  }

  hideLoader();

  // ===== Redirect if profile is null =====
  if (!profile) {
    Toast.warning('Profile not found. Please fill school details.');
    window.location.hash = '#/create-school-details';
    return;
  }

  const safeText = (text) => text ?? '-';

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.minHeight = '100vh';
  container.style.fontFamily = 'Roboto, sans-serif';
  container.style.backgroundColor = '#f8f9fa';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.padding = '0';

  // ===== Cover Image =====
  const coverBox = document.createElement('div');
  coverBox.style.width = '100%';
  coverBox.style.maxWidth = '600px';
  coverBox.style.margin = '0 auto';
  coverBox.style.position = 'relative';
  coverBox.style.backgroundColor = '#fff';
  coverBox.style.overflow = 'hidden';
  coverBox.style.zIndex = '0';
  coverBox.style.aspectRatio = '16 / 9';

  const coverImg = document.createElement('img');
  coverImg.src = profile.imgschool ?? '';
  coverImg.style.width = '100%';
  coverImg.style.height = '100%';
  coverImg.style.objectFit = 'contain';
  coverImg.style.display = 'block';
  coverImg.style.backgroundColor = '#fff';

  coverImg.onerror = function () {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.innerText = 'School Image';
    placeholder.className = 'd-flex justify-content-center align-items-center text-secondary';
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.fontSize = '1.2rem';
    coverBox.appendChild(placeholder);
  };

  coverBox.appendChild(coverImg);

  const editCoverBtn = document.createElement('button');
  editCoverBtn.className = 'btn btn-sm btn-primary position-absolute';
  editCoverBtn.style.top = '10px';
  editCoverBtn.style.right = '20px';
  editCoverBtn.innerHTML = '<i class="bi bi-pencil-square me-1"></i> Edit';
  editCoverBtn.onclick = () => window.location.hash = '#/edit-school';
  coverBox.appendChild(editCoverBtn);

  container.appendChild(coverBox);

  // ===== Logo =====
const logoWrapper = document.createElement('div');
logoWrapper.style.marginTop = '-60px';
logoWrapper.style.display = 'flex';
logoWrapper.style.flexDirection = 'column';
logoWrapper.style.alignItems = 'center';
logoWrapper.style.position = 'relative';
logoWrapper.style.zIndex = '1';

const logoBox = document.createElement('div');
logoBox.style.width = '120px';
logoBox.style.height = '120px';
logoBox.style.backgroundColor = '#dee2e6';
logoBox.style.overflow = 'hidden';
logoBox.style.border = '2px solid #fff';
logoBox.style.position = 'relative';

/* Add shadow like shadow-sm */
logoBox.style.boxShadow = '0 .25rem .5rem rgba(0,0,0,.275)';
logoBox.style.borderRadius = '0.5rem';

const logoImg = document.createElement('img');
logoImg.src = profile.imglogo ?? '';
logoImg.style.width = '100%';
logoImg.style.height = '100%';
logoImg.style.objectFit = 'cover';
logoImg.onerror = function () {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.innerText = 'Logo';
    placeholder.style.display = 'flex';
    placeholder.style.justifyContent = 'center';
    placeholder.style.alignItems = 'center';
    placeholder.style.color = '#6c757d';
    placeholder.style.height = '100%';
    placeholder.style.fontSize = '1rem';
    logoBox.appendChild(placeholder);
};
logoBox.appendChild(logoImg);

const editLogoBtn = document.createElement('button');
editLogoBtn.style.position = 'absolute';
editLogoBtn.style.top = '5px';
editLogoBtn.style.right = '5px';
editLogoBtn.style.padding = '2px 6px';
editLogoBtn.style.fontSize = '0.75rem';
editLogoBtn.style.backgroundColor = '#0d6efd';
editLogoBtn.style.border = 'none';
editLogoBtn.style.color = '#fff';
editLogoBtn.style.borderRadius = '0.25rem';
editLogoBtn.style.display = 'flex';
editLogoBtn.style.alignItems = 'center';
editLogoBtn.innerHTML = '<i class="bi bi-pencil-square me-1"></i> Edit';
editLogoBtn.title = 'Edit Logo';
editLogoBtn.onclick = () => window.location.hash = '#/edit-logo';

logoBox.appendChild(editLogoBtn);
logoWrapper.appendChild(logoBox);
container.appendChild(logoWrapper);


  // ===== School Name & Principal =====
  const nameBox = document.createElement('div');
  nameBox.style.textAlign = 'center';
  nameBox.style.marginTop = '10px';

  const schoolName = document.createElement('h2');
  schoolName.innerText = safeText(profile.school);
  const principal = document.createElement('p');
  principal.className = 'text-muted';
  principal.innerHTML = `<strong>Principal:</strong> ${safeText(profile.principal)}`;

  nameBox.appendChild(schoolName);
  nameBox.appendChild(principal);
  container.appendChild(nameBox);

  // ===== Edit Details Button =====
  const editDetailsBtn = document.createElement('button');
  editDetailsBtn.className = 'btn btn-success btn-sm mb-2';
  editDetailsBtn.innerHTML = '<i class="bi bi-pencil-square me-1"></i> Edit Details';
  editDetailsBtn.onclick = () => window.location.hash = '#/edit-school-details';
  container.appendChild(editDetailsBtn);

  // ===== Details List =====
  const detailsWrapper = document.createElement('div');
  detailsWrapper.style.width = '100%';
  detailsWrapper.style.display = 'flex';
  detailsWrapper.style.flexDirection = 'column';
  detailsWrapper.style.gap = '10px';
  detailsWrapper.style.padding = '0 10px';

  const addDetail = (label, value) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.padding = '8px 12px';
    row.style.backgroundColor = '#fff';
    row.style.borderRadius = '6px';
    row.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    const lbl = document.createElement('span');
    lbl.style.fontWeight = '500';
    lbl.innerText = label;
    const val = document.createElement('span');
    val.innerText = safeText(value);
    row.appendChild(lbl);
    row.appendChild(val);
    return row;
  };

  const fields = [
    ['UDISE', profile.udise],
    ['Board', profile.board],
    ['State', profile.state],
    ['District', profile.district],
    ['City', profile.city],
    ['Area', profile.area],
    ['Location', profile.location],
    ['Pincode', profile.pincode],
    ['Contact', profile.contact],
    ['Email', profile.email]
  ];

  fields.forEach(([label, value]) => detailsWrapper.appendChild(addDetail(label, value)));
  container.appendChild(detailsWrapper);

  // ===== Signature =====
  const sigWrapper = document.createElement('div');
  sigWrapper.style.marginTop = '20px';
  sigWrapper.style.display = 'flex';
  sigWrapper.style.flexDirection = 'column';
  sigWrapper.style.alignItems = 'center';
  sigWrapper.style.position = 'relative';
  sigWrapper.style.width = '90%';
  sigWrapper.style.maxWidth = '500px';
  sigWrapper.style.padding = '0 10px';

  const sigBox = document.createElement('div');
  sigBox.style.width = '100%';
  sigBox.style.height = '70px';
  sigBox.style.border = '1px solid #dee2e6';
  sigBox.style.borderRadius = '6px';
  sigBox.style.overflow = 'hidden';
  sigBox.style.position = 'relative';
  sigBox.style.backgroundColor = '#fff';

  const sigImg = document.createElement('img');
  sigImg.src = profile.imgsignature ?? '';
  sigImg.style.width = '100%';
  sigImg.style.height = '100%';
  sigImg.style.objectFit = 'contain';
  sigImg.onerror = function () {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.innerText = 'Signature';
    placeholder.className = 'text-secondary d-flex justify-content-center align-items-center';
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    sigBox.appendChild(placeholder);
  };
  sigBox.appendChild(sigImg);

  const editSigBtn = document.createElement('button');
  editSigBtn.className = 'btn btn-sm btn-primary d-flex align-items-center';
  editSigBtn.style.position = 'absolute';
  editSigBtn.style.top = '5px';
  editSigBtn.style.right = '5px';
  editSigBtn.style.padding = '2px 6px';
  editSigBtn.style.fontSize = '0.75rem';
  editSigBtn.innerHTML = '<i class="bi bi-pencil-square me-1"></i> Edit';
  editSigBtn.title = 'Edit Signature';
  editSigBtn.onclick = () => window.location.hash = '#/edit-signature';

  sigBox.appendChild(editSigBtn);
  sigWrapper.appendChild(sigBox);
  container.appendChild(sigWrapper);

  // ===== Auto-Login Button =====
  const autoLoginBtn = document.createElement('button');
  autoLoginBtn.className = 'btn btn-warning btn-sm mt-3 mb-4';
  autoLoginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-1"></i> Share with staff (Auto-Login)';
  autoLoginBtn.onclick = () => window.location.hash = '#/auto-login-generate';
  container.appendChild(autoLoginBtn);

  app.appendChild(container);
}

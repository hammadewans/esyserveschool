// app.js
import { Router } from '/assets/js/router.js';
import Header from '/components/Header.js';
import Navbar from '/components/Navbar.js';
import { initLoader } from '/assets/js/loader.js';
import Toast from '/components/Toast.js';
// Make globally accessible
window.Toast = Toast;

initLoader();
Header();
Navbar();


const router = new Router('/');

router.add('/', async () => {
    const page = await import('/pages/Home.js');
    return page.default();
});
router.add('/policy', async () => {
    const page = await import('/pages/Policy/Policy.js');
    return page.default();
});
router.add('/students', async () => {
    const page = await import('/pages/Students/Students.js');
    return page.default();
});
router.add('/add-student', async () => {
    const page = await import('/pages/Students/Add-Student.js');
    return page.default();
});
router.add('/edit-student/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Students/Edit-Student.js');
    return page.default(id);
});
router.add('/edit-student-image/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Students/Edit-Student-Image.js');
    return page.default(id);
});
router.add('/view-student/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Students/View-Student.js');
    return page.default(id);
});
router.add('/teachers', async () => {
    const page = await import('/pages/Teachers/Teachers.js');
    return page.default();
});
router.add('/add-teacher', async () => {
    const page = await import('/pages/Teachers/Add-Teacher.js');
    return page.default();
});
router.add('/edit-teacher/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Teachers/Edit-Teacher.js');
    return page.default(id);
});
router.add('/edit-teacher-image/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Teachers/Edit-Teacher-Image.js');
    return page.default(id);
});
router.add('/view-teacher/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Teachers/View-Teacher.js');
    return page.default(id);
});
router.add('/school', async () => {
    const page = await import('/pages/School/School.js');
    return page.default();
});
router.add('/create-school-details', async () => {
    const page = await import('/pages/School/Create-School-Details.js');
    return page.default();
});
router.add('/edit-school-details', async () => {
    const page = await import('/pages/School/Edit-School-Details.js');
    return page.default();
});
router.add('/edit-school', async () => {
    const page = await import('/pages/School/Edit-School.js');
    return page.default();
});
router.add('/edit-logo', async () => {
    const page = await import('/pages/School/Edit-Logo.js');
    return page.default();
});
router.add('/edit-signature', async () => {
    const page = await import('/pages/School/Edit-Signature.js');
    return page.default();
});
router.add('/login', async () => {
    const page = await import('/pages/Authentication/Login.js');
    return page.default();
});
router.add('/signup', async () => {
    const page = await import('/pages/Authentication/Signup.js');
    return page.default();
});
router.add('/reset', async () => {
    const page = await import('/pages/Authentication/Reset.js');
    return page.default();
});
router.add('/auto-login-generate', async () => {
    const page = await import('/pages/Authentication/Auto-Login-Generate.js');
    return page.default();
});
router.add('/auto-login/:token', async (params) => {
    const page = await import('/pages/Authentication/Auto-Login.js');
    return page.default(params.token);
}); 
router.add('/products/allcards', async () => {
    const page = await import('/pages/Products/AllCards.js');
    return page.default();
});
router.add('/products/allpolybags', async () => {
    const page = await import('/pages/Products/AllPolybags.js');
    return page.default();
});
router.add('/products/allnotebooks', async () => {
    const page = await import('/pages/Products/AllNotebooks.js');
    return page.default();
});
router.add('/card-details/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Products/Card-Details.js');
    return page.default(id);
});
router.add('/polybag-details/:id', async (params) => {
    const { id } = params;
    const page = await import('/pages/Products/Polybag-Details.js');
    return page.default(id);
});

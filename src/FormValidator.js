class FormValidator {
constructor(form) {
this.form = form;
}

validate() {
const elements = this.form.elements;

for (let el of elements) {  
  // Required field check (presence only if data-required exists)  
  if (el.hasAttribute("data-required") && !el.value.trim()) {  
    return `${el.name}: This is required.`;  
  }  

  // Pattern check (only if value is present)  
  if (el.hasAttribute("data-pattern") && el.value.trim()) {  
    const pattern = new RegExp(el.dataset.pattern);  
    if (!pattern.test(el.value)) {  
      return el.dataset.error;  
    }  
  }  

  // Match check (only if value is present)  
  if (el.hasAttribute("data-match") && el.value.trim()) {  
    const matchEl = this.form.querySelector(`#${el.dataset.match}`);  
    if (matchEl && el.value !== matchEl.value) {  
      return el.dataset.error;  
    }  
  }  
}  
return null; // no validation errors

}
}
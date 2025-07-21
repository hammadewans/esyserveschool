window.DataHandler = {
  capitalize: function(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (/^[a-z]/i.test(word)) {
          // Word starts with a letter → capitalize first letter
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          // Word starts with a number or non-letter → leave as is
          return word;
        }
      })
      .join(' ');
  },


  trimForm: function (form) {
    const elements = form.querySelectorAll('input, textarea, select');

    elements.forEach(el => {
      // Skip file inputs
      if (el.type === 'file') return;

      if (typeof el.value === 'string') {
        el.value = el.value.trim();
      }
    });
  }

};

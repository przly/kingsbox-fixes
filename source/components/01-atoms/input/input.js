document.querySelectorAll('.textarea-with-counter').forEach((textarea) => {
  const parent = textarea.closest('.mod-input');
  const counter = parent?.querySelector('.mod-input__curr-character');
  const textareaInput = parent?.querySelector('textarea');
  if (!counter || !textareaInput) return; // safety check

  // Remove empty space for default value
  textareaInput.value = textareaInput.value.trim();

  const updateCount = (ele) => {
    const value = ele ? ele.target.value : textareaInput.value;
    counter.textContent = value.length;
  };

  updateCount();
  textarea.addEventListener('input', updateCount);
});

const numbersFields1 = document.querySelectorAll('[data-num]');
const numbersFields2 = document.querySelectorAll('input[type="number"]');
const numbersFields = [...numbersFields1, ...numbersFields2];

numbersFields.forEach((input) => {
  input.addEventListener('input', (event) => {
    let { value } = event.target;

    // Remove everything except digits, + at the beginning, and .
    value = value.replace(/(?!^\+)[^\d.]/g, '');

    // Allow only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    event.target.value = value;
  });
});

// Add focus class while start typing
const inputs = document.querySelectorAll('.mod-input__field');
inputs.forEach((input) => {
  const parent = input.closest('.mod-input');
  input.addEventListener('focus', () => {
    parent.classList.add('is-focused');
  });

  input.addEventListener('blur', () => {
    if (!input.value) {
      parent.classList.remove('is-focused');
    }
  });
});

// Show password
attachEvent('[data-show-password]', 'click', (button) => {
  const parent = button.target.closest('.mod-input');
  const input = parent.querySelector('input');

  if (!input || input.type !== 'password') return;

  input.type = 'text';

  setTimeout(() => {
    input.type = 'password';
  }, 3000);
});

// *******************************************************************************
// 1.0 - Open dropdown
// *******************************************************************************

// Open dropdown
attachEvent('.dropdown__placeholder', 'click', (placeholder) => {
  const parent = placeholder.target.closest('.dropdown');
  parent.classList.toggle('is-open');

  if (parent.classList.contains('dropdown--search')) {
    parent.querySelector('.dropdown__search-input').focus();
  }
});

// Close on click outside
document.addEventListener('click', (ev) => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const clickInside = dropdown.contains(ev.target);
    const dropdownSearchInput = dropdown.querySelector('.dropdown__search-input');
    if (!clickInside) {
      dropdown.classList.remove('is-open');
      dropdownSearchInput?.blur();
    }
  });
});

// Pick option
const getHash = () => window.location.hash.replace(/^#/, '');

const getInputLabelText = (input) => {
  const dropdownOptionLabel = input.closest('.dropdown__list-item')?.querySelector('.dropdown__list-option');
  if (dropdownOptionLabel) {
    const text = dropdownOptionLabel.innerText.trim();
    if (text) return text;
  }

  const sizeSelectorLabel = input.closest('.size-selector__item')?.querySelector('.size-selector__item-label');
  if (sizeSelectorLabel) {
    const text = sizeSelectorLabel.innerText.trim();
    if (text) return text;
  }

  // Fallback to data attributes or value
  if (input.dataset.text) return input.dataset.text;
  if (input.value) return input.value;
  if (input.dataset.ehrm) return input.dataset.ehrm;

  return '';
};

const getInputValue = (input) => input.dataset.ehrm || input.value;

// *******************************************************************************
// Dropdown Multiselect
// *******************************************************************************

const updateDropdownSelectedPlaceholder = (dropdownParent) => {
  const dropdownPlaceholderText = dropdownParent.querySelector('.dropdown__placeholder-text');
  if (!dropdownPlaceholderText) {
    return;
  }

  const checkedInputs = dropdownParent.querySelectorAll('input:checked');
  const defaultPlaceholder = dropdownPlaceholderText.dataset.placeholder || '';

  if (checkedInputs.length === 0) {
    dropdownPlaceholderText.innerHTML = defaultPlaceholder;
    dropdownPlaceholderText.removeAttribute('data-ehrm');
    dropdownParent.classList.remove('is-selected');
    return;
  }

  const selectedLabels = Array.from(checkedInputs).map((input) => getInputLabelText(input));
  const selectedValues = Array.from(checkedInputs).map((input) => getInputValue(input));

  dropdownPlaceholderText.innerHTML = selectedLabels.join(', ');
  dropdownPlaceholderText.dataset.ehrm = selectedValues.join(',');
  dropdownParent.classList.add('is-selected');
};

attachEvent('.dropdown__list-option', 'click', (dropdownOption) => {
  const dropdownParent = dropdownOption.target.closest('.dropdown');
  if (!dropdownParent) return;

  // Multiselect should be handled by the input change flow only
  if (dropdownParent.classList.contains('dropdown--multiselect')) {
    return;
  }

  const dropdownPlaceholderText = dropdownParent.querySelector('.dropdown__placeholder-text');
  if (!dropdownPlaceholderText) return;

  const dropdownOptionText = dropdownOption.target.innerHTML;
  const dropdownOptionValue = dropdownOption.target.dataset.ehrm;

  dropdownPlaceholderText.innerHTML = dropdownOptionText;
  dropdownPlaceholderText.dataset.ehrm = dropdownOptionValue;

  dropdownParent.classList.remove('is-open');
  dropdownParent.classList.add('is-selected');
});

attachEvent('input', 'change', (ev) => {
  const dropdownParent = ev.target.closest('.dropdown');
  if (!dropdownParent) return;

  if (
    dropdownParent.classList.contains('dropdown--multiselect') &&
    dropdownParent.classList.contains('dropdown--secondary')
  ) {
    updateDropdownSelectedPlaceholder(dropdownParent);
  }
});

attachEvent('[data-tab-link]', 'click', (ev) => {
  const dropdownParent = ev.target.closest('.dropdown');
  if (
    !dropdownParent ||
    !dropdownParent.classList.contains('dropdown--multiselect') ||
    !dropdownParent.classList.contains('dropdown--secondary')
  ) {
    return;
  }

  const checkedInputs = dropdownParent.querySelectorAll('input:checked');
  if (checkedInputs.length === 0) return;

  checkedInputs.forEach((input) => {
    input.checked = false;
  });
  updateDropdownSelectedPlaceholder(dropdownParent);
});

// *******************************************************************************
// 3.0 - Open a specific dropdown based on has in url
// *******************************************************************************

document.addEventListener('DOMContentLoaded', () => {
  const locationHash = getHash();

  if (locationHash) {
    const selectedElem = document.querySelectorAll(`#${locationHash}`);

    // Loop through elements to avoid errors if there is no element to be found
    selectedElem.forEach((el) => {
      // Set active selection
      el.setAttribute('checked', 'true');

      // Change text
      const dropdownParent = el.closest('.dropdown');
      if (dropdownParent) {
        const optionLabel = el.parentElement.querySelector('.dropdown__list-option');
        const dropdownPlaceholder = dropdownParent.querySelector('.dropdown__placeholder');
        dropdownPlaceholder.innerHTML = optionLabel.innerHTML;
      }
    });
  }

  document.querySelectorAll('.dropdown.dropdown--multiselect.dropdown--secondary').forEach((dropdown) => {
    updateDropdownSelectedPlaceholder(dropdown);
  });

  document.querySelectorAll('.dropdown:not(.dropdown--multiselect)').forEach((dropdown) => {
    const checkedInput = dropdown.querySelector('input:checked');
    if (checkedInput) {
      const dropdownPlaceholderText = dropdown.querySelector('.dropdown__placeholder-text');
      if (dropdownPlaceholderText) {
        const selectedText = getInputLabelText(checkedInput);
        const selectedValue = getInputValue(checkedInput);

        dropdownPlaceholderText.innerHTML = selectedText;
        dropdownPlaceholderText.dataset.ehrm = selectedValue;
        dropdown.classList.add('is-selected');
      }
    }
  });
});

// *******************************************************************************
// Dropdown Search
// *******************************************************************************

const dropdownSearch = document.querySelectorAll('.dropdown__search-input');

dropdownSearch.forEach((input) => {
  const parentElem = input.closest('.dropdown');

  const filterCountries = (input) => {
    const searchValue = input.value.toLowerCase();
    const countryOptions = parentElem.querySelectorAll('.dropdown__list-option');

    Array.from(countryOptions).forEach((option) => {
      const country = option.innerHTML.toLowerCase();
      option.closest('.dropdown__list-item').style.display = country.includes(searchValue) ? 'block' : 'none';
    });
  };

  input.addEventListener('input', () => filterCountries(input));
});

if (dropdownSearch.length > 0) {
  // Event listener to hide the list when clicking outside a dropdown
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown__list-item').forEach((option) => {
      const input = option.closest('.dropdown').querySelector('.dropdown__search-input');
      option.style.display = 'block';
      input.value = '';
    });
  });
}

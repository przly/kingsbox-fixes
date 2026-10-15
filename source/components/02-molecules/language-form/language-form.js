const languageForms = document.querySelectorAll('.language-form');

if (languageForms.length > 0) {
  const syncDropdownPlaceholder = (dropdown) => {
    const selected = dropdown.querySelector('input:checked');
    const placeholder = dropdown.querySelector('.dropdown__placeholder');
    const placeholderText = dropdown.querySelector('.dropdown__placeholder-text');

    if (!placeholder || !placeholderText) return;

    const selectedOption = selected?.closest('[data-input-group-item]')?.querySelector('.dropdown__list-option');
    const selectedText = selectedOption?.querySelector('.dropdown__list-option-text')?.textContent.trim();
    const selectedImage = selectedOption?.querySelector('.dropdown__list-image img');
    const selectedBadge = selectedOption?.querySelector('.dropdown__list-badge')?.textContent.trim();

    placeholderText.textContent = selectedText || placeholderText.dataset.placeholder || '';
    dropdown.classList.toggle('is-selected', Boolean(selected));

    let placeholderBadge = placeholder.querySelector('.dropdown__placeholder-badge');
    if (selectedBadge && !placeholderBadge) {
      placeholderBadge = document.createElement('span');
      placeholderBadge.className =
        'dropdown__list-badge : dropdown__placeholder-badge : text--14 : text--uppercase : text--md : font-secondary : text--gray-500';
      placeholder.appendChild(placeholderBadge);
    }

    if (placeholderBadge) {
      if (selectedBadge) placeholderBadge.textContent = selectedBadge;
      else placeholderBadge.remove();
    }

    placeholder.querySelectorAll('.dropdown__placeholder-image').forEach((image, index) => {
      if (index > 0) image.remove();
    });

    let placeholderImage = placeholder.querySelector('.dropdown__placeholder-image');
    if (selectedImage && !placeholderImage) {
      placeholderImage = document.createElement('div');
      placeholderImage.className = 'dropdown__placeholder-image : bg-image';
      placeholder.insertBefore(placeholderImage, placeholderText);
      placeholderImage.innerHTML = '<img width="18" height="12" />';
    }

    if (placeholderImage) {
      if (selectedImage) {
        const image = placeholderImage.querySelector('img');
        image.src = selectedImage.src;
        image.alt = selectedImage.alt;
      } else {
        placeholderImage.remove();
      }
    }
  };

  const clearLanguageSelection = (dropdown) => {
    const selected = dropdown.querySelector('input:checked');

    if (!selected) return;

    selected.checked = false;
    dropdown.querySelector('.dropdown__placeholder-text').textContent =
      dropdown.querySelector('.dropdown__placeholder-text').dataset.placeholder || '';
    dropdown.querySelector('.dropdown__placeholder-text').removeAttribute('data-ehrm');
    dropdown.classList.remove('is-selected');
  };

  const updateFormState = (form) => {
    const regionDropdown = form.querySelector('[data-region-dropdown]');
    const languageDropdown = form.querySelector('[data-language-dropdown]');
    const btn = form.querySelector('[data-language-submit]');

    const regionSelected = regionDropdown.querySelector('input:checked');
    const market = regionSelected?.value.toLowerCase();
    const languageInputs = languageDropdown.querySelectorAll('input');

    languageDropdown.classList.toggle('is-disabled', !regionSelected);
    languageDropdown.setAttribute('aria-disabled', String(!regionSelected));

    languageInputs.forEach((input) => {
      const matchesMarket = market && input.value.toLowerCase().endsWith(`-${market}`);
      input.disabled = !matchesMarket;
      input.closest('[data-input-group-item]').hidden = !matchesMarket;

      if (!matchesMarket) input.checked = false;
    });

    const languageSelected = languageDropdown.querySelector('input:checked:not(:disabled)');
    if (!languageSelected) clearLanguageSelection(languageDropdown);

    const valid = Boolean(regionSelected && languageSelected?.dataset.url);
    btn.disabled = !valid;
    btn.classList.toggle('btn--disabled', !valid);
    btn.setAttribute('aria-disabled', String(!valid));
  };

  languageForms.forEach((form) => {
    const regionDropdown = form.querySelector('[data-region-dropdown]');
    const languageDropdown = form.querySelector('[data-language-dropdown]');

    form.addEventListener('change', () => {
      updateFormState(form);
      syncDropdownPlaceholder(regionDropdown);
      syncDropdownPlaceholder(languageDropdown);
    });

    form.addEventListener('click', (ev) => {
      const option = ev.target.closest('.dropdown__list-option');
      if (option) {
        option.closest('.dropdown')?.classList.remove('is-open');
        ev.stopPropagation();
      }
    }, true);

    form.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-language-dropdown].is-disabled')) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    });

    form.querySelector('[data-language-submit]').addEventListener('click', () => {
      const selected = form.querySelector('[data-language-dropdown] input:checked:not(:disabled)');
      if (selected?.dataset.url) window.location.assign(selected.dataset.url);
    });

    updateFormState(form);
    syncDropdownPlaceholder(regionDropdown);
    syncDropdownPlaceholder(languageDropdown);
  });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      languageForms.forEach((form) => {
        form.querySelectorAll('[data-region-dropdown], [data-language-dropdown]').forEach(syncDropdownPlaceholder);
      });
    });
  });
}

// Open Modal
const toggleLanguageSwitchModal = (toggle) => {
  document.querySelector('.language-switch-modal')?.classList.toggle('is-open-modal', toggle);
  document.body.classList.toggle('modal-open', toggle);
  toggleBodyScrollLock(toggle);
};

attachEvent('[data-language-trigger]', 'click', (ev) => {
  ev.preventDefault();
  toggleLanguageSwitchModal(true);
});

attachEvent('.language-switch-modal [data-close-modal]', 'click', () => {
  toggleLanguageSwitchModal(false);
});

onKeydown('escape', () => {
  document.querySelectorAll('.language-switch-modal.is-open-modal').forEach(() => {
    toggleLanguageSwitchModal(false);
  });
});

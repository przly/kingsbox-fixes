// *******************************************************************************
// Form handling
// *******************************************************************************
// eslint-disable-next-line no-unused-vars
const toggleLoaderClass = (elem, toggle) => {
  elem.classList.toggle('is-loading', toggle);
};

const fileCountValidator = () => ({
  validate(input) {
    const { maxFiles, maxError } = input.element.dataset;

    if (filesToUpload.length > Number(maxFiles)) {
      return {
        valid: false,
        message: maxError,
      };
    }

    return { valid: true };
  },
});

const fileSizeValidator = () => ({
  validate(input) {
    const { maxSize, sizeError } = input.element.dataset;

    if (!maxSize) {
      return { valid: true };
    }

    const limit = Number(maxSize);

    for (const { file } of filesToUpload) {
      if (file.size > limit) {
        return {
          valid: false,
          message: sizeError,
        };
      }
    }

    return { valid: true };
  },
});

const totalFileSizeValidator = () => ({
  validate(input) {
    const { maxTotalSize, totalSizeError } = input.element.dataset;

    if (!maxTotalSize) {
      return { valid: true };
    }

    const limit = Number(maxTotalSize);

    const totalSize = filesToUpload.reduce((sum, { file }) => sum + file.size, 0);

    if (totalSize > limit) {
      return {
        valid: false,
        message: totalSizeError,
      };
    }

    return { valid: true };
  },
});

const fileTypeValidator = () => ({
  validate(input) {
    const { extension, typeError } = input.element.dataset;

    if (!extension) {
      return { valid: true };
    }

    const allowed = extension.split(',').map((ext) => ext.trim().toLowerCase());

    for (const { file } of filesToUpload) {
      const ext = `.${file.name.split('.').pop().toLowerCase()}`;

      if (!allowed.includes(ext)) {
        return {
          valid: false,
          message: typeError,
        };
      }
    }

    return { valid: true };
  },
});

const submitRequestQuoteForm = async (options) => {
  if (isFractal()) {
    return onFormSubmit(options);
  }

  const requestQuoteFormData = new FormData();
  Object.entries(options.formData).forEach(([key, value]) => {
    requestQuoteFormData.append(key, value);
  });
  filesToUpload.forEach(({ file }) => {
    requestQuoteFormData.append('upload[]', file, file.name);
  });

  const token = await grecaptcha.execute(options.recaptchaKey, { action: options.recaptchaAction });
  const nonce = await getNonceForAction(options.recaptchaAction);
  requestQuoteFormData.append('action', options.recaptchaAction);
  requestQuoteFormData.append('nonce', nonce);
  requestQuoteFormData.append('token', token);

  return axios.post(options.url || localData.siteURL, requestQuoteFormData, {
    ...options.axiosOptions,
  });
};

const handleForm = (form, formAction) => {
  const formParent = form.closest('[data-parent]');
  const submitBtn = form.querySelector('.form-component__submit .btn');
  const passwordField = form.querySelector('#setPassword');
  const upload = form.querySelector('input[type="file"]');

  if (!formParent) {
    return;
  }
  const parentSection = form.closest('.sc-general');
  const formAlertError = formParent.querySelector('.form-component__alert-error');

  const emailError = getEmailError(form);
  const emailFields = formParent.querySelectorAll('input[type="email"]'); // Get all email fields

  const fieldValidators = {};
  emailFields.forEach((field) => {
    const fieldName = field.name;

    if (fieldName) {
      fieldValidators[fieldName] = {
        validators: {
          callback: {
            message: emailError,
            callback(input) {
              return validateEmail(input.value);
            },
          },
        },
      };
    }
  });

  const fv = FormValidation.formValidation(form, {
    locale: 'sl_SI',
    localization: FormValidation.locales.sl_SI,
    fields: fieldValidators,
    plugins: {
      message: new FormValidation.plugins.Message({
        container: (field, element) =>
          element.closest('.mod-input,.iti, .checkbox,.dropdown,.radio-button,.upload-box,.form-component__item'),
      }),
      declarative: new FormValidation.plugins.Declarative({
        html5Input: true,
      }),
      trigger: new FormValidation.plugins.Trigger({
        event: 'submit',
      }),
      excluded: new FormValidation.plugins.Excluded(),
      submitButton: new FormValidation.plugins.SubmitButton(),
    },
  })
    .registerValidator('checkMaxFiles', fileCountValidator)
    .registerValidator('checkFileSize', fileSizeValidator)
    .registerValidator('checkTotalFileSize', totalFileSizeValidator)
    .registerValidator('checkFileType', fileTypeValidator)
    .on('core.element.validated', (e) => {
      if (e.element.hasAttribute('required')) {
        const value = fv.getElementValue(e.field, e.element);
        const container = FormValidation.utils.closest(
          e.element,
          '.mod-input, .iti, .checkbox, .dropdown, .radio-button,.upload-box,.form-component__item',
        );
        FormValidation.utils.classSet(container, {
          'is-validation-failed': value === '' || !e.valid,
        });
      }
    })
    .on('core.form.valid', () => {
      const formType = form.querySelector('[data-form-type]').value;
      const formValue = getFormValue(form, fv);

      const hasInvalidPhone = formParent.querySelector('.mod-telephone .is-validation-failed');
      if (hasInvalidPhone) return;

      // // SPECIAL CASE: gift registration form
      // if (formType === 'gift_registration_form') {
      //   grecaptcha.ready(async () => {
      //     submitBtn.disabled = true;
      //     formParent.classList.add('show-loader');

      //     const moduleParent = form.closest('.registration-form-mol');

      //     try {
      //       const selectedProduct = moduleParent?.querySelector(
      //         'input[name="gift_registration_form_choose_product"]:checked',
      //       );

      //       const requiredInputs = {
      //         gift_registration_form_choose_product: selectedProduct?.value || '',
      //       };

      //       const hasEmptyRequiredField = Object.values(requiredInputs).some((value) => !value || value.trim() === '');

      //       if (!hasEmptyRequiredField) {
      //         formValue.productId = selectedProduct?.id || '';
      //         await addToCartAndRedirect(formValue);
      //       }
      //     } catch (error) {
      //       console.error(error);
      //       formParent.classList.remove('show-loader');
      //       formParent.classList.add('show-error');
      //       formAlertError.classList.remove('hide');
      //       formAlertError.innerHTML = error.response?.data?.data?.msg || 'Error';
      //     }

      //     setTimeout(() => {
      //       submitBtn.disabled = false;
      //       formParent.classList.remove('show-loader');
      //     }, 300);
      //   });

      //   return;
      // }

      // // SPECIAL CASE: registration form
      // if (formType === 'registration_form') {
      //   grecaptcha.ready(async () => {
      //     submitBtn.disabled = true;
      //     formParent.classList.add('show-loader');

      //     try {
      //       await addToCartAndRedirect(formValue);
      //     } catch (error) {
      //       console.error(error);
      //       formParent.classList.remove('show-loader');
      //       formParent.classList.add('show-error');
      //       formAlertError.classList.remove('hide');
      //       formAlertError.innerHTML = error.response.data.data.msg;
      //     }

      //     submitBtn.disabled = false;
      //   });

      //   return;
      // }

      // pushToDataLayer({
      //   event: 'form_submit',
      //   form_info: {
      //     form_id: formType,
      //     form_name: formType,
      //   },
      //   form_fields: JSON.parse(formValue.inputs.replaceAll(`${formType.replaceAll('-', '_')}_`, '')),
      // });

      grecaptcha.ready(async () => {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        formParent.classList.add('show-loader');
        try {
          // const files = {};
          // Array.from(filesToUpload).forEach((file, index) => {
          //   files[`files_${index + 1}`] = file.file;
          // });

          const resetHash = form.querySelector('#reset-hash')?.value;

          const response = await (form.id === 'request_quote_form' ? submitRequestQuoteForm : onFormSubmit)({
            formData: {
              ...formValue,
              // ...files,
              id: localData.id,
              lang: localData.lang,
              formType,
              ...(resetHash && { 'reset-hash': resetHash }),
            },
            recaptchaKey: form.querySelector('[data-sitekey]').getAttribute('data-sitekey'),
            recaptchaAction: formAction,
          });

          formParent.classList.remove('show-loader');
          submitBtn.classList.remove('is-loading');

          // Redirect on success if server returns a redirect URL
          if (response?.data?.data?.redirect) {
            window.location.href = response.data.data.redirect;
            return;
          }

          if (formAction === 'saveDownloadFormData' && response?.data?.data?.download_url) {
            const downloadLink = document.createElement('a');
            downloadLink.href = response.data.data.download_url;
            downloadLink.download = '';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
          }

          formParent.classList.add('show-thankyou');
          const hasToaster = formParent.classList.contains('has-toaster');

          if (parentSection) {
            parentSection.classList.add('show-thankyou');
            const scrollPosition = parentSection.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });
          }

          // NEWSLETTER COOKIE
          if (form.id === 'newsletter_popup_form') {
            setCookie('newsletter_subscribed');

            const modal = document.querySelector('.newsletter-modal');

            setTimeout(() => {
              modal?.classList.remove('is-open-modal');
              modal?.classList.add('is-subscribed');
            }, 2000);

            setTimeout(() => {
              form.reset();
              formParent.classList.remove('show-thankyou');
            }, 2500);
          }

          // Toaster success
          if (!hasToaster) {
            return;
          }
          setTimeout(() => {
            formParent.classList.remove('show-thankyou');
          }, 2000);
        } catch (error) {
          console.error(error);
          submitBtn.classList.remove('is-loading');
          formParent.classList.remove('show-loader');
          formParent.classList.add('show-error');
          formAlertError.classList.remove('hide');
          formAlertError.innerHTML = error.response.data.data.msg;
        }
        submitBtn.disabled = false;
      });
    });

  // File upload validation
  if (upload) {
    fv.addField(upload.name, {
      validators: {
        checkMaxFiles: {},
        checkFileSize: {},
        checkTotalFileSize: {},
        checkFileType: {},
      },
    });

    upload.addEventListener('change', () => {
      fv.validateField(upload.name);
    });

    attachEvent('.upload-box__list-remove', 'click', () => {
      fv.validateField(upload.name);
    });
  }

  // Password validation
  if (passwordField) {
    const getValidationElem = (parent, selector) => parent?.querySelector(selector);

    const passwordFieldParent = passwordField.closest('.mod-input');

    const [notEmptyMsg, capitalLettersMsg, lowerCaseMsg, digitMsg, minCharactersMsg, specialCharacter] = [
      '[data-fv-not-empty___message]',
      '[data-password-capital-letters]',
      '[data-password-lowercase]',
      '[data-password-digit]',
      '[data-password-min-characters]',
      '[data-password-special-character]',
    ].map((query) => getValidationElem(passwordFieldParent, query));

    const allValidationItems = passwordFieldParent.querySelectorAll('.mod-input__password-validation-item');
    const confirmPassValidationElem = document.getElementById('confirmResetPassword');

    const toggleValidationClass = (elem, failed) => {
      if (!elem) return;

      elem.classList.toggle('is-failed', failed);
      elem.classList.toggle('is-passed', !failed);
    };

    const strongPassword = () => ({
      validate(input) {
        const password = input.value;

        if (!password) {
          allValidationItems.forEach((elem) => {
            elem.classList.remove('is-failed', 'is-passed');
          });

          passwordFieldParent.classList.remove('is-validation-failed');

          return { valid: false };
        }

        const checks = [
          {
            failed: !/[A-Z]/.test(password),
            element: capitalLettersMsg,
          },
          {
            failed: !/[a-z]/.test(password),
            element: lowerCaseMsg,
          },
          {
            failed: !/\d/.test(password),
            element: digitMsg,
          },
          {
            failed: !/[!@#$%^&*()_\-+=<>?]/.test(password),
            element: specialCharacter,
          },
          {
            failed: password.length < 8,
            element: minCharactersMsg,
          },
        ];

        checks.forEach(({ failed, element }) => {
          toggleValidationClass(element, failed);
        });

        const hasFailedRule = checks.some(({ failed }) => failed);

        passwordFieldParent.classList.toggle('is-validation-failed', hasFailedRule);

        return { valid: !hasFailedRule };
      },
    });

    const passwordMessage = notEmptyMsg?.getAttribute('data-fv-not-empty___message') || '';

    fv.addField('setPassword', {
      validators: {
        notEmpty: {
          message: passwordMessage,
        },
        checkPassword: {
          message: passwordMessage,
        },
      },
    });

    if (confirmPassValidationElem) {
      fv.addField('confirmResetPassword', {
        validators: {
          identical: {
            compare() {
              return form.querySelector('[name="setPassword"]').value;
            },
            message: confirmPassValidationElem.getAttribute('data-fv-identical___message') || '',
          },
        },
      });
    }

    fv.registerValidator('checkPassword', strongPassword);

    const updateSubmitButton = async () => {
      const passwordStatus = await fv.validateField('setPassword');

      let confirmStatus = 'Valid';

      if (confirmPassValidationElem) {
        confirmStatus = await fv.validateField('confirmResetPassword');
      }

      submitBtn.disabled = passwordStatus !== 'Valid' || confirmStatus !== 'Valid';
    };

    submitBtn.disabled = true;

    passwordField.addEventListener('input', async () => {
      await fv.validateField('setPassword');

      if (confirmPassValidationElem) {
        await fv.validateField('confirmResetPassword');
      }

      updateSubmitButton();
    });

    if (confirmPassValidationElem) {
      confirmPassValidationElem.addEventListener('input', updateSubmitButton);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  [
    'form_component',
    'request_quote_form',
    'registration_form',
    'contact_form',
    'newsletter_form',
    'loyalty_form',
    'loyalty_card_form',
    'address_form',
    'contact_info_form',
    'change_password_form',
    'newsletter_preferences',
    'login_form',
    'reset_password_form',
    'forgot_password_form',
    'download_form',
    'job_form',
    'application_form',
  ].forEach((id) => {
    const form = document.querySelector(`#${id}`);
    if (form !== null) {
      const formAction = form.querySelector('[data-action]').value;
      handleForm(form, formAction);
    }
  });
});

// Check if all inputGroups in group have same name
const inputGroupParents = document.querySelectorAll('[data-input-group-parent]');

inputGroupParents.forEach((formRow) => {
  const inputGroups = formRow.querySelectorAll('[data-input-group-field]');

  if (inputGroups.length > 1) {
    // Check if failed
    const observer = new MutationObserver(() => {
      const inputParents = formRow.querySelectorAll('[data-input-group-item]');
      const hasFailedRadio = [...inputParents].some((inputParent) =>
        inputParent.classList.contains('is-validation-failed'),
      );
      formRow.classList.toggle('failed', hasFailedRadio);
    });

    inputGroups.forEach((input) =>
      observer.observe(input.closest('[data-input-group-item]'), { attributes: true, attributeFilter: ['class'] }),
    );

    // Get the first error message and create a new div
    if (formRow.classList.contains('input-group')) {
      const errorMessage = formRow.querySelector('[data-fv-not-empty___message]');
      if (errorMessage) {
        const groupErrorMessage = document.createElement('div');
        groupErrorMessage.classList.add('fv-plugins-message-container', 'group-error');
        groupErrorMessage.innerHTML = errorMessage.getAttribute('data-fv-not-empty___message');

        formRow.appendChild(groupErrorMessage);
      }
    }
  }
});

document.querySelectorAll('[data-toggle-field]').forEach((radio) => {
  const groupName = radio.name;
  const target = document.querySelector(`[data-field="${radio.dataset.toggleField}"]`);

  if (!target) return;

  const update = () => {
    const checkedRadio = document.querySelector(`[name="${groupName}"]:checked`);
    target.classList.toggle('hide', checkedRadio !== radio);
  };

  document.querySelectorAll(`[name="${groupName}"]`).forEach((r) => r.addEventListener('change', update));
  update();
});

// Toggle additional fields
attachEvent('.btn-additional-fields', 'click', (ev) => {
  const parentForm = ev.target.closest('.form-component');
  parentForm.classList.add('show-additional-field');
});

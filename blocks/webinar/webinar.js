import { getCookieConsentState, getCurrentPage } from '../../scripts/aem.js';
import { sendFormBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const cells = [...block.children];

  if (cells[0]) {
    const descText = cells[0].innerHTML.trim();
    if (descText) {
      if (!descText.startsWith('<')) {
        cells[0].innerHTML = `<p>${descText}</p>`;
      }
    } else {
      block.removeChild(cells[0]);
    }
  }

  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // First Name
  const firstNameInput = document.createElement('input');
  firstNameInput.type = 'text';
  firstNameInput.name = 'firstName';
  firstNameInput.placeholder = `${placeholders.firstname}*`;
  firstNameInput.required = true;

  // Last Name
  const lastNameInput = document.createElement('input');
  lastNameInput.type = 'text';
  lastNameInput.name = 'lastName';
  lastNameInput.placeholder = `${placeholders.lastname}*`;
  lastNameInput.required = true;

  // Phone Number
  const phoneInput = document.createElement('input');
  phoneInput.type = 'number';
  phoneInput.name = 'phone';
  phoneInput.placeholder = `${placeholders.phone}*`;
  phoneInput.required = true;
  phoneInput.pattern = '[0-9]{10,15}';

  // OTP field
  const otpWrapper = document.createElement('div');
  otpWrapper.className = 'otp-wrapper';

  const getOtpBtn = document.createElement('button');
  getOtpBtn.type = 'button';
  getOtpBtn.textContent = `${placeholders.sendOtpToMobile}` || 'Send otp to Mobile';
  getOtpBtn.className = 'get-otp-btn';
  getOtpBtn.disabled = true;

  otpWrapper.appendChild(getOtpBtn);

  const otpFieldsContainer = document.createElement('div');
  otpFieldsContainer.className = 'otp-fields-container';

  const otpInputs = [];
  for (let i = 0; i < 4; i += 1) {
    const otpDigit = document.createElement('input');
    otpDigit.type = 'text';
    otpDigit.inputMode = 'numeric';
    otpDigit.maxLength = 1;
    otpDigit.className = 'otp-digit';
    otpDigit.style.display = 'none';
    otpDigit.required = true;
    otpInputs.push(otpDigit);
    otpFieldsContainer.appendChild(otpDigit);
  }
  otpWrapper.appendChild(otpFieldsContainer);

  // get OTP value
  function getOtpValue() {
    return otpInputs.map((input) => input.value).join('');
  }

  // Email Address
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  // Preferred Time Slot
  const timeSlotSelect = document.createElement('select');
  timeSlotSelect.name = 'preferredTimeSlot';
  timeSlotSelect.required = true;
  const timeSlots = [
    '20th June, 2024 - 10 A.M',
    '20th June, 2024 - 5 P.M',
    '21st June, 2024 - 10 A.M',
    '21st June, 2024 - 5 P.M',
  ];
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = `${placeholders.preferredTimeSlot}*`;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  timeSlotSelect.appendChild(defaultOption);
  timeSlots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeSlotSelect.appendChild(option);
  });

  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.signUp}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  function updateSubmitState() {
    const allFilled = firstNameInput.value.trim()
    && lastNameInput.value.trim()
    && phoneInput.validity.valid
    && emailInput.validity.valid
    && otpInputs[0].style.display !== 'none'
    && getOtpValue() === '1234'
    && timeSlotSelect.value !== '';
    submitBtn.disabled = !allFilled;
    submitBtn.classList.toggle('disabled-btn', !allFilled);
  }

  // Focus next input on input
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      updateSubmitState();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  [firstNameInput, lastNameInput, phoneInput, emailInput, timeSlotSelect].forEach((el) => {
    el.addEventListener('input', () => {
      updateSubmitState();
      if (el === phoneInput) {
        getOtpBtn.disabled = !phoneInput.validity.valid;
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled-btn');
        otpInputs.forEach((input) => {
          input.style.display = 'none';
          input.value = '';
        });
      }
    });
    el.addEventListener('change', () => {
      updateSubmitState();
      if (el === phoneInput) {
        getOtpBtn.disabled = !phoneInput.validity.valid;
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled-btn');
        otpInputs.forEach((input) => {
          input.style.display = 'none';
          input.value = '';
        });
      }
    });
  });

  getOtpBtn.addEventListener('click', () => {
    otpInputs.forEach((input) => {
      input.style.display = 'inline-block';
      input.value = '';
    });
    otpInputs[0].focus();
    updateSubmitState();
  });

  otpWrapper.insertBefore(getOtpBtn, otpWrapper.firstChild);

  form.append(
    firstNameInput,
    lastNameInput,
    phoneInput,
    otpWrapper,
    emailInput,
    timeSlotSelect,
    submitBtn,
  );
  block.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Webinar signup submitted!');
    const formData = {
      page: getCurrentPage(),
      timestamp: new Date().toISOString(),
      cookieConsentAccepted: getCookieConsentState(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      preferredTimeSlot: timeSlotSelect.value.trim(),
    };
    sendFormBeacon(formData, 'webinar-signup');
    form.remove();
    const confirmation = document.createElement('p');
    confirmation.style.padding = '5rem';
    confirmation.innerHTML = `
      ${placeholders.webinarThankYou} ${timeSlotSelect.value}
      `;
    block.append(confirmation);
  });
}

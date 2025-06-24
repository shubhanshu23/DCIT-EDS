import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

function createOtpFormSection(placeholders) {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Suggestion textarea
  const suggestion = document.createElement('textarea');
  suggestion.name = 'suggestion';
  suggestion.placeholder = `${placeholders.suggestion}*`;
  suggestion.required = true;

  // Email input
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  // OTP wrapper
  const otpWrapper = document.createElement('div');
  otpWrapper.className = 'otp-wrapper';

  // Send OTP button
  const getOtpBtn = document.createElement('button');
  getOtpBtn.type = 'button';
  getOtpBtn.textContent = `${placeholders.sendOtpBtn}`;
  getOtpBtn.className = 'get-otp-btn';
  getOtpBtn.disabled = true;

  const otpFieldsContainer = document.createElement('div');
  otpFieldsContainer.className = 'otp-fields-container';

  const OTP_LENGTH = 4;
  const otpInputs = [];
  for (let i = 0; i < OTP_LENGTH; i += 1) {
    const otpDigit = document.createElement('input');
    otpDigit.type = 'text';
    otpDigit.inputMode = 'numeric';
    otpDigit.maxLength = 1;
    otpDigit.className = 'otp-digit';
    otpDigit.style.display = 'none'; // hidden initially
    otpInputs.push(otpDigit);
    otpFieldsContainer.appendChild(otpDigit);
  }

  // Success icon (tick)
  const otpSuccessIcon = document.createElement('span');
  otpSuccessIcon.textContent = '✔';
  otpSuccessIcon.className = 'otp-success-icon';
  otpSuccessIcon.style.display = 'none';
  otpSuccessIcon.style.color = 'green';
  otpSuccessIcon.style.marginLeft = '10px';
  otpSuccessIcon.style.fontSize = '18px';
  otpSuccessIcon.style.verticalAlign = 'middle';

  otpWrapper.append(getOtpBtn, otpFieldsContainer, otpSuccessIcon);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.save || 'Save'}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  // Get OTP string
  function getOtpValue() {
    return otpInputs.map((input) => input.value).join('');
  }
  // Enable/disable submit button
  function updateSubmitState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpCorrect = getOtpValue() === '1234';

    // Show tick icon if OTP is correct
    otpSuccessIcon.style.display = otpCorrect ? 'inline-block' : 'none';

    const isValid = suggestion.value.trim()
      && emailInput.validity.valid
      && allOtpVisible
      && otpCorrect;

    submitBtn.disabled = !isValid;
    submitBtn.classList.toggle('disabled-btn', !isValid);
  }

  // Enable/disable "Send OTP" button based on email validity
  emailInput.addEventListener('input', () => {
    const isValid = emailInput.validity.valid;
    getOtpBtn.disabled = !isValid;
    updateSubmitState(); // re-check in case email changed
  });

  // Show OTP fields on "Send OTP" click
  getOtpBtn.addEventListener('click', () => {
    otpInputs.forEach((input) => {
      input.style.display = 'inline-block';
      input.value = '';
    });
    otpInputs[0].focus();
    updateSubmitState();
  });

  // OTP input events
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

  suggestion.addEventListener('input', updateSubmitState);

  form.append(emailInput, otpWrapper, suggestion, submitBtn);
  return form;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = createOtpFormSection(placeholders);
  block.append(form);
}

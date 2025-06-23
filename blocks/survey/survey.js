// import { sendFormBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';
import decorateRating from '../rating/rating.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Last Name
  const suggestion = document.createElement('input');
  suggestion.type = 'textarea';
  suggestion.name = 'suggestion';
  suggestion.placeholder = `${placeholders.suggestion}*`;
  suggestion.required = true;

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  const otpWrapper = document.createElement('div');
  otpWrapper.className = 'otp-wrapper';

  const getOtpBtn = document.createElement('button');
  getOtpBtn.type = 'button';
  getOtpBtn.textContent = `${placeholders.sendOtpBtn}`;
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
    otpInputs.push(otpDigit);
    otpFieldsContainer.appendChild(otpDigit);
  }
  otpWrapper.appendChild(otpFieldsContainer);
  // get OTP value
  function getOtpValue() {
    return otpInputs.map((input) => input.value).join('');
  }

  // Start Quiz button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.startQuiz}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');
  function updateSubmitState() {
    const allFilled = suggestion.value.trim()
    && emailInput.validity.valid
    && otpInputs[0].style.display !== 'none'
    && getOtpValue() === '1234';
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
  otpWrapper.insertBefore(getOtpBtn, otpWrapper.firstChild);
  form.append(
    emailInput,
    otpWrapper,
    decorateRating,
    suggestion,
    submitBtn,
  );
  block.append(form);
}

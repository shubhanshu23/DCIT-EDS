import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';
import decorateRating from '../rating/rating.js';

function createOtpFormSection(placeholders) {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Suggestion textarea (hidden initially)
  const suggestion = document.createElement('textarea');
  suggestion.name = 'suggestion';
  suggestion.placeholder = `${placeholders.suggestion}*`;
  suggestion.required = true;
  suggestion.style.display = 'none';

  // Email input
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  // OTP setup
  const otpWrapper = document.createElement('div');
  otpWrapper.className = 'otp-wrapper';

  const getOtpBtn = document.createElement('button');
  getOtpBtn.type = 'button';
  getOtpBtn.textContent = `${placeholders.sendOtpBtn}`;
  getOtpBtn.className = 'get-otp-btn';
  getOtpBtn.disabled = true;

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

  const otpSuccessIcon = document.createElement('span');
  otpSuccessIcon.textContent = '✔';
  otpSuccessIcon.className = 'otp-success-icon';
  otpSuccessIcon.style.display = 'none';
  otpSuccessIcon.style.color = 'green';
  otpSuccessIcon.style.marginLeft = '10px';

  otpWrapper.append(getOtpBtn, otpFieldsContainer, otpSuccessIcon);

  // Rating section setup (hidden initially)
  const ratingFieldDiv = document.createElement('div');
  const ratingInput = document.createElement('input');
  ratingInput.type = 'number';
  ratingInput.name = 'rating';
  ratingInput.max = 5;
  ratingInput.required = true;
  ratingFieldDiv.appendChild(ratingInput);
  const ratingWrapper = decorateRating(ratingFieldDiv, { enabled: true, readOnly: false });
  ratingWrapper.style.display = 'none';

  // Get OTP string
  function getOtpValue() {
    return otpInputs.map((input) => input.value).join('');
  }

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.save || 'Save'}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  // Update validation and field visibility
  function updateSubmitState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpCorrect = getOtpValue() === '1234';

    otpSuccessIcon.style.display = otpCorrect ? 'inline-block' : 'none';

    // Show/hide fields after OTP success
    if (otpCorrect && allOtpVisible) {
      suggestion.style.display = 'block';
      ratingWrapper.style.display = 'flex';
    } else {
      suggestion.style.display = 'none';
      ratingWrapper.style.display = 'none';
    }

    const isValid = suggestion.value.trim()
    && emailInput.validity.valid
    && allOtpVisible
    && otpCorrect
    && ratingInput.value !== '';

    submitBtn.disabled = !isValid;
    submitBtn.classList.toggle('disabled-btn', !isValid);
  }

  // OTP field events
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

  // Enable OTP button after valid email
  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    updateSubmitState();
  });

  // Show OTP fields on click
  getOtpBtn.addEventListener('click', () => {
    otpInputs.forEach((input) => {
      input.style.display = 'inline-block';
      input.value = '';
    });
    otpInputs[0].focus();
    updateSubmitState();
  });

  // Other input listeners
  suggestion.addEventListener('input', updateSubmitState);
  ratingInput.addEventListener('change', updateSubmitState);

  // Final form assembly
  form.append(emailInput, otpWrapper, ratingWrapper, suggestion, submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rating = Number(ratingInput.value);
    // Redirect with rating as a query param
    window.location.href = `/survey-thankyou?rating=${rating}`;
  });

  return form;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = createOtpFormSection(placeholders);
  block.append(form);
}

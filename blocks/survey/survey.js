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
  getOtpBtn.style.display = 'none';

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

  // Rating section
  const ratingFieldDiv = document.createElement('div');
  const ratingInput = document.createElement('input');
  ratingInput.type = 'number';
  ratingInput.name = 'rating';
  ratingInput.max = 5;
  ratingInput.required = true;
  ratingFieldDiv.appendChild(ratingInput);
  const ratingWrapper = decorateRating(ratingFieldDiv, { enabled: true, readOnly: false });
  ratingWrapper.style.display = 'none';

  // Thumbs Up / Down buttons
  const thumbsWrapper = document.createElement('div');
  thumbsWrapper.className = 'thumbs-wrapper';
  thumbsWrapper.style.display = 'flex'; // Always visible

  const thumbsUpBtn = document.createElement('button');
  thumbsUpBtn.type = 'button';
  thumbsUpBtn.textContent = '👍';
  thumbsUpBtn.classList.add('thumbs-up-btn');
  thumbsUpBtn.disabled = true;

  const thumbsDownBtn = document.createElement('button');
  thumbsDownBtn.type = 'button';
  thumbsDownBtn.textContent = '👎';
  thumbsDownBtn.classList.add('thumbs-down-btn');
  thumbsDownBtn.disabled = true;

  thumbsWrapper.append(thumbsUpBtn, thumbsDownBtn);

  function getOtpValue() {
    return otpInputs.map((input) => input.value).join('');
  }

  function updateState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpCorrect = getOtpValue() === '1234';

    otpSuccessIcon.style.display = otpCorrect ? 'inline-block' : 'none';

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

    thumbsUpBtn.disabled = !isValid;
    thumbsDownBtn.disabled = !isValid;
  }

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      updateState();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    getOtpBtn.style.display = emailInput.validity.valid ? 'inline-block' : 'none';
    updateState();
  });

  getOtpBtn.addEventListener('click', () => {
    otpInputs.forEach((input) => {
      input.style.display = 'inline-block';
      input.value = '';
    });
    otpInputs[0].focus();
    updateState();
  });

  suggestion.addEventListener('input', updateState);
  ratingInput.addEventListener('change', updateState);

  // Handle thumbs button redirects
  const locale = document.querySelector('meta[name="locale"]')?.content || 'en';
  thumbsUpBtn.addEventListener('click', () => {
    if (!thumbsUpBtn.disabled) {
      window.location.href = `/${locale}/survey-thankyou?happy=true`;
    }
  });

  thumbsDownBtn.addEventListener('click', () => {
    if (!thumbsDownBtn.disabled) {
      window.location.href = `/${locale}/survey-thankyou?happy=false`;
    }
  });

  // Assemble the form
  form.append(emailInput, otpWrapper, ratingWrapper, suggestion, thumbsWrapper);

  return form;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = createOtpFormSection(placeholders);
  block.append(form);
}

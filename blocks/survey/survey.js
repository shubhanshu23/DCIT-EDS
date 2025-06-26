import { fetchPlaceholdersForLocale, createOtpComponent } from '../../scripts/scripts.js';
import decorateRating from '../rating/rating.js';

export function surveyForm(placeholders) {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Suggestion
  const suggestion = document.createElement('textarea');
  suggestion.name = 'suggestion';
  suggestion.placeholder = `${placeholders.suggestion}*`;
  suggestion.required = true;
  suggestion.style.display = 'none';

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  // Rating
  const ratingFieldDiv = document.createElement('div');
  const ratingInput = document.createElement('input');
  ratingInput.type = 'number';
  ratingInput.name = 'rating';
  ratingInput.max = 5;
  ratingInput.required = true;
  ratingFieldDiv.appendChild(ratingInput);
  const ratingWrapper = decorateRating(ratingFieldDiv, { enabled: true, readOnly: false });
  ratingWrapper.style.display = 'none';

  // Thumbs
  const thumbsWrapper = document.createElement('div');
  thumbsWrapper.className = 'thumbs-wrapper';
  thumbsWrapper.style.display = 'flex';

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

  // OTP
  const otpComponent = createOtpComponent({
    placeholders,
    correctOtp: '1234',
    onSuccess: () => {
      suggestion.style.display = 'block';
      ratingWrapper.style.display = 'flex';
      // eslint-disable-next-line no-use-before-define
      updateState();
    },
  });

  // eslint-disable-next-line object-curly-newline
  const { wrapper: otpWrapper, getOtpBtn, otpInputs, isOtpCorrect, showOtpBtn } = otpComponent;

  function updateState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpValid = isOtpCorrect();

    const isValid = suggestion.value.trim()
      && emailInput.validity.valid
      && allOtpVisible
      && otpValid
      && ratingInput.value !== '';

    thumbsUpBtn.disabled = !isValid;
    thumbsDownBtn.disabled = !isValid;
  }

  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    if (emailInput.validity.valid) showOtpBtn();
    updateState();
  });

  suggestion.addEventListener('input', updateState);
  ratingInput.addEventListener('change', updateState);

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

  form.append(emailInput, otpWrapper, ratingWrapper, suggestion, thumbsWrapper);
  return form;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = surveyForm(placeholders);
  block.append(form);
}

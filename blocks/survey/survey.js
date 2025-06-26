import { fetchPlaceholdersForLocale, createOtpComponent } from '../../scripts/scripts.js';
import decorateRating from '../rating/rating.js';

async function showThankYouContent(type = 'happy') {
  const modalContent = document.querySelector('.survey-modal .modal-content');
  if (!modalContent) return;

  modalContent.innerHTML = ''; // Clear old form

  // Close Button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.querySelector('.survey-modal')?.remove();
    localStorage.setItem('surveyModalDismissed', Date.now().toString());
  });

  // Thank You Message
  const message = document.createElement('div');
  message.className = 'thank-you-message';

  if (type === 'happy') {
    message.innerHTML = `
      <h2>🎉 Thank you for your positive feedback!</h2>
      <p>We’re glad you had a great experience.</p>
    `;
  } else {
    message.innerHTML = `
      <h2>🙏 Thank you for your feedback!</h2>
      <p>We appreciate your input and will work to improve.</p>
    `;
  }

  modalContent.append(closeBtn, message);
}

export function surveyForm(placeholders, isModal = false) {
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
      if (isModal) {
        showThankYouContent('happy');
      } else {
        window.location.href = `/${locale}/survey-thankyou?happy=true`;
      }
    }
  });

  thumbsDownBtn.addEventListener('click', () => {
    if (!thumbsDownBtn.disabled) {
      if (!thumbsUpBtn.disabled) {
        if (isModal) {
          showThankYouContent('sad');
        } else {
          window.location.href = `/${locale}/survey-thankyou?happy=true`;
        }
      }
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

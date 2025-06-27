import { fetchPlaceholdersForLocale, createOtpComponent } from '../../scripts/scripts.js';
import decorateRating from '../rating/rating.js';

export async function showThankYouContent(type = 'happy', happyContent = null, sadContent = null) {
  const modalContent = document.querySelector('.survey-modal .modal-content');
  if (!modalContent) return;

  modalContent.innerHTML = '';

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    document.querySelector('.survey-modal')?.remove();
    localStorage.setItem('surveyModalDismissed', Date.now().toString());
  });

  const contentToShow = type === 'happy' ? happyContent : sadContent;
  if (!contentToShow) return;

  const message = contentToShow.cloneNode(true);
  message.classList.add('thank-you-message');

  modalContent.append(closeBtn, message);
}

export function surveyForm(placeholders, isModal = false, happyContent = null, sadContent = null) {
  const locale = document.querySelector('meta[name="locale"]')?.content || 'en';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '#';

  const createInput = (type, name, placeholder, required = true) => {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.required = required;
    return input;
  };

  const emailInput = createInput('email', 'email', `${placeholders.email}*`);
  const suggestion = document.createElement('textarea');
  suggestion.name = 'suggestion';
  suggestion.placeholder = `${placeholders.suggestion}*`;
  suggestion.required = true;
  suggestion.style.display = 'none';

  const ratingInput = createInput('number', 'rating', '', true);
  ratingInput.max = 5;

  const ratingField = document.createElement('div');
  ratingField.appendChild(ratingInput);
  const ratingWrapper = decorateRating(ratingField, { enabled: true, readOnly: false });
  ratingWrapper.style.display = 'none';

  const thumbsWrapper = document.createElement('div');
  thumbsWrapper.className = 'thumbs-wrapper';
  thumbsWrapper.style.display = 'flex';

  const createThumbBtn = (text, className) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.classList.add(className);
    btn.disabled = true;
    return btn;
  };

  const thumbsUpBtn = createThumbBtn('👍', 'thumbs-up-btn');
  const thumbsDownBtn = createThumbBtn('👎', 'thumbs-down-btn');
  thumbsWrapper.append(thumbsUpBtn, thumbsDownBtn);

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

  const {
    wrapper: otpWrapper,
    getOtpBtn,
    otpInputs,
    isOtpCorrect,
    showOtpBtn,
  } = otpComponent;

  const updateState = () => {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpValid = isOtpCorrect();
    const isValid = emailInput.validity.valid
      && otpValid
      && allOtpVisible
      && suggestion.value.trim()
      && ratingInput.value;

    thumbsUpBtn.disabled = !isValid;
    thumbsDownBtn.disabled = !isValid;
  };

  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    if (emailInput.validity.valid) showOtpBtn();
    updateState();
  });

  suggestion.addEventListener('input', updateState);
  ratingInput.addEventListener('change', updateState);

  const handleFeedbackClick = (type) => {
    const isValidClick = type === 'happy' ? !thumbsUpBtn.disabled : !thumbsDownBtn.disabled;
    if (!isValidClick) return;

    if (isModal) {
      showThankYouContent(type, happyContent, sadContent);
    } else {
      window.location.href = `/${locale}/survey-thankyou?happy=${type === 'happy'}`;
    }
  };

  thumbsUpBtn.addEventListener('click', () => handleFeedbackClick('happy'));
  thumbsDownBtn.addEventListener('click', () => handleFeedbackClick('sad'));

  form.append(emailInput, otpWrapper, ratingWrapper, suggestion, thumbsWrapper);
  return form;
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const form = surveyForm(placeholders);
  block.append(form);
}

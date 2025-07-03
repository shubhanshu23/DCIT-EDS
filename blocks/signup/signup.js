import { getCookieConsentState, getCurrentPage } from '../../scripts/aem.js';
import { sendFormBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  document.querySelector('.signup-form').classList.add('active');

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

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = `${placeholders.email}*`;
  emailInput.required = true;

  // Agree to processing personal data
  const agreeDiv = document.createElement('div');
  agreeDiv.className = 'form-checkbox';
  const agreeInput = document.createElement('input');
  agreeInput.type = 'checkbox';
  agreeInput.id = 'agreeToTerms';
  agreeInput.name = 'agreeToTerms';
  agreeInput.required = true;
  const agreeLabel = document.createElement('label');
  agreeLabel.setAttribute('for', 'agreeToTerms');
  agreeLabel.innerHTML = `${placeholders.agreePersonaldata}`;
  agreeDiv.append(agreeInput, agreeLabel);

  // Start Quiz button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.startQuiz}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  function updateSubmitState() {
    const allFilled = firstNameInput.value.trim()
    && lastNameInput.value.trim()
    && emailInput.validity.valid
    && agreeInput.checked;
    submitBtn.disabled = !allFilled;
    submitBtn.classList.toggle('disabled-btn', !allFilled);
  }

  [firstNameInput, lastNameInput, agreeInput, emailInput].forEach((el) => {
    el.addEventListener('input', () => {
      updateSubmitState();
      if (el === emailInput) {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled-btn');
      }
    });
    el.addEventListener('change', () => {
      updateSubmitState();
      if (el === emailInput) {
        submitBtn.disabled = true;
        submitBtn.classList.add('disabled-btn');
      }
    });
  });

  form.append(
    firstNameInput,
    lastNameInput,
    emailInput,
    agreeDiv,
    submitBtn,
  );
  block.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      page: getCurrentPage(),
      timestamp: new Date().toISOString(),
      cookieConsentAccepted: getCookieConsentState(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      agreeToTerms: `${agreeInput.checked}`,
      plan: `${sessionStorage.getItem('plan')}`,
      premium: `${sessionStorage.getItem('premium')}`,
    };
    sendFormBeacon(formData, 'signup');
    form.parentElement.classList.remove('active');
    console.log('Signup started!');
  });
}

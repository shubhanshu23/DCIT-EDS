import { getCookieConsentState, getCurrentPage } from '../../scripts/aem.js';
import { sendFormBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();

  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Get selected plan and premium from sessionStorage
  const selectedPlan = sessionStorage.getItem('plan');
  const selectedPremium = sessionStorage.getItem('premium');

  if (selectedPlan || selectedPremium) {
    const selectedInfo = document.createElement('div');
    selectedInfo.className = 'selected-plan-info';

    selectedInfo.innerHTML = `
      <h4><strong>${placeholders.selectedInfoTitle}</strong></h4>
      ${selectedPlan ? `<p>${placeholders.plan}: <strong> ${selectedPlan} </strong></p>` : ''}
      ${selectedPremium ? `<p>${placeholders.premium}: <strong> ${selectedPremium} </strong></p>` : ''}
    `;

    block.appendChild(selectedInfo);
  }

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

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.submit}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  // Function to update button state
  function updateSubmitState() {
    const allFilled = firstNameInput.value.trim()
      && lastNameInput.value.trim()
      && emailInput.validity.valid
      && agreeInput.checked;

    submitBtn.disabled = !allFilled;
    submitBtn.classList.toggle('disabled-btn', !allFilled);
  }

  // Add listeners to form fields
  [firstNameInput, lastNameInput, emailInput, agreeInput].forEach((el) => {
    el.addEventListener('input', updateSubmitState);
    el.addEventListener('change', updateSubmitState);
  });

  // Add fields to form
  form.append(
    firstNameInput,
    lastNameInput,
    emailInput,
    agreeDiv,
    submitBtn,
  );

  // Add form to block
  block.append(form);

  // Handle form submission
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
      plan: selectedPlan || '',
      premium: selectedPremium || '',
    };

    sendFormBeacon(formData, 'insurance-signup');
    form.parentElement.classList.remove('active');
    console.log('Signup completed!');
  });
}

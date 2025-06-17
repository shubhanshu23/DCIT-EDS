export default async function decorate(block) {
  const cells = [...block.children];
  document.querySelector('.quiz-form').classList.add('active');

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
  firstNameInput.placeholder = 'First Name*';
  firstNameInput.required = true;

  // Last Name
  const lastNameInput = document.createElement('input');
  lastNameInput.type = 'text';
  lastNameInput.name = 'lastName';
  lastNameInput.placeholder = 'Last Name*';
  lastNameInput.required = true;

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Email*';
  emailInput.required = true;

  const otpWrapper = document.createElement('div');
  otpWrapper.className = 'otp-wrapper';

  const getOtpBtn = document.createElement('button');
  getOtpBtn.type = 'button';
  getOtpBtn.textContent = 'Send OTP to Email';
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

  // Subscribe newsletter
  const subscribeDiv = document.createElement('div');
  subscribeDiv.className = 'form-checkbox';
  const subscribeInput = document.createElement('input');
  subscribeInput.type = 'checkbox';
  subscribeInput.id = 'subscribe';
  subscribeInput.name = 'subscribe';
  const subscribeLabel = document.createElement('label');
  subscribeLabel.setAttribute('for', 'subscribe');
  subscribeLabel.textContent = 'Subscribe to newsletter';
  subscribeDiv.append(subscribeInput, subscribeLabel);

  // Agree to processing personal data
  const agreeDiv = document.createElement('div');
  agreeDiv.className = 'form-checkbox';
  const agreeInput = document.createElement('input');
  agreeInput.type = 'checkbox';
  agreeInput.id = 'agree';
  agreeInput.name = 'agree';
  agreeInput.required = true;
  const agreeLabel = document.createElement('label');
  agreeLabel.setAttribute('for', 'agree');
  agreeLabel.innerHTML = 'I agree to the processing of personal data*';
  agreeDiv.append(agreeInput, agreeLabel);

  // Start Quiz button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Start Quiz';
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  function updateSubmitState() {
    const allFilled = firstNameInput.value.trim()
    && lastNameInput.value.trim()
    && emailInput.validity.valid
    && agreeInput.checked
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

  [firstNameInput, lastNameInput, agreeInput, emailInput].forEach((el) => {
    el.addEventListener('input', () => {
      updateSubmitState();
      if (el === emailInput) {
        getOtpBtn.disabled = !emailInput.validity.valid;
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
      if (el === emailInput) {
        getOtpBtn.disabled = !emailInput.validity.valid;
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
    emailInput,
    otpWrapper,
    subscribeDiv,
    agreeDiv,
    submitBtn,
  );
  block.append(form);

  const questions = Array.from(document.querySelectorAll('.quiz-question'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.parentElement.classList.remove('active');
    if (questions[0]) questions[0].classList.add('active');
    console.log('Quiz started!');
  });
}

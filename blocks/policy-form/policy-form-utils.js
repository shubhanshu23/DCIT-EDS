import { createOtpComponent } from '../../scripts/scripts.js';

export default function decoratePolicy(formLoad, placeholders) {
  const createInput = (type, name, placeholder) => {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.required = true;
    return input;
  };
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');
  const policyInput = createInput('text', 'policy-number', `${placeholders.firstname}*`);
  const emailInput = createInput('email', 'email', `${placeholders.email}*`);
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.startQuiz}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');
  // OTP
  const otpComponent = createOtpComponent({
    correctOtp: '1234',
    onSuccess: () => {
      // eslint-disable-next-line no-use-before-define
      updateState();
    },
  });
  // eslint-disable-next-line object-curly-newline
  const { wrapper: otpWrapper, getOtpBtn, otpInputs, isOtpCorrect, showOtpBtn } = otpComponent;

  function updateState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpValid = isOtpCorrect();

    let isValid = emailInput.validity.valid
      && allOtpVisible
      && otpValid;

    if (formLoad === 'renewal') {
      isValid = emailInput.validity.valid
      && policyInput
      && allOtpVisible
      && otpValid;
    }

    submitBtn.disabled = !isValid;
  }

  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    if (emailInput.validity.valid) showOtpBtn();
    updateState();
  });

  if (formLoad === 'renewal') {
    form.append(policyInput, emailInput, otpWrapper, submitBtn);
  } else if (formLoad === 'rejoin') {
    form.append(emailInput, otpWrapper, submitBtn);
  }
  return form;
}

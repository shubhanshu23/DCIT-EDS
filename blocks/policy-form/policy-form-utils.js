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

  const policyInput = createInput('text', 'policy-number', `${placeholders.policyNumber || 'Policy Number'}*`);
  const emailInput = createInput('email', 'email', `${placeholders.email}*`);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = `${placeholders.submit}`;
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  // OTP
  const otpComponent = createOtpComponent({
    placeholders,
    correctOtp: '1234',
    // eslint-disable-next-line no-use-before-define
    onSuccess: () => updateState(),
  });

  // eslint-disable-next-line object-curly-newline
  const { wrapper: otpWrapper, getOtpBtn, otpInputs, isOtpCorrect, showOtpBtn } = otpComponent;

  function updateState() {
    const allOtpVisible = otpInputs[0].style.display !== 'none';
    const otpValid = isOtpCorrect();

    let isValid = emailInput.validity.valid && allOtpVisible && otpValid;

    if (formLoad === 'renew') {
      isValid = isValid && policyInput.value.trim() !== '';
    }

    submitBtn.disabled = !isValid;
    submitBtn.classList.toggle('disabled-btn', !isValid);
  }

  emailInput.addEventListener('input', () => {
    getOtpBtn.disabled = !emailInput.validity.valid;
    if (emailInput.validity.valid) showOtpBtn();
    updateState();
  });

  if (formLoad === 'renew') {
    policyInput.addEventListener('input', updateState);
    form.append(policyInput, emailInput, otpWrapper, submitBtn);
  } else {
    form.append(emailInput, otpWrapper, submitBtn);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent actual form submission
    const locale = document.querySelector('meta[name="locale"]')?.content || 'en';

    const policyNumber = policyInput?.value?.trim() || null;
    const email = emailInput.value.trim();

    // Here you can handle the form data, for example:
    console.log('Form Submitted:', {
      policyNumber,
      email,
    });
    window.location.href = `/${locale}/policy-renewal-survey`;
  });

  return form;
}

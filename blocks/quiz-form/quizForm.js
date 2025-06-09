export default async function decorate(block) {
  const cells = [...block.children];

  // Title
  if (cells[0]) {
    const titleText = cells[0].textContent.trim();
    if (titleText) {
      cells[0].innerHTML = `<h2>${titleText}</h2>`;
    } else {
      block.removeChild(cells[0]);
    }
  }

  // Description
  if (cells[1]) {
    const descText = cells[1].innerHTML.trim();
    if (descText) {
      if (!descText.startsWith('<')) {
        cells[1].innerHTML = `<p>${descText}</p>`;
      }
    } else {
      block.removeChild(cells[1]);
    }
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'quiz-form-error';
  errorDiv.style.display = 'none';
  block.append(errorDiv);

  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // First Name
  const firstNameInput = document.createElement('input');
  firstNameInput.type = 'text';
  firstNameInput.name = 'firstName';
  firstNameInput.placeholder = 'First Name';
  firstNameInput.required = true;

  // Last Name
  const lastNameInput = document.createElement('input');
  lastNameInput.type = 'text';
  lastNameInput.name = 'lastName';
  lastNameInput.placeholder = 'Last Name';
  lastNameInput.required = true;

  // Email
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Email*';
  emailInput.required = true;

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

  form.append(
    firstNameInput,
    lastNameInput,
    emailInput,
    subscribeDiv,
    agreeDiv,
    submitBtn
  );
  block.append(form);

  const showError = (msg) => {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!agreeInput.checked) {
      showError('You must agree to the processing of personal data.');
      return;
    }
    form.reset();
    alert('Quiz started!');
  });
}
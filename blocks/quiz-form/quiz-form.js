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

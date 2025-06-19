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

  // Phone Number
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.name = 'phone';
  phoneInput.placeholder = 'Phone Number*';
  phoneInput.required = true;
  phoneInput.pattern = '[0-9]{10,15}';

  // Email Address
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = 'Email Address*';
  emailInput.required = true;

  // Preferred Time Slot
  const timeSlotSelect = document.createElement('select');
  timeSlotSelect.name = 'preferredTimeSlot';
  timeSlotSelect.required = true;
  const timeSlots = [
    '20th June, 2024 - 10 A.M',
    '20th June, 2024 - 5 P.M',
    '21st June, 2024 - 10 A.M',
    '21st June, 2024 - 5 P.M',
  ];
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select Preferred Time Slot*';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  timeSlotSelect.appendChild(defaultOption);
  timeSlots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot;
    option.textContent = slot;
    timeSlotSelect.appendChild(option);
  });

  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Sign Up';

  form.append(
    firstNameInput,
    lastNameInput,
    phoneInput,
    emailInput,
    timeSlotSelect,
    submitBtn,
  );
  block.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Webinar signup submitted!');
  });
}

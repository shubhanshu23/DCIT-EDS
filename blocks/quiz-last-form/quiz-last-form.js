export default async function decorate(block) {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');

  // Job Title
  const jobInput = document.createElement('input');
  jobInput.type = 'text';
  jobInput.name = 'jobTitle';
  jobInput.placeholder = 'Job title*';
  jobInput.required = true;

  // Phone
  const phoneInput = document.createElement('input');
  phoneInput.type = 'text';
  phoneInput.name = 'phone';
  phoneInput.placeholder = 'Phone*';
  phoneInput.required = true;

  // Birthday
  const birthdayDiv = document.createElement('div');
  birthdayDiv.className = 'birthday-fields';

  const yearSelect = document.createElement('select');
  yearSelect.name = 'birthYear';
  yearSelect.required = true;
  const yearOption = document.createElement('option');
  yearOption.textContent = 'Year';
  yearOption.value = '';
  yearSelect.appendChild(yearOption);
  for (let y = new Date().getFullYear(); y >= 1920; y -= 1) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  const monthSelect = document.createElement('select');
  monthSelect.name = 'birthMonth';
  monthSelect.required = true;
  const monthOption = document.createElement('option');
  monthOption.textContent = 'Month';
  monthOption.value = '';
  monthSelect.appendChild(monthOption);
  for (let m = 1; m <= 12; m += 1) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    monthSelect.appendChild(opt);
  }

  const daySelect = document.createElement('select');
  daySelect.name = 'birthDay';
  daySelect.required = true;
  const dayOption = document.createElement('option');
  dayOption.textContent = 'Day';
  dayOption.value = '';
  daySelect.appendChild(dayOption);
  for (let d = 1; d <= 31; d += 1) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  const birthdayLabel = document.createElement('label');
  birthdayLabel.textContent = 'Birthday*';

  birthdayDiv.append(birthdayLabel, yearSelect, monthSelect, daySelect);

  // Street Address
  const addressInput = document.createElement('input');
  addressInput.type = 'text';
  addressInput.name = 'streetAddress';
  addressInput.placeholder = 'Street address*';
  addressInput.required = true;

  // See Result button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'See Result';

  form.append(
    jobInput,
    phoneInput,
    birthdayDiv,
    addressInput,
    submitBtn,
  );
  block.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.parentElement.classList.remove('active');
    form.parentElement.parentElement.nextSibling.children[0].classList.add('active');
    console.log('Form last submitted!');
  });
}

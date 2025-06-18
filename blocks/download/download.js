const fileViewer = (filename, url) => {
  const modal = document.getElementById('pdfModal');
  const closeBtn = document.querySelector('.close');
  const downloadBtn = document.getElementById('downloadBtn');
  const pdfViewer = document.getElementById('pdfViewer');
  const pdfUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${url}`;
  // const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  modal.style.display = 'block';
  pdfViewer.src = pdfUrl;

  closeBtn.onclick = () => {
    modal.style.display = 'none';
    pdfViewer.src = ''; // clear iframe to stop loading
    downloadBtn.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      pdfViewer.src = '';
      downloadBtn.style.display = 'none';
    }
  };

  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = filename;
    a.click();
  };
};

export default async function decorate(block) {
  const LanguageOneIndex = [0, 1];
  const LanguageTwoIndex = [2, 3];

  const LanguageOne = { path: '', lang: '' };
  const LanguageTwo = { path: '', lang: '' };

  await block.querySelectorAll(':scope > div').forEach((element, index) => {
    const path = element.querySelector('.button-container a')?.getAttribute('title') || '';
    const lang = [...element.querySelectorAll('p')]
      .find((p) => !p.querySelector('a'))
      ?.textContent.trim();
    if (LanguageOneIndex.includes(index)) {
      if (index === 0) LanguageOne.path = path;
      if (index === 1) LanguageOne.lang = lang;
    } else if (LanguageTwoIndex.includes(index)) {
      if (index === 2) LanguageTwo.path = path;
      if (index === 3) LanguageTwo.lang = lang;
    }
  });
  block.innerHTML = '';
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

  // --- Goal Dropdown ---
  const goalLabel = document.createElement('label');
  goalLabel.textContent = 'Select Your Goal:';

  const goalSelect = document.createElement('select');
  goalSelect.name = 'goal';
  goalSelect.required = true;

  const goals = ['Buy a car', 'Buy a house', "Plan for child's education"];
  goals.forEach((goal) => {
    const option = document.createElement('option');
    option.value = goal;
    option.textContent = goal;
    goalSelect.appendChild(option);
  });

  // --- Language Radio Group ---
  const langLabel = document.createElement('p');
  langLabel.textContent = 'Select Language:';

  const langOneLabel = document.createElement('label');
  const langOneRadio = document.createElement('input');
  langOneRadio.type = 'radio';
  langOneRadio.name = 'language';
  langOneRadio.value = 'one';
  langOneRadio.checked = true;
  langOneLabel.appendChild(langOneRadio);
  langOneLabel.append(` ${LanguageOne.lang.toUpperCase()}`);

  const langTwoLabel = document.createElement('label');
  const langTwoRadio = document.createElement('input');
  langTwoRadio.type = 'radio';
  langTwoRadio.name = 'language';
  langTwoRadio.value = 'two';
  langTwoLabel.appendChild(langTwoRadio);
  langTwoLabel.append(` ${LanguageTwo.lang.toUpperCase()}`);

  // --- Submit Button ---
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';

  // --- Append all ---
  form.appendChild(firstNameInput);
  form.appendChild(lastNameInput);
  form.appendChild(emailInput);
  form.appendChild(goalLabel);
  form.appendChild(document.createElement('br'));
  form.appendChild(goalSelect);
  form.appendChild(document.createElement('br'));
  form.appendChild(langLabel);
  form.appendChild(langOneLabel);
  form.appendChild(document.createElement('br'));
  form.appendChild(langTwoLabel);
  form.appendChild(document.createElement('br'));
  form.appendChild(submitBtn);

  // --- Handle Submit ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseUrl = 'https://publish-p156702-e1664409.adobeaemcloud.com';
    const selected = form.querySelector('input[name="language"]:checked')?.value;
    const selectedLang = selected === 'one' ? LanguageOne : LanguageTwo;
    const lastSegment = selectedLang.path.split('/').pop();

    console.log('Selected PDF Path:', selectedLang.path, lastSegment);

    fileViewer(`${lastSegment}.pdf`, `${baseUrl}${selectedLang.path}.pdf`);
  });

  // Add to page
  block.appendChild(form);
}

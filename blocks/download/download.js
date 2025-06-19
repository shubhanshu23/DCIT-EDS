const fileViewer = (filename, url) => {
  const modal = document.getElementById('pdfModal');
  const closeBtn = modal.querySelector('.close');
  const downloadBtn = modal.querySelector('#downloadBtn');
  const pdfViewer = modal.querySelector('#pdfViewer');

  const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;

  modal.style.display = 'block';
  pdfViewer.src = viewerUrl;

  const closeModal = () => {
    modal.style.display = 'none';
    pdfViewer.src = '';
    downloadBtn.style.display = 'none';
  };

  closeBtn.onclick = closeModal;
  window.onclick = (e) => e.target === modal && closeModal();

  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };
};

export default function decorate(block) {
  const LanguageOne = { path: '', lang: '' };
  const LanguageTwo = { path: '', lang: '' };

  const divs = Array.from(block.querySelectorAll(':scope > div'));
  LanguageOne.path = divs[0]?.querySelector('a')?.getAttribute('title') || '';
  LanguageOne.lang = divs[1]?.textContent.trim() || '';
  LanguageTwo.path = divs[2]?.querySelector('a')?.getAttribute('title') || '';
  LanguageTwo.lang = divs[3]?.textContent.trim() || '';

  // Clear block content
  block.innerHTML = '';

  // Create form
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '#';

  const createInput = (type, name, placeholder) => {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.required = true;
    return input;
  };

  // Goal dropdown
  const goalContainer = document.createElement('div');
  goalContainer.className = 'goal-container';

  const goalLabel = document.createElement('label');
  goalLabel.textContent = 'Select Your Goal:';
  goalLabel.setAttribute('for', 'goalSelect');

  const goalSelect = document.createElement('select');
  goalSelect.name = 'goal';
  goalSelect.id = 'goalSelect';
  goalSelect.className = 'goalSelect';
  goalSelect.required = true;

  const goals = ['Buy a car', 'Buy a house', "Plan for child's education"];
  goalSelect.appendChild(new Option('Choose a goal', '', true, true)).disabled = true;
  goals.forEach((goal) => goalSelect.appendChild(new Option(goal, goal)));

  goalContainer.append(goalLabel, goalSelect);

  // Language radio group
  const langContainer = document.createElement('div');
  langContainer.className = 'language-selection';
  langContainer.innerHTML = '<p>Select Language:</p>';

  const createRadio = (value, labelText, isChecked) => {
    const label = document.createElement('label');
    label.style.marginRight = '10px';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'language';
    radio.value = value;
    if (isChecked) radio.checked = true;
    label.append(radio, ` ${labelText}`);
    return label;
  };

  langContainer.append(
    createRadio('one', LanguageOne.lang.toUpperCase(), true),
    createRadio('two', LanguageTwo.lang.toUpperCase()),
  );

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';

  form.append(
    createInput('text', 'firstName', 'First Name*'),
    createInput('text', 'lastName', 'Last Name*'),
    createInput('email', 'email', 'Email*'),
    goalContainer,
    langContainer,
    document.createElement('br'),
    submitBtn,
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="language"]:checked')?.value;
    const selectedLang = selected === 'one' ? LanguageOne : LanguageTwo;
    const filename = `${selectedLang.path.split('/').pop()}.pdf`;
    const fullUrl = `https://publish-p156702-e1664409.adobeaemcloud.com${selectedLang.path}.pdf`;

    fileViewer(filename, fullUrl);
  });

  block.appendChild(form);
}

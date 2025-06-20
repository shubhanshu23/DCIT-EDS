import { getCookieConsentState, getCurrentPage } from '../../scripts/aem.js';
import { sendFormBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

const fileViewer = (filename, url) => {
  const modal = document.getElementById('pdfModal');
  const closeBtn = document.querySelector('.close');
  const downloadBtn = document.getElementById('downloadBtn');
  const pdfViewer = document.getElementById('pdfViewer');
  const pdfUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;

  modal.style.display = 'block';
  pdfViewer.src = pdfUrl;

  closeBtn.onclick = () => {
    modal.style.display = 'none';
    pdfViewer.src = '';
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
    a.href = url;
    a.download = filename;
    a.click();
  };
};

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  console.log(placeholders, 'placeholders download');
  const LanguageOne = { path: '', lang: '' };
  const LanguageTwo = { path: '', lang: '' };

  const items = Array.from(block.querySelectorAll(':scope > div'));
  if (items.length >= 4) {
    console.log(items[1]);
    LanguageOne.path = items[0].querySelector('a')?.getAttribute('title') || '';
    LanguageOne.lang = items[1].textContent.trim();
    LanguageTwo.path = items[2].querySelector('a')?.getAttribute('title') || '';
    LanguageTwo.lang = items[3].textContent.trim();
  }

  block.innerHTML = '';
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

  const firstNameInput = createInput('text', 'firstName', 'First Name*');
  const lastNameInput = createInput('text', 'lastName', 'Last Name*');
  const emailInput = createInput('email', 'email', 'Email*');

  // Goal Dropdown
  const goalContainer = document.createElement('div');
  goalContainer.className = 'goal-container';

  const goalLabel = document.createElement('label');
  goalLabel.textContent = 'Select Your Goal:';
  goalLabel.setAttribute('for', 'goalSelect');

  const goalSelect = document.createElement('select');
  goalSelect.name = 'goal';
  goalSelect.id = 'goalSelect';
  goalSelect.required = true;

  const goals = ['Buy a car', 'Buy a house', "Plan for child's education"];
  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Choose a goal';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  goalSelect.appendChild(defaultOption);
  goals.forEach((g) => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    goalSelect.appendChild(opt);
  });

  goalContainer.appendChild(goalLabel);
  goalContainer.appendChild(goalSelect);

  // Language Radios
  const langContainer = document.createElement('div');
  langContainer.className = 'language-selection';
  const langLabel = document.createElement('p');
  langLabel.textContent = 'Select Language:';
  langContainer.appendChild(langLabel);

  const createRadio = (val, labelText, checked = false) => {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'language';
    radio.value = val;
    radio.checked = checked;
    label.appendChild(radio);
    label.append(` ${labelText}`);
    label.style.marginRight = '10px';
    return label;
  };

  langContainer.appendChild(createRadio('one', LanguageOne.lang.toUpperCase(), true));
  langContainer.appendChild(createRadio('two', LanguageTwo.lang.toUpperCase()));

  // Submit Button
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';

  // Append all to form
  [firstNameInput, lastNameInput, emailInput, goalContainer, langContainer, document.createElement('br'), submitBtn]
    .forEach((el) => form.appendChild(el));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selected = form.querySelector('input[name="language"]:checked')?.value;
    const selectedLang = selected === 'one' ? LanguageOne : LanguageTwo;
    const baseUrl = 'https://publish-p156702-e1664409.adobeaemcloud.com';
    const lastSegment = selectedLang.path.split('/').pop();
    const fullUrl = `${baseUrl}${selectedLang.path}.pdf`;

    const formData = {
      page : getCurrentPage(),
      timestamp: new Date().toISOString(),
      cookieConsentAccepted: getCookieConsentState(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      goal: goalSelect.value,
      language: form.querySelector('input[name="language"]:checked')?.parentElement?.innerText.trim(),
      pdf: fullUrl
    };
    sendFormBeacon(formData, 'download');
    fileViewer(`${lastSegment}.pdf`, fullUrl);
  });

  block.appendChild(form);
}

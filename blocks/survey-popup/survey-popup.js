import { surveyForm } from '../survey/survey.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

async function showLeaveUsModal(title, happyContent, sadContent) {
  const placeholders = await fetchPlaceholdersForLocale();

  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal');
  modalOverlay.classList.add('survey-modal');
  modalOverlay.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';

  closeBtn.addEventListener('click', () => {
    modalOverlay.remove();
    localStorage.setItem('surveyModalDismissed', Date.now().toString());
  });

  if (title) {
    const titleElem = document.createElement('h2');
    titleElem.textContent = title;
    titleElem.classList.add('modal-title');
    modalContent.appendChild(titleElem);
  }

  // Append close button
  modalContent.appendChild(closeBtn);

  // Directly append form (no .then, because it's not a Promise)
  const form = await surveyForm(placeholders, true, happyContent, sadContent);
  modalContent.appendChild(form);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// Show modal if not seen for X hours
export function triggerModalOnInactivity(hours = 24, title = 'Survey Form', happyContent = null, sadContent = null) {
  const lastSeen = localStorage.getItem('surveyModalDismissed');
  const now = Date.now();

  if (!lastSeen || now - Number(lastSeen) > hours * 60 * 60 * 1000) {
    setTimeout(() => showLeaveUsModal(title, happyContent, sadContent), 5000);
  }
}

export default async function decorate(block) {
  const title = block.querySelector('p')?.textContent;
  const innerDivs = block.querySelectorAll(':scope > div > div');
  const happyMessageDiv = innerDivs[1]?.cloneNode(true);
  const sadMessageDiv = innerDivs[2]?.cloneNode(true);

  triggerModalOnInactivity(24, title, happyMessageDiv, sadMessageDiv);
  block.innerHTML = '';
}

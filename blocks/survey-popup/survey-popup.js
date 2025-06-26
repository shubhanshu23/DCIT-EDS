import { surveyForm } from '../survey/survey.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

async function showLeaveUsModal(title) {
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
  const form = await surveyForm(placeholders, true);
  modalContent.appendChild(form);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// Show modal if not seen for X hours
export function triggerModalOnInactivity(hours = 24, title = 'Survey Form') {
  const lastSeen = localStorage.getItem('surveyModalDismissed');
  const now = Date.now();

  if (!lastSeen || now - Number(lastSeen) > hours * 60 * 60 * 1000) {
    setTimeout(() => showLeaveUsModal(title), 5000); // Show modal 5s after page load
  }
}

export default async function decorate(block) {
  const title = block.querySelector('p')?.textContent;
  triggerModalOnInactivity(24, title);
  block.innerHTML = '';
}

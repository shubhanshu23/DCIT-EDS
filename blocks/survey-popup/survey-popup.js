import { surveyForm as createSurveyForm } from '../survey/survey.js';

function showLeaveUsModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal');
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

  modalContent.appendChild(closeBtn);

  createSurveyForm().then((form) => {
    modalContent.appendChild(form);
  });

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// Show modal if not seen for X hours
export function triggerModalOnInactivity(hours = 24) {
  const lastSeen = localStorage.getItem('surveyModalDismissed');
  const now = Date.now();

  if (!lastSeen || now - Number(lastSeen) > hours * 60 * 60 * 1000) {
    setTimeout(showLeaveUsModal, 5000); // delay modal load after page load
  }
}

export default async function decorate(block) {
  triggerModalOnInactivity(24);
  console.log(block, 'block');
}

let lastScore = null;
export default async function decorate(block) {
  const cells = [...block.children];

  // Extract question and options from cells
  const questionCell = cells[0];
  const optionsCells = cells.slice(1);

  // Create question element
  const questionElement = document.createElement('p');
  if (questionCell) {
    const questionText = questionCell.textContent.trim();
    questionElement.textContent = questionText;
  } else {
    block.removeChild(cells[0]);
  }

  // options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'quiz-options';

  optionsCells.forEach((cell) => {
    const optionText = cell.textContent.trim();
    const optionButton = document.createElement('button');
    optionButton.className = 'quiz-option';
    optionButton.textContent = optionText;

    optionButton.addEventListener('click', () => {
      Array.from(optionButton.parentElement.children).forEach((btn) => {
        btn.classList.remove('selected');
      });

      // Mark current option as selected
      optionButton.classList.add('selected');
      optionButton.parentElement.parentElement.classList.remove('active');
      optionButton.parentElement.parentElement.parentElement.nextSibling.children[0].classList.add('active');

      const allQuizOptions = document.querySelectorAll('.quiz-options');
      const isLast = optionButton.parentElement === allQuizOptions[allQuizOptions.length - 1];
      if (isLast) {
        let correctCount = 0;
        const quizTotalMarks = document.querySelectorAll('.quiz-options').length;

        document.querySelectorAll('.quiz-options').forEach((container) => {
          const selected = Array.from(container.children).find((el) => el.classList.contains('selected'));
          if (selected) {
            const correctInput = container.parentElement.querySelector('.correct-answer');
            if (correctInput) {
              const isCorrect = selected.textContent.trim() === correctInput.value.trim();
              if (isCorrect) correctCount += 1;
            }
            console.log(selected.textContent);
          }
        });
        lastScore = `${correctCount}/${quizTotalMarks}`;
        console.log(`Score: ${correctCount}/${quizTotalMarks}`);
      }
    });

    optionsContainer.appendChild(optionButton);
  });

  // Create "Go back" link
  const goBackLink = document.createElement('a');
  goBackLink.href = '#';
  goBackLink.textContent = 'Go back';
  goBackLink.className = 'go-back';
  goBackLink.addEventListener('click', (e) => {
    e.preventDefault();
    goBackLink.parentElement.classList.remove('active');
    goBackLink.parentElement.parentElement.previousElementSibling.children[0].classList.add('active');
  });

  // hidden input with textContent of last cell
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.className = 'correct-answer';
  hiddenInput.value = cells[cells.length - 1]?.textContent?.trim() || '';

  // Append elements to block
  block.innerHTML = '';
  block.appendChild(questionElement);
  block.appendChild(optionsContainer);
  block.appendChild(goBackLink);
  block.appendChild(hiddenInput);
}

export function getLastScore() {
  return lastScore;
}


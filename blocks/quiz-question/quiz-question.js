export default async function decorate(block) {
  const questionBlock = document.createElement('div');
  questionBlock.className = 'quiz-question-block';

  // Render the question
  const questionText = block.dataset.question || 'Default Question';
  const questionElement = document.createElement('div');
  questionElement.className = 'quiz-question-text';
  questionElement.textContent = questionText;
  questionBlock.appendChild(questionElement);

  // Render the options
  const options = block.dataset.options ? JSON.parse(block.dataset.options) : [];
  options.forEach((option) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'quiz-option';
    optionElement.textContent = option;
    questionBlock.appendChild(optionElement);
  });

  // Append the question block to the main block
  block.innerHTML = ''; //
  block.appendChild(questionBlock);
}

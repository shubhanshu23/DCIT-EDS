import { getLastScore } from '../quiz-question/quiz-question.js';

const score = getLastScore();

export default async function decorate(block) {
  const cells = [...block.children];

  const title = cells[0].textContent.trim();
  const description = cells[1].textContent.trim();
  const buttonText = cells[2].textContent.trim();

  // Title
  const titleElem = document.createElement('h2');
  titleElem.textContent = title;

  // Description
  const descElem = document.createElement('p');
  descElem.textContent = description;

  // Score
  const scoreElem = document.createElement('div');
  scoreElem.className = 'quiz-score-value';
  scoreElem.innerHTML = `<span>Score: <b class="quiz-last-score--event">${score}</b></span>`;

  // Button
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.className = 'quiz-score-btn';

  block.innerHTML = '';
  block.append(titleElem, descElem, scoreElem, button);
}

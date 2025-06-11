export default async function decorate(block) {
  const cells = [...block.children];

  // Extract question and options from cells
  const questionCell = cells[0];
  const optionsCells = cells.slice(1);

  // Create question element
  const questionElement = document.createElement("p");
  if (questionCell) {
    const questionText = questionCell.textContent.trim();
    questionElement.textContent = questionText;
  } else {
    block.removeChild(cells[0]);
  }

  // options container
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "quiz-options";

  optionsCells.forEach((cell) => {
    const optionText = cell.textContent.trim();
    const optionButton = document.createElement("button");
    optionButton.className = "quiz-option";
    optionButton.textContent = optionText;

    optionButton.addEventListener("click", () => {
      Array.from(optionButton.parentElement.children).forEach((btn) => {
        btn.classList.remove("selected");
      });

      // Mark current option as selected
      optionButton.classList.add("selected");
    });

    optionsContainer.appendChild(optionButton);
  });

  // Create "Go back" link
  const goBackLink = document.createElement("a");
  goBackLink.href = "#";
  goBackLink.textContent = "Go back";
  goBackLink.className = "go-back";

  // Append elements to block
  block.innerHTML = ""; // Clear existing content
  block.appendChild(questionElement);
  block.appendChild(optionsContainer);
  block.appendChild(goBackLink);
}
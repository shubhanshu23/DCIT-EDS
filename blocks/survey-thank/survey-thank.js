export default function decorate(block) {
  // Get the "happy" param from the URL
  const params = new URLSearchParams(window.location.search);
  const isHappy = params.get('happy');

  // Handle missing or invalid value
  if (isHappy !== 'true' && isHappy !== 'false') {
    block.innerHTML = '<p>Thank you for your response.</p>';
    return;
  }

  // Get the two message divs
  const successDiv = block.children[0];
  const improveDiv = block.children[1];

  // Hide both by default
  successDiv.style.display = 'none';
  improveDiv.style.display = 'none';

  // Show based on happy value
  if (isHappy === 'true') {
    successDiv.style.display = 'block';
  } else {
    improveDiv.style.display = 'block';
  }
}

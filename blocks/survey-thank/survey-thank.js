export default function decorate(block) {
  // Get the rating from the URL
  const params = new URLSearchParams(window.location.search);
  const rating = Number(params.get('rating'));

  // Handle missing or invalid rating
  if (Number.isNaN(rating)) {
    block.innerHTML = '<p>Thank you for your response.</p>';
    return;
  }

  // Get the two message divs
  const successDiv = block.children[0];
  const improveDiv = block.children[1];

  // Hide both by default
  successDiv.style.display = 'none';
  improveDiv.style.display = 'none';

  // Show based on rating value
  if (rating > 3) {
    successDiv.style.display = 'block';
  } else {
    improveDiv.style.display = 'block';
  }
}

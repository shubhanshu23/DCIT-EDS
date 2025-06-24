export default function decorateRating(fieldDiv, fieldJson = {}) {
  const input = fieldDiv.querySelector('input[type="number"]');
  const enabled = fieldJson?.enabled !== false;
  const readOnly = fieldJson?.readOnly === true;

  let max = parseInt(input.getAttribute('max'), 10);
  if (Number.isNaN(max) || max <= 0) {
    max = 5;
  }

  const ratingDiv = document.createElement('div');
  ratingDiv.classList.add('rating');

  if (!enabled || readOnly) {
    ratingDiv.classList.add('disabled');
  }

  const emoji = document.createElement('span');
  emoji.classList.add('emoji');

  // Helper: update selected state
  function updateSelected(value) {
    for (let j = 0; j < max; j += 1) {
      const star = ratingDiv.children[j];
      if (j < value) {
        star.classList.add('selected');
        star.textContent = '★';
      } else {
        star.classList.remove('selected');
        star.textContent = '☆';
      }
    }
    emoji.textContent = value <= 3 ? '😢' : '😊';
  }

  // Create stars
  for (let i = 1; i <= max; i += 1) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.setAttribute('data-value', i);
    star.textContent = '☆'; // Unselected by default

    if (enabled && !readOnly) {
      star.addEventListener('click', () => {
        input.value = i;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        updateSelected(i);
      });

      star.addEventListener('mouseover', () => {
        for (let j = 0; j < max; j += 1) {
          const s = ratingDiv.children[j];
          if (j < i) {
            s.classList.add('hover');
            s.textContent = '★';
          } else {
            s.classList.remove('hover');
            s.textContent = '☆';
          }
        }
        emoji.textContent = i <= 3 ? '😢' : '😊';
      });
    }

    ratingDiv.appendChild(star);
  }

  ratingDiv.appendChild(emoji);

  // Remove hover effect on mouse leave
  ratingDiv.addEventListener('mouseleave', () => {
    if (!enabled || readOnly) return;

    const selectedVal = parseInt(input.value, 10);
    updateSelected(selectedVal || 0);
  });

  // Handle initial value
  const initialValue = parseInt(input.value, 10);
  if (!Number.isNaN(initialValue)) {
    updateSelected(initialValue);
  }

  input.style.display = 'none';
  fieldDiv.appendChild(ratingDiv);

  const helpText = fieldDiv.querySelector('.field-description');
  if (helpText) {
    fieldDiv.append(helpText);
  }

  return fieldDiv;
}

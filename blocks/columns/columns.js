export default function decorate(block) {
  const columns = [...block.firstElementChild.children];
  block.classList.add(`columns-${columns.length}-cols`);

  // Handle image-only columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const picture = col.querySelector('picture');
      if (picture) {
        const wrapper = picture.closest('div');
        if (wrapper && wrapper.children.length === 1) {
          wrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  const planSection = document.querySelector('.plans-section');
  if (planSection) {
    const locale = document.querySelector('meta[name="locale"]')?.content || 'en';
    const buttons = planSection.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const container = button.closest('div');
        const heading = container?.querySelector('h4');
        if (heading) {
          const plan = heading.textContent.trim();
          sessionStorage.setItem('plan', plan);
          sessionStorage.setItem('premium', button.getAttribute('title') || '');
          window.location.href = `/${locale}/insurance-signup`;
        }
      });
    });
  }
}

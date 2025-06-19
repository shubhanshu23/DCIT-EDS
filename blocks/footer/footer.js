import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */

function waitForElement(parent, selector, callback) {
  const element = parent.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  const observer = new MutationObserver(() => {
    const el = parent.querySelector(selector);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });

  observer.observe(parent, { childList: true, subtree: true });
}

export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);

  waitForElement(block, '.consent-screen', (consentScreen) => {
    if (consentScreen && localStorage.getItem('dcit_ca') == null) {
      consentScreen.style.display = 'flex';
      const acceptBtn = consentScreen.querySelector('.button[href="#acceptcookies"]');
      const denyBtn = consentScreen.querySelector('.button[href="#denycookies"]');
      acceptBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        consentScreen.style.display = 'none';
        localStorage.setItem('dcit_ca', 'true');
      });
      denyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        consentScreen.style.display = 'none';
        localStorage.setItem('dcit_ca', 'false');
      });
    }
  });

  // Use observer to wait for .footer-nav
  waitForElement(block, '.footer-nav .default-content-wrapper li span.icon', (liIcon) => {
    const wrapper = liIcon.closest('.default-content-wrapper');
    if (wrapper) {
      wrapper.classList.add('social-icon-widgets');
    }
  });
}

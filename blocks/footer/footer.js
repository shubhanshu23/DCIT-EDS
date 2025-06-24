import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { sendCookieConsentBeacon, sendPageBeacon } from '../../scripts/datalayer.js';

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
  const footerMeta = getMetadata('locale');
  // eslint-disable-next-line prefer-template
  const footerPath = (footerMeta ? '/' + footerMeta : '') + '/footer';
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
        sendCookieConsentBeacon(true);
      });
      denyBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        consentScreen.style.display = 'none';
        localStorage.setItem('dcit_ca', 'false');
        sendCookieConsentBeacon(false);
      });
    }
    sendPageBeacon();
  });

  waitForElement(block, '.language-switcher', (languageSwitcher) => {
    if (languageSwitcher) {
      const expander = languageSwitcher.querySelector('.default-content-wrapper > p > span.icon.icon-language');
      expander?.addEventListener('click', (e) => {
        e.preventDefault();
        const wrapper = languageSwitcher.querySelectorAll('p.button-container');
        wrapper?.forEach((wrap) => {
          wrap.classList.toggle('active');
        });
      });

      const languages = languageSwitcher.querySelectorAll('.default-content-wrapper > p.button-container > a');
      languages.forEach((lang) => {
        lang.addEventListener('click', (e) => {
          e.preventDefault();
          const currentPath = window.location.pathname;
          const langHref = lang.getAttribute('href');
          if (langHref && !currentPath.startsWith(langHref)) {
            const newUrl = window.location.origin + langHref + window.location.pathname.substring(4)
              + window.location.search + window.location.hash;
            window.location.href = newUrl;
          } else {
            window.location.reload();
          }
        });
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

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

const getUsernameFromCookie = () => {
  const cookies = document.cookie.split(';');
  const userCookie = cookies.find((cookie) => cookie.trim().startsWith('dcit_username='));
  if (userCookie) {
    return userCookie.split('=')[1];
  }
  return null;
};

const checkLoginCookie = () => {
  const username = getUsernameFromCookie();
  return !!username;
};

// function closeOnEscape(e) {
//   if (e.code === 'Escape') {
//     const nav = document.getElementById('nav');
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections);
//       navSectionExpanded.focus();
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections);
//       nav.querySelector('button').focus();
//     }
//   }
// }

// function closeOnFocusLost(e) {
//   const nav = e.currentTarget;
//   if (!nav.contains(e.relatedTarget)) {
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections, false);
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections, false);
//     }
//   }
// }

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  navSections.querySelectorAll('li.nav-drop').forEach((li) => {
    const toggleLink = li.querySelector('.button-container > a[href="#"]');

    if (!toggleLink) return;

    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();

      // Don't toggle if clicked inside a nested header-level-three
      if (e.target.closest('.header-level-three')) return;

      // Toggle open class on current item, and close others
      const isOpen = li.classList.contains('open');

      document.querySelectorAll('li.nav-drop').forEach((other) => {
        other.classList.remove('open');
      });

      if (!isOpen) {
        li.classList.add('open');
      }
    });
  });

  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  // if (!expanded || isDesktop.matches) {
  //   // collapse menu on escape press
  //   window.addEventListener('keydown', closeOnEscape);
  //   // collapse menu on focus lost
  //   nav.addEventListener('focusout', closeOnFocusLost);
  // } else {
  //   window.removeEventListener('keydown', closeOnEscape);
  //   nav.removeEventListener('focusout', closeOnFocusLost);
  // }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelector(':scope .default-content-wrapper > ul')?.classList?.add('header-level-one');
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      const levelTwoUl = navSection.querySelector(':scope > ul');
      const divContainer = document.createElement('div');
      divContainer.classList.add('header-submenu-container');
      if (levelTwoUl) {
        navSection.classList.add('nav-drop');
        levelTwoUl.classList.add('header-level-two');
        levelTwoUl.querySelectorAll(':scope > li > ul').forEach((levelThreeUl) => {
          levelThreeUl.classList.add('header-level-three');
        });
        levelTwoUl.parentNode.replaceChild(divContainer, levelTwoUl);
        divContainer.appendChild(levelTwoUl);
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // toggleMenu(nav, navSections, false);
  // isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, false));
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  if (checkLoginCookie()) {
    const navTools = nav.querySelector('.nav-tools');
    if (navTools) {
      const uname = getUsernameFromCookie();
      const unameDiv = document.createElement('div');
      unameDiv.className = 'nav-username';
      unameDiv.textContent = uname ? `Welcome, ${uname}` : '';
      unameDiv.style.fontWeight = 'bold';
      navTools.prepend(unameDiv);
      const links = navTools.querySelectorAll('li a');
      if (links.length > 0) {
        links.forEach((link) => {
          if (link?.getAttribute('href') === '/login') {
            link.remove();
          }
        });
      }
    }
  } else {
    const loginLink = nav.querySelector('.nav-tools a[href="#logout"]');
    if (loginLink) {
      loginLink.remove();
    }
  }

  const logoutBtn = nav.querySelector('.nav-tools a[href="#logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.cookie = 'dcit_username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      window.location.href = '/';
    });
  }
}

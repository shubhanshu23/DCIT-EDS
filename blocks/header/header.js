import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

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
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
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
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
//      navSection.addEventListener('click', () => {
//        if (isDesktop.matches) {
//          const expanded = navSection.getAttribute('aria-expanded') === 'true';
//          toggleAllNavSections(navSections);
//          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//        }
//      });
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
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  /* ─────────────────────────────────────────────────────────────
     4 — mega-menu overlay, hover + click listeners
  ───────────────────────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.append(overlay);

  const megaWrapper = document.createElement('div');
  megaWrapper.className = 'mega-wrapper';
  nav.after(megaWrapper);

  /* helper functions */
  function buildMega(drop) {
    if (megaWrapper.dataset.loaded === drop.dataset.key) return; // cached
    megaWrapper.innerHTML = '';

    const col = document.createElement('div');
    col.className = 'column';

    drop.querySelectorAll(':scope > ul > li').forEach((li) => {
      const slot = document.createElement('div');
      slot.innerHTML = li.innerHTML;         // move—not clone—contents
      col.append(slot);
    });

    megaWrapper.append(col);
    megaWrapper.dataset.loaded = drop.dataset.key;
  }

  function openMega(drop) {
    buildMega(drop);
    overlay.classList.add('active');
    megaWrapper.classList.add('open');
    toggleAllNavSections(navSections, false);      // collapse others
    drop.setAttribute('aria-expanded', 'true');
    megaWrapper.dataset.activeKey = drop.dataset.key;
  }

  function closeMega() {
    overlay.classList.remove('active');
    megaWrapper.classList.remove('open');
    toggleAllNavSections(navSections, false);
    delete megaWrapper.dataset.activeKey;
  }

  /* wire every top-level item */
  const navDrops = nav.querySelectorAll('.nav-sections .nav-drop');
  navDrops.forEach((drop, idx) => {
    drop.dataset.key = idx;

    /* — open on hover (desktop only) — */
    drop.addEventListener('mouseenter', () => {
      if (isDesktop.matches) openMega(drop);
    });

    /* — open/close on click (desktop only) — */
    drop.addEventListener('click', (e) => {
      if (!isDesktop.matches) return;        // keep mobile tap behaviour
      e.preventDefault();                    // stop link jump

      const same = megaWrapper.dataset.activeKey === drop.dataset.key;
      if (same && megaWrapper.classList.contains('open')) {
        closeMega();                         // second click → close
      } else {
        openMega(drop);                      // first click → open
      }
    });
  });

  /* keep panel open while pointer is inside it */
  megaWrapper.addEventListener('mouseleave', closeMega);

  /* global dismiss actions */
  overlay.addEventListener('click', closeMega);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMega();
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
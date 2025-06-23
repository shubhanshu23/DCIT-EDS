import { getCookieConsentState } from './aem.js';

/* eslint-disable prefer-const */
function sendPageBeacon() {
  window.dcitDataLayer = window.dcitDataLayer || [];
  const metadata = {};
  Array.from(document.getElementsByTagName('meta')).forEach((meta) => {
    const nameAttr = meta.getAttribute('name');
    const propertyAttr = meta.getAttribute('property');
    const httpEquivAttr = meta.getAttribute('http-equiv');
    const content = meta.getAttribute('content');
    const key = nameAttr || propertyAttr || httpEquivAttr;
    if (key && content) {
      // Use dot notation only if key is a valid JS identifier
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
        metadata[key] = content;
      } else {
        metadata[key] = content; // fallback for keys like 'og:title'
      }
    }
  });
  metadata.title = document.title || 'Default Title';
  window.dcitDataLayer.push({
    event: 'page-load',
    eventInfo: {
      page: metadata
    },
  });
}

function sendAuthInfoBeacon(user = null, state = null) {
  if (user) {
    let details = {};
    ['name', 'email', 'phone', 'location'].forEach((key) => {
      if (user[key]) {
        details[key] = user[key];
      }
    });
    details.state = state || 'n/a';
    window.dcitDataLayer.push({
      event: 'user-authentication',
      eventInfo: {
        eventType: state || 'n/a',
        timestamp: new Date().toISOString(),
        cookieConsentAccepted: getCookieConsentState(),
        details,
      },
    });
    console.log(window.dcitDataLayer)
  }
}

function sendCookieConsentBeacon(accepted = "false") {
  const metaOgUrl = document.querySelector('meta[property="og:url"]');
  const page = metaOgUrl ? metaOgUrl.getAttribute('content') : window.location.href;
  window.dcitDataLayer.push({
    event: 'cookie-consent',
    eventInfo: {
      page,
      timestamp: new Date().toISOString(),
    },
    consent: {
      accepted,
    },
  });
}

function sendFormBeacon(eventInfo = {}, event = null) {
  if (event) {
    window.dcitDataLayer.push({
      event,
      eventInfo,
    });
    console.log(window.dcitDataLayer);
  }
}

// eslint-disable-next-line object-curly-newline
export { sendPageBeacon, sendAuthInfoBeacon, sendCookieConsentBeacon, sendFormBeacon };

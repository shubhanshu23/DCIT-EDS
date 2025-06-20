import { getCookieConsentState } from './aem.js';

/* eslint-disable prefer-const */
function sendPageBeacon() {
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
  window.adobeDataLayer.push({
    page: metadata,
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
    window.adobeDataLayer.push({
      event: 'user-authentication',
      eventInfo: {
        eventType: state || 'n/a',
        timestamp: new Date().toISOString(),
        cookieConsentAccepted: getCookieConsentState(),
        details,
      },
    });
  }
}

function sendCookieConsentBeacon(accepted = false) {
  const metaOgUrl = document.querySelector('meta[property="og:url"]');
  const page = metaOgUrl ? metaOgUrl.getAttribute('content') : window.location.href;
  window.adobeDataLayer.push({
    event: 'cookie-consent',
    eventInfo: {
      page,
      timestamp: new Date().toISOString(),
    },
    consent: {
      accepted: !!accepted,
    },
  });
}

function sendFormBeacon(eventInfo = {}, event = null) {
  if (event) {
    window.adobeDataLayer.push({
      event,
      eventInfo,
    });
  }
}

// eslint-disable-next-line object-curly-newline
export { sendPageBeacon, sendAuthInfoBeacon, sendCookieConsentBeacon, sendFormBeacon };

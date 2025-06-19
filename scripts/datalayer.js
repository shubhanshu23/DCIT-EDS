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
        ['name', 'email', 'phone', 'location'].forEach(key => {
            if (user[key]) {
                details[key] = user[key];
            }
        });
        details.state = state || 'n/a';
        window.adobeDataLayer.push({
            event: "user-authentication",
            eventInfo: {
                eventType: state || 'n/a',
                timestamp: new Date().toISOString()
            },
            user: details
        });
    }
}

export { sendPageBeacon, sendAuthInfoBeacon };

const PREMIUM_PATHNAME = '/i/premium';
const ACTIVE_CLASS = 'premium-colors-active';

function togglePremiumStyles() {
  const body = document.body;
  if (window.location.pathname.startsWith(PREMIUM_PATHNAME)) {
    body.classList.add(ACTIVE_CLASS);
  } else {
    body.classList.remove(ACTIVE_CLASS);
  }
}

function init() {
    // Initial check
    togglePremiumStyles();

    // Twitter/X is a SPA. We need to listen for navigation changes.
    // A MutationObserver on the <title> is a decent way to catch route changes.
    const observer = new MutationObserver(() => {
        // Using a small timeout to ensure the DOM has settled after navigation.
        setTimeout(togglePremiumStyles, 100);
    });

    const head = document.querySelector('head');
    if (head) {
        const title = head.querySelector('title');
        if (title) {
            observer.observe(title, { childList: true });
        } else {
            // if title is not there yet, observe head for it to be added
            const headObserver = new MutationObserver((mutations, obs) => {
                const title = head.querySelector('title');
                if (title) {
                    observer.observe(title, { childList: true });
                    obs.disconnect();
                }
            });
            headObserver.observe(head, { childList: true, subtree: true });
        }
    }


    // For more robustness, we can also wrap history.pushState and listen to popstate.
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
    originalPushState.apply(this, args);
    togglePremiumStyles();
    };

    window.addEventListener('popstate', togglePremiumStyles);
}


// The DOM may not be fully loaded when the script is injected,
// so we'll wait for the body to be present.
if (document.body) {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

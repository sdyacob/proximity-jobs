// content.js - ProximityJobs Content Script

console.log("ProximityJobs: Content Script Loaded");

// MutationObserver to watch for dynamic job card renders
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Find job cards and inject badges
            // This is a simplified selector strategy. Actual implementation will need site-specific parsers
            const jobCards = document.querySelectorAll('.job-card-container, .slider_container, .job-search-card');
            jobCards.forEach(card => processJobCard(card));
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

function processJobCard(card) {
    if (card.dataset.proximityProcessed) return;
    card.dataset.proximityProcessed = "true";

    // Dummy extraction
    const locationTextElement = card.querySelector('.job-card-container__metadata-item, .companyLocation, .locWdth');
    if (locationTextElement) {
        const locationName = locationTextElement.innerText;

        // Inject Shadow DOM for styling isolation
        const badgeWrapper = document.createElement('div');
        badgeWrapper.className = 'pj-badge-wrapper';

        // Using Shadow DOM
        const shadowRoot = badgeWrapper.attachShadow({ mode: 'open' });

        // Initial loading state
        shadowRoot.innerHTML = `
      <style>
        .badge {
          display: inline-flex;
          align-items: center;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: system-ui;
          color: #4b5563;
          margin-top: 8px;
        }
        .badge.calculating {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        /* PRD 6.2 Misery Colors */
        .misery-easy { background: #dcfce7; color: #166534; }  /* Green */
        .misery-mod { background: #fef3c7; color: #92400e; }   /* Amber */
        .misery-pain { background: #fee2e2; color: #991b1b; }  /* Red */
      </style>
      <div class="badge calculating">📍 Calculating commute...</div>
    `;

        card.appendChild(badgeWrapper);

        // Call background to calculate commute
        chrome.runtime.sendMessage({ action: 'calculateCommute', location: locationName }, (response) => {
            if (response && response.success) {
                let miseryClass = 'misery-easy';
                if (response.commute.miseryScore > 6) miseryClass = 'misery-pain';
                else if (response.commute.miseryScore > 3) miseryClass = 'misery-mod';

                shadowRoot.innerHTML = `
          <style>
            .badge {
              display: inline-flex;
              align-items: center;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-family: system-ui;
              margin-top: 8px;
              font-weight: 500;
            }
            .misery-easy { background: #dcfce7; color: #166534; }  /* Green */
            .misery-mod { background: #fef3c7; color: #92400e; }   /* Amber */
            .misery-pain { background: #fee2e2; color: #991b1b; }  /* Red */
          </style>
          <div class="badge ${miseryClass}" title="Misery Score: ${response.commute.miseryScore}">
            🚗 ${response.commute.timeText}
          </div>
        `;
            }
        });
    }
}

// popup.js - Handles the logic for the ProximityJobs extension popup

document.addEventListener('DOMContentLoaded', () => {
    const radiusSlider = document.getElementById('radius-slider');
    const radiusVal = document.getElementById('radius-val');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // Load previous state
    chrome.storage.local.get(['radius', 'mode'], (result) => {
        if (result.radius) {
            radiusSlider.value = result.radius;
            radiusVal.textContent = result.radius + ' km';
        }
        if (result.mode) {
            modeBtns.forEach(btn => {
                if (btn.dataset.mode === result.mode) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });

    // Handle radius changes
    radiusSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        radiusVal.textContent = val + ' km';

        // Save to storage
        chrome.storage.local.set({ radius: val }, () => {
            // Notify active tab to re-evaluate jobs
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'radiusChanged',
                        radius: val
                    });
                }
            });
        });
    });

    // Handle mode toggle (Driving vs Transit) Setup for Phase 1B
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const mode = e.target.dataset.mode;

            // Save and broadcast
            chrome.storage.local.set({ mode: mode }, () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'modeChanged',
                            mode: mode
                        });
                    }
                });
            });
        });
    });
});

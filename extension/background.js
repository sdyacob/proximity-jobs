// background.js - Service Worker for ProximityJobs Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('ProximityJobs Extension installed.');
});

// Listener for messages from content scripts (e.g., geocoding, commute times)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'geocodeLocation') {
        // Phase 1B/2C: Geocoding via FastAPI proxy or Google Maps API
        // For now, return mock data
        const mockCoordinates = { lat: 12.9716, lng: 80.2496 }; // Chennai
        sendResponse({ success: true, coords: mockCoordinates });
    } else if (request.action === 'calculateCommute') {
        // Phase 1B: Call Distance Matrix API (Simulated for initial build here)
        const mode = request.mode || 'driving';
        // Dummy api call simulator
        const peak_commute_minutes = Math.floor(Math.random() * 90) + 15; // 15 to 105 mins
        const transit_transfers = mode === 'transit' ? Math.floor(Math.random() * 3) : 1;

        // Formula: Misery = (peak_commute_minutes / 60) x transit_transfers x 1.2
        let miseryScore = (peak_commute_minutes / 60.0) * transit_transfers * 1.2;
        miseryScore = Math.min(miseryScore, 10.0).toFixed(1);

        const mockCommute = {
            timeText: `${peak_commute_minutes} mins`,
            miseryScore: parseFloat(miseryScore)
        };
        sendResponse({ success: true, commute: mockCommute });
    }
    return true; // Indicates asynchronous response
});

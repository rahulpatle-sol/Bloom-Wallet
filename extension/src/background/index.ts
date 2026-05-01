// Vaultis Chrome Extension — Background Service Worker (MV3)
// Handles keepalive and message passing for future dApp connections

chrome.runtime.onInstalled.addListener(() => {
  console.log('Vaultis installed');
});

// Keep alive ping
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ type: 'PONG' });
  }
  return true;
});

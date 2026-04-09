async function getHydrationState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['hydration-data'], (result) => {
      resolve(result['hydration-data'] || null);
    });
  });
}

async function saveHydrationState(state) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ 'hydration-data': state }, resolve);
  });
}

const DEFAULT_GOAL = 2000;
const REMINDER_INTERVAL_MINUTES = 60;

function getStorageKey() {
  return `hydration-data`;
}

async function getState() {
  const result = await chrome.storage.local.get([getStorageKey()]);
  return result[getStorageKey()] || {
    intake: 0,
    goal: DEFAULT_GOAL,
    lastResetDate: new Date().toISOString().split('T')[0],
    history: []
  };
}

async function saveState(state) {
  await chrome.storage.local.set({ [getStorageKey()]: state });
}

async function maybeResetForNewDay() {
  const state = await getState();
  const today = new Date().toISOString().split('T')[0];
  if (state.lastResetDate !== today) {
    state.intake = 0;
    state.history = [];
    state.lastResetDate = today;
    await saveState(state);
  }
}

async function sendReminderNotification() {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icon.png'),
    title: 'Time to hydrate',
    message: 'Take a moment to drink some water and log it.',
    priority: 2
  });
}

async function startReminderTimer() {
  await maybeResetForNewDay();
  sendReminderNotification();
  chrome.alarms.create('hydrationReminder', {
    periodInMinutes: REMINDER_INTERVAL_MINUTES
  });
}

chrome.runtime.onInstalled.addListener(() => {
  startReminderTimer();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'hydrationReminder') {
    await maybeResetForNewDay();
    sendReminderNotification();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'testNotification') {
    sendReminderNotification();
  }
});

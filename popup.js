const DEFAULT_STATE = {
  intake: 0,
  goal: 1500,
  history: []
};

const intakeText = document.getElementById('intakeText');
const goalText = document.getElementById('goalText');
const goalTextDuplicate = document.getElementById('goalTextDuplicate');
const historyList = document.getElementById('historyList');
const progressCard = document.getElementById('progressCard');

function formatHistory(history) {
  return history.map((entry) => {
    const time = new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<li>${time} - +${entry.amount} ml</li>`;
  }).join('');
}

function updateUi(state) {
  console.log('Updating UI with intake:', state.intake);
  const progress = Math.min(1, state.intake / state.goal);
  intakeText.textContent = state.intake;
  goalText.textContent = state.goal;
  goalTextDuplicate.textContent = state.goal;
  progressCard.style.background = `linear-gradient(to top, var(--accent) ${progress * 100}%, white ${progress * 100}%)`;
  historyList.innerHTML = state.history.length > 0 ? formatHistory(state.history) : '<li>No drinks logged yet.</li>';
}

async function addIntake(amount) {
  console.log('Adding intake:', amount);
  const stored = await getHydrationState();
  const state = stored || DEFAULT_STATE;
  const nextState = {
    ...state,
    intake: state.intake + amount,
    history: [
      { amount, date: new Date().toISOString() },
      ...state.history
    ]
  };
  await saveHydrationState(nextState);
  updateUi(nextState);
}

async function testNotification() {
  chrome.runtime.sendMessage({ action: 'testNotification' });
}

async function resetIntake() {
  console.log('Resetting today\'s intake');
  const nextState = {
    ...DEFAULT_STATE,
    goal: (await getHydrationState())?.goal || DEFAULT_STATE.goal
  };
  await saveHydrationState(nextState);
  updateUi(nextState);
}

async function init() {
  let state = (await getHydrationState()) || DEFAULT_STATE;
  
  // Migrate old goal value from 2000 to 1500
  if (state.goal === 2000) {
    state = { ...state, goal: 1500 };
    await saveHydrationState(state);
  }
  
  updateUi(state);

  document.querySelectorAll('button[data-amount]').forEach((button) => {
    button.addEventListener('click', () => {
      const amount = Number(button.dataset.amount);
      addIntake(amount);
    });
  });

  document.getElementById('testNotification').addEventListener('click', testNotification);
  document.getElementById('resetIntake').addEventListener('click', resetIntake);
}

init();

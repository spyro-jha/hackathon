const DEFAULT_STATE = {
  intake: 0,
  goal: 2000,
  history: []
};

const intakeText = document.getElementById('intakeText');
const goalText = document.getElementById('goalText');
const goalTextDuplicate = document.getElementById('goalTextDuplicate');
const historyList = document.getElementById('historyList');
const star = document.getElementById('star');

function formatHistory(history) {
  return history.map((entry) => {
    const time = new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `<li>${time} - +${entry.amount} ml</li>`;
  }).join('');
}

function updateUi(state) {
  const progress = Math.min(1, state.intake / state.goal);
  intakeText.textContent = state.intake;
  goalText.textContent = state.goal;
  goalTextDuplicate.textContent = state.goal;
  star.style.opacity = 0.4 + progress * 0.6;
  historyList.innerHTML = state.history.length > 0 ? formatHistory(state.history) : '<li>No drinks logged yet.</li>';
}

async function addIntake(amount) {
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

async function init() {
  const state = (await getHydrationState()) || DEFAULT_STATE;
  updateUi(state);

  document.querySelectorAll('button[data-amount]').forEach((button) => {
    button.addEventListener('click', () => {
      const amount = Number(button.dataset.amount);
      addIntake(amount);
    });
  });

  document.getElementById('testNotification').addEventListener('click', testNotification);
}

init();

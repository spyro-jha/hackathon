# Hydration Reminder Browser Extension – Hackathon Plan

## 🧭 Goal
Build a browser extension that:
- Reminds user to drink water
- Lets user log intake quickly
- Shows progress via a filling star
- Stores everything locally

---

# 🏗️ Architecture (Simple & Hackathon-Friendly)

We use a **browser extension architecture**:

### 1. Popup (UI Layer)
- What user sees when clicking extension
- Displays:
  - Buttons (125ml / 250ml / 500ml)
  - Progress (star)
  - Today history
  - Daily goal (default: 2000 ml)

### 2. Content Script (Overlay)
- Injected into web pages
- Shows reminder popup overlay

### 3. Background Script (Logic Engine)
- Runs continuously
- Handles:
  - Timers (reminders)
  - Notifications
  - Data updates

### 4. Storage (Local)
- Uses browser storage
- Saves:
  - Intake
  - History
  - Last reset date
  - Daily goal (default: 2000 ml)

---

# ⚙️ Tech Stack (Why these choices)

### JavaScript (Vanilla)
- No frameworks → less setup, faster
- Easier for beginners

### HTML + CSS
- Simple UI
- Fast to build

### Browser Extension APIs
- Notifications
- Storage
- Background scripts

---

# 📁 Project Structure

```
hydration-extension/
│
├── manifest.json        # Extension config
├── background.js        # Timer + logic
├── content.js           # Overlay injection
├── popup.html           # UI
├── popup.js             # UI logic
├── style.css            # Styles
└── utils.js             # Shared functions
```

---

# 🚀 Step-by-Step Implementation

## Step 1: Setup Extension
- Create manifest.json
- Define:
  - permissions (storage, notifications)
  - background script
  - popup

## Step 2: Basic Popup UI
- Create buttons:
  - +125ml
  - +250ml
  - +500ml
- Show:
  - Current intake
  - Daily goal (2000 ml)
  - Simple progress %

## Step 3: Storage Logic
- Save intake in local storage
- Save default goal (2000 ml)
- Load on popup open

## Step 4: Reminder System
- Background script:
  - setInterval (every 60 min)
- Trigger notification

## Step 5: Overlay Reminder
- Inject popup into page
- Show reminder visually

## Step 6: Logging Intake
- Clicking button:
  - updates storage
  - updates UI

## Step 7: Daily Reset
- Check stored date
- If new day:
  - reset intake

## Step 8: Star Progress
- Replace % with visual:
  - star icon
  - fill based on progress (intake / goal)

---

# ⚠️ Keep It Simple

Avoid:
- Login systems
- Complex animations
- Charts
- Backend

---

# 🧠 Final Advice

Focus on:
- Working demo
- Visible feedback (star filling)
- Smooth basic UX


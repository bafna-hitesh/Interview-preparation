# Countdown Timer - Key Learnings

---

## Why Not Just Decrement a Counter?

```javascript
// BAD - drifts over time
let seconds = 60;
setInterval(() => {
  seconds--;
  display(seconds);
}, 1000);

// GOOD - calculate from end time
const endTime = Date.now() + 60000;
setInterval(() => {
  const remaining = Math.round((endTime - Date.now()) / 1000);
  display(remaining);
}, 1000);
```

**Interview Point:** "setInterval isn't exact - it can drift. Calculate remaining time from a fixed end timestamp for accuracy."

---

## Time Formatting

```javascript
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = n => n.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}
```

---

## Pause/Resume Pattern

```javascript
let endTime, intervalId, remainingOnPause;

function pause() {
  remainingOnPause = Math.round((endTime - Date.now()) / 1000);
  clearInterval(intervalId);
}

function resume() {
  endTime = Date.now() + remainingOnPause * 1000;
  startInterval();
}
```

---

## Display End Time

```javascript
function displayEndTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}
```

---

## Notification API

```javascript
// Request permission
if ('Notification' in window) {
  Notification.requestPermission();
}

// Show notification
if (Notification.permission === 'granted') {
  new Notification('Timer Complete!', {
    body: 'Your countdown has finished.',
    icon: '/timer-icon.png'
  });
}
```

---

## Common Interview Questions

**Q: Why use Date.now() instead of decrementing a counter?**
> setInterval timing isn't guaranteed. Tab backgrounding, CPU load can cause delays. Calculating from end time ensures accuracy.

**Q: How do you handle the browser tab being inactive?**
> Timers slow down in background tabs. Using Date.now() calculation handles this automatically - when tab becomes active, it shows correct remaining time.

**Q: How would you make the timer persist across page refreshes?**
> Store `endTime` in localStorage. On page load, check if endTime exists and is in future, then resume countdown.

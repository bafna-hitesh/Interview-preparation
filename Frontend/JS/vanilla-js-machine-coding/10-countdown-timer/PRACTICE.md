# Countdown Timer - Practice & Interview Q&A

## Challenge 1: Persist Across Refresh
**Time:** 15 min

Store endTime in localStorage, resume on page load.

```javascript
// On start
localStorage.setItem('timerEndTime', endTime);

// On load
const saved = localStorage.getItem('timerEndTime');
if (saved && parseInt(saved) > Date.now()) {
  resumeFromEndTime(parseInt(saved));
}
```

---

## Challenge 2: Multiple Timers
**Time:** 25 min

Support multiple concurrent timers with labels.

---

## Challenge 3: Pomodoro Timer
**Time:** 30 min

Implement 25min work / 5min break cycles with tracking.

---

## Interview Q&A

### Beginner

**Q: Why does setInterval drift?**
> setInterval schedules next call after callback completes. If callback takes 10ms on a 1000ms interval, next tick is at 1010ms, not 1000ms. This compounds over time.

**Q: How do you format time as mm:ss?**
```javascript
const minutes = Math.floor(seconds / 60);
const secs = seconds % 60;
return `${minutes}:${secs.toString().padStart(2, '0')}`;
```

---

### Intermediate

**Q: How do you handle background tabs?**
> Browsers throttle timers in background tabs. Use `Date.now()` calculation so when user returns, correct time is shown. Also use `visibilitychange` event to update immediately when tab becomes visible.

**Q: How would you add sound notification?**
```javascript
// Using Web Audio API or Audio element
const audio = new Audio('alarm.mp3');
audio.play().catch(() => {}); // Catch autoplay restrictions

// Or using Audio context
const ctx = new AudioContext();
// ... generate beep
```

---

### Senior

**Q: How would you make timer accurate to milliseconds?**
> Use `requestAnimationFrame` instead of setInterval for smooth updates. Calculate remaining from `performance.now()` for higher precision.

**Q: How would you sync timer across multiple tabs?**
> Use BroadcastChannel API or localStorage events:
```javascript
const channel = new BroadcastChannel('timer');
channel.postMessage({ type: 'start', endTime });

channel.onmessage = (e) => {
  if (e.data.type === 'start') {
    syncToEndTime(e.data.endTime);
  }
};
```

---

## Self-Assessment

- [ ] Calculate remaining time from end timestamp (not decrement)
- [ ] Format time correctly (mm:ss or hh:mm:ss)
- [ ] Implement pause/resume functionality
- [ ] Show end time ("Ends at 3:45 PM")
- [ ] Handle timer completion (sound, notification)
- [ ] Clear interval on component cleanup

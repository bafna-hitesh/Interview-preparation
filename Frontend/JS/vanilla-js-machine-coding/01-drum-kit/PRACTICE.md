# Drum Kit - Practice Challenges

## Challenge 1: Add Recording Feature
**Time:** 15 min | **Difficulty:** Medium

Record sequence of key presses with timing, then play back.

```javascript
// Hint: Store timestamps
const recording = [];
recording.push({ key: 'KeyA', time: Date.now() - startTime });
```

**What interviewer wants to see:**
- Time tracking approach
- Playback using setTimeout

---

## Challenge 2: Add Volume Control
**Time:** 10 min | **Difficulty:** Easy

Add a slider to control master volume.

```javascript
// Hint: Audio element has volume property
audio.volume = 0.5;  // 0 to 1
```

**Bonus:** Individual volume per sound

---

## Challenge 3: Visual Feedback for Screen Readers
**Time:** 10 min | **Difficulty:** Easy

Announce which sound is playing for accessibility.

```javascript
// Hint: Use aria-live region
<div aria-live="polite" id="announcer"></div>
announcer.textContent = `Playing ${soundName}`;
```

---

## Challenge 4: Add Touch Support with Haptic Feedback
**Time:** 10 min | **Difficulty:** Medium

Make it work well on mobile with vibration.

```javascript
// Hint: Vibration API
if (navigator.vibrate) {
  navigator.vibrate(50);  // 50ms vibration
}
```

---

## Challenge 5: Keyboard Layout Display
**Time:** 20 min | **Difficulty:** Hard

Show visual keyboard that highlights pressed keys, support different layouts.

**What interviewer wants to see:**
- Data structure for layout mapping
- Strategy pattern for different layouts

---

## Interview Q&A

### Beginner Level

**Q: What is event delegation?**
> Using a single event listener on a parent element to handle events from children. Events bubble up, so we catch them at the parent and check `e.target`.

**Q: Why do we reset `currentTime` before playing?**
> Without reset, if you press a key while sound is playing, nothing happens. Setting `currentTime = 0` restarts the sound immediately.

---

### Intermediate Level

**Q: What's the difference between `keydown` and `keypress`?**
> `keydown` fires for all keys (including Shift, Ctrl). `keypress` only fires for character-producing keys and is deprecated. Use `keydown`.

**Q: Why use `e.code` instead of `e.keyCode`?**
> `keyCode` is deprecated and returns numbers that vary by browser. `e.code` returns consistent strings like 'KeyA' regardless of keyboard layout.

**Q: How would you handle multiple rapid key presses?**
> 1. Reset audio `currentTime` to 0 before each play
> 2. Check `e.repeat` to ignore held-down keys if needed
> 3. Could use audio pool for overlapping sounds

---

### Senior Level

**Q: How would you implement this without any global state?**
```javascript
// Pass dependencies explicitly
function createDrumKit(container, audioMap) {
  return {
    play(key) { /* ... */ }
  };
}
```

**Q: How would you make this work offline?**
> 1. Use Service Worker to cache audio files
> 2. IndexedDB for storing custom sounds
> 3. Cache API for the HTML/JS/CSS

**Q: What memory leaks could occur and how to prevent?**
> 1. Event listeners not removed → Use AbortController
> 2. Audio elements holding references → Set to null on destroy
> 3. Closures holding DOM references → Clear Maps/Sets

**Q: How would you implement audio pooling for overlapping sounds?**
```javascript
const audioPool = new Map();

function getAudioInstance(src) {
  if (!audioPool.has(src)) {
    audioPool.set(src, []);
  }
  const pool = audioPool.get(src);
  let audio = pool.find(a => a.ended || a.paused);
  if (!audio) {
    audio = new Audio(src);
    pool.push(audio);
  }
  return audio;
}
```

---

## Self-Assessment Checklist

After completing this project, you should be able to:

- [ ] Explain event delegation and when to use it
- [ ] Use modern keyboard event properties (`code`, `key`)
- [ ] Handle audio playback with proper reset
- [ ] Implement cleanup with AbortController
- [ ] Structure code using Module pattern
- [ ] Add basic accessibility (ARIA labels, keyboard support)
- [ ] Prevent memory leaks with proper cleanup

---

## Next Steps

Move to **02-autocomplete** - the most commonly asked machine coding question.

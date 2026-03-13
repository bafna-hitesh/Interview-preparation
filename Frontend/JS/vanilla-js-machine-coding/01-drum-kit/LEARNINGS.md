# Drum Kit - Key Learnings

## Core Concepts Demonstrated

### 1. Event Handling

**Basic vs Senior Approach:**

```javascript
// Junior - Multiple listeners
keys.forEach(key => key.addEventListener('click', play));

// Senior - Event delegation
container.addEventListener('click', (e) => {
  const key = e.target.closest('.key');
  if (!key) return;
  play(key);
});
```

**Interview Point:** "Event delegation uses one listener instead of many, reducing memory usage and automatically handling dynamically added elements."

---

### 2. Keyboard Events: `keyCode` vs `code` vs `key`

```javascript
// DEPRECATED - Don't use
e.keyCode  // 65 for 'A' - numeric, deprecated

// MODERN - Use these
e.code     // 'KeyA' - physical key position (layout-independent)
e.key      // 'a' or 'A' - actual character (affected by Shift)
```

**When to use what:**
- `e.code` - Games, shortcuts (same key regardless of keyboard layout)
- `e.key` - Text input, character-based operations

**Interview Point:** "`keyCode` is deprecated. I use `e.code` for key-based actions because it's consistent across keyboard layouts."

---

### 3. Audio Handling

**Key technique - Reset before play:**
```javascript
audio.currentTime = 0;  // Reset to start
audio.play();           // Play immediately
```

**Why?** Without reset, rapid key presses won't replay until sound finishes.

**Error handling:**
```javascript
audio.play().catch(() => {});  // Silence autoplay errors
```

---

### 4. CSS Transitions + JavaScript

**Transition lifecycle:**
1. Add class → triggers transition
2. `transitionend` event fires when done
3. Remove class in handler

```javascript
element.classList.add('playing');

element.addEventListener('transitionend', (e) => {
  if (e.propertyName !== 'transform') return;  // Multiple properties fire events
  element.classList.remove('playing');
});
```

**Interview Point:** "I check `propertyName` because `transitionend` fires for each animated property."

---

### 5. Cleanup Pattern with AbortController

**Modern approach to remove multiple listeners:**

```javascript
const controller = new AbortController();

window.addEventListener('keydown', handler, { signal: controller.signal });
container.addEventListener('click', handler, { signal: controller.signal });

// Cleanup - removes ALL listeners at once
controller.abort();
```

**Interview Point:** "AbortController provides cleaner cleanup than tracking each listener individually."

---

### 6. Preventing Repeat Key Events

```javascript
function handleKeyDown(e) {
  if (e.repeat) return;  // Ignore held-down key
  // ...
}
```

---

## Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| Module (IIFE) | Entire solution | Encapsulation, no global pollution |
| Factory | `createKey()` | Create consistent key objects |
| Event Delegation | Click handler | Single listener for all keys |
| Configuration Object | `CONFIG` | Centralized selectors/classes |

---

## What Interviewers Notice

**Good signs:**
- Uses `e.code` instead of deprecated `e.keyCode`
- Event delegation instead of multiple listeners
- Proper cleanup with `destroy()` method
- `e.repeat` check for held keys
- Accessible HTML (buttons, ARIA labels)

**Red flags:**
- Global variables everywhere
- No cleanup mechanism
- Using deprecated APIs
- Ignoring edge cases (rapid clicks, held keys)

---

## Common Follow-up Questions

**Q: How would you test this?**
A: "I'd test the public API methods (`init`, `play`, `destroy`) and verify DOM changes. Mock the audio element for unit tests."

**Q: How would you add new sounds dynamically?**
A: "The factory pattern makes this easy - just call `createKey()` with new element and add to the Map."

**Q: What if audio files are large?**
A: "Preload audio on init, show loading state, or use Web Audio API for more control."

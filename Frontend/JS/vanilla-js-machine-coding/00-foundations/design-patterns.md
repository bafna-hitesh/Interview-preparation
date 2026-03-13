# Design Patterns for Machine Coding Rounds

> Patterns you should know and demonstrate in interviews.

---

## 1. Module Pattern (Revealing Module)

**When:** Encapsulate functionality, expose clean API

```javascript
const DrumKit = (function() {
  // Private
  const state = { initialized: false };
  
  function playSound(key) {
    // implementation
  }
  
  // Public API
  return {
    init() { state.initialized = true; },
    play: playSound,
    destroy() { /* cleanup */ }
  };
})();

// Usage
DrumKit.init();
DrumKit.play('A');
```

**Interview Point:** "I use the module pattern to encapsulate state and expose only what's needed. This prevents global pollution and makes the code testable."

---

## 2. Event Delegation

**When:** Multiple similar elements need same handler

```javascript
// BAD - attaches n listeners
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// GOOD - single listener
document.querySelector('.container').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  handleClick(item);
});
```

**Interview Point:** "Event delegation reduces memory usage and automatically handles dynamically added elements."

---

## 3. Debounce

**When:** Rate-limit expensive operations (search, resize, scroll)

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
```

**Interview Point:** "Debounce waits for pause in events. Use for search inputs, window resize."

---

## 4. Throttle

**When:** Ensure function runs at most once per interval

```javascript
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage - scroll handler runs max once per 100ms
window.addEventListener('scroll', throttle(handleScroll, 100));
```

**Interview Point:** "Throttle guarantees execution at regular intervals. Use for scroll, mousemove."

---

## 5. Observer/PubSub

**When:** Components need to communicate without tight coupling

```javascript
const EventBus = {
  events: {},
  
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => this.unsubscribe(event, callback);
  },
  
  unsubscribe(event, callback) {
    this.events[event] = this.events[event]?.filter(cb => cb !== callback);
  },
  
  publish(event, data) {
    this.events[event]?.forEach(callback => callback(data));
  }
};

// Usage
EventBus.subscribe('sound:play', (key) => console.log(`Playing ${key}`));
EventBus.publish('sound:play', 'A');
```

**Interview Point:** "PubSub decouples components. Publisher doesn't need to know about subscribers."

---

## 6. State Machine

**When:** UI has distinct states with defined transitions

```javascript
const PlayerState = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused'
};

const player = {
  state: PlayerState.IDLE,
  
  play() {
    if (this.state === PlayerState.PLAYING) return;
    this.state = PlayerState.PLAYING;
    this.updateUI();
  },
  
  pause() {
    if (this.state !== PlayerState.PLAYING) return;
    this.state = PlayerState.PAUSED;
    this.updateUI();
  },
  
  updateUI() {
    document.body.dataset.state = this.state;
  }
};
```

**Interview Point:** "State machines make transitions explicit and prevent invalid states."

---

## 7. Factory Pattern

**When:** Create multiple instances with same interface

```javascript
function createDrumKey(keyCode, sound, element) {
  return {
    keyCode,
    sound,
    element,
    isPlaying: false,
    
    play() {
      this.isPlaying = true;
      this.element.classList.add('playing');
      // play sound
    },
    
    stop() {
      this.isPlaying = false;
      this.element.classList.remove('playing');
    }
  };
}

// Usage
const keys = Array.from(document.querySelectorAll('.key')).map(el => 
  createDrumKey(el.dataset.key, el.dataset.sound, el)
);
```

**Interview Point:** "Factory pattern creates objects without using classes, keeping code functional."

---

## 8. Strategy Pattern

**When:** Different algorithms for same operation

```javascript
const inputStrategies = {
  keyboard: {
    init(handler) {
      window.addEventListener('keydown', (e) => handler(e.code));
    }
  },
  click: {
    init(handler) {
      container.addEventListener('click', (e) => {
        const key = e.target.closest('.key');
        if (key) handler(key.dataset.code);
      });
    }
  },
  touch: {
    init(handler) {
      container.addEventListener('touchstart', (e) => {
        const key = e.target.closest('.key');
        if (key) handler(key.dataset.code);
      });
    }
  }
};

// Usage - easily add/switch input methods
['keyboard', 'click', 'touch'].forEach(type => {
  inputStrategies[type].init(playSound);
});
```

**Interview Point:** "Strategy pattern lets me add new input methods without changing existing code."

---

## Pattern Selection Guide

| Scenario | Pattern |
|----------|---------|
| Need private state | Module |
| Many similar elements | Event Delegation |
| Search input | Debounce |
| Scroll/resize handler | Throttle |
| Components communicating | Observer/PubSub |
| Distinct UI states | State Machine |
| Creating multiple similar objects | Factory |
| Multiple ways to do same thing | Strategy |

---

## Interview Talking Points

When explaining your code:

1. **Name the pattern** - "I'm using event delegation here"
2. **Explain why** - "Because we have multiple keys and may add more dynamically"
3. **Mention tradeoff** - "The tradeoff is we need to check the target element"

This shows you're not just copying patterns but understanding when and why to use them.

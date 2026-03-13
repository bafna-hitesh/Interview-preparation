# Event Delegation - Key Learnings

> Asked in almost EVERY JavaScript interview

---

## The Three Event Phases

```
                    │ CAPTURE (1)
                    ▼
┌───────────────────────────────────┐
│ window                            │
│  ┌─────────────────────────────┐  │
│  │ document                    │  │
│  │  ┌───────────────────────┐  │  │
│  │  │ <div> parent          │  │  │
│  │  │  ┌─────────────────┐  │  │  │
│  │  │  │ <button> TARGET │  │  │  │
│  │  │  └─────────────────┘  │  │  │
│  │  └───────────────────────┘  │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
                    │
                    ▼ BUBBLE (3)
```

1. **Capture Phase** - Event travels DOWN from window to target
2. **Target Phase** - Event reaches the element that was clicked
3. **Bubble Phase** - Event travels UP from target to window

---

## addEventListener Options

```javascript
element.addEventListener('click', handler, {
  capture: false,  // Listen during capture phase (default: false/bubble)
  once: true,      // Remove listener after first trigger
  passive: true,   // Never calls preventDefault (scroll performance)
  signal: ctrl.signal  // AbortController for cleanup
});
```

---

## Event Delegation Pattern

```javascript
// BAD - n listeners
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// GOOD - 1 listener
document.querySelector('.list').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  handleClick(item);
});
```

**Why delegation is better:**
1. Memory efficient (1 listener vs 100)
2. Works for dynamically added elements
3. Easier cleanup

---

## Key Properties

```javascript
element.addEventListener('click', (e) => {
  e.target        // Element that was actually clicked
  e.currentTarget // Element the listener is attached to
  e.eventPhase    // 1=capture, 2=target, 3=bubble
});
```

---

## Stopping Propagation

```javascript
e.stopPropagation();         // Stops event from going to next element
e.stopImmediatePropagation(); // Stops event AND other listeners on same element
e.preventDefault();           // Stops default browser action (NOT propagation)
```

**Interview Point:** "stopPropagation prevents bubbling, preventDefault stops browser default (like form submit). They're independent."

---

## Common Interview Questions

**Q: What's the difference between `target` and `currentTarget`?**
> `target` is the actual clicked element. `currentTarget` is the element with the listener. With delegation, they're different.

**Q: When would you use capture phase?**
> Rarely. Use cases: 1) Intercepting events before they reach children, 2) Implementing focus trapping in modals.

**Q: What does `passive: true` do?**
> Tells browser the handler won't call `preventDefault()`. Browser can start scrolling immediately without waiting for JS. Used for scroll/touch handlers.

**Q: How do you remove an event listener?**
```javascript
// Method 1: Named function
const handler = () => {};
el.addEventListener('click', handler);
el.removeEventListener('click', handler);

// Method 2: AbortController (modern)
const controller = new AbortController();
el.addEventListener('click', handler, { signal: controller.signal });
controller.abort(); // Removes all listeners with this signal
```

---

## Practical Examples

### Modal Close on Outside Click
```javascript
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal(); // Clicked backdrop, not content
});
```

### Prevent Form Submit Bubbling
```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
```

### Dropdown Menu
```javascript
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    closeDropdown();
  }
});
```

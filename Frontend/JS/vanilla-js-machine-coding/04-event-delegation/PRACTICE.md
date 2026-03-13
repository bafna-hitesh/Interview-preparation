# Event Delegation - Practice & Interview Q&A

## Challenge 1: Custom Event System
**Time:** 20 min | **Difficulty:** Medium

Build a simple event emitter.

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) { /* add listener */ }
  off(event, callback) { /* remove listener */ }
  emit(event, data) { /* trigger all listeners */ }
  once(event, callback) { /* listener that fires once */ }
}
```

---

## Challenge 2: Event Tracking
**Time:** 15 min | **Difficulty:** Easy

Log all clicks on the page with element info.

```javascript
document.addEventListener('click', (e) => {
  console.log({
    tag: e.target.tagName,
    id: e.target.id,
    classes: e.target.className,
    text: e.target.textContent?.slice(0, 20)
  });
}, { capture: true });
```

---

## Challenge 3: Focus Trap
**Time:** 20 min | **Difficulty:** Medium

Keep focus inside a modal (Tab cycles through modal elements only).

---

## Interview Q&A

### Beginner

**Q: What is event bubbling?**
> When an event occurs on an element, it first runs handlers on it, then on its parent, then all the way up. Most events bubble.

**Q: Which events don't bubble?**
> `focus`, `blur`, `load`, `unload`, `scroll` (on specific elements). Use capture phase or delegated alternatives (`focusin`/`focusout`).

---

### Intermediate

**Q: Explain event delegation with a real example.**
> Instead of adding click listeners to 100 list items, add one to the parent `<ul>`. When clicked, check `e.target.closest('.item')` to find which item was clicked. Benefits: less memory, works with dynamically added items.

**Q: What's the difference between `e.target` and `e.currentTarget`?**
> `target` is the actual element clicked (could be a child). `currentTarget` is the element the listener is attached to. In delegation, target might be a span inside a button, while currentTarget is the container.

**Q: How does `{ passive: true }` improve scroll performance?**
> Browser normally waits for scroll handlers to complete (in case they call preventDefault). With passive, browser knows it can scroll immediately. Critical for smooth 60fps scrolling.

---

### Senior

**Q: How would you implement event delegation that works across Shadow DOM?**
```javascript
// Events from shadow DOM have retargeted event.target
// Use composed path to get original target
element.addEventListener('click', (e) => {
  const path = e.composedPath();
  const originalTarget = path[0];
});
```

**Q: Implement a simple pub/sub system.**
```javascript
const EventBus = {
  events: new Map(),
  
  subscribe(event, callback) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(callback);
    return () => this.unsubscribe(event, callback);
  },
  
  publish(event, data) {
    this.events.get(event)?.forEach(cb => cb(data));
  },
  
  unsubscribe(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
};
```

**Q: When would capturing be useful?**
> 1. Intercepting events before children handle them
> 2. Event logging/analytics (capture at document level)
> 3. Stopping events from reaching certain elements
> 4. Focus trapping in modals

---

## Self-Assessment

- [ ] Explain the three event phases
- [ ] Use event delegation with `closest()`
- [ ] Know difference between `target` and `currentTarget`
- [ ] Understand `stopPropagation` vs `preventDefault`
- [ ] Use `{ once, passive, capture }` options
- [ ] Clean up listeners with AbortController
- [ ] Know which events don't bubble

---

## Next Steps

Move to **05-multi-select** - implement Gmail-like shift+click selection.

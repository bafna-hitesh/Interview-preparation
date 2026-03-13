# Vanilla JS Machine Coding - Interview Mastery

> Production-grade solutions for the top 10 machine coding questions asked at big tech companies.

## How to Use This Resource

### Learning Path
```
Foundation → Drum Kit → Autocomplete → Todo App → Event System → Multi-Select
     ↓
Advanced: Infinite Scroll → Canvas → Video Player → Carousel → Timer
```

### For Each Project
1. **Try first** - Spend 30-45 mins solving without looking at solution
2. **Compare** - Check `solution.js` and understand the patterns used
3. **Read** - Go through `LEARNINGS.md` for interview talking points
4. **Practice** - Solve challenges in `PRACTICE.md`

---

## Machine Coding Round Strategy

### Time Management (45-60 min typical)
| Phase | Time | Focus |
|-------|------|-------|
| Clarify | 5 min | Ask questions, confirm requirements |
| Design | 5 min | Verbalize your approach, data structures |
| Core Logic | 25 min | Get working solution first |
| Polish | 10 min | Edge cases, error handling |
| Bonus | 5 min | Accessibility, optimizations |

### What Interviewers Look For
- [ ] Clean, readable code structure
- [ ] Proper separation of concerns
- [ ] Event handling best practices
- [ ] Edge case awareness
- [ ] Modern JS (ES6+) usage
- [ ] Bonus: Accessibility, performance

### Common Mistakes to Avoid
- Starting to code without clarifying requirements
- Over-engineering simple problems
- Ignoring edge cases (empty state, rapid inputs)
- Not handling cleanup (memory leaks)
- Forgetting keyboard/accessibility support

---

## Projects

| # | Project | Key Concepts | Interview Frequency |
|---|---------|--------------|---------------------|
| 01 | [Drum Kit](./01-drum-kit/) | Events, Audio API, Delegation | Medium |
| 02 | [Autocomplete](./02-autocomplete/) | Fetch, Debounce, Highlight | Very High |
| 03 | [Todo App](./03-todo-app/) | CRUD, LocalStorage, Delegation | Very High |
| 04 | [Event System](./04-event-delegation/) | Bubbling, Capture, Delegation | High (Theory) |
| 05 | [Multi-Select](./05-multi-select/) | Shift+Click, State Management | High |
| 06 | [Infinite Scroll](./06-infinite-scroll/) | Intersection Observer, Lazy Load | High |
| 07 | [Drawing Canvas](./07-drawing-canvas/) | Canvas API, Mouse Events | Medium |
| 08 | [Video Player](./08-video-player/) | Video API, Custom Controls | Medium |
| 09 | [Carousel](./09-carousel/) | Drag Events, Touch Support | High |
| 10 | [Countdown Timer](./10-countdown-timer/) | setInterval, Date Math | Medium |

---

## Progress Tracker

- [ ] 00 - Foundations (Design Patterns)
- [ ] 01 - Drum Kit
- [ ] 02 - Autocomplete
- [ ] 03 - Todo App
- [ ] 04 - Event Delegation
- [ ] 05 - Multi-Select
- [ ] 06 - Infinite Scroll
- [ ] 07 - Drawing Canvas
- [ ] 08 - Video Player
- [ ] 09 - Carousel
- [ ] 10 - Countdown Timer

---

## Quick Reference

### Must-Know Patterns
1. **Module Pattern** - Encapsulation, private/public API
2. **Event Delegation** - Single listener on parent
3. **Debounce/Throttle** - Rate limiting
4. **Observer/PubSub** - Decoupled communication
5. **State Machine** - Managing UI states

### Must-Know APIs
- `addEventListener` / `removeEventListener`
- `querySelector` / `querySelectorAll`
- `classList` API
- `dataset` (data attributes)
- `localStorage` / `sessionStorage`
- `fetch` / `AbortController`
- `IntersectionObserver`
- `requestAnimationFrame`

### Modern JS Essentials
```javascript
// Destructuring
const { key, code } = event;

// Template literals
element.innerHTML = `<div data-id="${id}">${name}</div>`;

// Arrow functions (lexical this)
element.addEventListener('click', (e) => this.handleClick(e));

// Optional chaining
const value = obj?.nested?.property;

// Nullish coalescing
const result = value ?? defaultValue;
```

---

## After Completing All Projects

You will be able to:
- Build any UI component from scratch
- Structure code for maintainability
- Handle all edge cases confidently
- Explain your decisions clearly
- Write code that impresses interviewers

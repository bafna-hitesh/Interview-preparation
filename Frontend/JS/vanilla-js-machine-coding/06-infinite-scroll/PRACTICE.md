# Infinite Scroll - Practice & Interview Q&A

## Challenge 1: Virtual Scrolling
**Time:** 45 min | **Difficulty:** Hard

Only render visible items for 10,000+ item lists.

```javascript
// Key concepts:
// - Fixed height items OR measure heights
// - Calculate visible range from scroll position
// - Render only visible + buffer
// - Use transform to position items
```

---

## Challenge 2: Bidirectional Scroll
**Time:** 30 min | **Difficulty:** Medium

Load older items when scrolling up (like chat history).

---

## Challenge 3: Pull to Refresh
**Time:** 20 min | **Difficulty:** Medium

Mobile-style pull down to refresh.

---

## Interview Q&A

### Beginner

**Q: What is Intersection Observer?**
> A browser API that efficiently detects when elements enter/exit the viewport or another element. Better than scroll events because it's handled off the main thread.

**Q: Why use rootMargin?**
> To trigger loading before the sentinel is visible. `rootMargin: '100px'` means start loading when sentinel is 100px away from viewport.

---

### Intermediate

**Q: How do you handle the "no more items" state?**
> Check if API returns fewer items than requested. If so, set `hasMore = false`, disconnect the observer, and show "No more items" message.

**Q: How do you prevent loading while already loading?**
> Track loading state with a boolean flag. Check it before fetching and set it false in finally block.

**Q: What's the difference between threshold 0 and 1?**
> - `threshold: 0` triggers when any pixel is visible
> - `threshold: 1` triggers when fully visible
> - Can use array `[0, 0.5, 1]` for multiple triggers

---

### Senior

**Q: How would you implement virtual scrolling?**
```javascript
// 1. Calculate visible range
const scrollTop = container.scrollTop;
const viewportHeight = container.clientHeight;
const itemHeight = 50; // Fixed or measured

const startIndex = Math.floor(scrollTop / itemHeight);
const visibleCount = Math.ceil(viewportHeight / itemHeight);
const buffer = 5;

const start = Math.max(0, startIndex - buffer);
const end = Math.min(totalItems, startIndex + visibleCount + buffer);

// 2. Render only visible items with positioning
items.slice(start, end).map((item, i) => {
  return `<div style="transform: translateY(${(start + i) * itemHeight}px)">
    ${item.content}
  </div>`;
});

// 3. Set container height to total
container.style.height = totalItems * itemHeight + 'px';
```

**Q: How do you handle variable height items in virtual scroll?**
> 1. Measure items on first render, cache heights
> 2. Estimate initial heights, update after measure
> 3. Use position absolute with cumulative top offsets

**Q: How would you cache/restore scroll position?**
```javascript
// Save position before unmount
const scrollState = {
  position: container.scrollTop,
  items: loadedItems
};
sessionStorage.setItem('scrollState', JSON.stringify(scrollState));

// Restore on mount
const saved = JSON.parse(sessionStorage.getItem('scrollState'));
if (saved) {
  renderItems(saved.items);
  container.scrollTop = saved.position;
}
```

---

## Self-Assessment

- [ ] Use Intersection Observer instead of scroll events
- [ ] Implement sentinel pattern
- [ ] Handle loading, error, empty, end states
- [ ] Prevent double-loading with flag
- [ ] Use DocumentFragment for batch insertion
- [ ] Know difference between threshold values
- [ ] Understand rootMargin for preloading

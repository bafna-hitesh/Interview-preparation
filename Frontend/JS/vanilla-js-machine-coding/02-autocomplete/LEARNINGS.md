# Autocomplete - Key Learnings

> THE #1 MOST ASKED MACHINE CODING QUESTION

## Why This Is Asked So Often

1. Tests multiple skills at once (async, DOM, events, UX)
2. Real-world component every frontend dev builds
3. Many ways to optimize (debounce, caching, abort)
4. Easy to add follow-up requirements

---

## Core Concepts

### 1. Debouncing

**Problem:** User types "new york" - don't make 8 API calls

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => fetchResults(query), 300);
input.addEventListener('input', (e) => search(e.target.value));
```

**Interview Point:** "Debounce waits for user to stop typing. 300ms is typical - fast enough to feel responsive, slow enough to reduce API calls."

---

### 2. Aborting Previous Requests

**Problem:** User types "new", then "york" - first response might arrive after second

```javascript
let abortController = null;

async function fetchResults(query) {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  
  try {
    const res = await fetch(url, { signal: abortController.signal });
    return res.json();
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
}
```

**Interview Point:** "AbortController prevents race conditions. Without it, stale results could overwrite fresh ones."

---

### 3. Highlighting Matches

```javascript
function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
```

**Interview Point:** "Always escape user input before using in RegExp to prevent injection."

---

### 4. Keyboard Navigation

```javascript
switch (e.key) {
  case 'ArrowDown':
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    break;
  case 'ArrowUp':
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    break;
  case 'Enter':
    selectItem(selectedIndex);
    break;
  case 'Escape':
    close();
    break;
}
```

**Interview Point:** "Arrow keys need `preventDefault()` to stop scrolling the page."

---

### 5. Click Outside to Close

```javascript
document.addEventListener('click', (e) => {
  if (!input.contains(e.target) && !results.contains(e.target)) {
    close();
  }
});
```

---

## Performance Optimizations

| Technique | When to Use |
|-----------|-------------|
| Debounce | Always - reduces API calls |
| AbortController | Always - prevents race conditions |
| Caching | When data is static or changes slowly |
| Virtual scrolling | 1000+ results |
| `requestIdleCallback` | Heavy rendering |

---

## Accessibility Checklist

- [ ] `role="combobox"` on input
- [ ] `role="listbox"` on results
- [ ] `role="option"` on each result
- [ ] `aria-expanded` state
- [ ] `aria-selected` on focused item
- [ ] `aria-autocomplete="list"`
- [ ] Keyboard navigation (↑↓ Enter Esc)

---

## Common Interview Follow-ups

**Q: "How would you cache results?"**
```javascript
const cache = new Map();

async function fetchWithCache(query) {
  if (cache.has(query)) return cache.get(query);
  const data = await fetch(url + query).then(r => r.json());
  cache.set(query, data);
  return data;
}
```

**Q: "What if the API is slow?"**
- Show loading indicator
- Set timeout and show "Taking longer than expected"
- Allow user to cancel

**Q: "How would you handle errors?"**
- Show user-friendly message
- Retry button
- Log to monitoring service

**Q: "What about mobile?"**
- Touch events work with click
- Consider virtual keyboard covering results
- Larger tap targets

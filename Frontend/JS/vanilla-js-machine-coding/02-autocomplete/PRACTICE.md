# Autocomplete - Practice Challenges

## Challenge 1: Recent Searches
**Time:** 15 min | **Difficulty:** Easy

Store and display recent searches using localStorage.

```javascript
// Hint
const recent = JSON.parse(localStorage.getItem('recent') || '[]');
recent.unshift(query);
localStorage.setItem('recent', JSON.stringify(recent.slice(0, 5)));
```

---

## Challenge 2: Category Grouping
**Time:** 20 min | **Difficulty:** Medium

Group results by category (e.g., cities under states).

```javascript
// Expected output
// California
//   - Los Angeles
//   - San Francisco
// Texas
//   - Houston
//   - Dallas
```

---

## Challenge 3: Fuzzy Matching
**Time:** 25 min | **Difficulty:** Hard

Match "nyk" to "New York" (characters in order, not consecutive).

```javascript
function fuzzyMatch(text, query) {
  let queryIndex = 0;
  for (const char of text.toLowerCase()) {
    if (char === query[queryIndex]?.toLowerCase()) {
      queryIndex++;
    }
  }
  return queryIndex === query.length;
}
```

---

## Challenge 4: Multi-Select Tags
**Time:** 20 min | **Difficulty:** Medium

Allow selecting multiple items, show as tags above input.

---

## Challenge 5: API Rate Limiting
**Time:** 15 min | **Difficulty:** Medium

Implement client-side rate limiting (max 10 requests/minute).

```javascript
const requestTimes = [];
const LIMIT = 10;
const WINDOW = 60000;

function canMakeRequest() {
  const now = Date.now();
  const windowStart = now - WINDOW;
  while (requestTimes[0] < windowStart) requestTimes.shift();
  return requestTimes.length < LIMIT;
}
```

---

## Interview Q&A

### Beginner Level

**Q: Why use debounce instead of throttle here?**
> Debounce waits until user stops typing. Throttle would make calls at intervals while typing. For search, we want the final query, not intermediate ones.

**Q: What does `e.preventDefault()` do on arrow keys?**
> Prevents the default browser behavior of scrolling the page when pressing arrow keys.

---

### Intermediate Level

**Q: How would you handle very long lists efficiently?**
> Use virtual scrolling - only render visible items. Libraries like `react-window` do this, but you can implement with `IntersectionObserver` + fixed-height items.

**Q: Why escape the query before using in RegExp?**
> Characters like `.`, `*`, `?` have special meaning in regex. Without escaping, searching for "C++" would break.

**Q: How do you prevent race conditions with async requests?**
> Use AbortController to cancel previous requests. The signal is passed to fetch, and we catch AbortError separately from real errors.

---

### Senior Level

**Q: How would you implement this as a reusable component?**
> Accept configuration: input element, data fetcher function, render function, callbacks. Don't hardcode selectors or data structure.

**Q: How would you test this component?**
```javascript
// Unit tests
test('debounce delays execution', async () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 100);
  debounced(); debounced(); debounced();
  expect(fn).not.toBeCalled();
  await sleep(150);
  expect(fn).toBeCalledTimes(1);
});

// Integration tests
test('shows results after typing', async () => {
  input.value = 'new';
  input.dispatchEvent(new Event('input'));
  await waitFor(() => expect(results.children.length).toBeGreaterThan(0));
});
```

**Q: What accessibility considerations are important?**
> Screen readers need ARIA attributes to understand this is an autocomplete. `role="combobox"`, `aria-expanded`, `aria-selected`, keyboard navigation for users who can't use mouse.

---

## Self-Assessment

After completing this project, you should be able to:

- [ ] Implement debounce from scratch
- [ ] Explain why AbortController prevents race conditions
- [ ] Add keyboard navigation (↑↓ Enter Esc)
- [ ] Highlight matching text safely with regex
- [ ] Handle loading and error states
- [ ] Make it accessible with ARIA attributes
- [ ] Discuss caching strategies

---

## Next Steps

Move to **03-todo-app** - another extremely common interview question that tests CRUD operations and localStorage.

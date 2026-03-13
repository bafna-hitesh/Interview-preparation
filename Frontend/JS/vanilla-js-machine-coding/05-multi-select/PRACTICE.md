# Multi-Select - Practice & Interview Q&A

## Challenge 1: Keyboard Navigation
**Time:** 20 min

Add arrow key navigation with Shift+Arrow for range select.

```javascript
// Up/Down moves focus
// Shift+Up/Down extends selection
// Space toggles current item
```

---

## Challenge 2: Drag to Select
**Time:** 25 min

Draw a selection rectangle with mouse drag (like desktop file selection).

---

## Challenge 3: Three-State Checkbox
**Time:** 15 min

Parent checkbox shows:
- Unchecked: no children selected
- Checked: all children selected
- Indeterminate: some children selected

```javascript
checkbox.indeterminate = true;
```

---

## Interview Q&A

### Beginner

**Q: Why use Set instead of Array for selected items?**
> Set has O(1) lookup/add/delete. Array would need indexOf (O(n)) to check if item is selected.

**Q: What's the difference between `ctrlKey` and `metaKey`?**
> `ctrlKey` is Ctrl on all platforms. `metaKey` is Cmd on Mac, Windows key on Windows. For multi-select, check both for cross-platform support.

---

### Intermediate

**Q: How do you handle shift+click when items are added/removed?**
> Store item IDs instead of indices. When selecting range, find current indices of stored IDs.

**Q: How would you implement "select all visible" vs "select all"?**
> Track visible items separately. Select all visible affects only filtered list. True select all would need to track IDs across all data.

---

### Senior

**Q: How would you make this accessible?**
> - `role="listbox"` with `aria-multiselectable="true"`
> - `role="option"` with `aria-selected` on items
> - Keyboard navigation (arrows, space, shift+arrows)
> - Screen reader announcements for selection changes

**Q: Design a reusable selection manager.**
```javascript
class SelectionManager {
  constructor(options) {
    this.items = options.items;
    this.selected = new Set();
    this.lastIndex = null;
    this.onChange = options.onChange;
  }
  
  click(index, { shift, ctrl }) {
    if (shift && this.lastIndex !== null) {
      this.selectRange(this.lastIndex, index);
    } else if (ctrl) {
      this.toggle(index);
    } else {
      this.selectOnly(index);
    }
    this.lastIndex = index;
    this.onChange?.(this.getSelected());
  }
  
  // ... other methods
}
```

---

## Self-Assessment

- [ ] Implement range selection with shift+click
- [ ] Handle ctrl/cmd+click for toggle
- [ ] Use Set for O(1) selection operations
- [ ] Handle both directions in range (up and down)
- [ ] Add keyboard shortcuts (Ctrl+A, Escape)
- [ ] Make accessible with ARIA attributes

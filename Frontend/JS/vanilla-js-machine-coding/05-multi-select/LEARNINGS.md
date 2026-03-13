# Multi-Select (Shift+Click) - Key Learnings

> Gmail-like selection - commonly asked in interviews

---

## Core Algorithm

```javascript
let lastClickedIndex = null;
const selectedItems = new Set();

function handleClick(e, currentIndex) {
  if (e.shiftKey && lastClickedIndex !== null) {
    // Range select
    const start = Math.min(lastClickedIndex, currentIndex);
    const end = Math.max(lastClickedIndex, currentIndex);
    for (let i = start; i <= end; i++) {
      selectedItems.add(items[i]);
    }
  } else if (e.ctrlKey || e.metaKey) {
    // Toggle individual
    if (selectedItems.has(items[currentIndex])) {
      selectedItems.delete(items[currentIndex]);
    } else {
      selectedItems.add(items[currentIndex]);
    }
  } else {
    // Single select (clear others)
    selectedItems.clear();
    selectedItems.add(items[currentIndex]);
  }
  
  lastClickedIndex = currentIndex;
}
```

---

## Key Concepts

### 1. Using Set for Selection State

```javascript
const selectedItems = new Set();

selectedItems.add(item);      // O(1)
selectedItems.delete(item);   // O(1)
selectedItems.has(item);      // O(1)
selectedItems.clear();        // O(1)
```

**Interview Point:** "Set is perfect for selection because add/delete/has are all O(1), and it automatically handles duplicates."

---

### 2. Detecting Modifier Keys

```javascript
element.addEventListener('click', (e) => {
  e.shiftKey  // Shift key held
  e.ctrlKey   // Ctrl key held (Windows/Linux)
  e.metaKey   // Cmd key held (Mac)
  e.altKey    // Alt/Option key held
});
```

**Interview Point:** "Check both `ctrlKey` and `metaKey` for cross-platform compatibility."

---

### 3. Range Selection Logic

```javascript
function selectRange(from, to) {
  const start = Math.min(from, to);  // Handle both directions
  const end = Math.max(from, to);
  
  for (let i = start; i <= end; i++) {
    selectedItems.add(items[i]);
  }
}
```

---

### 4. Selection Modes

| Action | Result |
|--------|--------|
| Click | Clear all, select clicked |
| Shift+Click | Range from last clicked |
| Ctrl/Cmd+Click | Toggle clicked item |
| Ctrl/Cmd+A | Select all |
| Escape | Clear selection |

---

## Common Follow-up Questions

**Q: How would you handle selection with filtered/sorted lists?**
> Use stable IDs instead of indices. When list changes, re-map selected IDs to current positions.

**Q: How would you optimize for 10,000 items?**
> 1. Virtual scrolling (render visible items only)
> 2. Batch DOM updates
> 3. Use `requestAnimationFrame` for UI updates

**Q: How would you persist selection across page refreshes?**
> Store selected IDs in `sessionStorage`. On load, restore selection by IDs.

# Todo App - Practice Challenges

## Challenge 1: Filters (All/Active/Completed)
**Time:** 15 min | **Difficulty:** Easy

Add filter buttons to show all, active, or completed todos.

```javascript
let filter = 'all'; // 'all' | 'active' | 'completed'

function getFilteredTodos() {
  switch (filter) {
    case 'active': return todos.filter(t => !t.done);
    case 'completed': return todos.filter(t => t.done);
    default: return todos;
  }
}
```

---

## Challenge 2: Due Dates
**Time:** 20 min | **Difficulty:** Medium

Add due date picker, show overdue items in red.

---

## Challenge 3: Drag to Reorder
**Time:** 25 min | **Difficulty:** Hard

Allow reordering todos by dragging.

```javascript
// HTML5 Drag API basics
item.draggable = true;
item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', id);
});
list.addEventListener('drop', (e) => {
  const fromId = e.dataTransfer.getData('text/plain');
  const toId = e.target.closest('.todo-item').dataset.id;
  reorder(fromId, toId);
});
```

---

## Challenge 4: Undo Delete
**Time:** 15 min | **Difficulty:** Medium

Show "Undo" toast after deleting, restore if clicked within 5 seconds.

---

## Challenge 5: Priority Levels
**Time:** 15 min | **Difficulty:** Easy

Add High/Medium/Low priority, sort by priority.

---

## Interview Q&A

### Beginner Level

**Q: Why use `Date.now()` for IDs?**
> Generates unique timestamps. For multiple items per millisecond, use `crypto.randomUUID()` instead.

**Q: Why `JSON.stringify` before saving to localStorage?**
> localStorage only stores strings. Objects must be serialized.

---

### Intermediate Level

**Q: What's the difference between `localStorage` and `sessionStorage`?**
> localStorage persists forever, sessionStorage clears when tab closes. Both have ~5MB limit.

**Q: How do you handle the 5MB storage limit?**
> Check for `QuotaExceededError` in catch block. Could compress data, use IndexedDB for larger storage, or sync to server.

**Q: Why not use array index as todo ID?**
> Index changes when items are deleted or reordered. A todo at index 2 becomes index 1 if you delete index 0. Stable IDs prevent bugs.

---

### Senior Level

**Q: How would you implement optimistic updates?**
```javascript
function deleteTodo(id) {
  const backup = [...todos];
  todos = todos.filter(t => t.id !== id);
  render();  // Show immediately
  
  api.delete(id).catch(() => {
    todos = backup;  // Rollback on failure
    render();
    showError('Failed to delete');
  });
}
```

**Q: How would you structure this for a large app?**
> Separate into: Store (state + mutations), View (render), Controller (event handlers). Or use patterns like Flux/Redux for unidirectional data flow.

**Q: How would you test this?**
```javascript
// Unit test
test('addTodo adds to array', () => {
  const app = TodoApp.create({...});
  app.add('Test');
  expect(app.getTodos()).toHaveLength(1);
});

// Integration test
test('persists to localStorage', () => {
  app.add('Test');
  const stored = JSON.parse(localStorage.getItem('todos'));
  expect(stored[0].text).toBe('Test');
});
```

---

## Self-Assessment

- [ ] Implement CRUD operations
- [ ] Use localStorage with error handling
- [ ] Apply event delegation for list actions
- [ ] Escape HTML to prevent XSS
- [ ] Handle inline editing with Enter/Escape
- [ ] Show stats (items left, clear completed)
- [ ] Make accessible (labels, keyboard support)

---

## Next Steps

Move to **04-event-delegation** - deep dive into event bubbling and capture, asked in almost every JS interview.

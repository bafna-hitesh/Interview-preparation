# Todo App - Key Learnings

> Classic interview question - tests CRUD, state management, persistence

---

## Core Concepts

### 1. CRUD Operations

```javascript
// CREATE
function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
}

// READ - just iterate todos array

// UPDATE
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
}

// DELETE
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
}
```

**Interview Point:** "Using `find` for single item, `filter` for removal. Both return new references, important for React-style immutability."

---

### 2. LocalStorage

```javascript
// SAVE
localStorage.setItem('todos', JSON.stringify(todos));

// LOAD with error handling
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem('todos')) || [];
  } catch {
    return [];
  }
}
```

**Interview Point:** "Always wrap JSON.parse in try-catch. Corrupted data shouldn't crash the app."

---

### 3. Event Delegation

```javascript
// Single listener handles all todo actions
list.addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;
  
  const id = item.dataset.id;
  
  if (e.target.classList.contains('todo-checkbox')) toggleTodo(id);
  if (e.target.classList.contains('todo-delete')) deleteTodo(id);
  if (e.target.classList.contains('todo-edit')) editTodo(id);
});
```

**Interview Point:** "Event delegation means one listener instead of n listeners. Also handles dynamically added items automatically."

---

### 4. XSS Prevention

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Usage
list.innerHTML = todos.map(t => `<span>${escapeHtml(t.text)}</span>`).join('');
```

**Interview Point:** "Never insert user input directly into HTML. The user could enter `<script>alert('xss')</script>`."

---

### 5. Inline Editing Pattern

```javascript
function startEditing(item, id) {
  const textSpan = item.querySelector('.todo-text');
  const input = document.createElement('input');
  input.value = currentText;
  
  textSpan.replaceWith(input);
  input.focus();
  
  input.addEventListener('blur', () => saveEdit(id, input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEdit(id, input.value);
    if (e.key === 'Escape') cancelEdit();
  });
}
```

---

## State Management Pattern

```javascript
let todos = [];

function render() {
  list.innerHTML = todos.map(renderTodo).join('');
  updateStats();
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  saveToStorage();
  render();  // Re-render after any state change
}
```

**Interview Point:** "Single source of truth pattern - all changes flow through state, then re-render. This is what React does under the hood."

---

## What Interviewers Look For

| Good | Bad |
|------|-----|
| Event delegation | Listener per item |
| XSS escaping | Direct innerHTML insertion |
| Error handling on storage | Assuming storage works |
| Unique IDs (timestamp or UUID) | Array index as ID |
| Accessible (labels, keyboard) | Mouse-only |

---

## Common Follow-up Questions

**Q: What if localStorage is full?**
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Handle storage limit
  }
}
```

**Q: How would you sync across tabs?**
```javascript
window.addEventListener('storage', (e) => {
  if (e.key === 'todos') {
    todos = JSON.parse(e.newValue);
    render();
  }
});
```

**Q: How would you add drag-to-reorder?**
- Use HTML5 Drag and Drop API
- Or touch-friendly library like SortableJS
- Update array order on drop, save to storage

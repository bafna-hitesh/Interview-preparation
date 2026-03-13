/**
 * Todo App - Senior Developer Solution
 * 
 * Classic interview question demonstrating:
 * CRUD operations, LocalStorage, Event Delegation, State Management
 */

const TodoApp = (function() {
  'use strict';

  const STORAGE_KEY = 'todos';

  function create(options) {
    const { formSelector, listSelector, onUpdate } = options;
    
    const form = document.querySelector(formSelector);
    const list = document.querySelector(listSelector);
    const input = form.querySelector('input[type="text"]');
    
    let todos = [];

    // ============ STORAGE ============
    function loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        todos = stored ? JSON.parse(stored) : [];
      } catch {
        todos = [];
      }
    }

    function saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // ============ CRUD OPERATIONS ============
    function addTodo(text) {
      if (!text.trim()) return;
      
      const todo = {
        id: Date.now().toString(),
        text: text.trim(),
        done: false,
        createdAt: new Date().toISOString()
      };
      
      todos.push(todo);
      saveToStorage();
      render();
    }

    function toggleTodo(id) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
        saveToStorage();
        render();
      }
    }

    function deleteTodo(id) {
      todos = todos.filter(t => t.id !== id);
      saveToStorage();
      render();
    }

    function editTodo(id, newText) {
      const todo = todos.find(t => t.id === id);
      if (todo && newText.trim()) {
        todo.text = newText.trim();
        saveToStorage();
        render();
      }
    }

    function clearCompleted() {
      todos = todos.filter(t => !t.done);
      saveToStorage();
      render();
    }

    // ============ RENDER ============
    function render() {
      if (todos.length === 0) {
        list.innerHTML = '<li class="empty">No todos yet. Add one above!</li>';
      } else {
        list.innerHTML = todos.map(todo => `
          <li class="todo-item ${todo.done ? 'done' : ''}" data-id="${todo.id}">
            <input type="checkbox" 
                   class="todo-checkbox" 
                   ${todo.done ? 'checked' : ''}
                   aria-label="Mark ${todo.text} as ${todo.done ? 'incomplete' : 'complete'}">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-edit" aria-label="Edit ${todo.text}">Edit</button>
            <button class="todo-delete" aria-label="Delete ${todo.text}">×</button>
          </li>
        `).join('');
      }

      updateStats();
      if (onUpdate) onUpdate(todos);
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function updateStats() {
      const stats = document.querySelector('.todo-stats');
      if (!stats) return;
      
      const total = todos.length;
      const completed = todos.filter(t => t.done).length;
      const remaining = total - completed;
      
      stats.innerHTML = `
        <span>${remaining} item${remaining !== 1 ? 's' : ''} left</span>
        ${completed > 0 ? '<button class="clear-completed">Clear completed</button>' : ''}
      `;
    }

    // ============ EVENT HANDLERS ============
    function handleSubmit(e) {
      e.preventDefault();
      addTodo(input.value);
      form.reset();
      input.focus();
    }

    function handleListClick(e) {
      const item = e.target.closest('.todo-item');
      if (!item) return;
      
      const id = item.dataset.id;

      if (e.target.classList.contains('todo-checkbox')) {
        toggleTodo(id);
      } else if (e.target.classList.contains('todo-delete')) {
        deleteTodo(id);
      } else if (e.target.classList.contains('todo-edit')) {
        startEditing(item, id);
      }
    }

    function handleStatsClick(e) {
      if (e.target.classList.contains('clear-completed')) {
        clearCompleted();
      }
    }

    function startEditing(item, id) {
      const textSpan = item.querySelector('.todo-text');
      const currentText = todos.find(t => t.id === id)?.text || '';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-edit-input';
      input.value = currentText;
      
      textSpan.replaceWith(input);
      input.focus();
      input.select();

      function finishEditing() {
        editTodo(id, input.value);
      }

      input.addEventListener('blur', finishEditing);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEditing();
        if (e.key === 'Escape') render();
      });
    }

    // ============ INIT ============
    function init() {
      loadFromStorage();
      render();

      form.addEventListener('submit', handleSubmit);
      list.addEventListener('click', handleListClick);
      
      const stats = document.querySelector('.todo-stats');
      if (stats) stats.addEventListener('click', handleStatsClick);
    }

    init();

    return {
      add: addTodo,
      toggle: toggleTodo,
      delete: deleteTodo,
      edit: editTodo,
      clearCompleted,
      getTodos: () => [...todos]
    };
  }

  return { create };
})();

// ============ USAGE ============
document.addEventListener('DOMContentLoaded', () => {
  TodoApp.create({
    formSelector: '.todo-form',
    listSelector: '.todo-list'
  });
});

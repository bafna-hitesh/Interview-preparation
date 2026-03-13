/**
 * Multi-Select (Shift+Click) - Senior Developer Solution
 * 
 * Gmail-like selection pattern - commonly asked in interviews
 * Demonstrates: State management, keyboard modifiers, range selection
 */

const MultiSelect = (function() {
  'use strict';

  function create(options) {
    const { containerSelector, itemSelector, onSelectionChange } = options;
    
    const container = document.querySelector(containerSelector);
    const state = {
      lastClickedIndex: null,
      selectedItems: new Set()
    };

    function getItems() {
      return Array.from(container.querySelectorAll(itemSelector));
    }

    function getItemIndex(item) {
      return getItems().indexOf(item);
    }

    // ============ SELECTION LOGIC ============
    function selectRange(fromIndex, toIndex) {
      const items = getItems();
      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);

      for (let i = start; i <= end; i++) {
        state.selectedItems.add(items[i]);
      }
    }

    function toggleSelection(item) {
      if (state.selectedItems.has(item)) {
        state.selectedItems.delete(item);
      } else {
        state.selectedItems.add(item);
      }
    }

    function clearSelection() {
      state.selectedItems.clear();
    }

    function selectAll() {
      getItems().forEach(item => state.selectedItems.add(item));
    }

    // ============ UI UPDATE ============
    function updateUI() {
      getItems().forEach(item => {
        const isSelected = state.selectedItems.has(item);
        item.classList.toggle('selected', isSelected);
        item.setAttribute('aria-selected', isSelected);
      });

      if (onSelectionChange) {
        onSelectionChange(Array.from(state.selectedItems));
      }
    }

    // ============ EVENT HANDLERS ============
    function handleClick(e) {
      const item = e.target.closest(itemSelector);
      if (!item) return;

      const currentIndex = getItemIndex(item);

      if (e.shiftKey && state.lastClickedIndex !== null) {
        selectRange(state.lastClickedIndex, currentIndex);
      } else if (e.ctrlKey || e.metaKey) {
        toggleSelection(item);
      } else {
        clearSelection();
        state.selectedItems.add(item);
      }

      state.lastClickedIndex = currentIndex;
      updateUI();
    }

    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
        updateUI();
      }
      
      if (e.key === 'Escape') {
        clearSelection();
        state.lastClickedIndex = null;
        updateUI();
      }
    }

    // ============ INIT ============
    function init() {
      container.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
      
      container.setAttribute('role', 'listbox');
      container.setAttribute('aria-multiselectable', 'true');
      getItems().forEach(item => {
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');
      });
    }

    init();

    return {
      getSelected: () => Array.from(state.selectedItems),
      selectAll,
      clearSelection: () => { clearSelection(); updateUI(); },
      destroy: () => {
        container.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }

  return { create };
})();

// ============ USAGE ============
document.addEventListener('DOMContentLoaded', () => {
  const selector = MultiSelect.create({
    containerSelector: '.email-list',
    itemSelector: '.email-item',
    onSelectionChange: (items) => {
      const count = items.length;
      document.querySelector('.selection-count').textContent = 
        count ? `${count} selected` : 'No items selected';
    }
  });

  document.querySelector('.select-all')?.addEventListener('click', selector.selectAll);
  document.querySelector('.clear-selection')?.addEventListener('click', selector.clearSelection);
});

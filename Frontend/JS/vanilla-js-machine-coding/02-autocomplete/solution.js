/**
 * Autocomplete/Type Ahead - Senior Developer Solution
 * 
 * THE #1 MOST ASKED MACHINE CODING QUESTION
 * 
 * Demonstrates: Debounce, Fetch with AbortController, Keyboard Navigation,
 * Highlight Matching Text, Accessibility, Loading States
 */

const Autocomplete = (function() {
  'use strict';

  const CONFIG = {
    debounceMs: 300,
    minChars: 2,
    maxResults: 10,
    keys: {
      UP: 'ArrowUp',
      DOWN: 'ArrowDown',
      ENTER: 'Enter',
      ESCAPE: 'Escape'
    }
  };

  function create(options) {
    const {
      inputSelector,
      resultsSelector,
      fetchData,
      onSelect,
      renderItem
    } = options;

    const input = document.querySelector(inputSelector);
    const results = document.querySelector(resultsSelector);
    
    let state = {
      data: [],
      filteredData: [],
      selectedIndex: -1,
      isOpen: false,
      abortController: null
    };

    // ============ DEBOUNCE ============
    function debounce(fn, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    // ============ FETCH WITH ABORT ============
    async function fetchResults(query) {
      if (state.abortController) {
        state.abortController.abort();
      }
      state.abortController = new AbortController();

      try {
        showLoading();
        const data = await fetchData(query, state.abortController.signal);
        state.filteredData = data.slice(0, CONFIG.maxResults);
        render();
      } catch (err) {
        if (err.name !== 'AbortError') {
          showError('Failed to fetch results');
        }
      }
    }

    // ============ HIGHLIGHT MATCHING TEXT ============
    function highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ============ RENDER ============
    function render() {
      if (state.filteredData.length === 0) {
        results.innerHTML = '<li class="no-results">No results found</li>';
        open();
        return;
      }

      const query = input.value;
      results.innerHTML = state.filteredData.map((item, index) => {
        const isSelected = index === state.selectedIndex;
        const html = renderItem 
          ? renderItem(item, query, highlightMatch) 
          : `<span>${highlightMatch(String(item), query)}</span>`;
        
        return `
          <li role="option" 
              data-index="${index}" 
              class="${isSelected ? 'selected' : ''}"
              aria-selected="${isSelected}">
            ${html}
          </li>
        `;
      }).join('');
      
      open();
    }

    function showLoading() {
      results.innerHTML = '<li class="loading">Loading...</li>';
      open();
    }

    function showError(message) {
      results.innerHTML = `<li class="error">${message}</li>`;
      open();
    }

    // ============ KEYBOARD NAVIGATION ============
    function handleKeyDown(e) {
      if (!state.isOpen) return;

      switch (e.key) {
        case CONFIG.keys.DOWN:
          e.preventDefault();
          state.selectedIndex = Math.min(
            state.selectedIndex + 1, 
            state.filteredData.length - 1
          );
          updateSelection();
          break;
          
        case CONFIG.keys.UP:
          e.preventDefault();
          state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
          updateSelection();
          break;
          
        case CONFIG.keys.ENTER:
          e.preventDefault();
          if (state.selectedIndex >= 0) {
            selectItem(state.selectedIndex);
          }
          break;
          
        case CONFIG.keys.ESCAPE:
          close();
          break;
      }
    }

    function updateSelection() {
      results.querySelectorAll('li').forEach((li, index) => {
        const isSelected = index === state.selectedIndex;
        li.classList.toggle('selected', isSelected);
        li.setAttribute('aria-selected', isSelected);
        if (isSelected) {
          li.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    // ============ SELECTION ============
    function selectItem(index) {
      const item = state.filteredData[index];
      if (item && onSelect) {
        onSelect(item);
      }
      close();
    }

    function handleResultClick(e) {
      const li = e.target.closest('li[data-index]');
      if (li) {
        selectItem(parseInt(li.dataset.index, 10));
      }
    }

    // ============ OPEN/CLOSE ============
    function open() {
      state.isOpen = true;
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function close() {
      state.isOpen = false;
      state.selectedIndex = -1;
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }

    // ============ INPUT HANDLER ============
    const debouncedFetch = debounce((query) => {
      if (query.length < CONFIG.minChars) {
        state.filteredData = [];
        close();
        return;
      }
      fetchResults(query);
    }, CONFIG.debounceMs);

    function handleInput(e) {
      debouncedFetch(e.target.value.trim());
    }

    // ============ INIT ============
    function init() {
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('focus', () => {
        if (state.filteredData.length > 0) open();
      });
      
      results.addEventListener('click', handleResultClick);
      
      document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
          close();
        }
      });

      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-autocomplete', 'list');
      results.setAttribute('role', 'listbox');
    }

    function destroy() {
      if (state.abortController) {
        state.abortController.abort();
      }
    }

    init();

    return { destroy };
  }

  return { create };
})();

// ============ USAGE EXAMPLE ============
document.addEventListener('DOMContentLoaded', () => {
  const CITIES_ENDPOINT = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
  
  let citiesCache = null;

  async function fetchCities(query, signal) {
    if (!citiesCache) {
      const response = await fetch(CITIES_ENDPOINT, { signal });
      citiesCache = await response.json();
    }
    
    const regex = new RegExp(query, 'gi');
    return citiesCache.filter(place => 
      place.city.match(regex) || place.state.match(regex)
    );
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  Autocomplete.create({
    inputSelector: '.search',
    resultsSelector: '.suggestions',
    fetchData: fetchCities,
    onSelect: (city) => {
      document.querySelector('.search').value = `${city.city}, ${city.state}`;
    },
    renderItem: (city, query, highlight) => `
      <span class="name">${highlight(city.city, query)}, ${highlight(city.state, query)}</span>
      <span class="population">${numberWithCommas(city.population)}</span>
    `
  });
});

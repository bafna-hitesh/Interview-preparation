/**
 * Infinite Scroll - Senior Developer Solution
 * 
 * Demonstrates: Intersection Observer, Lazy Loading, Throttle,
 * Loading States, Error Handling
 */

const InfiniteScroll = (function() {
  'use strict';

  function create(options) {
    const {
      containerSelector,
      sentinelSelector,
      fetchData,
      renderItem,
      pageSize = 10
    } = options;

    const container = document.querySelector(containerSelector);
    const sentinel = document.querySelector(sentinelSelector);
    
    let state = {
      page: 1,
      loading: false,
      hasMore: true,
      observer: null
    };

    // ============ INTERSECTION OBSERVER ============
    function initObserver() {
      state.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !state.loading && state.hasMore) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0
        }
      );
      
      state.observer.observe(sentinel);
    }

    // ============ LOADING LOGIC ============
    async function loadMore() {
      if (state.loading || !state.hasMore) return;
      
      state.loading = true;
      showLoading();

      try {
        const items = await fetchData(state.page, pageSize);
        
        if (items.length < pageSize) {
          state.hasMore = false;
          showEndMessage();
        }

        if (items.length > 0) {
          appendItems(items);
          state.page++;
        }
      } catch (error) {
        showError(error.message);
      } finally {
        state.loading = false;
        hideLoading();
      }
    }

    function appendItems(items) {
      const fragment = document.createDocumentFragment();
      
      items.forEach(item => {
        const element = renderItem(item);
        fragment.appendChild(element);
      });
      
      container.insertBefore(fragment, sentinel);
    }

    // ============ UI STATES ============
    function showLoading() {
      sentinel.innerHTML = '<div class="loading-spinner">Loading...</div>';
      sentinel.classList.add('loading');
    }

    function hideLoading() {
      sentinel.classList.remove('loading');
      if (state.hasMore) {
        sentinel.innerHTML = '';
      }
    }

    function showError(message) {
      sentinel.innerHTML = `
        <div class="error">
          <p>${message}</p>
          <button class="retry-btn">Retry</button>
        </div>
      `;
      sentinel.querySelector('.retry-btn')?.addEventListener('click', loadMore);
    }

    function showEndMessage() {
      sentinel.innerHTML = '<div class="end-message">No more items</div>';
      state.observer?.disconnect();
    }

    // ============ PUBLIC API ============
    function init() {
      initObserver();
      loadMore();
    }

    function reset() {
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      container.querySelectorAll('.item').forEach(el => el.remove());
      sentinel.innerHTML = '';
      
      if (!state.observer) {
        initObserver();
      }
      
      loadMore();
    }

    function destroy() {
      state.observer?.disconnect();
      state.observer = null;
    }

    init();

    return { reset, destroy, loadMore };
  }

  return { create };
})();

// ============ USAGE EXAMPLE ============
document.addEventListener('DOMContentLoaded', () => {
  let totalItems = 50;

  async function mockFetch(page, pageSize) {
    await new Promise(r => setTimeout(r, 800));
    
    const start = (page - 1) * pageSize;
    if (start >= totalItems) return [];
    
    const items = [];
    for (let i = start; i < Math.min(start + pageSize, totalItems); i++) {
      items.push({
        id: i + 1,
        title: `Item ${i + 1}`,
        description: `This is the description for item ${i + 1}`,
        image: `https://picsum.photos/seed/${i + 1}/300/200`
      });
    }
    return items;
  }

  function renderCard(item) {
    const card = document.createElement('div');
    card.className = 'item card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    return card;
  }

  const scroller = InfiniteScroll.create({
    containerSelector: '.items-container',
    sentinelSelector: '.sentinel',
    fetchData: mockFetch,
    renderItem: renderCard,
    pageSize: 10
  });

  document.querySelector('.reset-btn')?.addEventListener('click', scroller.reset);
});

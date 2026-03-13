# Infinite Scroll - Key Learnings

---

## Intersection Observer vs Scroll Event

```javascript
// OLD WAY - Scroll event (inefficient)
window.addEventListener('scroll', throttle(() => {
  const scrolledToBottom = 
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (scrolledToBottom) loadMore();
}, 100));

// MODERN WAY - Intersection Observer (efficient)
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) loadMore();
}, { rootMargin: '100px' });

observer.observe(sentinelElement);
```

**Interview Point:** "Intersection Observer is handled by the browser off the main thread. Scroll events fire 60+ times per second and block rendering."

---

## Intersection Observer API

```javascript
const observer = new IntersectionObserver(callback, {
  root: null,           // null = viewport, or specific element
  rootMargin: '100px',  // Trigger 100px before entering viewport
  threshold: 0          // 0 = any pixel visible, 1 = fully visible
});

observer.observe(element);    // Start watching
observer.unobserve(element);  // Stop watching one
observer.disconnect();        // Stop watching all
```

---

## Sentinel Pattern

Instead of calculating scroll position, watch a "sentinel" element at the bottom.

```html
<div class="items-container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <!-- New items inserted before sentinel -->
  <div class="sentinel"></div>  <!-- Observer watches this -->
</div>
```

```javascript
container.insertBefore(newItem, sentinel);  // Always stays at bottom
```

---

## Preventing Double Loading

```javascript
let loading = false;

async function loadMore() {
  if (loading) return;  // Already loading
  loading = true;
  
  try {
    const items = await fetchData();
    renderItems(items);
  } finally {
    loading = false;
  }
}
```

---

## Performance: Document Fragment

```javascript
function appendItems(items) {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    fragment.appendChild(createItemElement(item));
  });
  
  container.appendChild(fragment);  // Single reflow
}
```

**Interview Point:** "DocumentFragment batches DOM insertions into a single reflow instead of one per item."

---

## Lazy Loading Images

```html
<img src="image.jpg" loading="lazy">
```

Or with Intersection Observer for more control:

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

---

## Key States to Handle

| State | UI |
|-------|-----|
| Loading | Spinner at bottom |
| Error | Error message + Retry button |
| Empty | "No items found" |
| End | "No more items" + stop observer |
| Initial | Load first page |

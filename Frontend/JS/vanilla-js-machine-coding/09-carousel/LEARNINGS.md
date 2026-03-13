# Carousel/Slider - Key Learnings

---

## CSS Transform for Sliding

```javascript
const slideWidth = slides[0].offsetWidth;
const translateX = -currentIndex * slideWidth;
track.style.transform = `translateX(${translateX}px)`;
```

**Interview Point:** "transform is GPU-accelerated and doesn't trigger layout. Much better than changing left/margin."

---

## Drag to Slide

```javascript
let isDragging = false;
let startX = 0;
let currentTranslate = 0;

function dragStart(e) {
  isDragging = true;
  startX = e.pageX;
  track.style.transition = 'none';
}

function drag(e) {
  if (!isDragging) return;
  const diff = e.pageX - startX;
  currentTranslate = prevTranslate + diff;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd() {
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  
  if (movedBy < -threshold) next();
  else if (movedBy > threshold) prev();
  else goToSlide(currentIndex);
}
```

---

## Touch Support

```javascript
function getPositionX(e) {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

track.addEventListener('touchstart', dragStart, { passive: true });
track.addEventListener('touchmove', drag, { passive: true });
track.addEventListener('touchend', dragEnd);
```

**Interview Point:** "Use `{ passive: true }` for touch events for better scroll performance."

---

## Infinite Loop

```javascript
function goToSlide(index) {
  // Wrap around: -1 becomes last, length becomes 0
  currentIndex = ((index % slideCount) + slideCount) % slideCount;
}
```

---

## Auto-play with Pause on Hover

```javascript
let timer;

function startAutoPlay() {
  timer = setInterval(next, 3000);
}

function stopAutoPlay() {
  clearInterval(timer);
}

container.addEventListener('mouseenter', stopAutoPlay);
container.addEventListener('mouseleave', startAutoPlay);
```

---

## Performance: requestAnimationFrame

```javascript
function animation() {
  if (isDragging) {
    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animation);
  }
}
```

**Interview Point:** "rAF syncs with browser refresh rate (60fps). Smoother than updating in mousemove directly."

/**
 * Carousel/Slider - Senior Developer Solution
 * 
 * Demonstrates: Drag Events, Touch Support, Momentum Scrolling,
 * CSS Transforms, Navigation Dots, Auto-play
 */

const Carousel = (function() {
  'use strict';

  function create(options) {
    const {
      containerSelector,
      autoPlay = false,
      autoPlayInterval = 3000,
      infinite = true
    } = options;

    const container = document.querySelector(containerSelector);
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dotsContainer = container.querySelector('.carousel-dots');

    let state = {
      currentIndex: 0,
      isDragging: false,
      startX: 0,
      currentTranslate: 0,
      prevTranslate: 0,
      animationId: null,
      autoPlayTimer: null
    };

    const slideWidth = () => slides[0].offsetWidth;
    const slideCount = slides.length;

    // ============ NAVIGATION ============
    function goToSlide(index, animate = true) {
      if (infinite) {
        state.currentIndex = ((index % slideCount) + slideCount) % slideCount;
      } else {
        state.currentIndex = Math.max(0, Math.min(index, slideCount - 1));
      }

      const translateX = -state.currentIndex * slideWidth();
      state.currentTranslate = translateX;
      state.prevTranslate = translateX;

      track.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
      track.style.transform = `translateX(${translateX}px)`;

      updateDots();
      updateButtons();
    }

    function next() {
      goToSlide(state.currentIndex + 1);
    }

    function prev() {
      goToSlide(state.currentIndex - 1);
    }

    // ============ DOTS ============
    function createDots() {
      if (!dotsContainer) return;
      
      dotsContainer.innerHTML = slides.map((_, i) => 
        `<button class="carousel-dot ${i === 0 ? 'active' : ''}" 
                 data-index="${i}" 
                 aria-label="Go to slide ${i + 1}"></button>`
      ).join('');

      dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.carousel-dot');
        if (dot) goToSlide(parseInt(dot.dataset.index));
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === state.currentIndex);
      });
    }

    function updateButtons() {
      if (!infinite) {
        prevBtn?.classList.toggle('disabled', state.currentIndex === 0);
        nextBtn?.classList.toggle('disabled', state.currentIndex === slideCount - 1);
      }
    }

    // ============ DRAG/TOUCH ============
    function getPositionX(e) {
      return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function dragStart(e) {
      state.isDragging = true;
      state.startX = getPositionX(e);
      state.animationId = requestAnimationFrame(animation);
      track.style.transition = 'none';
      track.style.cursor = 'grabbing';
      
      stopAutoPlay();
    }

    function drag(e) {
      if (!state.isDragging) return;
      
      const currentX = getPositionX(e);
      const diff = currentX - state.startX;
      state.currentTranslate = state.prevTranslate + diff;
    }

    function dragEnd() {
      state.isDragging = false;
      cancelAnimationFrame(state.animationId);
      track.style.cursor = 'grab';

      const movedBy = state.currentTranslate - state.prevTranslate;
      const threshold = slideWidth() / 4;

      if (movedBy < -threshold) {
        next();
      } else if (movedBy > threshold) {
        prev();
      } else {
        goToSlide(state.currentIndex);
      }

      if (autoPlay) startAutoPlay();
    }

    function animation() {
      if (state.isDragging) {
        track.style.transform = `translateX(${state.currentTranslate}px)`;
        state.animationId = requestAnimationFrame(animation);
      }
    }

    // ============ AUTO-PLAY ============
    function startAutoPlay() {
      if (!autoPlay) return;
      stopAutoPlay();
      state.autoPlayTimer = setInterval(next, autoPlayInterval);
    }

    function stopAutoPlay() {
      if (state.autoPlayTimer) {
        clearInterval(state.autoPlayTimer);
        state.autoPlayTimer = null;
      }
    }

    // ============ KEYBOARD ============
    function handleKeydown(e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }

    // ============ RESIZE ============
    function handleResize() {
      goToSlide(state.currentIndex, false);
    }

    // ============ INIT ============
    function init() {
      createDots();
      updateButtons();

      track.addEventListener('mousedown', dragStart);
      track.addEventListener('mousemove', drag);
      track.addEventListener('mouseup', dragEnd);
      track.addEventListener('mouseleave', () => state.isDragging && dragEnd());

      track.addEventListener('touchstart', dragStart, { passive: true });
      track.addEventListener('touchmove', drag, { passive: true });
      track.addEventListener('touchend', dragEnd);

      prevBtn?.addEventListener('click', prev);
      nextBtn?.addEventListener('click', next);

      container.addEventListener('keydown', handleKeydown);
      container.setAttribute('tabindex', '0');

      container.addEventListener('mouseenter', stopAutoPlay);
      container.addEventListener('mouseleave', startAutoPlay);

      window.addEventListener('resize', handleResize);

      if (autoPlay) startAutoPlay();
    }

    init();

    return {
      next,
      prev,
      goTo: goToSlide,
      destroy: () => {
        stopAutoPlay();
        window.removeEventListener('resize', handleResize);
      }
    };
  }

  return { create };
})();

document.addEventListener('DOMContentLoaded', () => {
  Carousel.create({
    containerSelector: '.carousel',
    autoPlay: true,
    autoPlayInterval: 4000,
    infinite: true
  });
});

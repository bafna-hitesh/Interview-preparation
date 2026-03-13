/**
 * Drum Kit - Senior Developer Solution
 * 
 * Demonstrates: Module Pattern, Event Delegation, Factory Pattern,
 * Strategy Pattern, Proper Cleanup, Accessibility
 */

const DrumKit = (function() {
  'use strict';

  // ============ CONFIGURATION ============
  const CONFIG = {
    selectors: {
      container: '.keys',
      key: '.key',
      audio: 'audio[data-key]'
    },
    classes: {
      playing: 'playing'
    },
    transitionProperty: 'transform'
  };

  // ============ STATE ============
  const state = {
    initialized: false,
    keys: new Map(),
    abortController: null
  };

  // ============ FACTORY: Create Key Instance ============
  function createKey(element) {
    const keyCode = element.dataset.key;
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
    
    return {
      keyCode,
      element,
      audio,
      
      play() {
        if (!this.audio) return;
        this.element.classList.add(CONFIG.classes.playing);
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      },
      
      reset() {
        this.element.classList.remove(CONFIG.classes.playing);
      }
    };
  }

  // ============ CORE HANDLERS ============
  function handleKeyDown(e) {
    if (e.repeat) return;
    const key = state.keys.get(e.code);
    if (key) key.play();
  }

  function handleClick(e) {
    const keyElement = e.target.closest(CONFIG.selectors.key);
    if (!keyElement) return;
    const key = state.keys.get(keyElement.dataset.key);
    if (key) key.play();
  }

  function handleTransitionEnd(e) {
    if (e.propertyName !== CONFIG.transitionProperty) return;
    const keyElement = e.target.closest(CONFIG.selectors.key);
    if (!keyElement) return;
    const key = state.keys.get(keyElement.dataset.key);
    if (key) key.reset();
  }

  // ============ INITIALIZATION ============
  function init(containerSelector = CONFIG.selectors.container) {
    if (state.initialized) {
      console.warn('DrumKit already initialized');
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container not found:', containerSelector);
      return;
    }

    state.abortController = new AbortController();
    const { signal } = state.abortController;

    document.querySelectorAll(CONFIG.selectors.key).forEach(element => {
      const key = createKey(element);
      state.keys.set(key.keyCode, key);
      state.keys.set(element.dataset.key, key);
    });

    window.addEventListener('keydown', handleKeyDown, { signal });
    container.addEventListener('click', handleClick, { signal });
    container.addEventListener('transitionend', handleTransitionEnd, { signal });

    state.initialized = true;
  }

  function destroy() {
    if (!state.initialized) return;
    
    state.abortController?.abort();
    state.keys.clear();
    state.initialized = false;
  }

  // ============ PUBLIC API ============
  return {
    init,
    destroy,
    play(keyCode) {
      const key = state.keys.get(keyCode);
      if (key) key.play();
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => DrumKit.init());

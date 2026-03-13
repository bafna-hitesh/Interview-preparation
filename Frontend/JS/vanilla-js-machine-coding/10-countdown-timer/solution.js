/**
 * Countdown Timer - Senior Developer Solution
 * 
 * Demonstrates: setInterval, Date Math, Time Formatting,
 * Notification API, State Management
 */

const CountdownTimer = (function() {
  'use strict';

  function create(options) {
    const {
      displaySelector,
      endTimeSelector,
      buttonsSelector,
      customFormSelector,
      onComplete
    } = options;

    const display = document.querySelector(displaySelector);
    const endTimeDisplay = document.querySelector(endTimeSelector);
    const buttons = document.querySelectorAll(buttonsSelector);
    const customForm = document.querySelector(customFormSelector);

    let state = {
      intervalId: null,
      endTime: null,
      isPaused: false,
      remainingOnPause: 0
    };

    // ============ TIMER CORE ============
    function startTimer(seconds) {
      clearInterval(state.intervalId);
      
      const now = Date.now();
      state.endTime = now + seconds * 1000;
      state.isPaused = false;

      displayTimeLeft(seconds);
      displayEndTime(state.endTime);

      state.intervalId = setInterval(() => {
        const secondsLeft = Math.round((state.endTime - Date.now()) / 1000);

        if (secondsLeft < 0) {
          clearInterval(state.intervalId);
          displayTimeLeft(0);
          handleComplete();
          return;
        }

        displayTimeLeft(secondsLeft);
      }, 1000);
    }

    function pauseTimer() {
      if (state.isPaused || !state.intervalId) return;
      
      state.isPaused = true;
      state.remainingOnPause = Math.round((state.endTime - Date.now()) / 1000);
      clearInterval(state.intervalId);
      
      updatePauseButton(true);
    }

    function resumeTimer() {
      if (!state.isPaused) return;
      
      state.isPaused = false;
      startTimer(state.remainingOnPause);
      
      updatePauseButton(false);
    }

    function togglePause() {
      state.isPaused ? resumeTimer() : pauseTimer();
    }

    function stopTimer() {
      clearInterval(state.intervalId);
      state.intervalId = null;
      state.endTime = null;
      state.isPaused = false;
      
      displayTimeLeft(0);
      endTimeDisplay.textContent = '';
      updatePauseButton(false);
    }

    // ============ DISPLAY ============
    function displayTimeLeft(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      let displayText;
      if (hours > 0) {
        displayText = `${hours}:${pad(minutes)}:${pad(secs)}`;
      } else {
        displayText = `${minutes}:${pad(secs)}`;
      }

      display.textContent = displayText;
      document.title = displayText;

      display.classList.toggle('warning', seconds <= 10 && seconds > 0);
      display.classList.toggle('danger', seconds <= 5 && seconds > 0);
    }

    function displayEndTime(timestamp) {
      const end = new Date(timestamp);
      const hours = end.getHours();
      const minutes = end.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;

      endTimeDisplay.textContent = `Ends at ${displayHours}:${pad(minutes)} ${ampm}`;
    }

    function pad(num) {
      return num.toString().padStart(2, '0');
    }

    function updatePauseButton(isPaused) {
      const pauseBtn = document.querySelector('.pause-btn');
      if (pauseBtn) {
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      }
    }

    // ============ COMPLETION ============
    function handleComplete() {
      display.classList.remove('warning', 'danger');
      
      if (onComplete) onComplete();
      
      playSound();
      showNotification();
    }

    function playSound() {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleC0HA4');
        audio.play().catch(() => {});
      } catch {}
    }

    function showNotification() {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: 'Your countdown has finished.',
          icon: '⏰'
        });
      }
    }

    // ============ EVENT HANDLERS ============
    function handleButtonClick(e) {
      const seconds = parseInt(e.target.dataset.time);
      if (!isNaN(seconds)) {
        startTimer(seconds);
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const input = e.target.querySelector('input[name="minutes"]');
      const minutes = parseFloat(input.value);
      
      if (!isNaN(minutes) && minutes > 0) {
        startTimer(Math.round(minutes * 60));
        e.target.reset();
      }
    }

    // ============ INIT ============
    function init() {
      buttons.forEach(btn => btn.addEventListener('click', handleButtonClick));
      customForm?.addEventListener('submit', handleFormSubmit);

      document.querySelector('.pause-btn')?.addEventListener('click', togglePause);
      document.querySelector('.stop-btn')?.addEventListener('click', stopTimer);

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    init();

    return {
      start: startTimer,
      pause: pauseTimer,
      resume: resumeTimer,
      stop: stopTimer,
      toggle: togglePause
    };
  }

  return { create };
})();

document.addEventListener('DOMContentLoaded', () => {
  CountdownTimer.create({
    displaySelector: '.display-time',
    endTimeSelector: '.display-end-time',
    buttonsSelector: '[data-time]',
    customFormSelector: '.custom-time',
    onComplete: () => console.log('Timer complete!')
  });
});
